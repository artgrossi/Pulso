import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StreakCard } from '@/components/dashboard/streak-card';
import { CoinsCard } from '@/components/dashboard/coins-card';
import { TrackCard } from '@/components/dashboard/track-card';
import { DailyContentList } from '@/components/dashboard/daily-content-list';
import { AchievementsList } from '@/components/dashboard/achievements-list';
import { WeeklySummary } from '@/components/dashboard/weekly-summary';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { QuizCard } from '@/components/dashboard/quiz-card';
import type { Track, DailyContent, UserStreak, Achievement } from '@/lib/types/database';
import { getTrackProgress } from '@/lib/actions/track-progression';
import { DashboardIntents } from '@/components/metas/dashboard-intents';
import Logo from '@/components/branding/Logo';
import { Icon } from '@/components/ui/Icon';

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

  // Fetch quizzes for current track
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('track_id', profile.current_track_id!);

  // Fetch quiz questions for each quiz
  const quizIds = (quizzes ?? []).map(q => q.id);
  const { data: quizQuestions } = quizIds.length > 0
    ? await supabase
        .from('quiz_questions')
        .select('*')
        .in('quiz_id', quizIds)
        .order('sort_order')
    : { data: [] };

  // Fetch user's quiz attempts
  const { data: quizAttempts } = quizIds.length > 0
    ? await supabase
        .from('quiz_attempts')
        .select('quiz_id')
        .eq('user_id', user.id)
        .in('quiz_id', quizIds)
    : { data: [] };

  const attemptedQuizIds = new Set((quizAttempts ?? []).map(a => a.quiz_id));

  // Fetch overall track progress
  const trackProgress = await getTrackProgress(user.id);

  // Calculate today's progress
  const todayContentIds = (todayContent ?? []).map(c => c.id);
  const todayCompleted = todayContentIds.filter(id => completedIds.has(id)).length;

  // Fetch recent coin activity for weekly summary
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentCoins } = await supabase
    .from('coins_ledger')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  const weeklyCoins = (recentCoins ?? []).reduce((sum, entry) => sum + entry.amount, 0);
  const weeklyActivities = (recentCoins ?? []).length;

  return (
    <>
      {/* Header */}
      <header className="border-b border-pulso-border-subtle bg-pulso-elevated/80 backdrop-blur-md sticky top-0 z-40 animate-slide-down">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Logo variant="full" size="sm" animated />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600">
              <Icon name="coin" size={14} />
              <span className="font-semibold">{profile.total_coins}</span>
            </div>
            {streak && (streak as UserStreak).current_streak > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500">
                <Icon name="flame" size={14} />
                <span className="font-semibold">{(streak as UserStreak).current_streak}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
        <div className="space-y-6">
          {/* Greeting */}
          <div>
            <h2 className="text-xl font-bold text-pulso-text">
              Ola{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-sm text-pulso-text-secondary">
              Continue sua jornada de bem-estar financeiro.
            </p>
          </div>

          {/* Weekly Summary */}
          <WeeklySummary
            weeklyCoins={weeklyCoins}
            weeklyActivities={weeklyActivities}
            currentStreak={(streak as UserStreak | null)?.current_streak ?? 0}
            totalCoins={profile.total_coins}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Active Intents */}
          <DashboardIntents />

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

          {/* Daily Content */}
          <DailyContentList
            contents={(todayContent ?? []) as unknown as DailyContent[]}
            completedIds={completedIds}
          />

          {/* Quizzes */}
          {(quizzes ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
                Quizzes Disponiveis
              </h3>
              {(quizzes ?? []).map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quizId={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  questions={(quizQuestions ?? []).filter(q => q.quiz_id === quiz.id)}
                  coinsReward={quiz.coins_reward}
                  alreadyAttempted={attemptedQuizIds.has(quiz.id)}
                />
              ))}
            </div>
          )}

          {/* Achievements */}
          <AchievementsList
            achievements={(achievements ?? []) as unknown as Achievement[]}
            unlockedIds={unlockedAchievementIds}
          />
        </div>
      </main>
    </>
  );
}
