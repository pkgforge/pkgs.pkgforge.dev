import * as React from "react";
import MiniSearch from "minisearch";

interface SearchResult {
  pkg_name: string;
  pkg_id: string;
  source: string;
  url: string;
}

export function useSearch(
  searchIndex: MiniSearch<SearchResult> | null,
  searchTerm: string,
  isLoading: boolean,
): SearchResult[] {
  const [results, setResults] = React.useState<SearchResult[]>([]);

  React.useEffect(() => {
    if (!searchIndex || isLoading || !searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      const searchResults = searchIndex.search(searchTerm, {
        prefix: true,
        fuzzy: true,
      });

      setResults(
        searchResults.map((result) => ({
          pkg_name: result.pkg_name as string,
          pkg_id: result.pkg_id as string,
          source: result.source as string,
          url: result.url as string,
        })),
      );
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
  }, [searchTerm, searchIndex, isLoading]);

  return results;
}
