'use client';

import { useState, useEffect } from 'react';
import { calculateAdvancedAnalytics } from '@/lib/engine/analytics';
import {
  Award,
  Target,
  Activity,
  Shield,
  Loader2,
  Radio,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [trades, setTrades] = useState([]);
  const [meta, setMeta] = useState(null);
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
            parameters: { fastPeriod: 20, slowPeriod: 50 },
          }),
        });
        const data = await res.json();
        if (!mounted || !res.ok || !data.result) return;

        const advanced = calculateAdvancedAnalytics(data.result);
        setAnalytics({ ...data.result, ...advanced });
        setTrades(data.result.trades || []);
        setMeta({
          symbol: data.symbol,
          timeframe: data.timeframe,
          candleCount: data.candleCount,
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

  const chartData = trades.map((t, i) => ({
    name: `#${i + 1}`,
    pnl: t.pnl,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Performance Analytics
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Risk-adjusted metrics computed from live Binance candles
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-profit/10 text-profit border border-profit/20">
          <Radio className="w-3 h-3 animate-pulse" /> LIVE
        </span>
      </div>

      {loading ? (
        <div className="h-72 rounded-xl border border-border-primary bg-bg-card flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
          <span className="text-xs font-mono text-text-muted">
            Computing analytics from Binance OHLCV...
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              title="Sharpe Ratio"
              value={analytics?.sharpeRatio ?? '—'}
              sub="Risk adjusted"
              icon={Award}
            />
            <MetricCard
              title="Expectancy / Trade"
              value={analytics ? `$${analytics.expectancy}` : '—'}
              sub="Expected value"
              icon={Target}
            />
            <MetricCard
              title="Win / Loss Ratio"
              value={analytics?.winLossRatio ?? '—'}
              sub="Avg win ÷ avg loss"
              icon={Activity}
            />
            <MetricCard
              title="Total Fees"
              value={analytics ? `$${analytics.totalFees}` : '—'}
              sub="Exchange commissions"
              icon={Shield}
              danger
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-bg-card border border-border-primary rounded-xl p-5 space-y-3">
              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Trade P&L Distribution
                </h2>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {meta
                    ? `${meta.symbol} · ${meta.timeframe} · ${meta.candleCount} candles · ${trades.length} trades`
                    : 'Per-trade net profit and loss'}
                </p>
              </div>

              <div className="h-64 w-full pt-2">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-text-muted font-mono">
                    No trades to chart
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <XAxis
                        dataKey="name"
                        stroke="#64748B"
                        fontSize={10}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={10}
                        tickFormatter={(v) => `$${v}`}
                        tickLine={false}
                      />
                      <ReferenceLine y={0} stroke="#2B354C" strokeDasharray="3 3" />
                      <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const isWin = data.pnl >= 0;
                            return (
                              <div className="bg-bg-secondary border border-border-primary p-2.5 rounded-lg shadow-xl font-mono text-xs">
                                <div className="text-text-muted font-bold mb-1">
                                  Trade {data.name}
                                </div>
                                <div
                                  className={`font-bold ${
                                    isWin ? 'text-profit' : 'text-loss'
                                  }`}
                                >
                                  P&L: {isWin ? '+' : ''}${data.pnl.toFixed(2)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="pnl" radius={[3, 3, 3, 3]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.pnl >= 0 ? '#10B981' : '#EF4444'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-bg-card border border-border-primary rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-text-primary border-b border-border-primary pb-3">
                Execution Breakdown
              </h2>
              <div className="space-y-3 font-mono text-xs">
                <Row label="Average Win" value={analytics ? `+$${analytics.avgWin}` : '—'} good />
                <Row label="Average Loss" value={analytics ? `-$${analytics.avgLoss}` : '—'} bad />
                <Row label="Best Trade" value={analytics ? `+$${analytics.bestTrade}` : '—'} good />
                <Row label="Worst Trade" value={analytics ? `$${analytics.worstTrade}` : '—'} bad />
                <Row label="Win Rate" value={analytics ? `${analytics.winRate}%` : '—'} />
                <Row label="Profit Factor" value={analytics?.profitFactor ?? '—'} gold />
                <Row label="Total Trades" value={analytics?.totalTrades ?? '—'} />
                <Row
                  label="Max Drawdown"
                  value={analytics ? `${analytics.maxDrawdownPct}%` : '—'}
                  bad
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, danger }) {
  return (
    <div className="bg-bg-card border border-border-primary rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
          {title}
        </span>
        <Icon className={`w-3.5 h-3.5 ${danger ? 'text-loss' : 'text-accent-gold'}`} />
      </div>
      <div className="text-xl font-mono font-bold text-text-primary">{value}</div>
      <div className="text-[11px] text-text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function Row({ label, value, good, bad, gold }) {
  const color = good
    ? 'text-profit'
    : bad
    ? 'text-loss'
    : gold
    ? 'text-accent-gold'
    : 'text-text-primary';
  return (
    <div className="flex justify-between py-1 border-b border-border-primary/40 last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}