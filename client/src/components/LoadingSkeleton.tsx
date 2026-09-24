import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border border-slate-200/80 bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between h-40 animate-pulse"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <div className="h-6 bg-slate-200 rounded-full w-20" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
