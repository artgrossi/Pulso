import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TRACK_CONFIG } from '@/lib/constants';
import type { TrackSlug, CoinLedgerEntry } from '@/lib/types/database';
import { ProfileActions } from '@/components/perfil/profile-actions';
import { CoinHistory } from '@/components/perfil/coin-history';

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

  if (!profile) {
    redirect('/');
  }

  // Fetch track info
  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', profile.current_track_id!)
    .single();

  // Fetch streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch completed content count
  const { count: completedCount } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch total content count in current track
  const { count: trackContentCount } = await supabase
    .from('daily_content')
    .select('*', { count: 'exact', head: true })
    .eq('track_id', profile.current_track_id!)
    .eq('is_published', true);

  // Fetch achievements counts
  const { count: totalAchievements } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true });

  const { count: unlockedAchievements } = await supabase
    .from('user_achievements')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch recent coin history
  const { data: coinHistory } = await supabase
    .from('coins_ledger')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch diagnosis
  const { data: diagnosis } = await supabase
    .from('diagnosis_responses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const trackSlug = track?.slug as TrackSlug | undefined;
  const trackConfig = trackSlug ? TRACK_CONFIG[trackSlug] : null;

  const memberSince = new Date(profile.created_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <>
      <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Perfil
            </span>
          </h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-800 hover:text-red-400"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* Profile card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-2xl font-bold text-white">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.full_name || 'Usuario'}</h2>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-600">Membro desde {memberSince}</p>
              </div>
            </div>

            {/* Track badge */}
            {trackConfig && (
              <div className={`mt-4 inline-flex items-center gap-2 rounded-full ${trackConfig.bgColor} ${trackConfig.borderColor} border px-3 py-1.5`}>
                <span>{trackConfig.icon}</span>
                <span className={`text-sm font-medium ${trackConfig.color}`}>Trilha {trackConfig.name}</span>
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Moedas" value={profile.total_coins.toString()} icon="🪙" color="text-amber-400" />
            <StatCard label="Nivel" value={profile.level.toString()} icon="⭐" color="text-purple-400" />
            <StatCard label="Streak" value={`${streak?.current_streak ?? 0}d`} icon="🔥" color="text-orange-400" />
            <StatCard label="Recorde" value={`${streak?.longest_streak ?? 0}d`} icon="🏆" color="text-yellow-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              label="Conteudos"
              value={`${completedCount ?? 0}/${trackContentCount ?? 0}`}
              icon="📚"
              color="text-blue-400"
            />
            <StatCard
              label="Conquistas"
              value={`${unlockedAchievements ?? 0}/${totalAchievements ?? 0}`}
              icon="🏅"
              color="text-emerald-400"
            />
            <StatCard
              label="Conversiveis"
              value={`R$${profile.convertible_coins}`}
              icon="💰"
              color="text-green-400"
            />
          </div>

          {/* Diagnosis summary */}
          {diagnosis && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Seu Diagnostico Financeiro
              </h3>
              <div className="space-y-2">
                <DiagnosisItem label="Dividas em atraso" value={diagnosis.has_overdue_debt} />
                <DiagnosisItem label="Consegue poupar" value={diagnosis.can_save_monthly} positive />
                <DiagnosisItem label="Reserva de emergencia" value={diagnosis.has_emergency_fund} positive />
                <DiagnosisItem label="Sabe meta de aposentadoria" value={diagnosis.knows_retirement_target} positive />
                <DiagnosisItem label="Entende PGBL/VGBL" value={diagnosis.understands_pgbl_vgbl} positive />
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Trilha atribuida: {trackConfig?.name ?? diagnosis.assigned_track_slug}
              </p>
            </div>
          )}

          {/* Coin History */}
          <CoinHistory entries={(coinHistory ?? []) as CoinLedgerEntry[]} />

          {/* Profile actions */}
          <ProfileActions />
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-3 text-center">
      <div className="text-lg">{icon}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  );
}

function DiagnosisItem({ label, value, positive }: { label: string; value: boolean | null; positive?: boolean }) {
  const isGood = positive ? value : !value;
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-800/30 px-3 py-2">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs font-medium ${isGood ? 'text-emerald-400' : 'text-amber-400'}`}>
        {value ? 'Sim' : 'Nao'}
      </span>
    </div>
  );
}
