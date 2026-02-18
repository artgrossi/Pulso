import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TRACK_CONFIG } from '@/lib/constants';
import type { TrackSlug, CoinLedgerEntry, Achievement, UserAchievement, IncomeRange } from '@/lib/types/database';
import { ProfileHeader } from '@/components/perfil/profile-header';
import { LevelProgress } from '@/components/perfil/level-progress';
import { AchievementsShowcase } from '@/components/perfil/achievements-showcase';
import { ProfileActions } from '@/components/perfil/profile-actions';
import { CoinHistory } from '@/components/perfil/coin-history';
import { AccountSection } from '@/components/perfil/account-section';
import { Icon, type IconName } from '@/components/ui/Icon';

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

  // Fetch all achievements
  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true });

  // Fetch user's unlocked achievements with achievement details
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
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

  const totalAchievements = allAchievements?.length ?? 0;
  const unlockedAchievements = userAchievements?.length ?? 0;

  return (
    <>
      <header className="border-b border-pulso-border-subtle bg-pulso-elevated/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="pulso-gradient-text">
              Perfil
            </span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* Profile header with edit */}
          <ProfileHeader
            fullName={profile.full_name}
            email={user.email!}
            memberSince={memberSince}
            birthDate={profile.birth_date ?? null}
            incomeRange={(profile.income_range as IncomeRange) ?? null}
            trackName={trackConfig?.name ?? null}
            trackIcon={trackConfig?.icon ?? null}
            trackColor={trackConfig?.color ?? null}
            trackBgColor={trackConfig?.bgColor ?? null}
            trackBorderColor={trackConfig?.borderColor ?? null}
          />

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Moedas" value={profile.total_coins.toString()} icon="coin" gradient="from-amber-500/10 to-orange-500/10" textColor="text-amber-500" />
            <StatCard label="Streak" value={`${streak?.current_streak ?? 0}d`} icon="flame" gradient="from-orange-500/10 to-red-500/10" textColor="text-orange-500" />
            <StatCard label="Conversiveis" value={`R$${profile.convertible_coins}`} icon="banknotes" gradient="from-green-500/10 to-emerald-500/10" textColor="text-green-500" />
          </div>

          {/* Level & Track progress */}
          <LevelProgress
            level={profile.level}
            totalCoins={profile.total_coins}
            currentStreak={streak?.current_streak ?? 0}
            completedContent={completedCount ?? 0}
            totalContent={trackContentCount ?? 0}
          />

          {/* Achievements showcase */}
          <AchievementsShowcase
            achievements={(allAchievements ?? []) as Achievement[]}
            userAchievements={(userAchievements ?? []) as (UserAchievement & { achievement: Achievement })[]}
            totalCount={totalAchievements}
            unlockedCount={unlockedAchievements}
          />

          {/* Diagnosis summary */}
          {diagnosis && (
            <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
                Seu Diagnostico Financeiro
              </h3>
              <div className="space-y-2">
                <DiagnosisItem label="Dividas em atraso" value={diagnosis.has_overdue_debt} />
                <DiagnosisItem label="Consegue poupar" value={diagnosis.can_save_monthly} positive />
                <DiagnosisItem label="Reserva de emergencia" value={diagnosis.has_emergency_fund} positive />
                <DiagnosisItem label="Sabe meta de aposentadoria" value={diagnosis.knows_retirement_target} positive />
                <DiagnosisItem label="Entende PGBL/VGBL" value={diagnosis.understands_pgbl_vgbl} positive />
              </div>
              <p className="mt-3 text-xs text-pulso-text-muted">
                Trilha atribuida: <span className="font-medium text-pulso-text-secondary">{trackConfig?.name ?? diagnosis.assigned_track_slug}</span>
              </p>
            </div>
          )}

          {/* Coin History */}
          <CoinHistory entries={(coinHistory ?? []) as CoinLedgerEntry[]} />

          {/* Profile actions */}
          <ProfileActions />

          {/* Account section (sign out, delete) */}
          <div className="pt-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-pulso-text-secondary px-1 mb-2">
              Conta
            </h3>
            <AccountSection />
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value, icon, gradient, textColor }: { label: string; value: string; icon: IconName; gradient: string; textColor: string }) {
  return (
    <div className={`rounded-xl border border-pulso-border-subtle bg-gradient-to-br ${gradient} p-3 text-center`}>
      <div className="flex justify-center">
        <Icon name={icon} size={20} className={textColor} />
      </div>
      <div className={`text-lg font-bold ${textColor}`}>{value}</div>
      <div className="text-[10px] text-pulso-text-secondary">{label}</div>
    </div>
  );
}

function DiagnosisItem({ label, value, positive }: { label: string; value: boolean | null; positive?: boolean }) {
  const isGood = positive ? value : !value;
  return (
    <div className="flex items-center justify-between rounded-lg bg-pulso-muted px-3 py-2">
      <span className="text-xs text-pulso-text-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${isGood ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <span className={`text-xs font-medium ${isGood ? 'text-emerald-500' : 'text-amber-500'}`}>
          {value ? 'Sim' : 'Nao'}
        </span>
      </div>
    </div>
  );
}
