'use server';

import { createClient } from '@/lib/supabase/server';
import { TOOLS_CONFIG, TOOLS_ORDER } from '@/lib/constants';
import type { ToolSlug } from '@/lib/types/database';

export interface ToolUnlockStatus {
  slug: ToolSlug;
  unlocked: boolean;
  unlockMethod: string | null;
  unlockedAt: string | null;
  // Progress toward auto-unlock criteria
  criteriaProgress: number | null;   // current value
  criteriaTarget: number | null;     // target value
  criteriaPercent: number | null;    // 0-100
  canAfford: boolean;
}

/**
 * Get unlock status for all tools for the current user.
 * Also checks if auto-unlock criteria are met and unlocks automatically.
 */
export async function getToolUnlockStatuses(): Promise<ToolUnlockStatus[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Fetch existing unlocks
  const { data: unlocks } = await supabase
    .from('user_tool_unlocks')
    .select('*')
    .eq('user_id', user.id);

  const unlockedMap = new Map(
    (unlocks ?? []).map(u => [u.tool_slug, u])
  );

  // Fetch user data for criteria checks
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_coins')
    .eq('id', user.id)
    .single();

  const { count: contentCount } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .single();

  const totalCoins = profile?.total_coins ?? 0;
  const completedContent = contentCount ?? 0;
  const currentStreak = streak?.current_streak ?? 0;

  const statuses: ToolUnlockStatus[] = [];

  for (const slug of TOOLS_ORDER) {
    const config = TOOLS_CONFIG[slug];
    const existing = unlockedMap.get(slug);

    // Already unlocked
    if (existing) {
      statuses.push({
        slug,
        unlocked: true,
        unlockMethod: existing.unlock_method,
        unlockedAt: existing.unlocked_at,
        criteriaProgress: null,
        criteriaTarget: null,
        criteriaPercent: null,
        canAfford: true,
      });
      continue;
    }

    // Free tools - auto-unlock
    if (config.isFree) {
      await supabase.from('user_tool_unlocks').insert({
        user_id: user.id,
        tool_slug: slug,
        unlock_method: 'free',
        coins_spent: 0,
      });

      statuses.push({
        slug,
        unlocked: true,
        unlockMethod: 'free',
        unlockedAt: new Date().toISOString(),
        criteriaProgress: null,
        criteriaTarget: null,
        criteriaPercent: null,
        canAfford: true,
      });
      continue;
    }

    // Check auto-unlock criteria
    let criteriaProgress = 0;
    let criteriaTarget = 0;

    if (config.autoUnlockCriteria) {
      criteriaTarget = config.autoUnlockCriteria.value;

      if (config.autoUnlockCriteria.type === 'content_count') {
        criteriaProgress = completedContent;
      } else if (config.autoUnlockCriteria.type === 'streak_days') {
        criteriaProgress = currentStreak;
      }

      // Auto-unlock if criteria met
      if (criteriaProgress >= criteriaTarget) {
        await supabase.from('user_tool_unlocks').insert({
          user_id: user.id,
          tool_slug: slug,
          unlock_method: 'criteria',
          coins_spent: 0,
        });

        statuses.push({
          slug,
          unlocked: true,
          unlockMethod: 'criteria',
          unlockedAt: new Date().toISOString(),
          criteriaProgress,
          criteriaTarget,
          criteriaPercent: 100,
          canAfford: true,
        });
        continue;
      }
    }

    // Not unlocked yet
    statuses.push({
      slug,
      unlocked: false,
      unlockMethod: null,
      unlockedAt: null,
      criteriaProgress: criteriaTarget > 0 ? criteriaProgress : null,
      criteriaTarget: criteriaTarget > 0 ? criteriaTarget : null,
      criteriaPercent: criteriaTarget > 0
        ? Math.min(100, Math.round((criteriaProgress / criteriaTarget) * 100))
        : null,
      canAfford: totalCoins >= config.coinsCost,
    });
  }

  return statuses;
}

/**
 * Unlock a tool by spending coins.
 * Returns success/failure and updated coin balance.
 */
export async function unlockToolWithCoins(toolSlug: ToolSlug): Promise<{
  success: boolean;
  error?: string;
  newCoinBalance?: number;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Nao autenticado' };
  }

  const config = TOOLS_CONFIG[toolSlug];
  if (!config) {
    return { success: false, error: 'Ferramenta nao encontrada' };
  }

  if (config.isFree) {
    return { success: false, error: 'Esta ferramenta ja e gratuita' };
  }

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('user_tool_unlocks')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_slug', toolSlug)
    .single();

  if (existing) {
    return { success: false, error: 'Ferramenta ja desbloqueada' };
  }

  // Check coin balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_coins')
    .eq('id', user.id)
    .single();

  if (!profile || profile.total_coins < config.coinsCost) {
    return { success: false, error: 'Moedas insuficientes' };
  }

  // Deduct coins
  const newBalance = profile.total_coins - config.coinsCost;
  await supabase
    .from('profiles')
    .update({ total_coins: newBalance })
    .eq('id', user.id);

  // Record in coins ledger (negative amount = spend)
  await supabase.from('coins_ledger').insert({
    user_id: user.id,
    amount: -config.coinsCost,
    source_type: 'tool_unlock',
    description: `Desbloqueio: ${config.name}`,
    is_convertible: false,
  });

  // Record unlock
  await supabase.from('user_tool_unlocks').insert({
    user_id: user.id,
    tool_slug: toolSlug,
    unlock_method: 'coins',
    coins_spent: config.coinsCost,
  });

  return { success: true, newCoinBalance: newBalance };
}
