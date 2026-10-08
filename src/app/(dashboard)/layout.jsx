import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Dashboard — TradeLab Terminal',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}