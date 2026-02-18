'use client';

import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';

const actions: { href: string; label: string; icon: IconName; iconColor: string; color: string }[] = [
  { href: '/ferramentas#dividas', label: 'Simular quitacao', icon: 'calculator', iconColor: 'text-amber-500', color: 'border-amber-200 hover:border-amber-300 hover:bg-amber-50' },
  { href: '/ferramentas#reserva', label: 'Calcular reserva', icon: 'shield-check', iconColor: 'text-blue-500', color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' },
  { href: '/ferramentas#juros', label: 'Juros compostos', icon: 'trending-up', iconColor: 'text-emerald-500', color: 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50' },
  { href: '/relatorio', label: 'Ver relatorio', icon: 'chart-bar', iconColor: 'text-purple-500', color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50' },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
        Acoes Rapidas
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-1.5 rounded-xl border bg-white p-3 text-center transition-all ${action.color}`}
          >
            <Icon name={action.icon} size={22} className={action.iconColor} />
            <span className="text-xs text-gray-600">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
