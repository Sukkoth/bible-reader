import { useCallback, useEffect, useState } from "react";

type UseFetchResult<T> = {
  data: T | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
  isPending: boolean;
  // eslint-disable-next-line no-unused-vars
  fetchData: (options?: RequestInit) => Promise<void>;
};

function useFetch<T>(
  url: string,
  initialFetch: boolean = true
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const fetchData = useCallback(
    async (options?: RequestInit) => {
      setIsPending(true);
      setError(null);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const result = await response.json();
          setError(
            result
              ? result
              : {
                  message: "failed to fetch",
                }
          );
          return;
        }
        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsPending(false);
      }
    },
    [url]
  );

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [initialFetch, fetchData]);

  return { data, error, isPending, fetchData };
}

export default useFetch;
