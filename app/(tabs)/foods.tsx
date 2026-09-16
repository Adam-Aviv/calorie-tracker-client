import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { Search, Zap, Save } from "lucide-react-native";
import type { Food } from "../../src/types";
import {
  apiErrorMessage,
  useDeleteFoodMutation,
  useFoodsQuery,
  useUpdateFoodMutation,
} from "../../src/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import AppButton, { buttonLabelClass } from "../../src/components/AppButton";
import AppModal from "../../src/components/AppModal";
import FoodSwipeCard from "../../src/components/FoodSwipeCard";
import Field from "../../src/components/Field";
import CategoryPicker from "../../src/components/CategoryPicker";
import { filterFoods } from "../../src/utils/foods";
import {
  formatDecimalField,
  isValidDecimalInput,
  parseDecimalInput,
} from "../../src/utils/numberInput";
import { SafeAreaView } from "react-native-safe-area-context";

const emptyFoodForm = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  servingSize: "100",
  servingUnit: "grams",
  category: "other",
};

export default function FoodsScreen() {
  const qc = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [form, setForm] = useState(emptyFoodForm);

  const foodsQuery = useFoodsQuery();
  const updateFoodMut = useUpdateFoodMutation();
  const deleteFoodMut = useDeleteFoodMutation();

  const foods = useMemo(
    () =>
      filterFoods(foodsQuery.data ?? [], {
        search: searchText,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      }),
    [foodsQuery.data, searchText, categoryFilter],
  );

  const openEditModal = (food: Food) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      calories: formatDecimalField(food.calories),
      protein: formatDecimalField(food.protein),
      carbs: formatDecimalField(food.carbs),
      fats: formatDecimalField(food.fats),
      servingSize: formatDecimalField(food.servingSize),
      servingUnit: food.servingUnit,
      category: food.category || "other",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!editingFood) return;
    try {
      await updateFoodMut.mutateAsync({
        id: editingFood.id,
        updates: {
          name: form.name,
          calories: parseDecimalInput(form.calories),
          protein: parseDecimalInput(form.protein),
          carbs: parseDecimalInput(form.carbs),
          fats: parseDecimalInput(form.fats),
          servingSize: parseDecimalInput(form.servingSize, 100),
          servingUnit: form.servingUnit,
          category: form.category,
        },
      });
      setShowModal(false);
    } catch (e) {
      Alert.alert("Error", apiErrorMessage(e, "Failed to save food"));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-3 pt-3 pb-2 bg-white">
        <Text className="text-2xl font-black text-slate-900 mb-4">
          Food Library
        </Text>
        <View className="flex-row items-center h-12 bg-slate-50 rounded-2xl px-4">
          <Search size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 font-bold text-slate-900"
            placeholder="Search library..."
            placeholderTextColor="#94a3b8"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View className="px-3 py-3">
        <CategoryPicker
          includeAll
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </View>

      <ScrollView
        className="flex-1 px-3"
        refreshControl={
          <RefreshControl
            refreshing={foodsQuery.isRefetching}
            onRefresh={() => qc.invalidateQueries({ queryKey: ["foods"] })}
          />
        }
        contentContainerClassName="gap-3 pb-8"
      >
        {foods.map((food) => (
          <FoodSwipeCard
            key={food.id}
            food={food}
            onEdit={() => openEditModal(food)}
            onDelete={() =>
              Alert.alert("Delete food", `Remove ${food.name}?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteFoodMut.mutate(food.id),
                },
              ])
            }
          />
        ))}
      </ScrollView>

      <AppModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Food"
      >
        <View className="gap-4">
          <Field
            label="Food Name"
            value={form.name}
            onChangeText={(name) => setForm({ ...form, name })}
          />
          <Field
            label="Calories"
            icon={<Zap size={10} color="#94a3b8" />}
            keyboardType="decimal-pad"
            value={form.calories}
            onChangeText={(next) => {
              if (isValidDecimalInput(next)) setForm({ ...form, calories: next });
            }}
          />
          <View>
            <Text className="text-[10px] font-black text-slate-400 uppercase mb-2">
              Category
            </Text>
            <CategoryPicker
              value={form.category}
              onChange={(category) => setForm({ ...form, category })}
            />
          </View>
          <View className="flex-row gap-3">
            {(["protein", "carbs", "fats"] as const).map((macro) => (
              <View key={macro} className="flex-1">
                <Field
                  label={macro}
                  keyboardType="decimal-pad"
                  value={form[macro]}
                  onChangeText={(next) => {
                    if (isValidDecimalInput(next))
                      setForm({ ...form, [macro]: next });
                  }}
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
              />
            </View>
          </View>
          <AppButton onPress={handleSubmit} disabled={updateFoodMut.isPending}>
            <Save size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Update Food</Text>
          </AppButton>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}
