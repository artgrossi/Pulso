import type { TrackSlug } from './types/database';
import type { IconName } from '@/components/ui/Icon';

export const TRACK_CONFIG: Record<TrackSlug, {
  name: string;
  icon: IconName;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}> = {
  retomada: {
    name: 'Retomada',
    icon: 'arrow-path',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Organize suas dívidas e retome o controle',
  },
  fundacao: {
    name: 'Fundação',
    icon: 'building',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Construa sua reserva e entenda seus investimentos',
  },
  crescimento: {
    name: 'Crescimento',
    icon: 'trending-up',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Otimize sua estratégia e diversifique',
  },
  expertise: {
    name: 'Expertise',
    icon: 'academic-cap',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Conteúdo avançado e ferramentas sofisticadas',
  },
};

export const STREAK_MULTIPLIERS: Record<number, number> = {
  7: 1.25,
  14: 1.50,
  30: 2.00,
  60: 2.50,
  90: 3.00,
};

export function getStreakMultiplier(streakDays: number): number {
  const thresholds = Object.keys(STREAK_MULTIPLIERS)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (streakDays >= threshold) {
      return STREAK_MULTIPLIERS[threshold];
    }
  }
  return 1.0;
}
