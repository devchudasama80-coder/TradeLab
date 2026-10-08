'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  TrendingUp,
  LineChart,
  Brain,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
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
      'Test Moving Averages, RSI, MACD, and Bollinger Bands individually or chain them for combined entry/exit triggers.',
  },
  {
    icon: Shield,
    title: 'Risk & Capital Engine',
    description:
      'Set exact account % risk, dynamic position sizing based on Stop-Loss distance, and evaluate maximum drawdown.',
  },
  {
    icon: TrendingUp,
    title: 'Fintech Performance Analytics',
    description:
      'Analyze win rates, profit factor, equity curves, drawdown distribution, and risk-adjusted return ratios.',
  },
  {
    icon: LineChart,
    title: 'TradingView Candlesticks',
    description:
      'Inspect historical trades mapped directly onto interactive candlestick charts with precise entry and exit points.',
  },
  {
    icon: Layers,
    title: 'Multi-Asset Support',
    description:
      'Seamlessly run backtests across major Crypto pairs and Forex markets with customizable timeframes.',
  },
];

const stats = [
  { value: '50K+', label: 'Candles Processed' },
  { value: '4+', label: 'Trading Strategies' },
  { value: '6+', label: 'Markets Supported' },
  { value: '< 200ms', label: 'Engine Speed' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-gold/20 selection:text-accent-gold">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border-primary bg-bg-primary/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center shadow-lg shadow-accent-gold/20">
              <TrendingUp className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Trade<span className="text-accent-gold">Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
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

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              Algorithmic Strategy Backtesting Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            Validate Your Edge With
            <br />
            <span className="text-accent-gold">Precision Backtesting</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Test crypto and forex quantitative strategies against historical price
            action. Real fee modeling, stop-loss calculations, and institutional
            performance analytics.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
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

      {/* Stats Section */}
      <section className="py-14 px-6 border-y border-border-primary bg-bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-mono font-bold text-accent-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-text-muted font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Engineered For Serious
              <span className="text-accent-gold"> Quantitative Traders</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm md:text-base">
              Eliminate guesswork. Build, refine, and stress-test your trading strategies
              with reliable historical metrics before risking real capital.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
                className="group p-6 rounded-xl bg-bg-card border border-border-primary hover:border-border-secondary transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center mb-5 group-hover:bg-accent-gold/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-accent-gold" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-2xl bg-gradient-to-b from-bg-card to-bg-secondary border border-border-primary shadow-2xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to Run Your First Backtest?
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto text-sm md:text-base">
            Select an asset, pick a timeframe, configure your risk parameters, and evaluate
            strategy performance in seconds.
          </p>
          <Link href="/backtester">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Launch Backtesting Terminal
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-primary py-8 px-6 bg-bg-card/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent-gold flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-bold">TradeLab</span>
          </div>
          <p className="text-xs text-text-muted">
  &copy; 2025 TradeLab. Algorithmic Backtesting Engine.
</p>
        </div>
      </footer>
    </div>
  );
}