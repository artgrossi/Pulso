'use client';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl">
        ⚠️
      </div>
      <h2 className="mb-2 text-xl font-bold text-white">Algo deu errado</h2>
      <p className="mb-6 max-w-sm text-sm text-gray-400">
        Ocorreu um erro inesperado. Tente novamente ou volte para o início.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Tentar novamente
        </button>
        <a
          href="/dashboard"
          className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
}
