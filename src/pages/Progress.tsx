import React, { useState } from "react";
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
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButtons,
  IonButton,
  IonInput,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLoading,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  add,
  trashOutline,
  trendingUp,
  trendingDown,
  createOutline,
} from "ionicons/icons";
import { format, parseISO } from "date-fns";
import { useAuthStore } from "../store/authStore";
import type { WeightEntry, CreateWeightInput } from "../types";
import "./Progress.css";
import {
  apiErrorMessage,
  useCreateWeightMutation,
  useDeleteWeightMutation,
  useUpdateWeightMutation,
  useWeightsQuery,
} from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";

const Progress: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();

  const weightsQuery = useWeightsQuery(true);
  const createMut = useCreateWeightMutation();
  const updateMut = useUpdateWeightMutation();
  const deleteMut = useDeleteWeightMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingWeight, setEditingWeight] = useState<WeightEntry | null>(null);

  const [weight, setWeight] = useState<number>(0);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");

  const weights = weightsQuery.data || [];
  const loading =
    weightsQuery.isFetching ||
    createMut.isPending ||
    updateMut.isPending ||
    deleteMut.isPending;

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await qc.invalidateQueries({ queryKey: ["weight"] });
    event.detail.complete();
  };

  const openAddModal = () => {
    setEditingWeight(null);
    setWeight(weights[0]?.weight || user?.currentWeight || 0);
    setDate(format(new Date(), "yyyy-MM-dd"));
    setNotes("");
    setShowModal(true);
  };

  const openEditModal = (entry: WeightEntry) => {
    setEditingWeight(entry);
    setWeight(entry.weight);
    setDate(format(parseISO(entry.date), "yyyy-MM-dd"));
    setNotes(entry.notes || "");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const weightData: CreateWeightInput = {
        weight,
        date,
        notes: notes || undefined,
      };

      if (editingWeight) {
        await updateMut.mutateAsync({
          id: editingWeight._id,
          updates: weightData,
        });
      } else {
        await createMut.mutateAsync(weightData);
      }

      setShowModal(false);
    } catch (e) {
      console.error("Error saving weight:", e);
      alert(apiErrorMessage(e, "Failed to save weight"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch (e) {
      console.error("Error deleting weight:", e);
      alert(apiErrorMessage(e, "Failed to delete entry"));
    }
  };

  const getWeightChange = () => {
    if (weights.length < 2) return null;
    const latest = weights[0].weight;
    const previous = weights[1].weight;
    const change = latest - previous;
    return {
      value: Math.abs(change).toFixed(1),
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
    };
  };

  const getOverallChange = () => {
    if (weights.length < 2) return null;
    const latest = weights[0].weight;
    const oldest = weights[weights.length - 1].weight;
    const change = latest - oldest;
    return {
      value: Math.abs(change).toFixed(1),
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
    };
  };

  const weightChange = getWeightChange();
  const overallChange = getOverallChange();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Progress</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Current Stats</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="stats-grid">
              <div className="stat-item">
                <IonText color="medium">
                  <p>Current Weight</p>
                </IonText>
                <IonText color="dark">
                  <h2>{weights[0]?.weight.toFixed(1) || "--"} kg</h2>
                </IonText>
              </div>

              <div className="stat-item">
                <IonText color="medium">
                  <p>Goal Weight</p>
                </IonText>
                <IonText color="dark">
                  <h2>{user?.goalWeight?.toFixed(1) || "--"} kg</h2>
                </IonText>
              </div>

              {user?.goalWeight && weights[0] && (
                <div className="stat-item">
                  <IonText color="medium">
                    <p>To Goal</p>
                  </IonText>
                  <IonText
                    color={
                      weights[0].weight > user.goalWeight ? "danger" : "success"
                    }
                  >
                    <h2>
                      {Math.abs(weights[0].weight - user.goalWeight).toFixed(1)}{" "}
                      kg
                    </h2>
                  </IonText>
                </div>
              )}

              {weightChange && (
                <div className="stat-item">
                  <IonText color="medium">
                    <p>Recent Change</p>
                  </IonText>
                  <IonText
                    color={
                      weightChange.trend === "down" ? "success" : "warning"
                    }
                  >
                    <h2>
                      {weightChange.trend === "down" ? "-" : "+"}
                      {weightChange.value} kg
                    </h2>
                  </IonText>
                </div>
              )}

              {overallChange && (
                <div className="stat-item">
                  <IonText color="medium">
                    <p>Overall Change</p>
                  </IonText>
                  <IonText
                    color={
                      overallChange.trend === "down" ? "success" : "warning"
                    }
                  >
                    <h2>
                      {overallChange.trend === "down" ? "-" : "+"}
                      {overallChange.value} kg
                    </h2>
                  </IonText>
                </div>
              )}
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Weight History</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {weights.length === 0 ? (
              <IonText color="medium">
                <p>
                  No weight entries yet. Add your first entry to start tracking!
                </p>
              </IonText>
            ) : (
              <IonList>
                {weights.map((entry, index) => {
                  const prevWeight = weights[index + 1]?.weight;
                  const change = prevWeight ? entry.weight - prevWeight : null;

                  return (
                    <IonItemSliding key={entry._id}>
                      <IonItem>
                        <IonLabel>
                          <h2>{entry.weight.toFixed(1)} kg</h2>
                          <p>{format(parseISO(entry.date), "MMM d, yyyy")}</p>
                          {entry.notes && (
                            <p>
                              <IonText color="medium">{entry.notes}</IonText>
                            </p>
                          )}
                        </IonLabel>
                        {change !== null && (
                          <IonNote
                            slot="end"
                            color={change < 0 ? "success" : "warning"}
                            className="weight-change"
                          >
                            <IonIcon
                              icon={change < 0 ? trendingDown : trendingUp}
                            />
                            {Math.abs(change).toFixed(1)} kg
                          </IonNote>
                        )}
                      </IonItem>

                      <IonItemOptions side="end">
                        <IonItemOption onClick={() => openEditModal(entry)}>
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonItemOption>
                        <IonItemOption
                          color="danger"
                          onClick={() => handleDelete(entry._id)}
                        >
                          <IonIcon icon={trashOutline} />
                          Delete
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  );
                })}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openAddModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingWeight ? "Edit" : "Add"} Weight Entry</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Weight (kg) *</IonLabel>
              <IonInput
                type="number"
                value={weight}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setWeight(parseFloat(v) || 0);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Date *</IonLabel>
              <IonInput
                type="date"
                value={date}
                onIonInput={(e) =>
                  setDate(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Notes (optional)</IonLabel>
              <IonInput
                value={notes}
                onIonInput={(e) =>
                  setNotes(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                placeholder="How are you feeling?"
              />
            </IonItem>

            <IonButton
              expand="block"
              onClick={handleSubmit}
              disabled={weight <= 0 || !date || loading}
              style={{ marginTop: "20px" }}
            >
              {editingWeight ? "Update" : "Add"} Entry
            </IonButton>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} message="Please wait..." />
      </IonContent>
    </IonPage>
  );
};

export default Progress;
