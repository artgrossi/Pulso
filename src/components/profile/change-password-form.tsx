'use client';

import { useState, useTransition } from 'react';
import { updatePassword } from '@/lib/actions/profile';
import { useToast } from '@/components/ui/toast';

export function ChangePasswordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const passwordsMatch = newPassword === confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordsMatch) {
      addToast({ type: 'error', title: 'As senhas não coincidem.' });
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(currentPassword, newPassword);
      if (result.error) {
        addToast({ type: 'error', title: result.error });
      } else {
        addToast({ type: 'success', title: 'Senha alterada com sucesso!' });
        setIsOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-3 text-left text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
      >
        Alterar senha
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold">Alterar senha</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="current-pw" className="mb-1 block text-xs font-medium text-gray-400">
            Senha atual
          </label>
          <input
            id="current-pw"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="new-pw" className="mb-1 block text-xs font-medium text-gray-400">
            Nova senha
          </label>
          <input
            id="new-pw"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="confirm-pw" className="mb-1 block text-xs font-medium text-gray-400">
            Confirmar nova senha
          </label>
          <input
            id="confirm-pw"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className={`w-full rounded-lg border bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 ${
              confirmPassword && !passwordsMatch
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'
            }`}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-xs text-red-400">As senhas não coincidem</p>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending || !passwordsMatch || !newPassword}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {isPending ? 'Alterando...' : 'Alterar senha'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            className="rounded-lg border border-gray-700 px-4 py-2 text-xs text-gray-400 transition-colors hover:bg-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
