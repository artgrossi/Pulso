-- ============================================================================
-- Pulso - Plataforma de Bem-Estar Financeiro Gamificado
-- Migration: 00001_initial_schema.sql
-- Description: Creates all core tables for the gamified financial wellness platform
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. TRACKS (Trilhas)
-- The 4 learning tracks: Retomada, Fundação, Crescimento, Expertise
-- ============================================================================
create table public.tracks (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null check (slug in ('retomada', 'fundacao', 'crescimento', 'expertise')),
  name text not null,
  description text not null,
  icon text not null default '📊',
  sort_order smallint not null default 0,
  coins_convertible boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.tracks is 'The 4 financial wellness tracks';
comment on column public.tracks.coins_convertible is 'Whether coins earned in this track can be converted to aportes. False for Retomada.';

-- ============================================================================
-- 2. PROFILES (Perfis de Usuário)
-- Extends auth.users with app-specific data
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  current_track_id uuid references public.tracks(id),
  onboarding_completed boolean not null default false,
  total_coins integer not null default 0,
  convertible_coins integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profiles extending Supabase auth';

-- ============================================================================
-- 3. DIAGNOSIS_RESPONSES (Respostas do Diagnóstico Financeiro)
-- Stores onboarding quiz answers for track assignment
-- ============================================================================
create table public.diagnosis_responses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  has_overdue_debt boolean,
  can_save_monthly boolean,
  has_emergency_fund boolean,
  knows_retirement_target boolean,
  understands_pgbl_vgbl boolean,
  assigned_track_slug text not null check (assigned_track_slug in ('retomada', 'fundacao', 'crescimento', 'expertise')),
  raw_answers jsonb not null default '{}',
  created_at timestamptz not null default now(),

  constraint diagnosis_responses_user_id_key unique (user_id)
);

comment on table public.diagnosis_responses is 'Financial diagnosis responses from onboarding';

-- ============================================================================
-- 4. DAILY_CONTENT (Conteúdo Diário por Trilha)
-- Micro-lessons, actions, and check-ins organized by track and day
-- ============================================================================
create type public.content_type as enum ('micro_lesson', 'quiz', 'practical_action', 'weekly_checkin');

create table public.daily_content (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid not null references public.tracks(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  subtitle text,
  content_type public.content_type not null default 'micro_lesson',
  body jsonb not null default '{}',
  coins_reward integer not null default 10,
  duration_minutes smallint not null default 3,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint daily_content_track_day_type_key unique (track_id, day_number, content_type)
);

comment on table public.daily_content is 'Daily content items organized by track and day number';
comment on column public.daily_content.body is 'Flexible JSON: {blocks: [{type: "text"|"image"|"video", content: "..."}]}';

-- ============================================================================
-- 5. QUIZZES (Quizzes)
-- Quiz definitions linked to content or standalone per track
-- ============================================================================
create table public.quizzes (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid not null references public.tracks(id) on delete cascade,
  content_id uuid references public.daily_content(id) on delete set null,
  title text not null,
  description text,
  coins_reward integer not null default 15,
  created_at timestamptz not null default now()
);

comment on table public.quizzes is 'Quiz definitions, optionally linked to daily content';

-- ============================================================================
-- 6. QUIZ_QUESTIONS (Perguntas de Quiz)
-- Individual questions within a quiz
-- ============================================================================
create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  options jsonb not null default '[]',
  correct_option_index smallint not null,
  explanation text,
  sort_order smallint not null default 0
);

comment on table public.quiz_questions is 'Individual quiz questions';
comment on column public.quiz_questions.options is 'Array of option strings: ["Option A", "Option B", "Option C"]';

-- ============================================================================
-- 7. QUIZ_ATTEMPTS (Tentativas de Quiz)
-- Records each user quiz attempt
-- ============================================================================
create table public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  answers jsonb not null default '[]',
  score smallint not null default 0,
  total_questions smallint not null default 0,
  coins_earned integer not null default 0,
  completed_at timestamptz not null default now()
);

comment on table public.quiz_attempts is 'User quiz attempt records';

-- ============================================================================
-- 8. ACHIEVEMENTS (Conquistas)
-- Achievement definitions per track or global
-- ============================================================================
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid references public.tracks(id) on delete set null,
  slug text unique not null,
  title text not null,
  description text not null,
  icon text not null default '🏆',
  coins_reward integer not null default 0,
  aporte_value_brl numeric(10,2),
  criteria jsonb not null default '{}',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.achievements is 'Achievement definitions. track_id null = global achievement';
comment on column public.achievements.aporte_value_brl is 'Reward as real aporte in BRL (null if none)';
comment on column public.achievements.criteria is 'Machine-readable criteria: {type: "streak", value: 7} or {type: "content_completed", count: 10}';

-- ============================================================================
-- 9. USER_ACHIEVEMENTS (Conquistas Desbloqueadas)
-- ============================================================================
create table public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),

  constraint user_achievements_user_achievement_key unique (user_id, achievement_id)
);

-- ============================================================================
-- 10. USER_STREAKS (Streaks Diários)
-- Tracks daily engagement streaks and multipliers
-- ============================================================================
create table public.user_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  streak_multiplier numeric(3,2) not null default 1.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint user_streaks_user_id_key unique (user_id)
);

comment on table public.user_streaks is 'Daily streak tracking with multiplier bonuses';

-- ============================================================================
-- 11. COINS_LEDGER (Registro de Moedas)
-- Immutable ledger of all coin transactions
-- ============================================================================
create type public.coin_source_type as enum (
  'content_completion',
  'quiz_completion',
  'achievement_unlock',
  'streak_bonus',
  'practical_action',
  'weekly_checkin',
  'referral',
  'conversion_to_aporte',
  'manual_adjustment'
);

create table public.coins_ledger (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  source_type public.coin_source_type not null,
  source_id uuid,
  description text,
  is_convertible boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.coins_ledger is 'Immutable ledger of coin transactions (positive = earn, negative = spend)';

-- ============================================================================
-- 12. USER_CONTENT_PROGRESS (Progresso em Conteúdo)
-- Tracks which content a user has completed
-- ============================================================================
create table public.user_content_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_id uuid not null references public.daily_content(id) on delete cascade,
  coins_earned integer not null default 0,
  completed_at timestamptz not null default now(),

  constraint user_content_progress_user_content_key unique (user_id, content_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_profiles_current_track on public.profiles(current_track_id);
create index idx_daily_content_track on public.daily_content(track_id, day_number);
create index idx_daily_content_published on public.daily_content(is_published) where is_published = true;
create index idx_quizzes_track on public.quizzes(track_id);
create index idx_quizzes_content on public.quizzes(content_id);
create index idx_quiz_questions_quiz on public.quiz_questions(quiz_id, sort_order);
create index idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index idx_achievements_track on public.achievements(track_id);
create index idx_user_achievements_user on public.user_achievements(user_id);
create index idx_coins_ledger_user on public.coins_ledger(user_id, created_at desc);
create index idx_coins_ledger_source on public.coins_ledger(source_type);
create index idx_user_content_progress_user on public.user_content_progress(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Tracks: readable by everyone
alter table public.tracks enable row level security;
create policy "Tracks are viewable by everyone" on public.tracks for select using (true);

-- Profiles: users can read/update their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Diagnosis: users can manage their own
alter table public.diagnosis_responses enable row level security;
create policy "Users can view own diagnosis" on public.diagnosis_responses for select using (auth.uid() = user_id);
create policy "Users can insert own diagnosis" on public.diagnosis_responses for insert with check (auth.uid() = user_id);
create policy "Users can update own diagnosis" on public.diagnosis_responses for update using (auth.uid() = user_id);

-- Daily content: readable by authenticated users
alter table public.daily_content enable row level security;
create policy "Authenticated users can view published content" on public.daily_content for select using (auth.role() = 'authenticated' and is_published = true);

-- Quizzes: readable by authenticated users
alter table public.quizzes enable row level security;
create policy "Authenticated users can view quizzes" on public.quizzes for select using (auth.role() = 'authenticated');

-- Quiz questions: readable by authenticated users
alter table public.quiz_questions enable row level security;
create policy "Authenticated users can view quiz questions" on public.quiz_questions for select using (auth.role() = 'authenticated');

-- Quiz attempts: users manage their own
alter table public.quiz_attempts enable row level security;
create policy "Users can view own quiz attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own quiz attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- Achievements: readable by authenticated users
alter table public.achievements enable row level security;
create policy "Authenticated users can view achievements" on public.achievements for select using (auth.role() = 'authenticated');

-- User achievements: users view their own
alter table public.user_achievements enable row level security;
create policy "Users can view own achievements" on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

-- User streaks: users manage their own
alter table public.user_streaks enable row level security;
create policy "Users can view own streaks" on public.user_streaks for select using (auth.uid() = user_id);
create policy "Users can insert own streaks" on public.user_streaks for insert with check (auth.uid() = user_id);
create policy "Users can update own streaks" on public.user_streaks for update using (auth.uid() = user_id);

-- Coins ledger: users view their own
alter table public.coins_ledger enable row level security;
create policy "Users can view own coins" on public.coins_ledger for select using (auth.uid() = user_id);
create policy "Users can insert own coins" on public.coins_ledger for insert with check (auth.uid() = user_id);

-- User content progress: users manage their own
alter table public.user_content_progress enable row level security;
create policy "Users can view own content progress" on public.user_content_progress for select using (auth.uid() = user_id);
create policy "Users can insert own content progress" on public.user_content_progress for insert with check (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.user_streaks (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger daily_content_updated_at
  before update on public.daily_content
  for each row execute procedure public.handle_updated_at();

create trigger user_streaks_updated_at
  before update on public.user_streaks
  for each row execute procedure public.handle_updated_at();
