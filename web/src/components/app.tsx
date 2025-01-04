import { Table, TableBody, TableCell, TableRow } from "./ui/table";

import { ExternalLink, Image, LucideTerminalSquare, Package, ScrollText } from "lucide-react";
import { buttonVariants } from "./ui/button";

interface AppProps {
  data: { [key: string]: any };
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

function Show({ value }: { value: any }) {
  if (typeof (value) == "object") {
    if (Array.isArray(value)) {
      return <div className="flex space-x-2">{value.map((s) => (<Show value={s} key={JSON.stringify(s)} />))}</div>;
    } else {
      return <>{JSON.stringify(value)}</>;
    }
  } else if (typeof (value) == "string") {
    if (value.startsWith("http")) {
      return <a href={value} target="_blank" rel="noreferrer" className="underline underline-offset-4">{value}</a>;
    } else {
      return <>{value}</>;
    }
  }

  return <>{JSON.stringify(value)}</>;
}

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
                    <Show value={Value} />
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