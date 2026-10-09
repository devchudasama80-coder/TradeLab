'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { Search, Loader2, Radio } from 'lucide-react';

export default function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/backtests/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            strategy: 'ma_crossover',
            symbol: 'BTC/USD',
            timeframe: '1h',
            initialCapital: 10000,
            riskPerTrade: 0.01,
          }),
        });
        const data = await res.json();
        if (!mounted || !res.ok || !data.result) return;
        setTrades(data.result.trades || []);
        setMeta({
          symbol: data.symbol,
          timeframe: data.timeframe,
          strategy: data.result.strategyCode,
          total: data.result.totalTrades,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = trades.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.direction.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Execution Trade History
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {meta
                ? `${meta.strategy} · ${meta.symbol} · ${meta.timeframe} · ${meta.total} trades`
                : 'Live fills from Binance backtest engine'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-profit/10 text-profit border border-profit/20">
            <Radio className="w-3 h-3 animate-pulse" /> LIVE
          </span>
        </div>

        <Input
          placeholder="Search trade ID or side..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
      </div>

      <div className="bg-bg-card border border-border-primary rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border-primary text-[11px] font-mono text-text-muted">
          Showing {filtered.length} of {trades.length} trades
        </div>

        <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono min-w-[800px]">
            <thead className="bg-bg-tertiary sticky top-0 z-10 text-text-muted uppercase tracking-wider text-[10px]">
              <tr className="border-b border-border-primary">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4">Entry Time</th>
                <th className="py-3 px-4">Entry $</th>
                <th className="py-3 px-4">Exit Time</th>
                <th className="py-3 px-4">Exit $</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Fees</th>
                <th className="py-3 px-4 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/40">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-text-muted">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
                      Loading live trades...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-text-muted">
                    No trades found
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const win = t.pnl >= 0;
                  return (
                    <tr key={t.id} className="hover:bg-bg-tertiary/40">
                      <td className="py-2.5 px-4 text-text-muted">{t.id}</td>
                      <td className="py-2.5 px-4 text-profit font-bold">{t.direction}</td>
                      <td className="py-2.5 px-4 text-text-secondary whitespace-nowrap">
                        {new Date(t.entryTime * 1000).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-4 text-text-primary">
                        ${Number(t.entryPrice).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-text-secondary whitespace-nowrap">
                        {new Date(t.exitTime * 1000).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-4 text-text-primary">
                        ${Number(t.exitPrice).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-text-secondary">
                        {Number(t.quantity).toFixed(4)}
                      </td>
                      <td className="py-2.5 px-4 text-text-muted">
                        ${Number(t.feePaid).toFixed(2)}
                      </td>
                      <td
                        className={`py-2.5 px-4 text-right font-bold whitespace-nowrap ${
                          win ? 'text-profit' : 'text-loss'
                        }`}
                      >
                        {win ? '+' : ''}${Number(t.pnl).toFixed(2)}
                        <span className="text-[10px] ml-1 opacity-70">
                          ({win ? '+' : ''}
                          {t.returnPct}%)
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}