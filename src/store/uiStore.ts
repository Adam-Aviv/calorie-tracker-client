import { create } from "zustand";

interface UIState {
  showAddFood: boolean;
  showAddWeight: boolean;
  showAddFoodLibrary: boolean; // NEW: For adding foods to library
  selectedMealType: "breakfast" | "lunch" | "dinner" | "snack";
  openAddFood: (meal?: "breakfast" | "lunch" | "dinner" | "snack") => void;
  closeAddFood: () => void;
  openAddWeight: () => void;
  closeAddWeight: () => void;
  openAddFoodLibrary: () => void; // NEW
  closeAddFoodLibrary: () => void; // NEW
}

export const useUIStore = create<UIState>((set) => ({
  showAddFood: false,
  showAddWeight: false,
  showAddFoodLibrary: false, // NEW
  selectedMealType: "breakfast",
  openAddFood: (meal) =>
    set({ showAddFood: true, selectedMealType: meal || "breakfast" }),
  closeAddFood: () => set({ showAddFood: false }),
  openAddWeight: () => set({ showAddWeight: true }),
  closeAddWeight: () => set({ showAddWeight: false }),
  openAddFoodLibrary: () => set({ showAddFoodLibrary: true }), // NEW
  closeAddFoodLibrary: () => set({ showAddFoodLibrary: false }), // NEW
}));
