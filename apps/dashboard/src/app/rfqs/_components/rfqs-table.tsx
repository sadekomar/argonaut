"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  FileText,
  MoreHorizontal,
  Package,
  Target,
  User,
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getSortingStateParser } from "@/lib/parsers";
import { readRfqs } from "../_utils/read-rfqs";
import { useDeleteRfq, Rfq } from "./use-rfqs";
import { EditRfqModal } from "./update-rfq-modal";
import { ViewRfqModal } from "./view-rfq-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { formatCurrency, formatDate, mapToSelectOptions } from "@/lib/utils";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";

import { useReadProjects } from "@/app/projects/_components/use-projects";
import { useReadPeople } from "@/app/people/_components/use-people";
import { CompanyType, PersonType } from "@/lib/enums";
import { useReadCompanies } from "@/app/companies/_components/use-companies";

export function RfqsTable() {
  const deleteRfq = useDeleteRfq();

  const [selectedRfq, setSelectedRfq] = useState<Rfq>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () =>
      new Set([
        "referenceNumber",
        "date",
        "client",
        "supplier",
        "project",
        "author",
        "value",
        "currency",
        "rfqReceivedAt",
      ]),
    []
  );

  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Rfq>(columnIds).withDefault([])
  );

  // Read URL query state for filters
  const [filters] = useQueryStates({
    date: parseAsString,
    referenceNumber: parseAsString.withDefault(""),
    client: parseAsArrayOf(parseAsString).withDefault([]),
    supplier: parseAsArrayOf(parseAsString).withDefault([]),
    project: parseAsArrayOf(parseAsString).withDefault([]),
    author: parseAsArrayOf(parseAsString).withDefault([]),
    currency: parseAsArrayOf(parseAsString).withDefault([]),
    rfqReceivedAt: parseAsString,
  });

  const { data: projects } = useReadProjects();
  const { data: authors } = useReadPeople({
    type: [PersonType.AUTHOR],
  });
  const { data: clients } = useReadCompanies({
    type: [CompanyType.CLIENT],
  });
  const { data: suppliers } = useReadCompanies({
    type: [CompanyType.SUPPLIER],
  });

  const projectsInitialOptions = mapToSelectOptions(projects?.data);
  const authorsInitialOptions = mapToSelectOptions(authors?.data);
  const clientsInitialOptions = mapToSelectOptions(clients?.data);
  const suppliersInitialOptions = mapToSelectOptions(suppliers?.data);

  // Fetch RFQs with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["rfqs", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readRfqs({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        referenceNumber: filters.referenceNumber,
        date: filters.date ?? undefined,
        client: filters.client.length > 0 ? filters.client : undefined,
        supplier: filters.supplier.length > 0 ? filters.supplier : undefined,
        project: filters.project.length > 0 ? filters.project : undefined,
        author: filters.author.length > 0 ? filters.author : undefined,
        currency: filters.currency.length > 0 ? filters.currency : undefined,
        rfqReceivedAt: filters.rfqReceivedAt ?? undefined,
      }),
  });

  const rfqs = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columnHelper = createColumnHelper<Rfq>();
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
    columnHelper.accessor("referenceNumber", {
      id: "referenceNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Reference" />
      ),
      cell: ({ cell }) => (
        <div className="font-medium">
          {cell.getValue<Rfq["referenceNumber"]>()}
        </div>
      ),
      meta: {
        label: "Reference Number",
        placeholder: "Search references...",
        variant: "text",
        icon: FileText,
      },
      enableColumnFilter: false,
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Date" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Rfq["date"]>();
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-muted-foreground" />
            {formatDate(date)}
          </div>
        );
      },
      meta: {
        label: "Date",
        variant: "date",
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor((row) => row.client.name, {
      id: "client",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Client" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="size-4 text-muted-foreground" />
          {row.original.client.name}
        </div>
      ),
      meta: {
        label: "Client",
        variant: "multiSelect",
        options: clientsInitialOptions,
        icon: Building2,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor((row) => row.supplier.name, {
      id: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Supplier" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Package className="size-4 text-muted-foreground" />
          {row.original.supplier.name}
        </div>
      ),
      meta: {
        label: "Supplier",
        variant: "multiSelect",
        options: suppliersInitialOptions,
        icon: Package,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor((row) => row.project.name, {
      id: "project",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Project" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Target className="size-4 text-muted-foreground" />
          {row.original.project.name}
        </div>
      ),
      meta: {
        label: "Project",
        variant: "multiSelect",
        options: projectsInitialOptions,
        icon: Target,
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
        variant: "multiSelect",
        options: authorsInitialOptions,
        icon: User,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("value", {
      id: "value",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Value" />
      ),
      cell: ({ row }) => {
        const value = row.original.value;
        const currency = row.original.currency;

        return (
          <div className="flex items-center gap-1">
            {formatCurrency(value, currency)}
          </div>
        );
      },
    }),
    columnHelper.accessor("currency", {
      id: "currency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Currency" />
      ),
      cell: ({ cell }) => (
        <Badge variant="outline">{cell.getValue<Rfq["currency"]>()}</Badge>
      ),
      meta: {
        label: "Currency",
        variant: "multiSelect",
        options: [
          { label: "EGP", value: "EGP" },
          { label: "USD", value: "USD" },
          { label: "EUR", value: "EUR" },
          { label: "GBP", value: "GBP" },
          { label: "SAR", value: "SAR" },
          { label: "AED", value: "AED" },
        ],
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("rfqReceivedAt", {
      id: "rfqReceivedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Received Date" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Rfq["rfqReceivedAt"]>();
        if (!date) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-muted-foreground" />
            {formatDate(date)}
          </div>
        );
      },
      meta: {
        label: "Received Date",
        variant: "date",
      },
      enableColumnFilter: true,
    }),
    columnHelper.display({
      id: "actions",
      cell: function Cell({ row }) {
        const rfq = row.original;

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
                  setSelectedRfq(rfq);
                  setIsViewModalOpen(true);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRfq(rfq);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedRfq(rfq);
                  setIsDeleteModalOpen(true);
                }}
                disabled={deleteRfq.isPending}
              >
                {deleteRfq.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    }),
  ];

  const { table } = useDataTable({
    data: rfqs,
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

      {selectedRfq && (
        <ViewRfqModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          rfq={selectedRfq}
        />
      )}

      {selectedRfq && (
        <EditRfqModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          rfq={selectedRfq}
        />
      )}

      {selectedRfq && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete RFQ"
          description="Are you sure you want to delete this RFQ? This action cannot be undone."
          deleteFunction={() => deleteRfq.mutate(selectedRfq?.id ?? "")}
        />
      )}
    </div>
  );
}
