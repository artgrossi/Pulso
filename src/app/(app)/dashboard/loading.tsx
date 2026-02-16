import { Skeleton, CardSkeleton, ContentItemSkeleton, AchievementSkeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Track + Streak row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Coins */}
      <CardSkeleton />

      {/* Daily Content */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <ContentItemSkeleton />
        <ContentItemSkeleton />
      </div>

      {/* Achievements */}
      <div>
        <Skeleton className="mb-3 h-3 w-32" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
