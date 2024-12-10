import * as React from "react"

import type { ColumnDef, VisibilityState, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button, buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import { CheckIcon, ChevronLeft, ChevronRight, Search, SkipBack, SkipForward } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

import edgeX86 from "../metadata_edge_x86.json";

const edgeArm64 = import("../metadata_edge_aarch64.json");

const stableX86 = import("../metadata_stable_x86.json");

const stableArm64 = import("../metadata_stable_aarch64.json");

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [column, setColumn] = React.useState("name");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      category: false,
      sha: false,
      id: false
    });
  const [page, setPage] = React.useState("edge");
  const [data, setData] = React.useState<TData[] | "loading">(edgeX86 as unknown as TData[]);

  React.useEffect(() => {
    (async () => {
      switch (page) {
        case "edge":
          setData(edgeX86 as unknown as TData[]);
          break;
        case "edgea":
          setData((await edgeArm64).default as unknown as TData[]);
          break;
        case "stable":
          setData((await stableX86).default as unknown as TData[]);
          break;
        case "stablea":
          setData((await stableArm64).default as unknown as TData[]);
          break;
      }
    })();
  }, [page]);

  const table = useReactTable({
    data: data == "loading" ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  React.useEffect(() => {
    table.setPageSize(20);

    const search = window.location.search;
    const page = Number(new URLSearchParams(search).get("page"));

    if (page > 0 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
    }
  }, []);

  const input: React.RefObject<HTMLInputElement | null> = React.useRef(null);
  const pageNumberInput: React.RefObject<HTMLInputElement | null> = React.useRef(null);

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row justify-center md:justify-normal items-center py-4 md:px-3">
        <form
          className="flex w-[90%] md:w-[40rem]"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.current) {
              const val = input.current.value;
              table.getColumn(column)?.setFilterValue(val);
            }
          }}
        >
          <Input
            placeholder="Filter using name..."
            ref={input}
            minLength={3}
            // value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              if (event.target.value == "") {
                table.getAllColumns().forEach((s) => s.setFilterValue(""))
              }
            }}
            className="max-w-sm rounded-r-none"
          />
          <Select
            value={page}
            onValueChange={setPage}
          >
            <SelectTrigger className="w-[180px] rounded-none">
              <SelectValue placeholder="Select Repo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Edge</SelectLabel>
                <SelectItem value="edge">Edge X86</SelectItem>
                <SelectItem value="edgea">Edge Aarch64</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Stable</SelectLabel>
                <SelectItem value="stable">Stable X86</SelectItem>
                <SelectItem value="stablea">Stable Aarch64</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={column}
            onValueChange={setColumn}
          >
            <SelectTrigger className="w-[180px] rounded-none">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter among</SelectLabel>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="family">Package Family</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="rounded-l-none"
          >
            <Search />
          </Button>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="my-2 md:my-0 w-[90%] md:w-auto md:ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table className="border-t border-t-muted/50">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
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
      <div className="flex items-center justify-center md:justify-end space-x-2 py-4 pr-3 border-t border-t-muted/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={table.getState().pagination.pageIndex == 0}
        >
          <SkipBack />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>

        <Popover>
          <PopoverTrigger>
            <span
              className={cn(buttonVariants({ variant: "outline", size: "sm", className: "" }))}
            >
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Navigate</h4>
                <p className="text-sm text-muted-foreground">
                  Navigate to a page between 1 and {table.getPageCount()}
                </p>
              </div>
              <div className="grid gap-2">
                <form
                  className="flex items-center"
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (pageNumberInput.current) {
                      const val = Number(pageNumberInput.current.value);

                      console.log(val);
                      if (val > 0 && val < table.getPageCount()) {
                        table.setPageIndex(val - 1);
                      }
                    }
                  }}
                >
                  <Label htmlFor="width">Page</Label>
                  <Input
                    id="width"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    min={1}
                    max={table.getPageCount()}
                    className="ml-4 col-span-2 h-8 rounded-r-none"
                    inputMode="numeric"
                    onChange={(e) => {
                      Number(e.target.value);
                    }}
                    ref={pageNumberInput}
                  />
                  <Button
                    variant={"outline"}
                    className="h-8 w-8 rounded-l-none"
                  >
                    <CheckIcon />
                  </Button>
                </form>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={table.getState().pagination.pageIndex == (table.getPageCount() - 1)}
        >
          <SkipForward />
        </Button>
      </div>
    </div>
  )
}
