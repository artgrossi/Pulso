'use client';

import type { CoinLedgerEntry } from '@/lib/types/database';
import { Icon, type IconName } from '@/components/ui/Icon';

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

const sourceIcons: Record<string, IconName> = {
  content_completion: 'book-open',
  quiz_completion: 'question-mark',
  achievement_unlock: 'medal',
  streak_bonus: 'flame',
  practical_action: 'target',
  weekly_checkin: 'clipboard',
  referral: 'users',
  conversion_to_aporte: 'arrow-right',
  manual_adjustment: 'cog',
};

interface CoinHistoryProps {
  entries: CoinLedgerEntry[];
}

export function CoinHistory({ entries }: CoinHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-6 text-center backdrop-blur-sm">
        <div className="mb-2 flex justify-center">
          <Icon name="coin" size={24} className="text-pulso-text-muted" />
        </div>
        <p className="text-sm text-pulso-text-secondary">Nenhuma transacao ainda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm backdrop-blur-sm">
      <div className="px-5 pt-5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
          Historico de Moedas
        </h3>
      </div>
      <div className="mt-3 divide-y divide-pulso-border-subtle">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
            <Icon name={sourceIcons[entry.source_type] ?? 'coin'} size={18} className="text-pulso-text-muted shrink-0" />
            <div className="flex-1">
              <div className="text-sm">{entry.description || sourceLabels[entry.source_type] || entry.source_type}</div>
              <div className="text-[10px] text-pulso-text-secondary">
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
