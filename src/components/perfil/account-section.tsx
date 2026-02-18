'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/lib/actions/profile';

export function AccountSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    if (deleteText !== 'EXCLUIR') return;
    setDeleting(true);
    setError(null);

    const result = await deleteAccount();
    if (result.error) {
      setError(result.error);
      setDeleting(false);
      return;
    }

    router.push('/');
  }

  return (
    <div className="space-y-2">
      {/* Sign out */}
      {showSignOutConfirm ? (
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
          <p className="text-sm font-medium text-pulso-text mb-3">Tem certeza que deseja sair?</p>
          <div className="flex gap-2">
            <form action="/auth/signout" method="post" className="flex-1">
              <button
                type="submit"
                className="w-full rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
              >
                Sim, sair
              </button>
            </form>
            <button
              onClick={() => setShowSignOutConfirm(false)}
              className="flex-1 rounded-lg bg-pulso-elevated px-3 py-2 text-xs font-medium text-pulso-text-secondary border border-pulso-border transition-colors hover:bg-pulso-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowSignOutConfirm(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 transition-colors hover:border-red-200 hover:bg-red-50/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-red-600">Sair da conta</div>
            <div className="text-[10px] text-pulso-text-secondary">Encerrar sua sessao</div>
          </div>
        </button>
      )}

      {/* Delete account */}
      {showDeleteConfirm ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-2 mb-3">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700">Excluir conta permanentemente</p>
              <p className="text-xs text-red-600 mt-1">
                Esta acao e irreversivel. Todos os seus dados, progresso, moedas e conquistas serao perdidos.
              </p>
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-red-600">
              Digite EXCLUIR para confirmar
            </label>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="EXCLUIR"
              className="w-full rounded-lg border border-red-200 bg-pulso-elevated px-3 py-2 text-sm text-pulso-text outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            />
          </div>
          {error && (
            <p className="mb-2 text-xs text-red-500">{error}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleteText !== 'EXCLUIR' || deleting}
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Excluindo...' : 'Excluir minha conta'}
            </button>
            <button
              onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); setError(null); }}
              className="flex-1 rounded-lg bg-pulso-elevated px-3 py-2 text-xs font-medium text-pulso-text-secondary border border-pulso-border transition-colors hover:bg-pulso-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-pulso-border-subtle bg-pulso-elevated/80 p-4 transition-colors hover:border-red-200 hover:bg-red-50/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pulso-muted">
            <svg className="h-4 w-4 text-pulso-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </span>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-pulso-text-secondary">Excluir conta</div>
            <div className="text-[10px] text-pulso-text-secondary">Remover permanentemente seus dados</div>
          </div>
        </button>
      )}
    </div>
  );
}
