import { useState } from "react";
import { View, Text } from "react-native";
import { Scale } from "lucide-react-native";
import { format } from "date-fns";
import { useUIStore } from "../store/uiStore";
import { useCreateWeightMutation } from "../hooks/queries";
import AppButton, { buttonLabelClass } from "./AppButton";
import AppModal from "./AppModal";
import Field from "./Field";

export default function AddWeightModal() {
  const { showAddWeight, closeAddWeight } = useUIStore();
  const createMut = useCreateWeightMutation();
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleAddWeight = async () => {
    const parsed = parseFloat(weight);
    if (!parsed) return;
    await createMut.mutateAsync({ weight: parsed, date });
    closeAddWeight();
    setWeight("");
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <AppModal visible={showAddWeight} onClose={closeAddWeight} title="New Entry">
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-indigo-50 items-center justify-center rounded-3xl mb-4">
          <Scale size={32} color="#4f46e5" />
        </View>
        <Text className="text-slate-500 text-sm font-medium">
          Log your weight for today
        </Text>
      </View>

      <View className="gap-4">
        <Field
          label="Weight (kg)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
        />
        <Field
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <AppButton
          onPress={handleAddWeight}
          disabled={!parseFloat(weight) || createMut.isPending}
        >
          <Scale size={20} color="#fff" />
          <Text className={buttonLabelClass.primary}>Save Entry</Text>
        </AppButton>
        <AppButton variant="muted" onPress={closeAddWeight}>
          <Text className={buttonLabelClass.muted}>Cancel</Text>
        </AppButton>
      </View>
    </AppModal>
  );
}
