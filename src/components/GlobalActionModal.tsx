/* components/GlobalActionModal.tsx */
import React, { useState } from "react";
import { IonModal, IonContent } from "@ionic/react";
import { Utensils, Scale, PlusCircle, ArrowLeft } from "lucide-react";
import AppButton from "./AppButton";

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
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      className="app-modal"
    >
      <IonContent className="ion-padding">
        <div className="p-4 space-y-3">
          {!showMealSelection ? (
            <>
              <h2 className="text-xl font-black text-slate-900 mb-4 text-center">
                Quick Actions
              </h2>

              <AppButton onClick={() => setShowMealSelection(true)}>
                <Utensils size={20} />
                Log Food
              </AppButton>

              <AppButton onClick={() => onAction("weight")}>
                <Scale size={20} />
                Track Weight
              </AppButton>

              <AppButton onClick={() => onAction("library")}>
                <PlusCircle size={20} />
                Create Food
              </AppButton>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowMealSelection(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-black text-slate-900">
                  Select Meal
                </h2>
              </div>

              <AppButton onClick={() => handleMealSelect("breakfast")}>
                <Utensils size={20} />
                Breakfast
              </AppButton>

              <AppButton onClick={() => handleMealSelect("lunch")}>
                <Utensils size={20} />
                Lunch
              </AppButton>

              <AppButton onClick={() => handleMealSelect("dinner")}>
                <Utensils size={20} />
                Dinner
              </AppButton>

              <AppButton onClick={() => handleMealSelect("snack")}>
                <Utensils size={20} />
                Snack
              </AppButton>
            </>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default GlobalActionModal;
