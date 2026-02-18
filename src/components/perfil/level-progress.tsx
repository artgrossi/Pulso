import { getStreakMultiplier } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';

interface LevelProgressProps {
  level: number;
  totalCoins: number;
  currentStreak: number;
  completedContent: number;
  totalContent: number;
}

// Level thresholds - coins needed to reach each level
function getCoinsForLevel(level: number): number {
  // Progressive formula: each level requires more coins
  // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 450, ...
  if (level <= 1) return 0;
  return Math.floor(50 * level * (level - 1) / 2 + 50 * (level - 1));
}

export function LevelProgress({
  level,
  totalCoins,
  currentStreak,
  completedContent,
  totalContent,
}: LevelProgressProps) {
  const currentLevelCoins = getCoinsForLevel(level);
  const nextLevelCoins = getCoinsForLevel(level + 1);
  const coinsInLevel = totalCoins - currentLevelCoins;
  const coinsNeeded = nextLevelCoins - currentLevelCoins;
  const levelProgress = coinsNeeded > 0 ? Math.min((coinsInLevel / coinsNeeded) * 100, 100) : 100;

  const trackProgress = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
  const multiplier = getStreakMultiplier(currentStreak);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 backdrop-blur-sm">
      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-4">
        Sua Evolucao
      </h3>

      {/* Level progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Icon name="star" size={18} className="text-purple-500" />
            <span className="text-sm font-semibold">Nivel {level}</span>
          </div>
          <span className="text-xs text-gray-400">
            {coinsInLevel}/{coinsNeeded} moedas
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-gray-400">
          {nextLevelCoins - totalCoins > 0
            ? `Faltam ${nextLevelCoins - totalCoins} moedas para o nivel ${level + 1}`
            : `Proximo nivel disponivel!`}
        </p>
      </div>

      {/* Track progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Icon name="book-open" size={18} className="text-emerald-500" />
            <span className="text-sm font-semibold">Trilha</span>
          </div>
          <span className="text-xs text-gray-400">
            {completedContent}/{totalContent} conteudos
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${trackProgress}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-gray-400">
          {trackProgress >= 80
            ? 'Voce pode avancar de trilha!'
            : `${trackProgress}% concluido — 80% para avancar`}
        </p>
      </div>

      {/* Streak multiplier */}
      {multiplier > 1 && (
        <div className="rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-3">
          <div className="flex items-center gap-2">
            <Icon name="flame" size={18} className="text-orange-500" />
            <div>
              <span className="text-sm font-semibold text-orange-600">Multiplicador {multiplier}x</span>
              <p className="text-[10px] text-orange-400">
                {currentStreak} dias de streak — suas moedas estao multiplicadas!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
