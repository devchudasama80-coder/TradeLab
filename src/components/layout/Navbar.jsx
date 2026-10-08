'use client';

import Link from 'next/link';
import { Bell, Play, Search, User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-border-primary bg-bg-card/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Quick Search / Context */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search strategies, pairs, backtests..."
            className="w-full rounded-lg bg-bg-tertiary border border-border-primary pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {/* Live Market Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-bg-tertiary border border-border-primary text-xs font-mono">
          <span className="text-text-muted">BTC/USD:</span>
          <span className="text-profit font-semibold">$94,820.50</span>
          <span className="text-profit text-[10px] bg-profit/10 px-1 rounded">+2.4%</span>
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-3">
        <Link href="/backtester">
          <Button variant="primary" size="sm" icon={Play}>
            Run Backtest
          </Button>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border-primary text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-accent-gold absolute top-2 right-2" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border-primary">
          <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center text-text-secondary font-mono text-xs font-bold">
            <User className="w-4 h-4 text-accent-gold" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-primary">Quant Trader</span>
            <span className="text-[10px] text-text-muted font-mono">Pro Account</span>
          </div>
        </div>
      </div>
    </header>
  );
}