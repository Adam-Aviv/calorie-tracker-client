import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLoading,
  IonText,
} from "@ionic/react";
import type { FoodLog } from "../types";
import {
  apiErrorMessage,
  useFoodByIdQuery,
  useUpdateLogMutation,
} from "../hooks/queries";

interface EditFoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: FoodLog | null;
  date: string; // ✅ add this
  onUpdated: () => void;
}

const EditFoodLogModal: React.FC<EditFoodLogModalProps> = ({
  isOpen,
  onClose,
  log,
  date,
  onUpdated,
}) => {
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [notes, setNotes] = useState("");
  const [inputMode, setInputMode] = useState<"servings" | "units">("servings");

  const foodQuery = useFoodByIdQuery(log?.foodId, isOpen && !!log?.foodId);
  const updateLogMut = useUpdateLogMutation();

  const loading = foodQuery.isFetching || updateLogMut.isPending;

  useEffect(() => {
    if (!log) return;
    setServings(log.servings);
    setMealType(log.mealType);
    setNotes(log.notes || "");
    setInputMode("servings");
  }, [log]);

  const handleUpdate = async () => {
    if (!log) return;

    try {
      await updateLogMut.mutateAsync({
        date,
        id: log._id,
        updates: {
          servings,
          mealType,
          notes: notes || undefined,
        },
      });

      onUpdated();
      handleClose();
    } catch (e) {
      console.error("Error updating food log:", e);
      alert(apiErrorMessage(e, "Failed to update entry"));
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!log) return null;

  const foodDetails = foodQuery.data || null;

  const caloriesPerServing = log.calories / log.servings;
  const proteinPerServing = log.protein / log.servings;
  const carbsPerServing = log.carbs / log.servings;
  const fatsPerServing = log.fats / log.servings;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Food Log</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>{log.foodName}</h2>
          {foodDetails ? (
            <p>
              Original: {log.servings} serving(s) ={" "}
              {(log.servings * foodDetails.servingSize).toFixed(1)}{" "}
              {foodDetails.servingUnit}
            </p>
          ) : (
            <p>Original: {log.servings} serving(s)</p>
          )}
        </IonText>

        {foodDetails && (
          <IonSegment
            value={inputMode}
            onIonChange={(e) =>
              setInputMode(e.detail.value as "servings" | "units")
            }
            style={{ marginBottom: "16px" }}
          >
            <IonSegmentButton value="servings">
              <IonLabel>Servings</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="units">
              <IonLabel>
                {foodDetails.servingUnit.charAt(0).toUpperCase() +
                  foodDetails.servingUnit.slice(1)}
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        )}

        {inputMode === "servings" || !foodDetails ? (
          <IonItem>
            <IonLabel position="floating">Servings</IonLabel>
            <IonInput
              type="number"
              value={servings}
              onIonInput={(e) => {
                const v =
                  ((e.target as HTMLIonInputElement).value as string) ?? "";
                setServings(parseFloat(v) || 1);
              }}
              min="0.1"
              step="0.5"
            />
          </IonItem>
        ) : (
          <IonItem>
            <IonLabel position="floating">
              Amount ({foodDetails.servingUnit})
            </IonLabel>
            <IonInput
              type="number"
              value={servings * foodDetails.servingSize}
              onIonInput={(e) => {
                const v =
                  ((e.target as HTMLIonInputElement).value as string) ?? "";
                const units = parseFloat(v) || 0;
                setServings(units / foodDetails.servingSize);
              }}
              min="0.1"
              step="1"
            />
          </IonItem>
        )}

        <IonItem>
          <IonLabel>Meal Type</IonLabel>
          <IonSelect
            value={mealType}
            onIonChange={(e) => setMealType(e.detail.value)}
          >
            <IonSelectOption value="breakfast">Breakfast</IonSelectOption>
            <IonSelectOption value="lunch">Lunch</IonSelectOption>
            <IonSelectOption value="dinner">Dinner</IonSelectOption>
            <IonSelectOption value="snack">Snack</IonSelectOption>
          </IonSelect>
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
          />
        </IonItem>

        <div className="totals-display" style={{ marginTop: "20px" }}>
          <h4>Updated Totals:</h4>
          {inputMode === "units" && foodDetails && (
            <p style={{ color: "var(--ion-color-medium)" }}>
              {(servings * foodDetails.servingSize).toFixed(1)}{" "}
              {foodDetails.servingUnit} = {servings.toFixed(2)} serving(s)
            </p>
          )}
          <p>🔥 {Math.round(caloriesPerServing * servings)} calories</p>
          <p>P: {Math.round(proteinPerServing * servings)}g</p>
          <p>C: {Math.round(carbsPerServing * servings)}g</p>
          <p>F: {Math.round(fatsPerServing * servings)}g</p>
        </div>

        <IonButton
          expand="block"
          onClick={handleUpdate}
          disabled={loading || servings <= 0}
          style={{ marginTop: "20px" }}
        >
          Update Entry
        </IonButton>

        <IonLoading isOpen={loading} message="Updating..." />
      </IonContent>
    </IonModal>
  );
};

export default EditFoodLogModal;
