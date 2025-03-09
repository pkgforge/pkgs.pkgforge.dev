import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowDownWideNarrow, ArrowUpDown, ExternalLinkIcon, Package } from "lucide-react";
import { DataTable } from "./data-table-family";
import { TooltipProvider } from "./ui/tooltip";

interface Family { name: string, url: string };

interface FamilyProps {
  apps: Family[];
  name: string;
}

const columns: ColumnDef<Family>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size='sm'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Package Name
          {column.getIsSorted() === "asc" ? (
            <ArrowDownWideNarrow className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      return <a className="font-medium hover:underline px-4" href={row.original.url}>{row.getValue("name")}</a>;
    }
  },
  {
    accessorKey: "url",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <a 
          className="flex items-center gap-1 hover:underline text-sm text-muted-foreground"
          href={row.original.url}
        >
          <span>Open</span>
          <ExternalLinkIcon className="h-3 w-3" />
        </a>
      );
    }
  }
];

export default function App({ apps, name }: FamilyProps) {
  return (
    <div className="mt-2 flex flex-col md:px-6 space-y-4 pb-3">
      <div className="flex flex-col items-center my-4 space-y-2">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Package className="h-6 w-6" />
          <span>{name}</span>
        </h1>
        <p className="text-muted-foreground">
          A collection of {apps.length} packages
        </p>
      </div>
      <TooltipProvider>
        <DataTable columns={columns} data={apps} />
      </TooltipProvider>
    </div>
  )
}