'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getActiveIntents } from '@/lib/actions/intents';
import type { IntentWithProgress } from '@/lib/types/database';

const TYPE_ICONS: Record<string, string> = {
  save_amount: '💰',
  reduce_spending: '📉',
  maintain_streak: '🔥',
  complete_content: '📚',
  build_habit: '🎯',
  complete_track: '🏆',
};

export function DashboardIntents() {
  const [intents, setIntents] = useState<IntentWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadIntents = useCallback(async () => {
    try {
      const data = await getActiveIntents();
      setIntents(data);
    } catch {
      // Silently fail on dashboard
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntents();
  }, [loadIntents]);

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-2xl border border-pulso-border bg-pulso-elevated" />;
  }

  if (intents.length === 0) {
    return (
      <Link
        href="/metas"
        className="flex items-center gap-3 rounded-2xl border border-dashed border-pulso-border bg-pulso-muted/30 p-4 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">🎯</span>
        <div className="flex-1">
          <div className="text-sm font-medium text-pulso-text-muted">Defina uma meta</div>
          <div className="text-[10px] text-pulso-text-secondary">Crie objetivos e acompanhe seu progresso</div>
        </div>
        <svg className="h-4 w-4 text-pulso-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </Link>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">Metas Ativas</h3>
        <Link href="/metas" className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
          Ver todas
        </Link>
      </div>
      <div className="space-y-2">
        {intents.slice(0, 3).map((intent) => {
          const icon = TYPE_ICONS[intent.intent_type] ?? '🎯';
          const progressColor = intent.progress_percentage >= 80
            ? 'bg-emerald-500'
            : intent.progress_percentage >= 50
              ? 'bg-blue-500'
              : intent.progress_percentage >= 25
                ? 'bg-amber-500'
                : 'bg-pulso-text-muted';

          return (
            <Link
              key={intent.id}
              href="/metas"
              className="flex items-center gap-3 rounded-xl border border-pulso-border bg-pulso-elevated p-3 transition-all hover:border-pulso-border backdrop-blur-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pulso-muted text-base">
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium">{intent.title}</span>
                  <span className="shrink-0 text-[10px] text-pulso-text-muted">{intent.progress_percentage}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-pulso-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${Math.min(100, intent.progress_percentage)}%` }}
                  />
                </div>
                <div className="mt-1 text-[9px] text-pulso-text-secondary">
                  {intent.days_remaining > 0 ? `${intent.days_remaining} dias restantes` : 'Prazo encerrado'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
