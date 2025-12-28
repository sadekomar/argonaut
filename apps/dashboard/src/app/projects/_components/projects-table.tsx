"use client";

import { createColumnHelper } from "@tanstack/react-table";
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
import { readProjects } from "../_utils/read-projects";
import { useDeleteProject } from "./use-projects";
import { UpdateProjectModal } from "./update-project-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import type { ProjectStatus } from "@repo/db";
import Link from "next/link";

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
  const deleteProject = useDeleteProject();

  const [selectedProject, setSelectedProject] = useState<Project>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [pagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(40),
  });

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
  const [filters] = useQueryStates({
    name: parseAsString.withDefault(""),
    status: parseAsArrayOf(parseAsString).withDefault([]),
    company: parseAsString.withDefault(""),
  });

  // Fetch projects with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: ["projects", { ...pagination, sort, ...filters }],
    queryFn: () =>
      readProjects({
        page: pagination.page,
        perPage: pagination.perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        name: filters.name || undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        company: filters.company || undefined,
      }),
  });

  const projects = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columnHelper = createColumnHelper<Project>();
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
          <Target className="size-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search projects...",
        variant: "text",
        icon: Target,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<Project["status"]>();
        if (!status) return <span className="text-muted-foreground">N/A</span>;
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
        placeholder: "Search companies...",
        variant: "text",
        icon: Building2,
      },
      enableColumnFilter: true,
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created" />
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
      meta: {
        label: "Created At",
        variant: "date",
      },
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: "actions",
      cell: function Cell({ row }) {
        const project = row.original;

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
                <Link href={`/quotes?projectId=${project.id}`}>
                  View Quotes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProject(project);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedProject(project);
                  setIsDeleteModalOpen(true);
                }}
                disabled={deleteProject.isPending}
              >
                {deleteProject.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    }),
  ];

  const { table } = useDataTable({
    data: projects,
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

      {selectedProject && (
        <UpdateProjectModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          projectId={selectedProject.id}
        />
      )}

      {selectedProject && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
          deleteFunction={() => deleteProject.mutate(selectedProject?.id ?? "")}
        />
      )}
    </div>
  );
}
