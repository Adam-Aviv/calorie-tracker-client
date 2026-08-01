import type { FoodLog } from "../types";

export function formatFoodLogAmount(log: FoodLog): string | null {
  if (log.servingSize != null && log.servingUnit) {
    const amount = log.servings * log.servingSize;
    const formatted =
      Math.abs(amount - Math.round(amount)) < 0.05
        ? Math.round(amount)
        : parseFloat(amount.toFixed(1));
    return `${formatted} ${log.servingUnit}`;
  }

  return null;
}

export function formatFoodLogLabel(log: FoodLog): string {
  const amount = formatFoodLogAmount(log);
  if (amount) {
    return `${log.foodName}, ${amount}`;
  }

  return log.foodName;
}
