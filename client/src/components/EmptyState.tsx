import React from 'react';
import { UserX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  hasFilters: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset, hasFilters }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <UserX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">No users found</h3>
      <p className="text-sm text-slate-500 mb-6 text-center">
        {hasFilters
          ? 'No profiles match your current search and filter combination. Try adjusting or clearing some filters.'
          : 'There are currently no users in the directory database.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear all filters</span>
        </button>
      )}
    </div>
  );
};
