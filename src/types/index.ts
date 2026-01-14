// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  currentWeight?: number;
  goalWeight?: number;
  height?: number;
  age?: number;
  gender?: "male" | "female" | "other";
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very active";
  dailyCalorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
}

// Food Types
export interface Food {
  _id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
  category: string;
  createdAt: string;
}

export interface CreateFoodInput {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
  category?: string;
}

// Food Log Types
export interface FoodLog {
  _id: string;
  userId: string;
  foodId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foodName: string;
  notes?: string;
}

export interface CreateFoodLogInput {
  foodId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  notes?: string;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  mealBreakdown: {
    [key: string]: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      count: number;
    };
  };
}

export interface DailyData {
  logs: FoodLog[];
  summary: DailySummary;
}

// Weight Types
export interface WeightEntry {
  _id: string;
  userId: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface CreateWeightInput {
  weight: number;
  date: string;
  notes?: string;
}

// API Response
export interface ValidationError {
  msg: string;
  param: string;
  location: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}
