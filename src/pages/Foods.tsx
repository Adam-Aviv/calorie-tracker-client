import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonModal,
  RefresherEventDetail,
} from "@ionic/react";
import { Trash2, Edit3, Search, Utensils, Zap, X, Layers } from "lucide-react";
import type { Food } from "../types";
import {
  apiErrorMessage,
  useCreateFoodMutation,
  useDeleteFoodMutation,
  useFoodsQuery,
  useUpdateFoodMutation,
} from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "../store/uiStore"; // Added UI Store

const Foods: React.FC = () => {
  const qc = useQueryClient();
  const { showAddFoodLibrary, closeAddFoodLibrary } = useUIStore();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    servingSize: 1,
    servingUnit: "serving",
    category: "other",
  });

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

  const handleRefresh = async (e: CustomEvent<RefresherEventDetail>) => {
    await qc.invalidateQueries({ queryKey: ["foods"] });
    e.detail.complete();
  };

  const openEditModal = (food: Food) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      category: food.category || "other",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingFood) {
        await updateFoodMut.mutateAsync({ id: editingFood._id, updates: form });
      } else {
        await createFoodMut.mutateAsync(form);
      }
      setShowModal(false);
      closeAddFoodLibrary(); // Add this
    } catch (e) {
      alert(apiErrorMessage(e, "Failed to save food"));
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
      <IonHeader className="ion-no-border">
        <IonToolbar className="--background: #fff; pt-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-slate-900">Food Library</h1>
          </div>

          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="w-full h-12 bg-slate-50 rounded-2xl pl-12 pr-4 font-bold text-slate-900 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
              placeholder="Search library..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="--background: #f8fafc;">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="px-6 py-4">
          <div className="flex flex-col gap-3">
            {foods.map((food) => (
              <IonItemSliding key={food._id}>
                <IonItem
                  lines="none"
                  className="--background: transparent --padding-start: 0 --inner-padding-end: 0"
                >
                  <div className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group active:bg-slate-50 transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                        <Utensils size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-slate-900 capitalize truncate"
                          style={{ fontSize: "14px" }}
                        >
                          {food.name}
                        </h3>
                        <p
                          className="font-black text-slate-400 uppercase tracking-widest truncate"
                          style={{ fontSize: "9px" }}
                        >
                          {food.servingSize} {food.servingUnit} •{" "}
                          {food.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1 text-indigo-600 font-black">
                        <Zap size={14} fill="currentColor" />
                        <span>{Math.round(food.calories)}</span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] font-bold text-slate-400">
                          P: {food.protein}g
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          C: {food.carbs}g
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          F: {food.fats}g
                        </span>
                      </div>
                    </div>
                  </div>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption
                    onClick={() => openEditModal(food)}
                    className="bg-slate-100 !text-slate-600 rounded-2xl ml-2"
                  >
                    <Edit3 size={20} />
                  </IonItemOption>
                  <IonItemOption
                    onClick={() => deleteFoodMut.mutate(food._id)}
                    className="bg-rose-500 rounded-2xl ml-2"
                  >
                    <Trash2 size={20} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </div>
        </div>

        {/* Add/Edit Modal */}
        <IonModal
          isOpen={showModal || showAddFoodLibrary} // Changed: combine both states
          onDidDismiss={() => {
            setShowModal(false);
            closeAddFoodLibrary();
          }}
          initialBreakpoint={0.9}
          breakpoints={[0, 0.9]}
          handle={true}
        >
          <IonContent className="ion-padding">
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-black text-slate-900">
                  {editingFood ? "Edit Food" : "New Food"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    closeAddFoodLibrary(); // Add this
                  }}
                  className="p-2 bg-slate-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Food Name
                  </p>
                  <input
                    className="w-full bg-transparent font-bold text-slate-900 outline-none"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Greek Yogurt"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Zap size={10} /> Calories
                    </p>
                    <input
                      type="number"
                      className="w-full bg-transparent font-black text-lg outline-none"
                      value={form.calories}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          calories: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Layers size={10} /> Category
                    </p>
                    <select
                      className="w-full bg-transparent font-black text-lg outline-none appearance-none capitalize"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      {categories
                        .filter((c) => c !== "all")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(["protein", "carbs", "fats"] as const).map((macro) => (
                    <div
                      key={macro}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center"
                    >
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {macro}
                      </p>
                      <input
                        type="number"
                        className="w-full bg-transparent font-black text-center outline-none"
                        // Use type assertion to the specific key type
                        value={form[macro as keyof typeof form]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [macro]: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Serving Size
                    </p>
                    <input
                      type="number"
                      className="w-full bg-transparent font-black text-lg outline-none"
                      value={form.servingSize}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          servingSize: parseFloat(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Unit
                    </p>
                    <input
                      className="w-full bg-transparent font-black text-lg outline-none"
                      value={form.servingUnit}
                      onChange={(e) =>
                        setForm({ ...form, servingUnit: e.target.value })
                      }
                      placeholder="oz, cup..."
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!form.name || form.calories <= 0 || loading}
                className="w-full bg-slate-900 text-white h-16 rounded-[20px] font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                {editingFood ? "Update Food" : "Add to Library"}
              </button>
            </div>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};

export default Foods;
