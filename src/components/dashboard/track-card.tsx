import type { Track } from '@/lib/types/database';
import { TRACK_CONFIG } from '@/lib/constants';

interface TrackCardProps {
  track: Track;
  contentCompletedToday: number;
  totalContentToday: number;
  overallProgress?: {
    completedCount: number;
    totalCount: number;
    percentage: number;
    nextTrackSlug: string | null;
    threshold: number;
  };
}

export function TrackCard({ track, contentCompletedToday, totalContentToday, overallProgress }: TrackCardProps) {
  const config = TRACK_CONFIG[track.slug];

  return (
    <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-5 sm:p-6`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl sm:text-3xl">{config.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-base font-bold sm:text-lg ${config.color}`}>
            Trilha {config.name}
          </h3>
          <p className="truncate text-[11px] text-gray-400 sm:text-xs">{config.description}</p>
        </div>
      </div>

      {/* Today's progress */}
      <div className="mt-3 sm:mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] sm:text-xs">
          <span className="text-gray-400">Progresso de hoje</span>
          <span className={config.color}>
            {contentCompletedToday}/{totalContentToday}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              track.slug === 'retomada' ? 'bg-amber-500' :
              track.slug === 'fundacao' ? 'bg-blue-500' :
              track.slug === 'crescimento' ? 'bg-emerald-500' :
              'bg-purple-500'
            }`}
            style={{
              width: totalContentToday > 0
                ? `${(contentCompletedToday / totalContentToday) * 100}%`
                : '0%',
            }}
          />
        </div>
      </div>

      {/* Overall track progress */}
      {overallProgress && overallProgress.totalCount > 0 && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-400">Progresso da trilha</span>
            <span className={config.color}>
              {overallProgress.percentage}%
              {overallProgress.nextTrackSlug && (
                <span className="text-gray-500"> (avança em {overallProgress.threshold}%)</span>
              )}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-500 opacity-70 ${
                track.slug === 'retomada' ? 'bg-amber-500' :
                track.slug === 'fundacao' ? 'bg-blue-500' :
                track.slug === 'crescimento' ? 'bg-emerald-500' :
                'bg-purple-500'
              }`}
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-gray-500">
            {overallProgress.completedCount} de {overallProgress.totalCount} conteúdos completados
            {overallProgress.nextTrackSlug && ` · Próxima: ${
              overallProgress.nextTrackSlug === 'fundacao' ? 'Fundação' :
              overallProgress.nextTrackSlug === 'crescimento' ? 'Crescimento' :
              overallProgress.nextTrackSlug === 'expertise' ? 'Expertise' :
              overallProgress.nextTrackSlug
            }`}
          </p>
        </div>
      )}
    </div>
  );
}
