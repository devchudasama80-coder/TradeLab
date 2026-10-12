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
    let isMounted = true;

    async function fetchLiveTickers() {
      try {
        const res = await fetch('/api/market-data?ticker=true');
        if (res.ok && isMounted) {
          const btc = await res.json();
          const btcChange = Number(btc.change24h || 0);
          const base = [
            {
              pair: 'BTC/USD',
              price: Number(btc.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }),
              change: `${btcChange >= 0 ? '+' : ''}${btcChange.toFixed(2)}%`,
              up: btcChange >= 0,
            },
          ];

          try {
            const multi = await fetch(
              'https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22ETHUSDT%22,%22SOLUSDT%22,%22EURUSDT%22%5D'
            );
            if (multi.ok) {
              const data = await multi.json();
              data.forEach((item) => {
                const ch = parseFloat(item.priceChangePercent);
                base.push({
                  pair: item.symbol.replace('USDT', '/USD'),
                  price: parseFloat(item.lastPrice).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                  change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`,
                  up: ch >= 0,
                });
              });
            }
          } catch (e) {}

          if (isMounted) setTickers(base);
        }
      } catch (err) {}
    }

    async function loadRealBacktest() {
      try {
        const res = await fetch('/api/backtests/run?symbol=BTC/USD&timeframe=1h&strategy=ma_crossover');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.result) setBacktestData(data.result);
        }
      } catch (err) {
      } finally {
        if (isMounted) setLoadingBacktest(false);
      }
    }

    fetchLiveTickers();
    loadRealBacktest();
    const interval = setInterval(fetchLiveTickers, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary bg-trading-grid relative overflow-x-hidden text-text-primary selection:bg-accent-gold/20 selection:text-accent-gold">
      <div className="glow-ambient-gold top-[-100px] left-[12%] pointer-events-none" />
      <div className="glow-ambient-emerald top-[320px] right-[6%] pointer-events-none" />

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-border-primary bg-bg-primary/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <Image
              src="/logo.png"
              alt="DC Funded Trader Logo"
              width={280}
              height={80}
              className="h-7 sm:h-9 md:h-11 w-auto object-contain shrink-0"
              priority
            />
            <span className="text-base sm:text-xl font-extrabold tracking-tight text-text-primary truncate">
              Trade<span className="text-accent-gold">Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href="/login" className="hidden xs:block sm:block">
              <Button variant="ghost" size="sm" className="text-xs px-2 sm:px-3">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" icon={ArrowRight} className="text-xs px-2.5 sm:px-3">
                <span className="hidden sm:inline">Launch Backtester</span>
                <span className="sm:hidden">Launch</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* TICKER TAPE */}
      {tickers.length > 0 && (
        <div className="fixed top-14 md:top-16 left-0 right-0 z-40 border-b border-border-primary/50 bg-bg-card/70 backdrop-blur-md overflow-hidden">
          <motion.div
            className="flex gap-8 sm:gap-10 whitespace-nowrap py-1.5 sm:py-2 px-4"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {[...tickers, ...tickers, ...tickers].map((item, i) => (
              <div
                key={`${item.pair}-${i}`}
                className="flex items-center gap-2 text-[10px] sm:text-xs font-mono shrink-0"
              >
                <span className="text-text-muted font-semibold">{item.pair}</span>
                <span className="text-text-primary font-bold">{item.price}</span>
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                    item.up ? 'text-profit bg-profit/10' : 'text-loss bg-loss/10'
                  }`}
                >
                  {item.up ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  {item.change}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.45 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-5 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Algorithmic Backtesting Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5 leading-[1.15] px-1"
          >
            Validate Your Edge With
            <br />
            <span className="text-accent-gold">Precision Backtesting</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-xs sm:text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-1"
          >
            Test crypto and forex strategies against historical Binance market data
            with realistic fees, slippage, and mathematical position sizing.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-2"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto justify-center">
                Start Backtesting
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" icon={BarChart3} className="w-full sm:w-auto justify-center">
                Open Terminal
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* LIVE TERMINAL PREVIEW */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl mx-auto rounded-xl sm:rounded-2xl border border-border-primary bg-bg-card/80 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border-primary bg-bg-secondary/50">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-loss/70 shrink-0" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-gold/70 shrink-0" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-profit/70 shrink-0" />
              <span className="ml-2 text-[10px] sm:text-[11px] font-mono text-text-muted truncate">
                BTC/USD · 1H · Real Binance OHLCV
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-6 sm:pl-0">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono text-profit tracking-wide">
                BINANCE API LIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3 p-4 sm:p-5 md:p-6 border-b md:border-b-0 md:border-r border-border-primary">
              {loadingBacktest ? (
                <div className="h-40 sm:h-48 flex items-center justify-center text-text-muted gap-2 text-[10px] sm:text-xs font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
                  Processing 500 Binance BTC Candles...
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">
                        Calculated Equity
                      </div>
                      <div className="text-xl sm:text-2xl font-mono font-bold text-profit">
                        $
                        {backtestData?.finalCapital?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono text-profit/80 mt-0.5">
                        {backtestData?.totalReturnPct >= 0 ? '+' : ''}
                        {backtestData?.totalReturnPct}% Net Return
                      </div>
                    </div>
                  </div>

                  <div className="h-28 sm:h-36 rounded-lg bg-bg-tertiary/40 border border-border-primary/50 relative overflow-hidden flex items-end px-2 pb-2 gap-[2px]">
                    {backtestData?.equityCurve?.slice(-25).map((point, i) => {
                      const slice = backtestData.equityCurve.slice(-25);
                      const minEq = Math.min(...slice.map((p) => p.equity));
                      const maxEq = Math.max(...slice.map((p) => p.equity));
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
                  <div className="flex justify-between mt-2 text-[9px] sm:text-[10px] font-mono text-text-muted">
                    <span>Recent 500 Candles</span>
                    <span>Live Computation</span>
                  </div>
                </>
              )}
            </div>

            <div className="md:col-span-2 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 sm:mb-4">
                Calculated Metrics
              </div>
              <div className="space-y-2.5 sm:space-y-3 flex-1">
                {[
                  { k: 'Total Trades', v: backtestData?.totalTrades ?? '...' },
                  { k: 'Win Rate', v: backtestData ? `${backtestData.winRate}%` : '...' },
                  { k: 'Profit Factor', v: backtestData?.profitFactor ?? '...' },
                  { k: 'Max Drawdown', v: backtestData ? `${backtestData.maxDrawdownPct}%` : '...' },
                  { k: 'Risk / Trade', v: '1.0%' },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between text-[11px] sm:text-xs font-mono">
                    <span className="text-text-muted">{row.k}</span>
                    <span className="text-text-primary font-semibold">{row.v}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className="mt-4 sm:mt-5 block">
                <Button variant="primary" size="sm" className="w-full justify-center" icon={ArrowRight}>
                  Launch Interactive Backtester
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 tracking-tight">
              Built for serious <span className="text-accent-gold">quantitative work</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-xs sm:text-sm px-2">
              Everything you need to design, stress-test, and validate trading strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-4 sm:p-5 rounded-xl border border-border-primary bg-bg-card/60 hover:border-border-secondary hover:bg-bg-card transition-all duration-200"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/15 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-accent-gold/15 transition-colors">
                  <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-gold" />
                </div>
                <h3 className="text-sm font-bold text-text-primary mb-1.5">{feature.title}</h3>
                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border-primary py-5 sm:py-6 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DC Funded Trader Logo"
              width={160}
              height={48}
              className="h-6 sm:h-8 w-auto object-contain shrink-0"
            />
            <span className="text-sm font-bold">
              Trade<span className="text-accent-gold">Lab</span>
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-text-muted text-center">
            © 2025 TradeLab. Algorithmic Backtesting Engine.
          </p>
        </div>
      </footer>
    </div>
  );
}