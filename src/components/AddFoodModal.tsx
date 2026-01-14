import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonInput,
  IonLoading,
  IonText,
} from "@ionic/react";
import type { Food, CreateFoodLogInput } from "../types";
import "./AddFoodModal.css";
import {
  apiErrorMessage,
  useCreateFoodMutation,
  useCreateLogMutation,
  useFoodsQuery,
} from "../hooks/queries";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  onFoodAdded: () => void; // can keep (but not required anymore)
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  date,
  mealType,
  onFoodAdded,
}) => {
  const [segment, setSegment] = useState<"search" | "quick">("search");
  const [searchText, setSearchText] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [notes, setNotes] = useState("");
  const [inputMode, setInputMode] = useState<"servings" | "units">("servings");

  // Quick add states
  const [quickName, setQuickName] = useState("");
  const [quickCalories, setQuickCalories] = useState<number>(0);
  const [quickProtein, setQuickProtein] = useState<number>(0);
  const [quickCarbs, setQuickCarbs] = useState<number>(0);
  const [quickFats, setQuickFats] = useState<number>(0);

  const foodsQuery = useFoodsQuery({ search: searchText }, isOpen);
  const createLogMut = useCreateLogMutation();
  const createFoodMut = useCreateFoodMutation();

  const loading =
    foodsQuery.isFetching || createLogMut.isPending || createFoodMut.isPending;

  useEffect(() => {
    if (!isOpen) return;
    // reset selection when opened
    setSelectedFood(null);
  }, [isOpen]);

  const foods = foodsQuery.data || [];

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const logData: CreateFoodLogInput = {
      foodId: selectedFood._id,
      date,
      mealType,
      servings,
      notes: notes || undefined,
    };

    try {
      await createLogMut.mutateAsync({ date, input: logData });
      onFoodAdded();
      handleClose();
    } catch (e) {
      console.error("Error adding food:", e);
      alert(apiErrorMessage(e, "Failed to add food"));
    }
  };

  const handleQuickAdd = async () => {
    try {
      const newFood = await createFoodMut.mutateAsync({
        name: quickName,
        calories: quickCalories,
        protein: quickProtein,
        carbs: quickCarbs,
        fats: quickFats,
        servingSize: 1,
        servingUnit: "serving",
      });

      if (!newFood) {
        alert("Failed to create food");
        return;
      }

      await createLogMut.mutateAsync({
        date,
        input: {
          foodId: newFood._id,
          date,
          mealType,
          servings: 1,
        },
      });

      onFoodAdded();
      handleClose();
    } catch (e) {
      console.error("Error quick adding food:", e);
      alert(apiErrorMessage(e, "Failed to quick add food"));
    }
  };

  const handleClose = () => {
    setSelectedFood(null);
    setServings(1);
    setNotes("");
    setInputMode("servings");
    setQuickName("");
    setQuickCalories(0);
    setQuickProtein(0);
    setQuickCarbs(0);
    setQuickFats(0);
    setSearchText("");
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add to {mealType}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) =>
              setSegment(e.detail.value as "search" | "quick")
            }
          >
            <IonSegmentButton value="search">
              <IonLabel>Search Foods</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="quick">
              <IonLabel>Quick Add</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {segment === "search" ? (
          <>
            <IonSearchbar
              value={searchText}
              onIonChange={(e) => setSearchText(e.detail.value || "")}
              placeholder="Search foods..."
            />

            {selectedFood ? (
              <div className="ion-padding">
                <h3>{selectedFood.name}</h3>
                <p>
                  {selectedFood.calories} cal per {selectedFood.servingSize}{" "}
                  {selectedFood.servingUnit}
                </p>

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
                      {selectedFood.servingUnit.charAt(0).toUpperCase() +
                        selectedFood.servingUnit.slice(1)}
                    </IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {inputMode === "servings" ? (
                  <IonItem>
                    <IonLabel position="floating">Servings</IonLabel>
                    <IonInput
                      type="number"
                      value={servings}
                      onIonInput={(e) => {
                        const v =
                          ((e.target as HTMLIonInputElement).value as string) ??
                          "";
                        setServings(parseFloat(v) || 1);
                      }}
                      min="0.1"
                      step="0.5"
                    />
                  </IonItem>
                ) : (
                  <IonItem>
                    <IonLabel position="floating">
                      Amount ({selectedFood.servingUnit})
                    </IonLabel>
                    <IonInput
                      type="number"
                      value={servings * selectedFood.servingSize}
                      onIonInput={(e) => {
                        const v =
                          ((e.target as HTMLIonInputElement).value as string) ??
                          "";
                        const units = parseFloat(v) || 0;
                        setServings(units / selectedFood.servingSize);
                      }}
                      min="0.1"
                      step="1"
                    />
                  </IonItem>
                )}

                <IonItem>
                  <IonLabel position="floating">Notes (optional)</IonLabel>
                  <IonInput
                    value={notes}
                    onIonInput={(e) =>
                      setNotes(
                        ((e.target as HTMLIonInputElement).value as string) ??
                          ""
                      )
                    }
                  />
                </IonItem>

                <div className="totals-display">
                  <h4>Totals:</h4>
                  {inputMode === "units" && (
                    <p style={{ color: "var(--ion-color-medium)" }}>
                      {(servings * selectedFood.servingSize).toFixed(1)}{" "}
                      {selectedFood.servingUnit} = {servings.toFixed(2)}{" "}
                      serving(s)
                    </p>
                  )}
                  <p>
                    🔥 {Math.round(selectedFood.calories * servings)} calories
                  </p>
                  <p>P: {Math.round(selectedFood.protein * servings)}g</p>
                  <p>C: {Math.round(selectedFood.carbs * servings)}g</p>
                  <p>F: {Math.round(selectedFood.fats * servings)}g</p>
                </div>

                <IonButton
                  expand="block"
                  onClick={handleAddFood}
                  disabled={loading}
                >
                  Add to Diary
                </IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={() => setSelectedFood(null)}
                >
                  Cancel
                </IonButton>
              </div>
            ) : (
              <IonList>
                {foods.map((food) => (
                  <IonItem
                    key={food._id}
                    button
                    onClick={() => setSelectedFood(food)}
                  >
                    <IonLabel>
                      <h3>{food.name}</h3>
                      <p>
                        {food.servingSize} {food.servingUnit} •{" "}
                        {Math.round(food.calories)} cal
                      </p>
                      <div className="food-macros">
                        <span>P: {Math.round(food.protein)}g</span>
                        <span>C: {Math.round(food.carbs)}g</span>
                        <span>F: {Math.round(food.fats)}g</span>
                      </div>
                    </IonLabel>
                    <IonNote slot="end">{Math.round(food.calories)}</IonNote>
                  </IonItem>
                ))}
              </IonList>
            )}
          </>
        ) : (
          <div className="ion-padding">
            <IonText>
              <h3>Quick Add Calories</h3>
              <p>Manually enter food details</p>
            </IonText>

            <IonItem>
              <IonLabel position="floating">Food Name</IonLabel>
              <IonInput
                value={quickName}
                onIonInput={(e) =>
                  setQuickName(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Calories</IonLabel>
              <IonInput
                type="number"
                value={quickCalories}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setQuickCalories(parseFloat(v) || 0);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Protein (g)</IonLabel>
              <IonInput
                type="number"
                value={quickProtein}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setQuickProtein(parseFloat(v) || 0);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Carbs (g)</IonLabel>
              <IonInput
                type="number"
                value={quickCarbs}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setQuickCarbs(parseFloat(v) || 0);
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Fats (g)</IonLabel>
              <IonInput
                type="number"
                value={quickFats}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setQuickFats(parseFloat(v) || 0);
                }}
              />
            </IonItem>

            <IonButton
              expand="block"
              onClick={handleQuickAdd}
              disabled={!quickName || quickCalories <= 0 || loading}
              style={{ marginTop: "20px" }}
            >
              Add to Diary
            </IonButton>
          </div>
        )}

        <IonLoading isOpen={loading} message="Please wait..." />
      </IonContent>
    </IonModal>
  );
};

export default AddFoodModal;
