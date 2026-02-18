-- ============================================================================
-- Pulso - Tool Unlock System
-- Migration: 00003_tool_unlocks.sql
-- Description: Gamified unlock system for financial calculators/tools.
--              Users unlock tools by spending coins or meeting engagement criteria.
-- ============================================================================

-- Extend coin_source_type to include tool unlock spending
alter type public.coin_source_type add value if not exists 'tool_unlock';

-- ============================================================================
-- 1. USER_TOOL_UNLOCKS
-- Tracks which tools each user has unlocked and how
-- ============================================================================
create table public.user_tool_unlocks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tool_slug text not null,
  unlock_method text not null check (unlock_method in ('free', 'coins', 'criteria')),
  coins_spent integer not null default 0,
  unlocked_at timestamptz not null default now(),

  constraint user_tool_unlocks_user_tool_key unique (user_id, tool_slug)
);

comment on table public.user_tool_unlocks is 'Tracks which financial tools/calculators each user has unlocked';
comment on column public.user_tool_unlocks.tool_slug is 'Identifier for the tool: reserva, dividas, juros';
comment on column public.user_tool_unlocks.unlock_method is 'How the tool was unlocked: free (default), coins (spent coins), criteria (auto-unlocked by engagement)';

-- Index for fast lookup
create index idx_user_tool_unlocks_user on public.user_tool_unlocks(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.user_tool_unlocks enable row level security;

create policy "Users can view own tool unlocks"
  on public.user_tool_unlocks for select using (auth.uid() = user_id);
create policy "Users can insert own tool unlocks"
  on public.user_tool_unlocks for insert with check (auth.uid() = user_id);
