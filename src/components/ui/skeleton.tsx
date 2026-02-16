export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-800/60 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
      <Skeleton className="mb-4 h-3 w-24" />
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

export function ContentItemSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
}

export function AchievementSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-3 text-center">
      <Skeleton className="mx-auto mb-2 h-8 w-8 rounded-lg" />
      <Skeleton className="mx-auto mb-1 h-3 w-16" />
      <Skeleton className="mx-auto h-2 w-20" />
    </div>
  );
}
