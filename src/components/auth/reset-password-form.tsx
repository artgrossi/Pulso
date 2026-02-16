'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: '', textColor: '' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-red-500', textColor: 'text-red-400' };
  if (score <= 2) return { score: 2, label: 'Razoável', color: 'bg-orange-500', textColor: 'text-orange-400' };
  if (score <= 3) return { score: 3, label: 'Boa', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
  if (score <= 4) return { score: 4, label: 'Forte', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
  return { score: 5, label: 'Muito forte', color: 'bg-emerald-400', textColor: 'text-emerald-400' };
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordsMatch) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      const translations: [RegExp, string][] = [
        [/new password should be different/i, 'A nova senha deve ser diferente da anterior.'],
        [/password should be at least/i, 'A senha deve ter pelo menos 6 caracteres.'],
      ];

      let translated = 'Erro ao atualizar senha. Tente novamente.';
      for (const [pattern, msg] of translations) {
        if (pattern.test(error.message)) {
          translated = msg;
          break;
        }
      }
      setMessage({ type: 'error', text: translated });
    } else {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso! Redirecionando...' });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900/60 p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-gray-400">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <p className={`mt-1 text-xs ${passwordStrength.textColor}`}>
                Senha {passwordStrength.label.toLowerCase()}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-xs font-medium text-gray-400">
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Repita a nova senha"
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

        {message && (
          <div
            className={`flex items-start gap-2 rounded-lg p-3 text-xs ${
              message.type === 'error'
                ? 'bg-red-500/10 text-red-400'
                : 'bg-emerald-500/10 text-emerald-400'
            }`}
            role="alert"
          >
            <span className="mt-px shrink-0 text-sm">
              {message.type === 'error' ? '✕' : '✓'}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !passwordsMatch || !password}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {loading ? 'Atualizando...' : 'Atualizar senha'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="/" className="text-xs text-emerald-400 transition-colors hover:text-emerald-300">
          Voltar para login
        </a>
      </div>
    </div>
  );
}
