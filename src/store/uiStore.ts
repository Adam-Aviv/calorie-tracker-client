import { create } from "zustand";
import type { MealType } from "../constants/foods";

interface UIState {
  showAddFood: boolean;
  showAddWeight: boolean;
  showAddFoodLibrary: boolean;
  showPhotoMeal: boolean;
  selectedMealType: MealType;
  selectedLogDate: string;
  openAddFood: (meal?: MealType, date?: string) => void;
  closeAddFood: () => void;
  openAddWeight: () => void;
  closeAddWeight: () => void;
  openAddFoodLibrary: () => void;
  closeAddFoodLibrary: () => void;
  openPhotoMeal: (meal?: MealType, date?: string) => void;
  closePhotoMeal: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useUIStore = create<UIState>((set) => ({
  showAddFood: false,
  showAddWeight: false,
  showAddFoodLibrary: false,
  showPhotoMeal: false,
  selectedMealType: "breakfast",
  selectedLogDate: today(),
  openAddFood: (meal, date) =>
    set({
      showAddFood: true,
      selectedMealType: meal || "breakfast",
      selectedLogDate: date || today(),
    }),
  closeAddFood: () => set({ showAddFood: false }),
  openAddWeight: () => set({ showAddWeight: true }),
  closeAddWeight: () => set({ showAddWeight: false }),
  openAddFoodLibrary: () => set({ showAddFoodLibrary: true }),
  closeAddFoodLibrary: () => set({ showAddFoodLibrary: false }),
  openPhotoMeal: (meal, date) =>
    set({
      showPhotoMeal: true,
      selectedMealType: meal || "breakfast",
      selectedLogDate: date || today(),
    }),
  closePhotoMeal: () => set({ showPhotoMeal: false }),
}));
