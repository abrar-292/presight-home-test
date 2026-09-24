import { useState, useEffect, useRef, useCallback } from 'react';
import { User, FacetCount, FilterState } from "../types";
import { fetchUsers, ApiError } from "../api/users.api";

interface UseUsersResult {
  users: User[];
  facets: {
    topHobbies: FacetCount[];
    topNationalities: FacetCount[];
  };
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  error: Error | null;
  hasMore: boolean;
  total: number;
  fetchNextPage: () => void;
  refetch: () => void;
}

const EMPTY_FACETS = { topHobbies: [] as FacetCount[], topNationalities: [] as FacetCount[] };

export function useUsers(filters: FilterState): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [facets, setFacets] = useState(EMPTY_FACETS);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (pageNum: number, isInitial: boolean) => {
      // Cancel any in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }
      setIsError(false);
      setError(null);

      try {
        const data = await fetchUsers(filters, pageNum, controller.signal);

        setUsers((prev) => (isInitial ? data.data : [...prev, ...data.data]));
        setFacets(data.facets);
        setTotal(data.pagination.total);
        setHasMore(data.pagination.hasMore);
        setPage(pageNum);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setIsError(true);
        setError(err instanceof ApiError ? err : new Error("An unexpected error occurred"));
      } finally {
        setIsLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    [filters],
  );

  // Reset to page 1 whenever filters change
  useEffect(() => {
    load(1, true);
    return () => abortControllerRef.current?.abort();
  }, [load]);

  const fetchNextPage = useCallback(() => {
    if (isLoading || isFetchingNextPage || !hasMore) return;
    load(page + 1, false);
  }, [isLoading, isFetchingNextPage, hasMore, load, page]);

  const refetch = useCallback(() => load(1, true), [load]);

  return {
    users,
    facets,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    hasMore,
    total,
    fetchNextPage,
    refetch,
  };
}
