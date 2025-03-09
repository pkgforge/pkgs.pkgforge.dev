import * as React from "react";

import type {
  ColumnDef,
  VisibilityState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ListTree,
  Search,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import binX86 from "../metadata_bincache_x86_64-linux.json";

const binArm64 = import("../metadata_bincache_aarch64-linux.json");

const soarPkgs = import("../metadata_soarpkgs_[category].json");

const pkgArm64 = import("../metadata_pkgcache_aarch64-linux.json");

const pkgX86 = import("../metadata_pkgcache_x86_64-linux.json");

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const getColumnVis = () => {
  try {
    return JSON.parse(localStorage.visiv);
  } catch (e) {
    return {
      sha: false,
    };
  }
};

const initialFilters = {
  columnVisibility: getColumnVis(),
  page: "bincache_amd64",
  search: "",
};

const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    page: params.get("repo") || initialFilters.page,
    search: params.get("search") || initialFilters.search,
  };
};

const updateUrlParams = (params: typeof initialFilters) => {
  const urlParams = new URLSearchParams();
  if (params.page !== initialFilters.page) urlParams.set("repo", params.page);
  if (params.search) urlParams.set("search", params.search);

  const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
  window.history.replaceState({}, "", newUrl);
};

export function DataTable<TData>({
  columns: col,
}: {
  columns: (_: string) => ColumnDef<TData>[];
}) {
  const urlParams = getUrlParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(getColumnVis());
  const [page, setPage] = React.useState(urlParams.page);
  const [data, setData] = React.useState<TData[] | "loading">(
    binX86 as unknown as TData[],
  );
  const [searchValue, setSearchValue] = React.useState("");

  const columns = React.useMemo(() => {
    return col(page);
  }, [page]);

  React.useEffect(() => {
    updateUrlParams({
      page,
      search: searchValue,
      columnVisibility,
    });
  }, [page, columnFilters, columnVisibility, searchValue]);

  React.useEffect(() => {
    if (urlParams.search) {
      table?.getColumn("name")?.setFilterValue(urlParams.search);
      if (input.current) {
        input.current.value = urlParams.search;
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.visiv = JSON.stringify(columnVisibility);
  }, [columnVisibility]);

  React.useEffect(() => {
    (async () => {
      switch (page) {
        case "soarpkgs":
          setData((await soarPkgs).default as unknown as TData[]);
          break;
        case "bincache_amd64":
          setData(binX86 as unknown as TData[]);
          break;
        case "bincache_arm64":
          setData((await binArm64).default as unknown as TData[]);
          break;
        case "pkgcache_amd64":
          setData((await pkgX86).default as unknown as TData[]);
          break;
        case "pkgcache_arm64":
          setData((await pkgArm64).default as unknown as TData[]);
          break;
      }
    })();
  }, [page]);

  const table = useReactTable({
    data: data === "loading" ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      nameOrFamily: (row, columnId, filterValue) => {
        const searchLower = filterValue.toLowerCase();
        const name = (row.getValue("name") as string)?.toLowerCase() || "";
        const family = (row.getValue("family") as string)?.toLowerCase() || "";
        return name.includes(searchLower) || family.includes(searchLower);
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: searchValue,
    },
  });

  React.useEffect(() => {
    table.setPageSize(50);

    const search = window.location.search;
    const page = Number(new URLSearchParams(search).get("page"));

    if (page > 0 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
    }
  }, []);

  const input: React.RefObject<HTMLInputElement | null> = React.useRef(null);
  const pageNumberInput: React.RefObject<HTMLInputElement | null> =
    React.useRef(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="rounded-md border">
      <div className="flex flex-col md:flex-row justify-center md:justify-normal items-center py-4 md:px-3">
        <form
          className="flex w-[90%] md:w-[40rem]"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.current) {
              const val = input.current.value.trim();
              handleSearch(val);
            }
          }}
        >
          <Input
            placeholder="Filter using name or package ID..."
            ref={input}
            maxLength={64}
            onChange={(event) => {
              const value = event.target.value.trim();
              if (!value) {
                handleSearch("");
                for (const col of table.getAllColumns()) {
                  col.setFilterValue("");
                }
              } else {
                handleSearch(value);
              }
            }}
            className="max-w-sm rounded-r-none"
          />
          <Select value={page} onValueChange={setPage}>
            <SelectTrigger className="w-[180px] rounded-none">
              <SelectValue placeholder="Select Repo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>bincache</SelectLabel>
                <SelectItem value="bincache_amd64">
                  bincache (x86_64)
                </SelectItem>
                <SelectItem value="bincache_arm64">
                  bincache (aarch64)
                </SelectItem>
                <SelectItem value="pkgcache_amd64">
                  pkgcache (x86_64)
                </SelectItem>
                <SelectItem value="pkgcache_arm64">
                  pkgcache (aarch64)
                </SelectItem>
                <SelectItem value="soarpkgs">soarpkgs</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({
                variant: "default",
                size: "default",
                className: "rounded-l-none",
              })}
              aria-valuetext="Search"
            >
              <Search />
            </TooltipTrigger>
            <TooltipContent>
              <span className="block text-md">Search</span>
            </TooltipContent>
          </Tooltip>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="my-2 md:my-0 w-[90%] md:w-auto md:ml-auto"
            >
              Configure
              <ListTree />
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
                    className={cn("capitalize", {
                      uppercase: column.id === "sha" || column.id === "id",
                    })}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
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
                          header.getContext(),
                        )}
                  </TableHead>
                );
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
          disabled={table.getState().pagination.pageIndex === 0}
          aria-valuetext="Go to first page"
        >
          <SkipBack />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-valuetext="Go to previous page"
        >
          <ChevronLeft />
        </Button>

        <Popover>
          <PopoverTrigger>
            <span
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "",
                }),
              )}
            >
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
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

                      if (val > 0 && val <= table.getPageCount()) {
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
          aria-valuetext="Go to next page"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={
            table.getState().pagination.pageIndex === table.getPageCount() - 1
          }
          aria-valuetext="Go to last page"
        >
          <SkipForward />
        </Button>
      </div>
    </div>
  );
}
