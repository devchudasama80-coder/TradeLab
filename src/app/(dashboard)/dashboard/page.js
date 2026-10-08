'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Percent,
  Activity,
  ArrowDownRight,
  Play,
  ArrowRight,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Sample recent backtest executions
const recentBacktests = [
  {
    id: 'BT-1049',
    strategy: 'EMA 20/50 Crossover',
    market: 'BTC/USD',
    timeframe: '1H',
    pnl: '+$4,850.20',
    returnPct: '+48.5%',
    winRate: '58.2%',
    profitFactor: '1.72',
    status: 'completed',
    date: '2 hours ago',
  },
  {
    id: 'BT-1048',
    strategy: 'RSI Reversal (30/70)',
    market: 'ETH/USD',
    timeframe: '15m',
    pnl: '+$1,420.00',
    returnPct: '+14.2%',
    winRate: '62.5%',
    profitFactor: '1.89',
    status: 'completed',
    date: '5 hours ago',
  },
  {
    id: 'BT-1047',
    strategy: 'MACD Trend Confirmation',
    market: 'SOL/USD',
    timeframe: '4H',
    pnl: '-$320.50',
    returnPct: '-3.2%',
    winRate: '41.0%',
    profitFactor: '0.88',
    status: 'completed',
    date: '1 day ago',
  },
  {
    id: 'BT-1046',
    strategy: 'Bollinger Mean Reversion',
    market: 'EUR/USD',
    timeframe: '1H',
    pnl: '+$2,110.80',
    returnPct: '+21.1%',
    winRate: '55.0%',
    profitFactor: '1.45',
    status: 'completed',
    date: '2 days ago',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Terminal Overview
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Monitor historical backtesting performance, active metrics, and recent strategy executions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/backtester">
            <Button variant="primary" icon={Play}>
              New Backtest
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Profit"
          value="$14,850.00"
          change="+48.5%"
          changeType="profit"
          icon={TrendingUp}
          delay={0}
        />
        <StatCard
          title="Overall Win Rate"
          value="58.2%"
          change="+4.1% vs benchmark"
          changeType="profit"
          icon={Percent}
          delay={0.05}
        />
        <StatCard
          title="Profit Factor"
          value="1.72"
          change="Strong"
          changeType="profit"
          icon={Activity}
          delay={0.1}
        />
        <StatCard
          title="Max Drawdown"
          value="8.4%"
          change="Low Risk"
          changeType="profit"
          icon={ArrowDownRight}
          delay={0.15}
        />
      </div>

      {/* Chart & Quick Strategy Launch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve Preview Card */}
        <Card className="lg:col-span-2 space-y-4" padding="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Aggregate Portfolio Equity Growth
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Simulated growth from $10,000 baseline across all active strategies
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-profit/10 text-profit border border-profit/20">
              +$4,850.00 (+48.5%)
            </span>
          </div>

          {/* Graphical Mock of Equity Curve */}
          <div className="h-64 w-full bg-bg-tertiary/40 rounded-xl border border-border-primary flex flex-col justify-end p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-profit/5 to-transparent pointer-events-none" />
            
            {/* SVG line preview */}
            <svg className="w-full h-44 text-profit overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,140 Q 80,120 130,100 T 250,70 T 370,40 T 500,15"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              />
              <path
                d="M 0,140 Q 80,120 130,100 T 250,70 T 370,40 T 500,15 L 500,150 L 0,150 Z"
                fill="url(#equityGradient)"
              />
            </svg>

            <div className="flex justify-between text-[11px] font-mono text-text-muted pt-3 border-t border-border-primary/60">
              <span>Jan 2024</span>
              <span>Jun 2024</span>
              <span>Dec 2024</span>
              <span>Today</span>
            </div>
          </div>
        </Card>

        {/* Quick Strategy Launcher */}
        <Card className="space-y-4 flex flex-col justify-between" padding="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent-gold">
              <Sparkles className="w-4 h-4" />
              <h2 className="text-base font-bold text-text-primary">Featured Strategy</h2>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Moving Average Crossover is ready for backtesting against recent 2024–2025 Bitcoin 1H candles.
            </p>

            <div className="p-3.5 rounded-lg bg-bg-tertiary border border-border-primary space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-text-muted">Fast EMA:</span>
                <span className="text-text-primary font-semibold">20 Periods</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Slow EMA:</span>
                <span className="text-text-primary font-semibold">50 Periods</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Risk Per Trade:</span>
                <span className="text-accent-gold font-semibold">1.0%</span>
              </div>
            </div>
          </div>

          <Link href="/backtester" className="w-full">
            <Button variant="primary" className="w-full" icon={Play}>
              Launch EMA Crossover
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Backtests Table */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="p-6 border-b border-border-primary flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">Recent Backtest Runs</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Historical simulated results and performance metrics
            </p>
          </div>
          <Link href="/trades">
            <Button variant="ghost" size="sm" icon={ArrowRight}>
              View All Runs
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-primary bg-bg-tertiary/50 text-text-muted uppercase font-semibold tracking-wider font-mono">
                <th className="py-3 px-6">ID & Strategy</th>
                <th className="py-3 px-6">Market</th>
                <th className="py-3 px-6">Timeframe</th>
                <th className="py-3 px-6">Win Rate</th>
                <th className="py-3 px-6">Profit Factor</th>
                <th className="py-3 px-6 text-right">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/60 font-mono">
              {recentBacktests.map((run) => {
                const isProfit = run.pnl.startsWith('+');
                return (
                  <tr
                    key={run.id}
                    className="hover:bg-bg-tertiary/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-text-primary font-sans text-sm">
                        {run.strategy}
                      </div>
                      <div className="text-[11px] text-text-muted">{run.id} • {run.date}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-text-primary">{run.market}</td>
                    <td className="py-4 px-6 text-text-secondary">{run.timeframe}</td>
                    <td className="py-4 px-6 font-semibold text-text-primary">{run.winRate}</td>
                    <td className="py-4 px-6 text-text-secondary">{run.profitFactor}</td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded font-semibold ${
                          isProfit
                            ? 'bg-profit/10 text-profit border border-profit/20'
                            : 'bg-loss/10 text-loss border border-loss/20'
                        }`}
                      >
                        {run.pnl} ({run.returnPct})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}