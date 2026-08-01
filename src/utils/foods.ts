import type { Food } from "../types";

export function filterFoods(
  foods: Food[],
  { search, category }: { search?: string; category?: string },
): Food[] {
  let list = foods;

  if (category) {
    list = list.filter((f) => f.category === category);
  }

  const q = search?.trim().toLowerCase();
  if (q) {
    list = list.filter((f) => f.name.toLowerCase().includes(q));
  }

  return list;
}
