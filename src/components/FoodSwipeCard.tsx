import React, { useEffect, useRef, useState } from "react";
import { createGesture } from "@ionic/core";
import { Edit3, Trash2, Utensils } from "lucide-react";
import type { Food } from "../types";
import {
  FoodCaloriesBadge,
  FoodMacrosRow,
  SUBTITLE_ROW_CLASS,
  TITLE_ROW_CLASS,
} from "./FoodNutritionStats";

const BUTTON_WIDTH = 88;
const BUTTON_GAP = 8;
const ACTIONS_WIDTH = BUTTON_WIDTH * 2 + BUTTON_GAP;

interface FoodSwipeCardProps {
  food: Food;
  onEdit: () => void;
  onDelete: () => void;
}

const FoodSwipeCard: React.FC<FoodSwipeCardProps> = ({
  food,
  onEdit,
  onDelete,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef(0);
  const [reveal, setReveal] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    revealRef.current = reveal;
  }, [reveal]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const clamp = (v: number) => Math.max(0, Math.min(ACTIONS_WIDTH, v));
    let startReveal = 0;

    const gesture = createGesture({
      el,
      gestureName: "food-swipe",
      direction: "x",
      threshold: 4,
      disableScroll: true,
      onStart: () => {
        startReveal = revealRef.current;
        setDragging(true);
      },
      onMove: (detail) => {
        // Left swipe → negative deltaX → reveal increases
        const next = clamp(startReveal - detail.deltaX);
        revealRef.current = next;
        setReveal(next);
      },
      onEnd: (detail) => {
        const projected = clamp(
          startReveal - detail.deltaX - detail.velocityX * 80
        );
        const next = projected > ACTIONS_WIDTH / 2 ? ACTIONS_WIDTH : 0;
        revealRef.current = next;
        setReveal(next);
        setDragging(false);
      },
    });

    gesture.enable(true);
    return () => gesture.destroy();
  }, []);

  const close = () => {
    revealRef.current = 0;
    setReveal(0);
  };

  const transition = dragging ? "none" : "width 0.2s ease, opacity 0.15s ease";
  const railWidth = reveal;

  return (
    <div
      ref={rootRef}
      className="flex w-full items-stretch"
      style={{
        background: "#ffffff",
        borderRadius: "1.5rem",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        overflow: "hidden",
      }}
    >
      <div
        className="flex min-w-0 flex-1 items-stretch"
        style={{ padding: 16, paddingRight: 0 }}
      >
        <div
          className="grid min-w-0 flex-1 gap-x-4 gap-y-1 items-center"
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
            className={`${TITLE_ROW_CLASS} truncate font-semibold capitalize text-slate-900 leading-none`}
            style={{ fontSize: 14, margin: 0 }}
          >
            {food.name}
          </h3>

          <div
            style={{
              opacity: reveal > 24 ? 0 : 1,
              transition,
              pointerEvents: reveal > 0 ? "none" : "auto",
            }}
          >
            <FoodCaloriesBadge calories={food.calories} />
          </div>

          <p
            className={`${SUBTITLE_ROW_CLASS} truncate font-black uppercase tracking-widest text-slate-400 leading-none`}
            style={{ fontSize: 9, margin: 0 }}
          >
            {food.servingSize} {food.servingUnit} • {food.category}
          </p>

          <div
            style={{
              opacity: reveal > 24 ? 0 : 1,
              transition,
              pointerEvents: reveal > 0 ? "none" : "auto",
            }}
          >
            <FoodMacrosRow
              protein={food.protein}
              carbs={food.carbs}
              fats={food.fats}
            />
          </div>
        </div>
      </div>

      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: railWidth,
          transition,
        }}
      >
        <div
          className="flex h-full"
          style={{
            width: ACTIONS_WIDTH,
            gap: BUTTON_GAP,
            opacity: reveal > 8 ? 1 : 0,
            transform: `translateX(${ACTIONS_WIDTH - reveal}px)`,
            transition: dragging
              ? "none"
              : "transform 0.2s ease, opacity 0.15s ease",
            pointerEvents: reveal > ACTIONS_WIDTH / 2 ? "auto" : "none",
          }}
        >
          <button
            type="button"
            onClick={() => {
              close();
              onEdit();
            }}
            className="flex h-full items-center justify-center bg-slate-100 text-slate-600"
            style={{ width: BUTTON_WIDTH, flexShrink: 0 }}
          >
            <Edit3 size={22} />
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              onDelete();
            }}
            className="flex h-full items-center justify-center bg-rose-500 text-white"
            style={{ width: BUTTON_WIDTH, flexShrink: 0 }}
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodSwipeCard;
