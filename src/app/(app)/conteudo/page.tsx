import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DailyContentList } from '@/components/dashboard/daily-content-list';
import { TrackCard } from '@/components/dashboard/track-card';
import type { Track, DailyContent } from '@/lib/types/database';

export default async function ConteudoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect('/onboarding');
  }

  // Fetch current track
  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', profile.current_track_id!)
    .single();

  // Determine current day
  const { count: completedCount } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const currentDay = Math.floor((completedCount ?? 0) / 2) + 1;

  // Fetch content for current day
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

  const todayContentIds = (todayContent ?? []).map(c => c.id);
  const todayCompleted = todayContentIds.filter(id => completedIds.has(id)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Conteúdo</h2>
        <p className="text-sm text-gray-400">Dia {currentDay} da sua jornada</p>
      </div>

      {track && (
        <TrackCard
          track={track as Track}
          contentCompletedToday={todayCompleted}
          totalContentToday={todayContentIds.length}
        />
      )}

      <DailyContentList
        contents={(todayContent ?? []) as unknown as DailyContent[]}
        completedIds={completedIds}
      />
    </div>
  );
}
