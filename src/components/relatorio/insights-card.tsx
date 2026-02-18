'use client';

import { Icon, type IconName } from '@/components/ui/Icon';

interface InsightsCardProps {
  weekCoins: number;
  weekContents: number;
  activeDays: number;
  currentStreak: number;
  streakMultiplier: number;
  trackPercentage: number;
  trackName: string;
  coinsTrend: number;
}

export function InsightsCard({
  weekCoins,
  weekContents,
  activeDays,
  currentStreak,
  streakMultiplier,
  trackPercentage,
  trackName,
  coinsTrend,
}: InsightsCardProps) {
  const insights: { icon: IconName; text: string; type: 'positive' | 'neutral' | 'action' }[] = [];

  // Engagement insights
  if (activeDays >= 6) {
    insights.push({ icon: 'star', text: 'Semana incrivel! Voce esteve ativo quase todos os dias.', type: 'positive' });
  } else if (activeDays >= 4) {
    insights.push({ icon: 'thumb-up', text: `Bom ritmo! ${activeDays} dias ativos esta semana.`, type: 'positive' });
  } else if (activeDays > 0) {
    insights.push({ icon: 'bolt', text: `Tente manter pelo menos 5 dias ativos na semana para maximizar seus ganhos.`, type: 'action' });
  } else {
    insights.push({ icon: 'clock', text: 'Voce nao completou nenhum conteudo esta semana. Que tal comecar agora?', type: 'action' });
  }

  // Streak insights
  if (currentStreak >= 30) {
    insights.push({ icon: 'flame', text: `Streak de ${currentStreak} dias! Seu multiplicador de ${streakMultiplier}x esta turbinando suas moedas.`, type: 'positive' });
  } else if (currentStreak >= 7) {
    insights.push({ icon: 'flame', text: `${currentStreak} dias de streak! Mantenha o ritmo para aumentar o multiplicador.`, type: 'positive' });
  } else if (currentStreak > 0) {
    insights.push({ icon: 'target', text: `Faltam ${7 - currentStreak} dias para ativar o multiplicador de 1.25x!`, type: 'action' });
  }

  // Track progress insights
  if (trackPercentage >= 80) {
    insights.push({ icon: 'rocket', text: `Voce completou ${trackPercentage}% da trilha ${trackName}. Prepare-se para avancar!`, type: 'positive' });
  } else if (trackPercentage >= 50) {
    insights.push({ icon: 'trending-up', text: `Mais da metade da trilha ${trackName} completa! Continue forte.`, type: 'neutral' });
  }

  // Coins trend
  if (coinsTrend > 20) {
    insights.push({ icon: 'chart-bar', text: `Voce ganhou ${coinsTrend}% mais moedas que na semana passada!`, type: 'positive' });
  } else if (coinsTrend < -20) {
    insights.push({ icon: 'trending-down', text: 'Suas moedas cairam em relacao a semana passada. Vamos recuperar?', type: 'action' });
  }

  // Multiplier tip
  if (streakMultiplier > 1) {
    const bonusCoins = Math.round(weekCoins - weekCoins / streakMultiplier);
    if (bonusCoins > 0) {
      insights.push({ icon: 'sparkles', text: `Seu multiplicador de ${streakMultiplier}x rendeu +${bonusCoins} moedas extras esta semana!`, type: 'positive' });
    }
  }

  if (insights.length === 0) {
    insights.push({ icon: 'lightbulb', text: 'Complete conteudos diarios para gerar insights personalizados sobre sua evolucao.', type: 'neutral' });
  }

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-pulso-text-secondary">
        Insights da Semana
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 rounded-lg p-3 text-sm ${
              insight.type === 'positive'
                ? 'bg-emerald-500/10 text-emerald-600'
                : insight.type === 'action'
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-pulso-muted text-pulso-text-muted'
            }`}
          >
            <Icon name={insight.icon} size={16} className="mt-0.5 shrink-0" />
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
