import { DebtCalculator } from '@/components/ferramentas/debt-calculator';
import { EmergencyFundCalculator } from '@/components/ferramentas/emergency-fund-calculator';
import { CompoundInterestCalculator } from '@/components/ferramentas/compound-interest-calculator';

export default function FerramentasPage() {
  return (
    <>
      <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Ferramentas
            </span>
          </h1>
          <p className="text-xs text-gray-500">Calculadoras para decisoes financeiras inteligentes</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
            <DebtCalculator />
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
            <EmergencyFundCalculator />
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
            <CompoundInterestCalculator />
          </div>
        </div>
      </main>
    </>
  );
}
