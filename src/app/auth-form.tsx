'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

type AuthMode = 'login' | 'signup' | 'forgot';

interface Message {
  type: 'success' | 'error';
  text: string;
}

function translateError(message: string): string {
  const translations: [RegExp, string][] = [
    [/invalid login credentials/i, 'Email ou senha incorretos.'],
    [/email not confirmed/i, 'Confirme seu email antes de entrar.'],
    [/user already registered/i, 'Este email já está cadastrado.'],
    [/password should be at least/i, 'A senha deve ter pelo menos 6 caracteres.'],
    [/signup requires a valid password/i, 'Informe uma senha válida.'],
    [/unable to validate email address/i, 'Formato de email inválido.'],
    [/email rate limit exceeded/i, 'Muitas tentativas. Aguarde alguns minutos.'],
    [/for security purposes, you can only request this after/i, 'Por segurança, aguarde antes de solicitar novamente.'],
    [/email link is invalid or has expired/i, 'O link expirou. Solicite um novo.'],
    [/new password should be different/i, 'A nova senha deve ser diferente da anterior.'],
  ];

  for (const [pattern, translated] of translations) {
    if (pattern.test(message)) return translated;
  }

  return 'Ocorreu um erro. Tente novamente.';
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
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

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const supabase = createClient();

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        setMessage({ type: 'error', text: translateError(error.message) });
      } else {
        setMessage({
          type: 'success',
          text: 'Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada.',
        });
      }
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: translateError(error.message) });
      } else {
        setMessage({
          type: 'success',
          text: 'Conta criada! Verifique seu email para confirmar o cadastro.',
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: translateError(error.message) });
      } else {
        window.location.reload();
      }
    }

    setLoading(false);
  }

  function switchMode(newMode: AuthMode) {
    setMode(newMode);
    setMessage(null);
    setTouched({});
  }

  const subtitles: Record<AuthMode, string> = {
    login: 'Acesse sua conta para continuar',
    signup: 'Comece sua jornada financeira',
    forgot: 'Enviaremos um link para seu email',
  };

  const titles: Record<AuthMode, string> = {
    login: 'Entrar',
    signup: 'Criar conta',
    forgot: 'Recuperar senha',
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 backdrop-blur-sm">
        <h2 className="mb-1 text-center text-xl font-semibold">{titles[mode]}</h2>
        <p className="mb-6 text-center text-xs text-gray-500">{subtitles[mode]}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome completo - apenas signup */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="mb-1 block text-xs font-medium text-gray-400">
                Nome completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                required
                placeholder="Seu nome"
                autoComplete="name"
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              required
              placeholder="seu@email.com"
              autoComplete="email"
              className={`w-full rounded-lg border bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 ${
                touched.email && email && !emailValid
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'
              }`}
            />
            {touched.email && email && !emailValid && (
              <p className="mt-1 text-xs text-red-400">Formato de email inválido</p>
            )}
          </div>

          {/* Senha - não aparece no modo forgot */}
          {mode !== 'forgot' && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-gray-400">
                  Senha
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs text-emerald-400 transition-colors hover:text-emerald-300"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  required
                  minLength={6}
                  placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Indicador de força da senha - apenas signup */}
              {mode === 'signup' && password && (
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
          )}

          {/* Mensagem de feedback */}
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

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={loading || (touched.email && !!email && !emailValid)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading
              ? 'Carregando...'
              : mode === 'login'
                ? 'Entrar'
                : mode === 'signup'
                  ? 'Criar conta'
                  : 'Enviar link de recuperação'}
          </button>
        </form>

        {/* Links de navegação entre modos */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {mode === 'forgot' ? (
            <button
              onClick={() => switchMode('login')}
              className="text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Voltar para login
            </button>
          ) : (
            <p>
              {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                className="text-emerald-400 transition-colors hover:text-emerald-300"
              >
                {mode === 'login' ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
