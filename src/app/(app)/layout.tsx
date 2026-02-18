import { BottomNav } from '@/components/navigation/bottom-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 text-gray-900 pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
