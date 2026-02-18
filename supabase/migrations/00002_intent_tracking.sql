-- ============================================================================
-- Pulso - Intent Tracking System
-- Migration: 00002_intent_tracking.sql
-- Description: User financial/behavioral intents with progress tracking
--              and milestone-based gamification rewards.
--
-- Design: Hybrid progressive model
--   Phase 1 (MVP): Intents based on in-app behavior (streaks, content,
--                   savings goals with manual input)
--   Phase 2 (future): Enriched with Open Banking/Finance data via Pluggy
--                      or similar providers for automatic validation
-- ============================================================================

-- Extend coin_source_type to include intent rewards
alter type public.coin_source_type add value if not exists 'intent_milestone';

-- ============================================================================
-- 1. USER_INTENTS (Intenções do Usuário)
-- Core table: a goal the user commits to achieving
-- ============================================================================

create type public.intent_type as enum (
  -- Educational / behavioral (Phase 1)
  'complete_track',      -- Completar uma trilha inteira
  'maintain_streak',     -- Manter streak por N dias
  'complete_content',    -- Completar N conteúdos
  'build_habit',         -- Construir um hábito (genérico, ex: revisar orçamento)
  -- Financial (Phase 1 manual, Phase 2 automatic)
  'save_amount',         -- Economizar um valor em R$
  'reduce_spending'      -- Reduzir gastos em uma categoria
);

create type public.intent_status as enum ('active', 'paused', 'completed', 'abandoned');

create type public.intent_period as enum ('weekly', 'monthly', 'custom');

create table public.user_intents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete set null,

  -- Description
  title varchar(255) not null,
  description text,

  -- Classification
  intent_type public.intent_type not null,
  period_type public.intent_period not null default 'monthly',

  -- Target: what the user wants to achieve
  -- For save_amount/reduce_spending: value in BRL
  -- For maintain_streak: number of days
  -- For complete_content: number of content items
  -- For complete_track: 100 (percentage)
  target_value numeric(10,2) not null,

  -- What unit the target is measured in
  -- Allows flexible metrics without hardcoding
  target_metric varchar(50) not null default 'currency_brl'
    check (target_metric in ('currency_brl', 'streak_days', 'content_count', 'percentage', 'custom')),

  -- Optional category for financial intents (Phase 2: mapped from Open Banking MCC codes)
  -- Examples: 'food_delivery', 'transport', 'shopping', 'subscriptions'
  -- Nullable because educational intents don't have categories
  target_category varchar(100),

  -- Time bounds
  start_date date not null default current_date,
  end_date date not null,

  -- Status
  status public.intent_status not null default 'active',

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Ensure end_date is after start_date
  constraint user_intents_date_range_check check (end_date > start_date)
);

comment on table public.user_intents is 'User-defined goals (financial or behavioral). Hybrid model: works with manual input now, ready for Open Banking data later.';
comment on column public.user_intents.track_id is 'Optional link to a specific track. Used for track-related intents like complete_track.';
comment on column public.user_intents.target_metric is 'Unit of measurement: currency_brl for money, streak_days for streaks, content_count for content, percentage for progress-based, custom for anything else.';
comment on column public.user_intents.target_category is 'Spending category for financial intents. Phase 1: user-defined. Phase 2: mapped from Open Banking MCC codes.';

-- Indexes for common queries
create index idx_user_intents_user_status on public.user_intents(user_id, status);
create index idx_user_intents_user_active on public.user_intents(user_id, status, end_date) where status = 'active';
create index idx_user_intents_track on public.user_intents(track_id) where track_id is not null;

-- ============================================================================
-- 2. INTENT_PROGRESS (Progresso da Intenção)
-- Daily/periodic snapshots of progress toward the intent
-- ============================================================================

create type public.intent_progress_status as enum ('on_track', 'behind', 'exceeded');

create type public.validation_source as enum (
  'app_automatic',   -- Calculated from in-app data (streaks, content progress)
  'manual',          -- User self-reported
  'external'         -- Phase 2: from Open Banking/Finance API
);

create table public.intent_progress (
  id uuid primary key default uuid_generate_v4(),
  intent_id uuid not null references public.user_intents(id) on delete cascade,

  -- When this progress was tracked
  tracked_date date not null,

  -- The actual measured value for this date
  actual_value numeric(10,2) not null default 0,

  -- How many data points contributed (e.g. number of transactions, number of content items)
  data_point_count integer not null default 0,

  -- Computed status relative to the pace needed
  status public.intent_progress_status not null default 'on_track',

  -- How this data was obtained
  validation_source public.validation_source not null default 'manual',

  -- Optional user notes
  notes text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One progress entry per intent per day
  constraint intent_progress_intent_date_key unique (intent_id, tracked_date)
);

comment on table public.intent_progress is 'Daily progress snapshots for each intent. Phase 1: manual + app_automatic. Phase 2: enriched by external APIs.';
comment on column public.intent_progress.data_point_count is 'Number of data points: transactions counted, content items completed, etc.';
comment on column public.intent_progress.validation_source is 'How the value was obtained: app_automatic (from in-app data), manual (user input), external (Open Banking API).';

-- Index for querying progress history
create index idx_intent_progress_intent_date on public.intent_progress(intent_id, tracked_date desc);

-- ============================================================================
-- 3. INTENT_MILESTONES (Marcos da Intenção)
-- Gamification checkpoints that reward user progress
-- ============================================================================

create type public.milestone_type as enum (
  'day_3',       -- 3 dias de consistencia
  'week_1',      -- 1 semana
  'halfway',     -- Metade do caminho
  'day_21',      -- 21 dias (habito formado)
  'completed'    -- Meta alcancada
);

create table public.intent_milestones (
  id uuid primary key default uuid_generate_v4(),
  intent_id uuid not null references public.user_intents(id) on delete cascade,

  -- Milestone definition
  milestone_type public.milestone_type not null,
  milestone_name varchar(255) not null,

  -- Progress required to unlock (percentage 0-100, null = computed from type)
  target_progress numeric(5,2),

  -- Rewards
  coins_reward integer not null default 0,
  achievement_id uuid references public.achievements(id) on delete set null,

  -- State
  is_achieved boolean not null default false,
  achieved_at timestamptz,

  -- Timestamps
  created_at timestamptz not null default now(),

  -- One milestone of each type per intent
  constraint intent_milestones_intent_type_key unique (intent_id, milestone_type)
);

comment on table public.intent_milestones is 'Gamification milestones tied to intent progress. Rewards integrate with existing coins_ledger.';
comment on column public.intent_milestones.achievement_id is 'Optional link to an existing achievement that gets unlocked when milestone is reached.';
comment on column public.intent_milestones.target_progress is 'Percentage of intent completion needed. Null = derived from milestone_type defaults.';

-- Index for checking milestones
create index idx_intent_milestones_intent on public.intent_milestones(intent_id, is_achieved);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- User intents: users manage their own
alter table public.user_intents enable row level security;
create policy "Users can view own intents"
  on public.user_intents for select using (auth.uid() = user_id);
create policy "Users can insert own intents"
  on public.user_intents for insert with check (auth.uid() = user_id);
create policy "Users can update own intents"
  on public.user_intents for update using (auth.uid() = user_id);

-- Intent progress: accessible via intent ownership
-- Uses a subquery to check that the intent belongs to the user
alter table public.intent_progress enable row level security;
create policy "Users can view own intent progress"
  on public.intent_progress for select
  using (exists (
    select 1 from public.user_intents
    where user_intents.id = intent_progress.intent_id
    and user_intents.user_id = auth.uid()
  ));
create policy "Users can insert own intent progress"
  on public.intent_progress for insert
  with check (exists (
    select 1 from public.user_intents
    where user_intents.id = intent_progress.intent_id
    and user_intents.user_id = auth.uid()
  ));
create policy "Users can update own intent progress"
  on public.intent_progress for update
  using (exists (
    select 1 from public.user_intents
    where user_intents.id = intent_progress.intent_id
    and user_intents.user_id = auth.uid()
  ));

-- Intent milestones: accessible via intent ownership
alter table public.intent_milestones enable row level security;
create policy "Users can view own intent milestones"
  on public.intent_milestones for select
  using (exists (
    select 1 from public.user_intents
    where user_intents.id = intent_milestones.intent_id
    and user_intents.user_id = auth.uid()
  ));
create policy "Users can insert own intent milestones"
  on public.intent_milestones for insert
  with check (exists (
    select 1 from public.user_intents
    where user_intents.id = intent_milestones.intent_id
    and user_intents.user_id = auth.uid()
  ));
create policy "Users can update own intent milestones"
  on public.intent_milestones for update
  using (exists (
    select 1 from public.user_intents
    where user_intents.id = intent_milestones.intent_id
    and user_intents.user_id = auth.uid()
  ));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at using existing function
create trigger user_intents_updated_at
  before update on public.user_intents
  for each row execute procedure public.handle_updated_at();

create trigger intent_progress_updated_at
  before update on public.intent_progress
  for each row execute procedure public.handle_updated_at();
