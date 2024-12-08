import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DataTable } from "./ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react"
import { Button } from "./ui/button";

interface ListItem {
  name: string,
  pkg: string,
  family: string,
  version: string,
  sha: string,
  type: "base" | "pkg" | "bin",
  size: string,
  category: string,
  id?: string,
  build_date: string,
}

interface ListProps {
  list: ListItem[]
}
const columns: ColumnDef<ListItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex"
        >
          Package
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-6 w-8 rounded-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "family",
    header: ({ column }) => {
      return (
        <div
          className="flex"
        >
          Package Family
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-6 w-8 rounded-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "sha",
    header: "SHA Sum",
    cell: ({ row }) => {
      const sha = row.getValue("sha") as string;

      return <Tooltip>
        <TooltipTrigger>{sha.length > 10 ? `${sha.substring(0, 10)}...` : sha}</TooltipTrigger>
        <TooltipContent>
          <p>{sha}</p>
        </TooltipContent>
      </Tooltip>;
    }
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <div
          className="flex"
        >
          Size
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-6 w-8 rounded-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Categories",
    cell: ({ row }) => {
      const cate = row.getValue("category") as string;
      const cates = cate.split(",").filter((c) => c.trim() != "");

      return <Tooltip>
        <TooltipTrigger>{cates.length}</TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-wrap gap-1">
            {cates.map((c) => <Category key={c} cat={c} />)}
          </div>
        </TooltipContent>
      </Tooltip>;
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "build_date",
    header: ({ column }) => {
      return (
        <div
          className="flex"
        >
          Build Date
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-6 w-8 rounded-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("build_date") as string;
      const data = new Date(date).toTimeString();

      return <span>{data}</span>;
    },
  }
]

export default function List({ list }: ListProps) {
  return <TooltipProvider>
    <div className="mt-2 flex flex-col md:px-6 space-y-2 pb-3">
      <DataTable columns={columns} data={list} />
      {/* <Table>
        <TableHeader>
          <TableRow className="bg-muted/70">
            <TableHead className="min-w-[20rem]">Package</TableHead>
            <TableHead>Package Family</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>SHA Sum</TableHead>
            <TableHead className="min-w-32">Size</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, i) => (
            <TableRow key={item.sha + i}>
              <TableCell className="border border-muted/70">{item.name}</TableCell>
              <TableCell className="border border-muted/70">{item.family}</TableCell>
              <TableCell className="border border-muted/70">{item.version}</TableCell>
              <TableCell className="border border-muted/70">
                <Tooltip>
                  <TooltipTrigger>{item.sha.length > 10 ? `${item.sha.substring(0, 10)}...` : item.sha}</TooltipTrigger>
                  <TooltipContent>
                    <p>{item.sha}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="border border-muted/70">{item.size}</TableCell>
              <TableCell className="border border-muted/70">
                <div className="flex flex-wrap gap-1">
                  {item.category.split(",").filter((c) => c.trim() != "").map((c) => <Category key={c} cat={c} />)}
                </div>
              </TableCell>
              <TableCell className="border border-muted/70 border-r border-r-muted/70" >{item.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  </TooltipProvider>;
}

function Category({ cat }: { cat: string }) {
  const cate = cat.trim();
  return <div className="p-1 px-2 border border-foreground rounded-xl">{cate.split("")[0].toUpperCase()}{cate.substring(1)}</div>;
}