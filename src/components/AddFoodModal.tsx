import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Search, Zap, Hash, MessageSquare, Calendar } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import type { Food } from "../types";
import { useFoodsQuery, useCreateLogMutation } from "../hooks/queries";
import { useUIStore } from "../store/uiStore";
import AppButton, { buttonLabelClass } from "./AppButton";
import AppModal from "./AppModal";
import FoodCard from "./FoodCard";
import { filterFoods } from "../utils/foods";
import {
  formatDecimalField,
  isValidDecimalInput,
  parseDecimalInput,
} from "../utils/numberInput";

export default function AddFoodModal() {
  const { showAddFood, closeAddFood, selectedMealType, selectedLogDate } =
    useUIStore();
  const [searchText, setSearchText] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [amount, setAmount] = useState("100");
  const [notes, setNotes] = useState("");
  const [logDate, setLogDate] = useState(selectedLogDate);

  useEffect(() => {
    if (showAddFood) setLogDate(selectedLogDate);
  }, [showAddFood, selectedLogDate]);

  const foodsQuery = useFoodsQuery(showAddFood);
  const createLogMut = useCreateLogMutation();
  const foods = useMemo(
    () => filterFoods(foodsQuery.data ?? [], { search: searchText }),
    [foodsQuery.data, searchText],
  );

  const selectFood = (food: Food) => {
    setSelectedFood(food);
    setAmount(formatDecimalField(food.servingSize));
  };

  const handleClose = () => {
    closeAddFood();
    setSearchText("");
    setSelectedFood(null);
    setAmount("100");
    setNotes("");
    setLogDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleAdd = async () => {
    if (!selectedFood) return;
    const numericAmount = parseDecimalInput(amount);
    if (numericAmount <= 0) return;
    const servings =
      selectedFood.servingSize > 0
        ? numericAmount / selectedFood.servingSize
        : 1;
    await createLogMut.mutateAsync({
      date: logDate,
      input: {
        foodId: selectedFood.id,
        date: logDate,
        mealType: selectedMealType,
        servings,
        notes: notes || undefined,
      },
    });
    handleClose();
  };

  const numericAmount = parseDecimalInput(amount);
  const totalCalories = selectedFood
    ? Math.round(
        selectedFood.calories *
          (selectedFood.servingSize > 0
            ? numericAmount / selectedFood.servingSize
            : 1),
      )
    : 0;

  return (
    <AppModal
      visible={showAddFood}
      onClose={handleClose}
      title={`Add ${selectedMealType}`}
      headerExtra={
        !selectedFood ? (
          <View className="px-4 pb-3">
            <View className="flex-row items-center h-12 bg-white rounded-2xl px-4 border border-slate-100">
              <Search size={18} color="#94a3b8" />
              <TextInput
                className="flex-1 ml-3 font-bold text-slate-900"
                placeholder="Search for a food..."
                placeholderTextColor="#94a3b8"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
        ) : undefined
      }
    >
      {!selectedFood ? (
        <View className="gap-3">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onPress={() => selectFood(food)}
            />
          ))}
        </View>
      ) : (
        <View className="gap-6 pt-2">
          <View className="bg-indigo-50 p-6 rounded-3xl items-center overflow-hidden">
            <Text className="text-indigo-900 font-black text-xl mb-1">
              {selectedFood.name}
            </Text>
            <Text className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
              {totalCalories} Total Calories
            </Text>
            <Text className="text-indigo-300 text-[10px] font-bold mt-1">
              Per {selectedFood.servingSize} {selectedFood.servingUnit}:{" "}
              {Math.round(selectedFood.calories)} cal
            </Text>
          </View>

          <View className="gap-4">
            <View className="bg-slate-50 p-4 rounded-2xl flex-row items-center gap-4">
              <View className="p-2 bg-white rounded-xl">
                <Calendar size={20} color="#6366f1" />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  className="font-black text-lg text-slate-900"
                  value={logDate}
                  onChangeText={setLogDate}
                />
                <Text className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {format(parseISO(logDate), "EEEE, MMM d, yyyy")}
                </Text>
              </View>
            </View>

            <View className="bg-slate-50 p-4 rounded-2xl flex-row items-center gap-4">
              <View className="p-2 bg-white rounded-xl">
                <Hash size={20} color="#6366f1" />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Amount ({selectedFood.servingUnit})
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
                      setAmount(formatDecimalField(selectedFood.servingSize));
                    }
                  }}
                />
              </View>
            </View>

            <View className="bg-slate-50 p-4 rounded-2xl flex-row items-center gap-4">
              <View className="p-2 bg-white rounded-xl">
                <MessageSquare size={20} color="#94a3b8" />
              </View>
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
          </View>

          <AppButton onPress={handleAdd} disabled={createLogMut.isPending}>
            {createLogMut.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Zap size={20} color="#fff" />
            )}
            <Text className={buttonLabelClass.primary}>Log Food Item</Text>
          </AppButton>
          <AppButton variant="muted" onPress={() => setSelectedFood(null)}>
            <Text className={buttonLabelClass.muted}>Back to Search</Text>
          </AppButton>
        </View>
      )}
    </AppModal>
  );
}
