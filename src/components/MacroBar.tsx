import React from "react";
import { IonProgressBar, IonText } from "@ionic/react";
import "./MacroBar.css";

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: "primary" | "success" | "warning" | "danger";
  unit?: string;
}

const MacroBar: React.FC<MacroBarProps> = ({
  label,
  current,
  goal,
  color,
  unit = "g",
}) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="macro-bar">
      <div className="macro-header">
        <IonText color="medium">
          <strong>{label}</strong>
        </IonText>
        <IonText color="dark">
          <span className="macro-values">
            {Math.round(current)} / {Math.round(goal)} {unit}
          </span>
        </IonText>
      </div>
      <IonProgressBar value={percentage / 100} color={color} />
      <div className="macro-footer">
        <IonText color="medium" style={{ fontSize: "0.85rem" }}>
          {Math.round(remaining)} {unit} remaining
        </IonText>
        <IonText color="medium" style={{ fontSize: "0.85rem" }}>
          {Math.round(percentage)}%
        </IonText>
      </div>
    </div>
  );
};

export default MacroBar;
