'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  LineChart,
  Brain,
  Layers,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const features = [
  {
    icon: BarChart3,
    title: 'High-Speed Backtesting',
    description:
      'Simulate years of market data tick-by-tick with realistic fill assumptions, exchange fees, and slippage.',
  },
  {
    icon: Brain,
    title: 'Multi-Indicator Logic',
    description:
      'Test Moving Averages, RSI, MACD, and Bollinger Bands individually or chain them for combined entry signals.',
  },
  {
    icon: Shield,
    title: 'Risk & Capital Engine',
    description:
      'Exact account % risk, stop-loss based position sizing, and maximum drawdown controls to protect capital.',
  },
  {
    icon: LineChart,
    title: 'TradingView Charts',
    description:
      'Interactive candlestick charts with precise entry, exit, stop-loss and take-profit markers on every trade.',
  },
  {
    icon: Layers,
    title: 'Multi-Asset Coverage',
    description:
      'Run identical strategy logic across major crypto pairs and forex markets with flexible timeframes.',
  },
  {
    icon: Zap,
    title: 'Institutional Analytics',
    description:
      'Win rate, profit factor, equity curves, drawdown distribution, and risk-adjusted performance ratios.',
  },
];

export default function LandingPage() {
  const [backtestData, setBacktestData] = useState(null);
  const [loadingBacktest, setLoadingBacktest] = useState(true);
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    async function fetchLiveTickers() {
      try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'EURUSDT'];
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`
        );
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((item) => ({
            pair: item.symbol.replace('USDT', '/USD'),
            price: parseFloat(item.lastPrice).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            }),
            change: `${parseFloat(item.priceChangePercent) >= 0 ? '+' : ''}${parseFloat(
              item.priceChangePercent
            ).toFixed(2)}%`,
            up: parseFloat(item.priceChangePercent) >= 0,
          }));
          setTickers(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch live tickers:', err);
      }
    }

    async function loadRealBacktest() {
      try {
        const res = await fetch('/api/backtests/run?symbol=BTCUSDT&interval=1h');
        const data = await res.json();
        if (data.result) {
          setBacktestData(data.result);
        }
      } catch (err) {
        console.error('Error fetching live backtest calculation:', err);
      } finally {
        setLoadingBacktest(false);
      }
    }

    fetchLiveTickers();
    loadRealBacktest();
    const interval = setInterval(fetchLiveTickers, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary bg-trading-grid relative overflow-hidden text-text-primary selection:bg-accent-gold/20 selection:text-accent-gold">
      <div className="glow-ambient-gold top-[-100px] left-[12%]" />
      <div className="glow-ambient-emerald top-[320px] right-[6%]" />

      <nav className="fixed top-0 w-full z-50 border-b border-border-primary bg-bg-primary/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="DC Funded Trader Logo"
              width={280}
              height={80}
              className="h-10 md:h-11 w-auto object-contain shrink-0"
              priority
            />
            <span className="text-xl font-extrabold tracking-tight text-text-primary">
              Trade<span className="text-accent-gold">Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/backtester">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Launch Backtester
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {tickers.length > 0 && (
        <div className="fixed top-16 left-0 right-0 z-40 border-b border-border-primary/50 bg-bg-card/60 backdrop-blur-md overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap py-2 px-4"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          >
            {[...tickers, ...tickers, ...tickers].map((item, i) => (
              <div
                key={`${item.pair}-${i}`}
                className="flex items-center gap-2 text-xs font-mono shrink-0"
              >
                <span className="text-text-muted font-semibold">{item.pair}</span>
                <span className="text-text-primary font-bold">{item.price}</span>
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    item.up ? 'text-profit bg-profit/10' : 'text-loss bg-loss/10'
                  }`}
                >
                  {item.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.change}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      <section className="relative pt-36 pb-16 px-6 z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-[11px] font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              Algorithmic Backtesting Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.1]"
          >
            Validate Your Edge With
            <br />
            <span className="text-accent-gold">Precision Backtesting</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Test crypto and forex strategies against historical Binance market data
            with realistic fees, slippage, and mathematical position sizing.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/backtester">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Start Backtesting
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" icon={BarChart3}>
                Open Terminal
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl mx-auto rounded-2xl border border-border-primary bg-bg-card/80 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary bg-bg-secondary/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-loss/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent-gold/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-profit/70" />
              <span className="ml-3 text-[11px] font-mono text-text-muted">
                BTC/USD · 1H · Real Binance OHLCV Calculation
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <span className="text-[10px] font-mono text-profit tracking-wide">
                BINANCE API LIVE
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-5">
            <div className="md:col-span-3 p-5 md:p-6 border-b md:border-b-0 md:border-r border-border-primary">
              {loadingBacktest ? (
                <div className="h-48 flex items-center justify-center text-text-muted gap-2 text-xs font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
                  Processing 500 Historical Binance BTC Candles...
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">
                        Calculated Equity
                      </div>
                      <div className="text-2xl font-mono font-bold text-profit">
                        ${backtestData?.finalCapital?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs font-mono text-profit/80 mt-0.5">
                        {backtestData?.totalReturnPct >= 0 ? '+' : ''}
                        {backtestData?.totalReturnPct}% Net Return
                      </div>
                    </div>
                  </div>

                  <div className="h-36 rounded-lg bg-bg-tertiary/40 border border-border-primary/50 relative overflow-hidden flex items-end px-2 pb-2 gap-[2px]">
                    {backtestData?.equityCurve?.slice(-25).map((point, i) => {
                      const minEq = Math.min(...backtestData.equityCurve.slice(-25).map((p) => p.equity));
                      const maxEq = Math.max(...backtestData.equityCurve.slice(-25).map((p) => p.equity));
                      const range = maxEq - minEq || 1;
                      const heightPct = Math.max(15, ((point.equity - minEq) / range) * 100);

                      return (
                        <div
                          key={i}
                          style={{ height: `${heightPct}%` }}
                          className="flex-1 rounded-t-[2px] bg-gradient-to-t from-accent-gold/70 to-accent-gold/20"
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-text-muted">
                    <span>Recent 500 Candles</span>
                    <span>Live Computation</span>
                  </div>
                </>
              )}
            </div>

            <div className="md:col-span-2 p-5 md:p-6 flex flex-col justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
                Calculated Metrics
              </div>
              <div className="space-y-3 flex-1">
                {[
                  { k: 'Total Trades', v: backtestData?.totalTrades ?? '...' },
                  { k: 'Win Rate', v: backtestData ? `${backtestData.winRate}%` : '...' },
                  { k: 'Profit Factor', v: backtestData?.profitFactor ?? '...' },
                  { k: 'Max Drawdown', v: backtestData ? `${backtestData.maxDrawdownPct}%` : '...' },
                  { k: 'Risk / Trade', v: '1.0%' },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-text-muted">{row.k}</span>
                    <span className="text-text-primary font-semibold">{row.v}</span>
                  </div>
                ))}
              </div>
              <Link href="/backtester" className="mt-5 block">
                <Button variant="primary" size="sm" className="w-full" icon={ArrowRight}>
                  Launch Interactive Backtester
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              Built for serious <span className="text-accent-gold">quantitative work</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-sm">
              Everything you need to design, stress-test, and validate trading strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 rounded-xl border border-border-primary bg-bg-card/60 hover:border-border-secondary hover:bg-bg-card transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/15 flex items-center justify-center mb-4 group-hover:bg-accent-gold/15 transition-colors">
                  <feature.icon className="w-4 h-4 text-accent-gold" />
                </div>
                <h3 className="text-sm font-bold text-text-primary mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border-primary py-6 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="DC Funded Trader Logo"
              width={160}
              height={48}
              className="h-8 w-auto object-contain shrink-0"
            />
            <span className="text-sm font-bold">
              Trade<span className="text-accent-gold">Lab</span>
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            © 2025 TradeLab. Algorithmic Backtesting Engine.
          </p>
        </div>
      </footer>
    </div>
  );
}