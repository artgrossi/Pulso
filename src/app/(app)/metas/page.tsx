import { IntentsList } from '@/components/metas/intents-list';

export default function MetasPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Minhas Metas
            </span>
          </h1>
          <p className="text-xs text-gray-500">Defina objetivos e acompanhe seu progresso</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <IntentsList />
      </main>
    </>
  );
}
