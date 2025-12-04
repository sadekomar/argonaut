"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  MoreHorizontal,
  Target,
  CheckCircle,
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
import { readProjects } from "../_utils/read-projects";
import { useEditProject, useDeleteProject } from "./use-projects";
import { UpdateProjectModal } from "./update-project-modal";
import type { ProjectStatus } from "@repo/db";

interface Project {
  id: string;
  name: string;
  status: ProjectStatus | null;
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

export function ProjectsTable() {
  const editProject = useEditProject();
  const deleteProject = useDeleteProject();
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(
    null
  );

  // Read URL query state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(40));

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () => new Set(["name", "status", "company", "createdAt"]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Project>(columnIds).withDefault([
      { id: "createdAt", desc: true },
    ])
  );

  // Read URL query state for filters
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [company] = useQueryState("company", parseAsString.withDefault(""));

  // Fetch projects with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["projects", page, perPage, sort, name, status, company],
    queryFn: () =>
      readProjects({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        name: name || undefined,
        status: status.length > 0 ? status : undefined,
        company: company || undefined,
      }),
  });

  const projects = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<Project>[]>(
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
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-1.5">
            <Target className="size-4 text-muted-foreground" />
            <div className="font-medium">
              {cell.getValue<Project["name"]>()}
            </div>
          </div>
        ),
        meta: {
          label: "Name",
          placeholder: "Search projects...",
          variant: "text",
          icon: Target,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          if (!status)
            return <span className="text-muted-foreground">N/A</span>;
          const Icon = status === "IN_HAND" ? CheckCircle : Clock;

          return (
            <Badge
              variant="outline"
              className={
                status === "IN_HAND"
                  ? "border-green-500 text-green-700 dark:text-green-400"
                  : "border-blue-500 text-blue-700 dark:text-blue-400"
              }
            >
              <Icon className="mr-1 size-3" />
              {status === "IN_HAND" ? "In Hand" : "Tender"}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "In Hand", value: "IN_HAND", icon: CheckCircle },
            { label: "Tender", value: "TENDER", icon: Clock },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "company",
        accessorFn: (row) => row.company?.name ?? "N/A",
        header: ({ column }: { column: Column<Project, unknown> }) => (
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
          placeholder: "Search companies...",
          variant: "text",
          icon: Building2,
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue<Project["createdAt"]>();
          return (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground" />
              {formatDate(date)}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const project = row.original;

          const handleEdit = () => {
            setEditingProjectId(project.id);
          };

          const handleDelete = () => {
            if (
              confirm(
                `Are you sure you want to delete project ${project.name}?`
              )
            ) {
              deleteProject.mutate(project.id);
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
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [deleteProject, setEditingProjectId]
  );

  const { table } = useDataTable({
    data: projects as Project[],
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

    const nameValue = processFilterValue(name || null);
    if (nameValue) {
      columnFilters.push({ id: "name", value: nameValue });
    }

    if (status.length > 0) {
      columnFilters.push({ id: "status", value: status });
    }

    const companyValue = processFilterValue(company || null);
    if (companyValue) {
      columnFilters.push({ id: "company", value: companyValue });
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
  }, [name, status, company, processFilterValue, table]);

  return (
    <>
      <div className="data-table-container">
        <DataTable table={table} isLoading={isLoading}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
      {editingProjectId && (
        <UpdateProjectModal
          open={!!editingProjectId}
          onOpenChange={(open) => {
            if (!open) setEditingProjectId(null);
          }}
          projectId={editingProjectId}
        />
      )}
    </>
  );
}
