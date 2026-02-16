import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-6 text-white">
      <div className="text-center">
        <p className="text-7xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </span>
        </p>
        <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-gray-400">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Ir para o início
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
          >
            Página de login
          </Link>
        </div>
      </div>
    </div>
  );
}
