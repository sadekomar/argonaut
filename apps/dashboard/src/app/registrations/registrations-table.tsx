"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  User,
  MoreHorizontal,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileCheck,
  Send,
  Pause,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { getSortingStateParser } from "@/lib/parsers";
import { readRegistrations } from "./_utils/read-registrations";
import {
  useEditRegistration,
  useDeleteRegistration,
} from "./_components/use-registrations";
import { UpdateRegistrationModal } from "./_components/update-registration-modal";

type RegistrationStatus =
  | "PURSUING"
  | "REQUIREMENTS_COLLECTED"
  | "DOCS_SENT"
  | "UNDER_REVIEW"
  | "PENDING_CONFIRMATION"
  | "VERIFIED"
  | "ON_HOLD"
  | "DECLINED";

interface Registration {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
  };
  registrationStatus: RegistrationStatus;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  registrationFile: string | null;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: RegistrationStatus) => {
  const statusConfig = {
    PURSUING: {
      icon: Clock,
      label: "Pursuing",
      className: "border-blue-500 text-blue-700 dark:text-blue-400",
    },
    REQUIREMENTS_COLLECTED: {
      icon: FileCheck,
      label: "Requirements Collected",
      className: "border-cyan-500 text-cyan-700 dark:text-cyan-400",
    },
    DOCS_SENT: {
      icon: Send,
      label: "Docs Sent",
      className: "border-purple-500 text-purple-700 dark:text-purple-400",
    },
    UNDER_REVIEW: {
      icon: AlertCircle,
      label: "Under Review",
      className: "border-yellow-500 text-yellow-700 dark:text-yellow-400",
    },
    PENDING_CONFIRMATION: {
      icon: Clock,
      label: "Pending Confirmation",
      className: "border-orange-500 text-orange-700 dark:text-orange-400",
    },
    VERIFIED: {
      icon: CheckCircle,
      label: "Verified",
      className: "border-green-500 text-green-700 dark:text-green-400",
    },
    ON_HOLD: {
      icon: Pause,
      label: "On Hold",
      className: "border-gray-500 text-gray-700 dark:text-gray-400",
    },
    DECLINED: {
      icon: XCircle,
      label: "Declined",
      className: "border-red-500 text-red-700 dark:text-red-400",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="mr-1 size-3" />
      {config.label}
    </Badge>
  );
};

export function RegistrationsTable() {
  const editRegistration = useEditRegistration();
  const deleteRegistration = useDeleteRegistration();
  const [editingRegistrationId, setEditingRegistrationId] = React.useState<
    string | null
  >(null);

  // Read URL query state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(40));

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () =>
      new Set([
        "company",
        "registrationStatus",
        "author",
        "registrationFile",
        "createdAt",
        "updatedAt",
      ]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Registration>(columnIds).withDefault([
      { id: "createdAt", desc: true },
    ])
  );

  // Read URL query state for filters
  const [company] = useQueryState("company", parseAsString.withDefault(""));
  const [registrationStatus] = useQueryState(
    "registrationStatus",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [author] = useQueryState("author", parseAsString.withDefault(""));
  const [createdAt] = useQueryState("createdAt", parseAsString);

  // Fetch registrations with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: [
      "registrations",
      page,
      perPage,
      sort,
      company,
      registrationStatus,
      author,
      createdAt,
    ],
    queryFn: () =>
      readRegistrations({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        company: company || undefined,
        registrationStatus:
          registrationStatus.length > 0 ? registrationStatus : undefined,
        author: author || undefined,
        createdAt: createdAt || undefined,
      }),
  });

  const registrations = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<Registration>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "company",
        accessorFn: (row) => row.company.name,
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Company" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Building2 className="size-4 text-muted-foreground" />
            {row.original.company.name}
          </div>
        ),
        meta: {
          label: "Company",
          placeholder: "Search companies...",
          variant: "text",
          icon: Building2,
        },
        enableColumnFilter: true,
      },
      {
        id: "registrationStatus",
        accessorKey: "registrationStatus",
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Registration["registrationStatus"]>();
          return getStatusBadge(status);
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Pursuing", value: "PURSUING", icon: Clock },
            {
              label: "Requirements Collected",
              value: "REQUIREMENTS_COLLECTED",
              icon: FileCheck,
            },
            { label: "Docs Sent", value: "DOCS_SENT", icon: Send },
            {
              label: "Under Review",
              value: "UNDER_REVIEW",
              icon: AlertCircle,
            },
            {
              label: "Pending Confirmation",
              value: "PENDING_CONFIRMATION",
              icon: Clock,
            },
            { label: "Verified", value: "VERIFIED", icon: CheckCircle },
            { label: "On Hold", value: "ON_HOLD", icon: Pause },
            { label: "Declined", value: "DECLINED", icon: XCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "author",
        accessorFn: (row) => row.author.name,
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Author" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <User className="size-4 text-muted-foreground" />
            {row.original.author.name}
          </div>
        ),
        meta: {
          label: "Author",
          placeholder: "Search authors...",
          variant: "text",
          icon: User,
        },
        enableColumnFilter: true,
      },
      {
        id: "registrationFile",
        accessorKey: "registrationFile",
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Registration File" />
        ),
        cell: ({ cell }) => {
          const file = cell.getValue<Registration["registrationFile"]>();
          if (!file) {
            return <span className="text-muted-foreground">N/A</span>;
          }
          return (
            <div className="flex items-center gap-1.5">
              <FileText className="size-4 text-muted-foreground" />
              <a
                href={`/api/upload/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View File
              </a>
            </div>
          );
        },
      },
      {
        id: "notes",
        accessorKey: "notes",
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Notes" />
        ),
        cell: ({ cell }) => {
          const notes = cell.getValue<Registration["notes"]>();
          if (!notes) {
            return <span className="text-muted-foreground">N/A</span>;
          }
          return (
            <div className="max-w-[200px] truncate" title={notes}>
              {notes}
            </div>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue<Registration["createdAt"]>();
          return (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground" />
              {formatDate(date)}
            </div>
          );
        },
        meta: {
          label: "Created Date",
          variant: "date",
        },
        enableColumnFilter: true,
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: ({ column }: { column: Column<Registration, unknown> }) => (
          <DataTableColumnHeader column={column} label="Updated" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue<Registration["updatedAt"]>();
          return (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground" />
              {formatDate(date)}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const registration = row.original;

          const handleEdit = () => {
            setEditingRegistrationId(registration.id);
          };

          const handleDelete = () => {
            if (
              confirm(
                `Are you sure you want to delete registration for ${registration.company.name}?`
              )
            ) {
              deleteRegistration.mutate(registration.id);
            }
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteRegistration.isPending}
                >
                  {deleteRegistration.isPending ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [deleteRegistration]
  );

  const { table } = useDataTable({
    data: registrations as Registration[],
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  // Sync URL query state filters to table's column filters
  const processFilterValue = React.useCallback(
    (value: string | string[] | null | undefined): string[] | undefined => {
      if (value === null || value === undefined) return undefined;
      if (Array.isArray(value)) return value;
      if (typeof value === "string" && /[^a-zA-Z0-9]/.test(value)) {
        return value.split(/[^a-zA-Z0-9]+/).filter(Boolean);
      }
      return [value];
    },
    []
  );

  React.useEffect(() => {
    const columnFilters: Array<{ id: string; value: string | string[] }> = [];

    const companyValue = processFilterValue(company || null);
    if (companyValue) {
      columnFilters.push({ id: "company", value: companyValue });
    }

    if (registrationStatus.length > 0) {
      columnFilters.push({
        id: "registrationStatus",
        value: registrationStatus,
      });
    }

    const authorValue = processFilterValue(author || null);
    if (authorValue) {
      columnFilters.push({ id: "author", value: authorValue });
    }

    const createdAtValue = processFilterValue(createdAt || null);
    if (createdAtValue) {
      columnFilters.push({ id: "createdAt", value: createdAtValue });
    }

    // Only update if filters have actually changed to avoid infinite loops
    const currentFilters = table.getState().columnFilters;
    const currentFiltersMap = new Map(
      currentFilters.map((f) => [f.id, JSON.stringify(f.value)])
    );
    const newFiltersMap = new Map(
      columnFilters.map((f) => [f.id, JSON.stringify(f.value)])
    );

    // Check if filters have changed
    const filtersChanged =
      currentFilters.length !== columnFilters.length ||
      Array.from(newFiltersMap.entries()).some(
        ([id, value]) => currentFiltersMap.get(id) !== value
      ) ||
      Array.from(currentFiltersMap.keys()).some((id) => !newFiltersMap.has(id));

    if (filtersChanged) {
      table.setColumnFilters(columnFilters);
    }
  }, [
    company,
    registrationStatus,
    author,
    createdAt,
    processFilterValue,
    table,
  ]);

  return (
    <>
      <div className="data-table-container">
        <DataTable table={table} isLoading={isLoading}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
      {editingRegistrationId && (
        <UpdateRegistrationModal
          open={!!editingRegistrationId}
          onOpenChange={(open) => {
            if (!open) {
              setEditingRegistrationId(null);
            }
          }}
          registrationId={editingRegistrationId}
        />
      )}
    </>
  );
}
