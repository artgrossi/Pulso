'use client';

import { useState, useTransition } from 'react';
import type { DailyContent } from '@/lib/types/database';
import { completeContent } from '@/lib/actions/content';
import { Icon, type IconName } from '@/components/ui/Icon';

interface DailyContentListProps {
  contents: DailyContent[];
  completedIds: Set<string>;
}

export function DailyContentList({ contents, completedIds: initialCompletedIds }: DailyContentListProps) {
  const [completedIds, setCompletedIds] = useState(initialCompletedIds);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastEarned, setLastEarned] = useState<{ id: string; coins: number } | null>(null);
  const [trackAdvancement, setTrackAdvancement] = useState<string | null>(null);

  function handleComplete(contentId: string) {
    startTransition(async () => {
      const result = await completeContent(contentId);
      if (!result.alreadyCompleted) {
        setCompletedIds(prev => new Set([...prev, contentId]));
        setLastEarned({ id: contentId, coins: result.coinsEarned });
        setTimeout(() => setLastEarned(null), 3000);

        if (result.trackAdvanced && result.newTrackName) {
          setTrackAdvancement(result.newTrackName);
        }
      }
    });
  }

  const contentTypeLabel: Record<string, string> = {
    micro_lesson: 'Micro-licao',
    quiz: 'Quiz',
    practical_action: 'Acao pratica',
    weekly_checkin: 'Check-in semanal',
  };

  const contentTypeIcon: Record<string, IconName> = {
    micro_lesson: 'book-open',
    quiz: 'question-mark',
    practical_action: 'target',
    weekly_checkin: 'clipboard',
  };

  if (contents.length === 0) {
    return (
      <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-8 text-center backdrop-blur-sm">
        <div className="mb-3 flex justify-center">
          <Icon name="book-open" size={28} className="text-pulso-text-muted" />
        </div>
        <p className="text-sm text-pulso-text-muted">
          Nenhum conteudo disponivel ainda. Em breve teremos novidades para voce!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Track Advancement Celebration */}
      {trackAdvancement && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-pulse">
          <div className="mb-2 flex justify-center">
            <Icon name="trophy" size={36} className="text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-emerald-400">Parabens!</h3>
          <p className="mt-1 text-sm text-pulso-text-secondary">
            Voce avancou para a trilha <strong>{trackAdvancement}</strong>!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Ver nova trilha
          </button>
        </div>
      )}

      <h3 className="text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
        Conteudo de Hoje
      </h3>

      {contents.map((content) => {
        const isCompleted = completedIds.has(content.id);
        const isExpanded = expandedId === content.id;
        const justEarned = lastEarned?.id === content.id;

        return (
          <div
            key={content.id}
            className={`rounded-xl border transition-all ${
              isCompleted
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-pulso-border-subtle bg-pulso-elevated shadow-sm hover:border-pulso-border'
            } backdrop-blur-sm`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : content.id)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isCompleted ? 'bg-emerald-500/10' : 'bg-pulso-muted'
              }`}>
                {isCompleted
                  ? <Icon name="check-circle" size={20} className="text-emerald-500" />
                  : <Icon name={contentTypeIcon[content.content_type] ?? 'book-open'} size={20} className="text-pulso-text-secondary" />
                }
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{content.title}</h4>
                  {justEarned && (
                    <span className="animate-bounce rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                      +{lastEarned.coins} moedas
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-pulso-text-secondary">
                  <span>{contentTypeLabel[content.content_type]}</span>
                  <span>·</span>
                  <span>{content.duration_minutes} min</span>
                  <span>·</span>
                  <span>{content.coins_reward} moedas</span>
                </div>
              </div>
              <svg
                className={`h-4 w-4 text-pulso-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="border-t border-pulso-border-subtle px-4 pb-4 pt-3">
                {content.body?.blocks?.map((block, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    {block.type === 'text' && (
                      <p className="text-sm leading-relaxed text-pulso-text-secondary whitespace-pre-line">{block.content}</p>
                    )}
                    {block.type === 'tip' && (
                      <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
                        <Icon name="lightbulb" size={16} className="mt-0.5 shrink-0" />
                        <span>{block.content}</span>
                      </div>
                    )}
                    {block.type === 'warning' && (
                      <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                        <Icon name="exclamation-triangle" size={16} className="mt-0.5 shrink-0" />
                        <span>{block.content}</span>
                      </div>
                    )}
                  </div>
                ))}

                {!isCompleted && (
                  <button
                    onClick={() => handleComplete(content.id)}
                    disabled={isPending}
                    className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isPending ? 'Salvando...' : 'Marcar como concluido'}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
