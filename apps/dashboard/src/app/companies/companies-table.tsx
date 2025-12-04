"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  MoreHorizontal,
  User,
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
import { readCompanies } from "./_utils/read-companies";
import {
  useUpdateCompany,
  useDeleteCompany,
} from "./_components/use-companies";
import type { CompanyType } from "@repo/db";

interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: CompanyType;
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

export function CompaniesTable() {
  const editCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  // Read URL query state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(40));

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () => new Set(["name", "email", "phone", "type", "createdAt"]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Company>(columnIds).withDefault([
      { id: "createdAt", desc: true },
    ])
  );

  // Read URL query state for filters
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [email] = useQueryState("email", parseAsString.withDefault(""));
  const [phone] = useQueryState("phone", parseAsString.withDefault(""));
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Fetch companies with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["companies", page, perPage, sort, name, email, phone, type],
    queryFn: () =>
      readCompanies({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        type: type.length > 0 ? type : undefined,
      }),
  });

  const companies = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<Company>[]>(
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
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<Company, unknown> }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Building2 className="size-4 text-muted-foreground" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
        meta: {
          label: "Name",
          placeholder: "Search companies...",
          variant: "text",
          icon: Building2,
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }: { column: Column<Company, unknown> }) => (
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
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: ({ column }: { column: Column<Company, unknown> }) => (
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
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }: { column: Column<Company, unknown> }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => (
          <Badge
            variant={getTypeBadgeVariant(cell.getValue<Company["type"]>())}
          >
            {cell.getValue<Company["type"]>()}
          </Badge>
        ),
        meta: {
          label: "Type",
          variant: "multiSelect",
          options: [
            { label: "Supplier", value: "SUPPLIER" },
            { label: "Client", value: "CLIENT" },
            { label: "Contractor", value: "CONTRACTOR" },
            { label: "Consultant", value: "CONSULTANT" },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<Company, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue<Company["createdAt"]>();
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
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const company = row.original;

          const handleEdit = () => {
            // TODO: Open edit modal or navigate to edit page
            // For now, you can implement the edit modal similar to add-company-modal
            console.log("Edit company:", company.id);
          };

          const handleDelete = () => {
            if (
              confirm(
                `Are you sure you want to delete company ${company.name}?`
              )
            ) {
              deleteCompany.mutate(company.id);
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
                  disabled={deleteCompany.isPending}
                >
                  {deleteCompany.isPending ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [deleteCompany]
  );

  const { table } = useDataTable({
    data: companies as Company[],
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
