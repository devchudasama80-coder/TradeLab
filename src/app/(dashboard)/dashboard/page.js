'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Percent,
  Activity,
  ArrowDownRight,
  Play,
  ArrowRight,
  Loader2,
  FlaskConical,
  Radio,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import EquityChart from '@/components/charts/EquityChart';

const PRESETS = [
  { strategy: 'ma_crossover', symbol: 'BTC/USD', timeframe: '1h', label: 'EMA Crossover · BTC' },
  { strategy: 'rsi', symbol: 'ETH/USD', timeframe: '1h', label: 'RSI Reversal · ETH' },
  { strategy: 'macd', symbol: 'SOL/USD', timeframe: '1h', label: 'MACD · SOL' },
  { strategy: 'bollinger', symbol: 'BTC/USD', timeframe: '4h', label: 'Bollinger · BTC 4H' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [primary, setPrimary] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      try {
        const results = await Promise.all(
          PRESETS.map(async (preset) => {
            try {
              const res = await fetch('/api/backtests/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  strategy: preset.strategy,
                  symbol: preset.symbol,
                  timeframe: preset.timeframe,
                  initialCapital: 10000,
                  riskPerTrade: 0.01,
                }),
              });
              const data = await res.json();
              return {
                ...preset,
                ok: res.ok && data.result,
                result: data.result || null,
                candles: data.candles || [],
              };
            } catch (err) {
              return { ...preset, ok: false, result: null, candles: [] };
            }
          })
        );

        if (!isMounted) return;

        const valid = results.filter((r) => r.ok && r.result);
        if (valid.length > 0) {
          setPrimary(valid[0]);
          setRecentRuns(valid);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = primary?.result;
  const isProfit = stats ? stats.totalReturnPct >= 0 : true;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Terminal Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-profit/10 text-profit border border-profit/20">
              <Radio className="w-3 h-3 animate-pulse text-profit" /> LIVE BINANCE OHLCV
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Live strategy performance computed directly from Binance market candles
          </p>
        </div>

        <Link href="/backtester">
          <Button variant="primary" icon={Play}>
            Open Backtester
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="h-80 rounded-xl border border-border-primary bg-bg-card flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
          <span className="text-xs font-mono text-text-muted">
            Fetching live Binance candles & executing strategies...
          </span>
        </div>
      ) : (
        <>
          {/* Stat Cards — Real Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-bg-card rounded-xl border border-border-primary p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                  Net Profit
                </span>
                <div className="p-2 rounded-lg bg-bg-tertiary">
                  <TrendingUp className={`w-4 h-4 ${isProfit ? 'text-profit' : 'text-loss'}`} />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                {stats
                  ? `$${(stats.finalCapital - stats.initialCapital).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : '—'}
              </div>
              <div className={`text-xs font-mono mt-1 ${isProfit ? 'text-profit' : 'text-loss'}`}>
                {stats
                  ? `${isProfit ? '+' : ''}${stats.totalReturnPct}% · $${stats.finalCapital.toLocaleString()}`
                  : '—'}
              </div>
            </div>

            <div className="bg-bg-card rounded-xl border border-border-primary p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                  Win Rate
                </span>
                <div className="p-2 rounded-lg bg-bg-tertiary">
                  <Percent className="w-4 h-4 text-accent-gold" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                {stats ? `${stats.winRate}%` : '—'}
              </div>
              <div className="text-xs font-mono mt-1 text-text-muted">
                {stats
                  ? `${stats.winningTrades}/${stats.totalTrades} winning trades`
                  : '—'}
              </div>
            </div>

            <div className="bg-bg-card rounded-xl border border-border-primary p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                  Profit Factor
                </span>
                <div className="p-2 rounded-lg bg-bg-tertiary">
                  <Activity className="w-4 h-4 text-accent-gold" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                {stats ? stats.profitFactor : '—'}
              </div>
              <div className="text-xs font-mono mt-1 text-text-muted">
                Gross profit / gross loss
              </div>
            </div>

            <div className="bg-bg-card rounded-xl border border-border-primary p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                  Max Drawdown
                </span>
                <div className="p-2 rounded-lg bg-bg-tertiary">
                  <ArrowDownRight className="w-4 h-4 text-loss" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                {stats ? `${stats.maxDrawdownPct}%` : '—'}
              </div>
              <div className="text-xs font-mono mt-1 text-text-muted">
                Peak to trough decline
              </div>
            </div>
          </div>

          {/* Equity + Featured Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-bg-card rounded-xl border border-border-primary p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-text-primary">
                    Live Equity Curve
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {primary
                      ? `${primary.label} · computed from ${primary.candles?.length || 0} Binance candles`
                      : 'Primary strategy equity'}
                  </p>
                </div>
                {stats && (
                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded border ${
                      isProfit
                        ? 'bg-profit/10 text-profit border-profit/20'
                        : 'bg-loss/10 text-loss border-loss/20'
                    }`}
                  >
                    {isProfit ? '+' : ''}
                    {stats.totalReturnPct}%
                  </span>
                )}
              </div>

              {stats?.equityCurve?.length > 0 ? (
                <EquityChart equityCurve={stats.equityCurve} />
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-text-muted font-mono">
                  No equity data available
                </div>
              )}
            </div>

            <div className="bg-bg-card rounded-xl border border-border-primary p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-accent-gold">
                  <FlaskConical className="w-4 h-4" />
                  <h2 className="text-base font-bold text-text-primary">
                    Featured Strategy
                  </h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {primary
                    ? `${primary.label} is live-computed against recent Binance candles with realistic fees and slippage.`
                    : 'Loading strategy...'}
                </p>

                {stats && (
                  <div className="p-3.5 rounded-lg bg-bg-tertiary border border-border-primary space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Final Capital:</span>
                      <span className="text-text-primary font-semibold">
                        ${stats.finalCapital.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Trades:</span>
                      <span className="text-text-primary font-semibold">
                        {stats.totalTrades}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Win Rate:</span>
                      <span className="text-text-primary font-semibold">
                        {stats.winRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Execution Speed:</span>
                      <span className="text-accent-gold font-semibold">
                        {stats.executionTimeMs}ms
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/backtester" className="w-full">
                <Button variant="primary" className="w-full" icon={Play}>
                  Launch Backtester
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Live Runs Table */}
          <div className="bg-bg-card rounded-xl border border-border-primary overflow-hidden">
            <div className="p-6 border-b border-border-primary flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Live Strategy Runs
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Real-time backtests computed on page load from Binance OHLCV
                </p>
              </div>
              <Link href="/backtester">
                <Button variant="ghost" size="sm" icon={ArrowRight}>
                  Run Custom
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-primary bg-bg-tertiary/50 text-text-muted uppercase font-semibold tracking-wider font-mono">
                    <th className="py-3 px-6">Strategy</th>
                    <th className="py-3 px-6">Market</th>
                    <th className="py-3 px-6">Timeframe</th>
                    <th className="py-3 px-6">Trades</th>
                    <th className="py-3 px-6">Win Rate</th>
                    <th className="py-3 px-6">Profit Factor</th>
                    <th className="py-3 px-6 text-right">Net Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary/60 font-mono">
                  {recentRuns.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-text-muted">
                        No live runs available
                      </td>
                    </tr>
                  ) : (
                    recentRuns.map((run) => {
                      const r = run.result;
                      const profit = r.totalReturnPct >= 0;
                      const netPnl = r.finalCapital - r.initialCapital;
                      return (
                        <tr
                          key={`${run.strategy}-${run.symbol}-${run.timeframe}`}
                          className="hover:bg-bg-tertiary/40 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-semibold text-text-primary font-sans text-sm">
                              {run.label}
                            </div>
                            <div className="text-[11px] text-text-muted">
                              {r.executionTimeMs}ms · {r.durationDays}d period
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-text-primary">
                            {run.symbol}
                          </td>
                          <td className="py-4 px-6 text-text-secondary">
                            {run.timeframe}
                          </td>
                          <td className="py-4 px-6 text-text-primary">
                            {r.totalTrades}
                          </td>
                          <td className="py-4 px-6 font-semibold text-text-primary">
                            {r.winRate}%
                          </td>
                          <td className="py-4 px-6 text-text-secondary">
                            {r.profitFactor}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded font-semibold ${
                                profit
                                  ? 'bg-profit/10 text-profit border border-profit/20'
                                  : 'bg-loss/10 text-loss border border-loss/20'
                              }`}
                            >
                              {profit ? '+' : ''}$
                              {netPnl.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{' '}
                              ({profit ? '+' : ''}
                              {r.totalReturnPct}%)
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
        </>
      )}
    </div>
  );
}