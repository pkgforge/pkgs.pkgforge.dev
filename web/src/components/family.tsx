import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowDownWideNarrow, ArrowUpDown, ExternalLinkIcon, Package } from "lucide-react";
import { DataTable } from "./data-table-family";
import { TooltipProvider } from "./ui/tooltip";

interface Family { name: string, url: string };

interface FamilyProps {
  apps: Family[];
}

const columns: ColumnDef<Family>[] = [
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
      return <a className="font-bold underline underline-offset-4" href={row.original.url}>{row.getValue("name")}</a>;
    }
  },
  {
    accessorKey: "url",
    header: "",
    cell: ({ row }) => {
      return <a className="w-14 ml-auto mr-2 underline underline-offset-4 flex" href={row.original.url}><span>View</span> <ExternalLinkIcon className="h-3 w-3" /></a>;
    }
  }
];

export default function App({ apps }: FamilyProps) {
  return (
    <div className="mt-2 flex flex-col md:px-6 space-y-2 pb-3">
      <h1 className="flex mx-auto space-x-1"><Package /> <span>{apps.length} Packages under this family</span></h1>
      <TooltipProvider>
        <DataTable columns={columns} data={apps} />
      </TooltipProvider>
    </div>
  )
}