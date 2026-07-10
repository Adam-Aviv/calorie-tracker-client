-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  current_weight numeric,
  goal_weight numeric,
  height numeric,
  age integer,
  gender text check (gender in ('male', 'female', 'other')),
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very active')),
  daily_calorie_goal integer not null default 2000,
  protein_goal integer not null default 150,
  carbs_goal integer not null default 250,
  fats_goal integer not null default 65,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Foods library
create table public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fats numeric not null,
  serving_size numeric not null,
  serving_unit text not null,
  category text not null default 'other',
  created_at timestamptz not null default now()
);

-- Daily food logs (macros denormalized for fast reads)
create table public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  food_id uuid references public.foods on delete set null,
  date date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  servings numeric not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fats numeric not null,
  food_name text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Weight tracking
create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  weight numeric not null,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes
create index foods_user_id_idx on public.foods (user_id);
create index foods_name_idx on public.foods (user_id, name);
create index food_logs_user_date_idx on public.food_logs (user_id, date);
create index weight_entries_user_date_idx on public.weight_entries (user_id, date desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.foods enable row level security;
alter table public.food_logs enable row level security;
alter table public.weight_entries enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own foods"
  on public.foods for all using (auth.uid() = user_id);

create policy "Users can manage own food logs"
  on public.food_logs for all using (auth.uid() = user_id);

create policy "Users can manage own weight entries"
  on public.weight_entries for all using (auth.uid() = user_id);
