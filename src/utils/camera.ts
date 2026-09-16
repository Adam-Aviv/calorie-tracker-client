import * as ImagePicker from "expo-image-picker";

type MealPhoto = {
  base64: string;
  uri: string;
  mediaType: string;
};

function toMealPhoto(
  asset: ImagePicker.ImagePickerAsset | undefined,
): MealPhoto | null {
  if (!asset?.base64) return null;
  return {
    base64: asset.base64,
    uri: asset.uri,
    mediaType: asset.mimeType || "image/jpeg",
  };
}

export async function pickMealPhoto(): Promise<MealPhoto | null> {
  const library = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!library.granted) {
    throw new Error("Photo library permission is required");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    base64: true,
    allowsEditing: false,
  });

  if (result.canceled) return null;
  return toMealPhoto(result.assets[0]);
}

export async function captureMealPhoto(): Promise<MealPhoto | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Camera permission is required");
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.7,
    base64: true,
  });

  if (result.canceled) return null;
  return toMealPhoto(result.assets[0]);
}
