"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Mail,
  Phone,
  User,
  MoreHorizontal,
  UserCheck,
  Users,
  Briefcase,
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
import { readPeople } from "./_utils/read-people";
import { useDeletePerson } from "./_components/use-people";
import { useState } from "react";
import { UpdatePersonModal } from "./_components/update-person-modal";

type PersonType = "AUTHOR" | "CONTACT_PERSON" | "INTERNAL";

interface Person {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: PersonType;
  companyId: string | null;
  company: {
    id: string;
    name: string;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function PeopleTable() {
  const deletePerson = useDeletePerson();
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

  // Read URL query state for pagination
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(40));

  // Read URL query state for sorting
  const columnIds = React.useMemo(
    () =>
      new Set([
        "name",
        "email",
        "phone",
        "company",
        "type",
        "createdAt",
        "updatedAt",
      ]),
    []
  );
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser<Person>(columnIds).withDefault([
      { id: "createdAt", desc: true },
    ])
  );

  // Read URL query state for filters
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [email] = useQueryState("email", parseAsString.withDefault(""));
  const [phone] = useQueryState("phone", parseAsString.withDefault(""));
  const [company] = useQueryState("company", parseAsString.withDefault(""));
  const [personType] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Fetch people with server-side filtering, sorting, and pagination
  const { data, isLoading } = useQuery({
    queryKey: [
      "people",
      page,
      perPage,
      sort,
      name,
      email,
      phone,
      company,
      personType,
    ],
    queryFn: () =>
      readPeople({
        page,
        perPage,
        sort: sort as Array<{ id: string; desc: boolean }>,
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        type: personType.length > 0 ? personType : undefined,
      }),
  });

  const people = data?.data ?? [];
  const pageCount = data?.pageCount ?? 1;

  const columns = React.useMemo<ColumnDef<Person>[]>(
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
        header: ({ column }: { column: Column<Person, unknown> }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-1.5 font-medium">
            <User className="size-4 text-muted-foreground" />
            {cell.getValue<Person["name"]>()}
          </div>
        ),
        meta: {
          label: "Name",
          placeholder: "Search names...",
          variant: "text",
          icon: User,
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }: { column: Column<Person, unknown> }) => (
          <DataTableColumnHeader column={column} label="Email" />
        ),
        cell: ({ cell }) => {
          const email = cell.getValue<Person["email"]>();
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
        header: ({ column }: { column: Column<Person, unknown> }) => (
          <DataTableColumnHeader column={column} label="Phone" />
        ),
        cell: ({ cell }) => {
          const phone = cell.getValue<Person["phone"]>();
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
        id: "company",
        accessorFn: (row) => row.company?.name ?? "N/A",
        header: ({ column }: { column: Column<Person, unknown> }) => (
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
        id: "type",
        accessorKey: "type",
        header: ({ column }: { column: Column<Person, unknown> }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue<Person["type"]>();
          const typeConfig = {
            AUTHOR: {
              label: "Author",
              icon: UserCheck,
              variant: "default" as const,
            },
            CONTACT_PERSON: {
              label: "Contact Person",
              icon: Users,
              variant: "secondary" as const,
            },
            INTERNAL: {
              label: "Internal",
              icon: Briefcase,
              variant: "outline" as const,
            },
          };
          const config = typeConfig[type];
          const Icon = config.icon;

          return (
            <Badge variant={config.variant}>
              <Icon className="mr-1 size-3" />
              {config.label}
            </Badge>
          );
        },
        meta: {
          label: "Type",
          variant: "multiSelect",
          options: [
            { label: "Author", value: "AUTHOR", icon: UserCheck },
            { label: "Contact Person", value: "CONTACT_PERSON", icon: Users },
            { label: "Internal", value: "INTERNAL", icon: Briefcase },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const person = row.original;

          const handleEdit = () => {
            setEditingPersonId(person.id);
          };

          const handleDelete = () => {
            if (confirm(`Are you sure you want to delete ${person.name}?`)) {
              deletePerson.mutate(person.id);
            }
          };

          return (
            <>
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
                    disabled={deletePerson.isPending}
                  >
                    {deletePerson.isPending ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {editingPersonId === person.id && (
                <UpdatePersonModal
                  open={true}
                  onOpenChange={(open) => {
                    if (!open) setEditingPersonId(null);
                  }}
                  personId={person.id}
                />
              )}
            </>
          );
        },
        size: 32,
      },
    ],
    [deletePerson]
  );

  const { table } = useDataTable({
    data: people as Person[],
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

    const emailValue = processFilterValue(email || null);
    if (emailValue) {
      columnFilters.push({ id: "email", value: emailValue });
    }

    const phoneValue = processFilterValue(phone || null);
    if (phoneValue) {
      columnFilters.push({ id: "phone", value: phoneValue });
    }

    const companyValue = processFilterValue(company || null);
    if (companyValue) {
      columnFilters.push({ id: "company", value: companyValue });
    }

    if (personType.length > 0) {
      columnFilters.push({ id: "type", value: personType });
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
  }, [name, email, phone, company, personType, processFilterValue, table]);

  return (
    <div className="data-table-container">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
