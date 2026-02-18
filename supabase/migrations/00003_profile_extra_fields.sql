-- ============================================================================
-- Pulso - Profile Extra Fields
-- Migration: 00003_profile_extra_fields.sql
-- Description: Adds birth_date and income_range to profiles for richer user data
-- ============================================================================

-- Income range enum
create type public.income_range as enum (
  'ate_2k',
  '2k_5k',
  '5k_10k',
  '10k_20k',
  'acima_20k',
  'prefiro_nao_dizer'
);

-- Add new columns to profiles
alter table public.profiles
  add column birth_date date,
  add column income_range public.income_range;

comment on column public.profiles.birth_date is 'User date of birth for personalization';
comment on column public.profiles.income_range is 'Self-reported income range for financial context';
