import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CoinsCard } from '@/components/dashboard/coins-card';
import { StreakCard } from '@/components/dashboard/streak-card';
import type { Profile, Track, UserStreak } from '@/lib/types/database';
import { TRACK_CONFIG } from '@/lib/constants';

export default async function PerfilPage() {
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

  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', profile.current_track_id!)
    .single();

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Count total completed content
  const { count: totalCompleted } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const config = track ? TRACK_CONFIG[track.slug as keyof typeof TRACK_CONFIG] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Perfil</h2>
        <p className="text-sm text-gray-400">Suas informações e progresso</p>
      </div>

      {/* User info card */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-xl font-bold text-emerald-400">
            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {profile.full_name || 'Usuário'}
            </h3>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{profile.level}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Nível</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{profile.total_coins}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Moedas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{totalCompleted ?? 0}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Concluídos</p>
          </div>
        </div>
      </div>

      {/* Current track */}
      {config && (
        <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Trilha atual</p>
              <h3 className={`text-lg font-bold ${config.color}`}>{config.name}</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-400">{config.description}</p>
        </div>
      )}

      {/* Streak */}
      <StreakCard streak={streak as UserStreak | null} />

      {/* Coins */}
      <CoinsCard
        profile={profile as unknown as Profile}
        track={track as Track | null}
      />

      {/* Logout - desktop only (mobile has nav) */}
      <div className="hidden sm:block">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-3 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  );
}
