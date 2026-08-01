import React from "react";
import { Flame } from "lucide-react";

interface MacroProps {
  protein: number;
  carbs: number;
  fats: number;
}

interface FoodNutritionStatsProps extends MacroProps {
  calories: number;
}

export const TITLE_ROW_CLASS = "h-[18px] flex items-center min-w-0";
export const SUBTITLE_ROW_CLASS = "h-[14px] flex items-center min-w-0";

function formatMacro(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export const FoodCaloriesBadge: React.FC<{ calories: number }> = ({
  calories,
}) => (
  <div
    className={`${TITLE_ROW_CLASS} justify-end gap-1 text-indigo-600 font-black`}
  >
    <Flame size={14} fill="currentColor" className="shrink-0" />
    <span className="leading-none">{Math.round(calories)}</span>
  </div>
);

export const FoodMacrosRow: React.FC<MacroProps> = ({
  protein,
  carbs,
  fats,
}) => (
  <div className={`${SUBTITLE_ROW_CLASS} justify-end gap-2`}>
    <span className="text-[9px] font-bold text-slate-400 leading-none">
      P: {formatMacro(protein)}g
    </span>
    <span className="text-[9px] font-bold text-slate-400 leading-none">
      C: {formatMacro(carbs)}g
    </span>
    <span className="text-[9px] font-bold text-slate-400 leading-none">
      F: {formatMacro(fats)}g
    </span>
  </div>
);

const FoodNutritionStats: React.FC<FoodNutritionStatsProps> = ({
  calories,
  protein,
  carbs,
  fats,
}) => (
  <div className="flex flex-col gap-1 shrink-0">
    <FoodCaloriesBadge calories={calories} />
    <FoodMacrosRow protein={protein} carbs={carbs} fats={fats} />
  </div>
);

export default FoodNutritionStats;
