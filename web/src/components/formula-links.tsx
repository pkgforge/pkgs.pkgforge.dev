import { FileJson, DownloadCloud, Copy, ExternalLink } from 'lucide-react';
import { useClipboard } from '../hooks/use-clipboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useState } from 'react';

interface Props {
  webpage_url: string;
  repo: string;
}

const FormulaLinks = ({ webpage_url, repo }: Props) => {
  const { copy } = useClipboard();
  const [jsonCopied, setJsonCopied] = useState(false);
  const [downloadCopied, setDownloadCopied] = useState(false);
  const jsonApiUrl = `${webpage_url}/raw.json`;

  const [, , , , ...dataf] = webpage_url.split("/");
  const downloadUrl = new URL(`/dl/${dataf.join("/")}/raw.dl`, window.location.origin);

  const handleJsonCopy = () => {
    copy(jsonApiUrl);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleDownloadCopy = () => {
    copy(downloadUrl.toString());
    setDownloadCopied(true);
    setTimeout(() => setDownloadCopied(false), 2000);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="grid gap-3 p-4 bg-blue-50/30 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-blue-700/70 dark:text-blue-300/70">Package Links</h2>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 w-full group">
              <FileJson className="h-5 w-5 text-blue-600/70 dark:text-blue-400/70" />
              <div className="flex flex-col items-start gap-1 flex-1">
                <span className="text-sm font-medium">JSON API</span>
                <div className="flex items-center gap-2 w-full">
                  <Tooltip open={jsonCopied}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleJsonCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors flex-1"
                      >
                        <code className="text-xs font-mono">{jsonApiUrl}</code>
                        <Copy className="h-4 w-4 shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copied!</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <a 
                    href={jsonApiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors flex items-center gap-2"
                  >
                    <span className="text-xs">Open</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {repo != "soarpkgs" && (
              <div className="flex items-center gap-3 w-full group">
                <DownloadCloud className="h-5 w-5 text-blue-600/70 dark:text-blue-400/70" />
                <div className="flex flex-col items-start gap-1 flex-1">
                  <span className="text-sm font-medium">Download URL</span>
                  <div className="flex items-center gap-2 w-full">
                    <Tooltip open={downloadCopied}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleDownloadCopy}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors flex-1"
                        >
                          <code className="text-xs font-mono">{downloadUrl.toString()}</code>
                          <Copy className="h-4 w-4 shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copied!</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <a 
                      href={downloadUrl.toString()}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors flex items-center gap-2"
                    >
                      <span className="text-xs">Download</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FormulaLinks;