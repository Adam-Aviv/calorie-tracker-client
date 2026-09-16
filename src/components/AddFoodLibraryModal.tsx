import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { Zap, PlusCircle } from "lucide-react-native";
import { apiErrorMessage, useCreateFoodMutation } from "../hooks/queries";
import { useUIStore } from "../store/uiStore";
import AppButton, { buttonLabelClass } from "./AppButton";
import AppModal from "./AppModal";
import Field from "./Field";
import CategoryPicker from "./CategoryPicker";
import {
  isValidDecimalInput,
  parseDecimalInput,
} from "../utils/numberInput";

const emptyForm = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  servingSize: "100",
  servingUnit: "grams",
  category: "other",
};

export default function AddFoodLibraryModal() {
  const { showAddFoodLibrary, closeAddFoodLibrary } = useUIStore();
  const createFoodMut = useCreateFoodMutation();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (showAddFoodLibrary) setForm(emptyForm);
  }, [showAddFoodLibrary]);

  const handleClose = () => {
    closeAddFoodLibrary();
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    try {
      await createFoodMut.mutateAsync({
        name: form.name,
        calories: parseDecimalInput(form.calories),
        protein: parseDecimalInput(form.protein),
        carbs: parseDecimalInput(form.carbs),
        fats: parseDecimalInput(form.fats),
        servingSize: parseDecimalInput(form.servingSize, 100),
        servingUnit: form.servingUnit,
        category: form.category,
      });
      handleClose();
    } catch (e) {
      Alert.alert("Error", apiErrorMessage(e, "Failed to save food"));
    }
  };

  return (
    <AppModal visible={showAddFoodLibrary} onClose={handleClose} title="New Food">
      <View className="gap-4">
        <Field
          label="Food Name"
          value={form.name}
          onChangeText={(name) => setForm({ ...form, name })}
          placeholder="e.g. Greek Yogurt"
        />
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Field
              label="Calories"
              icon={<Zap size={10} color="#94a3b8" />}
              keyboardType="decimal-pad"
              value={form.calories}
              onChangeText={(next) => {
                if (isValidDecimalInput(next)) setForm({ ...form, calories: next });
              }}
              placeholder="0"
            />
          </View>
          <View className="flex-1">
            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Category
              </Text>
              <CategoryPicker
                value={form.category}
                onChange={(category) => setForm({ ...form, category })}
              />
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          {(["protein", "carbs", "fats"] as const).map((macro) => (
            <View key={macro} className="flex-1">
              <Field
                label={macro}
                keyboardType="decimal-pad"
                value={form[macro]}
                onChangeText={(next) => {
                  if (isValidDecimalInput(next)) setForm({ ...form, [macro]: next });
                }}
                placeholder="0"
                className="text-center"
              />
            </View>
          ))}
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Field
              label="Serving Size"
              keyboardType="decimal-pad"
              value={form.servingSize}
              onChangeText={(next) => {
                if (isValidDecimalInput(next))
                  setForm({ ...form, servingSize: next });
              }}
            />
          </View>
          <View className="flex-1">
            <Field
              label="Unit"
              value={form.servingUnit}
              onChangeText={(servingUnit) => setForm({ ...form, servingUnit })}
              placeholder="oz, cup..."
            />
          </View>
        </View>

        <AppButton
          onPress={handleSubmit}
          disabled={
            !form.name ||
            parseDecimalInput(form.calories) <= 0 ||
            createFoodMut.isPending
          }
        >
          <PlusCircle size={20} color="#fff" />
          <Text className={buttonLabelClass.primary}>Add to Library</Text>
        </AppButton>
      </View>
    </AppModal>
  );
}
