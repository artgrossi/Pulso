import type { Achievement } from '@/lib/types/database';

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
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
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
                  : 'border-pulso-border-subtle bg-pulso-elevated/80 opacity-50'
              }`}
            >
              <div className="mb-1 flex items-center justify-center">
                {isUnlocked ? (
                  <span className="text-2xl">{achievement.icon}</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-pulso-text-muted">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                )}
              </div>
              <p className="text-xs font-medium">
                {achievement.title}
              </p>
              <p className="mt-0.5 text-[10px] text-pulso-text-secondary">
                {isUnlocked ? `+${achievement.coins_reward} moedas` : achievement.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
