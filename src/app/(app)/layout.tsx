import { BottomNav } from '@/components/navigation/bottom-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-pulso-surface text-pulso-text pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
