import { View, Text, Pressable, ScrollView } from "react-native";
import { FOOD_CATEGORIES } from "../constants/foods";

interface CategoryPickerProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
}

export default function CategoryPicker({
  value,
  onChange,
  includeAll = false,
}: CategoryPickerProps) {
  const options = includeAll ? ["all", ...FOOD_CATEGORIES] : [...FOOD_CATEGORIES];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
    >
      {options.map((cat) => {
        const isActive = value === cat;
        return (
          <Pressable
            key={cat}
            onPress={() => onChange(cat)}
            className={`h-10 px-5 rounded-2xl border items-center justify-center ${
              isActive
                ? "bg-indigo-50 border-indigo-600"
                : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold capitalize ${
                isActive ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
