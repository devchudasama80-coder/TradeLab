import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-[#07090E] text-[#F0F6FC] flex flex-col font-sans antialiased overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#07090E]">
          {children}
        </main>
      </div>
    </div>
  );
}