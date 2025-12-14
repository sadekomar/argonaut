"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, MoreHorizontal, User } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
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
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { UpdateFollowUpModal } from "./_components/update-follow-up-modal";
import { useReadQuotes } from "@/app/quotes/_components/use-quotes";
import { useReadPeople } from "@/app/people/_components/use-people";
import { PersonType } from "@/lib/enums";
import { mapToSelectOptions } from "@/lib/utils";

export interface FollowUp {
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
  const deleteFollowUp = useDeleteFollowUp();

  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Read URL query state for pagination
  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

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
  const [filters] = useQueryStates({
    quote: parseAsArrayOf(parseAsString).withDefault([]),
    author: parseAsArrayOf(parseAsString).withDefault([]),
    notes: parseAsString.withDefault(""),
    createdAt: parseAsString,
  });

  const { data: quotes } = useReadQuotes();
  const { data: authors } = useReadPeople({
    type: [PersonType.AUTHOR],
  });

  const quotesInitialOptions = React.useMemo(() => {
    return (
      quotes?.data?.map((quote) => ({
        value: quote.id,
        label: quote.referenceNumber,
      })) ?? []
    );
  }, [quotes?.data]);

  const authorsInitialOptions = mapToSelectOptions(authors?.data);

  // Fetch follow-ups with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["followUps", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readFollowUps({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        quote:
          filters.quote.length > 0 ? (filters.quote as string[]) : undefined,
        author:
          filters.author.length > 0 ? (filters.author as string[]) : undefined,
        notes: filters.notes || undefined,
        createdAt: filters.createdAt || undefined,
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
          variant: "multiSelect",
          options: quotesInitialOptions,
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
          variant: "multiSelect",
          options: authorsInitialOptions,
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
            setSelectedFollowUp(followUp);
            setIsEditModalOpen(true);
          };

          const handleDelete = () => {
            setSelectedFollowUp(followUp);
            setIsDeleteModalOpen(true);
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
        <DataTableToolbar table={table} />
      </DataTable>

      {selectedFollowUp && (
        <UpdateFollowUpModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          followUp={selectedFollowUp}
        />
      )}

      {selectedFollowUp && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Follow-Up"
          description="Are you sure you want to delete this follow-up? This action cannot be undone."
          deleteFunction={() =>
            deleteFollowUp.mutate(selectedFollowUp?.id ?? "")
          }
        />
      )}
    </div>
  );
}
