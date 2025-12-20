"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  CheckCircle,
  FileText,
  MoreHorizontal,
  Package,
  Target,
  User,
  XCircle,
  Clock,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import * as React from "react";

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
import { readQuotes } from "../_utils/read-quotes";
import { useDeleteQuote } from "./use-quotes";
import { useState } from "react";

import { EditQuoteModal } from "./edit-quote-modal";
import { ViewQuoteModal } from "./view-quote-modal";
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
import { CreateFollowUpModal } from "@/app/follow-ups/_components/create-follow-up-modal";

type QuoteOutcome = "WON" | "PENDING" | "LOST";
type Currency = "EGP" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

export interface Quote {
  id: string;
  serialNumber: number;
  referenceNumber: string;
  date: Date | string;
  currency: Currency;
  rate: number;
  value: number;
  notes: string | null;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  supplierId: string | null;
  supplier: {
    id: string;
    name: string;
  } | null;
  clientId: string;
  client: {
    id: string;
    name: string;
  };
  projectId: string;
  project: {
    id: string;
    name: string;
  };
  contactPersonId: string;
  contactPerson: {
    id: string;
    name: string;
  };
  quoteOutcome: QuoteOutcome;
  approximateSiteDeliveryDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  objectKeys: string[];
}

export function QuotesTable() {
  const deleteQuote = useDeleteQuote();

  const [selectedQuote, setSelectedQuote] = useState<Quote>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateFollowUpModalOpen, setIsCreateFollowUpModalOpen] =
    useState(false);

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
        "quoteOutcome",
        "approximateSiteDeliveryDate",
      ]),
    []
  );

  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Quote>(columnIds).withDefault([
      { id: "referenceNumber", desc: true },
    ])
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
    quoteOutcome: parseAsArrayOf(parseAsString).withDefault([]),
    approximateSiteDeliveryDate: parseAsString,
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

  // Fetch quotes with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["quotes", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readQuotes({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        referenceNumber: filters.referenceNumber,
        date: filters.date ?? undefined,
        client: filters.client,
        supplier: filters.supplier,
        project: filters.project,
        author: filters.author,
        currency: filters.currency,
        quoteOutcome: filters.quoteOutcome,
        approximateSiteDeliveryDate:
          filters.approximateSiteDeliveryDate ?? undefined,
      }),
  });

  const quotes = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columnHelper = createColumnHelper<Quote>();
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
          {cell.getValue<Quote["referenceNumber"]>()}
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
        const date = cell.getValue<Quote["date"]>();
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
    columnHelper.accessor((row) => row.supplier?.name ?? "N/A", {
      id: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Supplier" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Package className="size-4 text-muted-foreground" />
          {row.original.supplier?.name ?? "N/A"}
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
        <Badge variant="outline">{cell.getValue<Quote["currency"]>()}</Badge>
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
    columnHelper.accessor("quoteOutcome", {
      id: "quoteOutcome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Outcome" />
      ),
      cell: ({ cell }) => {
        const outcome = cell.getValue<Quote["quoteOutcome"]>();
        const Icon =
          outcome === "WON"
            ? CheckCircle
            : outcome === "LOST"
              ? XCircle
              : Clock;

        return (
          <Badge
            variant="outline"
            className={
              outcome === "WON"
                ? "border-green-500 text-green-700 dark:text-green-400"
                : outcome === "LOST"
                  ? "border-red-500 text-red-700 dark:text-red-400"
                  : "border-yellow-500 text-yellow-700 dark:text-yellow-400"
            }
          >
            <Icon className="mr-1 size-3" />
            {outcome}
          </Badge>
        );
      },
      meta: {
        label: "Outcome",
        variant: "multiSelect",
        options: [
          { label: "Won", value: "WON", icon: CheckCircle },
          { label: "Pending", value: "PENDING", icon: Clock },
          { label: "Lost", value: "LOST", icon: XCircle },
        ],
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("approximateSiteDeliveryDate", {
      id: "approximateSiteDeliveryDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Delivery Date" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Quote["approximateSiteDeliveryDate"]>();
        if (!date) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-muted-foreground" />
            {formatDate(date)}
          </div>
        );
      },
      meta: {
        label: "Delivery Date",
        variant: "date",
      },
      enableColumnFilter: true,
    }),
    columnHelper.display({
      id: "actions",
      cell: function Cell({ row }) {
        const quote = row.original;

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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedQuote(quote);
                  setIsViewModalOpen(true);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedQuote(quote);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedQuote(quote);
                  setIsCreateFollowUpModalOpen(true);
                }}
              >
                Add follow-up
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedQuote(quote);
                  setIsDeleteModalOpen(true);
                }}
                disabled={deleteQuote.isPending}
              >
                {deleteQuote.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    }),
  ];

  const { table } = useDataTable({
    data: quotes,
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

      {selectedQuote && (
        <ViewQuoteModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          quote={selectedQuote}
        />
      )}

      {selectedQuote && (
        <CreateFollowUpModal
          open={isCreateFollowUpModalOpen}
          onOpenChange={setIsCreateFollowUpModalOpen}
          defaultValues={{
            quoteId: selectedQuote.id,
            authorId: selectedQuote.authorId,
          }}
        />
      )}

      {selectedQuote && (
        <EditQuoteModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          quote={selectedQuote}
        />
      )}

      {selectedQuote && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Quote"
          description="Are you sure you want to delete this quote? This action cannot be undone."
          deleteFunction={() => deleteQuote.mutate(selectedQuote?.id ?? "")}
        />
      )}
    </div>
  );
}
