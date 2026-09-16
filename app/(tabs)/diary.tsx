import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { ChevronLeft, ChevronRight, Plus, Flame } from "lucide-react-native";
import { format, parseISO, addDays, subDays } from "date-fns";
import Svg, { Circle } from "react-native-svg";
import { useAuthStore } from "../../src/store/authStore";
import { useUIStore } from "../../src/store/uiStore";
import type { FoodLog } from "../../src/types";
import MacroBar from "../../src/components/MacroBar";
import FoodLogItem from "../../src/components/FoodLogItem";
import EditFoodLogModal from "../../src/components/EditFoodLogModal";
import { useDailyLogsQuery, useDeleteLogMutation, qk } from "../../src/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { MEAL_LABELS, MEAL_TYPES } from "../../src/constants/foods";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiaryScreen() {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();
  const { openAddFood } = useUIStore();
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
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
  const progress = Math.min(caloriesConsumed / goals.calories, 1);
  const radius = 96;
  const circumference = 2 * Math.PI * radius;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-row items-center justify-between px-3 py-3">
        <Pressable
          onPress={() =>
            setCurrentDate(
              format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd"),
            )
          }
          className="w-11 h-11 rounded-full bg-white border border-slate-100 items-center justify-center"
        >
          <ChevronLeft size={20} color="#475569" />
        </Pressable>
        <View className="items-center">
          <Text className="text-lg font-black text-slate-900">
            {isToday ? "Today" : format(parseISO(currentDate), "EEEE")}
          </Text>
          <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {format(parseISO(currentDate), "MMM d, yyyy")}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            setCurrentDate(
              format(addDays(parseISO(currentDate), 1), "yyyy-MM-dd"),
            )
          }
          className="w-11 h-11 rounded-full bg-white border border-slate-100 items-center justify-center"
        >
          <ChevronRight size={20} color="#475569" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-3"
        refreshControl={
          <RefreshControl
            refreshing={dailyQuery.isRefetching}
            onRefresh={() =>
              qc.invalidateQueries({ queryKey: qk.daily(currentDate) })
            }
          />
        }
      >
        <View className="bg-white rounded-[2rem] border border-slate-100 p-5 mb-4">
          <View className="h-56 items-center justify-center mb-6">
            <View className="absolute items-center justify-center">
              <Svg width={208} height={208} style={{ transform: [{ rotate: "-90deg" }] }}>
                <Circle
                  cx={104}
                  cy={104}
                  r={radius}
                  stroke="#f8fafc"
                  strokeWidth={12}
                  fill="transparent"
                />
                <Circle
                  cx={104}
                  cy={104}
                  r={radius}
                  stroke="#4f46e5"
                  strokeWidth={12}
                  fill="transparent"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View className="items-center">
              <Text className="text-5xl font-black text-slate-900">
                {caloriesConsumed}
              </Text>
              <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                Calories Consumed
              </Text>
              <Text className="text-xs font-bold text-slate-400 mt-1">
                {caloriesLeft} left
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <MacroBar label="Protein" current={summary.totalProtein} goal={goals.protein} />
            <MacroBar label="Carbs" current={summary.totalCarbs} goal={goals.carbs} />
            <MacroBar label="Fats" current={summary.totalFats} goal={goals.fats} />
          </View>
        </View>

        <View className="gap-3 pb-8">
          {MEAL_TYPES.map((mt) => {
            const mealLogs =
              dailyData?.logs.filter((l) => l.mealType === mt) || [];
            const mealCalories = Math.round(
              dailyData?.summary.mealBreakdown[mt]?.calories ?? 0,
            );
            const isExpanded = expandedMeals.includes(mt);
            return (
              <View
                key={mt}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100"
              >
                <View className="flex-row items-center gap-2 px-4 py-4">
                  <Pressable
                    onPress={() =>
                      setExpandedMeals((prev) =>
                        prev.includes(mt)
                          ? prev.filter((m) => m !== mt)
                          : [...prev, mt],
                      )
                    }
                    className="flex-1"
                  >
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <Text className="text-[17px] font-bold text-neutral-900">
                        {MEAL_LABELS[mt]}
                      </Text>
                      {mealCalories > 0 ? (
                        <View className="flex-row items-center gap-1">
                          <Flame size={15} color="#4f46e5" fill="#4f46e5" />
                          <Text className="text-indigo-600 font-bold">
                            {mealCalories}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => openAddFood(mt, currentDate)}
                    className="w-11 h-11 rounded-full bg-slate-900 items-center justify-center"
                  >
                    <Plus size={20} color="#fff" strokeWidth={2.5} />
                  </Pressable>
                </View>
                {isExpanded && mealLogs.length > 0 ? (
                  <View className="px-2 pb-3 gap-2 border-t border-slate-100 pt-2">
                    {mealLogs.map((log) => (
                      <FoodLogItem
                        key={log.id}
                        log={log}
                        onDelete={() =>
                          deleteLogMut.mutate({ date: currentDate, id: log.id })
                        }
                        onEdit={() => {
                          setEditingLog(log);
                          setShowEditModal(true);
                        }}
                      />
                    ))}
                  </View>
                ) : null}
                {isExpanded && mealLogs.length === 0 ? (
                  <Text className="px-4 pb-4 text-center text-xs font-semibold text-slate-300 border-t border-slate-100 pt-3">
                    No items logged
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <EditFoodLogModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        log={editingLog}
        date={currentDate}
      />
    </SafeAreaView>
  );
}
