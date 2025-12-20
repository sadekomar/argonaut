"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Building2, Calendar, Mail, Phone, MoreHorizontal } from "lucide-react";
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
import { readCompanies } from "./_utils/read-companies";
import { useDeleteCompany } from "./_components/use-companies";
import { UpdateCompanyModal } from "./_components/update-company-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import type { CompanyType } from "@repo/db";
import Link from "next/link";

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
  const deleteCompany = useDeleteCompany();

  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

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
  const [filters] = useQueryStates({
    name: parseAsString.withDefault(""),
    email: parseAsString.withDefault(""),
    phone: parseAsString.withDefault(""),
    type: parseAsArrayOf(parseAsString).withDefault([]),
  });

  // Fetch companies with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["companies", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readCompanies({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        name: filters.name || undefined,
        email: filters.email || undefined,
        phone: filters.phone || undefined,
        type: filters.type.length > 0 ? filters.type : undefined,
      }),
  });

  const companies = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columnHelper = createColumnHelper<Company>();
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
    columnHelper.accessor("type", {
      id: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ cell }) => (
        <Badge variant={getTypeBadgeVariant(cell.getValue<Company["type"]>())}>
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
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: ({ column }) => (
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
    }),
    columnHelper.display({
      id: "actions",
      cell: function Cell({ row }) {
        const company = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer bg-gray-100 rounded-3xl border border-gray-200"
                size="icon"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  href={`/quotes?${company.type.toLowerCase()}=${company.id}`}
                >
                  View Quotes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCompany(company);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedCompany(company);
                  setIsDeleteModalOpen(true);
                }}
                disabled={deleteCompany.isPending}
              >
                {deleteCompany.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    }),
  ];

  const { table } = useDataTable({
    data: companies,
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

      {selectedCompany && (
        <UpdateCompanyModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          company={selectedCompany}
        />
      )}

      {selectedCompany && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Company"
          description="Are you sure you want to delete this company? This action cannot be undone."
          deleteFunction={() => deleteCompany.mutate(selectedCompany?.id ?? "")}
        />
      )}
    </div>
  );
}
