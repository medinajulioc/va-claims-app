"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, Columns, MoreHorizontal, PlusCircle } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { generateAvatarFallback } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  country: string;
  status: "active" | "inactive" | "pending";
  plan_name: string;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
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
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={row.original.image} alt="shadcn ui kit" />
          <AvatarFallback>{generateAvatarFallback(row.getValue("name"))}</AvatarFallback>
        </Avatar>
        <div className="capitalize">{row.getValue("name")}</div>
      </div>
    )
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-3"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Role
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("role")
  },
  {
    accessorKey: "plan_name",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-3"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Plan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("plan_name")
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-3"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("email")
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-3"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Country
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("country")
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-3"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap = {
        active: "success",
        inactive: "destructive",
        pending: "warning"
      } as const;

      const statusClass = statusMap[status] ?? "outline";

      return (
        <Badge variant={statusClass} className="capitalize">
          {status.replace("-", " ")}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View user</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function UsersDataTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const statuses = [
    {
      value: "active",
      label: "Active"
    },
    {
      value: "inactive",
      label: "Inactive"
    },
    {
      value: "pending",
      label: "Pending"
    }
  ];

  const plans = [
    {
      value: "basic",
      label: "Basic"
    },
    {
      value: "team",
      label: "Team"
    },
    {
      value: "enterprise",
      label: "Enterprise"
    }
  ];

  const roles = [
    {
      value: "construction-foreman",
      label: "Construction Foreman"
    },
    {
      value: "project-manager",
      label: "Project Manager"
    },
    {
      value: "surveyor",
      label: "Surveyor"
    },
    {
      value: "architect",
      label: "Architect"
    },
    {
      value: "subcontractor",
      label: "Subcontractor"
    },
    {
      value: "electrician",
      label: "Electrician"
    },
    {
      value: "estimator",
      label: "Estimator"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search users..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle />
                Status
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
              <Command>
                <CommandInput placeholder="Status" className="h-9" />
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem key={status.value} value={status.value}>
                        <div className="flex items-center space-x-3 py-1">
                          <Checkbox id={status.value} />
                          <label
                            htmlFor={status.value}
                            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {status.label}
                          </label>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle />
                Plan
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
              <Command>
                <CommandInput placeholder="Plan" className="h-9" />
                <CommandList>
                  <CommandEmpty>No plan found.</CommandEmpty>
                  <CommandGroup>
                    {plans.map((plan) => (
                      <CommandItem key={plan.value} value={plan.value}>
                        <div className="flex items-center space-x-3 py-1">
                          <Checkbox id={plan.value} />
                          <label
                            htmlFor={plan.value}
                            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {plan.label}
                          </label>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="h-4 w-4" />
                Role
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
              <Command>
                <CommandInput placeholder="Role" className="h-9" />
                <CommandList>
                  <CommandEmpty>No role found.</CommandEmpty>
                  <CommandGroup>
                    {roles.map((role) => (
                      <CommandItem
                        key={role.value}
                        value={role.value}
                        onSelect={(currentValue) => {
                          // setValue(currentValue === value ? "" : currentValue);
                          // setOpen(false);
                        }}>
                        <div className="flex items-center space-x-3 py-1">
                          <Checkbox id={role.value} />
                          <label
                            htmlFor={role.value}
                            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {role.label}
                          </label>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="ml-auto">
              <Columns />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
