import type { UserStreak } from '@/lib/types/database';

interface StreakCardProps {
  streak: UserStreak | null;
}

export function StreakCard({ streak }: StreakCardProps) {
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const multiplier = streak?.streak_multiplier ?? 1.0;

  const flameIntensity =
    currentStreak >= 30 ? 'text-orange-400' :
    currentStreak >= 7 ? 'text-amber-400' :
    currentStreak >= 1 ? 'text-yellow-500' :
    'text-gray-600';

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`text-3xl sm:text-4xl ${flameIntensity}`}>
          {currentStreak > 0 ? '🔥' : '❄️'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold sm:text-3xl">{currentStreak}</span>
            <span className="text-xs text-gray-400 sm:text-sm">
              {currentStreak === 1 ? 'dia' : 'dias'}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-500 sm:gap-3 sm:text-xs">
            <span>Recorde: {longestStreak}</span>
            {multiplier > 1 && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                {multiplier}x
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
