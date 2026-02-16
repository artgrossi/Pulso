'use client';

import Link from 'next/link';

const actions = [
  {
    href: '/ferramentas#dividas',
    label: 'Simular quitacao',
    icon: '🧮',
    color: 'border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5',
  },
  {
    href: '/ferramentas#reserva',
    label: 'Calcular reserva',
    icon: '🛡️',
    color: 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5',
  },
  {
    href: '/ferramentas#juros',
    label: 'Juros compostos',
    icon: '📈',
    color: 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5',
  },
  {
    href: '/relatorio',
    label: 'Ver relatorio',
    icon: '📊',
    color: 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5',
  },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
        Acoes Rapidas
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-1.5 rounded-xl border bg-gray-900/40 p-3 text-center transition-all ${action.color}`}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-xs text-gray-300">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
