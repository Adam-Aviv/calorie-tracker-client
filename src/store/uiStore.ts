import { create } from "zustand";

interface UIState {
  showAddFood: boolean;
  showAddWeight: boolean;
  showAddFoodLibrary: boolean;
  selectedMealType: "breakfast" | "lunch" | "dinner" | "snack";
  selectedLogDate: string;
  openAddFood: (
    meal?: "breakfast" | "lunch" | "dinner" | "snack",
    date?: string
  ) => void;
  closeAddFood: () => void;
  openAddWeight: () => void;
  closeAddWeight: () => void;
  openAddFoodLibrary: () => void;
  closeAddFoodLibrary: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useUIStore = create<UIState>((set) => ({
  showAddFood: false,
  showAddWeight: false,
  showAddFoodLibrary: false,
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
}));
