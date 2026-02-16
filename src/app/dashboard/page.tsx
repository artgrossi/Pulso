import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StreakCard } from '@/components/dashboard/streak-card';
import { CoinsCard } from '@/components/dashboard/coins-card';
import { TrackCard } from '@/components/dashboard/track-card';
import { DailyContentList } from '@/components/dashboard/daily-content-list';
import { AchievementsList } from '@/components/dashboard/achievements-list';
import type { Track, DailyContent, UserStreak, Achievement } from '@/lib/types/database';
import { getTrackProgress } from '@/lib/actions/track-progression';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/');
  }

  if (!profile.onboarding_completed) {
    redirect('/onboarding');
  }

  // Fetch current track
  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', profile.current_track_id!)
    .single();

  // Fetch user streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch today's content for the user's track
  // For now, determine "day" based on content progress count + 1
  const { count: completedCount } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const currentDay = Math.floor((completedCount ?? 0) / 2) + 1; // ~2 contents per day

  const { data: todayContent } = await supabase
    .from('daily_content')
    .select('*')
    .eq('track_id', profile.current_track_id!)
    .eq('day_number', currentDay)
    .eq('is_published', true)
    .order('content_type');

  // Fetch completed content IDs
  const { data: completedProgress } = await supabase
    .from('user_content_progress')
    .select('content_id')
    .eq('user_id', user.id);

  const completedIds = new Set(
    (completedProgress ?? []).map(p => p.content_id)
  );

  // Fetch achievements for user's track + global
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .or(`track_id.eq.${profile.current_track_id},track_id.is.null`)
    .order('sort_order');

  // Fetch user's unlocked achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id);

  const unlockedAchievementIds = new Set(
    (userAchievements ?? []).map(ua => ua.achievement_id)
  );

  // Fetch overall track progress
  const trackProgress = await getTrackProgress(user.id);

  // Calculate today's progress
  const todayContentIds = (todayContent ?? []).map(c => c.id);
  const todayCompleted = todayContentIds.filter(id => completedIds.has(id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Pulso
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              <span>🪙</span>
              <span className="font-semibold">{profile.total_coins}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* Greeting */}
          <div>
            <h2 className="text-xl font-bold">
              Olá{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
            </h2>
            <p className="text-sm text-gray-400">
              Continue sua jornada de bem-estar financeiro.
            </p>
          </div>

          {/* Track + Streak row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {track && (
              <TrackCard
                track={track as Track}
                contentCompletedToday={todayCompleted}
                totalContentToday={todayContentIds.length}
                overallProgress={trackProgress}
              />
            )}
            <StreakCard streak={streak as UserStreak | null} />
          </div>

          {/* Coins */}
          <CoinsCard
            profile={profile as unknown as import('@/lib/types/database').Profile}
            track={track as Track | null}
          />

          {/* Daily Content */}
          <DailyContentList
            contents={(todayContent ?? []) as unknown as DailyContent[]}
            completedIds={completedIds}
          />

          {/* Achievements */}
          <AchievementsList
            achievements={(achievements ?? []) as unknown as Achievement[]}
            unlockedIds={unlockedAchievementIds}
          />
        </div>
      </main>
    </div>
  );
}
