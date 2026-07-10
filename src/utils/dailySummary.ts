import type { DailySummary, FoodLog } from "../types";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

export function buildDailySummary(logs: FoodLog[]): DailySummary {
  const mealBreakdown: DailySummary["mealBreakdown"] = {};

  for (const meal of MEAL_TYPES) {
    mealBreakdown[meal] = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      count: 0,
    };
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  for (const log of logs) {
    totalCalories += log.calories;
    totalProtein += log.protein;
    totalCarbs += log.carbs;
    totalFats += log.fats;

    const meal = mealBreakdown[log.mealType];
    if (meal) {
      meal.calories += log.calories;
      meal.protein += log.protein;
      meal.carbs += log.carbs;
      meal.fats += log.fats;
      meal.count += 1;
    }
  }

  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    mealBreakdown,
  };
}
