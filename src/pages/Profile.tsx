import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonAlert,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  User as UserIcon,
  Scale,
  Ruler,
  Target,
  LogOut,
  Calculator,
  Flame,
  Save,
} from "lucide-react";
import { useHistory } from "react-router-dom";
import AppButton from "../components/AppButton";
import {
  useCalculateTDEEMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from "../hooks/queries";
import { useAuthStore } from "../store/authStore";

const Profile: React.FC = () => {
  const history = useHistory();
  const { user: storeUser, setUser, logout } = useAuthStore();

  const profileQuery = useProfileQuery(true);
  const updateProfileMut = useUpdateProfileMutation();
  const calcTDEEMut = useCalculateTDEEMutation();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const user = profileQuery.data || storeUser || undefined;

  // Form States
  const [name, setName] = useState(user?.name || "");
  const [currentWeight, setCurrentWeight] = useState(user?.currentWeight || 0);
  const [goalWeight, setGoalWeight] = useState(user?.goalWeight || 0);
  const [height, setHeight] = useState(user?.height || 0);
  const [age, setAge] = useState(user?.age || 0);
  const [gender, setGender] = useState<"male" | "female" | "other">(
    user?.gender || "other"
  );
  const [activityLevel, setActivityLevel] = useState(
    user?.activityLevel || "moderate"
  );
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    user?.dailyCalorieGoal || 2000
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
    try {
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
    } catch (e) {
      console.error(e);
    }
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
      console.error(e);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="--background: transparent; pt-4 px-4">
          <IonTitle className="text-2xl font-black text-slate-900 px-0">
            Settings
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="--background: #f8fafc;">
        <div className="p-6 space-y-8 max-w-2xl mx-auto">
          {/* Section: Profile Header */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <UserIcon size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {name || "Your Name"}
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Section: Body Metrics */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
              Body Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricInput
                icon={<Scale size={18} />}
                label="Weight"
                value={currentWeight}
                unit="kg"
                onChange={setCurrentWeight}
              />
              <MetricInput
                icon={<Target size={18} />}
                label="Goal"
                value={goalWeight}
                unit="kg"
                onChange={setGoalWeight}
              />
              <MetricInput
                icon={<Ruler size={18} />}
                label="Height"
                value={height}
                unit="cm"
                onChange={setHeight}
              />
              <MetricInput
                icon={<UserIcon size={18} />}
                label="Age"
                value={age}
                unit="yrs"
                onChange={setAge}
              />
            </div>
          </div>

          {/* Section: Activity & Gender */}
          <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            <SettingSelectRow
              icon={<UserIcon size={20} />}
              label="Gender"
              value={gender}
              onChange={(v) => setGender(v as "male" | "female" | "other")}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
            <SettingSelectRow
              icon={<Flame size={20} />}
              label="Activity"
              value={activityLevel}
              onChange={(v) =>
                setActivityLevel(
                  v as "sedentary" | "light" | "moderate" | "active" | "very active"
                )
              }
              options={[
                { value: "sedentary", label: "Sedentary" },
                { value: "light", label: "Light" },
                { value: "moderate", label: "Moderate" },
                { value: "active", label: "Active" },
                { value: "very active", label: "Very Active" },
              ]}
            />
          </div>

          {/* TDEE Calculator */}
          <AppButton
            onClick={handleCalculateTDEE}
            disabled={calcTDEEMut.isPending}
          >
            <Calculator size={20} />
            {calcTDEEMut.isPending ? "Calculating..." : "Calculate TDEE"}
          </AppButton>

          {/* Section: Nutrition Goals */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
              Daily Targets
            </h3>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-3">
                  Calories
                </p>
                <div className="flex items-baseline gap-3">
                  <input
                    type="number"
                    value={dailyCalorieGoal}
                    onChange={(e) =>
                      setDailyCalorieGoal(parseInt(e.target.value))
                    }
                    className="bg-transparent text-5xl font-black w-36 outline-none border-b-2 border-indigo-400/60 focus:border-white transition-colors pb-1 leading-none"
                  />
                  <span className="text-lg font-bold text-indigo-200/80">
                    kcal
                  </span>
                </div>
              </div>
              <Flame className="absolute -right-4 -bottom-4 text-indigo-500/30 w-32 h-32" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MacroBox
                label="Protein"
                value={proteinGoal}
                color="bg-rose-500"
                onChange={setProteinGoal}
              />
              <MacroBox
                label="Carbs"
                value={carbsGoal}
                color="bg-amber-500"
                onChange={setCarbsGoal}
              />
              <MacroBox
                label="Fats"
                value={fatsGoal}
                color="bg-sky-500"
                onChange={setFatsGoal}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 space-y-3">
            <AppButton onClick={handleUpdateProfile} disabled={updateProfileMut.isPending}>
              <Save size={20} />
              Save Settings
            </AppButton>

            <AppButton variant="ghost" onClick={() => setShowLogoutAlert(true)}>
              <LogOut size={18} />
              Logout Account
            </AppButton>
          </div>
        </div>

        <IonLoading isOpen={updateProfileMut.isPending} message="Saving..." />
        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Logout"
          message="Are you sure you want to leave?"
          buttons={[
            { text: "Cancel", role: "cancel" },
            {
              text: "Logout",
              role: "destructive",
              handler: async () => {
                await logout();
                history.push("/login");
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

// --- Sub-components for cleaner code ---

const settingItemStyle = {
  "--background": "transparent",
  "--padding-start": "16px",
  "--padding-end": "16px",
  "--inner-padding-end": "0",
  "--min-height": "64px",
} as React.CSSProperties;

const selectStyle = {
  "--padding-start": "0",
  "--padding-end": "0",
  "--placeholder-color": "#4f46e5",
  "--highlight-color-focused": "#4f46e5",
  maxWidth: "140px",
} as React.CSSProperties;

const SettingSelectRow = ({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <IonItem lines="none" style={settingItemStyle} className="profile-setting-item">
    <div slot="start" className="flex items-center gap-3 mr-1">
      <div className="p-2 bg-slate-50 rounded-xl text-slate-600">{icon}</div>
    </div>
    <IonLabel className="!font-bold !text-slate-700">{label}</IonLabel>
    <IonSelect
      slot="end"
      value={value}
      interface="action-sheet"
      onIonChange={(e) => onChange(e.detail.value)}
      className="profile-setting-select font-bold text-indigo-600"
      style={selectStyle}
    >
      {options.map((opt) => (
        <IonSelectOption key={opt.value} value={opt.value}>
          {opt.label}
        </IonSelectOption>
      ))}
    </IonSelect>
  </IonItem>
);

const MetricInput = ({ icon, label, value, unit, onChange }: any) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1 focus-within:border-indigo-500 transition-all">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full text-lg font-bold text-slate-900 outline-none bg-transparent"
      />
      <span className="text-xs font-bold text-slate-300">{unit}</span>
    </div>
  </div>
);

const MacroBox = ({ label, value, color, onChange }: any) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
    <div className={`w-2 h-2 rounded-full mx-auto ${color}`} />
    <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full text-center text-lg font-black text-slate-900 outline-none bg-transparent"
    />
    <p className="text-[10px] font-bold text-slate-300 italic">grams</p>
  </div>
);

export default Profile;
