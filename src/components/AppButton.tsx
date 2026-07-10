import { IonButton } from "@ionic/react";
import type { ReactNode } from "react";

type AppButtonVariant = "primary" | "ghost" | "muted";

interface AppButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
  className?: string;
  type?: "button" | "submit";
}

const variantStyles: Record<AppButtonVariant, React.CSSProperties> = {
  primary: {
    "--background": "#0f172a",
    "--background-activated": "#1e293b",
    "--color": "#ffffff",
    "--border-radius": "20px",
    "--padding-top": "0",
    "--padding-bottom": "0",
    "--box-shadow": "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  } as React.CSSProperties,
  ghost: {
    "--color": "#ef4444",
    "--background-activated": "#fef2f2",
    "--border-radius": "20px",
    "--padding-top": "0",
    "--padding-bottom": "0",
  } as React.CSSProperties,
  muted: {
    "--color": "#94a3b8",
    "--background-activated": "#f8fafc",
    "--border-radius": "20px",
    "--padding-top": "0",
    "--padding-bottom": "0",
  } as React.CSSProperties,
};

const AppButton: React.FC<AppButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  type = "button",
}) => {
  const isPrimary = variant === "primary";

  return (
    <IonButton
      expand="block"
      fill={isPrimary ? "solid" : "clear"}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={
        isPrimary
          ? `h-16 font-black text-lg ${className}`
          : `h-14 font-bold ${className}`
      }
      style={variantStyles[variant]}
    >
      <div className={`flex items-center ${isPrimary ? "gap-3" : "gap-2"}`}>
        {children}
      </div>
    </IonButton>
  );
};

export default AppButton;
