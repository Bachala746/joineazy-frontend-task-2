import React from 'react';

export const ProgressBar = ({ submitted, total, size = 'md' }) => {
  const percentage = total > 0 ? Math.min(100, Math.round((submitted / total) * 100)) : 0;
  const height = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-600">
        <span>Submissions Progress</span>
        <span className="text-slate-800 font-bold">
          {submitted} of {total} ({percentage}%)
        </span>
      </div>
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height} p-0.5 border border-slate-200`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            percentage === 100
              ? 'bg-emerald-500'
              : percentage >= 50
              ? 'bg-indigo-600'
              : 'bg-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};