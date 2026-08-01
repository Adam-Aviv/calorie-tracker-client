import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { ChevronLeft, ChevronRight, Plus, Flame } from "lucide-react";
import { format, parseISO, addDays, subDays } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore"; // Added UI Store
import type { FoodLog } from "../types";
import MacroBar from "../components/MacroBar";
import FoodLogItem from "../components/FoodLogItem";
import EditFoodLogModal from "../components/EditFoodLogModal";
import { useDailyLogsQuery, useDeleteLogMutation, qk } from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import "./Diary.css";

const Diary: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();

  // Connect to the Global UI Store
  const { openAddFood } = useUIStore();

  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);

  const dailyQuery = useDailyLogsQuery(currentDate, true);
  const deleteLogMut = useDeleteLogMutation();
  const dailyData = dailyQuery.data || null;
  const isToday = currentDate === format(new Date(), "yyyy-MM-dd");

  const goals = {
    calories: user?.dailyCalorieGoal || 2000,
    protein: user?.proteinGoal || 150,
    carbs: user?.carbsGoal || 250,
    fats: user?.fatsGoal || 65,
  };

  const summary = dailyData?.summary || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
  };

  const caloriesConsumed = Math.round(summary.totalCalories);
  const caloriesLeft = Math.max(goals.calories - caloriesConsumed, 0);

  const toggleMeal = (meal: string) => {
    setExpandedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const mealLabels: Record<
    "breakfast" | "lunch" | "dinner" | "snack",
    string
  > = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar
          className="--background: transparent; pt-4"
          style={{
            "--padding-start": "12px",
            "--padding-end": "12px",
            paddingTop: "var(--ion-safe-area-top)",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd")
                )
              }
              className="diary-circle-btn diary-circle-btn--nav"
              aria-label="Previous day"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>

            <div className="text-center">
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                {isToday ? "Today" : format(parseISO(currentDate), "EEEE")}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {format(parseISO(currentDate), "MMM d, yyyy")}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  format(addDays(parseISO(currentDate), 1), "yyyy-MM-dd")
                )
              }
              className="diary-circle-btn diary-circle-btn--nav"
              aria-label="Next day"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="--background: #f8fafc;">
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            await qc.invalidateQueries({ queryKey: qk.daily(currentDate) });
            e.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        <div className="px-3 py-4 space-y-4">
          <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden p-5">
            {/* CALORIE RING */}
            <div className="relative h-56 w-full flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-52 h-52 rounded-full border-12 border-slate-50 shadow-sm" />
                <svg
                  className="absolute w-52 h-52 -rotate-90"
                  viewBox="0 0 208 208"
                >
                  <circle
                    cx="104"
                    cy="104"
                    r="96"
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 96}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      96 *
                      (1 - Math.min(caloriesConsumed / goals.calories, 1))
                    }
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
              <div className="text-center z-10">
                <h2 className="text-5xl font-black text-slate-900 leading-none">
                  {caloriesConsumed}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                  Calories Consumed
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  {caloriesLeft} left
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <MacroBar
                label="Protein"
                current={summary.totalProtein}
                goal={goals.protein}
                colorClass="bg-indigo-600"
              />
              <MacroBar
                label="Carbs"
                current={summary.totalCarbs}
                goal={goals.carbs}
                colorClass="bg-indigo-600"
              />
              <MacroBar
                label="Fats"
                current={summary.totalFats}
                goal={goals.fats}
                colorClass="bg-indigo-600"
              />
            </div>
          </div>

          <div className="space-y-3">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((mt) => {
              const mealLogs =
                dailyData?.logs.filter((l) => l.mealType === mt) || [];
              const mealCalories = Math.round(
                dailyData?.summary.mealBreakdown[mt]?.calories ?? 0
              );
              const isExpanded = expandedMeals.includes(mt);

              return (
                <div
                  key={mt}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => toggleMeal(mt)}
                      className="flex flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-bold text-neutral-900 flex items-center gap-2 flex-wrap">
                          {mealLabels[mt]}
                          {mealCalories > 0 && (
                            <span className="inline-flex items-center gap-1 text-indigo-600">
                              <Flame size={15} fill="currentColor" />
                              <span>{mealCalories}</span>
                            </span>
                          )}
                        </h3>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAddFood(mt, currentDate)}
                      className="diary-circle-btn diary-circle-btn--add"
                      aria-label={`Add food to ${mealLabels[mt]}`}
                    >
                      <Plus size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  {isExpanded && mealLogs.length > 0 && (
                    <div className="pb-2 pt-2 space-y-2 border-t border-slate-100">
                      {mealLogs.map((log) => (
                        <FoodLogItem
                          key={log.id}
                          log={log}
                          variant="compact"
                          onDelete={() =>
                            deleteLogMut.mutate({
                              date: currentDate,
                              id: log.id,
                            })
                          }
                          onEdit={() => {
                            setEditingLog(log);
                            setShowEditModal(true);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {isExpanded && mealLogs.length === 0 && (
                    <p className="px-4 pb-4 pt-0 text-center text-xs font-semibold text-slate-300 border-t border-slate-100">
                      No items logged
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <EditFoodLogModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          log={editingLog}
          date={currentDate}
        />
      </IonContent>
    </IonPage>
  );
};

export default Diary;
