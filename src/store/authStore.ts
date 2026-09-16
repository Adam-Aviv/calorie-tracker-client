import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "../types";
import { authAPI } from "../services/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setUser: (user: User) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
      },

      setHydrated: (hydrated) => {
        set({ hydrated });
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch {
          // clear local state even if sign-out fails
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hydrated: true });
      },
    },
  ),
);
