import type { Profile, Track } from '@/lib/types/database';

interface CoinsCardProps {
  profile: Profile;
  track: Track | null;
}

export function CoinsCard({ profile, track }: CoinsCardProps) {
  const showConvertible = track?.coins_convertible !== false;

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-pulso-text-muted">
        Suas Moedas
      </h3>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-amber-500">{profile.total_coins}</span>
        <span className="text-sm text-pulso-text-muted">moedas totais</span>
      </div>

      {showConvertible ? (
        <div className="mt-2 text-sm text-pulso-text-secondary">
          <span className="text-emerald-600">{profile.convertible_coins}</span> conversíveis em aportes
        </div>
      ) : (
        <div className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-600">
          Moedas da Trilha Retomada acumulam e serão conversíveis ao mudar de trilha
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-pulso-text-muted">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-pulso-muted text-[10px]">
          Lv
        </span>
        Nível {profile.level}
      </div>
    </div>
  );
}
