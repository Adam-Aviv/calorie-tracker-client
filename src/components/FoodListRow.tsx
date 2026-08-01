import React from "react";
import { Utensils } from "lucide-react";
import FoodNutritionStats from "./FoodNutritionStats";

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
      className={`w-full flex items-center justify-between group active:bg-slate-50 transition-all ${className}`}
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "1.5rem",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className="flex shrink-0 items-center justify-center text-indigo-500"
          style={{
            width: 48,
            height: 48,
            background: "#eef2ff",
            borderRadius: "1rem",
          }}
        >
          <Utensils size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-slate-900 capitalize truncate"
            style={{ fontSize: "14px", margin: 0 }}
          >
            {name}
          </h3>
          <p
            className="font-black text-slate-400 uppercase tracking-widest truncate"
            style={{ fontSize: "9px", margin: 0 }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <FoodNutritionStats
        calories={calories}
        protein={protein}
        carbs={carbs}
        fats={fats}
      />
    </div>
  );
};

export default FoodListRow;
