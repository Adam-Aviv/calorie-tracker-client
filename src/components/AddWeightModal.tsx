import React, { useState } from "react";
import { IonModal, IonContent, IonLoading } from "@ionic/react";
import { Scale } from "lucide-react";
import { format } from "date-fns";
import { useUIStore } from "../store/uiStore";
import { useCreateWeightMutation } from "../hooks/queries";
import AppButton from "./AppButton";

const AddWeightModal: React.FC = () => {
  const { showAddWeight, closeAddWeight } = useUIStore();
  const createMut = useCreateWeightMutation();

  const [weight, setWeight] = useState<number>(0);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleAddWeight = async () => {
    await createMut.mutateAsync({ weight, date });
    closeAddWeight();
    // Reset form
    setWeight(0);
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <>
      <IonModal
        isOpen={showAddWeight}
        onDidDismiss={closeAddWeight}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
        className="app-modal"
      >
        <IonContent className="ion-padding">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4"
                style={{ borderRadius: "1.5rem" }}
              >
                <Scale size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">New Entry</h2>
              <p className="text-slate-500 text-sm font-medium">
                Log your weight for today
              </p>
            </div>

            <div className="space-y-4">
              <div
                className="bg-slate-50 p-4 border border-slate-100"
                style={{ borderRadius: "1rem" }}
              >
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-transparent text-2xl font-bold outline-none"
                  value={weight || ""}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div
                className="bg-slate-50 p-4 border border-slate-100"
                style={{ borderRadius: "1rem" }}
              >
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full bg-transparent font-bold outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <AppButton
              onClick={handleAddWeight}
              disabled={!weight || createMut.isPending}
            >
              <Scale size={20} />
              Save Entry
            </AppButton>

            <AppButton variant="muted" onClick={closeAddWeight}>
              Cancel
            </AppButton>
          </div>
        </IonContent>
      </IonModal>

      <IonLoading isOpen={createMut.isPending} message="Saving..." />
    </>
  );
};

export default AddWeightModal;
