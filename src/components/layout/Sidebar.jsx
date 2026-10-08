'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FlaskConical,
  Brain,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  FlaskConical,
  Brain,
  ArrowLeftRight,
  BarChart3,
  Settings,
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Backtester', href: '/backtester', icon: 'FlaskConical', badge: 'Live' },
  { name: 'Strategies', href: '/strategies', icon: 'Brain' },
  { name: 'Trades', href: '/trades', icon: 'ArrowLeftRight' },
  { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col border-r border-border-primary bg-bg-card min-h-screen z-30 select-none"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-primary">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center shadow-md shadow-accent-gold/20">
            <TrendingUp className="w-5 h-5 text-black font-bold" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-base tracking-tight whitespace-nowrap text-text-primary"
              >
                Trade<span className="text-accent-gold">Lab</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-bg-secondary border border-border-primary text-text-muted hover:text-text-primary flex items-center justify-center transition-colors z-40 cursor-pointer shadow-sm"
        aria-label="Toggle sidebar width"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20 font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }
              `}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-accent-gold' : 'text-text-muted group-hover:text-text-primary'
                }`}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-profit/10 text-profit border border-profit/20">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border-primary">
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-bg-tertiary ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-profit animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-profit relative" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-text-primary truncate">
                Engine Active
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                v1.0.0 (JS/WASM)
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}