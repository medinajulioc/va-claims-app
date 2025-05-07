"use client";

import * as React from "react";
import Image from "next/image";
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
import { ChevronLeft, ChevronRight, MoreHorizontalIcon, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const data: Course[] = [
  {
    id: 1,
    name: "Introduction to React",
    category: "Web Development",
    image: `${process.env.ASSETS_URL}/tech/react.svg`,
    score: 4.5,
    progress: 60,
    started: true
  },
  {
    id: 2,
    name: "Machine Learning Basics",
    category: "Data Science",
    image: `${process.env.ASSETS_URL}/tech/angular.svg`,
    score: 4.8,
    progress: 0,
    started: false
  },
  {
    id: 3,
    name: "Digital Marketing Fundamentals",
    category: "Marketing",
    image: `${process.env.ASSETS_URL}/tech/vue.svg`,
    score: 4.2,
    progress: 45,
    started: true
  },
  {
    id: 4,
    name: "Python for Beginners",
    category: "Programming",
    image: `${process.env.ASSETS_URL}/tech/html.svg`,
    score: 4.6,
    progress: 0,
    started: false
  },
  {
    id: 5,
    name: "UX Design Principles",
    category: "Design",
    image: `${process.env.ASSETS_URL}/tech/css.svg`,
    score: 4.4,
    progress: 0,
    started: false
  },
  {
    id: 5,
    name: "Svelte Project Development",
    category: "Programming",
    image: `${process.env.ASSETS_URL}/tech/svelte.svg`,
    score: 4.8,
    progress: 0,
    started: false
  }
];

export type Course = {
  id: number;
  name: string;
  category: string;
  image: string;
  score: number;
  progress: number;
  started: boolean;
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: "Course name",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Image
          width={30}
          height={30}
          className="size-8"
          src={row.original.image}
          unoptimized
          alt="shadcn/ui"
        />
        <div className="capitalize">{row.getValue("name")}</div>
      </div>
    )
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.getValue("category")
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <div className="flex items-center">
        <StarIcon className="mr-1 size-4 fill-yellow-500 text-yellow-500" />
        {row.getValue("score")}
      </div>
    )
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => <Progress className="h-2 w-20" value={row.getValue("progress")} />
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="text-end">
          {row.original.started ? (
            <Button size="sm">
              Continue <ChevronRight />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Start Course</DropdownMenuItem>
                <DropdownMenuItem>Add to Wishlist</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      );
    }
  }
];

export function CoursesListTable() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Courses</CardTitle>
        <CardAction className="col-start-auto row-start-auto mt-2 justify-self-start lg:col-start-2 lg:row-start-1 lg:mt-0 lg:justify-self-end">
          <Input
            placeholder="Search courses"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="w-full sm:w-52"
          />
        </CardAction>
      </CardHeader>
      <CardContent>
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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
