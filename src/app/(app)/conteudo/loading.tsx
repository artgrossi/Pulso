import { Skeleton, CardSkeleton, ContentItemSkeleton } from '@/components/ui/skeleton';

export default function ConteudoLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-7 w-32" />
        <Skeleton className="h-4 w-44" />
      </div>

      <CardSkeleton />

      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <ContentItemSkeleton />
        <ContentItemSkeleton />
        <ContentItemSkeleton />
      </div>
    </div>
  );
}
