import React, { useState } from "react";
import {
  IonModal,
  IonContent,
  IonHeader,
  IonLoading,
} from "@ionic/react";
import { Search, X, Zap, Hash, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Food } from "../types";
import { useFoodsQuery, useCreateLogMutation } from "../hooks/queries";
import { useUIStore } from "../store/uiStore";
import AppButton from "./AppButton";
import FoodCard from "./FoodCard";

const AddFoodModal: React.FC = () => {
  const { showAddFood, closeAddFood, selectedMealType } = useUIStore();
  const date = format(new Date(), "yyyy-MM-dd");

  const [searchText, setSearchText] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [amount, setAmount] = useState(100);
  const [notes, setNotes] = useState("");

  const foodsQuery = useFoodsQuery({ search: searchText }, showAddFood);
  const createLogMut = useCreateLogMutation();
  const foods = foodsQuery.data || [];

  const selectFood = (food: Food) => {
    setSelectedFood(food);
    setAmount(food.servingSize);
  };

  const handleClose = () => {
    closeAddFood();
    setSearchText("");
    setSelectedFood(null);
    setAmount(100);
    setNotes("");
  };

  const handleAdd = async () => {
    if (!selectedFood) return;

    const servings =
      selectedFood.servingSize > 0 ? amount / selectedFood.servingSize : 1;

    await createLogMut.mutateAsync({
      date,
      input: {
        foodId: selectedFood.id,
        date,
        mealType: selectedMealType,
        servings,
        notes: notes || undefined,
      },
    });

    handleClose();
  };

  const totalCalories = selectedFood
    ? Math.round(
        selectedFood.calories *
          (selectedFood.servingSize > 0 ? amount / selectedFood.servingSize : 1)
      )
    : 0;

  return (
    <IonModal
      isOpen={showAddFood}
      onDidDismiss={handleClose}
      className="app-modal"
    >
      <IonHeader className="ion-no-border">
        <div className="px-3 pt-6 pb-4" style={{ background: "#f8fafc" }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-slate-900 capitalize">
              Add {selectedMealType}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 bg-white rounded-full text-slate-400 border border-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {!selectedFood && (
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                className="w-full h-12 bg-white rounded-2xl pl-12 pr-4 font-bold text-slate-900 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                placeholder="Search for a food..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          )}
        </div>
      </IonHeader>

      <IonContent
        scrollY
        style={{ "--background": "#f8fafc" } as React.CSSProperties}
      >
        <div className="px-3 pb-8 pt-2">
          {!selectedFood ? (
            <div className="flex flex-col gap-3">
              {foods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onClick={() => selectFood(food)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-8 pt-2">
              <div className="bg-indigo-50 p-6 rounded-4xl text-center relative overflow-hidden">
                <h3 className="text-indigo-900 font-black text-xl mb-1">
                  {selectedFood.name}
                </h3>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  {totalCalories} Total Calories
                </p>
                <p className="text-indigo-300 text-[10px] font-bold mt-1">
                  Per {selectedFood.servingSize} {selectedFood.servingUnit}:{" "}
                  {Math.round(selectedFood.calories)} cal
                </p>
                <Zap className="absolute -right-4 -bottom-4 text-indigo-200/50 w-24 h-24" />
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Hash size={20} className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Amount ({selectedFood.servingUnit})
                    </p>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className="w-full bg-transparent font-black text-xl outline-none"
                      value={amount}
                      onChange={(e) =>
                        setAmount(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <MessageSquare size={20} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Notes
                    </p>
                    <input
                      className="w-full bg-transparent font-bold text-slate-600 outline-none"
                      placeholder="Add a note..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <AppButton
                onClick={handleAdd}
                disabled={createLogMut.isPending}
              >
                <Zap size={20} />
                Log Food Item
              </AppButton>
              <AppButton
                variant="muted"
                onClick={() => setSelectedFood(null)}
              >
                Back to Search
              </AppButton>
            </div>
          )}
        </div>
        <IonLoading isOpen={createLogMut.isPending} message="Adding..." />
      </IonContent>
    </IonModal>
  );
};

export default AddFoodModal;
