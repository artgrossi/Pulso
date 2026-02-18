'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SimulationResult {
  months: number;
  totalInvested: number;
  totalInterest: number;
  finalBalance: number;
  monthlyBreakdown: { month: number; invested: number; interest: number; balance: number }[];
}

function simulate(initial: number, monthly: number, rateAnnual: number, years: number): SimulationResult {
  const monthlyRate = rateAnnual / 100 / 12;
  const totalMonths = years * 12;
  const breakdown: SimulationResult['monthlyBreakdown'] = [];

  let balance = initial;
  let totalInvested = initial;
  let totalInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance += interest + monthly;
    totalInvested += monthly;

    if (m % 12 === 0 || m === totalMonths) {
      breakdown.push({
        month: m,
        invested: totalInvested,
        interest: totalInterest,
        balance,
      });
    }
  }

  return {
    months: totalMonths,
    totalInvested,
    totalInterest,
    finalBalance: balance,
    monthlyBreakdown: breakdown,
  };
}

export function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function handleSimulate() {
    setResult(simulate(initialAmount, monthlyDeposit, annualRate, years));
  }

  const presets = [
    { label: 'Poupanca', rate: 7.5 },
    { label: 'CDB 100%', rate: 12.5 },
    { label: 'Tesouro IPCA+', rate: 11 },
    { label: 'Acoes (media)', rate: 15 },
  ];

  return (
    <div id="juros" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon name="trending-up" size={22} className="text-emerald-400" />
        </span>
        <div>
          <h3 className="font-bold text-emerald-400">Juros Compostos</h3>
          <p className="text-xs text-pulso-text-secondary">Simule o crescimento do seu dinheiro ao longo do tempo</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Investimento inicial</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-pulso-text-secondary">R$</span>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Aporte mensal</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-pulso-text-secondary">R$</span>
            <input
              type="number"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(parseFloat(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Taxa de juros anual (%)</label>
          <input
            type="number"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text focus:border-emerald-500 focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setAnnualRate(p.rate)}
                className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                  annualRate === p.rate
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-pulso-border text-pulso-text-secondary hover:text-pulso-text-secondary'
                }`}
              >
                {p.label} ({p.rate}%)
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Periodo (anos): {years}</label>
          <input
            type="range"
            min="1"
            max="40"
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-pulso-text-secondary">
            <span>1 ano</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40 anos</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSimulate}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
      >
        Simular Investimento
      </button>

      {result && (
        <div className="space-y-3">
          {/* Main result */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <div className="text-xs text-pulso-text-muted">Saldo final em {years} anos</div>
            <div className="mt-1 text-3xl font-bold text-emerald-400">
              {formatCurrency(result.finalBalance)}
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 text-center">
              <div className="text-lg font-bold text-blue-400">{formatCurrency(result.totalInvested)}</div>
              <div className="text-[10px] text-pulso-text-secondary">Total investido</div>
            </div>
            <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 text-center">
              <div className="text-lg font-bold text-amber-400">{formatCurrency(result.totalInterest)}</div>
              <div className="text-[10px] text-pulso-text-secondary">Juros ganhos</div>
            </div>
          </div>

          {/* Visual ratio */}
          <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4">
            <div className="mb-2 text-xs text-pulso-text-muted">Composicao do saldo final</div>
            <div className="flex h-4 overflow-hidden rounded-full">
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${(result.totalInvested / result.finalBalance) * 100}%` }}
              />
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${(result.totalInterest / result.finalBalance) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px]">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-pulso-text-muted">Investido ({((result.totalInvested / result.finalBalance) * 100).toFixed(0)}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-pulso-text-muted">Juros ({((result.totalInterest / result.finalBalance) * 100).toFixed(0)}%)</span>
              </span>
            </div>
          </div>

          {/* Year-by-year table */}
          <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-pulso-border text-pulso-text-secondary">
                  <th className="px-3 py-2 text-left">Ano</th>
                  <th className="px-3 py-2 text-right">Investido</th>
                  <th className="px-3 py-2 text-right">Juros</th>
                  <th className="px-3 py-2 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyBreakdown.map((row) => (
                  <tr key={row.month} className="border-b border-pulso-border-subtle">
                    <td className="px-3 py-2 text-pulso-text-muted">{row.month / 12}</td>
                    <td className="px-3 py-2 text-right text-blue-400">{formatCurrency(row.invested)}</td>
                    <td className="px-3 py-2 text-right text-amber-400">{formatCurrency(row.interest)}</td>
                    <td className="px-3 py-2 text-right font-medium text-emerald-400">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-600">
            <Icon name="lightbulb" size={14} className="mt-0.5 shrink-0" />
            <span>Com aportes de {formatCurrency(monthlyDeposit)}/mes a {annualRate}% a.a., seus juros ({formatCurrency(result.totalInterest)}) representam {((result.totalInterest / result.finalBalance) * 100).toFixed(0)}% do saldo final. Esse e o poder dos juros compostos!</span>
          </div>
        </div>
      )}
    </div>
  );
}
