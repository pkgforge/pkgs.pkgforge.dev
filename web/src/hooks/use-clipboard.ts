import { useState, useCallback } from "react";

export function useClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), duration);
      });
    },
    [duration],
  );

  return { copied, copy };
}
