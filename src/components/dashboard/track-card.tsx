import type { Track } from '@/lib/types/database';
import { TRACK_CONFIG } from '@/lib/constants';
import { Icon } from '@/components/ui/Icon';

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
    <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3">
        <Icon name={config.icon} size={28} className={config.color} />
        <div>
          <h3 className={`text-lg font-bold ${config.color}`}>
            Trilha {config.name}
          </h3>
          <p className="text-xs text-pulso-text-secondary">{config.description}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-pulso-text-secondary">Progresso de hoje</span>
          <span className={config.color}>
            {contentCompletedToday}/{totalContentToday}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-pulso-muted">
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

      {overallProgress && overallProgress.totalCount > 0 && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-pulso-text-secondary">Progresso da trilha</span>
            <span className={config.color}>
              {overallProgress.percentage}%
              {overallProgress.nextTrackSlug && (
                <span className="text-pulso-text-muted"> (avança em {overallProgress.threshold}%)</span>
              )}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-pulso-muted">
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
          <p className="mt-1 text-[10px] text-pulso-text-muted">
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
