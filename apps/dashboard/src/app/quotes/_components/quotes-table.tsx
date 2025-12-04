"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
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
import { readQuotes } from "../_utils/read-quotes";
import { useUpdateQuote, useDeleteQuote } from "./use-quotes";
import { useState } from "react";
import { QuoteForm } from "./quote-form";
import { EditQuoteModal } from "./edit-quote-modal";
import { ViewQuoteModal } from "./view-quote-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
  readAuthors,
  readClients,
  readContactPersons,
  readProjects,
  readSuppliers,
} from "../_utils/read-suppliers";

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

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function QuotesTable() {
  const deleteQuote = useDeleteQuote();

  const [selectedQuote, setSelectedQuote] = useState<Quote>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Read URL query state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(40));
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
      { id: "date", desc: true },
    ])
  );
  // Read URL query state for filters
  const [referenceNumber] = useQueryState(
    "referenceNumber",
    parseAsString.withDefault("")
  );

  const [date] = useQueryState("date", parseAsString);
  const [client] = useQueryState(
    "client",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [supplier] = useQueryState(
    "supplier",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [project] = useQueryState(
    "project",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [author] = useQueryState(
    "author",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [currency] = useQueryState(
    "currency",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [quoteOutcome] = useQueryState(
    "quoteOutcome",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [approximateSiteDeliveryDate] = useQueryState(
    "approximateSiteDeliveryDate",
    parseAsString
  );

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: readProjects,
  });
  const { data: contactPersons = [] } = useQuery({
    queryKey: ["contactPersons"],
    queryFn: readContactPersons,
  });
  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: readAuthors,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: readClients,
  });
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: readSuppliers,
  });

  // Fetch quotes with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: [
      "quotes",
      page,
      perPage,
      sort,
      referenceNumber,
      date,
      client,
      supplier,
      project,
      author,
      currency,
      quoteOutcome,
      approximateSiteDeliveryDate,
    ],
    queryFn: () =>
      readQuotes({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        referenceNumber: referenceNumber || undefined,
        date: date || undefined,
        client: client.length > 0 ? client : undefined,
        supplier: supplier.length > 0 ? supplier : undefined,
        project: project.length > 0 ? project : undefined,
        author: author.length > 0 ? author : undefined,
        currency: currency.length > 0 ? currency : undefined,
        quoteOutcome: quoteOutcome.length > 0 ? quoteOutcome : undefined,
        approximateSiteDeliveryDate: approximateSiteDeliveryDate || undefined,
      }),
  });
  const quotes = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<Quote>[]>(
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
        id: "referenceNumber",
        accessorKey: "referenceNumber",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
      },
      {
        id: "date",
        accessorKey: "date",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
      },
      {
        id: "client",
        accessorFn: (row) => row.client.name,
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
          options: clients.map((client) => ({
            label: client.label,
            value: client.value,
          })),
          icon: Building2,
        },
        enableColumnFilter: true,
      },
      {
        id: "supplier",
        accessorFn: (row) => row.supplier?.name ?? "N/A",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
          options: suppliers.map((supplier) => ({
            label: supplier.label,
            value: supplier.value,
          })),
          icon: Package,
        },
        enableColumnFilter: true,
      },
      {
        id: "project",
        accessorFn: (row) => row.project.name,
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
          options: projects.map((project) => ({
            label: project.label,
            value: project.value,
          })),
          icon: Target,
        },
        enableColumnFilter: true,
      },
      {
        id: "author",
        accessorFn: (row) => row.author.name,
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
          options: authors.map((author) => ({
            label: author.label,
            value: author.value,
          })),
          icon: User,
        },
        enableColumnFilter: true,
      },
      {
        id: "value",
        accessorKey: "value",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
      },
      {
        id: "currency",
        accessorKey: "currency",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
      },
      {
        id: "quoteOutcome",
        accessorKey: "quoteOutcome",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
      },
      {
        id: "approximateSiteDeliveryDate",
        accessorKey: "approximateSiteDeliveryDate",
        header: ({ column }: { column: Column<Quote, unknown> }) => (
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
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const quote = row.original;

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
      },
    ],
    [clients, suppliers, projects, authors]
  );

  const { table } = useDataTable({
    data: quotes as Quote[],
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "date", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  // Sync URL query state filters to table's column filters
  // Process values the same way useDataTable does
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

    const refNumValue = processFilterValue(referenceNumber || null);
    if (refNumValue) {
      columnFilters.push({ id: "referenceNumber", value: refNumValue });
    }

    const dateValue = processFilterValue(date || null);
    if (dateValue) {
      columnFilters.push({ id: "date", value: dateValue });
    }

    if (client.length > 0) {
      columnFilters.push({ id: "client", value: client });
    }

    if (supplier.length > 0) {
      columnFilters.push({ id: "supplier", value: supplier });
    }

    if (project.length > 0) {
      columnFilters.push({ id: "project", value: project });
    }

    if (author.length > 0) {
      columnFilters.push({ id: "author", value: author });
    }

    if (currency.length > 0) {
      columnFilters.push({ id: "currency", value: currency });
    }

    if (quoteOutcome.length > 0) {
      columnFilters.push({ id: "quoteOutcome", value: quoteOutcome });
    }

    const deliveryDateValue = processFilterValue(
      approximateSiteDeliveryDate || null
    );
    if (deliveryDateValue) {
      columnFilters.push({
        id: "approximateSiteDeliveryDate",
        value: deliveryDateValue,
      });
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
    referenceNumber,
    date,
    client,
    supplier,
    project,
    author,
    currency,
    quoteOutcome,
    approximateSiteDeliveryDate,
    processFilterValue,
    table,
  ]);

  return (
    <div className="data-table-container">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>

      {selectedQuote && (
        <ViewQuoteModal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          quote={selectedQuote}
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
