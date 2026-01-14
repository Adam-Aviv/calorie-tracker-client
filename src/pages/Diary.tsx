import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonActionSheet,
  IonLoading,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import {
  chevronBack,
  chevronForward,
  add,
  calendarOutline,
} from "ionicons/icons";
import { format, parseISO, addDays, subDays } from "date-fns";
import { useAuthStore } from "../store/authStore";
import type { FoodLog } from "../types";
import MacroBar from "../components/MacroBar";
import FoodLogItem from "../components/FoodLogItem";
import AddFoodModal from "../components/AddFoodModal";
import EditFoodLogModal from "../components/EditFoodLogModal";
import "./Diary.css";
import { useDailyLogsQuery, useDeleteLogMutation } from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "../hooks/queries";

const Diary: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();

  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [showMealTypeSheet, setShowMealTypeSheet] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");

  const dailyQuery = useDailyLogsQuery(currentDate, true);
  const deleteLogMut = useDeleteLogMutation();

  const dailyData = dailyQuery.data || null;

  const loading = dailyQuery.isFetching || deleteLogMut.isPending;

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await qc.invalidateQueries({ queryKey: qk.daily(currentDate) });
    event.detail.complete();
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await deleteLogMut.mutateAsync({ date: currentDate, id: logId });
    } catch (e) {
      console.error("Error deleting log:", e);
      alert("Failed to delete entry");
    }
  };

  const handleEditLog = (log: FoodLog) => {
    setEditingLog(log);
    setShowEditModal(true);
  };

  const handleAddFood = (
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    setSelectedMealType(mealType);
    setShowMealTypeSheet(false);
    setShowAddModal(true);
  };

  const previousDay = () => {
    setCurrentDate(format(subDays(parseISO(currentDate), 1), "yyyy-MM-dd"));
  };

  const nextDay = () => {
    setCurrentDate(format(addDays(parseISO(currentDate), 1), "yyyy-MM-dd"));
  };

  const goToToday = () => {
    setCurrentDate(format(new Date(), "yyyy-MM-dd"));
  };

  const isToday = currentDate === format(new Date(), "yyyy-MM-dd");

  const summary = dailyData?.summary || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    mealBreakdown: {},
  };

  const goals = {
    calories: user?.dailyCalorieGoal || 2000,
    protein: user?.proteinGoal || 150,
    carbs: user?.carbsGoal || 250,
    fats: user?.fatsGoal || 65,
  };

  const getMealLogs = (mealType: string) => {
    return dailyData?.logs.filter((log) => log.mealType === mealType) || [];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={previousDay}>
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{format(parseISO(currentDate), "MMM d, yyyy")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={nextDay}>
              <IonIcon icon={chevronForward} />
            </IonButton>
            {!isToday && (
              <IonButton onClick={goToToday}>
                <IonIcon icon={calendarOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Daily Summary</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="calorie-summary">
              <div className="calorie-circle">
                <div className="calorie-value">
                  {Math.round(summary.totalCalories)}
                </div>
                <div className="calorie-goal">/ {goals.calories}</div>
                <div className="calorie-label">Calories</div>
              </div>
              <div className="calorie-remaining">
                <IonText
                  color={
                    summary.totalCalories > goals.calories
                      ? "danger"
                      : "success"
                  }
                >
                  <h3>
                    {Math.abs(goals.calories - summary.totalCalories)} cal
                  </h3>
                  <p>
                    {summary.totalCalories > goals.calories
                      ? "Over"
                      : "Remaining"}
                  </p>
                </IonText>
              </div>
            </div>

            <MacroBar
              label="Protein"
              current={summary.totalProtein}
              goal={goals.protein}
              color="success"
            />
            <MacroBar
              label="Carbs"
              current={summary.totalCarbs}
              goal={goals.carbs}
              color="warning"
            />
            <MacroBar
              label="Fats"
              current={summary.totalFats}
              goal={goals.fats}
              color="danger"
            />
          </IonCardContent>
        </IonCard>

        {(["breakfast", "lunch", "dinner", "snack"] as const).map((mt) => (
          <IonCard key={mt}>
            <IonCardHeader>
              <div className="meal-header">
                <IonCardTitle>
                  {mt === "breakfast"
                    ? "🌅 Breakfast"
                    : mt === "lunch"
                    ? "☀️ Lunch"
                    : mt === "dinner"
                    ? "🌙 Dinner"
                    : "🍿 Snacks"}
                </IonCardTitle>
                <IonButton
                  size="small"
                  fill="clear"
                  onClick={() => handleAddFood(mt)}
                >
                  <IonIcon icon={add} />
                </IonButton>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {getMealLogs(mt).length === 0 ? (
                  <IonText color="medium">
                    <p>No foods logged</p>
                  </IonText>
                ) : (
                  getMealLogs(mt).map((log) => (
                    <FoodLogItem
                      key={log._id}
                      log={log}
                      onDelete={handleDeleteLog}
                      onEdit={handleEditLog}
                    />
                  ))
                )}
              </IonList>
            </IonCardContent>
          </IonCard>
        ))}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowMealTypeSheet(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={showMealTypeSheet}
          onDidDismiss={() => setShowMealTypeSheet(false)}
          header="Add Food To..."
          buttons={[
            { text: "🌅 Breakfast", handler: () => handleAddFood("breakfast") },
            { text: "☀️ Lunch", handler: () => handleAddFood("lunch") },
            { text: "🌙 Dinner", handler: () => handleAddFood("dinner") },
            { text: "🍿 Snacks", handler: () => handleAddFood("snack") },
            { text: "Cancel", role: "cancel" },
          ]}
        />

        <AddFoodModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          date={currentDate}
          mealType={selectedMealType}
          onFoodAdded={() => {
            /* no-op; query invalidation already happens */
          }}
        />

        <EditFoodLogModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          log={editingLog}
          date={currentDate}
          onUpdated={() => {
            /* no-op */
          }}
        />

        <IonLoading isOpen={loading} message="Loading..." />
      </IonContent>
    </IonPage>
  );
};

export default Diary;
