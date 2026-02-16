import { BottomNav } from '@/components/navigation/bottom-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
