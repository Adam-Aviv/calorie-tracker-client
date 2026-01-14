import axios from "axios";
import type {
  AuthResponse,
  ApiResponse,
  User,
  Food,
  CreateFoodInput,
  FoodLog,
  CreateFoodLogInput,
  DailyData,
  WeightEntry,
  CreateWeightInput,
} from "../types";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
const API_URL = "https://api-calorie-tracker.adam-aviv.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
      name,
    });
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const { data } = await api.get<ApiResponse<User>>("/users/profile");
    return data.data;
  },

  updateProfile: async (updates: Partial<User>) => {
    const { data } = await api.put<ApiResponse<User>>(
      "/users/profile",
      updates
    );
    return data.data;
  },

  calculateTDEE: async () => {
    const { data } = await api.get("/users/calculate-tdee");
    return data.data;
  },
};

// Foods API
export const foodsAPI = {
  getAll: async (params?: { search?: string; category?: string }) => {
    const { data } = await api.get<ApiResponse<Food[]>>("/foods", { params });
    return data.data || [];
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Food>>(`/foods/${id}`);
    return data.data;
  },

  create: async (food: CreateFoodInput) => {
    const { data } = await api.post<ApiResponse<Food>>("/foods", food);
    return data.data;
  },

  update: async (id: string, food: Partial<CreateFoodInput>) => {
    const { data } = await api.put<ApiResponse<Food>>(`/foods/${id}`, food);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/foods/${id}`);
  },
};

// Logs API
export const logsAPI = {
  getDaily: async (date: string) => {
    const { data } = await api.get<ApiResponse<DailyData>>(
      `/logs/daily/${date}`
    );
    return data.data;
  },

  create: async (log: CreateFoodLogInput) => {
    const { data } = await api.post<ApiResponse<FoodLog>>("/logs", log);
    return data.data;
  },

  update: async (id: string, updates: Partial<CreateFoodLogInput>) => {
    const { data } = await api.put<ApiResponse<FoodLog>>(
      `/logs/${id}`,
      updates
    );
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/logs/${id}`);
  },
};

// Weight API
export const weightAPI = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<WeightEntry[]>>("/weight");
    return data.data || [];
  },

  getLatest: async () => {
    const { data } = await api.get<ApiResponse<WeightEntry>>("/weight/latest");
    return data.data;
  },

  getTrend: async (days: number = 30) => {
    const { data } = await api.get(`/weight/trend/${days}`);
    return data.data;
  },

  create: async (weight: CreateWeightInput) => {
    const { data } = await api.post<ApiResponse<WeightEntry>>(
      "/weight",
      weight
    );
    return data.data;
  },

  update: async (id: string, weight: Partial<CreateWeightInput>) => {
    const { data } = await api.put<ApiResponse<WeightEntry>>(
      `/weight/${id}`,
      weight
    );
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/weight/${id}`);
  },
};

export default api;
