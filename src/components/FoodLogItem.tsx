import React from "react";
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";
import { Edit3, Trash2 } from "lucide-react";
import type { FoodLog } from "../types";
import { formatFoodLogAmount } from "../utils/formatFoodLog";
import FoodListRow from "./FoodListRow";

interface FoodLogItemProps {
  log: FoodLog;
  onDelete: (id: string) => void;
  onEdit: (log: FoodLog) => void;
  variant?: "default" | "compact";
}

const FoodLogItem: React.FC<FoodLogItemProps> = ({
  log,
  onDelete,
  onEdit,
  variant = "default",
}) => {
  const subtitle =
    formatFoodLogAmount(log) ??
    `${log.servings} serving${log.servings !== 1 ? "s" : ""}`;

  if (variant === "compact") {
    return (
      <IonItemSliding className="rounded-3xl overflow-hidden">
        <IonItem
          lines="none"
          className="--background: transparent --padding-start: 0 --inner-padding-end: 0 --min-height: 0"
        >
          <FoodListRow
            name={log.foodName}
            subtitle={subtitle}
            calories={log.calories}
            protein={log.protein}
            carbs={log.carbs}
            fats={log.fats}
            onClick={() => onEdit(log)}
          />
        </IonItem>

        <IonItemOptions side="end">
          <IonItemOption
            onClick={() => onEdit(log)}
            className="bg-slate-100 !text-slate-600"
          >
            <Edit3 size={20} />
          </IonItemOption>
          <IonItemOption
            onClick={() => onDelete(log.id)}
            className="bg-rose-500"
          >
            <Trash2 size={20} />
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    );
  }

  return (
    <IonItemSliding className="mb-3 rounded-3xl overflow-hidden">
      <IonItem
        lines="none"
        className="--background: transparent --padding-start: 0 --inner-padding-end: 0"
      >
        <FoodListRow
          name={log.foodName}
          subtitle={log.notes ? `${subtitle} • ${log.notes}` : subtitle}
          calories={log.calories}
          protein={log.protein}
          carbs={log.carbs}
          fats={log.fats}
          onClick={() => onEdit(log)}
        />
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption
          onClick={() => onEdit(log)}
          className="bg-slate-100 !text-slate-600 rounded-2xl ml-2"
        >
          <Edit3 size={20} />
        </IonItemOption>
        <IonItemOption
          onClick={() => onDelete(log.id)}
          className="bg-rose-500 rounded-2xl ml-2"
        >
          <Trash2 size={20} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default FoodLogItem;
