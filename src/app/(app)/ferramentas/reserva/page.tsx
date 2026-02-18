import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EmergencyFundCalculator } from '@/components/ferramentas/emergency-fund-calculator';
import Link from 'next/link';

export default async function ReservaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Reserva is free, but verify unlock exists (auto-created if not)
  const { data: unlock } = await supabase
    .from('user_tool_unlocks')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_slug', 'reserva')
    .single();

  if (!unlock) {
    // Auto-unlock free tool
    await supabase.from('user_tool_unlocks').insert({
      user_id: user.id,
      tool_slug: 'reserva',
      unlock_method: 'free',
      coins_spent: 0,
    });
  }

  return (
    <>
      <header className="border-b border-pulso-border-subtle bg-pulso-elevated/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/ferramentas"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-pulso-muted text-pulso-text-secondary transition-colors hover:bg-pulso-border"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-blue-400">Reserva de Emergencia</h1>
              <p className="text-xs text-pulso-text-secondary">Planeje sua rede de seguranca financeira</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-pulso-border-subtle bg-pulso-elevated shadow-sm p-5 backdrop-blur-sm">
          <EmergencyFundCalculator />
        </div>
      </main>
    </>
  );
}
