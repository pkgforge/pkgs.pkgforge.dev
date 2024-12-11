import { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
const docco = { "hljs": { "display": "block", "overflowX": "auto", "padding": "0.5em", "color": "#000", "background": "#f8f8ff" }, "hljs-comment": { "color": "#408080", "fontStyle": "italic" }, "hljs-quote": { "color": "#408080", "fontStyle": "italic" }, "hljs-keyword": { "color": "#954121" }, "hljs-selector-tag": { "color": "#954121" }, "hljs-literal": { "color": "#954121" }, "hljs-subst": { "color": "#954121" }, "hljs-number": { "color": "#40a070" }, "hljs-string": { "color": "#219161" }, "hljs-doctag": { "color": "#219161" }, "hljs-selector-id": { "color": "#19469d" }, "hljs-selector-class": { "color": "#19469d" }, "hljs-section": { "color": "#19469d" }, "hljs-type": { "color": "#19469d" }, "hljs-params": { "color": "#00f" }, "hljs-title": { "color": "#458", "fontWeight": "bold" }, "hljs-tag": { "color": "#000080", "fontWeight": "normal" }, "hljs-name": { "color": "#000080", "fontWeight": "normal" }, "hljs-attribute": { "color": "#000080", "fontWeight": "normal" }, "hljs-variable": { "color": "#008080" }, "hljs-template-variable": { "color": "#008080" }, "hljs-regexp": { "color": "#b68" }, "hljs-link": { "color": "#b68" }, "hljs-symbol": { "color": "#990073" }, "hljs-bullet": { "color": "#990073" }, "hljs-built_in": { "color": "#0086b3" }, "hljs-builtin-name": { "color": "#0086b3" }, "hljs-meta": { "color": "#999", "fontWeight": "bold" }, "hljs-deletion": { "background": "#fdd" }, "hljs-addition": { "background": "#dfd" }, "hljs-emphasis": { "fontStyle": "italic" }, "hljs-strong": { "fontWeight": "bold" } };

import { Package, ScrollText } from "lucide-react";

interface AppProps {
  data: { [key: string]: string };
  logs: string;
}

const resolver: { [key: string]: string } = {
  pkg: "Package",
  pkg_family: "Package Family",
  pkg_name: "Package Name",
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
  const tableRef = useRef<HTMLTableElement | null>(null); // Ref to the table container
  const [tableHeight, setTableHeight] = useState<number>(0); // State to store the table's height

  useEffect(() => {
    // Function to update height dynamically
    const updateHeight = () => {
      if (tableRef.current) {
        setTableHeight(tableRef.current.offsetHeight); // Get the table's height
      }
    };

    updateHeight(); // Set the initial height
    window.addEventListener("resize", updateHeight); // Update on window resize
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 px-5 mt-3 items-stretch">
    <div className="w-full rounded-lg flex flex-col flex-1">
      <h1 className="mx-auto text-xl my-1 flex space-x-1">
        <Package />
        <span className="block">Package Details</span>
      </h1>
      <Table ref={tableRef} className="border border-muted/70 rounded-xl">
        <TableBody>
          {
            Object.entries(data)
              .map(([Key, Value]) => (
                <TableRow key={"index_" + Key + Value}>
                  <TableCell className="bg-muted/70">
                    {resolver[Key] || Key}
                  </TableCell>
                  <TableCell>
                    {Value.startsWith("http") ? <a href={Value} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:text-purple-500 underline underline-offset-4">{Value}</a> : Value}
                  </TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </div>

    <div className="md:w-[50%] flex flex-col flex-1">
      <h1 className="mx-auto text-xl my-1 flex space-x-1">
        <ScrollText />
        <span className="block">Build Logs</span>
      </h1>
      <div className="flex-1 h-full">
        <SyntaxHighlighter
          language="bash"
          wrapLongLines
          wrapLines
          showLineNumbers
          style={docco as unknown as any}
          customStyle={{
            overflow: "scroll",
            backgroundColor: "hsl(var(--muted) / 0.5)",
            color: "hsl(var(--foreground))",
            minHeight: `${tableHeight}px`,
            height: `${tableHeight}px`,
            maxHeight: `${tableHeight}px`,
          }}
        >
          {build}
        </SyntaxHighlighter>
      </div>
    </div>
  </div >
}