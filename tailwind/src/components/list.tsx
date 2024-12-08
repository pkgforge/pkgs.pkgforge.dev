import { useEffect, useState } from "react";

interface ListProps {
}

export default function List(props: ListProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const pg = Number(urlParams.get("page"));

    if (pg > 0 && pg != 1) {
      setPage(pg);
    }
  }, []);

  return <>{page}</>;
}