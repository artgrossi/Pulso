import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TRACK_CONFIG } from '@/lib/constants';
import type { TrackSlug } from '@/lib/types/database';
import { WeeklyChart } from '@/components/relatorio/weekly-chart';
import { InsightsCard } from '@/components/relatorio/insights-card';
import { Icon, type IconName } from '@/components/ui/Icon';

export default async function RelatorioPage() {
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

  // Fetch track
  const { data: track } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', profile.current_track_id!)
    .single();

  const trackConfig = track?.slug ? TRACK_CONFIG[track.slug as TrackSlug] : null;

  // Fetch streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Last 30 days of coin activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: coinHistory } = await supabase
    .from('coins_ledger')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  // Last 7 days of content progress
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: weekProgress } = await supabase
    .from('user_content_progress')
    .select('*')
    .eq('user_id', user.id)
    .gte('completed_at', sevenDaysAgo.toISOString())
    .order('completed_at');

  // Total completed
  const { count: totalCompleted } = await supabase
    .from('user_content_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Total track content
  const { count: trackTotal } = await supabase
    .from('daily_content')
    .select('*', { count: 'exact', head: true })
    .eq('track_id', profile.current_track_id!)
    .eq('is_published', true);

  // Build daily activity for the last 7 days
  const dailyActivity: { day: string; coins: number; contents: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

    const dayCoins = (coinHistory ?? [])
      .filter(c => c.created_at.startsWith(dateStr))
      .reduce((s, c) => s + c.amount, 0);

    const dayContents = (weekProgress ?? [])
      .filter(p => p.completed_at.startsWith(dateStr))
      .length;

    dailyActivity.push({ day: dayLabel, coins: dayCoins, contents: dayContents });
  }

  // Calculate insights
  const weekCoins = dailyActivity.reduce((s, d) => s + d.coins, 0);
  const weekContents = dailyActivity.reduce((s, d) => s + d.contents, 0);
  const activeDays = dailyActivity.filter(d => d.contents > 0).length;
  const trackPercentage = trackTotal ? Math.round(((totalCompleted ?? 0) / trackTotal) * 100) : 0;

  // Monthly comparison (previous 7 days vs this 7 days)
  const prevWeekStart = new Date();
  prevWeekStart.setDate(prevWeekStart.getDate() - 14);
  const prevWeekEnd = new Date();
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

  const { data: prevWeekCoins } = await supabase
    .from('coins_ledger')
    .select('amount')
    .eq('user_id', user.id)
    .gte('created_at', prevWeekStart.toISOString())
    .lt('created_at', prevWeekEnd.toISOString());

  const prevWeekTotal = (prevWeekCoins ?? []).reduce((s, c) => s + c.amount, 0);
  const coinsTrend = prevWeekTotal > 0
    ? Math.round(((weekCoins - prevWeekTotal) / prevWeekTotal) * 100)
    : weekCoins > 0 ? 100 : 0;

  return (
    <>
      <header className="border-b border-pulso-border-subtle bg-pulso-elevated/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="pulso-gradient-text">
              Relatorio Semanal
            </span>
          </h1>
          <p className="text-xs text-pulso-text-secondary">Sua evolucao nos ultimos 7 dias</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              label="Moedas ganhas"
              value={`+${weekCoins}`}
              trend={coinsTrend}
              icon="coin"
              color="text-amber-400"
            />
            <SummaryCard
              label="Conteudos"
              value={weekContents.toString()}
              icon="book-open"
              color="text-blue-400"
            />
            <SummaryCard
              label="Dias ativos"
              value={`${activeDays}/7`}
              icon="calendar"
              color="text-emerald-400"
            />
            <SummaryCard
              label="Trilha"
              value={`${trackPercentage}%`}
              icon={trackConfig?.icon ?? 'chart-bar'}
              color={trackConfig?.color ?? 'text-purple-400'}
            />
          </div>

          {/* Weekly Activity Chart */}
          <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
              Atividade Diaria
            </h3>
            <WeeklyChart data={dailyActivity} />
          </div>

          {/* Insights */}
          <InsightsCard
            weekCoins={weekCoins}
            weekContents={weekContents}
            activeDays={activeDays}
            currentStreak={streak?.current_streak ?? 0}
            streakMultiplier={streak?.streak_multiplier ?? 1}
            trackPercentage={trackPercentage}
            trackName={trackConfig?.name ?? 'Atual'}
            coinsTrend={coinsTrend}
          />

          {/* Streak insights */}
          <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
              Status do Streak
            </h3>
            <div className="flex items-center gap-4">
              <div className={(streak?.current_streak ?? 0) >= 7 ? 'text-orange-400' : 'text-pulso-text-secondary'}>
                <Icon name={(streak?.current_streak ?? 0) > 0 ? 'flame' : 'snowflake'} size={36} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">{streak?.current_streak ?? 0} dias</div>
                <div className="text-xs text-pulso-text-secondary">
                  Recorde: {streak?.longest_streak ?? 0} dias · Multiplicador: {streak?.streak_multiplier ?? 1}x
                </div>
              </div>
            </div>

            {/* Next milestone */}
            {(() => {
              const current = streak?.current_streak ?? 0;
              const milestones = [7, 14, 30, 60, 90];
              const next = milestones.find(m => m > current);
              if (!next) return null;
              const progress = (current / next) * 100;
              return (
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-pulso-text-secondary">Proximo marco: {next} dias</span>
                    <span className="text-orange-400">{next - current} dias restantes</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-pulso-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Track progress detail */}
          <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
              Progresso da Trilha {trackConfig?.name}
            </h3>
            <div className="mb-3 flex items-center gap-3">
              <Icon name={trackConfig?.icon ?? 'chart-bar'} size={28} className={trackConfig?.color ?? 'text-purple-400'} />
              <div className="flex-1">
                <div className={`text-lg font-bold ${trackConfig?.color ?? 'text-white'}`}>
                  {trackPercentage}% completo
                </div>
                <div className="text-xs text-pulso-text-secondary">
                  {totalCompleted ?? 0} de {trackTotal ?? 0} conteudos
                </div>
              </div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-pulso-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
                style={{ width: `${trackPercentage}%` }}
              />
            </div>
            {trackPercentage >= 80 && (
              <p className="mt-2 text-xs text-emerald-400">
                Voce ja pode avancar para a proxima trilha!
              </p>
            )}
            {trackPercentage < 80 && (
              <p className="mt-2 text-xs text-pulso-text-secondary">
                Faltam {Math.max(0, Math.ceil((trackTotal ?? 0) * 0.8) - (totalCompleted ?? 0))} conteudos para avancar (80%)
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({ label, value, trend, icon, color }: {
  label: string;
  value: string;
  trend?: number;
  icon: IconName;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <Icon name={icon} size={20} className={color} />
        {trend !== undefined && trend !== 0 && (
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className={`mt-2 text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-pulso-text-secondary">{label}</div>
    </div>
  );
}
