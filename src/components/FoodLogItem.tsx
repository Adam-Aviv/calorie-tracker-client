import { View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { Edit3, Trash2 } from "lucide-react-native";
import type { FoodLog } from "../types";
import { formatFoodLogAmount } from "../utils/formatFoodLog";
import FoodListRow from "./FoodListRow";

interface FoodLogItemProps {
  log: FoodLog;
  onDelete: (id: string) => void;
  onEdit: (log: FoodLog) => void;
}

export default function FoodLogItem({
  log,
  onDelete,
  onEdit,
}: FoodLogItemProps) {
  const amount =
    formatFoodLogAmount(log) ??
    `${log.servings} serving${log.servings !== 1 ? "s" : ""}`;
  const subtitle = log.notes ? `${amount} • ${log.notes}` : amount;

  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex-row overflow-hidden rounded-3xl ml-2">
          <Pressable
            onPress={() => onEdit(log)}
            className="w-[72px] items-center justify-center bg-slate-100"
          >
            <Edit3 size={20} color="#475569" />
          </Pressable>
          <Pressable
            onPress={() => onDelete(log.id)}
            className="w-[72px] items-center justify-center bg-rose-500"
          >
            <Trash2 size={20} color="#ffffff" />
          </Pressable>
        </View>
      )}
    >
      <FoodListRow
        name={log.foodName}
        subtitle={subtitle}
        calories={log.calories}
        protein={log.protein}
        carbs={log.carbs}
        fats={log.fats}
        onPress={() => onEdit(log)}
      />
    </Swipeable>
  );
}
