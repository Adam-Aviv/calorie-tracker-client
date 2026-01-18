import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonToast,
  IonLoading,
  IonButton,
} from "@ionic/react";
import { Mail, Lock, User as UserIcon, LogIn, ArrowRight } from "lucide-react";
import { useLoginMutation } from "../hooks/queries";

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Using your custom hook instead of inline useMutation
  const authMutation = useLoginMutation(isRegister);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister && !name.trim()) {
      setError("Name is required");
      return;
    }

    authMutation.mutate(
      { email: email.trim(), password, name: name.trim() },
      {
        onError: (err) => {
          // Properly extracting error message using your API structure
          setError(err.response?.data?.message || "Authentication failed");
        },
      }
    );
  };

  return (
    <IonPage>
      <IonContent className="--background: white;">
        {/* Added h-full to the wrapper to ensure centering works on all devices */}
        <div className="flex flex-col justify-center items-center min-h-full w-full px-8 py-12 bg-linear-to-b from-slate-50 to-white">
          {/* Header Section */}
          <div className="text-center mb-10 w-full max-w-sm">
            <div className="inline-flex p-4 bg-indigo-600 rounded-[24px] shadow-xl shadow-indigo-100 mb-6 text-white">
              <LogIn size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              NutriTrack
            </h1>
            <p className="text-slate-500 font-medium italic">
              Personalized Nutrition Tracking
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div className="space-y-3">
              {/* Input Containers */}
              {[
                {
                  show: isRegister,
                  icon: <UserIcon size={18} />,
                  placeholder: "Full Name",
                  val: name,
                  set: setName,
                  type: "text" as const,
                },
                {
                  show: true,
                  icon: <Mail size={18} />,
                  placeholder: "Email Address",
                  val: email,
                  set: setEmail,
                  type: "email" as const,
                },
                {
                  show: true,
                  icon: <Lock size={18} />,
                  placeholder: "Password",
                  val: password,
                  set: setPassword,
                  type: "password" as const,
                },
              ].map(
                (field, i) =>
                  field.show && (
                    <div
                      key={i}
                      className="group bg-white rounded-[20px] border border-slate-200 p-1 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center px-4">
                        <span className="text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          {field.icon}
                        </span>
                        <IonInput
                          type={field.type}
                          placeholder={field.placeholder}
                          value={field.val}
                          onIonInput={(e) => field.set(e.detail.value!)}
                          style={{
                            "--background": "transparent",
                            "--padding-start": "12px",
                          }}
                          className="text-slate-900 font-bold h-12"
                        />
                      </div>
                    </div>
                  )
              )}
            </div>

            {/* THE BUTTON - Using IonButton for proper rounded corners */}
            <IonButton
              disabled={authMutation.isPending}
              type="submit"
              expand="block"
              className="mt-6 font-extrabold text-lg"
              style={{
                "--background": "#4f46e5",
                "--background-activated": "#4338ca",
                "--color": "#ffffff",
                "--border-radius": "20px",
                "--padding-top": "1rem",
                "--padding-bottom": "1rem",
                "--box-shadow": "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                height: "4rem",
              }}
            >
              {authMutation.isPending ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <span>{isRegister ? "Create Account" : "Sign In"}</span>
                  <ArrowRight size={22} strokeWidth={3} />
                </div>
              )}
            </IonButton>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-2 pt-6">
              <span className="text-slate-400 text-sm font-semibold">
                {isRegister ? "Already a member?" : "New here?"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-indigo-600 font-black text-sm hover:text-indigo-700 active:opacity-70 transition-all"
              >
                {isRegister ? "Sign In" : "Join NutriTrack"}
              </button>
            </div>
          </form>
        </div>

        <IonLoading
          isOpen={authMutation.isPending}
          message="Signing you in..."
        />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          color="danger"
          position="top"
          onDidDismiss={() => setError("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
