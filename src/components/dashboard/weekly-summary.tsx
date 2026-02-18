'use client';

import { Icon, type IconName } from '@/components/ui/Icon';

interface WeeklySummaryProps {
  weeklyCoins: number;
  weeklyActivities: number;
  currentStreak: number;
  totalCoins: number;
}

export function WeeklySummary({ weeklyCoins, weeklyActivities, currentStreak, totalCoins }: WeeklySummaryProps) {
  const stats: { label: string; value: string; color: string; bg: string; iconColor: string; icon: IconName }[] = [
    { label: 'Moedas esta semana', value: `+${weeklyCoins}`, color: 'text-amber-600', bg: 'bg-amber-50', iconColor: 'text-amber-500', icon: 'coin' },
    { label: 'Atividades', value: weeklyActivities.toString(), color: 'text-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-500', icon: 'document-text' },
    { label: 'Streak', value: `${currentStreak}d`, color: currentStreak > 0 ? 'text-orange-500' : 'text-pulso-text-muted', bg: currentStreak > 0 ? 'bg-orange-50' : 'bg-pulso-muted', iconColor: currentStreak > 0 ? 'text-orange-500' : 'text-pulso-text-muted', icon: currentStreak > 0 ? 'flame' : 'snowflake' },
    { label: 'Total', value: totalCoins.toString(), color: 'text-emerald-600', bg: 'bg-emerald-50', iconColor: 'text-emerald-500', icon: 'banknotes' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-xl ${stat.bg} p-3 text-center`}>
          <div className="flex justify-center">
            <Icon name={stat.icon} size={20} className={stat.iconColor} />
          </div>
          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-pulso-text-muted leading-tight">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
