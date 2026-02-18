'use client';

import { useState } from 'react';
import { createIntent } from '@/lib/actions/intents';
import type { IntentType, IntentPeriod, TargetMetric } from '@/lib/types/database';

const INTENT_OPTIONS: {
  type: IntentType;
  label: string;
  icon: string;
  description: string;
  metric: TargetMetric;
  placeholder: string;
  color: string;
}[] = [
  {
    type: 'save_amount',
    label: 'Economizar',
    icon: '💰',
    description: 'Guardar um valor em R$ no periodo',
    metric: 'currency_brl',
    placeholder: 'Ex: 500.00',
    color: 'emerald',
  },
  {
    type: 'reduce_spending',
    label: 'Reduzir gastos',
    icon: '📉',
    description: 'Gastar menos em uma categoria',
    metric: 'currency_brl',
    placeholder: 'Ex: 300.00',
    color: 'amber',
  },
  {
    type: 'maintain_streak',
    label: 'Manter streak',
    icon: '🔥',
    description: 'Manter atividade diaria por N dias',
    metric: 'streak_days',
    placeholder: 'Ex: 30',
    color: 'orange',
  },
  {
    type: 'complete_content',
    label: 'Completar conteudos',
    icon: '📚',
    description: 'Completar N licoes ou acoes praticas',
    metric: 'content_count',
    placeholder: 'Ex: 10',
    color: 'blue',
  },
  {
    type: 'build_habit',
    label: 'Criar habito',
    icon: '🎯',
    description: 'Estabelecer uma rotina financeira',
    metric: 'custom',
    placeholder: 'Ex: 21',
    color: 'purple',
  },
];

const PERIOD_OPTIONS: { value: IntentPeriod; label: string }[] = [
  { value: 'weekly', label: '1 semana' },
  { value: 'monthly', label: '1 mes' },
  { value: 'custom', label: 'Personalizado' },
];

interface CreateIntentFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export function CreateIntentForm({ onCreated, onCancel }: CreateIntentFormProps) {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<typeof INTENT_OPTIONS[number] | null>(null);
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [periodType, setPeriodType] = useState<IntentPeriod>('monthly');
  const [customEndDate, setCustomEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function getEndDate(): string {
    if (periodType === 'custom') return customEndDate;
    const date = new Date();
    if (periodType === 'weekly') date.setDate(date.getDate() + 7);
    if (periodType === 'monthly') date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }

  async function handleSubmit() {
    if (!selectedType || !title.trim() || !targetValue) return;

    const endDate = getEndDate();
    if (!endDate) {
      setError('Selecione uma data final');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createIntent({
        title: title.trim(),
        description: description.trim() || undefined,
        intent_type: selectedType.type,
        period_type: periodType,
        target_value: parseFloat(targetValue),
        target_metric: selectedType.metric,
        end_date: endDate,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar meta');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === 'type') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Qual tipo de meta?</h3>
          <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Cancelar
          </button>
        </div>

        <div className="space-y-2">
          {INTENT_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                setSelectedType(option);
                setStep('details');
              }}
              className={`flex w-full items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 text-left transition-all hover:border-${option.color}-500/40 hover:bg-${option.color}-500/5`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-xl">
                {option.icon}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-[10px] text-gray-500">{option.description}</div>
              </div>
              <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('type')}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Voltar
        </button>
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          Cancelar
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl">{selectedType!.icon}</span>
        <h3 className="text-sm font-bold">{selectedType!.label}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Nome da meta</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Ex: ${selectedType!.label} este mes`}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Valor alvo {selectedType!.metric === 'currency_brl' ? '(R$)' : ''}
          </label>
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder={selectedType!.placeholder}
            min="1"
            step={selectedType!.metric === 'currency_brl' ? '0.01' : '1'}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">Periodo</label>
          <div className="flex gap-2">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodType(p.value)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs transition-colors ${
                  periodType === p.value
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {periodType === 'custom' && (
          <div>
            <label className="mb-1 block text-xs text-gray-400">Data final</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs text-gray-400">Descricao (opcional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Por que essa meta e importante?"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !title.trim() || !targetValue}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Criando...' : 'Criar Meta'}
      </button>
    </div>
  );
}
