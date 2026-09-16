import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import {
  User as UserIcon,
  Scale,
  Ruler,
  Target,
  LogOut,
  Calculator,
  Flame,
  Save,
} from "lucide-react-native";
import { router } from "expo-router";
import AppButton, { buttonLabelClass } from "../../src/components/AppButton";
import {
  useCalculateTDEEMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../src/hooks/queries";
import { useAuthStore } from "../../src/store/authStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user: storeUser, setUser, logout } = useAuthStore();
  const profileQuery = useProfileQuery(true);
  const updateProfileMut = useUpdateProfileMutation();
  const calcTDEEMut = useCalculateTDEEMutation();
  const user = profileQuery.data || storeUser || undefined;

  const [name, setName] = useState(user?.name || "");
  const [currentWeight, setCurrentWeight] = useState(user?.currentWeight || 0);
  const [goalWeight, setGoalWeight] = useState(user?.goalWeight || 0);
  const [height, setHeight] = useState(user?.height || 0);
  const [age, setAge] = useState(user?.age || 0);
  const [gender, setGender] = useState<"male" | "female" | "other">(
    user?.gender || "other",
  );
  const [activityLevel, setActivityLevel] = useState(
    user?.activityLevel || "moderate",
  );
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    user?.dailyCalorieGoal || 2000,
  );
  const [proteinGoal, setProteinGoal] = useState(user?.proteinGoal || 150);
  const [carbsGoal, setCarbsGoal] = useState(user?.carbsGoal || 250);
  const [fatsGoal, setFatsGoal] = useState(user?.fatsGoal || 65);
  const hydratedForUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || hydratedForUserIdRef.current === user.id) return;
    hydratedForUserIdRef.current = user.id;
    setName(user.name || "");
    setCurrentWeight(user.currentWeight || 0);
    setGoalWeight(user.goalWeight || 0);
    setHeight(user.height || 0);
    setAge(user.age || 0);
    setGender(user.gender || "other");
    setActivityLevel(user.activityLevel || "moderate");
    setDailyCalorieGoal(user.dailyCalorieGoal || 2000);
    setProteinGoal(user.proteinGoal || 150);
    setCarbsGoal(user.carbsGoal || 250);
    setFatsGoal(user.fatsGoal || 65);
  }, [user]);

  const handleUpdateProfile = async () => {
    const updated = await updateProfileMut.mutateAsync({
      name,
      currentWeight,
      goalWeight,
      height,
      age,
      gender,
      activityLevel,
      dailyCalorieGoal,
      proteinGoal,
      carbsGoal,
      fatsGoal,
    });
    if (updated) setUser(updated);
  };

  const handleCalculateTDEE = async () => {
    try {
      const result = await calcTDEEMut.mutateAsync({
        currentWeight,
        height,
        age,
        gender,
        activityLevel,
      });
      setDailyCalorieGoal(Math.round(result.tdee));
    } catch (e) {
      Alert.alert(
        "TDEE",
        e instanceof Error ? e.message : "Could not calculate TDEE",
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <Text className="text-2xl font-black text-slate-900 px-3 pt-3 pb-2">
        Settings
      </Text>
      <ScrollView className="flex-1 px-3" contentContainerClassName="pb-8 gap-8">
        <View className="flex-row items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100">
          <View className="w-16 h-16 bg-indigo-600 rounded-2xl items-center justify-center">
            <UserIcon size={32} color="#fff" />
          </View>
          <View>
            <Text className="text-xl font-bold text-slate-900">
              {name || "Your Name"}
            </Text>
            <Text className="text-slate-400 text-sm font-medium">
              {user?.email}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 mb-3">
            Body Metrics
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <MetricInput
              icon={<Scale size={18} color="#94a3b8" />}
              label="Weight"
              value={currentWeight}
              unit="kg"
              onChange={setCurrentWeight}
            />
            <MetricInput
              icon={<Target size={18} color="#94a3b8" />}
              label="Goal"
              value={goalWeight}
              unit="kg"
              onChange={setGoalWeight}
            />
            <MetricInput
              icon={<Ruler size={18} color="#94a3b8" />}
              label="Height"
              value={height}
              unit="cm"
              onChange={setHeight}
            />
            <MetricInput
              icon={<UserIcon size={18} color="#94a3b8" />}
              label="Age"
              value={age}
              unit="yrs"
              onChange={setAge}
            />
          </View>
        </View>

        <View className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
          <OptionRow
            label="Gender"
            value={gender}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            onChange={(v) => setGender(v as typeof gender)}
          />
          <OptionRow
            label="Activity"
            value={activityLevel}
            options={[
              { value: "sedentary", label: "Sedentary" },
              { value: "light", label: "Light" },
              { value: "moderate", label: "Moderate" },
              { value: "active", label: "Active" },
              { value: "very active", label: "Very Active" },
            ]}
            onChange={(v) =>
              setActivityLevel(
                v as "sedentary" | "light" | "moderate" | "active" | "very active",
              )
            }
          />
        </View>

        <AppButton onPress={handleCalculateTDEE} disabled={calcTDEEMut.isPending}>
          <Calculator size={20} color="#fff" />
          <Text className={buttonLabelClass.primary}>
            {calcTDEEMut.isPending ? "Calculating..." : "Calculate TDEE"}
          </Text>
        </AppButton>

        <View>
          <Text className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 mb-3">
            Daily Targets
          </Text>
          <View className="bg-indigo-600 rounded-[2.5rem] p-8 mb-3">
            <Text className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-3">
              Calories
            </Text>
            <View className="flex-row items-baseline gap-3">
              <TextInput
                keyboardType="number-pad"
                value={String(dailyCalorieGoal)}
                onChangeText={(v) => setDailyCalorieGoal(parseInt(v || "0", 10))}
                className="text-5xl font-black text-white w-36"
              />
              <Text className="text-lg font-bold text-indigo-200">kcal</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <MacroBox label="Protein" value={proteinGoal} onChange={setProteinGoal} />
            <MacroBox label="Carbs" value={carbsGoal} onChange={setCarbsGoal} />
            <MacroBox label="Fats" value={fatsGoal} onChange={setFatsGoal} />
          </View>
        </View>

        <View className="gap-3">
          <AppButton
            onPress={handleUpdateProfile}
            disabled={updateProfileMut.isPending}
          >
            <Save size={20} color="#fff" />
            <Text className={buttonLabelClass.primary}>Save Settings</Text>
          </AppButton>
          <AppButton
            variant="ghost"
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to leave?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: async () => {
                    await logout();
                    router.replace("/(auth)/login");
                  },
                },
              ])
            }
          >
            <LogOut size={18} color="#ef4444" />
            <Text className={buttonLabelClass.ghost}>Logout Account</Text>
          </AppButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricInput({
  icon,
  label,
  value,
  unit,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <View className="bg-white p-4 rounded-3xl border border-slate-100 w-[48%]">
      <View className="flex-row items-center gap-2 mb-1">
        {icon}
        <Text className="text-[10px] font-black uppercase text-slate-400">
          {label}
        </Text>
      </View>
      <View className="flex-row items-baseline gap-1">
        <TextInput
          keyboardType="decimal-pad"
          value={String(value || "")}
          onChangeText={(v) => onChange(parseFloat(v) || 0)}
          className="flex-1 text-lg font-bold text-slate-900"
        />
        <Text className="text-xs font-bold text-slate-300">{unit}</Text>
      </View>
    </View>
  );
}

function MacroBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 items-center">
      <Text className="text-[10px] font-black uppercase text-slate-400">
        {label}
      </Text>
      <TextInput
        keyboardType="number-pad"
        value={String(value)}
        onChangeText={(v) => onChange(parseInt(v || "0", 10))}
        className="w-full text-center text-lg font-black text-slate-900"
      />
      <Text className="text-[10px] font-bold text-slate-300">grams</Text>
    </View>
  );
}

function OptionRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <View className="px-4 py-4 border-b border-slate-50">
      <Text className="font-bold text-slate-700 mb-2">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`px-3 py-2 rounded-xl border ${
              value === opt.value
                ? "bg-indigo-50 border-indigo-600"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                value === opt.value ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
