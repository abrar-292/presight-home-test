import React from 'react';
import { FacetCount } from '../types';
import { Globe, Heart, Filter, X, RotateCcw, Check } from 'lucide-react';

interface FilterSidebarProps {
  topHobbies: FacetCount[];
  topNationalities: FacetCount[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onToggleHobby: (hobby: string) => void;
  onToggleNationality: (nat: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  topHobbies,
  topNationalities,
  selectedHobbies,
  selectedNationalities,
  onToggleHobby,
  onToggleNationality,
  onClearAll,
  className = '',
}) => {
  const totalActiveFilters = selectedHobbies.length + selectedNationalities.length;

  return (
    <aside className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
            Filters
          </h2>
          {totalActiveFilters > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
              {totalActiveFilters}
            </span>
          )}
        </div>

        {totalActiveFilters > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {totalActiveFilters > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Filters
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedNationalities.map((nat) => (
              <button
                key={`active-nat-${nat}`}
                type="button"
                onClick={() => onToggleNationality(nat)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <span>{nat}</span>
                <X className="w-3 h-3 text-blue-500" />
              </button>
            ))}

            {selectedHobbies.map((hobby) => (
              <button
                key={`active-hob-${hobby}`}
                type="button"
                onClick={() => onToggleHobby(hobby)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <span>{hobby}</span>
                <X className="w-3 h-3 text-indigo-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top 20 Nationalities */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Nationalities</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Top 20</span>
        </div>

        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
          {topNationalities.length > 0 ? (
            topNationalities.map((facet) => {
              const isSelected = selectedNationalities.includes(facet.value);
              return (
                <div
                  key={facet.value}
                  onClick={() => onToggleNationality(facet.value)}
                  className={`facet-item ${isSelected ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                    <span className="truncate text-xs">{facet.value}</span>
                  </div>
                  <span className="facet-count shrink-0">{facet.count}</span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 italic py-2">No nationalities in current result set</p>
          )}
        </div>
      </div>

      {/* Top 20 Hobbies */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-slate-500" />
            <span>Hobbies</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Top 20</span>
        </div>

        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
          {topHobbies.length > 0 ? (
            topHobbies.map((facet) => {
              const isSelected = selectedHobbies.includes(facet.value);
              return (
                <div
                  key={facet.value}
                  onClick={() => onToggleHobby(facet.value)}
                  className={`facet-item ${isSelected ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                    <span className="truncate text-xs">{facet.value}</span>
                  </div>
                  <span className="facet-count shrink-0">{facet.count}</span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 italic py-2">No hobbies in current result set</p>
          )}
        </div>
      </div>
    </aside>
  );
};
