import React from "react";
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/react";
import { Edit3, Trash2, Zap } from "lucide-react";
import type { FoodLog } from "../types";

interface FoodLogItemProps {
  log: FoodLog;
  onDelete: (id: string) => void;
  onEdit: (log: FoodLog) => void;
}

const FoodLogItem: React.FC<FoodLogItemProps> = ({ log, onDelete, onEdit }) => {
  return (
    <IonItemSliding className="mb-3 rounded-2xl overflow-hidden">
      <IonItem
        lines="none"
        className="--background: transparent --padding-start: 0 --inner-padding-end: 0"
      >
        <div className="w-full bg-white p-4 flex items-center justify-between border border-slate-50 shadow-sm active:bg-slate-50 transition-colors rounded-2xl">
          <div className="flex flex-col">
            <h4 className="font-bold text-slate-900 leading-tight">
              {log.foodName}
            </h4>
            <p className="text-xs text-slate-400 font-medium capitalize">
              {log.servings} serving{log.servings !== 1 ? "s" : ""}{" "}
              {log.notes && `• ${log.notes}`}
            </p>
            <div className="flex gap-3 mt-2">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                P: {Math.round(log.protein)}g
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                C: {Math.round(log.carbs)}g
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                F: {Math.round(log.fats)}g
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 font-black">
            <Zap size={14} fill="currentColor" />
            <span>{Math.round(log.calories)}</span>
          </div>
        </div>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption
          onClick={() => onEdit(log)}
          className="bg-slate-100 !text-slate-600 rounded-2xl ml-2"
        >
          <Edit3 size={20} />
        </IonItemOption>
        <IonItemOption
          onClick={() => onDelete(log._id)}
          className="bg-rose-500 rounded-2xl ml-2"
        >
          <Trash2 size={20} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default FoodLogItem;
