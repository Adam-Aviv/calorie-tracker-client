import React, { useEffect, useState } from "react";
import { IonModal, IonContent, IonLoading } from "@ionic/react";
import { X, Zap, Layers, PlusCircle } from "lucide-react";
import { apiErrorMessage, useCreateFoodMutation } from "../hooks/queries";
import { useUIStore } from "../store/uiStore";
import AppButton from "./AppButton";
import {
  formatDecimalField,
  isValidDecimalInput,
  parseDecimalInput,
} from "../utils/numberInput";

const CATEGORIES = [
  "protein",
  "carbs",
  "fats",
  "vegetables",
  "fruits",
  "dairy",
  "snacks",
  "drinks",
  "other",
];

const emptyForm = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  servingSize: "100",
  servingUnit: "grams",
  category: "other",
};

const AddFoodLibraryModal: React.FC = () => {
  const { showAddFoodLibrary, closeAddFoodLibrary } = useUIStore();
  const createFoodMut = useCreateFoodMutation();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (showAddFoodLibrary) {
      setForm(emptyForm);
    }
  }, [showAddFoodLibrary]);

  const handleClose = () => {
    closeAddFoodLibrary();
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    try {
      await createFoodMut.mutateAsync({
        name: form.name,
        calories: parseDecimalInput(form.calories),
        protein: parseDecimalInput(form.protein),
        carbs: parseDecimalInput(form.carbs),
        fats: parseDecimalInput(form.fats),
        servingSize: parseDecimalInput(form.servingSize, 100),
        servingUnit: form.servingUnit,
        category: form.category,
      });
      handleClose();
    } catch (e) {
      alert(apiErrorMessage(e, "Failed to save food"));
    }
  };

  return (
    <>
      <IonModal
        isOpen={showAddFoodLibrary}
        onDidDismiss={handleClose}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
        className="app-modal"
      >
        <IonContent className="ion-padding">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-black text-slate-900">New Food</h2>
              <button
                onClick={handleClose}
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
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-transparent font-black text-lg outline-none"
                    value={form.calories}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (isValidDecimalInput(next)) {
                        setForm({ ...form, calories: next });
                      }
                    }}
                    placeholder="0"
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
                    {CATEGORIES.map((c) => (
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
                      type="text"
                      inputMode="decimal"
                      className="w-full bg-transparent font-black text-center outline-none"
                      value={form[macro]}
                      onChange={(e) => {
                        const next = e.target.value;
                        if (isValidDecimalInput(next)) {
                          setForm({ ...form, [macro]: next });
                        }
                      }}
                      placeholder="0"
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
                    type="text"
                    inputMode="decimal"
                    className="w-full bg-transparent font-black text-lg outline-none"
                    value={form.servingSize}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (isValidDecimalInput(next)) {
                        setForm({ ...form, servingSize: next });
                      }
                    }}
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

            <AppButton
              onClick={handleSubmit}
              disabled={
                !form.name ||
                parseDecimalInput(form.calories) <= 0 ||
                createFoodMut.isPending
              }
            >
              <PlusCircle size={20} />
              Add to Library
            </AppButton>
          </div>
        </IonContent>
      </IonModal>

      <IonLoading isOpen={createFoodMut.isPending} message="Saving..." />
    </>
  );
};

export default AddFoodLibraryModal;
