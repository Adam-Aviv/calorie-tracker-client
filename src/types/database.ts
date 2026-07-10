export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  activity_level:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very active"
    | null;
  daily_calorie_goal: number;
  protein_goal: number;
  carbs_goal: number;
  fats_goal: number;
  created_at: string;
  updated_at: string;
};

type FoodRow = {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving_size: number;
  serving_unit: string;
  category: string;
  created_at: string;
};

type FoodLogRow = {
  id: string;
  user_id: string;
  food_id: string | null;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  food_name: string;
  notes: string | null;
  created_at: string;
};

type WeightRow = {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  notes: string | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          email: string;
          name: string;
          current_weight?: number | null;
          goal_weight?: number | null;
          height?: number | null;
          age?: number | null;
          gender?: "male" | "female" | "other" | null;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very active"
            | null;
          daily_calorie_goal?: number;
          protein_goal?: number;
          carbs_goal?: number;
          fats_goal?: number;
        };
        Update: {
          email?: string;
          name?: string;
          current_weight?: number | null;
          goal_weight?: number | null;
          height?: number | null;
          age?: number | null;
          gender?: "male" | "female" | "other" | null;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very active"
            | null;
          daily_calorie_goal?: number;
          protein_goal?: number;
          carbs_goal?: number;
          fats_goal?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      foods: {
        Row: FoodRow;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          calories: number;
          protein: number;
          carbs: number;
          fats: number;
          serving_size: number;
          serving_unit: string;
          category?: string;
        };
        Update: {
          name?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fats?: number;
          serving_size?: number;
          serving_unit?: string;
          category?: string;
        };
        Relationships: [];
      };
      food_logs: {
        Row: FoodLogRow;
        Insert: {
          id?: string;
          user_id: string;
          food_id?: string | null;
          date: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          servings: number;
          calories: number;
          protein: number;
          carbs: number;
          fats: number;
          food_name: string;
          notes?: string | null;
        };
        Update: {
          food_id?: string | null;
          date?: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
          servings?: number;
          calories?: number;
          protein?: number;
          carbs?: number;
          fats?: number;
          food_name?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      weight_entries: {
        Row: WeightRow;
        Insert: {
          id?: string;
          user_id: string;
          weight: number;
          date: string;
          notes?: string | null;
        };
        Update: {
          weight?: number;
          date?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type { ProfileRow, FoodRow, FoodLogRow, WeightRow };
