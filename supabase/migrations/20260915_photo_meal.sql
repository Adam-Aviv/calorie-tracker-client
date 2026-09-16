-- Apply on existing projects (safe to re-run)

alter table public.food_logs
  add column if not exists source text not null default 'manual';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'food_logs_source_check'
  ) then
    alter table public.food_logs
      add constraint food_logs_source_check
      check (source in ('manual', 'photo'));
  end if;
end $$;

create table if not exists public.api_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists api_usage_user_action_created_idx
  on public.api_usage (user_id, action, created_at desc);

alter table public.api_usage enable row level security;

drop policy if exists "Users can insert own api usage" on public.api_usage;
create policy "Users can insert own api usage"
  on public.api_usage for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view own api usage" on public.api_usage;
create policy "Users can view own api usage"
  on public.api_usage for select using (auth.uid() = user_id);
