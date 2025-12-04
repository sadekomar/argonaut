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
import { readRfqs } from "../_utils/read-rfqs";

type Currency = "EGP" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

interface Rfq {
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
  supplierId: string;
  supplier: {
    id: string;
    name: string;
  };
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
  rfqReceivedAt: Date | string | null;
  quoteId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
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

export function RfqsTable() {
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
        "rfqReceivedAt",
      ]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Rfq>(columnIds).withDefault([
      { id: "date", desc: true },
    ])
  );

  // Read URL query state for filters
  const [referenceNumber] = useQueryState(
    "referenceNumber",
    parseAsString.withDefault("")
  );
  const [date] = useQueryState("date", parseAsString);
  const [client] = useQueryState("client", parseAsString.withDefault(""));
  const [supplier] = useQueryState("supplier", parseAsString.withDefault(""));
  const [project] = useQueryState("project", parseAsString.withDefault(""));
  const [author] = useQueryState("author", parseAsString.withDefault(""));
  const [currency] = useQueryState(
    "currency",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [rfqReceivedAt] = useQueryState("rfqReceivedAt", parseAsString);
  const [hasQuote] = useQueryState(
    "hasQuote",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Fetch RFQs with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: [
      "rfqs",
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
      rfqReceivedAt,
      hasQuote,
    ],
    queryFn: () =>
      readRfqs({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        referenceNumber: referenceNumber || undefined,
        date: date || undefined,
        client: client || undefined,
        supplier: supplier || undefined,
        project: project || undefined,
        author: author || undefined,
        currency: currency.length > 0 ? currency : undefined,
        rfqReceivedAt: rfqReceivedAt || undefined,
        hasQuote: hasQuote.length > 0 ? hasQuote : undefined,
      }),
  });

  const rfqs = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<Rfq>[]>(
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
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
        enableColumnFilter: true,
      },
      {
        id: "date",
        accessorKey: "date",
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
      },
      {
        id: "client",
        accessorFn: (row) => row.client.name,
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
          placeholder: "Search clients...",
          variant: "text",
          icon: Building2,
        },
        enableColumnFilter: true,
      },
      {
        id: "supplier",
        accessorFn: (row) => row.supplier.name,
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
          placeholder: "Search suppliers...",
          variant: "text",
          icon: Package,
        },
        enableColumnFilter: true,
      },
      {
        id: "project",
        accessorFn: (row) => row.project.name,
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
          placeholder: "Search projects...",
          variant: "text",
          icon: Target,
        },
        enableColumnFilter: true,
      },
      {
        id: "author",
        accessorFn: (row) => row.author.name,
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
        id: "value",
        accessorKey: "value",
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
          <DataTableColumnHeader column={column} label="Value" />
        ),
        cell: ({ row }) => {
          const value = row.original.value;
          const currency = row.original.currency;

          return (
            <div className="flex items-center gap-1">
              <DollarSign className="size-4 text-muted-foreground" />
              {formatCurrency(value, currency)}
            </div>
          );
        },
      },
      {
        id: "currency",
        accessorKey: "currency",
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
      },
      {
        id: "rfqReceivedAt",
        accessorKey: "rfqReceivedAt",
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
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
      },
      {
        id: "hasQuote",
        accessorFn: (row) => (row.quoteId ? "Yes" : "No"),
        header: ({ column }: { column: Column<Rfq, unknown> }) => (
          <DataTableColumnHeader column={column} label="Has Quote" />
        ),
        cell: ({ row }) => {
          const hasQuote = !!row.original.quoteId;
          return (
            <Badge
              variant="outline"
              className={
                hasQuote
                  ? "border-green-500 text-green-700 dark:text-green-400"
                  : "border-yellow-500 text-yellow-700 dark:text-yellow-400"
              }
            >
              <CheckCircle className="mr-1 size-3" />
              {hasQuote ? "Yes" : "No"}
            </Badge>
          );
        },
        meta: {
          label: "Has Quote",
          variant: "multiSelect",
          options: [
            { label: "Yes", value: "true", icon: CheckCircle },
            { label: "No", value: "false", icon: CheckCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: rfqs as Rfq[],
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "date", desc: true }],
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
