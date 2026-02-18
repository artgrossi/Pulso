import type { TrackSlug, ToolSlug, ToolConfig } from './types/database';

export const TRACK_CONFIG: Record<TrackSlug, {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}> = {
  retomada: {
    name: 'Retomada',
    icon: '🔄',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Organize suas dívidas e retome o controle',
  },
  fundacao: {
    name: 'Fundação',
    icon: '🏗️',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Construa sua reserva e entenda seus investimentos',
  },
  crescimento: {
    name: 'Crescimento',
    icon: '📈',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Otimize sua estratégia e diversifique',
  },
  expertise: {
    name: 'Expertise',
    icon: '🎓',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Conteúdo avançado e ferramentas sofisticadas',
  },
};

// ============================================================================
// Tool (Calculator) Configuration
// ============================================================================

export const TOOLS_CONFIG: Record<ToolSlug, ToolConfig> = {
  reserva: {
    slug: 'reserva',
    name: 'Reserva de Emergencia',
    description: 'Descubra quanto voce precisa guardar e em quanto tempo chega la',
    icon: '🛡️',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-cyan-500',
    coinsCost: 0,
    autoUnlockCriteria: null,
    isFree: true,
    href: '/ferramentas/reserva',
  },
  dividas: {
    slug: 'dividas',
    name: 'Quitacao de Dividas',
    description: 'Compare estrategias Snowball vs Avalanche para quitar suas dividas',
    icon: '🧮',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-500',
    coinsCost: 30,
    autoUnlockCriteria: {
      type: 'content_count',
      value: 3,
      label: 'Complete 3 conteudos',
    },
    isFree: false,
    href: '/ferramentas/dividas',
  },
  juros: {
    slug: 'juros',
    name: 'Juros Compostos',
    description: 'Simule o crescimento do seu dinheiro com o poder dos juros compostos',
    icon: '📈',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-500',
    coinsCost: 75,
    autoUnlockCriteria: {
      type: 'streak_days',
      value: 7,
      label: 'Alcance 7 dias de streak',
    },
    isFree: false,
    href: '/ferramentas/juros',
  },
};

export const TOOLS_ORDER: ToolSlug[] = ['reserva', 'dividas', 'juros'];

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
