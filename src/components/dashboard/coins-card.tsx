import type { Profile, Track } from '@/lib/types/database';

interface CoinsCardProps {
  profile: Profile;
  track: Track | null;
}

export function CoinsCard({ profile, track }: CoinsCardProps) {
  const showConvertible = track?.coins_convertible !== false;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm sm:p-6">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 sm:mb-4">
        Suas Moedas
      </h3>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-amber-400 sm:text-3xl">{profile.total_coins}</span>
        <span className="text-xs text-gray-500 sm:text-sm">moedas totais</span>
      </div>

      {showConvertible ? (
        <div className="mt-2 text-xs text-gray-400 sm:text-sm">
          <span className="text-emerald-400">{profile.convertible_coins}</span> conversíveis em aportes
        </div>
      ) : (
        <div className="mt-2 rounded-lg bg-amber-500/10 p-2 text-[11px] text-amber-400 sm:text-xs">
          Moedas da Trilha Retomada acumulam e serão conversíveis ao mudar de trilha
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 sm:mt-4">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-[10px]">
          Lv
        </span>
        Nível {profile.level}
      </div>
    </div>
  );
}
