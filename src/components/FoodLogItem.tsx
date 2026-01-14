import React from "react";
import {
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";
import { trashOutline, createOutline } from "ionicons/icons";
import type { FoodLog } from "../types";
import "./FoodLogItem.css";

interface FoodLogItemProps {
  log: FoodLog;
  onDelete: (id: string) => void;
  onEdit: (log: FoodLog) => void;
}

const FoodLogItem: React.FC<FoodLogItemProps> = ({ log, onDelete, onEdit }) => {
  return (
    <IonItemSliding>
      <IonItem>
        <IonLabel>
          <h3>{log.foodName}</h3>
          <p>
            {log.servings} serving{log.servings !== 1 ? "s" : ""}
            {log.notes && ` • ${log.notes}`}
          </p>
          <div className="macro-info">
            <span className="macro-badge">
              🔥 {Math.round(log.calories)} cal
            </span>
            <span className="macro-badge">P: {Math.round(log.protein)}g</span>
            <span className="macro-badge">C: {Math.round(log.carbs)}g</span>
            <span className="macro-badge">F: {Math.round(log.fats)}g</span>
          </div>
        </IonLabel>
        <IonNote slot="end" className="calories-note">
          {Math.round(log.calories)} cal
        </IonNote>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption onClick={() => onEdit(log)}>
          <IonIcon icon={createOutline} />
          Edit
        </IonItemOption>
        <IonItemOption color="danger" onClick={() => onDelete(log._id)}>
          <IonIcon icon={trashOutline} />
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default FoodLogItem;
