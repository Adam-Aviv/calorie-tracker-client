import { useState, type ReactNode } from "react";
import { View, Pressable, Text } from "react-native";
import { Tabs } from "expo-router";
import { BookText, Library, TrendingUp, User, Plus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlobalActionModal, {
  type GlobalAction,
} from "../../src/components/GlobalActionModal";
import AddFoodModal from "../../src/components/AddFoodModal";
import AddFoodLibraryModal from "../../src/components/AddFoodLibraryModal";
import AddWeightModal from "../../src/components/AddWeightModal";
import PhotoMealModal from "../../src/components/PhotoMealModal";
import { useUIStore } from "../../src/store/uiStore";

const ACTIVE = "#4f46e5";
const INACTIVE = "#94a3b8";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [showActionModal, setShowActionModal] = useState(false);
  const { openAddFood, openAddWeight, openAddFoodLibrary, openPhotoMeal } =
    useUIStore();

  const handleAction = (action: GlobalAction) => {
    setShowActionModal(false);
    if (action.type === "log") openAddFood(action.meal);
    if (action.type === "photo") openPhotoMeal(action.meal);
    if (action.type === "weight") openAddWeight();
    if (action.type === "library") openAddFoodLibrary();
  };

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state, navigation }) => {
          const current = state.routes[state.index]?.name;
          const tabBtn = (
            name: string,
            label: string,
            icon: (color: string, focused: boolean) => ReactNode,
          ) => {
            const focused = current === name;
            const color = focused ? ACTIVE : INACTIVE;
            const route = state.routes.find((r) => r.name === name);
            return (
              <Pressable
                key={name}
                onPress={() => {
                  if (!route) return;
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(name);
                  }
                }}
                className="flex-1 items-center justify-center"
              >
                {icon(color, focused)}
                <Text
                  className="text-[10px] font-bold uppercase mt-1"
                  style={{ color, letterSpacing: 1 }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          };

          return (
            <View
              className="flex-row items-center border-t border-slate-100 bg-white"
              style={{
                paddingBottom: Math.max(insets.bottom, 8),
                height: 80 + insets.bottom,
              }}
            >
              {tabBtn("diary", "Diary", (color, focused) => (
                <BookText size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
              ))}
              {tabBtn("progress", "Progress", (color, focused) => (
                <TrendingUp size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
              ))}
              <View className="flex-1 items-center justify-center">
                <Pressable
                  onPress={() => setShowActionModal(true)}
                  className="w-14 h-14 bg-slate-900 items-center justify-center"
                  style={{ borderRadius: 20 }}
                >
                  <Plus size={28} color="#fff" strokeWidth={3} />
                </Pressable>
              </View>
              {tabBtn("foods", "Library", (color, focused) => (
                <Library size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
              ))}
              {tabBtn("profile", "Profile", (color, focused) => (
                <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
              ))}
            </View>
          );
        }}
      >
        <Tabs.Screen name="diary" />
        <Tabs.Screen name="progress" />
        <Tabs.Screen name="foods" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <GlobalActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onAction={handleAction}
      />
      <AddFoodModal />
      <AddFoodLibraryModal />
      <AddWeightModal />
      <PhotoMealModal />
    </>
  );
}
