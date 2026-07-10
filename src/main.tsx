import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./store/authStore";
import { authAPI } from "./services/api";

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthenticated(true);
        authAPI
          .getMe()
          .then(setUser)
          .catch(() => setAuthenticated(false));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthenticated(true);
        authAPI
          .getMe()
          .then(setUser)
          .catch(() => {});
      } else {
        setAuthenticated(false);
        useAuthStore.setState({ user: null });
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setAuthenticated]);

  return <>{children}</>;
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthInitializer>
      <App />
    </AuthInitializer>
  </QueryClientProvider>
);
