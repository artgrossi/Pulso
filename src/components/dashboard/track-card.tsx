import type { Track } from '@/lib/types/database';
import { TRACK_CONFIG } from '@/lib/constants';

interface TrackCardProps {
  track: Track;
  contentCompletedToday: number;
  totalContentToday: number;
}

export function TrackCard({ track, contentCompletedToday, totalContentToday }: TrackCardProps) {
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
    </div>
  );
}
