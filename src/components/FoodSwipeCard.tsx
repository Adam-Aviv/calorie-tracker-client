import type { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Edit3, Trash2, Utensils } from "lucide-react-native";
import type { Food } from "../types";
import { FoodCaloriesBadge, FoodMacrosRow } from "./FoodNutritionStats";

interface FoodSwipeCardProps {
  food: Food;
  onEdit: () => void;
  onDelete: () => void;
}

function Action({
  onPress,
  className,
  children,
}: {
  onPress: () => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-[88px] h-full items-center justify-center ${className}`}
    >
      {children}
    </Pressable>
  );
}

export default function FoodSwipeCard({
  food,
  onEdit,
  onDelete,
}: FoodSwipeCardProps) {
  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex-row overflow-hidden rounded-3xl ml-2">
          <Action onPress={onEdit} className="bg-slate-100">
            <Edit3 size={22} color="#475569" />
          </Action>
          <Action onPress={onDelete} className="bg-rose-500">
            <Trash2 size={22} color="#ffffff" />
          </Action>
        </View>
      )}
    >
      <View className="bg-white p-4 rounded-3xl border border-slate-100">
        <View className="flex-row items-center gap-4">
          <View className="w-12 h-12 items-center justify-center bg-indigo-50 rounded-2xl">
            <Utensils size={20} color="#6366f1" />
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex-row items-center justify-between gap-2">
              <Text
                className="font-semibold text-slate-900 capitalize text-sm flex-1"
                numberOfLines={1}
              >
                {food.name}
              </Text>
              <FoodCaloriesBadge calories={food.calories} />
            </View>
            <View className="flex-row items-center justify-between gap-2 mt-1">
              <Text
                className="font-black text-slate-400 uppercase tracking-widest text-[9px] flex-1"
                numberOfLines={1}
              >
                {food.servingSize} {food.servingUnit} • {food.category}
              </Text>
              <FoodMacrosRow
                protein={food.protein}
                carbs={food.carbs}
                fats={food.fats}
              />
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
