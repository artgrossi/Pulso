'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { TOOLS_CONFIG } from '@/lib/constants';
import { unlockToolWithCoins } from '@/lib/actions/tools';
import type { ToolSlug } from '@/lib/types/database';
import type { ToolUnlockStatus } from '@/lib/actions/tools';

interface ToolCardProps {
  status: ToolUnlockStatus;
  totalCoins: number;
}

export function ToolCard({ status, totalCoins }: ToolCardProps) {
  const config = TOOLS_CONFIG[status.slug];
  const [isUnlocked, setIsUnlocked] = useState(status.unlocked);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [coins, setCoins] = useState(totalCoins);
  const [isPending, startTransition] = useTransition();

  function handleUnlockClick() {
    if (isUnlocked) return;
    setShowUnlockModal(true);
  }

  function handleSpendCoins() {
    startTransition(async () => {
      const result = await unlockToolWithCoins(status.slug as ToolSlug);
      if (result.success) {
        setIsUnlocked(true);
        setJustUnlocked(true);
        setShowUnlockModal(false);
        if (result.newCoinBalance !== undefined) {
          setCoins(result.newCoinBalance);
        }
        // Reset animation after 3s
        setTimeout(() => setJustUnlocked(false), 3000);
      }
    });
  }

  // Unlocked card
  if (isUnlocked) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 ${
        justUnlocked
          ? `${config.borderColor} ring-2 ring-offset-2 animate-pulse`
          : 'border-gray-100'
      }`}>
        {justUnlocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-sm font-bold text-gray-800">Desbloqueado!</p>
              <p className="text-xs text-gray-500 mt-1">{config.name}</p>
            </div>
          </div>
        )}

        {/* Gradient accent top */}
        <div className={`h-1.5 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`} />

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bgColor} text-2xl`}>
                {config.icon}
              </span>
              <div>
                <h3 className={`font-bold ${config.color}`}>{config.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 max-w-[200px]">{config.description}</p>
              </div>
            </div>
          </div>

          <Link
            href={config.href}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90`}
          >
            Abrir Calculadora
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Locked card
  const canAfford = coins >= config.coinsCost;
  const criteriaPercent = status.criteriaPercent ?? 0;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Gradient accent top (muted) */}
        <div className={`h-1.5 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} opacity-30`} />

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl opacity-60">
                {config.icon}
                {/* Lock overlay */}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-[10px]">
                  🔒
                </span>
              </span>
              <div>
                <h3 className="font-bold text-gray-400">{config.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[200px]">{config.description}</p>
              </div>
            </div>
          </div>

          {/* Unlock options preview */}
          <div className="mt-4 space-y-3">
            {/* Coin unlock option */}
            <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>🪙</span>
                <span>{config.coinsCost} moedas</span>
              </div>
              {canAfford ? (
                <span className="text-[10px] font-medium text-emerald-500">Disponivel</span>
              ) : (
                <span className="text-[10px] text-gray-400">
                  {coins}/{config.coinsCost}
                </span>
              )}
            </div>

            {/* Criteria progress */}
            {config.autoUnlockCriteria && (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{config.autoUnlockCriteria.type === 'content_count' ? '📚' : '🔥'} {config.autoUnlockCriteria.label}</span>
                  <span className="text-[10px] text-gray-400">
                    {status.criteriaProgress}/{status.criteriaTarget}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} transition-all duration-500`}
                    style={{ width: `${criteriaPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleUnlockClick}
            className="mt-4 w-full rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:border-gray-400 hover:text-gray-600"
          >
            Desbloquear
          </button>
        </div>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-6 animate-slide-up">
            <div className="text-center mb-5">
              <span className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${config.bgColor} text-3xl`}>
                {config.icon}
              </span>
              <h3 className="mt-3 text-lg font-bold text-gray-800">Desbloquear {config.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Spend coins */}
              <button
                onClick={handleSpendCoins}
                disabled={!canAfford || isPending}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  canAfford
                    ? 'border-amber-300 bg-amber-50 hover:bg-amber-100'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🪙</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {isPending ? 'Desbloqueando...' : `Gastar ${config.coinsCost} moedas`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Saldo atual: {coins} moedas
                      </div>
                    </div>
                  </div>
                  {canAfford && !isPending && (
                    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Option 2: Criteria path */}
              {config.autoUnlockCriteria && (
                <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {config.autoUnlockCriteria.type === 'content_count' ? '📚' : '🔥'}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        {config.autoUnlockCriteria.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        Desbloqueio automatico ao atingir a meta
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} transition-all duration-500`}
                          style={{ width: `${criteriaPercent}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[10px] text-gray-400 text-right">
                        {status.criteriaProgress}/{status.criteriaTarget} ({criteriaPercent}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowUnlockModal(false)}
              className="mt-4 w-full rounded-xl py-3 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
