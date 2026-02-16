'use server';

import { createClient } from '@/lib/supabase/server';
import type { TrackSlug } from '@/lib/types/database';

const TRACK_ORDER: TrackSlug[] = ['retomada', 'fundacao', 'crescimento', 'expertise'];

// Minimum percentage of track content that must be completed to advance
const COMPLETION_THRESHOLD = 0.8;

/**
 * Checks if a user qualifies to advance to the next track.
 * Called automatically after content completion.
 *
 * Criteria: User must complete >= 80% of published content in their current track.
 * Progression is: Retomada → Fundação → Crescimento → Expertise
 */
export async function checkTrackProgression(userId: string): Promise<{
  advanced: boolean;
  newTrackSlug?: TrackSlug;
  newTrackName?: string;
  completionPercentage: number;
}> {
  const supabase = await createClient();

  // Get user's current track
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_track_id')
    .eq('id', userId)
    .single();

  if (!profile?.current_track_id) {
    return { advanced: false, completionPercentage: 0 };
  }

  // Get current track info
  const { data: currentTrack } = await supabase
    .from('tracks')
    .select('slug, name')
    .eq('id', profile.current_track_id)
    .single();

  if (!currentTrack) {
    return { advanced: false, completionPercentage: 0 };
  }

  // Already on the final track
  const currentIndex = TRACK_ORDER.indexOf(currentTrack.slug as TrackSlug);
  if (currentIndex === TRACK_ORDER.length - 1) {
    return { advanced: false, completionPercentage: 100 };
  }

  // Count total published content for current track
  const { count: totalContent } = await supabase
    .from('daily_content')
    .select('*', { count: 'exact', head: true })
    .eq('track_id', profile.current_track_id)
    .eq('is_published', true);

  if (!totalContent || totalContent === 0) {
    return { advanced: false, completionPercentage: 0 };
  }

  // Count completed content for current track
  const { data: completedContent } = await supabase
    .from('user_content_progress')
    .select('content_id, daily_content:content_id(track_id)')
    .eq('user_id', userId);

  const completedInTrack = (completedContent ?? []).filter(
    (p: Record<string, unknown>) => {
      const dc = p.daily_content as { track_id: string } | null;
      return dc?.track_id === profile.current_track_id;
    }
  ).length;

  const completionPercentage = Math.round((completedInTrack / totalContent) * 100);

  // Check if threshold is met
  if (completedInTrack / totalContent < COMPLETION_THRESHOLD) {
    return { advanced: false, completionPercentage };
  }

  // Advance to next track
  const nextSlug = TRACK_ORDER[currentIndex + 1];
  const { data: nextTrack } = await supabase
    .from('tracks')
    .select('id, name')
    .eq('slug', nextSlug)
    .single();

  if (!nextTrack) {
    return { advanced: false, completionPercentage };
  }

  // Update profile
  await supabase
    .from('profiles')
    .update({ current_track_id: nextTrack.id })
    .eq('id', userId);

  // Award advancement bonus coins
  const bonusCoins = (currentIndex + 1) * 100; // 100, 200, 300 for each advancement
  await supabase.from('coins_ledger').insert({
    user_id: userId,
    amount: bonusCoins,
    source_type: 'achievement_unlock',
    description: `Avançou para a trilha ${nextTrack.name}!`,
    is_convertible: nextSlug !== 'retomada',
  });

  // Update profile coins
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('total_coins, convertible_coins')
    .eq('id', userId)
    .single();

  if (updatedProfile) {
    await supabase
      .from('profiles')
      .update({
        total_coins: (updatedProfile.total_coins ?? 0) + bonusCoins,
        convertible_coins: nextSlug !== 'retomada'
          ? (updatedProfile.convertible_coins ?? 0) + bonusCoins
          : updatedProfile.convertible_coins ?? 0,
      })
      .eq('id', userId);
  }

  return {
    advanced: true,
    newTrackSlug: nextSlug,
    newTrackName: nextTrack.name,
    completionPercentage: 100,
  };
}

/**
 * Gets the user's overall progress in their current track.
 */
export async function getTrackProgress(userId: string): Promise<{
  completedCount: number;
  totalCount: number;
  percentage: number;
  currentTrackSlug: TrackSlug | null;
  nextTrackSlug: TrackSlug | null;
  threshold: number;
}> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_track_id')
    .eq('id', userId)
    .single();

  if (!profile?.current_track_id) {
    return { completedCount: 0, totalCount: 0, percentage: 0, currentTrackSlug: null, nextTrackSlug: null, threshold: COMPLETION_THRESHOLD * 100 };
  }

  const { data: currentTrack } = await supabase
    .from('tracks')
    .select('slug')
    .eq('id', profile.current_track_id)
    .single();

  const currentSlug = (currentTrack?.slug ?? null) as TrackSlug | null;
  const currentIndex = currentSlug ? TRACK_ORDER.indexOf(currentSlug) : -1;
  const nextTrackSlug = currentIndex < TRACK_ORDER.length - 1 ? TRACK_ORDER[currentIndex + 1] : null;

  const { count: totalCount } = await supabase
    .from('daily_content')
    .select('*', { count: 'exact', head: true })
    .eq('track_id', profile.current_track_id)
    .eq('is_published', true);

  const { data: completedContent } = await supabase
    .from('user_content_progress')
    .select('content_id, daily_content:content_id(track_id)')
    .eq('user_id', userId);

  const completedCount = (completedContent ?? []).filter(
    (p: Record<string, unknown>) => {
      const dc = p.daily_content as { track_id: string } | null;
      return dc?.track_id === profile.current_track_id;
    }
  ).length;

  const total = totalCount ?? 0;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completedCount,
    totalCount: total,
    percentage,
    currentTrackSlug: currentSlug,
    nextTrackSlug,
    threshold: COMPLETION_THRESHOLD * 100,
  };
}
