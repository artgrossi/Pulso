'use client';

import Link from 'next/link';

interface AppHeaderProps {
  totalCoins: number;
}

export function AppHeader({ totalCoins }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-lg sm:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Pulso
          </span>
        </Link>
        <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
          <span>🪙</span>
          <span className="font-semibold">{totalCoins}</span>
        </div>
      </div>
    </header>
  );
}
