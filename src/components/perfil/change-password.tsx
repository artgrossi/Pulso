'use client';

import { useState } from 'react';
import { changePassword } from '@/lib/actions/profile';

export function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function reset() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
    setIsOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas nao coincidem' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Nova senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setSaving(true);
    const result = await changePassword(currentPassword, newPassword);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
      setSaving(false);
      return;
    }

    setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
    setSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      reset();
    }, 2000);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 transition-colors hover:border-pulso-border"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pulso-muted">
          <svg className="h-4 w-4 text-pulso-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium">Alterar Senha</div>
          <div className="text-[10px] text-pulso-text-secondary">Atualize sua senha de acesso</div>
        </div>
        <svg className="h-4 w-4 text-pulso-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Alterar Senha</h3>
        <button
          onClick={reset}
          className="text-xs text-pulso-text-muted hover:text-pulso-text-secondary transition-colors"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Senha atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Nova senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Minimo 6 caracteres"
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text placeholder-pulso-text-muted outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-pulso-text-secondary">Confirmar nova senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-pulso-border bg-pulso-muted px-3 py-2 text-sm text-pulso-text outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        {message && (
          <p className={`rounded-lg p-2.5 text-xs ${
            message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 disabled:opacity-50"
        >
          {saving ? 'Alterando...' : 'Alterar Senha'}
        </button>
      </form>
    </div>
  );
}
