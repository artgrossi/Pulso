'use client';

import { useState, useTransition } from 'react';
import type { DailyContent } from '@/lib/types/database';
import { completeContent } from '@/lib/actions/content';
import { useToast } from '@/components/ui/toast';

interface DailyContentListProps {
  contents: DailyContent[];
  completedIds: Set<string>;
}

export function DailyContentList({ contents, completedIds: initialCompletedIds }: DailyContentListProps) {
  const [completedIds, setCompletedIds] = useState(initialCompletedIds);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastEarned, setLastEarned] = useState<{ id: string; coins: number } | null>(null);
  const { addToast } = useToast();

  function handleComplete(contentId: string) {
    startTransition(async () => {
      const result = await completeContent(contentId);
      if (!result.alreadyCompleted) {
        setCompletedIds(prev => new Set([...prev, contentId]));
        setLastEarned({ id: contentId, coins: result.coinsEarned });
        setTimeout(() => setLastEarned(null), 3000);
        addToast({
          type: 'success',
          title: 'Conteúdo concluído!',
          description: `Você ganhou ${result.coinsEarned} moedas.`,
        });
      }
    });
  }

  const contentTypeLabel: Record<string, string> = {
    micro_lesson: 'Micro-lição',
    quiz: 'Quiz',
    practical_action: 'Ação prática',
    weekly_checkin: 'Check-in semanal',
  };

  const contentTypeIcon: Record<string, string> = {
    micro_lesson: '📖',
    quiz: '❓',
    practical_action: '🎯',
    weekly_checkin: '📋',
  };

  if (contents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800/60 text-2xl">
          📚
        </div>
        <h3 className="mb-1 text-sm font-semibold text-gray-300">Nenhum conteúdo disponível</h3>
        <p className="mx-auto max-w-xs text-xs text-gray-500">
          Novos conteúdos serão liberados conforme você avança na trilha. Continue voltando!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
        Conteúdo de Hoje
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
                : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
            } backdrop-blur-sm`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : content.id)}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                isCompleted ? 'bg-emerald-500/10' : 'bg-gray-800'
              }`}>
                {isCompleted ? '✅' : contentTypeIcon[content.content_type]}
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
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <span>{contentTypeLabel[content.content_type]}</span>
                  <span>·</span>
                  <span>{content.duration_minutes} min</span>
                  <span>·</span>
                  <span>{content.coins_reward} moedas</span>
                </div>
              </div>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-800 px-4 pb-4 pt-3">
                {content.body?.blocks?.map((block, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    {block.type === 'text' && (
                      <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">{block.content}</p>
                    )}
                    {block.type === 'tip' && (
                      <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-300">
                        💡 {block.content}
                      </div>
                    )}
                    {block.type === 'warning' && (
                      <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
                        ⚠️ {block.content}
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
                    {isPending ? 'Salvando...' : 'Marcar como concluído'}
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
