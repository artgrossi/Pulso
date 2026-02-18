'use client';

interface WeeklyChartProps {
  data: { day: string; coins: number; contents: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxCoins = Math.max(...data.map(d => d.coins), 1);

  return (
    <div>
      {/* Bar chart */}
      <div className="flex items-end gap-2" style={{ height: 120 }}>
        {data.map((d, i) => {
          const height = maxCoins > 0 ? (d.coins / maxCoins) * 100 : 0;
          const isToday = i === data.length - 1;

          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-pulso-text-secondary">
                {d.coins > 0 ? `+${d.coins}` : ''}
              </span>
              <div className="w-full flex items-end" style={{ height: 80 }}>
                <div
                  className={`w-full rounded-t transition-all ${
                    isToday
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                      : d.coins > 0
                        ? 'bg-gradient-to-t from-emerald-800 to-emerald-600'
                        : 'bg-pulso-muted'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              <span className={`text-[10px] ${isToday ? 'font-medium text-emerald-400' : 'text-pulso-text-secondary'}`}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contents per day */}
      <div className="mt-4 flex gap-2">
        {data.map((d, i) => (
          <div key={`c-${d.day}`} className="flex flex-1 flex-col items-center">
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(d.contents, 4) }).map((_, j) => (
                <div key={j} className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              ))}
              {d.contents === 0 && <div className="h-1.5 w-1.5 rounded-full bg-pulso-muted" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-pulso-text-secondary">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-emerald-600" /> Moedas
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" /> Conteudos
        </span>
      </div>
    </div>
  );
}
