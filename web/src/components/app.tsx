import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { ExternalLink, Image as ImageIcon, LucideTerminalSquare, Package, ScrollText, Download, Bug } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { useClipboard } from "../hooks/use-clipboard";
import FormulaLinks from "./formula-links";

interface AppProps {
  data: { [key: string]: any };
  logs: string;
  repo: string;
}

type FieldType = "link" | "version" | "size" | "date" | "hash" | "files" | "number" | "metric" | "category" | "default" | "links" | "tags";

interface ResolverField {
  label: string;
  type: FieldType;
}

const resolver: { [key: string]: ResolverField } = {
  _disabled: { label: "Disabled", type: "default" },
  pkg: { label: "Package", type: "default" },
  pkg_family: { label: "Package Family", type: "default" },
  pkg_name: { label: "Package Name", type: "default" },
  pkg_id: { label: "Package ID", type: "default" },
  bsum: { label: "BLAKE3SUM", type: "hash" },
  repology: { label: "Repology", type: "category" },
  appstream: { label: "AppStream", type: "link" },
  license: { label: "License", type: "default" },
  snapshots: { label: "Snapshots", type: "version" },
  tag: { label: "Tags", type: "tags" },
  app_id: { label: "Application ID", type: "default" },
  version: { label: "Version", type: "version" },
  version_upstream: { label: "Upstream Version", type: "version" },
  note: { label: "Note", type: "default" },
  build_date: { label: "Build Date", type: "date" },
  size: { label: "Size", type: "size" },
  download_url: { label: "Download URL", type: "link" },
  shasum: { label: "BLAKE3SUM", type: "hash" },
  src_url: { label: "Source URL", type: "link" },
  homepage: { label: "Homepage", type: "links" },
  build_script: { label: "Build Script", type: "link" },
  build_log: { label: "Build Log", type: "link" },
  build_gha: { label: "Build CI", type: "link" },
  category: { label: "Category", type: "category" },
  icon: { label: "Icon", type: "link" },
  provides: { label: "Provides", type: "default" },
  description: { label: "Description", type: "default" },
  host: { label: "Host", type: "default" },
  pkg_type: { label: "Package Type", type: "default" },
  pkg_webpage: { label: "Package Webpage", type: "link" },
  maintainer: { label: "Maintainer", type: "default" },
  rank: { label: "Rank", type: "metric" },
  build_ghactions: { label: "GH Actions Build", type: "link" },
  ghcr_blob: { label: "GHCR Blob", type: "link" },
  ghcr_files: { label: "GHCR Files", type: "files" },
  ghcr_pkg: { label: "GHCR Package", type: "link" },
  ghcr_size: { label: "GHCR Size", type: "size" },
  ghcr_size_raw: { label: "GHCR Size (Raw)", type: "size" },
  ghcr_url: { label: "GHCR URL", type: "link" },
  size_raw: { label: "Size (Raw)", type: "size" },
  manifest_url: { label: "Manifest URL", type: "link" },
  download_count: { label: "Total Downloads", type: "metric" },
  download_count_month: { label: "Monthly Downloads", type: "metric" },
  download_count_week: { label: "Weekly Downloads", type: "metric" },
  build_id: { label: "Build ID", type: "number" },
};

function Show({ value, Key, props }: { value: any, props: AppProps, Key?: string }) {
  const { copy, copied } = useClipboard();
  const field = Key ? resolver[Key] || { label: Key, type: "default" } : { label: "Default", type: "default" };

  switch (field.type) {
    case "link":
      return (
        <a href={value} target="_blank" rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
          {value}
        </a>
      );

    case "version":
      return (
        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
          {value}
        </Badge>
      );

    case "size":
      return <span className="text-amber-700 dark:text-amber-400 font-medium">{value}</span>;

    case "date":
      const date = new Date(value);
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="text-indigo-600 dark:text-indigo-400">{date.toLocaleString()}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="font-mono">{date.toISOString()}</span>
          </TooltipContent>
        </Tooltip>
      );

    case "hash":
      return (
        <Tooltip open={copied}>
          <TooltipTrigger asChild>
            <code
              onClick={() => copy(value)}
              className="font-mono text-gray-600 dark:text-gray-400 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {value}
            </code>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copied!</p>
          </TooltipContent>
        </Tooltip>
      );

    case "number":
      return <span className="font-mono text-gray-600 dark:text-gray-400">{value}</span>;

    case "metric":
      return (
        <span className="font-mono font-medium text-violet-600 dark:text-violet-400">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      );

    case "category":
      const categories = Array.isArray(value) ? value : value.split(",").filter((c: string) => c.trim() != "");
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((c: string) => {
            const cate = c.trim();

            return (
              <div key={c} className="p-1 px-2 border border-foreground rounded-xl bg-gray-100 dark:bg-gray-800 text-sm">
                {cate.split("")[0].toUpperCase()}{cate.substring(1)}
              </div>
            )
          })}
        </div>
      );

    case "files":
      const dwnl = URL.parse(props.data.download_url as string);
      const files = value as string[];
      return (
        <div className="flex space-x-1 flex-wrap">
          {files.map((s, i) => {
            dwnl?.searchParams.set("download", s);
            return (
              <div key={s} className="flex">
                <a href={dwnl?.toString()} target="_blank" rel="noreferrer"
                  className="underline underline-offset-4">
                  {s}
                </a>
                {(i + 1) !== files.length && <span className="block">,</span>}
              </div>
            );
          })}
        </div>
      );

    case "links":
      const links = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-col space-y-1">
          {links.map((link) => (
            <a key={link} href={link} target="_blank" rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
              {link}
            </a>
          ))}
        </div>
      );

    case "tags":
      const tags = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
              {tag}
            </Badge>
          ))}
        </div>
      );

    default:
      if (typeof value === "string" && value.startsWith("http")) {
        return (
          <a href={value} target="_blank" rel="noreferrer"
            className="underline underline-offset-4">
            {value}
          </a>
        );
      }
      return <span className="block">{value}</span>;
  }
}

export default function App({ data, logs: build, repo }: AppProps) {
  const { copy, copied } = useClipboard();

  // Thanks @Azathothas for forcing us to write this hellifying script
  const [, , , , , , pkg_family, pkg] = data.pkg_webpage.split("/");

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 px-5 mt-3 items-start pb-4">
        <div className="lg:max-w-[85%] rounded-lg flex flex-col flex-1">
          <h1 className="text-xl mb-4 flex justify-center items-center space-x-2 font-semibold">
            <Package className="text-blue-600 dark:text-blue-400" />
            <span>Package Details</span>
          </h1>
          <FormulaLinks
            webpage_url={data.pkg_webpage}
            repo={repo}
            arch={data.host}
            family={pkg_family}
            name={pkg}
            download_url={data.download_url}
          />
          <Table className="border border-muted/70 mt-4 rounded-xl">
            <TableBody>
              {/* <TableRow>
                <TableCell className="min-w-28 bg-muted/70 font-medium">
                  Raw
                </TableCell>
                <TableCell className="text-wrap break-all whitespace-normal">
                  <Show value={`${data.pkg_webpage}/raw.json`} props={{ data, logs: build, repo }} />
                </TableCell>
              </TableRow> */}

              {
                Object.entries(data)
                  .map(([Key, Value]) => (
                    <TableRow key={"index_" + Key + Value}>

                      <TableCell className="min-w-28 bg-muted/70 text-wrap">
                        {(resolver[Key]?.label || Key)}
                      </TableCell>
                      <TableCell className="text-wrap break-all whitespace-normal">
                        <Show value={Value} props={{ data, logs: build, repo }} Key={Key} />
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </div>

        <div className="lg:w-[15%] lg:sticky lg:top-3 flex w-full flex-col space-y-4">
          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg border bg-card">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Download className="text-blue-600 dark:text-blue-400" />
              <span>Install Package</span>
            </h2>
            <div className="w-full rounded bg-muted/70 p-2 relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <code
                    onClick={() => copy(`soar add "${data.pkg_name}#${data.pkg_id}"`)}
                    className="block cursor-pointer whitespace-pre-wrap break-all font-mono text-sm"
                  >
                    <span className="text-blue-600 dark:text-blue-400">soar</span>
                    <span className="text-foreground"> add </span>
                    <span className="text-muted-foreground">"</span>
                    <span className="text-green-600 dark:text-green-400">{data.pkg_name}</span>
                    <span className="text-muted-foreground">#</span>
                    <span className="text-red-600 dark:text-red-400">{data.pkg_id}</span>
                    <span className="text-muted-foreground">"</span>
                  </code>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Click to copy</span>
                </TooltipContent>
              </Tooltip>
              <div
                className={`absolute inset-0 bg-black/60 text-white flex cursor-pointer items-center justify-center text-xs font-medium transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
              >
                Copied!
              </div>
            </div>
            <a href="https://github.com/pkgforge/soar" target="_blank" rel="noreferrer" className="text-xs underline text-muted-foreground text-center">
              Note: Requires soar to be installed
            </a>
          </div>

          {build && (
            <div className="flex flex-col items-center space-y-2 p-3 rounded-lg border bg-card">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <ScrollText className="text-purple-600 dark:text-purple-400" />
                <span>Build Logs</span>
              </h2>
              <a href={build} target="_blank" rel="noreferrer"
                className={buttonVariants({
                  variant: "default",
                  className: "w-full flex items-center justify-center space-x-2"
                })}>
                <span>View Logs</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {data.build_script && (
            <div className="flex flex-col items-center space-y-2 p-3 rounded-lg border bg-card">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <LucideTerminalSquare className="text-green-600 dark:text-green-400" />
                <span>Build Script</span>
              </h2>
              <a href={data.build_script} target="_blank" rel="noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full flex items-center justify-center space-x-2"
                })}>
                <span>View Script</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="flex flex-col items-center space-y-2 p-3 rounded-lg border bg-card">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Bug className="text-red-600 dark:text-red-400" />
              <span>Report Issues</span>
            </h2>
            <a href="https://github.com/pkgforge/soarpkgs/issues/new/choose" target="_blank" rel="noreferrer"
              className={buttonVariants({
                variant: "outline",
                className: "w-full flex items-center justify-center space-x-2"
              })}>
              <span>Create Issue</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}