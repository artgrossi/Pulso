'use client';

interface WeeklySummaryProps {
  weeklyCoins: number;
  weeklyActivities: number;
  currentStreak: number;
  totalCoins: number;
}

export function WeeklySummary({ weeklyCoins, weeklyActivities, currentStreak, totalCoins }: WeeklySummaryProps) {
  const stats = [
    {
      label: 'Moedas esta semana',
      value: `+${weeklyCoins}`,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      icon: '🪙',
    },
    {
      label: 'Atividades',
      value: weeklyActivities.toString(),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      icon: '📝',
    },
    {
      label: 'Streak',
      value: `${currentStreak}d`,
      color: currentStreak > 0 ? 'text-orange-400' : 'text-gray-500',
      bg: currentStreak > 0 ? 'bg-orange-500/10' : 'bg-gray-800',
      icon: currentStreak > 0 ? '🔥' : '❄️',
    },
    {
      label: 'Total',
      value: totalCoins.toString(),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      icon: '💰',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl ${stat.bg} p-3 text-center`}
        >
          <div className="text-lg">{stat.icon}</div>
          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-gray-500 leading-tight">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
