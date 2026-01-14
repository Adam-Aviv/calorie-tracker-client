// src/pages/Login.tsx
import React, { useCallback, useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonItem,
  IonLabel,
  IonToast,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authAPI, usersAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { ApiResponse, User } from "../types";

type AuthPayload = { email: string; password: string; name?: string };
type AuthResult = {
  success: boolean;
  data: { id: string; name: string; email: string; token: string };
};

const qk = {
  profile: ["users", "profile"] as const,
  me: ["auth", "me"] as const,
};

const Login: React.FC = () => {
  const history = useHistory();
  const qc = useQueryClient();

  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const authMutation = useMutation<
    AuthResult,
    AxiosError<ApiResponse>,
    AuthPayload
  >({
    mutationFn: async (payload) => {
      if (isRegister) {
        return authAPI.register(
          payload.email,
          payload.password,
          payload.name || ""
        );
      }
      return authAPI.login(payload.email, payload.password);
    },

    onSuccess: async (response) => {
      if (!response?.success) {
        setError("Authentication failed");
        return;
      }

      // 1) Store token + minimal user immediately
      const minimalUser: User = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        dailyCalorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 250,
        fatsGoal: 65,
      };

      setAuth(response.data.token, minimalUser);

      // 2) Fetch full profile AFTER token exists, then store it
      try {
        const profile = await qc.fetchQuery({
          queryKey: qk.profile,
          queryFn: usersAPI.getProfile,
        });

        if (profile) {
          setUser(profile);
          qc.setQueryData(qk.profile, profile);
          qc.setQueryData(qk.me, profile);
        }
      } catch {
        // If profile fetch fails, keep minimal user (still allow navigation)
      }

      history.push("/tabs/diary");
    },

    onError: (err) => {
      setError(err.response?.data?.message || "Authentication failed");
    },
  });

  const loading = authMutation.isPending;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      // basic client-side checks
      if (isRegister && !name.trim()) {
        setError("Name is required");
        return;
      }

      authMutation.mutate({
        email: email.trim(),
        password,
        name: name.trim(),
      });
    },
    [authMutation, email, password, name, isRegister]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{isRegister ? "Sign Up" : "Sign In"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="login-container">
          <div className="login-header">
            <h1>🍎 NutriTrack</h1>
            <p>Track your nutrition, reach your goals</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <IonItem>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput
                  type="text"
                  value={name}
                  // IMPORTANT: use onIonInput to avoid "2nd click to submit" issues
                  onIonInput={(e) =>
                    setName(
                      ((e.target as HTMLIonInputElement).value as string) ?? ""
                    )
                  }
                  required
                />
              </IonItem>
            )}

            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) =>
                  setEmail(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                required
                inputMode="email"
                autocomplete="email"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) =>
                  setPassword(
                    ((e.target as HTMLIonInputElement).value as string) ?? ""
                  )
                }
                required
                autocomplete={isRegister ? "new-password" : "current-password"}
              />
            </IonItem>

            <IonButton
              expand="block"
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? "Loading..." : isRegister ? "Sign Up" : "Sign In"}
            </IonButton>

            <div className="toggle-auth">
              <IonText>
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </IonText>
              <IonButton
                fill="clear"
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
              >
                {isRegister ? "Sign In" : "Sign Up"}
              </IonButton>
            </div>
          </form>
        </div>

        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          color="danger"
          onDidDismiss={() => setError("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
