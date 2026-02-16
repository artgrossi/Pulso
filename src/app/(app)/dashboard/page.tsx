import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StreakCard } from '@/components/dashboard/streak-card';
import { CoinsCard } from '@/components/dashboard/coins-card';
import { TrackCard } from '@/components/dashboard/track-card';
import { DailyContentList } from '@/components/dashboard/daily-content-list';
import { AchievementsList } from '@/components/dashboard/achievements-list';
import type { Track, DailyContent, UserStreak, Achievement } from '@/lib/types/database';

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
  const { count: completedCount } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const currentDay = Math.floor((completedCount ?? 0) / 2) + 1;

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

  // Calculate today's progress
  const todayContentIds = (todayContent ?? []).map(c => c.id);
  const todayCompleted = todayContentIds.filter(id => completedIds.has(id)).length;

  return (
    <div className="stagger-children space-y-6">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <h2 className="text-xl font-bold">
          Olá{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
        </h2>
        <p className="text-sm text-gray-400">
          Continue sua jornada de bem-estar financeiro.
        </p>
      </div>

      {/* Track + Streak row */}
      <div className="animate-fade-in-up grid grid-cols-1 gap-4 sm:grid-cols-2">
        {track && (
          <TrackCard
            track={track as Track}
            contentCompletedToday={todayCompleted}
            totalContentToday={todayContentIds.length}
          />
        )}
        <StreakCard streak={streak as UserStreak | null} />
      </div>

      {/* Coins */}
      <div className="animate-fade-in-up">
        <CoinsCard
          profile={profile as unknown as import('@/lib/types/database').Profile}
          track={track as Track | null}
        />
      </div>

      {/* Daily Content */}
      <div className="animate-fade-in-up">
        <DailyContentList
          contents={(todayContent ?? []) as unknown as DailyContent[]}
          completedIds={completedIds}
        />
      </div>

      {/* Achievements */}
      <div className="animate-fade-in-up">
        <AchievementsList
          achievements={(achievements ?? []) as unknown as Achievement[]}
          unlockedIds={unlockedAchievementIds}
        />
      </div>
    </div>
  );
}
