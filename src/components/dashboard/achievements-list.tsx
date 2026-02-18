import type { Achievement, UserAchievement } from '@/lib/types/database';

interface AchievementsListProps {
  achievements: Achievement[];
  unlockedIds: Set<string>;
}

export function AchievementsList({ achievements, unlockedIds }: AchievementsListProps) {
  if (achievements.length === 0) return null;

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
                  : 'border-gray-100 bg-white/80 opacity-50'
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
