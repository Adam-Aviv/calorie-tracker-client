import React from "react";

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  colorClass: string; // e.g., 'bg-emerald-500'
}

const MacroBar: React.FC<MacroBarProps> = ({
  label,
  current,
  goal,
  colorClass,
}) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <span className="text-xs font-bold text-slate-700">
          {Math.round(current)}
          <span className="text-slate-300 mx-0.5">/</span>
          {Math.round(goal)}g
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default MacroBar;
