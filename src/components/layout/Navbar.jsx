'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Play, Search, User, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [ticker, setTicker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveBtcPrice() {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
        if (res.ok) {
          const data = await res.json();
          setTicker({
            price: parseFloat(data.lastPrice),
            change: parseFloat(data.priceChangePercent),
          });
        }
      } catch (err) {
        console.error('Failed to fetch live BTC ticker:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveBtcPrice();
    const interval = setInterval(fetchLiveBtcPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = ticker ? ticker.change >= 0 : true;

  return (
    <header className="h-20 border-b border-border-primary bg-bg-card/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search strategies, pairs, backtests..."
            className="w-full rounded-lg bg-bg-tertiary border border-border-primary pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-tertiary border border-border-primary text-xs font-mono">
          <span className="text-text-muted">BTC/USD:</span>
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-gold" />
          ) : ticker ? (
            <>
              <span className={`font-semibold ${isPositive ? 'text-profit' : 'text-loss'}`}>
                ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isPositive ? 'text-profit bg-profit/10' : 'text-loss bg-loss/10'
                }`}
              >
                {isPositive ? '+' : ''}{ticker.change.toFixed(2)}%
              </span>
            </>
          ) : (
            <span className="text-text-muted">Unavailable</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/backtester">
          <Button variant="primary" size="sm" icon={Play}>
            Run Backtest
          </Button>
        </Link>

        <button
          type="button"
          className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border-primary text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-accent-gold absolute top-2 right-2" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-border-primary">
          <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center text-text-secondary font-mono text-xs font-bold">
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