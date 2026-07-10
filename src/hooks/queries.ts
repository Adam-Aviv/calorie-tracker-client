// src/hooks/queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateFoodInput,
  CreateFoodLogInput,
  CreateWeightInput,
  DailyData,
  Food,
  FoodLog,
  User,
  WeightEntry,
} from "../types";
import {
  authAPI,
  foodsAPI,
  logsAPI,
  usersAPI,
  weightAPI,
} from "../services/api";
import { useAuthStore } from "../store/authStore";

export const qk = {
  me: ["auth", "me"] as const,
  profile: ["users", "profile"] as const,

  foods: (search?: string, category?: string) =>
    ["foods", { search: search || "", category: category || "" }] as const,
  food: (id: string) => ["foods", "byId", id] as const,

  daily: (date: string) => ["logs", "daily", date] as const,

  weights: ["weight", "all"] as const,
  weightLatest: ["weight", "latest"] as const,
  weightTrend: (days: number) => ["weight", "trend", days] as const,
};

function apiErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;
  return fallback;
}

// -------------------- AUTH --------------------
type AuthResult = {
  success: boolean;
  data: { id: string; name: string; email: string };
};

export function useLoginMutation(isRegister: boolean) {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<
    AuthResult,
    Error,
    { email: string; password: string; name?: string }
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
    onSuccess: async (res) => {
      if (!res?.success) throw new Error("Authentication failed");

      const minimalUser: User = {
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
        dailyCalorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 250,
        fatsGoal: 65,
      };

      setUser(minimalUser);

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
        // keep minimal user
      }
    },
  });
}

// -------------------- USERS --------------------
export function useProfileQuery(enabled = true) {
  return useQuery<User | undefined>({
    queryKey: qk.profile,
    queryFn: usersAPI.getProfile,
    enabled,
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<User | undefined, Error, Partial<User>>({
    mutationFn: usersAPI.updateProfile,
    onSuccess: (updated) => {
      if (!updated) return;
      setUser(updated);
      qc.setQueryData(qk.profile, updated);
      qc.invalidateQueries({ queryKey: qk.profile });
    },
  });
}

export function useCalculateTDEEMutation() {
  return useMutation<{ tdee: number }, Error, Partial<User> | void>({
    mutationFn: (profile) => usersAPI.calculateTDEE(profile ?? undefined),
  });
}

// -------------------- FOODS --------------------
export function useFoodsQuery(
  params?: { search?: string; category?: string },
  enabled = true
) {
  return useQuery<Food[]>({
    queryKey: qk.foods(params?.search, params?.category),
    queryFn: () => foodsAPI.getAll(params),
    enabled,
  });
}

export function useFoodByIdQuery(id?: string, enabled = true) {
  return useQuery<Food | undefined>({
    queryKey: id ? qk.food(id) : (["foods", "byId", "missing"] as const),
    queryFn: () => foodsAPI.getById(id!),
    enabled: enabled && !!id,
  });
}

export function useCreateFoodMutation() {
  const qc = useQueryClient();
  return useMutation<Food | undefined, Error, CreateFoodInput>({
    mutationFn: foodsAPI.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["foods"] });
    },
  });
}

export function useUpdateFoodMutation() {
  const qc = useQueryClient();
  return useMutation<
    Food | undefined,
    Error,
    { id: string; updates: Partial<CreateFoodInput> }
  >({
    mutationFn: ({ id, updates }) => foodsAPI.update(id, updates),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["foods"] });
      qc.invalidateQueries({ queryKey: qk.food(vars.id) });
    },
  });
}

export function useDeleteFoodMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: foodsAPI.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["foods"] });
    },
  });
}

// -------------------- LOGS --------------------
export function useDailyLogsQuery(date: string, enabled = true) {
  return useQuery<DailyData | undefined>({
    queryKey: qk.daily(date),
    queryFn: () => logsAPI.getDaily(date),
    enabled: enabled && !!date,
  });
}

export function useCreateLogMutation() {
  const qc = useQueryClient();
  return useMutation<
    FoodLog | undefined,
    Error,
    { date: string; input: CreateFoodLogInput }
  >({
    mutationFn: ({ input }) => logsAPI.create(input),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: qk.daily(vars.date) });
    },
  });
}

export function useUpdateLogMutation() {
  const qc = useQueryClient();
  return useMutation<
    FoodLog | undefined,
    Error,
    { date: string; id: string; updates: Partial<CreateFoodLogInput> }
  >({
    mutationFn: ({ id, updates }) => logsAPI.update(id, updates),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: qk.daily(vars.date) });
    },
  });
}

export function useDeleteLogMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, { date: string; id: string }>({
    mutationFn: ({ id }) => logsAPI.delete(id),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: qk.daily(vars.date) });
    },
  });
}

// -------------------- WEIGHT --------------------
export function useWeightsQuery(enabled = true) {
  return useQuery<WeightEntry[]>({
    queryKey: qk.weights,
    queryFn: weightAPI.getAll,
    enabled,
  });
}

export function useCreateWeightMutation() {
  const qc = useQueryClient();
  return useMutation<WeightEntry | undefined, Error, CreateWeightInput>({
    mutationFn: weightAPI.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.weights });
    },
  });
}

export function useUpdateWeightMutation() {
  const qc = useQueryClient();
  return useMutation<
    WeightEntry | undefined,
    Error,
    { id: string; updates: Partial<CreateWeightInput> }
  >({
    mutationFn: ({ id, updates }) => weightAPI.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.weights });
    },
  });
}

export function useDeleteWeightMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: weightAPI.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.weights });
    },
  });
}

export { apiErrorMessage };
