import React from "react";
import { Utensils } from "lucide-react";
import {
  FoodCaloriesBadge,
  FoodMacrosRow,
  SUBTITLE_ROW_CLASS,
  TITLE_ROW_CLASS,
} from "./FoodNutritionStats";

interface FoodListRowProps {
  name: string;
  subtitle: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  onClick?: () => void;
  className?: string;
}

const FoodListRow: React.FC<FoodListRowProps> = ({
  name,
  subtitle,
  calories,
  protein,
  carbs,
  fats,
  onClick,
  className = "",
}) => {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`w-full group active:bg-slate-50 transition-all ${className}`}
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "1.5rem",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      <div
        className="grid min-w-0 gap-x-4 gap-y-1 items-center"
        style={{
          gridTemplateColumns: "48px minmax(0, 1fr) auto",
          gridTemplateRows: "auto auto",
        }}
      >
        <div
          className="row-span-2 flex shrink-0 items-center justify-center text-indigo-500"
          style={{
            width: 48,
            height: 48,
            background: "#eef2ff",
            borderRadius: "1rem",
          }}
        >
          <Utensils size={20} />
        </div>

        <h3
          className={`${TITLE_ROW_CLASS} font-semibold text-slate-900 capitalize truncate leading-none`}
          style={{ fontSize: "14px", margin: 0 }}
        >
          {name}
        </h3>

        <FoodCaloriesBadge calories={calories} />

        <p
          className={`${SUBTITLE_ROW_CLASS} font-black text-slate-400 uppercase tracking-widest truncate leading-none`}
          style={{ fontSize: "9px", margin: 0 }}
        >
          {subtitle}
        </p>

        <FoodMacrosRow protein={protein} carbs={carbs} fats={fats} />
      </div>
    </div>
  );
};

export default FoodListRow;
