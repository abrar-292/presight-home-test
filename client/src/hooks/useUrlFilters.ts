import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { FilterState, SortField, SortOrder } from '../types';

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => {
    const search = searchParams.get('q') || searchParams.get('search') || '';
    
    const natParam = searchParams.get('nat') || searchParams.get('nationalities') || '';
    const nationalities = natParam ? natParam.split(',').filter(Boolean) : [];

    const hobParam = searchParams.get('hob') || searchParams.get('hobbies') || '';
    const hobbies = hobParam ? hobParam.split(',').filter(Boolean) : [];

    const rawSort = searchParams.get('sort') || searchParams.get('sortField') || 'first_name';
    const sortField: SortField = ['first_name', 'last_name', 'age', 'nationality'].includes(rawSort)
      ? (rawSort as SortField)
      : 'first_name';

    const rawOrder = searchParams.get('order') || searchParams.get('sortOrder') || 'asc';
    const sortOrder: SortOrder = rawOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';

    return {
      search,
      nationalities,
      hobbies,
      sortField,
      sortOrder,
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const merged: FilterState = {
        ...filters,
        ...newFilters,
      };

      const params = new URLSearchParams();

      if (merged.search.trim()) {
        params.set('q', merged.search.trim());
      }

      if (merged.nationalities.length > 0) {
        params.set('nat', merged.nationalities.join(','));
      }

      if (merged.hobbies.length > 0) {
        params.set('hob', merged.hobbies.join(','));
      }

      if (merged.sortField && merged.sortField !== 'first_name') {
        params.set('sort', merged.sortField);
      }

      if (merged.sortOrder && merged.sortOrder !== 'asc') {
        params.set('order', merged.sortOrder);
      }

      setSearchParams(params, { replace: true });
    },
    [filters, setSearchParams]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  const toggleNationality = useCallback(
    (nat: string) => {
      const exists = filters.nationalities.includes(nat);
      const updated = exists
        ? filters.nationalities.filter((n) => n !== nat)
        : [...filters.nationalities, nat];
      updateFilters({ nationalities: updated });
    },
    [filters.nationalities, updateFilters]
  );

  const toggleHobby = useCallback(
    (hobby: string) => {
      const exists = filters.hobbies.includes(hobby);
      const updated = exists
        ? filters.hobbies.filter((h) => h !== hobby)
        : [...filters.hobbies, hobby];
      updateFilters({ hobbies: updated });
    },
    [filters.hobbies, updateFilters]
  );

  const setSorting = useCallback(
    (sortField: SortField, sortOrder: SortOrder) => {
      updateFilters({ sortField, sortOrder });
    },
    [updateFilters]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.sortField !== 'first_name') {
      params.set('sort', filters.sortField);
    }
    if (filters.sortOrder !== 'asc') {
      params.set('order', filters.sortOrder);
    }
    setSearchParams(params, { replace: true });
  }, [filters.sortField, filters.sortOrder, setSearchParams]);

  return {
    filters,
    updateFilters,
    setSearch,
    toggleNationality,
    toggleHobby,
    setSorting,
    clearAllFilters,
  };
}
