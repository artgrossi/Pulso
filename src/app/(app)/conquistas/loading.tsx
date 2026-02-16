import { Skeleton, AchievementSkeleton } from '@/components/ui/skeleton';

export default function ConquistasLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div>
        <Skeleton className="mb-3 h-3 w-36" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
          <AchievementSkeleton />
        </div>
      </div>
    </div>
  );
}
