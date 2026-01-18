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
  IonButton,
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
      const result = await calcTDEEMut.mutateAsync();
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
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                  <UserIcon size={20} />
                </div>
                <span className="font-bold text-slate-700">Gender</span>
              </div>
              <IonSelect
                value={gender}
                interface="popover"
                onIonChange={(e) => setGender(e.detail.value)}
                className="text-indigo-600 font-bold"
              >
                <IonSelectOption value="male">Male</IonSelectOption>
                <IonSelectOption value="female">Female</IonSelectOption>
                <IonSelectOption value="other">Other</IonSelectOption>
              </IonSelect>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                  <Flame size={20} />
                </div>
                <span className="font-bold text-slate-700">Activity</span>
              </div>
              <IonSelect
                value={activityLevel}
                interface="action-sheet"
                onIonChange={(e) => setActivityLevel(e.detail.value)}
                className="text-indigo-600 font-bold max-w-[150px]"
              >
                <IonSelectOption value="sedentary">Sedentary</IonSelectOption>
                <IonSelectOption value="light">Light</IonSelectOption>
                <IonSelectOption value="moderate">Moderate</IonSelectOption>
                <IonSelectOption value="active">Active</IonSelectOption>
              </IonSelect>
            </div>
          </div>

          {/* Section: Nutrition Goals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Daily Targets
              </h3>
              <button
                onClick={handleCalculateTDEE}
                className="text-indigo-600 text-xs font-black flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full active:scale-95 transition-all"
              >
                <Calculator size={14} /> CALC TDEE
              </button>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-2">
                  Calories
                </p>
                <div className="flex items-end gap-2">
                  <input
                    type="number"
                    value={dailyCalorieGoal}
                    onChange={(e) =>
                      setDailyCalorieGoal(parseInt(e.target.value))
                    }
                    className="bg-transparent text-5xl font-black w-32 outline-none border-b-2 border-indigo-400 focus:border-white transition-colors"
                  />
                  <span className="text-xl font-bold mb-2 text-indigo-200">
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
            <IonButton
              expand="block"
              onClick={handleUpdateProfile}
              className="h-16 font-black text-lg"
              style={{
                "--background": "#0f172a",
                "--background-activated": "#1e293b",
                "--color": "#ffffff",
                "--border-radius": "20px",
                "--padding-top": "0",
                "--padding-bottom": "0",
                "--box-shadow": "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <Save size={20} />
                Save Settings
              </div>
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              onClick={() => setShowLogoutAlert(true)}
              className="h-14 font-bold"
              style={{
                "--color": "#ef4444",
                "--background-activated": "#fef2f2",
                "--border-radius": "20px",
                "--padding-top": "0",
                "--padding-bottom": "0",
              }}
            >
              <div className="flex items-center gap-2">
                <LogOut size={18} />
                Logout Account
              </div>
            </IonButton>
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
              handler: () => {
                logout();
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
