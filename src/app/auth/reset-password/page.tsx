import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Nova senha
            </span>
          </h1>
          <p className="text-sm text-gray-400">Escolha uma nova senha para sua conta</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
