import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { DataTable } from "./data-table";
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
  "Build Date": string,
  url: string,
  familyUrl: string,
}

// const byteValueNumberFormatter = Intl.NumberFormat("en", {
//   notation: "compact",
//   style: "unit",
//   unit: "byte",
//   unitDisplay: "narrow",
// });

const columns: (page: string) => ColumnDef<ListItem>[] = (page) => ([
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
    cell: ({ row }) => {
      return <a className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4" href={row.original.url}>{row.getValue("name")}</a>;
    }
  },
  {
    accessorKey: "family",
    header: ({ column }) => {
      return (
        <div
          className="flex"
        >
          Package ID
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
      return <a className="text-purple-600 dark:text-purple-400 hover:underline underline-offset-4" href={"/repo" + row.original.familyUrl}>{row.original.family}</a>
    }
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => {
      return (
        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
          {row.getValue("version")}
        </Badge>
      )
    }
  },
  {
    accessorKey: "sha",
    header: "SHA Sum",
    cell: ({ row }) => {
      const sha = row.getValue("sha") as string;

      if (!sha) {
        return <p className="font-mono text-center"> - </p>
      }

      return <Tooltip>
        <TooltipTrigger className="font-mono text-gray-600 dark:text-gray-400">{sha.length > 10 ? `${sha.substring(0, 10)}...` : sha}</TooltipTrigger>
        <TooltipContent className="text-wrap">
          <p className="break-all whitespace-normal font-mono">{sha}</p>
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
    cell: ({ row }) => {
      return <p className="text-amber-700 dark:text-amber-400 font-medium">{row.getValue('size')}</p>;
    },
  },
  {
    accessorKey: "category",
    header: "Categories",
    cell: ({ row }) => {
      const cate = row.getValue("category") as string;
      const cates: string[] = Array.isArray(cate) ? cate : cate.split(",").filter((c) => c.trim() != "");

      return <>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-wrap gap-1">
              {cates.slice(0, 3).map((c) => <Category key={c} cat={c} />)}
              {cates.length > 3 ? <p className="mt-auto text-gray-500">...</p> : ""}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-wrap gap-1">
              {cates.map((c) => <Category key={c} cat={c} />)}
            </div>
          </TooltipContent>
        </Tooltip>
      </>;
    },
  },
  {
    accessorKey: page != "soarpkgs" ? "Build Date" : "Package Type",
    header: ({ column }) => {
      return (
        <div
          className="flex"
        >
          {page != "soarpkgs" ? "Build Date" : "Package Type"}
          {page != "soarpkgs" && <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-6 w-8 rounded-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>}
        </div>
      )
    },
    cell: ({ row }) => {
      const dat = row.original["Build Date"] || row.original.type as string;
      const date = new Date(dat);

      const day = date.toLocaleDateString();

      if (row.original.type) {
        return <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">{dat}</span>;
      }

      if (day == "Invalid Date") {
        return <Tooltip>
          <TooltipTrigger>
            <span className="italic text-gray-500">Unknown</span>
          </TooltipTrigger>
          <TooltipContent>
            The Build Date is not available
          </TooltipContent>
        </Tooltip>;
      }

      return <Tooltip>
        <TooltipTrigger>
          <span className="text-indigo-600 dark:text-indigo-400">{date.toLocaleString()}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span className="font-mono">{date.toISOString()}</span>
        </TooltipContent>
      </Tooltip>;
    },
  }
]);

function ShowList() {
  return <TooltipProvider>
    <div className="mt-2 flex flex-col md:px-6 space-y-2 pb-3">
      <DataTable columns={columns} />
    </div>
  </TooltipProvider>;
}

export default function List() {
  return <ShowList />;
}

function Category({ cat }: { cat: string }) {
  const cate = cat.trim();
  return <div className="p-1 px-2 border border-foreground rounded-xl bg-gray-100 dark:bg-gray-800 text-sm">{cate.split("")[0].toUpperCase()}{cate.substring(1)}</div>;
}