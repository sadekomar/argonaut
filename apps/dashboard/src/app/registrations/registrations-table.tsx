"use client";

import { createColumnHelper } from "@tanstack/react-table";
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
  Tag,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
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
  useUpdateRegistration,
  useDeleteRegistration,
} from "./_components/use-registrations";
import { UpdateRegistrationModal } from "./_components/update-registration-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import type { CompanyType } from "@repo/db";

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
    type: CompanyType;
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

const getTypeBadgeVariant = (type: CompanyType) => {
  switch (type) {
    case "SUPPLIER":
      return "default";
    case "CLIENT":
      return "secondary";
    case "CONTRACTOR":
      return "outline";
    case "CONSULTANT":
      return "outline";
    default:
      return "outline";
  }
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
  const deleteRegistration = useDeleteRegistration();

  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () =>
      new Set([
        "company",
        "companyType",
        "registrationStatus",
        "author",
        "createdAt",
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
  const [filters] = useQueryStates({
    company: parseAsString.withDefault(""),
    companyType: parseAsArrayOf(parseAsString).withDefault([]),
    registrationStatus: parseAsArrayOf(parseAsString).withDefault([]),
    author: parseAsString.withDefault(""),
  });

  // Fetch registrations with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["registrations", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readRegistrations({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        company: filters.company || undefined,
        companyType:
          filters.companyType.length > 0 ? filters.companyType : undefined,
        registrationStatus:
          filters.registrationStatus.length > 0
            ? filters.registrationStatus
            : undefined,
        author: filters.author || undefined,
      }),
  });

  const registrations = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columnHelper = createColumnHelper<Registration>();
  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    }),
    columnHelper.accessor((row) => row.company.name, {
      id: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Company" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.company.name}</span>
        </div>
      ),
      meta: {
        label: "Company",
        placeholder: "Search companies...",
        variant: "text",
        icon: Building2,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor((row) => row.company.type, {
      id: "companyType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Company Type" />
      ),
      cell: ({ row }) => {
        const type = row.original.company.type;
        return <Badge variant={getTypeBadgeVariant(type)}>{type}</Badge>;
      },
      meta: {
        label: "Company Type",
        variant: "multiSelect",
        options: [
          { label: "Supplier", value: "SUPPLIER" },
          { label: "Client", value: "CLIENT" },
          { label: "Contractor", value: "CONTRACTOR" },
          { label: "Consultant", value: "CONSULTANT" },
        ],
        icon: Tag,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("registrationStatus", {
      id: "registrationStatus",
      header: ({ column }) => (
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
    }),
    columnHelper.accessor((row) => row.author.name, {
      id: "author",
      header: ({ column }) => (
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
    }),
    columnHelper.accessor("registrationFile", {
      id: "registrationFile",
      header: ({ column }) => (
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
    }),
    columnHelper.accessor("notes", {
      id: "notes",
      header: ({ column }) => (
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
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: ({ column }) => (
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
        label: "Created At",
        variant: "date",
      },
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: "actions",
      cell: function Cell({ row }) {
        const registration = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRegistration(registration);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedRegistration(registration);
                  setIsDeleteModalOpen(true);
                }}
                disabled={deleteRegistration.isPending}
              >
                {deleteRegistration.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    }),
  ];

  const { table } = useDataTable({
    data: registrations,
    columns,
    pageCount,
    initialState: {
      pagination: {
        pageIndex: pagination.page - 1, // page is 1-based, pageIndex is 0-based
        pageSize: pagination.perPage,
      },
      sorting: sort,
      columnVisibility: {
        select: false,
      },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} />
        </DataTableToolbar>
      </DataTable>

      {selectedRegistration && (
        <UpdateRegistrationModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          registration={selectedRegistration}
        />
      )}

      {selectedRegistration && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Registration"
          description={`Are you sure you want to delete the registration for ${selectedRegistration.company.name}? This action cannot be undone.`}
          deleteFunction={() =>
            deleteRegistration.mutate(selectedRegistration?.id ?? "")
          }
        />
      )}
    </div>
  );
}
