import type { Food } from "../types";
import FoodListRow from "./FoodListRow";

interface FoodCardProps {
  food: Food;
  onPress?: () => void;
}

export default function FoodCard({ food, onPress }: FoodCardProps) {
  return (
    <FoodListRow
      name={food.name}
      subtitle={`${food.servingSize} ${food.servingUnit} • ${food.category}`}
      calories={food.calories}
      protein={food.protein}
      carbs={food.carbs}
      fats={food.fats}
      onPress={onPress}
    />
  );
}
