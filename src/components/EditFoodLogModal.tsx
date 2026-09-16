import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Zap, Hash, MessageSquare, Calendar } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import type { FoodLog } from "../types";
import { useUpdateLogMutation, qk } from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import AppButton, { buttonLabelClass } from "./AppButton";
import AppModal from "./AppModal";
import { MEAL_LABELS, MEAL_TYPES, type MealType } from "../constants/foods";
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
}

export default function EditFoodLogModal({
  isOpen,
  onClose,
  log,
  date,
}: EditFoodLogModalProps) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("100");
  const [logDate, setLogDate] = useState(date);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [notes, setNotes] = useState("");
  const updateLogMut = useUpdateLogMutation();

  useEffect(() => {
    if (log) {
      const initialAmount =
        log.servingSize != null ? log.servings * log.servingSize : log.servings;
      setAmount(formatDecimalField(initialAmount));
      setLogDate(log.date);
      setMealType(log.mealType);
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
    if (!log || numericAmount <= 0) return;
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
  };

  if (!log) return null;

  const servingUnit = log.servingUnit ?? "serving";
  const defaultAmount =
    log.servingSize != null
      ? formatDecimalField(log.servings * log.servingSize)
      : formatDecimalField(log.servings);

  return (
    <AppModal visible={isOpen} onClose={onClose} title={`Edit ${mealType}`}>
      <View className="gap-6">
        <View className="bg-indigo-50 p-6 rounded-3xl items-center">
          <Text className="text-indigo-900 font-black text-xl mb-1">
            {log.foodName}
          </Text>
          <Text className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
            {totalCalories} Total Calories
          </Text>
        </View>

        <View className="bg-slate-50 p-4 rounded-2xl flex-row items-center gap-4">
          <Calendar size={20} color="#6366f1" />
          <View className="flex-1">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Date (YYYY-MM-DD)
            </Text>
            <TextInput
              className="font-black text-lg text-slate-900"
              value={logDate}
              onChangeText={setLogDate}
            />
            <Text className="text-[10px] font-semibold text-slate-400">
              {format(parseISO(logDate), "EEEE, MMM d, yyyy")}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {MEAL_TYPES.map((meal) => (
            <Pressable
              key={meal}
              onPress={() => setMealType(meal)}
              className={`px-4 py-2 rounded-2xl border ${
                mealType === meal
                  ? "bg-indigo-50 border-indigo-600"
                  : "bg-white border-slate-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  mealType === meal ? "text-indigo-600" : "text-slate-500"
                }`}
              >
                {MEAL_LABELS[meal]}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-slate-50 p-4 rounded-2xl flex-row items-center gap-4">
          <Hash size={20} color="#6366f1" />
          <View className="flex-1">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Amount ({servingUnit})
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              className="font-black text-xl text-slate-900"
              value={amount}
              onChangeText={(next) => {
                if (isValidDecimalInput(next)) setAmount(next);
              }}
              onBlur={() => {
                if (amount === "" || parseDecimalInput(amount) <= 0) {
                  setAmount(defaultAmount);
                }
              }}
            />
          </View>
        </View>

        <View className="bg-slate-50 p-4 rounded-2xl flex-row items-center gap-4">
          <MessageSquare size={20} color="#94a3b8" />
          <View className="flex-1">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Notes
            </Text>
            <TextInput
              className="font-bold text-slate-600"
              placeholder="Add a note..."
              placeholderTextColor="#94a3b8"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        <AppButton onPress={handleUpdate} disabled={updateLogMut.isPending}>
          <Zap size={20} color="#fff" />
          <Text className={buttonLabelClass.primary}>Save Changes</Text>
        </AppButton>
      </View>
    </AppModal>
  );
}
