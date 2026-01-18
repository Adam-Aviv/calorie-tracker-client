import React, { useEffect, useState } from "react";
import { IonModal, IonContent, IonLoading } from "@ionic/react";
import { X, Zap, Hash, MessageSquare, Utensils } from "lucide-react";
import type { FoodLog } from "../types";
import { useUpdateLogMutation } from "../hooks/queries";

interface EditFoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: FoodLog | null;
  date: string;
  onUpdated?: () => void; // Add this line (the '?' makes it optional)
}
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const EditFoodLogModal: React.FC<EditFoodLogModalProps> = ({
  isOpen,
  onClose,
  log,
  date,
}) => {
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [notes, setNotes] = useState("");

  const updateLogMut = useUpdateLogMutation();

  useEffect(() => {
    if (log) {
      setServings(log.servings);
      setMealType(log.mealType as MealType);
      setNotes(log.notes || "");
    }
  }, [log]);

  const handleUpdate = async () => {
    if (!log) return;
    try {
      await updateLogMut.mutateAsync({
        date,
        id: log._id,
        updates: { servings, mealType, notes: notes || undefined },
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!log) return null;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="rounded-t-[3rem]"
    >
      <IonContent>
        <div className="p-6 h-full flex flex-col space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">Edit Entry</h2>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 rounded-full text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Food Info Card */}
          <div className="bg-slate-900 p-6 rounded-[2rem] text-center relative overflow-hidden shadow-xl">
            <h3 className="text-white font-black text-xl mb-1">
              {log.foodName}
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Current: {Math.round(log.calories)} Cal
            </p>
            <Zap className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24" />
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {/* Servings Input */}
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Hash size={20} className="text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Servings
                </p>
                <input
                  type="number"
                  step="0.5"
                  className="w-full bg-transparent font-black text-xl outline-none"
                  value={servings}
                  onChange={(e) => setServings(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Meal Type Select (Customized Style) */}
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Utensils size={20} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Meal Type
                </p>
                <select
                  className="w-full bg-transparent font-black text-lg outline-none appearance-none capitalize"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            {/* Notes Input */}
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MessageSquare size={20} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Notes
                </p>
                <input
                  className="w-full bg-transparent font-bold text-slate-600 outline-none"
                  placeholder="How was it?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={handleUpdate}
              className="w-full bg-indigo-600 text-white h-16 rounded-[20px] font-black text-lg shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
        <IonLoading isOpen={updateLogMut.isPending} />
      </IonContent>
    </IonModal>
  );
};

export default EditFoodLogModal;
