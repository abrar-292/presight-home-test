import React, { useState } from 'react';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { useUsers } from '../hooks/useUsers';
import { SearchBar } from '../components/SearchBar';
import { SortControls } from '../components/SortControls';
import { FilterSidebar } from '../components/FilterSidebar';
import { UserList } from '../components/UserList';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Users, Filter as FilterIcon, X, SlidersHorizontal } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    filters,
    setSearch,
    toggleNationality,
    toggleHobby,
    setSorting,
    clearAllFilters,
  } = useUrlFilters();

  const {
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
  } = useUsers(filters);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const totalActiveFilters = filters.nationalities.length + filters.hobbies.length;
  const hasActiveFilters = Boolean(filters.search || totalActiveFilters > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>User Directory</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                  Presight
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Search, filter, and explore profiles with live dynamic facets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Total Results Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200/60">
              <span>Total Profiles:</span>
              <span className="text-blue-600 font-bold">{total.toLocaleString()}</span>
            </div>

            {/* Mobile Filter Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden relative flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
              {totalActiveFilters > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {totalActiveFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        {/* Top Control Bar: Search & Sort */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          <div className="flex-1 max-w-xl">
            <SearchBar
              value={filters.search}
              onChange={setSearch}
              placeholder="Search across first and last name..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 shrink-0">
            <div className="w-full md:w-64">
              <SortControls
                sortField={filters.sortField}
                sortOrder={filters.sortOrder}
                onSortChange={setSorting}
              />
            </div>
          </div>
        </div>

        {/* Content Area: Sidebar + Directory Grid */}
        <div className="flex-1 flex gap-6 items-start min-h-[calc(100vh-240px)]">
          {/* Desktop Sticky Sidebar */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-24">
            <FilterSidebar
              topHobbies={facets.topHobbies}
              topNationalities={facets.topNationalities}
              selectedHobbies={filters.hobbies}
              selectedNationalities={filters.nationalities}
              onToggleHobby={toggleHobby}
              onToggleNationality={toggleNationality}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* Directory Content Area */}
          <section className="flex-1 flex flex-col h-[calc(100vh-230px)] min-h-125 w-full">
            {isLoading ? (
              <div className="overflow-y-auto flex-1">
                <LoadingSkeleton count={9} />
              </div>
            ) : isError ? (
              <ErrorState message={error?.message} onRetry={refetch} />
            ) : users.length === 0 ? (
              <EmptyState onReset={clearAllFilters} hasFilters={hasActiveFilters} />
            ) : (
              <UserList
                users={users}
                selectedHobbies={filters.hobbies}
                selectedNationalities={filters.nationalities}
                onHobbyClick={toggleHobby}
                onNationalityClick={toggleNationality}
                onLoadMore={fetchNextPage}
                hasMore={hasMore}
                isFetchingNextPage={isFetchingNextPage}
              />
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filters Modal Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col animate-fade-in">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FilterIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar
                topHobbies={facets.topHobbies}
                topNationalities={facets.topNationalities}
                selectedHobbies={filters.hobbies}
                selectedNationalities={filters.nationalities}
                onToggleHobby={toggleHobby}
                onToggleNationality={toggleNationality}
                onClearAll={clearAllFilters}
                className="border-0 shadow-none p-0"
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                View {total.toLocaleString()} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
