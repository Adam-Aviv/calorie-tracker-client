import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Camera, Trash2 } from "lucide-react-native";
import { format } from "date-fns";
import { useUIStore } from "../store/uiStore";
import {
  apiErrorMessage,
  useAnalyzeMealPhotoMutation,
  useConfirmPhotoMealMutation,
} from "../hooks/queries";
import type { PhotoReviewItem } from "../types";
import AppModal from "./AppModal";
import AppButton, { buttonLabelClass } from "./AppButton";
import CategoryPicker from "./CategoryPicker";
import { captureMealPhoto, pickMealPhoto } from "../utils/camera";
import {
  isValidDecimalInput,
  parseDecimalInput,
} from "../utils/numberInput";

export default function PhotoMealModal() {
  const {
    showPhotoMeal,
    closePhotoMeal,
    selectedMealType,
    selectedLogDate,
    openAddFood,
  } = useUIStore();
  const analyzeMut = useAnalyzeMealPhotoMutation();
  const confirmMut = useConfirmPhotoMealMutation();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [items, setItems] = useState<PhotoReviewItem[]>([]);
  const [error, setError] = useState("");

  const reset = () => {
    setPhotoUri(null);
    setItems([]);
    setError("");
    analyzeMut.reset();
    confirmMut.reset();
  };

  const handleClose = () => {
    reset();
    closePhotoMeal();
  };

  const analyze = async (photo: {
    base64: string;
    uri: string;
    mediaType: string;
  }) => {
    setPhotoUri(photo.uri);
    setError("");
    try {
      const result = await analyzeMut.mutateAsync({
        imageBase64: photo.base64,
        mediaType: photo.mediaType,
      });
      setItems(
        result.items.map((item, index) => ({
          ...item,
          clientId: `${Date.now()}-${index}`,
          saveToLibrary: false,
          category: item.category || "other",
        })),
      );
    } catch (e) {
      setError(apiErrorMessage(e, "Could not analyze this photo"));
    }
  };

  const choosePhoto = () => {
    Alert.alert("Snap a meal", "Take a photo or choose from your library", [
      {
        text: "Camera",
        onPress: async () => {
          try {
            const photo = await captureMealPhoto();
            if (photo) await analyze(photo);
          } catch (e) {
            Alert.alert("Camera", apiErrorMessage(e, "Could not open camera"));
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          try {
            const photo = await pickMealPhoto();
            if (photo) await analyze(photo);
          } catch (e) {
            Alert.alert("Photos", apiErrorMessage(e, "Could not open gallery"));
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const updateItem = (id: string, patch: Partial<PhotoReviewItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.clientId === id ? { ...item, ...patch } : item)),
    );
  };

  const handleConfirm = async () => {
    if (items.length === 0) return;
    try {
      await confirmMut.mutateAsync({
        date: selectedLogDate,
        mealType: selectedMealType,
        items,
      });
      handleClose();
    } catch (e) {
      Alert.alert("Error", apiErrorMessage(e, "Failed to save meal"));
    }
  };

  const fallBackManual = () => {
    handleClose();
    openAddFood(selectedMealType, selectedLogDate);
  };

  return (
    <AppModal
      visible={showPhotoMeal}
      onClose={handleClose}
      title={`Snap ${selectedMealType}`}
    >
      <View className="gap-4">
        <Text className="text-slate-500 text-sm font-medium">
          {format(new Date(selectedLogDate), "EEEE, MMM d")} · estimated values —
          please check
        </Text>

        {!photoUri && !analyzeMut.isPending ? (
          <AppButton onPress={choosePhoto}>
            <Camera size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Choose photo</Text>
          </AppButton>
        ) : null}

        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            className="w-full h-48 rounded-3xl bg-slate-100"
            resizeMode="cover"
          />
        ) : null}

        {analyzeMut.isPending ? (
          <View className="items-center py-8 gap-3">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="font-bold text-slate-500">Reading your plate…</Text>
          </View>
        ) : null}

        {error ? (
          <View className="gap-3">
            <Text className="text-rose-500 font-bold">{error}</Text>
            <AppButton onPress={choosePhoto}>
              <Text className={buttonLabelClass.primary}>Try another photo</Text>
            </AppButton>
            <AppButton variant="muted" onPress={fallBackManual}>
              <Text className={buttonLabelClass.muted}>Log manually</Text>
            </AppButton>
          </View>
        ) : null}

        {items.map((item) => (
          <View
            key={item.clientId}
            className="bg-white p-4 rounded-3xl border border-slate-100 gap-3"
          >
            <View className="flex-row items-center justify-between">
              <TextInput
                className="flex-1 font-black text-slate-900 text-lg"
                value={item.food_name}
                onChangeText={(food_name) =>
                  updateItem(item.clientId, { food_name })
                }
              />
              <Pressable
                onPress={() =>
                  setItems((prev) =>
                    prev.filter((row) => row.clientId !== item.clientId),
                  )
                }
                className="p-2"
              >
                <Trash2 size={18} color="#f43f5e" />
              </Pressable>
            </View>
            {item.confidence ? (
              <Text className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                {item.confidence} confidence · estimated — please check
              </Text>
            ) : null}

            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase">
                  Serving
                </Text>
                <TextInput
                  keyboardType="decimal-pad"
                  className="font-bold text-slate-900"
                  value={String(item.serving_size)}
                  onChangeText={(next) => {
                    if (isValidDecimalInput(next)) {
                      updateItem(item.clientId, {
                        serving_size: parseDecimalInput(next),
                      });
                    }
                  }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase">
                  Unit
                </Text>
                <TextInput
                  className="font-bold text-slate-900"
                  value={item.serving_unit}
                  onChangeText={(serving_unit) =>
                    updateItem(item.clientId, { serving_unit })
                  }
                />
              </View>
            </View>

            <View className="flex-row gap-2">
              {(["calories", "protein", "carbs", "fats"] as const).map(
                (macro) => (
                  <View key={macro} className="flex-1">
                    <Text className="text-[10px] font-black text-slate-400 uppercase">
                      {macro}
                    </Text>
                    <TextInput
                      keyboardType="decimal-pad"
                      className="font-bold text-slate-900"
                      value={String(item[macro])}
                      onChangeText={(next) => {
                        if (isValidDecimalInput(next)) {
                          updateItem(item.clientId, {
                            [macro]: parseDecimalInput(next),
                          });
                        }
                      }}
                    />
                  </View>
                ),
              )}
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-bold text-slate-800">Save to library</Text>
                <Text className="text-xs text-slate-400">
                  Creates a reusable food from this estimate
                </Text>
              </View>
              <Switch
                value={item.saveToLibrary}
                onValueChange={(saveToLibrary) =>
                  updateItem(item.clientId, { saveToLibrary })
                }
                trackColor={{ true: "#4f46e5" }}
              />
            </View>
            {item.saveToLibrary ? (
              <CategoryPicker
                value={item.category}
                onChange={(category) => updateItem(item.clientId, { category })}
              />
            ) : null}
          </View>
        ))}

        {items.length > 0 ? (
          <AppButton onPress={handleConfirm} disabled={confirmMut.isPending}>
            {confirmMut.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className={buttonLabelClass.primary}>
                Log {items.length} item{items.length === 1 ? "" : "s"}
              </Text>
            )}
          </AppButton>
        ) : null}
      </View>
    </AppModal>
  );
}
