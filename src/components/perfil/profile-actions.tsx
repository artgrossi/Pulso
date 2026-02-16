'use client';

import Link from 'next/link';

export function ProfileActions() {
  return (
    <div className="space-y-2">
      <Link
        href="/ferramentas"
        className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-colors hover:border-gray-700"
      >
        <span className="text-lg">🧮</span>
        <div className="flex-1">
          <div className="text-sm font-medium">Ferramentas Financeiras</div>
          <div className="text-[10px] text-gray-500">Calculadoras de dividas, reserva e juros</div>
        </div>
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <Link
        href="/relatorio"
        className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-colors hover:border-gray-700"
      >
        <span className="text-lg">📊</span>
        <div className="flex-1">
          <div className="text-sm font-medium">Relatorio Semanal</div>
          <div className="text-[10px] text-gray-500">Veja sua evolucao e insights personalizados</div>
        </div>
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <Link
        href="/onboarding"
        className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-colors hover:border-gray-700"
      >
        <span className="text-lg">🔄</span>
        <div className="flex-1">
          <div className="text-sm font-medium">Refazer Diagnostico</div>
          <div className="text-[10px] text-gray-500">Sua situacao financeira mudou? Atualize seu perfil</div>
        </div>
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
