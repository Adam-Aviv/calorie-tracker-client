import { Pressable, View, type PressableProps } from "react-native";
import type { ReactNode } from "react";

type AppButtonVariant = "primary" | "ghost" | "muted";

interface AppButtonProps extends Omit<PressableProps, "children"> {
  children: ReactNode;
  variant?: AppButtonVariant;
  className?: string;
}

const variantClass: Record<AppButtonVariant, string> = {
  primary: "bg-slate-900 h-16 rounded-[20px]",
  ghost: "h-14 rounded-[20px]",
  muted: "h-14 rounded-[20px]",
};

export const buttonLabelClass: Record<AppButtonVariant, string> = {
  primary: "text-white font-black text-lg",
  ghost: "text-rose-500 font-bold",
  muted: "text-slate-400 font-bold",
};

export default function AppButton({
  children,
  variant = "primary",
  disabled,
  className = "",
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={`items-center justify-center ${variantClass[variant]} ${disabled ? "opacity-50" : "active:opacity-80"} ${className}`}
      {...props}
    >
      <View className="flex-row items-center gap-3">{children}</View>
    </Pressable>
  );
}
