'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [targetMonths, setTargetMonths] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlySaving, setMonthlySaving] = useState(500);
  const [calculated, setCalculated] = useState(false);

  const targetAmount = monthlyExpenses * targetMonths;
  const remaining = Math.max(0, targetAmount - currentSavings);
  const monthsToGoal = monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : Infinity;
  const progress = targetAmount > 0 ? Math.min(100, (currentSavings / targetAmount) * 100) : 0;

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function calculate() {
    setCalculated(true);
  }

  const profileType =
    targetMonths <= 3 ? { label: 'Conservador', color: 'text-blue-400', desc: 'Ideal para quem tem emprego estavel e poucos dependentes.' } :
    targetMonths <= 6 ? { label: 'Moderado', color: 'text-emerald-400', desc: 'Recomendado para a maioria das pessoas.' } :
    { label: 'Cauteloso', color: 'text-purple-400', desc: 'Indicado para autonomos ou quem tem renda variavel.' };

  return (
    <div id="reserva" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Icon name="shield-check" size={22} className="text-blue-400" />
        </span>
        <div>
          <h3 className="font-bold text-blue-400">Reserva de Emergencia</h3>
          <p className="text-xs text-pulso-text-secondary">Descubra quanto voce precisa e em quanto tempo chega la</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Gasto mensal total (moradia, alimentacao, contas...)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-pulso-text-secondary">R$</span>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Meses de cobertura desejados</label>
          <div className="flex gap-2">
            {[3, 6, 9, 12].map((m) => (
              <button
                key={m}
                onClick={() => setTargetMonths(m)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  targetMonths === m
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-pulso-border text-pulso-text-muted hover:border-pulso-border'
                }`}
              >
                {m} meses
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Quanto voce ja tem guardado?</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-pulso-text-secondary">R$</span>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-pulso-text-muted">Quanto pode guardar por mes?</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-pulso-text-secondary">R$</span>
            <input
              type="number"
              value={monthlySaving}
              onChange={(e) => setMonthlySaving(parseFloat(e.target.value) || 0)}
              className="flex-1 rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
      >
        Calcular Reserva
      </button>

      {calculated && (
        <div className="space-y-3">
          {/* Profile */}
          <div className="rounded-lg border border-pulso-border-subtle bg-pulso-elevated/80 p-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${profileType.color}`}>Perfil: {profileType.label}</span>
            </div>
            <p className="mt-1 text-xs text-pulso-text-secondary">{profileType.desc}</p>
          </div>

          {/* Target */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-pulso-text-muted">Meta da reserva</span>
              <span className="text-lg font-bold text-blue-400">{formatCurrency(targetAmount)}</span>
            </div>

            {/* Progress bar */}
            <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-pulso-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-pulso-text-secondary">Guardado: {formatCurrency(currentSavings)}</span>
              <span className="font-medium text-blue-400">{progress.toFixed(0)}%</span>
            </div>
          </div>

          {/* Time to goal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 text-center">
              <div className="text-2xl font-bold text-pulso-text-secondary">
                {remaining <= 0 ? '0' : monthsToGoal === Infinity ? '∞' : monthsToGoal}
              </div>
              <div className="text-xs text-pulso-text-secondary">meses para meta</div>
            </div>
            <div className="rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 text-center">
              <div className="text-2xl font-bold text-pulso-text-secondary">
                {formatCurrency(remaining)}
              </div>
              <div className="text-xs text-pulso-text-secondary">faltam</div>
            </div>
          </div>

          {remaining <= 0 ? (
            <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-600">
              <Icon name="trophy" size={14} className="mt-0.5 shrink-0" />
              <span>Parabens! Voce ja atingiu sua meta de reserva de emergencia!</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-xs text-blue-600">
              <Icon name="lightbulb" size={14} className="mt-0.5 shrink-0" />
              <span>Guardando {formatCurrency(monthlySaving)}/mes, voce atinge a meta em {monthsToGoal === Infinity ? 'nunca (aumente sua economia!)' : `${monthsToGoal} meses (${(monthsToGoal / 12).toFixed(1)} anos)`}.
              {monthlySaving < monthlyExpenses * 0.1 && ' Tente guardar pelo menos 10% da sua renda!'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
