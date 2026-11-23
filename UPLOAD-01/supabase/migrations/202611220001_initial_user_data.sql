-- China Made Easy initial user-data schema for Supabase/Postgres.
-- Apply only after reviewing provider, region, privacy and retention decisions.
-- No service-role key belongs in the frontend.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  preferred_locale text not null default 'en' check (preferred_locale in ('en','zh-Hans','zh-Hant','fr','es','ja','ko')),
  consent_version text,
  deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'My China Trip' check (char_length(title) between 1 and 120),
  city_ids jsonb not null default '[]'::jsonb check (jsonb_typeof(city_ids) = 'array'),
  start_date date,
  end_date date,
  itinerary jsonb not null default '{}'::jsonb check (jsonb_typeof(itinerary) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_date is null or end_date is null or end_date >= start_date)
);

create table if not exists public.city_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_id text not null check (char_length(city_id) <= 100),
  checked_in_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, city_id)
);

create table if not exists public.attraction_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attraction_id text not null check (char_length(attraction_id) <= 120),
  city_id text not null check (char_length(city_id) <= 100),
  checked_in_at timestamptz not null default now(),
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (user_id, attraction_id)
);

create table if not exists public.experience_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experience_id text not null check (char_length(experience_id) <= 120),
  city_id text,
  checked_in_at timestamptz not null default now(),
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now()
);
create unique index if not exists experience_checkins_unique_location_idx
  on public.experience_checkins(user_id, experience_id, coalesce(city_id, ''));

create table if not exists public.experience_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  experience_id text not null check (char_length(experience_id) <= 120),
  created_at timestamptz not null default now(),
  primary key (user_id, experience_id)
);

create table if not exists public.checklist_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  checklist_key text not null check (char_length(checklist_key) <= 100),
  item_key text not null check (char_length(item_key) <= 120),
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, checklist_key, item_key)
);

create table if not exists public.feature_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text not null check (char_length(category) <= 80),
  suggestion text not null check (char_length(suggestion) between 3 and 2000),
  status text not null default 'submitted' check (status in ('submitted','reviewing','planned','declined','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trips_user_updated_idx on public.trips(user_id, updated_at desc);
create index if not exists attraction_checkins_user_date_idx on public.attraction_checkins(user_id, checked_in_at desc);
create index if not exists experience_checkins_user_date_idx on public.experience_checkins(user_id, checked_in_at desc);
create index if not exists feature_suggestions_user_date_idx on public.feature_suggestions(user_id, created_at desc);

-- Create a profile automatically for newly authenticated users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, preferred_locale)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'preferred_locale', 'en'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Row Level Security: authenticated users can only operate on their own records.
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.city_checkins enable row level security;
alter table public.attraction_checkins enable row level security;
alter table public.experience_checkins enable row level security;
alter table public.experience_favorites enable row level security;
alter table public.checklist_progress enable row level security;
alter table public.feature_suggestions enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "trips_owner_all" on public.trips for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "city_checkins_owner_all" on public.city_checkins for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "attraction_checkins_owner_all" on public.attraction_checkins for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "experience_checkins_owner_all" on public.experience_checkins for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "experience_favorites_owner_all" on public.experience_favorites for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "checklist_progress_owner_all" on public.checklist_progress for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "suggestions_owner_select" on public.feature_suggestions for select to authenticated using (user_id = (select auth.uid()));
create policy "suggestions_owner_insert" on public.feature_suggestions for insert to authenticated with check (user_id = (select auth.uid()));
create policy "suggestions_owner_delete" on public.feature_suggestions for delete to authenticated using (user_id = (select auth.uid()));

-- Deliberately do not grant anonymous access or expose a public suggestion write policy here.
