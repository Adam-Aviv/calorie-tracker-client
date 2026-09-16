import { Pressable, View, Text } from "react-native";
import { Utensils } from "lucide-react-native";
import { FoodCaloriesBadge, FoodMacrosRow } from "./FoodNutritionStats";

interface FoodListRowProps {
  name: string;
  subtitle: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  onPress?: () => void;
}

export default function FoodListRow({
  name,
  subtitle,
  calories,
  protein,
  carbs,
  fats,
  onPress,
}: FoodListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-white p-4 rounded-3xl border border-slate-100"
    >
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
              {name}
            </Text>
            <FoodCaloriesBadge calories={calories} />
          </View>
          <View className="flex-row items-center justify-between gap-2 mt-1">
            <Text
              className="font-black text-slate-400 uppercase tracking-widest text-[9px] flex-1"
              numberOfLines={1}
            >
              {subtitle}
            </Text>
            <FoodMacrosRow protein={protein} carbs={carbs} fats={fats} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
