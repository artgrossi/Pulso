import { Skeleton, CardSkeleton } from '@/components/ui/skeleton';

export default function PerfilLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-7 w-24" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* User info card */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="mx-auto mb-1 h-7 w-12" />
              <Skeleton className="mx-auto h-2 w-14" />
            </div>
          ))}
        </div>
      </div>

      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
