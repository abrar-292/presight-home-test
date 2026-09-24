import React from 'react';
import { SortField, SortOrder } from '../types';
import { ArrowDownAZ, ArrowUpZA, ArrowDown01, ArrowUp10 } from 'lucide-react';

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortOrder,
  onSortChange,
}) => {
  const toggleOrder = () => onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc');

  const isNumeric = sortField === 'age';

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <select
          value={sortField}
          onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
          aria-label="Sort by field"
          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer transition-all"
        >
          <option value="first_name">Sort: First Name</option>
          <option value="last_name">Sort: Last Name</option>
          <option value="age">Sort: Age</option>
          <option value="nationality">Sort: Nationality</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-xs">
          ▼
        </div>
      </div>

      <button
        type="button"
        onClick={toggleOrder}
        className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
        title={`Sort direction: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
      >
        {isNumeric ? (
          sortOrder === 'asc' ? (
            <ArrowDown01 className="w-4 h-4 text-blue-600" />
          ) : (
            <ArrowUp10 className="w-4 h-4 text-blue-600" />
          )
        ) : sortOrder === 'asc' ? (
          <ArrowDownAZ className="w-4 h-4 text-blue-600" />
        ) : (
          <ArrowUpZA className="w-4 h-4 text-blue-600" />
        )}
      </button>
    </div>
  );
};
