import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";
import { format, parseISO, addDays, subDays } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore"; // Added UI Store
import type { FoodLog } from "../types";
import MacroBar from "../components/MacroBar";
import FoodLogItem from "../components/FoodLogItem";
import AddFoodModal from "../components/AddFoodModal";
import EditFoodLogModal from "../components/EditFoodLogModal";
import { useDailyLogsQuery, useDeleteLogMutation, qk } from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import "./Diary.css";

const Diary: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();

  // Connect to the Global UI Store
  const { showAddFood, closeAddFood, openAddFood, selectedMealType } =
    useUIStore();

  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);

  const [expandedMeals, setExpandedMeals] = useState<string[]>([
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ]);

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

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar
          className="--background: transparent; pt-4 px-4"
          style={{ paddingTop: "var(--ion-safe-area-top)" }}
        >
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() =>
                setCurrentDate(
                  format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd")
                )
              }
              className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all"
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
              onClick={() =>
                setCurrentDate(
                  format(addDays(parseISO(currentDate), 1), "yyyy-MM-dd")
                )
              }
              className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all"
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

        <div className="p-6">
          {/* CALORIE RING */}
          <div className="relative h-64 w-full flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-52 h-52 rounded-full border-12 border-white shadow-sm" />
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

          <div className="grid grid-cols-3 gap-4 mb-10">
            <MacroBar
              label="Protein"
              current={summary.totalProtein}
              goal={goals.protein}
              colorClass="bg-emerald-500"
            />
            <MacroBar
              label="Carbs"
              current={summary.totalCarbs}
              goal={goals.carbs}
              colorClass="bg-amber-500"
            />
            <MacroBar
              label="Fats"
              current={summary.totalFats}
              goal={goals.fats}
              colorClass="bg-rose-500"
            />
          </div>

          <div className="space-y-4">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((mt) => {
              const mealLogs =
                dailyData?.logs.filter((l) => l.mealType === mt) || [];
              const isExpanded = expandedMeals.includes(mt);
              return (
                <div
                  key={mt}
                  className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleMeal(mt)}
                    className="w-full p-5 flex items-center justify-between active:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 uppercase tracking-tight text-sm">
                        {mt}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-300 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-slate-50 pt-4">
                      {mealLogs.length === 0 ? (
                        <p className="text-center py-4 text-xs font-bold text-slate-300 italic">
                          No items
                        </p>
                      ) : (
                        mealLogs.map((log) => (
                          <FoodLogItem
                            key={log._id}
                            log={log}
                            onDelete={() =>
                              deleteLogMut.mutate({
                                date: currentDate,
                                id: log._id,
                              })
                            }
                            onEdit={() => {
                              setEditingLog(log);
                              setShowEditModal(true);
                            }}
                          />
                        ))
                      )}
                      <button
                        onClick={() => openAddFood(mt)}
                        className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                      >
                        <Plus size={14} /> Add Food
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Modals connected to store */}
        <AddFoodModal
          isOpen={showAddFood}
          onClose={closeAddFood}
          date={currentDate}
          mealType={selectedMealType}
          onFoodAdded={() => {}}
        />

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
