import React from "react";
import { Flame } from "lucide-react";

interface FoodNutritionStatsProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

function formatMacro(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

const FoodNutritionStats: React.FC<FoodNutritionStatsProps> = ({
  calories,
  protein,
  carbs,
  fats,
}) => {
  return (
    <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
      <div className="flex gap-1.5">
        <span className="text-[9px] font-bold text-slate-400">
          P: {formatMacro(protein)}g
        </span>
        <span className="text-[9px] font-bold text-slate-400">
          C: {formatMacro(carbs)}g
        </span>
        <span className="text-[9px] font-bold text-slate-400">
          F: {formatMacro(fats)}g
        </span>
      </div>
      <div className="flex items-center gap-1 text-indigo-600 font-black">
        <Flame size={14} fill="currentColor" />
        <span>{Math.round(calories)}</span>
      </div>
    </div>
  );
};

export default FoodNutritionStats;
