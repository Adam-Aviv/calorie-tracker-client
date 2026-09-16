import { View, Text, TextInput, type TextInputProps } from "react-native";
import type { ReactNode } from "react";

interface FieldProps extends TextInputProps {
  label: string;
  icon?: ReactNode;
}

export default function Field({ label, icon, className, ...props }: FieldProps) {
  return (
    <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </Text>
      <View className="flex-row items-center gap-2">
        {icon}
        <TextInput
          className={`flex-1 font-bold text-slate-900 text-lg py-1 ${className ?? ""}`}
          placeholderTextColor="#94a3b8"
          {...props}
        />
      </View>
    </View>
  );
}
