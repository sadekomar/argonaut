"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  User,
  MoreHorizontal,
  UserCheck,
  Users,
  Briefcase,
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
import { readPeople } from "./_utils/read-people";
import { useDeletePerson } from "./_components/use-people";
import { UpdatePersonModal } from "./_components/update-person-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { useReadCompanies } from "@/app/companies/_components/use-companies";
import { mapToSelectOptions } from "@/lib/utils";

type PersonType = "AUTHOR" | "CONTACT_PERSON" | "INTERNAL";

interface Person {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: PersonType;
  companyId: string | null;
  company: {
    id: string;
    name: string;
  } | null;
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

const getTypeBadgeVariant = (type: PersonType) => {
  switch (type) {
    case "AUTHOR":
      return "default";
    case "CONTACT_PERSON":
      return "secondary";
    case "INTERNAL":
      return "outline";
    default:
      return "outline";
  }
};

export function PeopleTable() {
  const deletePerson = useDeletePerson();

  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () => new Set(["name", "email", "phone", "company", "type", "createdAt"]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Person>(columnIds).withDefault([
      { id: "createdAt", desc: true },
    ])
  );

  // Read URL query state for filters
  const [filters] = useQueryStates({
    name: parseAsString.withDefault(""),
    email: parseAsString.withDefault(""),
    phone: parseAsString.withDefault(""),
    company: parseAsArrayOf(parseAsString).withDefault([]),
    type: parseAsArrayOf(parseAsString).withDefault([]),
  });

  const { data: companies } = useReadCompanies();
  const companiesInitialOptions = mapToSelectOptions(companies?.data);

  // Fetch people with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["people", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readPeople({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        name: filters.name || undefined,
        email: filters.email || undefined,
        phone: filters.phone || undefined,
        company: filters.company.length > 0 ? filters.company : undefined,
        type: filters.type.length > 0 ? filters.type : undefined,
      }),
  });

  const people = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columnHelper = createColumnHelper<Person>();
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
    columnHelper.accessor("name", {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <User className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search names...",
        variant: "text",
        icon: User,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => {
        const email = row.original.email;
        if (!email) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Mail className="size-4 text-muted-foreground" />
            {email}
          </div>
        );
      },
      meta: {
        label: "Email",
        placeholder: "Search emails...",
        variant: "text",
        icon: Mail,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("phone", {
      id: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Phone" />
      ),
      cell: ({ row }) => {
        const phone = row.original.phone;
        if (!phone) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Phone className="size-4 text-muted-foreground" />
            {phone}
          </div>
        );
      },
      meta: {
        label: "Phone",
        placeholder: "Search phones...",
        variant: "text",
        icon: Phone,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor((row) => row.company?.name ?? "N/A", {
      id: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Company" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="size-4 text-muted-foreground" />
          {row.original.company?.name ?? "N/A"}
        </div>
      ),
      meta: {
        label: "Company",
        variant: "multiSelect",
        options: companiesInitialOptions,
        icon: Building2,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("type", {
      id: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ cell }) => {
        const type = cell.getValue<Person["type"]>();
        const typeConfig = {
          AUTHOR: {
            label: "Author",
            icon: UserCheck,
            variant: "default" as const,
          },
          CONTACT_PERSON: {
            label: "Contact Person",
            icon: Users,
            variant: "secondary" as const,
          },
          INTERNAL: {
            label: "Internal",
            icon: Briefcase,
            variant: "outline" as const,
          },
        };
        const config = typeConfig[type];
        const Icon = config.icon;

        return (
          <Badge variant={config.variant}>
            <Icon className="mr-1 size-3" />
            {config.label}
          </Badge>
        );
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: [
          { label: "Author", value: "AUTHOR", icon: UserCheck },
          { label: "Contact Person", value: "CONTACT_PERSON", icon: Users },
          { label: "Internal", value: "INTERNAL", icon: Briefcase },
        ],
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Person["createdAt"]>();
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
        const person = row.original;

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
                  setSelectedPerson(person);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedPerson(person);
                  setIsDeleteModalOpen(true);
                }}
                disabled={deletePerson.isPending}
              >
                {deletePerson.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    }),
  ];

  const { table } = useDataTable({
    data: people,
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

      {selectedPerson && (
        <UpdatePersonModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          person={selectedPerson}
        />
      )}

      {selectedPerson && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Person"
          description="Are you sure you want to delete this person? This action cannot be undone."
          deleteFunction={() => deletePerson.mutate(selectedPerson?.id ?? "")}
        />
      )}
    </div>
  );
}
