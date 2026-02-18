'use client';

import Link from 'next/link';

const actions = [
  { href: '/ferramentas#dividas', label: 'Simular quitacao', icon: '🧮', color: 'border-amber-200 hover:border-amber-300 hover:bg-amber-50' },
  { href: '/ferramentas#reserva', label: 'Calcular reserva', icon: '🛡️', color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' },
  { href: '/ferramentas#juros', label: 'Juros compostos', icon: '📈', color: 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50' },
  { href: '/relatorio', label: 'Ver relatorio', icon: '📊', color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50' },
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
            <span className="text-xl">{action.icon}</span>
            <span className="text-xs text-gray-600">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
