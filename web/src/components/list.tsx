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
  sizeNum: number,
  category: string,
  id?: string,
  build_date: string,
}

const byteValueNumberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  style: "unit",
  unit: "byte",
  unitDisplay: "narrow",
});

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
    accessorKey: "sizeNum",
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
    cell: ({ row }) => {
      const size = row.getValue("sizeNum") as number;

      return <p>{byteValueNumberFormatter.format(size)}</p>;
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
      const dat = row.getValue("build_date") as string;
      const date = new Date(dat);

      const day = date.toLocaleDateString();
      const time = date.toLocaleTimeString();

      return <span>{day} at {time}</span>;
    },
  }
]

export default function List({ list }: ListProps) {
  return <TooltipProvider>
    <div className="mt-2 flex flex-col md:px-6 space-y-2 pb-3">
      <DataTable columns={columns} data={list} />
    </div>
  </TooltipProvider>;
}

function Category({ cat }: { cat: string }) {
  const cate = cat.trim();
  return <div className="p-1 px-2 border border-foreground rounded-xl">{cate.split("")[0].toUpperCase()}{cate.substring(1)}</div>;
}