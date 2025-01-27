import { FileJson, DownloadCloud } from 'lucide-react';
import { useClipboard } from "../hooks/use-clipboard";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  webpage_url: string;
  download_url: string;
  family: string;
  name: string;
  repo: string;
  arch: string;
}

const FormulaLinks = ({ webpage_url, family, name, arch, repo, download_url }: Props) => {
  const jsonApiUrl = `${webpage_url}/raw.json`;

  const [, , , , , ...dataf] = webpage_url.split("/");

  const downloadUrl = new URL(`/dl/${dataf.join("/")}/raw.dl`, window.location.origin);

  return (
    <div className="grid gap-3 p-4 bg-blue-50/30 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-blue-700/70 dark:text-blue-300/70">Package Links</h2>
        <div className="grid gap-2">
          <a
            href={jsonApiUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full group"
          >
            <FileJson className="h-5 w-5 transition-transform duration-200 text-blue-600/70 dark:text-blue-400/70 group-hover:scale-110" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON API</span>
              <code className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                /{family}/{name}/raw.json
              </code>
            </div>
          </a>

          {download_url != "none" && <a
            href={downloadUrl.toString()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full group"
          >
            <DownloadCloud className="h-5 w-5 text-blue-600/70 dark:text-blue-400/70 group-hover:scale-110 transition-transform duration-200" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download</span>
              <code className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                /{family}/{name}/raw.dl
              </code>
            </div>
          </a>}
        </div>
      </div>
    </div>
  );
};

export default FormulaLinks;