// src/pages/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLoading,
  IonText,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import { logOutOutline, calculatorOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import type { User } from "../types";
import "./Profile.css";
import {
  apiErrorMessage,
  useCalculateTDEEMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from "../hooks/queries";
import { useAuthStore } from "../store/authStore";

const Profile: React.FC = () => {
  const history = useHistory();
  const { user: storeUser, setUser, logout } = useAuthStore();

  // Fetch profile via React Query (uses token)
  const profileQuery = useProfileQuery(true);
  const updateProfileMut = useUpdateProfileMutation();
  const calcTDEEMut = useCalculateTDEEMutation();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [calculatedTDEE, setCalculatedTDEE] = useState<number | null>(null);

  const user = profileQuery.data || storeUser || undefined;

  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [currentWeight, setCurrentWeight] = useState(user?.currentWeight || 0);
  const [goalWeight, setGoalWeight] = useState(user?.goalWeight || 0);
  const [height, setHeight] = useState(user?.height || 0);
  const [age, setAge] = useState(user?.age || 0);
  const [gender, setGender] = useState<"male" | "female" | "other">(
    user?.gender || "other"
  );
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "active" | "very active"
  >(user?.activityLevel || "moderate");

  // Goals form state
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    user?.dailyCalorieGoal || 2000
  );
  const [proteinGoal, setProteinGoal] = useState(user?.proteinGoal || 150);
  const [carbsGoal, setCarbsGoal] = useState(user?.carbsGoal || 250);
  const [fatsGoal, setFatsGoal] = useState(user?.fatsGoal || 65);

  const hydratedForUserIdRef = useRef<string | null>(null);

  // When query loads/updates profile, sync it into the form
  useEffect(() => {
    if (!user) return;

    // hydrate only when the user changes (or first time)
    if (hydratedForUserIdRef.current === user.id) return;
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

  const loading =
    profileQuery.isFetching ||
    updateProfileMut.isPending ||
    calcTDEEMut.isPending;

  const handleUpdateProfile = async () => {
    try {
      const updates: Partial<User> = {
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
      };

      const updated = await updateProfileMut.mutateAsync(updates);
      if (updated) {
        setUser(updated);
        alert("Profile updated successfully!");
      } else {
        alert("Profile updated");
      }
    } catch (e) {
      console.error("Error updating profile:", e);
      alert(apiErrorMessage(e, "Failed to update profile"));
    }
  };

  const handleCalculateTDEE = async () => {
    try {
      const result = await calcTDEEMut.mutateAsync();
      setCalculatedTDEE(result.tdee);
      setDailyCalorieGoal(Math.round(result.tdee));
      alert(
        `Your estimated TDEE is ${Math.round(result.tdee)} calories per day!`
      );
    } catch (e) {
      console.error("Error calculating TDEE:", e);
      alert(
        apiErrorMessage(
          e,
          "Please fill in all required fields (weight, height, age, gender, activity level)"
        )
      );
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little/no exercise)" },
    { value: "light", label: "Light (1-3 days/week)" },
    { value: "moderate", label: "Moderate (3-5 days/week)" },
    { value: "active", label: "Active (6-7 days/week)" },
    { value: "very active", label: "Very Active (2x per day)" },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Personal Info Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Personal Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              <IonInput
                value={name}
                onIonInput={(e) =>
                  setName(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput value={user?.email || ""} disabled />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Current Weight (kg)</IonLabel>
              <IonInput
                type="number"
                value={currentWeight}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setCurrentWeight(parseFloat(v) || 0);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Goal Weight (kg)</IonLabel>
              <IonInput
                type="number"
                value={goalWeight}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setGoalWeight(parseFloat(v) || 0);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Height (cm)</IonLabel>
              <IonInput
                type="number"
                value={height}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setHeight(parseFloat(v) || 0);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Age</IonLabel>
              <IonInput
                type="number"
                value={age}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setAge(parseInt(v, 10) || 0);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel>Gender</IonLabel>
              <IonSelect
                value={gender}
                onIonChange={(e) => setGender(e.detail.value)}
              >
                <IonSelectOption value="male">Male</IonSelectOption>
                <IonSelectOption value="female">Female</IonSelectOption>
                <IonSelectOption value="other">Other</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Activity Level</IonLabel>
              <IonSelect
                value={activityLevel}
                onIonChange={(e) => setActivityLevel(e.detail.value)}
              >
                {activityLevels.map((level) => (
                  <IonSelectOption key={level.value} value={level.value}>
                    {level.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Nutrition Goals Card */}
        <IonCard>
          <IonCardHeader>
            <div className="card-header-with-button">
              <IonCardTitle>Nutrition Goals</IonCardTitle>
              <IonButton
                size="small"
                onClick={handleCalculateTDEE}
                disabled={loading}
              >
                <IonIcon icon={calculatorOutline} slot="start" />
                Calculate TDEE
              </IonButton>
            </div>
          </IonCardHeader>
          <IonCardContent>
            {calculatedTDEE && (
              <div className="tdee-info">
                <IonText color="primary">
                  <p>
                    <strong>
                      Estimated TDEE: {Math.round(calculatedTDEE)} cal/day
                    </strong>
                  </p>
                </IonText>
              </div>
            )}

            <IonItem>
              <IonLabel position="floating">Daily Calorie Goal</IonLabel>
              <IonInput
                type="number"
                value={dailyCalorieGoal}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setDailyCalorieGoal(parseInt(v, 10) || 2000);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Protein Goal (g)</IonLabel>
              <IonInput
                type="number"
                value={proteinGoal}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setProteinGoal(parseInt(v, 10) || 150);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Carbs Goal (g)</IonLabel>
              <IonInput
                type="number"
                value={carbsGoal}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setCarbsGoal(parseInt(v, 10) || 250);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Fats Goal (g)</IonLabel>
              <IonInput
                type="number"
                value={fatsGoal}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setFatsGoal(parseInt(v, 10) || 65);
                }}
              />
            </IonItem>

            <div className="macro-totals">
              <IonText color="medium">
                <p>
                  Total from macros:{" "}
                  {proteinGoal * 4 + carbsGoal * 4 + fatsGoal * 9} cal
                </p>
                <p style={{ fontSize: "0.85rem" }}>
                  (Protein & Carbs: 4 cal/g, Fats: 9 cal/g)
                </p>
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Actions */}
        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            Save Changes
          </IonButton>

          <IonButton
            expand="block"
            color="danger"
            fill="outline"
            onClick={() => setShowLogoutAlert(true)}
            disabled={loading}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Logout
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="Please wait..." />

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Logout"
          message="Are you sure you want to logout?"
          buttons={[
            { text: "Cancel", role: "cancel" },
            { text: "Logout", role: "destructive", handler: handleLogout },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
