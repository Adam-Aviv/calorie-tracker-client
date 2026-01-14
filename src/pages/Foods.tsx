import React, { useMemo, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
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
  IonSelect,
  IonSelectOption,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLoading,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  RefresherEventDetail,
} from "@ionic/react";
import { add, trashOutline, createOutline } from "ionicons/icons";
import type { Food, CreateFoodInput } from "../types";
import "./Foods.css";
import {
  apiErrorMessage,
  useCreateFoodMutation,
  useDeleteFoodMutation,
  useFoodsQuery,
  useUpdateFoodMutation,
} from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";

const Foods: React.FC = () => {
  const qc = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fats, setFats] = useState<number>(0);
  const [servingSize, setServingSize] = useState<number>(1);
  const [servingUnit, setServingUnit] = useState("serving");
  const [category, setCategory] = useState("other");

  const foodsQuery = useFoodsQuery(
    {
      search: searchText,
      category: categoryFilter === "all" ? undefined : categoryFilter,
    },
    true
  );

  const createFoodMut = useCreateFoodMutation();
  const updateFoodMut = useUpdateFoodMutation();
  const deleteFoodMut = useDeleteFoodMutation();

  const loading =
    foodsQuery.isFetching ||
    createFoodMut.isPending ||
    updateFoodMut.isPending ||
    deleteFoodMut.isPending;

  const foods = foodsQuery.data || [];

  const filteredFoods = useMemo(() => foods, [foods]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await qc.invalidateQueries({ queryKey: ["foods"] });
    event.detail.complete();
  };

  const openAddModal = () => {
    resetForm();
    setEditingFood(null);
    setShowModal(true);
  };

  const openEditModal = (food: Food) => {
    setEditingFood(food);
    setName(food.name);
    setCalories(food.calories);
    setProtein(food.protein);
    setCarbs(food.carbs);
    setFats(food.fats);
    setServingSize(food.servingSize);
    setServingUnit(food.servingUnit);
    setCategory(food.category || "other");
    setShowModal(true);
  };

  const resetForm = () => {
    setName("");
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFats(0);
    setServingSize(1);
    setServingUnit("serving");
    setCategory("other");
  };

  const handleSubmit = async () => {
    try {
      const foodData: CreateFoodInput = {
        name,
        calories,
        protein,
        carbs,
        fats,
        servingSize,
        servingUnit,
        category,
      };

      if (editingFood) {
        await updateFoodMut.mutateAsync({
          id: editingFood._id,
          updates: foodData,
        });
      } else {
        await createFoodMut.mutateAsync(foodData);
      }

      setShowModal(false);
    } catch (e) {
      console.error("Error saving food:", e);
      alert(apiErrorMessage(e, "Failed to save food"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFoodMut.mutateAsync(id);
    } catch (e) {
      console.error("Error deleting food:", e);
      alert(apiErrorMessage(e, "Failed to delete food"));
    }
  };

  const categories = [
    "all",
    "protein",
    "carbs",
    "vegetables",
    "fruits",
    "dairy",
    "snacks",
    "drinks",
    "other",
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Foods</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value || "")}
            placeholder="Search foods..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            scrollable
            value={categoryFilter}
            onIonChange={(e) => setCategoryFilter(e.detail.value as string)}
          >
            {categories.map((cat) => (
              <IonSegmentButton key={cat} value={cat}>
                <IonLabel style={{ textTransform: "capitalize" }}>
                  {cat}
                </IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding-vertical">
          <IonText color="medium" className="ion-padding-horizontal">
            <p>{filteredFoods.length} foods</p>
          </IonText>
        </div>

        <IonList>
          {filteredFoods.map((food) => (
            <IonItemSliding key={food._id}>
              <IonItem>
                <IonLabel>
                  <h2>{food.name}</h2>
                  <p>
                    {food.servingSize} {food.servingUnit} • {food.category}
                  </p>
                  <div className="food-macros">
                    <span>🔥 {Math.round(food.calories)} cal</span>
                    <span>P: {Math.round(food.protein)}g</span>
                    <span>C: {Math.round(food.carbs)}g</span>
                    <span>F: {Math.round(food.fats)}g</span>
                  </div>
                </IonLabel>
                <IonNote slot="end">{Math.round(food.calories)}</IonNote>
              </IonItem>

              <IonItemOptions side="end">
                <IonItemOption onClick={() => openEditModal(food)}>
                  <IonIcon icon={createOutline} />
                  Edit
                </IonItemOption>
                <IonItemOption
                  color="danger"
                  onClick={() => handleDelete(food._id)}
                >
                  <IonIcon icon={trashOutline} />
                  Delete
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openAddModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingFood ? "Edit Food" : "Add Food"}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Food Name *</IonLabel>
              <IonInput
                value={name}
                onIonInput={(e) =>
                  setName(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Calories *</IonLabel>
              <IonInput
                type="number"
                value={calories}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setCalories(parseFloat(v) || 0);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Protein (g) *</IonLabel>
              <IonInput
                type="number"
                value={protein}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setProtein(parseFloat(v) || 0);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Carbs (g) *</IonLabel>
              <IonInput
                type="number"
                value={carbs}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setCarbs(parseFloat(v) || 0);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Fats (g) *</IonLabel>
              <IonInput
                type="number"
                value={fats}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setFats(parseFloat(v) || 0);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Serving Size *</IonLabel>
              <IonInput
                type="number"
                value={servingSize}
                onIonInput={(e) => {
                  const v =
                    ((e.target as HTMLIonInputElement).value as string) ?? "";
                  setServingSize(parseFloat(v) || 1);
                }}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Serving Unit *</IonLabel>
              <IonInput
                value={servingUnit}
                onIonInput={(e) =>
                  setServingUnit(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                placeholder="e.g., cup, oz, piece"
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel>Category</IonLabel>
              <IonSelect
                value={category}
                onIonChange={(e) => setCategory(e.detail.value)}
              >
                <IonSelectOption value="protein">Protein</IonSelectOption>
                <IonSelectOption value="carbs">Carbs</IonSelectOption>
                <IonSelectOption value="vegetables">Vegetables</IonSelectOption>
                <IonSelectOption value="fruits">Fruits</IonSelectOption>
                <IonSelectOption value="dairy">Dairy</IonSelectOption>
                <IonSelectOption value="snacks">Snacks</IonSelectOption>
                <IonSelectOption value="drinks">Drinks</IonSelectOption>
                <IonSelectOption value="other">Other</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonButton
              expand="block"
              onClick={handleSubmit}
              disabled={!name || calories <= 0 || loading}
              style={{ marginTop: "20px" }}
            >
              {editingFood ? "Update Food" : "Add Food"}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} message="Please wait..." />
      </IonContent>
    </IonPage>
  );
};

export default Foods;
