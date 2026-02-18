'use client';

import { useState, useEffect, useCallback } from 'react';
import { getActiveIntents } from '@/lib/actions/intents';
import type { IntentWithProgress } from '@/lib/types/database';
import { IntentCard } from './intent-card';
import { CreateIntentForm } from './create-intent-form';

export function IntentsList() {
  const [intents, setIntents] = useState<IntentWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadIntents = useCallback(async () => {
    try {
      const data = await getActiveIntents();
      setIntents(data);
    } catch {
      // Error loading intents
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntents();
  }, [loadIntents]);

  function handleCreated() {
    setShowCreate(false);
    loadIntents();
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-pulso-border bg-pulso-elevated" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create button or form */}
      {showCreate ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-sm">
          <CreateIntentForm onCreated={handleCreated} onCancel={() => setShowCreate(false)} />
        </div>
      ) : (
        <button
          onClick={() => setShowCreate(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-pulso-border bg-pulso-muted/30 p-4 text-sm text-pulso-text-muted transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova Meta
        </button>
      )}

      {/* Active intents */}
      {intents.length === 0 && !showCreate ? (
        <div className="rounded-2xl border border-pulso-border bg-pulso-elevated p-8 text-center backdrop-blur-sm">
          <div className="mb-3 text-4xl">🎯</div>
          <h3 className="text-sm font-medium">Nenhuma meta ativa</h3>
          <p className="mt-1 text-xs text-pulso-text-secondary">
            Crie sua primeira meta para comecar a acompanhar seu progresso financeiro.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {intents.map((intent) => (
            <IntentCard key={intent.id} intent={intent} onUpdate={loadIntents} />
          ))}
        </div>
      )}
    </div>
  );
}
