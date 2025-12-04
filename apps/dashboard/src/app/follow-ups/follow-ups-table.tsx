"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, MoreHorizontal, User } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { getSortingStateParser } from "@/lib/parsers";
import { readFollowUps } from "./_utils/read-follow-ups";
import {
  useEditFollowUp,
  useDeleteFollowUp,
} from "./_components/use-follow-ups";

interface FollowUp {
  id: string;
  quoteId: string;
  quote: {
    id: string;
    referenceNumber: string;
  };
  authorId: string;
  author: {
    id: string;
    name: string;
  };
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

const truncateText = (text: string | null, maxLength: number = 50) => {
  if (!text) return "N/A";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export function FollowUpsTable() {
  const editFollowUp = useEditFollowUp();
  const deleteFollowUp = useDeleteFollowUp();

  // Read URL query state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(40));

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () => new Set(["quote", "author", "notes", "createdAt"]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<FollowUp>(columnIds).withDefault([
      { id: "createdAt", desc: true },
    ])
  );

  // Read URL query state for filters
  const [quote] = useQueryState("quote", parseAsString.withDefault(""));
  const [author] = useQueryState("author", parseAsString.withDefault(""));
  const [notes] = useQueryState("notes", parseAsString.withDefault(""));
  const [createdAt] = useQueryState("createdAt", parseAsString);

  // Fetch follow-ups with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: [
      "followUps",
      page,
      perPage,
      sort,
      quote,
      author,
      notes,
      createdAt,
    ],
    queryFn: () =>
      readFollowUps({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        quote: quote || undefined,
        author: author || undefined,
        notes: notes || undefined,
        createdAt: createdAt || undefined,
      }),
  });

  const followUps = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<FollowUp>[]>(
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
        id: "quote",
        accessorFn: (row) => row.quote.referenceNumber,
        header: ({ column }: { column: Column<FollowUp, unknown> }) => (
          <DataTableColumnHeader column={column} label="Quote" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <FileText className="size-4 text-muted-foreground" />
            <div className="font-medium">
              {row.original.quote.referenceNumber}
            </div>
          </div>
        ),
        meta: {
          label: "Quote",
          placeholder: "Search quotes...",
          variant: "text",
          icon: FileText,
        },
        enableColumnFilter: true,
      },
      {
        id: "author",
        accessorFn: (row) => row.author.name,
        header: ({ column }: { column: Column<FollowUp, unknown> }) => (
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
        id: "notes",
        accessorKey: "notes",
        header: ({ column }: { column: Column<FollowUp, unknown> }) => (
          <DataTableColumnHeader column={column} label="Notes" />
        ),
        cell: ({ cell }) => {
          const notes = cell.getValue<FollowUp["notes"]>();
          const truncated = truncateText(notes, 50);
          const fullText = notes || "N/A";

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[300px] truncate">{truncated}</div>
                </TooltipTrigger>
                {notes && notes.length > 50 && (
                  <TooltipContent>
                    <p className="max-w-xs">{fullText}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        },
        meta: {
          label: "Notes",
          placeholder: "Search notes...",
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<FollowUp, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue<FollowUp["createdAt"]>();
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
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const followUp = row.original;

          const handleEdit = () => {
            // TODO: Open edit modal or navigate to edit page
            // For now, you can implement the edit modal similar to add-follow-up-modal
            console.log("Edit follow-up:", followUp.id);
          };

          const handleDelete = () => {
            if (
              confirm(
                `Are you sure you want to delete this follow-up for quote ${followUp.quote.referenceNumber}?`
              )
            ) {
              deleteFollowUp.mutate(followUp.id);
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
                  disabled={deleteFollowUp.isPending}
                >
                  {deleteFollowUp.isPending ? "Deleting..." : "Delete"}
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
    data: followUps as FollowUp[],
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
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

    const quoteValue = processFilterValue(quote || null);
    if (quoteValue) {
      columnFilters.push({ id: "quote", value: quoteValue });
    }

    const authorValue = processFilterValue(author || null);
    if (authorValue) {
      columnFilters.push({ id: "author", value: authorValue });
    }

    const notesValue = processFilterValue(notes || null);
    if (notesValue) {
      columnFilters.push({ id: "notes", value: notesValue });
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
  }, [quote, author, notes, createdAt, processFilterValue, table]);

  return (
    <div className="data-table-container">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
