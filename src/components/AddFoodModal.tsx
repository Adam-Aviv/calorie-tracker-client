import React, { useState } from "react";
import { IonModal, IonContent, IonLoading } from "@ionic/react";
import { Search, X, Zap, Hash, MessageSquare } from "lucide-react";
import type { Food } from "../types";
import { useFoodsQuery, useCreateLogMutation } from "../hooks/queries";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  mealType: string;
  onFoodAdded: () => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  date,
  mealType,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [notes, setNotes] = useState("");

  const foodsQuery = useFoodsQuery({ search: searchText }, isOpen);
  const createLogMut = useCreateLogMutation();
  const foods = foodsQuery.data || [];

  const handleAdd = async () => {
    if (!selectedFood) return;

    await createLogMut.mutateAsync({
      date,
      input: {
        foodId: selectedFood._id,
        date,
        // Cast to the specific union type instead of 'any'
        mealType: mealType as "breakfast" | "lunch" | "dinner" | "snack",
        servings,
        notes: notes || undefined,
      },
    });

    onClose();
    setSelectedFood(null);
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.9}
      breakpoints={[0, 0.9, 1]}
      handle={true}
      className="rounded-t-[3rem]"
    >
      <IonContent className="--background: #fff;">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 capitalize">
              Add {mealType}
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 rounded-full text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {!selectedFood ? (
            <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 font-bold text-slate-900 border-2 border-transparent focus:border-indigo-500 transition-all outline-none"
                  placeholder="Search for a food..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {foods.map((food) => (
                  <button
                    key={food._id}
                    onClick={() => setSelectedFood(food)}
                    className="w-full p-4 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm active:bg-slate-50 transition-all"
                  >
                    <div className="text-left">
                      <p className="font-bold text-slate-900 uppercase tracking-tight text-sm">
                        {food.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {food.servingSize} {food.servingUnit}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-black">
                      <Zap size={14} fill="currentColor" />{" "}
                      {Math.round(food.calories)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-indigo-50 p-6 rounded-4xl text-center relative overflow-hidden">
                <h3 className="text-indigo-900 font-black text-xl mb-1">
                  {selectedFood.name}
                </h3>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  {Math.round(selectedFood.calories * servings)} Total Calories
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
                      Number of Servings
                    </p>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full bg-transparent font-black text-xl outline-none"
                      value={servings}
                      onChange={(e) => setServings(parseFloat(e.target.value))}
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

              <button
                onClick={handleAdd}
                className="w-full bg-slate-900 text-white h-16 rounded-[20px] font-black text-lg shadow-xl active:scale-95 transition-all"
              >
                Log Food Item
              </button>
              <button
                onClick={() => setSelectedFood(null)}
                className="w-full text-slate-400 font-bold py-2"
              >
                Back to Search
              </button>
            </div>
          )}
        </div>
        <IonLoading isOpen={createLogMut.isPending} message="Adding..." />
      </IonContent>
    </IonModal>
  );
};

export default AddFoodModal;
