import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { BottomNav } from '@/components/layout/bottom-nav';
import { AppHeader } from '@/components/layout/app-header';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Desktop sidebar */}
      <SidebarNav />

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <AppHeader totalCoins={profile?.total_coins ?? 0} />

        {/* Page content */}
        <main className="flex-1 px-4 py-6 pb-20 sm:pb-6">
          <div className="mx-auto max-w-2xl">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </div>
  );
}
