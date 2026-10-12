'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  Cpu,
  History,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Backtester', href: '/backtester', icon: BarChart2, badge: 'Live' },
  { name: 'Strategies', href: '/strategies', icon: Cpu },
  { name: 'Trades', href: '/trades', icon: History },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* DESKTOP LEFT SIDEBAR */}
      <aside
        className={`hidden md:flex bg-[#0D111A] border-r border-[#1E2638] flex-col justify-between transition-all duration-300 h-full flex-shrink-0 select-none z-30 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-2 mb-2 text-xs font-mono text-[#8B949E]">
            {!collapsed && <span className="uppercase tracking-wider text-[10px]">Navigation</span>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-[#1E2638] text-[#8B949E] hover:text-[#F0F6FC] transition-colors ml-auto"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E2638] text-[#F59E0B] border-l-2 border-[#F59E0B] shadow-sm'
                    : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#1E2638]/50'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#F59E0B]' : 'text-[#8B949E]'}`} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 font-mono px-1.5 py-0.2 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-[#1E2638]">
          {!collapsed ? (
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#8B949E]">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Engine v2.4 Active</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#07090E]/95 backdrop-blur-md border-t border-[#1E2638] z-50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-[#F59E0B]' : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F59E0B]' : ''}`} />
                <span className={`text-[9px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}