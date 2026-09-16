import { View, Text } from "react-native";
import { Flame } from "lucide-react-native";

interface MacroProps {
  protein: number;
  carbs: number;
  fats: number;
}

export function formatMacro(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function FoodCaloriesBadge({ calories }: { calories: number }) {
  return (
    <View className="h-[18px] flex-row items-center justify-end gap-1">
      <Flame size={14} color="#4f46e5" fill="#4f46e5" />
      <Text className="font-black text-indigo-600 leading-none">
        {Math.round(calories)}
      </Text>
    </View>
  );
}

export function FoodMacrosRow({ protein, carbs, fats }: MacroProps) {
  return (
    <View className="h-[14px] flex-row items-center justify-end gap-2">
      <Text className="text-[9px] font-bold text-slate-400 leading-none">
        P: {formatMacro(protein)}g
      </Text>
      <Text className="text-[9px] font-bold text-slate-400 leading-none">
        C: {formatMacro(carbs)}g
      </Text>
      <Text className="text-[9px] font-bold text-slate-400 leading-none">
        F: {formatMacro(fats)}g
      </Text>
    </View>
  );
}
