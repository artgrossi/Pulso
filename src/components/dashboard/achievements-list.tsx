import type { Achievement, UserAchievement } from '@/lib/types/database';

interface AchievementsListProps {
  achievements: Achievement[];
  unlockedIds: Set<string>;
}

export function AchievementsList({ achievements, unlockedIds }: AchievementsListProps) {
  if (achievements.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800/60 text-2xl">
          🏆
        </div>
        <h3 className="mb-1 text-sm font-semibold text-gray-300">Nenhuma conquista ainda</h3>
        <p className="mx-auto max-w-xs text-xs text-gray-500">
          Complete conteúdos e mantenha seu streak para desbloquear conquistas.
        </p>
      </div>
    );
  }

  const unlocked = achievements.filter(a => unlockedIds.has(a.id));
  const locked = achievements.filter(a => !unlockedIds.has(a.id));

  return (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
        Conquistas ({unlocked.length}/{achievements.length})
      </h3>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[...unlocked, ...locked].map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`rounded-xl border p-3 text-center transition-all ${
                isUnlocked
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-gray-800 bg-gray-900/40 opacity-50'
              }`}
            >
              <div className="mb-1 text-2xl">
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              <p className="text-xs font-medium">
                {achievement.title}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500">
                {isUnlocked ? `+${achievement.coins_reward} moedas` : achievement.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
