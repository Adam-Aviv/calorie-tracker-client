export const FOOD_CATEGORIES = [
  "protein",
  "carbs",
  "fats",
  "vegetables",
  "fruits",
  "dairy",
  "snacks",
  "drinks",
  "other",
] as const;

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};
