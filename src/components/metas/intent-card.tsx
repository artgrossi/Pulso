'use client';

import { useState } from 'react';
import type { IntentWithProgress } from '@/lib/types/database';
import { updateIntentProgress, updateIntentStatus } from '@/lib/actions/intents';

const STATUS_CONFIG = {
  on_track: { label: 'No caminho', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  behind: { label: 'Atrasado', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  exceeded: { label: 'Superou!', color: 'text-blue-400', bg: 'bg-blue-500/10' },
} as const;

const TYPE_ICONS: Record<string, string> = {
  save_amount: '💰',
  reduce_spending: '📉',
  maintain_streak: '🔥',
  complete_content: '📚',
  build_habit: '🎯',
  complete_track: '🏆',
};

const METRIC_LABELS: Record<string, string> = {
  currency_brl: 'R$',
  streak_days: 'dias',
  content_count: 'conteudos',
  percentage: '%',
  custom: 'unidades',
};

interface IntentCardProps {
  intent: IntentWithProgress;
  onUpdate: () => void;
}

export function IntentCard({ intent, onUpdate }: IntentCardProps) {
  const [showProgress, setShowProgress] = useState(false);
  const [progressValue, setProgressValue] = useState('');
  const [progressNote, setProgressNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const icon = TYPE_ICONS[intent.intent_type] ?? '🎯';
  const metricLabel = METRIC_LABELS[intent.target_metric] ?? '';
  const latestProgress = intent.progress[0];
  const statusConfig = latestProgress ? STATUS_CONFIG[latestProgress.status] : null;

  const progressColor = intent.progress_percentage >= 80
    ? 'bg-emerald-500'
    : intent.progress_percentage >= 50
      ? 'bg-blue-500'
      : intent.progress_percentage >= 25
        ? 'bg-amber-500'
        : 'bg-gray-600';

  // Milestones achieved vs total
  const achievedMilestones = intent.milestones.filter((m) => m.is_achieved).length;
  const totalMilestones = intent.milestones.length;

  function formatValue(value: number): string {
    if (intent.target_metric === 'currency_brl') {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return `${value} ${metricLabel}`;
  }

  async function handleProgressSubmit() {
    if (!progressValue) return;
    setIsSubmitting(true);
    try {
      await updateIntentProgress(intent.id, {
        actual_value: parseFloat(progressValue),
        notes: progressNote.trim() || undefined,
      });
      setShowProgress(false);
      setProgressValue('');
      setProgressNote('');
      onUpdate();
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(status: 'paused' | 'completed' | 'abandoned') {
    setIsSubmitting(true);
    try {
      await updateIntentStatus(intent.id, status);
      setShowActions(false);
      onUpdate();
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm transition-all">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-xl">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-medium">{intent.title}</h4>
            {statusConfig && (
              <span className={`shrink-0 rounded-full ${statusConfig.bg} px-2 py-0.5 text-[10px] ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            )}
          </div>
          {intent.description && (
            <p className="mt-0.5 truncate text-[10px] text-gray-500">{intent.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="shrink-0 rounded-lg p-1 text-gray-600 transition-colors hover:bg-gray-800 hover:text-gray-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      </div>

      {/* Actions dropdown */}
      {showActions && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleStatusChange('completed')}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/10"
          >
            Concluir
          </button>
          <button
            onClick={() => handleStatusChange('paused')}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400 transition-colors hover:bg-amber-500/10"
          >
            Pausar
          </button>
          <button
            onClick={() => handleStatusChange('abandoned')}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/10"
          >
            Desistir
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px]">
          <span className="text-gray-500">
            {formatValue(intent.current_progress)} / {formatValue(intent.target_value)}
          </span>
          <span className="font-medium text-gray-400">{intent.progress_percentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(100, intent.progress_percentage)}%` }}
          />
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span>{intent.days_remaining > 0 ? `${intent.days_remaining} dias restantes` : 'Prazo encerrado'}</span>
          {totalMilestones > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-amber-400">&#9733;</span>
              {achievedMilestones}/{totalMilestones}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowProgress(!showProgress)}
          className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-[10px] font-medium text-emerald-400 transition-colors hover:bg-emerald-600/30"
        >
          + Progresso
        </button>
      </div>

      {/* Milestones row */}
      {totalMilestones > 0 && (
        <div className="mt-3 flex gap-1">
          {intent.milestones.map((m) => (
            <div
              key={m.id}
              className={`flex-1 rounded-md p-1.5 text-center text-[9px] ${
                m.is_achieved
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-gray-800/50 text-gray-600'
              }`}
              title={m.milestone_name}
            >
              {m.is_achieved ? '&#9733;' : '&#9734;'} {m.coins_reward}
            </div>
          ))}
        </div>
      )}

      {/* Progress input */}
      {showProgress && (
        <div className="mt-3 space-y-2 border-t border-gray-800 pt-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              placeholder={`Valor de hoje ${metricLabel ? `(${metricLabel})` : ''}`}
              min="0"
              step={intent.target_metric === 'currency_brl' ? '0.01' : '1'}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={handleProgressSubmit}
              disabled={isSubmitting || !progressValue}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'Salvar'}
            </button>
          </div>
          <input
            type="text"
            value={progressNote}
            onChange={(e) => setProgressNote(e.target.value)}
            placeholder="Nota (opcional)"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
