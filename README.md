# Calorie Tracker (Expo)

Native iOS and Android app for logging food, weight, and meal photos.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. Run the SQL in `supabase/migrations/20260915_photo_meal.sql` in the Supabase SQL editor (adds `food_logs.source` and `api_usage`).
3. Deploy the photo analysis function:
   ```bash
   supabase functions deploy analyze-meal-photo
   supabase secrets set OPENAI_API_KEY=sk-...
   ```
4. Install on a physical iPhone (Xcode, like Capacitor):
   ```bash
   npm run ios:release
   ```
   That embeds the JS bundle. The app runs from the home screen without Metro.

   Or open Xcode:
   ```bash
   npx expo prebuild --platform ios
   open ios/CalorieTracker.xcworkspace
   ```
   Select your iPhone, set Signing Team, set the scheme to **Release**, then press Run.

## Photo meals

Use the center **+** button → **Snap a meal**. The image is sent to a Supabase Edge Function (GPT-4o vision). Review the detected items, optionally save any row to your food library, then confirm to write diary logs. Photos are not stored.

## Stack

Expo Router, NativeWind, Supabase, TanStack Query, Zustand.
