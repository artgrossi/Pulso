'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  UserIntent,
  IntentProgress,
  IntentMilestone,
  IntentWithProgress,
  CreateIntentInput,
  UpdateIntentProgressInput,
  MilestoneType,
} from '@/lib/types/database';

// ============================================================================
// Default milestone definitions per intent
// ============================================================================

const DEFAULT_MILESTONES: {
  type: MilestoneType;
  name: string;
  target_progress: number;
  coins_reward: number;
}[] = [
  { type: 'day_3', name: '3 dias de foco', target_progress: 0, coins_reward: 10 },
  { type: 'week_1', name: '1 semana firme', target_progress: 0, coins_reward: 25 },
  { type: 'halfway', name: 'Metade do caminho', target_progress: 50, coins_reward: 50 },
  { type: 'day_21', name: 'Habito formado (21 dias)', target_progress: 0, coins_reward: 75 },
  { type: 'completed', name: 'Meta alcancada!', target_progress: 100, coins_reward: 100 },
];

// ============================================================================
// Create Intent
// ============================================================================

export async function createIntent(data: CreateIntentInput): Promise<UserIntent> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: intent, error } = await supabase
    .from('user_intents')
    .insert({
      user_id: user.id,
      track_id: data.track_id ?? null,
      title: data.title,
      description: data.description ?? null,
      intent_type: data.intent_type,
      period_type: data.period_type,
      target_value: data.target_value,
      target_metric: data.target_metric,
      target_category: data.target_category ?? null,
      start_date: data.start_date ?? new Date().toISOString().split('T')[0],
      end_date: data.end_date,
    })
    .select()
    .single();

  if (error || !intent) {
    throw new Error(`Failed to create intent: ${error?.message}`);
  }

  // Create default milestones for this intent
  const totalDays = Math.ceil(
    (new Date(intent.end_date).getTime() - new Date(intent.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const milestones = DEFAULT_MILESTONES
    .filter((m) => {
      // Only include day-based milestones if the intent is long enough
      if (m.type === 'day_3') return totalDays >= 3;
      if (m.type === 'week_1') return totalDays >= 7;
      if (m.type === 'day_21') return totalDays >= 21;
      return true;
    })
    .map((m) => ({
      intent_id: intent.id,
      milestone_type: m.type,
      milestone_name: m.name,
      target_progress: m.target_progress,
      coins_reward: m.coins_reward,
    }));

  if (milestones.length > 0) {
    await supabase.from('intent_milestones').insert(milestones);
  }

  return intent as UserIntent;
}

// ============================================================================
// Get Active Intents (with progress and milestones)
// ============================================================================

export async function getActiveIntents(): Promise<IntentWithProgress[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Fetch active intents
  const { data: rawIntents, error } = await supabase
    .from('user_intents')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch intents: ${error.message}`);
  }

  const intents = (rawIntents ?? []) as UserIntent[];
  if (intents.length === 0) {
    return [];
  }

  const intentIds = intents.map((i) => i.id);

  // Fetch progress and milestones for all active intents in parallel
  const [progressResult, milestonesResult] = await Promise.all([
    supabase
      .from('intent_progress')
      .select('*')
      .in('intent_id', intentIds)
      .order('tracked_date', { ascending: false }),
    supabase
      .from('intent_milestones')
      .select('*')
      .in('intent_id', intentIds)
      .order('created_at', { ascending: true }),
  ]);

  const progressByIntent = new Map<string, IntentProgress[]>();
  for (const p of (progressResult.data ?? []) as IntentProgress[]) {
    const list = progressByIntent.get(p.intent_id) ?? [];
    list.push(p);
    progressByIntent.set(p.intent_id, list);
  }

  const milestonesByIntent = new Map<string, IntentMilestone[]>();
  for (const m of (milestonesResult.data ?? []) as IntentMilestone[]) {
    const list = milestonesByIntent.get(m.intent_id) ?? [];
    list.push(m);
    milestonesByIntent.set(m.intent_id, list);
  }

  const today = new Date();

  return intents.map((intent) => {
    const progress = progressByIntent.get(intent.id) ?? [];
    const milestones = milestonesByIntent.get(intent.id) ?? [];

    const { current, percentage } = calculateIntentProgress(intent, progress);

    const endDate = new Date(intent.end_date);
    const startDate = new Date(intent.start_date);
    const days_remaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const days_elapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      ...intent,
      progress,
      milestones,
      current_progress: current,
      progress_percentage: percentage,
      days_remaining,
      days_elapsed,
    };
  });
}

// ============================================================================
// Get Intent by ID (with progress and milestones)
// ============================================================================

export async function getIntent(intentId: string): Promise<IntentWithProgress | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: intent } = await supabase
    .from('user_intents')
    .select('*')
    .eq('id', intentId)
    .eq('user_id', user.id)
    .single();

  if (!intent) return null;

  const [progressResult, milestonesResult] = await Promise.all([
    supabase
      .from('intent_progress')
      .select('*')
      .eq('intent_id', intentId)
      .order('tracked_date', { ascending: false }),
    supabase
      .from('intent_milestones')
      .select('*')
      .eq('intent_id', intentId)
      .order('created_at', { ascending: true }),
  ]);

  const progress = (progressResult.data ?? []) as IntentProgress[];
  const milestones = (milestonesResult.data ?? []) as IntentMilestone[];

  const { current, percentage } = calculateIntentProgress(intent as UserIntent, progress);

  const today = new Date();
  const endDate = new Date(intent.end_date);
  const startDate = new Date(intent.start_date);
  const days_remaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const days_elapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    ...(intent as UserIntent),
    progress,
    milestones,
    current_progress: current,
    progress_percentage: percentage,
    days_remaining,
    days_elapsed,
  };
}

// ============================================================================
// Update Intent Progress
// ============================================================================

export async function updateIntentProgress(
  intentId: string,
  data: UpdateIntentProgressInput,
): Promise<IntentProgress> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Verify intent belongs to user
  const { data: intent } = await supabase
    .from('user_intents')
    .select('*')
    .eq('id', intentId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (!intent) {
    throw new Error('Intent not found or not active');
  }

  const today = new Date().toISOString().split('T')[0];

  // Upsert progress for today (update if already exists)
  const { data: progress, error } = await supabase
    .from('intent_progress')
    .upsert(
      {
        intent_id: intentId,
        tracked_date: today,
        actual_value: data.actual_value,
        data_point_count: data.data_point_count ?? 1,
        validation_source: data.validation_source ?? 'manual',
        notes: data.notes ?? null,
        status: determineProgressStatus(intent as UserIntent, data.actual_value),
      },
      { onConflict: 'intent_id,tracked_date' },
    )
    .select()
    .single();

  if (error || !progress) {
    throw new Error(`Failed to update progress: ${error?.message}`);
  }

  // Check and award milestones
  await checkAndAwardMilestones(intentId, user.id);

  return progress as IntentProgress;
}

// ============================================================================
// Update Intent Status
// ============================================================================

export async function updateIntentStatus(
  intentId: string,
  status: 'paused' | 'completed' | 'abandoned',
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('user_intents')
    .update({ status })
    .eq('id', intentId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to update intent status: ${error.message}`);
  }

  // If completing, award any remaining milestones
  if (status === 'completed') {
    await checkAndAwardMilestones(intentId, user.id);
  }
}

// ============================================================================
// Pure calculation functions
// ============================================================================

function calculateIntentProgress(
  intent: UserIntent,
  progress: IntentProgress[],
): { current: number; percentage: number } {
  if (progress.length === 0) {
    return { current: 0, percentage: 0 };
  }

  // Sum all progress values
  const current = progress.reduce((sum, p) => sum + Number(p.actual_value), 0);
  const percentage = Math.min(100, Math.round((current / Number(intent.target_value)) * 100));

  return { current, percentage };
}

function determineProgressStatus(
  intent: UserIntent,
  todayValue: number,
): 'on_track' | 'behind' | 'exceeded' {
  const today = new Date();
  const startDate = new Date(intent.start_date);
  const endDate = new Date(intent.end_date);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Expected daily pace
  const dailyTarget = Number(intent.target_value) / totalDays;
  const expectedByNow = dailyTarget * daysElapsed;

  if (todayValue >= expectedByNow * 1.1) return 'exceeded';
  if (todayValue < expectedByNow * 0.8) return 'behind';
  return 'on_track';
}

// ============================================================================
// Milestone checking and reward awarding
// ============================================================================

async function checkAndAwardMilestones(
  intentId: string,
  userId: string,
): Promise<IntentMilestone[]> {
  const supabase = await createClient();

  // Get intent with all progress and unachieved milestones
  const [intentResult, progressResult, milestonesResult] = await Promise.all([
    supabase.from('user_intents').select('*').eq('id', intentId).single(),
    supabase.from('intent_progress').select('*').eq('intent_id', intentId),
    supabase.from('intent_milestones').select('*').eq('intent_id', intentId).eq('is_achieved', false),
  ]);

  const intent = intentResult.data as UserIntent | null;
  const progress = (progressResult.data ?? []) as IntentProgress[];
  const pendingMilestones = (milestonesResult.data ?? []) as IntentMilestone[];

  if (!intent || pendingMilestones.length === 0) return [];

  const { percentage } = calculateIntentProgress(intent, progress);
  const daysActive = progress.length; // Number of days with entries
  const now = new Date().toISOString();
  const newlyAchieved: IntentMilestone[] = [];

  for (const milestone of pendingMilestones) {
    let achieved = false;

    switch (milestone.milestone_type) {
      case 'day_3':
        achieved = daysActive >= 3;
        break;
      case 'week_1':
        achieved = daysActive >= 7;
        break;
      case 'day_21':
        achieved = daysActive >= 21;
        break;
      case 'halfway':
        achieved = percentage >= 50;
        break;
      case 'completed':
        achieved = percentage >= 100;
        break;
    }

    if (achieved) {
      // Mark milestone as achieved
      await supabase
        .from('intent_milestones')
        .update({ is_achieved: true, achieved_at: now })
        .eq('id', milestone.id);

      // Award coins via coins_ledger
      if (milestone.coins_reward > 0) {
        await supabase.from('coins_ledger').insert({
          user_id: userId,
          amount: milestone.coins_reward,
          source_type: 'intent_milestone',
          source_id: milestone.id,
          description: `Marco alcancado: ${milestone.milestone_name}`,
          is_convertible: true,
        });

        // Update profile coins
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_coins, convertible_coins')
          .eq('id', userId)
          .single();

        if (profile) {
          await supabase.from('profiles').update({
            total_coins: (profile.total_coins ?? 0) + milestone.coins_reward,
            convertible_coins: (profile.convertible_coins ?? 0) + milestone.coins_reward,
          }).eq('id', userId);
        }
      }

      // Unlock linked achievement if any
      if (milestone.achievement_id) {
        await supabase.from('user_achievements').upsert(
          {
            user_id: userId,
            achievement_id: milestone.achievement_id,
          },
          { onConflict: 'user_id,achievement_id' },
        );
      }

      newlyAchieved.push({ ...milestone, is_achieved: true, achieved_at: now });
    }
  }

  // If 100% reached, auto-complete the intent
  if (percentage >= 100 && intent.status === 'active') {
    await supabase
      .from('user_intents')
      .update({ status: 'completed' })
      .eq('id', intentId);
  }

  return newlyAchieved;
}
