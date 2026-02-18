import type { UserStreak } from '@/lib/types/database';

interface StreakCardProps {
  streak: UserStreak | null;
}

export function StreakCard({ streak }: StreakCardProps) {
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const multiplier = streak?.streak_multiplier ?? 1.0;

  const flameIntensity =
    currentStreak >= 30 ? 'text-orange-500' :
    currentStreak >= 7 ? 'text-amber-500' :
    currentStreak >= 1 ? 'text-yellow-500' :
    'text-gray-400';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`text-4xl ${flameIntensity}`}>
          {currentStreak > 0 ? '🔥' : '❄️'}
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-800">{currentStreak}</span>
            <span className="text-sm text-gray-500">
              {currentStreak === 1 ? 'dia' : 'dias'} consecutivos
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
            <span>Recorde: {longestStreak} dias</span>
            {multiplier > 1 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
                {multiplier}x moedas
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
