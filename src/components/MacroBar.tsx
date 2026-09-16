import { View, Text } from "react-native";

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  colorClass?: string;
}

export default function MacroBar({
  label,
  current,
  goal,
  colorClass = "bg-indigo-600",
}: MacroBarProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <View className="flex-1 items-center gap-1.5">
      <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
        {label}
      </Text>
      <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="text-xs font-bold text-slate-700 text-center">
        {Math.round(current)}
        <Text className="text-slate-300"> / </Text>
        {Math.round(goal)}g
      </Text>
    </View>
  );
}
