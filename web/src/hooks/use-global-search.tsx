import * as React from "react";
import MiniSearch from "minisearch";

import binX86 from "../metadata_bincache_x86_64-linux.json";
import binArm64 from "../metadata_bincache_aarch64-linux.json";
import soarPkgs from "../metadata_soarpkgs_[category].json";
import pkgArm64 from "../metadata_pkgcache_aarch64-linux.json";
import pkgX86 from "../metadata_pkgcache_x86_64-linux.json";

interface SearchResult {
  pkg_name: string;
  pkg_id: string;
  source: string;
  url: string;
}

function useGlobalSearch() {
  const [open, setOpen] = React.useState(false);

  const [searchIndex, setSearchIndex] =
    React.useState<MiniSearch<SearchResult> | null>(null);
  const [allDocs, setAllDocs] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeSearch = async () => {
      try {
        setIsLoading(true);

        const combinedDocs = [
          ...binX86.map((pkg) => ({
            id: `${pkg.family}#${pkg.name}x86_64-bin`,
            pkg_name: pkg.name,
            pkg_id: pkg.family,
            url: pkg.url,
            source: "x86_64-bin",
          })),
          ...binArm64.map((pkg) => ({
            id: `${pkg.family}#${pkg.name}aarch64-bin`,
            pkg_name: pkg.name,
            pkg_id: pkg.family,
            url: pkg.url,
            source: "aarch64-bin",
          })),
          ...soarPkgs.map((pkg) => ({
            id: `${pkg.family}#${pkg.name}soar`,
            pkg_name: pkg.name,
            pkg_id: pkg.family,
            url: pkg.url,
            source: "soar",
          })),
          ...pkgArm64.map((pkg) => ({
            id: `${pkg.family}#${pkg.name}aarch64-pkg`,
            pkg_name: pkg.name,
            pkg_id: pkg.family,
            url: pkg.url,
            source: "aarch64-pkg",
          })),
          ...pkgX86.map((pkg) => ({
            id: `${pkg.family}#${pkg.name}x86_64-pkg`,
            pkg_name: pkg.name,
            pkg_id: pkg.family,
            url: pkg.url,
            source: "x86_64-pkg",
          })),
        ];

        const miniSearch = new MiniSearch<SearchResult>({
          fields: ["pkg_name", "pkg_id"],
          storeFields: ["pkg_name", "pkg_id", "source", "url"],
          searchOptions: {
            boost: { pkg_name: 2 },
            fuzzy: 0.2,
            prefix: true,
          },
        });

        miniSearch.addAll(combinedDocs);
        setSearchIndex(miniSearch);
        setAllDocs(combinedDocs);
      } catch (error) {
        console.error("Failed to initialize search:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSearch();
  }, []);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  React.useLayoutEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleOpen = React.useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  return { searchIndex, allDocs, isLoading, open, handleOpen };
}

export default useGlobalSearch;
