import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Dashboard — TradeLab Terminal',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary bg-trading-grid relative flex overflow-hidden">
      <div className="glow-ambient-gold top-[-100px] left-[200px]" />
      <div className="glow-ambient-emerald bottom-[-100px] right-[100px]" />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}