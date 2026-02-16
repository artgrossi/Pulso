// ============================================================================
// Pulso - Database Types
// Auto-generated from Supabase schema. Keep in sync with migrations.
// ============================================================================

export type TrackSlug = 'retomada' | 'fundacao' | 'crescimento' | 'expertise';

export type ContentType = 'micro_lesson' | 'quiz' | 'practical_action' | 'weekly_checkin';

export type CoinSourceType =
  | 'content_completion'
  | 'quiz_completion'
  | 'achievement_unlock'
  | 'streak_bonus'
  | 'practical_action'
  | 'weekly_checkin'
  | 'referral'
  | 'conversion_to_aporte'
  | 'manual_adjustment';

// ============================================================================
// Table Row Types
// ============================================================================

export interface Track {
  id: string;
  slug: TrackSlug;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
  coins_convertible: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  current_track_id: string | null;
  onboarding_completed: boolean;
  total_coins: number;
  convertible_coins: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface DiagnosisResponse {
  id: string;
  user_id: string;
  has_overdue_debt: boolean | null;
  can_save_monthly: boolean | null;
  has_emergency_fund: boolean | null;
  knows_retirement_target: boolean | null;
  understands_pgbl_vgbl: boolean | null;
  assigned_track_slug: TrackSlug;
  raw_answers: Record<string, unknown>;
  created_at: string;
}

export interface DailyContent {
  id: string;
  track_id: string;
  day_number: number;
  title: string;
  subtitle: string | null;
  content_type: ContentType;
  body: ContentBody;
  coins_reward: number;
  duration_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBody {
  blocks: ContentBlock[];
}

export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'tip' | 'warning';
  content: string;
}

export interface Quiz {
  id: string;
  track_id: string;
  content_id: string | null;
  title: string;
  description: string | null;
  coins_reward: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string | null;
  sort_order: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: number[];
  score: number;
  total_questions: number;
  coins_earned: number;
  completed_at: string;
}

export interface Achievement {
  id: string;
  track_id: string | null;
  slug: string;
  title: string;
  description: string;
  icon: string;
  coins_reward: number;
  aporte_value_brl: number | null;
  criteria: AchievementCriteria;
  sort_order: number;
  created_at: string;
}

export interface AchievementCriteria {
  type: 'streak' | 'content_completed' | 'quiz_score' | 'coins_earned' | 'track_completed' | 'custom';
  value?: number;
  description?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface CoinLedgerEntry {
  id: string;
  user_id: string;
  amount: number;
  source_type: CoinSourceType;
  source_id: string | null;
  description: string | null;
  is_convertible: boolean;
  created_at: string;
}

export interface UserContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  coins_earned: number;
  completed_at: string;
}

// ============================================================================
// Composite / View Types (for queries with joins)
// ============================================================================

export interface ProfileWithTrack extends Profile {
  track: Track | null;
}

export interface DailyContentWithQuiz extends DailyContent {
  quiz: Quiz | null;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface UserDashboard {
  profile: ProfileWithTrack;
  streak: UserStreak;
  todayContent: DailyContent[];
  recentCoins: CoinLedgerEntry[];
  achievements: AchievementWithStatus[];
}

// ============================================================================
// Diagnosis Flow Types
// ============================================================================

export interface DiagnosisQuestion {
  id: string;
  question: string;
  field: keyof Pick<
    DiagnosisResponse,
    'has_overdue_debt' | 'can_save_monthly' | 'has_emergency_fund' | 'knows_retirement_target' | 'understands_pgbl_vgbl'
  >;
  yes_label: string;
  no_label: string;
}

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: '1',
    question: 'Você tem alguma dívida em atraso hoje?',
    field: 'has_overdue_debt',
    yes_label: 'Sim, tenho',
    no_label: 'Não tenho',
  },
  {
    id: '2',
    question: 'Você consegue guardar algum valor todo mês?',
    field: 'can_save_monthly',
    yes_label: 'Sim, consigo',
    no_label: 'Não consigo',
  },
  {
    id: '3',
    question: 'Você tem uma reserva para emergências?',
    field: 'has_emergency_fund',
    yes_label: 'Sim, tenho',
    no_label: 'Não tenho',
  },
  {
    id: '4',
    question: 'Você sabe quanto precisa para se aposentar com conforto?',
    field: 'knows_retirement_target',
    yes_label: 'Sim, sei',
    no_label: 'Não sei',
  },
  {
    id: '5',
    question: 'Você entende a diferença entre PGBL e VGBL?',
    field: 'understands_pgbl_vgbl',
    yes_label: 'Sim, entendo',
    no_label: 'Não entendo',
  },
];

// ============================================================================
// Track assignment logic
// ============================================================================

export function assignTrack(answers: {
  has_overdue_debt: boolean;
  can_save_monthly: boolean;
  has_emergency_fund: boolean;
  knows_retirement_target: boolean;
  understands_pgbl_vgbl: boolean;
}): TrackSlug {
  // Debt overrides everything
  if (answers.has_overdue_debt) return 'retomada';

  // Can't save or no emergency fund = still building foundation
  if (!answers.can_save_monthly || !answers.has_emergency_fund) return 'fundacao';

  // Saves and has fund, but doesn't know retirement/products
  if (!answers.knows_retirement_target || !answers.understands_pgbl_vgbl) return 'crescimento';

  // Knows everything = expert
  return 'expertise';
}
