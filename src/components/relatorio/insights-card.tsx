'use client';

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
  const insights: { icon: string; text: string; type: 'positive' | 'neutral' | 'action' }[] = [];

  // Engagement insights
  if (activeDays >= 6) {
    insights.push({ icon: '🌟', text: 'Semana incrivel! Voce esteve ativo quase todos os dias.', type: 'positive' });
  } else if (activeDays >= 4) {
    insights.push({ icon: '👍', text: `Bom ritmo! ${activeDays} dias ativos esta semana.`, type: 'positive' });
  } else if (activeDays > 0) {
    insights.push({ icon: '💪', text: `Tente manter pelo menos 5 dias ativos na semana para maximizar seus ganhos.`, type: 'action' });
  } else {
    insights.push({ icon: '⏰', text: 'Voce nao completou nenhum conteudo esta semana. Que tal comecar agora?', type: 'action' });
  }

  // Streak insights
  if (currentStreak >= 30) {
    insights.push({ icon: '🔥', text: `Streak de ${currentStreak} dias! Seu multiplicador de ${streakMultiplier}x esta turbinando suas moedas.`, type: 'positive' });
  } else if (currentStreak >= 7) {
    insights.push({ icon: '🔥', text: `${currentStreak} dias de streak! Mantenha o ritmo para aumentar o multiplicador.`, type: 'positive' });
  } else if (currentStreak > 0) {
    insights.push({ icon: '🎯', text: `Faltam ${7 - currentStreak} dias para ativar o multiplicador de 1.25x!`, type: 'action' });
  }

  // Track progress insights
  if (trackPercentage >= 80) {
    insights.push({ icon: '🚀', text: `Voce completou ${trackPercentage}% da trilha ${trackName}. Prepare-se para avancar!`, type: 'positive' });
  } else if (trackPercentage >= 50) {
    insights.push({ icon: '📈', text: `Mais da metade da trilha ${trackName} completa! Continue forte.`, type: 'neutral' });
  }

  // Coins trend
  if (coinsTrend > 20) {
    insights.push({ icon: '📊', text: `Voce ganhou ${coinsTrend}% mais moedas que na semana passada!`, type: 'positive' });
  } else if (coinsTrend < -20) {
    insights.push({ icon: '📉', text: 'Suas moedas cairam em relacao a semana passada. Vamos recuperar?', type: 'action' });
  }

  // Multiplier tip
  if (streakMultiplier > 1) {
    const bonusCoins = Math.round(weekCoins - weekCoins / streakMultiplier);
    if (bonusCoins > 0) {
      insights.push({ icon: '✨', text: `Seu multiplicador de ${streakMultiplier}x rendeu +${bonusCoins} moedas extras esta semana!`, type: 'positive' });
    }
  }

  if (insights.length === 0) {
    insights.push({ icon: '💡', text: 'Complete conteudos diarios para gerar insights personalizados sobre sua evolucao.', type: 'neutral' });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 backdrop-blur-sm">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
        Insights da Semana
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 text-sm ${
              insight.type === 'positive'
                ? 'bg-emerald-500/10 text-emerald-600'
                : insight.type === 'action'
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-gray-50 text-gray-400'
            }`}
          >
            {insight.icon} {insight.text}
          </div>
        ))}
      </div>
    </div>
  );
}
