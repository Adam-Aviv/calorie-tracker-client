import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Utensils, Scale, PlusCircle, ArrowLeft, Camera } from "lucide-react-native";
import AppButton, { buttonLabelClass } from "./AppButton";
import AppModal from "./AppModal";
import { MEAL_LABELS, MEAL_TYPES, type MealType } from "../constants/foods";

export type GlobalAction =
  | { type: "weight" }
  | { type: "library" }
  | { type: "log"; meal: MealType }
  | { type: "photo"; meal: MealType };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: GlobalAction) => void;
}

export default function GlobalActionModal({ isOpen, onClose, onAction }: Props) {
  const [step, setStep] = useState<"root" | "log" | "photo">("root");

  const handleClose = () => {
    setStep("root");
    onClose();
  };

  return (
    <AppModal
      visible={isOpen}
      onClose={handleClose}
      title={step === "root" ? "Quick Actions" : "Select Meal"}
    >
      {step !== "root" ? (
        <View className="gap-3">
          <Pressable
            onPress={() => setStep("root")}
            className="flex-row items-center gap-2 mb-2"
          >
            <ArrowLeft size={20} color="#94a3b8" />
            <Text className="text-slate-400 font-bold">Back</Text>
          </Pressable>
          {MEAL_TYPES.map((meal) => (
            <AppButton
              key={meal}
              onPress={() => {
                const kind = step;
                setStep("root");
                onAction(
                  kind === "photo"
                    ? { type: "photo", meal }
                    : { type: "log", meal },
                );
              }}
            >
              <Utensils size={20} color="#fff" />
              <Text className={buttonLabelClass.primary}>{MEAL_LABELS[meal]}</Text>
            </AppButton>
          ))}
        </View>
      ) : (
        <View className="gap-3">
          <AppButton onPress={() => setStep("log")}>
            <Utensils size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Log Food</Text>
          </AppButton>
          <AppButton onPress={() => setStep("photo")}>
            <Camera size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Snap a meal</Text>
          </AppButton>
          <AppButton
            onPress={() => {
              setStep("root");
              onAction({ type: "weight" });
            }}
          >
            <Scale size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Track Weight</Text>
          </AppButton>
          <AppButton
            onPress={() => {
              setStep("root");
              onAction({ type: "library" });
            }}
          >
            <PlusCircle size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Create Food</Text>
          </AppButton>
        </View>
      )}
    </AppModal>
  );
}
