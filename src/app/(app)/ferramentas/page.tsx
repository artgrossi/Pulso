import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getToolUnlockStatuses } from '@/lib/actions/tools';
import { TOOLS_ORDER } from '@/lib/constants';
import { ToolCard } from '@/components/ferramentas/tool-card';

export default async function FerramentasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_coins')
    .eq('id', user.id)
    .single();

  const toolStatuses = await getToolUnlockStatuses();
  const unlockedCount = toolStatuses.filter(s => s.unlocked).length;
  const totalTools = TOOLS_ORDER.length;

  return (
    <>
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">
                <span className="pulso-gradient-text">
                  Ferramentas
                </span>
              </h1>
              <p className="text-xs text-gray-500">Calculadoras para decisoes financeiras</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
              <span className="text-xs">🔓</span>
              <span className="text-xs font-medium text-gray-600">
                {unlockedCount}/{totalTools}
              </span>
            </div>
          </div>

          {/* Overall unlock progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${(unlockedCount / totalTools) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-4">
          {toolStatuses.map((status) => (
            <ToolCard
              key={status.slug}
              status={status}
              totalCoins={profile?.total_coins ?? 0}
            />
          ))}
        </div>

        {/* Hint for locked tools */}
        {unlockedCount < totalTools && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">
              Complete conteudos, mantenha seu streak ou gaste moedas para desbloquear novas ferramentas!
            </p>
          </div>
        )}
      </main>
    </>
  );
}
