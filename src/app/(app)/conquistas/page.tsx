import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AchievementsList } from '@/components/dashboard/achievements-list';
import type { Achievement } from '@/lib/types/database';

export default async function ConquistasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_track_id, onboarding_completed')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect('/onboarding');
  }

  // Fetch all achievements (track + global)
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

  const unlocked = (achievements ?? []).filter(a => unlockedAchievementIds.has(a.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Conquistas</h2>
        <p className="text-sm text-gray-400">
          {unlocked.length} de {(achievements ?? []).length} desbloqueadas
        </p>
      </div>

      <AchievementsList
        achievements={(achievements ?? []) as unknown as Achievement[]}
        unlockedIds={unlockedAchievementIds}
      />
    </div>
  );
}
