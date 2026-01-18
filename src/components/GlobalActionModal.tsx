/* components/GlobalActionModal.tsx */
import React, { useState } from "react";
import { IonModal, IonContent } from "@ionic/react";
import { Utensils, Scale, PlusCircle, ArrowLeft } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction: (
    type: "weight" | "library" | "breakfast" | "lunch" | "dinner" | "snack"
  ) => void;
}

const GlobalActionModal: React.FC<Props> = ({ isOpen, onClose, onAction }) => {
  const [showMealSelection, setShowMealSelection] = useState(false);

  const handleClose = () => {
    setShowMealSelection(false);
    onClose();
  };

  const handleMealSelect = (
    meal: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    setShowMealSelection(false);
    onAction(meal);
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleClose}
      initialBreakpoint={showMealSelection ? 0.6 : 0.4}
      breakpoints={[0, 0.4, 0.6]}
      handle={true}
      className="rounded-t-[3rem]"
    >
      <IonContent className="ion-padding">
        <div className="p-4">
          {!showMealSelection ? (
            <>
              <h2 className="text-xl font-black text-slate-900 mb-6 text-center">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setShowMealSelection(true)}
                  className="flex items-center gap-4 p-5 bg-indigo-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-3 bg-indigo-600 text-white"
                    style={{ borderRadius: "1rem" }}
                  >
                    <Utensils size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Log Food</p>
                    <p className="text-xs text-indigo-400 font-bold">
                      Add to today's diary
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => onAction("weight")}
                  className="flex items-center gap-4 p-5 bg-emerald-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-3 bg-emerald-600 text-white"
                    style={{ borderRadius: "1rem" }}
                  >
                    <Scale size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Track Weight</p>
                    <p className="text-xs text-emerald-400 font-bold">
                      Update your progress
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => onAction("library")}
                  className="flex items-center gap-4 p-5 bg-slate-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-3 bg-slate-900 text-white"
                    style={{ borderRadius: "1rem" }}
                  >
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Create Food</p>
                    <p className="text-xs text-slate-400 font-bold">
                      Add to your library
                    </p>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setShowMealSelection(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-black text-slate-900">
                  Select Meal Type
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleMealSelect("breakfast")}
                  className="flex items-center gap-4 p-4 bg-amber-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-2 bg-amber-500 text-white"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <Utensils size={20} />
                  </div>
                  <p className="font-bold text-slate-900">Breakfast</p>
                </button>

                <button
                  onClick={() => handleMealSelect("lunch")}
                  className="flex items-center gap-4 p-4 bg-emerald-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-2 bg-emerald-500 text-white"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <Utensils size={20} />
                  </div>
                  <p className="font-bold text-slate-900">Lunch</p>
                </button>

                <button
                  onClick={() => handleMealSelect("dinner")}
                  className="flex items-center gap-4 p-4 bg-indigo-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-2 bg-indigo-600 text-white"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <Utensils size={20} />
                  </div>
                  <p className="font-bold text-slate-900">Dinner</p>
                </button>

                <button
                  onClick={() => handleMealSelect("snack")}
                  className="flex items-center gap-4 p-4 bg-rose-50 active:scale-95 transition-all text-left"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <div
                    className="p-2 bg-rose-500 text-white"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <Utensils size={20} />
                  </div>
                  <p className="font-bold text-slate-900">Snack</p>
                </button>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default GlobalActionModal;
