-- "Sign up to save" — per-user saved models.
--
-- The model is stored as the full ModelGraph (jsonb) so a save round-trips
-- losslessly (positions, OWOX status, everything) — unlike OKF export, which
-- re-lays-out on load. Export OKF stays the portable format; this is the editor's
-- own save. (#4953 version control will snapshot this jsonb per save → text diff.)

create table if not exists public.models (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null default 'Untitled model',
  graph      jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists models_user_updated_idx on public.models (user_id, updated_at desc);

-- Row-Level Security: a row is visible/mutable only by its owner. This is why the
-- anon/publishable key is safe to ship in the browser — these policies, not the
-- key, are the boundary.
alter table public.models enable row level security;

create policy "owner can read"   on public.models for select using (auth.uid() = user_id);
create policy "owner can insert" on public.models for insert with check (auth.uid() = user_id);
create policy "owner can update" on public.models for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner can delete" on public.models for delete using (auth.uid() = user_id);

-- keep updated_at fresh on every save
create or replace function public.touch_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists models_touch_updated_at on public.models;
create trigger models_touch_updated_at
  before update on public.models
  for each row execute function public.touch_updated_at();
