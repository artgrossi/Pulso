'use client';

import type { CoinLedgerEntry } from '@/lib/types/database';

const sourceLabels: Record<string, string> = {
  content_completion: 'Conteudo completado',
  quiz_completion: 'Quiz completado',
  achievement_unlock: 'Conquista desbloqueada',
  streak_bonus: 'Bonus de streak',
  practical_action: 'Acao pratica',
  weekly_checkin: 'Check-in semanal',
  referral: 'Indicacao',
  conversion_to_aporte: 'Conversao em aporte',
  manual_adjustment: 'Ajuste manual',
};

const sourceIcons: Record<string, string> = {
  content_completion: '📖',
  quiz_completion: '❓',
  achievement_unlock: '🏅',
  streak_bonus: '🔥',
  practical_action: '🎯',
  weekly_checkin: '📋',
  referral: '👥',
  conversion_to_aporte: '💸',
  manual_adjustment: '⚙️',
};

interface CoinHistoryProps {
  entries: CoinLedgerEntry[];
}

export function CoinHistory({ entries }: CoinHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 text-center backdrop-blur-sm">
        <div className="mb-2 text-2xl">🪙</div>
        <p className="text-sm text-gray-500">Nenhuma transacao ainda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm backdrop-blur-sm">
      <div className="px-5 pt-5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Historico de Moedas
        </h3>
      </div>
      <div className="mt-3 divide-y divide-gray-100">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
            <span className="text-lg">{sourceIcons[entry.source_type] ?? '🪙'}</span>
            <div className="flex-1">
              <div className="text-sm">{entry.description || sourceLabels[entry.source_type] || entry.source_type}</div>
              <div className="text-[10px] text-gray-600">
                {new Date(entry.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <span className={`text-sm font-bold ${entry.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {entry.amount >= 0 ? '+' : ''}{entry.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
