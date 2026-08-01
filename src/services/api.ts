import { supabase } from "../lib/supabase";
import { calculateTDEE } from "../utils/tdee";
import { buildDailySummary } from "../utils/dailySummary";
import type { Database, FoodLogRow } from "../types/database";
import type {
  AuthResponse,
  User,
  Food,
  CreateFoodInput,
  FoodLog,
  CreateFoodLogInput,
  DailyData,
  WeightEntry,
  CreateWeightInput,
} from "../types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type FoodRow = Database["public"]["Tables"]["foods"]["Row"];
type WeightRow = Database["public"]["Tables"]["weight_entries"]["Row"];

function toUser(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    currentWeight: row.current_weight ?? undefined,
    goalWeight: row.goal_weight ?? undefined,
    height: row.height ?? undefined,
    age: row.age ?? undefined,
    gender: row.gender ?? undefined,
    activityLevel: row.activity_level ?? undefined,
    dailyCalorieGoal: row.daily_calorie_goal,
    proteinGoal: row.protein_goal,
    carbsGoal: row.carbs_goal,
    fatsGoal: row.fats_goal,
  };
}

function toFood(row: FoodRow): Food {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fats: Number(row.fats),
    servingSize: Number(row.serving_size),
    servingUnit: row.serving_unit,
    category: row.category,
    createdAt: row.created_at,
  };
}

function toFoodLog(
  row: FoodLogRow,
  food?: { servingSize: number; servingUnit: string } | null
): FoodLog {
  return {
    id: row.id,
    userId: row.user_id,
    foodId: row.food_id ?? "",
    date: row.date,
    mealType: row.meal_type,
    servings: Number(row.servings),
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fats: Number(row.fats),
    foodName: row.food_name,
    servingSize: food?.servingSize,
    servingUnit: food?.servingUnit,
    notes: row.notes ?? undefined,
  };
}

function toWeightEntry(row: WeightRow): WeightEntry {
  return {
    id: row.id,
    userId: row.user_id,
    weight: Number(row.weight),
    date: row.date,
    notes: row.notes ?? undefined,
  };
}

async function requireUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return user.id;
}

function throwIfError(error: { message: string } | null, fallback: string) {
  if (error) throw new Error(error.message || fallback);
}

function ensureData<T>(data: T | null, fallback: string): T {
  if (!data) throw new Error(fallback);
  return data;
}

// Auth API
export const authAPI = {
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    throwIfError(error, "Registration failed");

    if (!data.user) throw new Error("Registration failed");

    return {
      success: true,
      data: {
        id: data.user.id,
        name,
        email: data.user.email ?? email,
      },
    };
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    throwIfError(error, "Login failed");

    if (!data.user) throw new Error("Login failed");

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", data.user.id)
      .single();

    return {
      success: true,
      data: {
        id: data.user.id,
        name: profile?.name ?? data.user.user_metadata?.name ?? "",
        email: data.user.email ?? email,
      },
    };
  },

  getMe: async (): Promise<User> => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    throwIfError(error, "Failed to fetch profile");
    return toUser(ensureData(data, "Profile not found"));
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    throwIfError(error, "Logout failed");
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<User> => authAPI.getMe(),

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const userId = await requireUserId();
    const row: Database["public"]["Tables"]["profiles"]["Update"] = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) row.name = updates.name;
    if (updates.currentWeight !== undefined)
      row.current_weight = updates.currentWeight;
    if (updates.goalWeight !== undefined) row.goal_weight = updates.goalWeight;
    if (updates.height !== undefined) row.height = updates.height;
    if (updates.age !== undefined) row.age = updates.age;
    if (updates.gender !== undefined) row.gender = updates.gender;
    if (updates.activityLevel !== undefined)
      row.activity_level = updates.activityLevel;
    if (updates.dailyCalorieGoal !== undefined)
      row.daily_calorie_goal = updates.dailyCalorieGoal;
    if (updates.proteinGoal !== undefined)
      row.protein_goal = updates.proteinGoal;
    if (updates.carbsGoal !== undefined) row.carbs_goal = updates.carbsGoal;
    if (updates.fatsGoal !== undefined) row.fats_goal = updates.fatsGoal;

    const { data, error } = await supabase
      .from("profiles")
      .update(row)
      .eq("id", userId)
      .select("*")
      .single();
    throwIfError(error, "Failed to update profile");
    return toUser(ensureData(data, "Profile not found"));
  },

  calculateTDEE: async (
    profile?: Partial<User>
  ): Promise<{ tdee: number }> => {
    const user = profile ?? (await authAPI.getMe());
    return { tdee: calculateTDEE(user) };
  },
};

// Foods API
export const foodsAPI = {
  getAll: async () => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .eq("user_id", userId)
      .order("name");
    throwIfError(error, "Failed to fetch foods");
    return (data ?? []).map(toFood);
  },

  getById: async (id: string): Promise<Food> => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    throwIfError(error, "Food not found");
    return toFood(ensureData(data, "Food not found"));
  },

  create: async (food: CreateFoodInput): Promise<Food> => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("foods")
      .insert({
        user_id: userId,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        serving_size: food.servingSize,
        serving_unit: food.servingUnit,
        category: food.category ?? "other",
      })
      .select("*")
      .single();
    throwIfError(error, "Failed to create food");
    return toFood(ensureData(data, "Food not found"));
  },

  update: async (
    id: string,
    food: Partial<CreateFoodInput>
  ): Promise<Food> => {
    const userId = await requireUserId();
    const row: Database["public"]["Tables"]["foods"]["Update"] = {};
    if (food.name !== undefined) row.name = food.name;
    if (food.calories !== undefined) row.calories = food.calories;
    if (food.protein !== undefined) row.protein = food.protein;
    if (food.carbs !== undefined) row.carbs = food.carbs;
    if (food.fats !== undefined) row.fats = food.fats;
    if (food.servingSize !== undefined) row.serving_size = food.servingSize;
    if (food.servingUnit !== undefined) row.serving_unit = food.servingUnit;
    if (food.category !== undefined) row.category = food.category;

    const { data, error } = await supabase
      .from("foods")
      .update(row)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();
    throwIfError(error, "Failed to update food");
    return toFood(ensureData(data, "Food not found"));
  },

  delete: async (id: string) => {
    const userId = await requireUserId();
    const { error } = await supabase
      .from("foods")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    throwIfError(error, "Failed to delete food");
  },
};

function macrosFromFood(food: Food, servings: number) {
  return {
    calories: food.calories * servings,
    protein: food.protein * servings,
    carbs: food.carbs * servings,
    fats: food.fats * servings,
  };
}

type FoodLogWithServing = FoodLogRow & {
  foods: { serving_size: number; serving_unit: string } | null;
};

// Logs API
export const logsAPI = {
  getDaily: async (date: string): Promise<DailyData> => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("food_logs")
      .select("*, foods ( serving_size, serving_unit )")
      .eq("user_id", userId)
      .eq("date", date)
      .order("created_at");
    throwIfError(error, "Failed to fetch logs");

    const logs = ((data ?? []) as FoodLogWithServing[]).map((row) => {
      const food = row.foods
        ? {
            servingSize: Number(row.foods.serving_size),
            servingUnit: row.foods.serving_unit,
          }
        : null;
      return toFoodLog(row, food);
    });
    return { logs, summary: buildDailySummary(logs) };
  },

  create: async (log: CreateFoodLogInput): Promise<FoodLog> => {
    const userId = await requireUserId();
    const food = await foodsAPI.getById(log.foodId);
    const macros = macrosFromFood(food, log.servings);

    const { data, error } = await supabase
      .from("food_logs")
      .insert({
        user_id: userId,
        food_id: log.foodId,
        date: log.date,
        meal_type: log.mealType,
        servings: log.servings,
        food_name: food.name,
        notes: log.notes ?? null,
        ...macros,
      })
      .select("*")
      .single();
    throwIfError(error, "Failed to create log");
    return toFoodLog(ensureData(data, "Log not found"), {
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
    });
  },

  update: async (
    id: string,
    updates: Partial<CreateFoodLogInput>
  ): Promise<FoodLog> => {
    const userId = await requireUserId();

    const { data: existing, error: fetchError } = await supabase
      .from("food_logs")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    throwIfError(fetchError, "Log not found");
    const current = ensureData(existing, "Log not found");

    const row: Database["public"]["Tables"]["food_logs"]["Update"] = {};
    if (updates.date !== undefined) row.date = updates.date;
    if (updates.mealType !== undefined) row.meal_type = updates.mealType;
    if (updates.notes !== undefined) row.notes = updates.notes ?? null;

    const foodId = updates.foodId ?? current.food_id;
    const servings = updates.servings ?? Number(current.servings);
    let linkedFood: Food | null = null;

    if (foodId) {
      linkedFood = await foodsAPI.getById(foodId);
      const macros = macrosFromFood(linkedFood, servings);
      row.food_id = foodId;
      row.servings = servings;
      row.food_name = linkedFood.name;
      Object.assign(row, macros);
    } else if (updates.servings !== undefined) {
      row.servings = servings;
      const ratio = servings / Number(current.servings);
      row.calories = Number(current.calories) * ratio;
      row.protein = Number(current.protein) * ratio;
      row.carbs = Number(current.carbs) * ratio;
      row.fats = Number(current.fats) * ratio;
    }

    const { data, error } = await supabase
      .from("food_logs")
      .update(row)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();
    throwIfError(error, "Failed to update log");
    const saved = ensureData(data, "Log not found");

    if (linkedFood) {
      return toFoodLog(saved, {
        servingSize: linkedFood.servingSize,
        servingUnit: linkedFood.servingUnit,
      });
    }

    if (saved.food_id) {
      try {
        const food = await foodsAPI.getById(saved.food_id);
        return toFoodLog(saved, {
          servingSize: food.servingSize,
          servingUnit: food.servingUnit,
        });
      } catch {
        return toFoodLog(saved);
      }
    }

    return toFoodLog(saved);
  },

  delete: async (id: string) => {
    const userId = await requireUserId();
    const { error } = await supabase
      .from("food_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    throwIfError(error, "Failed to delete log");
  },
};

// Weight API
export const weightAPI = {
  getAll: async (): Promise<WeightEntry[]> => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("weight_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });
    throwIfError(error, "Failed to fetch weight entries");
    return (data ?? []).map(toWeightEntry);
  },

  create: async (weight: CreateWeightInput): Promise<WeightEntry> => {
    const userId = await requireUserId();
    const { data, error } = await supabase
      .from("weight_entries")
      .insert({
        user_id: userId,
        weight: weight.weight,
        date: weight.date,
        notes: weight.notes ?? null,
      })
      .select("*")
      .single();
    throwIfError(error, "Failed to create weight entry");
    return toWeightEntry(ensureData(data, "Weight entry not found"));
  },

  update: async (
    id: string,
    weight: Partial<CreateWeightInput>
  ): Promise<WeightEntry> => {
    const userId = await requireUserId();
    const row: Database["public"]["Tables"]["weight_entries"]["Update"] = {};
    if (weight.weight !== undefined) row.weight = weight.weight;
    if (weight.date !== undefined) row.date = weight.date;
    if (weight.notes !== undefined) row.notes = weight.notes ?? null;

    const { data, error } = await supabase
      .from("weight_entries")
      .update(row)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();
    throwIfError(error, "Failed to update weight entry");
    return toWeightEntry(ensureData(data, "Weight entry not found"));
  },

  delete: async (id: string) => {
    const userId = await requireUserId();
    const { error } = await supabase
      .from("weight_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    throwIfError(error, "Failed to delete weight entry");
  },
};

export { supabase };
