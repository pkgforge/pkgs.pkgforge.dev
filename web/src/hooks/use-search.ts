import * as React from 'react';
import MiniSearch from 'minisearch';

interface SearchResult {
  pkg_name: string;
  pkg_id: string;
  source: string;
  url: string;
}

export function useSearch(
  searchIndex: MiniSearch<SearchResult> | null,
  searchTerm: string,
  isLoading: boolean
): SearchResult[] {
  const [results, setResults] = React.useState<SearchResult[]>([]);

  React.useEffect(() => {
    if (!searchIndex || isLoading || !searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    const searchResults = searchIndex.search(searchTerm, {
      prefix: true,
      fuzzy: true,
    });
    
    setResults(searchResults.map(result => result as unknown as SearchResult));
  }, [searchTerm, searchIndex, isLoading]);

  return results;
}
