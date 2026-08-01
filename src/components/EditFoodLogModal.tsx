import React, { useEffect, useMemo, useState } from "react";
import {
  IonModal,
  IonContent,
  IonHeader,
  IonLoading,
} from "@ionic/react";
import { X, Zap, Hash, MessageSquare, Calendar, Utensils } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { FoodLog } from "../types";
import { useUpdateLogMutation, qk } from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import AppButton from "./AppButton";
import {
  formatDecimalField,
  isValidDecimalInput,
  parseDecimalInput,
} from "../utils/numberInput";

interface EditFoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: FoodLog | null;
  date: string;
  onUpdated?: () => void;
}

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const EditFoodLogModal: React.FC<EditFoodLogModalProps> = ({
  isOpen,
  onClose,
  log,
  date,
}) => {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("100");
  const [logDate, setLogDate] = useState(date);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [notes, setNotes] = useState("");

  const updateLogMut = useUpdateLogMutation();

  useEffect(() => {
    if (log) {
      const initialAmount =
        log.servingSize != null
          ? log.servings * log.servingSize
          : log.servings;
      setAmount(formatDecimalField(initialAmount));
      setLogDate(log.date);
      setMealType(log.mealType as MealType);
      setNotes(log.notes || "");
    }
  }, [log]);

  const numericAmount = parseDecimalInput(amount);
  const servings = useMemo(() => {
    if (!log) return 0;
    if (log.servingSize != null && log.servingSize > 0) {
      return numericAmount / log.servingSize;
    }
    return numericAmount;
  }, [log, numericAmount]);

  const totalCalories = useMemo(() => {
    if (!log || log.servings <= 0) return 0;
    return Math.round((log.calories / log.servings) * servings);
  }, [log, servings]);

  const handleUpdate = async () => {
    if (!log) return;
    if (numericAmount <= 0) return;

    try {
      await updateLogMut.mutateAsync({
        date: logDate,
        id: log.id,
        updates: {
          date: logDate,
          servings,
          mealType,
          notes: notes || undefined,
        },
      });
      if (logDate !== date) {
        await qc.invalidateQueries({ queryKey: qk.daily(date) });
      }
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!log) return null;

  const servingUnit = log.servingUnit ?? "serving";
  const defaultAmount =
    log.servingSize != null
      ? formatDecimalField(log.servings * log.servingSize)
      : formatDecimalField(log.servings);

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="app-modal"
    >
      <IonHeader className="ion-no-border">
        <div className="px-3 pt-6 pb-4" style={{ background: "#f8fafc" }}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 capitalize">
              Edit {mealType}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white rounded-full text-slate-400 border border-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </IonHeader>

      <IonContent
        scrollY
        style={{ "--background": "#f8fafc" } as React.CSSProperties}
      >
        <div className="px-3 pb-8 pt-2 space-y-8">
          <div className="bg-indigo-50 p-6 rounded-4xl text-center relative overflow-hidden">
            <h3 className="text-indigo-900 font-black text-xl mb-1">
              {log.foodName}
            </h3>
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
              {totalCalories} Total Calories
            </p>
            {log.servingSize != null && (
              <p className="text-indigo-300 text-[10px] font-bold mt-1">
                Per {log.servingSize} {log.servingUnit}:{" "}
                {Math.round(log.calories / log.servings)} cal
              </p>
            )}
            <Zap className="absolute -right-4 -bottom-4 text-indigo-200/50 w-24 h-24" />
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Calendar size={20} className="text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Date
                </p>
                <input
                  type="date"
                  className="w-full bg-transparent font-black text-lg outline-none text-slate-900"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                />
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {format(parseISO(logDate), "EEEE, MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Utensils size={20} className="text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Meal
                </p>
                <select
                  className="w-full bg-transparent font-black text-lg outline-none appearance-none capitalize text-slate-900"
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

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Hash size={20} className="text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Amount ({servingUnit})
                </p>
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent font-black text-xl outline-none"
                  value={amount}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (isValidDecimalInput(next)) setAmount(next);
                  }}
                  onBlur={() => {
                    if (amount === "" || parseDecimalInput(amount) <= 0) {
                      setAmount(defaultAmount);
                    }
                  }}
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
            onClick={handleUpdate}
            disabled={updateLogMut.isPending}
          >
            <Zap size={20} />
            Save Changes
          </AppButton>
        </div>
        <IonLoading isOpen={updateLogMut.isPending} message="Saving..." />
      </IonContent>
    </IonModal>
  );
};

export default EditFoodLogModal;
