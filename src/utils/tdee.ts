import type { User } from "../types";

const ACTIVITY_MULTIPLIERS: Record<
  NonNullable<User["activityLevel"]>,
  number
> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very active": 1.9,
};

export function calculateTDEE(profile: {
  currentWeight?: number;
  height?: number;
  age?: number;
  gender?: User["gender"];
  activityLevel?: User["activityLevel"];
}): number {
  const weight = profile.currentWeight;
  const height = profile.height;
  const age = profile.age;

  if (!weight || !height || !age) {
    throw new Error("Weight, height, and age are required to calculate TDEE");
  }

  let bmr: number;
  if (profile.gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (profile.gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }

  const multiplier =
    ACTIVITY_MULTIPLIERS[profile.activityLevel || "moderate"] ?? 1.55;

  return bmr * multiplier;
}
