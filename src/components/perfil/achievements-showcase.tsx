import type { Achievement, UserAchievement } from '@/lib/types/database';
import { Icon, type IconName } from '@/components/ui/Icon';

interface AchievementsShowcaseProps {
  achievements: Achievement[];
  userAchievements: (UserAchievement & { achievement: Achievement })[];
  totalCount: number;
  unlockedCount: number;
}

export function AchievementsShowcase({
  achievements,
  userAchievements,
  totalCount,
  unlockedCount,
}: AchievementsShowcaseProps) {
  // Build a set of unlocked achievement IDs for quick lookup
  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  // Sort: unlocked first, then locked
  const sorted = [...achievements].sort((a, b) => {
    const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
    const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
    return aUnlocked - bUnlocked || a.sort_order - b.sort_order;
  });

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm backdrop-blur-sm">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
            Conquistas
          </h3>
          <span className="text-xs font-medium text-emerald-500">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-pulso-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="p-5 text-center">
          <div className="mb-2 flex justify-center">
            <Icon name="medal" size={28} className="text-pulso-text-muted" />
          </div>
          <p className="text-sm text-pulso-text-secondary">Conquistas serao desbloqueadas conforme voce avanca!</p>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 p-4 sm:grid-cols-4">
          {sorted.slice(0, 8).map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const ua = userAchievements.find((u) => u.achievement_id === achievement.id);

            return (
              <div
                key={achievement.id}
                className={`group relative flex flex-col items-center rounded-xl p-2.5 text-center transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100'
                    : 'bg-pulso-muted border border-pulso-border-subtle opacity-50'
                }`}
                title={isUnlocked
                  ? `${achievement.title} - ${achievement.description}`
                  : `${achievement.title} - Bloqueada`}
              >
                <Icon
                  name={achievement.icon as IconName}
                  size={24}
                  className={isUnlocked ? 'text-amber-500' : 'text-pulso-text-muted'}
                />
                <span className="mt-1 text-[10px] font-medium leading-tight text-pulso-text-secondary line-clamp-2">
                  {achievement.title}
                </span>
                {isUnlocked && ua && (
                  <span className="mt-0.5 text-[9px] text-emerald-500">
                    {new Date(ua.unlocked_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                )}
                {!isUnlocked && (
                  <span className="mt-0.5 text-[9px] text-pulso-text-muted">
                    Bloqueada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sorted.length > 8 && (
        <div className="border-t border-pulso-border-subtle px-5 py-3 text-center">
          <span className="text-xs text-pulso-text-muted">
            +{sorted.length - 8} conquistas
          </span>
        </div>
      )}
    </div>
  );
}
