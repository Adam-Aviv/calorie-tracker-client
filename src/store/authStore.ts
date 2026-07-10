import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/index";
import { authAPI } from "../services/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
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
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
