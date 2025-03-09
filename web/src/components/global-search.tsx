import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { Search, Copy, ExternalLink } from "lucide-react";
import { useClipboard } from "@/hooks/use-clipboard";
import { Badge } from "./ui/badge";
import useGlobalSearch from "@/hooks/use-global-search";
import useDebounce from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";

interface SearchResult {
  pkg_name: string;
  pkg_id: string;
  source: string;
  url: string;
}

const SearchResultItem = React.memo(
  ({
    item,
    onCopy,
  }: {
    item: SearchResult;
    onCopy: (name: string, id: string, e: React.MouseEvent) => void;
  }) => {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
      let timer: NodeJS.Timeout;

      if (copied) {
        timer = setTimeout(() => {
          setCopied(false);
        }, 2000);
      }

      return () => {
        clearTimeout(timer);
      };
    }, [copied]);

    const handleCopyInstall = (e: React.MouseEvent) => {
      onCopy(item.pkg_name, item.pkg_id, e);
      setCopied(true);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
      window.open(item.url, "_blank");
    };

    return (
      <CommandItem
        className="h-[80px] flex hover:cursor-pointer flex-col items-start justify-center"
        value={`${item.pkg_name}#${item.pkg_id}#${item.source}`}
      >
        <div className="flex items-center w-full">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <span className="font-medium">{item.pkg_name}</span>
              <Badge className="ml-2 text-[10px]">{item.source}</Badge>
            </div>
            <Badge variant="outline">{item.pkg_id}</Badge>
          </div>
          <div className="ml-auto flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleLinkClick}>
              <ExternalLink className="h-1.5 w-1.5 mr-1" /> Open
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyInstall}>
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <Copy className="h-1.5 w-1.5 mr-1" /> Install
                </>
              )}
            </Button>
          </div>
        </div>
      </CommandItem>
    );
  },
);

SearchResultItem.displayName = "SearchResultItem";

export function GlobalSearch() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { copy } = useClipboard();
  const dialogDescriptionId = React.useId();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { searchIndex, isLoading, open, handleOpen } = useGlobalSearch();

  const results = useSearch(searchIndex, debouncedSearchTerm, isLoading);

  const handleCopy = React.useCallback(
    (pkgName: string, pkgId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      copy(`soar add "${pkgName}#${pkgId}"`);
    },
    [copy],
  );

  const showStartTypingPrompt = !isLoading && searchTerm.trim() === "";

  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const renderVirtualItems = React.useCallback(() => {
    return results.map((item, i) => {
      return (
        <div
          key={i}
          style={{
            //position: 'absolute',
            top: 0,
            left: 0,
            width: "100%",
            //height: `${virtualRow.size}px`,
            //transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          <SearchResultItem item={item} onCopy={handleCopy} />
        </div>
      );
    });
  }, [results, handleCopy]);

  const SearchButton = React.useMemo(
    () => (
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => handleOpen(true)}
        aria-label="Search packages"
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search packages...</span>
        <kbd className="pointer-events-none absolute right-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    ),
    [handleOpen],
  );

  return (
    <>
      {SearchButton}
      <CommandDialog
        open={open}
        onOpenChange={handleOpen}
        aria-describedby={dialogDescriptionId}
      >
        <div id={dialogDescriptionId} className="sr-only">
          Search and select packages from various repositories. Use up and down
          arrow keys to navigate results. Press Enter to select a package. Press
          Escape to close the dialog.
        </div>
        <CommandInput
          placeholder="Search all packages..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          autoFocus
        />
        <CommandList ref={parentRef} className="max-h-[400px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              Loading packages...
            </div>
          ) : showStartTypingPrompt ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              Start typing to search packages...
            </div>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              {results.length > 0 && (
                <CommandGroup>
                  <div
                    style={{
                      height: `40vh`,
                      width: "100%",
                      position: "relative",
                    }}
                    className="flex flex-col overflow-hidden overflow-y-scroll"
                  >
                    {renderVirtualItems()}
                  </div>
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
