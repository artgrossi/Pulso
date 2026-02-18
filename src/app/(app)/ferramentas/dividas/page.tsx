import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DebtCalculator } from '@/components/ferramentas/debt-calculator';
import Link from 'next/link';

export default async function DividasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Check if tool is unlocked
  const { data: unlock } = await supabase
    .from('user_tool_unlocks')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_slug', 'dividas')
    .single();

  if (!unlock) {
    redirect('/ferramentas');
  }

  return (
    <>
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/ferramentas"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-amber-400">Quitacao de Dividas</h1>
              <p className="text-xs text-gray-500">Compare estrategias para quitar suas dividas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 backdrop-blur-sm">
          <DebtCalculator />
        </div>
      </main>
    </>
  );
}
