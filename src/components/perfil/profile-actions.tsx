'use client';

import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui/Icon';

const actions: { href: string; label: string; description: string; icon: IconName; iconColor: string }[] = [
  { href: '/ferramentas', label: 'Ferramentas Financeiras', description: 'Calculadoras de dividas, reserva e juros', icon: 'calculator', iconColor: 'text-amber-500' },
  { href: '/relatorio', label: 'Relatorio Semanal', description: 'Veja sua evolucao e insights personalizados', icon: 'chart-bar', iconColor: 'text-blue-500' },
  { href: '/onboarding', label: 'Refazer Diagnostico', description: 'Sua situacao financeira mudou? Atualize seu perfil', icon: 'arrow-path', iconColor: 'text-purple-500' },
];

export function ProfileActions() {
  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-3 rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 transition-colors hover:border-pulso-border"
        >
          <Icon name={action.icon} size={20} className={action.iconColor} />
          <div className="flex-1">
            <div className="text-sm font-medium">{action.label}</div>
            <div className="text-[10px] text-pulso-text-secondary">{action.description}</div>
          </div>
          <svg className="h-4 w-4 text-pulso-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
