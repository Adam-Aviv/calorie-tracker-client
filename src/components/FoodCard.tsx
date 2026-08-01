import React from "react";
import type { Food } from "../types";
import FoodListRow from "./FoodListRow";

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
}) => (
  <FoodListRow
    name={food.name}
    subtitle={`${food.servingSize} ${food.servingUnit} • ${food.category}`}
    calories={food.calories}
    protein={food.protein}
    carbs={food.carbs}
    fats={food.fats}
    onClick={onClick}
    className={
      framed ? "" : "border-0 shadow-none rounded-none active:bg-transparent"
    }
  />
);

export default FoodCard;
