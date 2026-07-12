import React from "react";
import { Utensils, Zap } from "lucide-react";
import type { Food } from "../types";

interface FoodCardProps {
  food: Food;
  onClick?: () => void;
  /** When false, renders content only (for use inside a framed swipe row). */
  framed?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onClick,
  framed = true,
}) => {
  const inner = (
    <>
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
            {food.name}
          </h3>
          <p
            className="font-black text-slate-400 uppercase tracking-widest truncate"
            style={{ fontSize: "9px", margin: 0 }}
          >
            {food.servingSize} {food.servingUnit} • {food.category}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 ml-2">
        <div className="flex items-center gap-1 text-indigo-600 font-black">
          <Zap size={14} fill="currentColor" />
          <span>{Math.round(food.calories)}</span>
        </div>
        <div className="flex gap-2 mt-1">
          <span className="text-[9px] font-bold text-slate-400">
            P: {food.protein}g
          </span>
          <span className="text-[9px] font-bold text-slate-400">
            C: {food.carbs}g
          </span>
          <span className="text-[9px] font-bold text-slate-400">
            F: {food.fats}g
          </span>
        </div>
      </div>
    </>
  );

  if (!framed) {
    return (
      <div
        role={onClick ? "button" : undefined}
        onClick={onClick}
        className="w-full flex items-center justify-between"
        style={{ padding: "16px", background: "#ffffff" }}
      >
        {inner}
      </div>
    );
  }

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
      className="w-full flex items-center justify-between group active:bg-slate-50 transition-all"
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "1.5rem",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      {inner}
    </div>
  );
};

export default FoodCard;
