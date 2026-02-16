'use client';

import { useState } from 'react';

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: { month: number; debt: string; payment: number; remaining: number }[];
}

function calculateSnowball(debts: Debt[], extraPayment: number): PayoffResult {
  const sorted = [...debts].sort((a, b) => a.balance - b.balance);
  return calculatePayoff(sorted, extraPayment);
}

function calculateAvalanche(debts: Debt[], extraPayment: number): PayoffResult {
  const sorted = [...debts].sort((a, b) => b.rate - a.rate);
  return calculatePayoff(sorted, extraPayment);
}

function calculatePayoff(sortedDebts: Debt[], extraPayment: number): PayoffResult {
  const balances = new Map(sortedDebts.map(d => [d.id, d.balance]));
  const schedule: PayoffResult['schedule'] = [];
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 360;

  while (months < maxMonths) {
    const activeDebts = sortedDebts.filter(d => (balances.get(d.id) ?? 0) > 0.01);
    if (activeDebts.length === 0) break;

    months++;
    let extraAvailable = extraPayment;

    for (const debt of activeDebts) {
      let bal = balances.get(debt.id) ?? 0;
      const interest = bal * (debt.rate / 100 / 12);
      totalInterest += interest;
      bal += interest;

      const payment = Math.min(bal, debt.minPayment);
      bal -= payment;
      balances.set(debt.id, bal);
    }

    // Apply extra to first debt with balance
    for (const debt of sortedDebts) {
      if (extraAvailable <= 0) break;
      const bal = balances.get(debt.id) ?? 0;
      if (bal <= 0.01) continue;

      const extra = Math.min(extraAvailable, bal);
      balances.set(debt.id, bal - extra);
      extraAvailable -= extra;

      schedule.push({
        month: months,
        debt: debt.name,
        payment: debt.minPayment + extra,
        remaining: bal - extra,
      });
    }
  }

  const totalPaid = sortedDebts.reduce((s, d) => s + d.balance, 0) + totalInterest;

  return { months, totalInterest, totalPaid, schedule };
}

export function DebtCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Cartao de credito', balance: 5000, rate: 15, minPayment: 250 },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [result, setResult] = useState<{ snowball: PayoffResult; avalanche: PayoffResult } | null>(null);
  const [newDebt, setNewDebt] = useState({ name: '', balance: '', rate: '', minPayment: '' });

  function addDebt() {
    if (!newDebt.name || !newDebt.balance) return;
    setDebts([...debts, {
      id: Date.now().toString(),
      name: newDebt.name,
      balance: parseFloat(newDebt.balance) || 0,
      rate: parseFloat(newDebt.rate) || 0,
      minPayment: parseFloat(newDebt.minPayment) || 0,
    }]);
    setNewDebt({ name: '', balance: '', rate: '', minPayment: '' });
  }

  function removeDebt(id: string) {
    setDebts(debts.filter(d => d.id !== id));
  }

  function simulate() {
    if (debts.length === 0) return;
    const snowball = calculateSnowball(debts, extraPayment);
    const avalanche = calculateAvalanche(debts, extraPayment);
    setResult({ snowball, avalanche });
  }

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div id="dividas" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-xl">🧮</span>
        <div>
          <h3 className="font-bold text-amber-400">Quitacao de Dividas</h3>
          <p className="text-xs text-gray-500">Compare estrategias Snowball vs Avalanche</p>
        </div>
      </div>

      {/* Existing debts */}
      {debts.map((debt) => (
        <div key={debt.id} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-3">
          <div className="flex-1">
            <div className="text-sm font-medium">{debt.name}</div>
            <div className="mt-0.5 flex flex-wrap gap-2 text-[10px] text-gray-500">
              <span>Saldo: {formatCurrency(debt.balance)}</span>
              <span>Taxa: {debt.rate}% a.a.</span>
              <span>Min: {formatCurrency(debt.minPayment)}/mes</span>
            </div>
          </div>
          <button
            onClick={() => removeDebt(debt.id)}
            className="rounded p-1 text-gray-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* Add debt form */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Nome (ex: Cartao)"
          value={newDebt.name}
          onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Saldo (R$)"
          value={newDebt.balance}
          onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Taxa anual (%)"
          value={newDebt.rate}
          onChange={(e) => setNewDebt({ ...newDebt, rate: e.target.value })}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Pagamento min (R$)"
          value={newDebt.minPayment}
          onChange={(e) => setNewDebt({ ...newDebt, minPayment: e.target.value })}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
      </div>
      <button
        onClick={addDebt}
        className="w-full rounded-lg border border-dashed border-gray-700 py-2 text-sm text-gray-400 transition-colors hover:border-amber-500/50 hover:text-amber-400"
      >
        + Adicionar divida
      </button>

      {/* Extra payment */}
      <div>
        <label className="mb-1 block text-xs text-gray-400">Valor extra mensal para abater dividas</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">R$</span>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={simulate}
        disabled={debts.length === 0}
        className="w-full rounded-lg bg-amber-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-50"
      >
        Simular Quitacao
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Resultado da Simulacao</h4>
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="Snowball"
              subtitle="Menor saldo primeiro"
              months={result.snowball.months}
              totalInterest={result.snowball.totalInterest}
              totalPaid={result.snowball.totalPaid}
              isBetter={result.snowball.totalPaid <= result.avalanche.totalPaid}
              formatCurrency={formatCurrency}
            />
            <ResultCard
              title="Avalanche"
              subtitle="Maior taxa primeiro"
              months={result.avalanche.months}
              totalInterest={result.avalanche.totalInterest}
              totalPaid={result.avalanche.totalPaid}
              isBetter={result.avalanche.totalPaid <= result.snowball.totalPaid}
              formatCurrency={formatCurrency}
            />
          </div>

          <div className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-300">
            💡 <strong>Snowball</strong> paga a menor divida primeiro (motivacao psicologica). <strong>Avalanche</strong> ataca a maior taxa primeiro (economiza mais em juros).
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ title, subtitle, months, totalInterest, totalPaid, isBetter, formatCurrency }: {
  title: string;
  subtitle: string;
  months: number;
  totalInterest: number;
  totalPaid: number;
  isBetter: boolean;
  formatCurrency: (v: number) => string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${isBetter ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-800 bg-gray-900/40'}`}>
      <div className="flex items-center gap-2">
        <h5 className="text-sm font-bold">{title}</h5>
        {isBetter && <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">Melhor</span>}
      </div>
      <p className="text-[10px] text-gray-500">{subtitle}</p>
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Prazo</span>
          <span className="font-medium">{months} meses ({(months / 12).toFixed(1)} anos)</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Juros pagos</span>
          <span className="font-medium text-red-400">{formatCurrency(totalInterest)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Total pago</span>
          <span className="font-medium">{formatCurrency(totalPaid)}</span>
        </div>
      </div>
    </div>
  );
}
