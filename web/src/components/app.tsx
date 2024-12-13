import { Table, TableBody, TableCell, TableRow } from "./ui/table";

import { ExternalLink, Image, LucideTerminalSquare, Package, ScrollText } from "lucide-react";
import { buttonVariants } from "./ui/button";

interface AppProps {
  data: { [key: string]: string };
  logs: string;
}

const resolver: { [key: string]: string } = {
  _disabled: "Disabled",
  pkg: "Package",
  pkg_family: "Package Family",
  pkg_name: "Package Name",
  pkg_id: "Package ID",
  bsum: "B Sum",
  repology: "Repology",
  appstream: "AppStream",
  license: "License",
  snapshots: "Snapshots",
  tag: "Tag",
  app_id: "Application ID",
  version: "Version",
  note: "Note",
  build_date: "Build Date",
  size: "Size",
  download_url: "Download URL",
  shasum: "SHA Sum",
  src_url: "Source URL",
  homepage: "Homepage",
  build_script: "Build Script",
  build_log: "Build Log",
  category: "Category",
  icon: "Icon",
  provides: "Provides",
  description: "Description",
};

export default function App({ data, logs: build }: AppProps) {
  return <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 px-5 mt-3 items-stretch pb-4">
    <div className="md:max-w-[90%] rounded-lg flex flex-col flex-1">
      <h1 className="mx-auto text-xl my-1 flex items-center space-x-1">
        <Package size={"1em"} />
        <span className="block">Package Details</span>
      </h1>
      <Table className="border border-muted/70 rounded-xl">
        <TableBody>
          {
            Object.entries(data)
              .map(([Key, Value]) => (
                <TableRow key={"index_" + Key + Value}>
                  <TableCell className="min-w-28 bg-muted/70 text-wrap">
                    {resolver[Key] || Key}
                  </TableCell>
                  <TableCell className="text-wrap break-all whitespace-normal">
                    {(typeof (Value) == "object" && !Array.isArray(Value)) && JSON.stringify(Value, null, 2)}
                    {Array.isArray(Value) && Value.join(", ")}
                    {(typeof (Value) != "object") && (String(Value).startsWith("http") ? <a href={Value} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:text-purple-500 underline underline-offset-4">{Value}</a> : Value)}
                  </TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </div>

    <div className="md:max-w-[15%] h-auto flex flex-col">
      {build && <>
        <h1 className="mx-auto text-xl mb-2 flex items-center space-x-1">
          <ScrollText size={"1em"} />
          <span className="block">Build Logs</span>
        </h1>
        <div className="mx-auto mb-2">
          {/* <a href={build} target="_blank" rel="noreferrer" className="mx-auto text-blue-500 dark:text-blue-400 hover:text-purple-500 underline underline-offset-4">Click here to view build logs</a> */}
          <a href={build} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", variant: "default" })}>View <ExternalLink /> </a>
        </div>
      </>}

      {data.build_script && <>
        <h1 className="mx-auto text-xl mb-2 flex items-center space-x-1">
          <LucideTerminalSquare size={"1em"} />
          <span className="block">Build Script</span>
        </h1>
        <div className="mx-auto mb-2">
          {/* <a href={build} target="_blank" rel="noreferrer" className="mx-auto text-blue-500 dark:text-blue-400 hover:text-purple-500 underline underline-offset-4">Click here to view build logs</a> */}
          <a href={data.build_script} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", variant: "outline" })}>View <ExternalLink /> </a>
        </div>
      </>}

      {data.icon && <>
        <h1 className="mx-auto text-xl mb-2 flex items-center space-x-1">
          <Image size={"1em"} />
          <span className="block">Icon</span>
        </h1>
        <div className="mx-auto mb-2">
          {/* <a href={build} target="_blank" rel="noreferrer" className="mx-auto text-blue-500 dark:text-blue-400 hover:text-purple-500 underline underline-offset-4">Click here to view build logs</a> */}
          <a href={data.icon} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", variant: "outline" })}>View <ExternalLink /> </a>
        </div>
      </>}
    </div>
  </div >
}