'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import BacktestForm from '@/components/backtest/BacktestForm';
import TradingViewChart from '@/components/charts/TradingViewChart';
import EquityChart from '@/components/charts/EquityChart';
import TradeTable from '@/components/backtest/TradeTable';
import { TrendingUp, Percent, Activity, ArrowDownRight, Loader2, Clock, Calendar, Zap, Shield, Target,
} from 'lucide-react';

export default function BacktesterPage() {
  const [config, setConfig] = useState({
    strategy: 'ma_crossover',
    symbol: 'BTC/USD',
    timeframe: '1h',
    initialCapital: 10000,
    riskPerTrade: 1.0,
    useStopLoss: true,
    stopLossPct: 1.5,
    useTakeProfit: true,
    takeProfitPct: 3.0,
    feeRate: 0.1,
    slippagePct: 0.05,
    parameters: {
      fastPeriod: 20,
      slowPeriod: 50,
    },
  });

  const [loading, setLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);
  const [candles, setCandles] = useState([]);
  const [activeSymbol, setActiveSymbol] = useState('BTC/USD');

  const executeBacktest = async (targetConfig = config) => {
    setLoading(true);
    try {
      const res = await fetch('/api/backtests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: targetConfig.strategy,
          symbol: targetConfig.symbol,
          timeframe: targetConfig.timeframe,
          initialCapital: Number(targetConfig.initialCapital),
          riskPerTrade: Number(targetConfig.riskPerTrade) / 100,
          feeRate: Number(targetConfig.feeRate || 0.1) / 100,
          slippagePct: Number(targetConfig.slippagePct || 0.05) / 100,
          stopLossPct: Number(targetConfig.stopLossPct || 0),
          takeProfitPct: Number(targetConfig.takeProfitPct || 0),
          useStopLoss: Boolean(targetConfig.useStopLoss),
          useTakeProfit: Boolean(targetConfig.useTakeProfit),
          parameters: targetConfig.parameters,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Backtest failed.');
        return;
      }

      setBacktestResult(data.result);
      if (data.candles) {
        setCandles(data.candles);
      }
      setActiveSymbol(targetConfig.symbol);
      toast.success(
        `Executed ${targetConfig.strategy.toUpperCase()} in ${data.result.executionTimeMs}ms!`
      );
    } catch (err) {
      toast.error('An error occurred during backtest execution.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
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
            feeRate: 0.001,
            slippagePct: 0.0005,
            stopLossPct: 1.5,
            takeProfitPct: 3.0,
            useStopLoss: true,
            useTakeProfit: true,
            parameters: { fastPeriod: 20, slowPeriod: 50 },
          }),
        });

        const data = await res.json();
        if (isMounted && res.ok) {
          setBacktestResult(data.result);
          if (data.candles) {
            setCandles(data.candles);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  const isProfit = backtestResult?.totalReturnPct >= 0;

  const startDateStr = backtestResult?.startTimestamp
    ? new Date(backtestResult.startTimestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const endDateStr = backtestResult?.endTimestamp
    ? new Date(backtestResult.endTimestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
          Backtesting Terminal
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Execute strategy backtests on Binance market candles
        </p>
      </div>

      <BacktestForm
        config={config}
        setConfig={setConfig}
        onRun={() => executeBacktest(config)}
        loading={loading}
      />

      <div className="space-y-4">
        {loading && (
          <div className="h-96 rounded-xl border border-border-primary bg-bg-card flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
            <span className="text-xs font-mono text-text-muted">
              Fetching candles for {config.symbol} & running strategy engine...
            </span>
          </div>
        )}

        {!loading && backtestResult && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-bg-card border border-border-primary text-xs font-mono">
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar className="w-3.5 h-3.5 text-accent-gold" />
                <span>
                  Period: <strong className="text-text-primary">{startDateStr}</strong> →{' '}
                  <strong className="text-text-primary">{endDateStr}</strong> ({backtestResult.durationDays} Days)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Clock className="w-3.5 h-3.5 text-accent-gold" />
                  <span>
                    Candles: <strong className="text-text-primary">{candles.length}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-profit font-semibold">
                  <Zap className="w-3.5 h-3.5 text-profit" />
                  <span>Execution: {backtestResult.executionTimeMs}ms</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                    Final Capital
                  </span>
                  <TrendingUp
                    className={`w-3.5 h-3.5 ${
                      isProfit ? 'text-profit' : 'text-loss'
                    }`}
                  />
                </div>
                <div className="text-xl font-mono font-bold text-text-primary">
                  $
                  {backtestResult.finalCapital.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs font-mono mt-1 ${
                    isProfit ? 'text-profit' : 'text-loss'
                  }`}
                >
                  {isProfit ? '+' : ''}
                  {backtestResult.totalReturnPct}%
                </div>
              </div>

              <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                    Win Rate
                  </span>
                  <Percent className="w-3.5 h-3.5 text-accent-gold" />
                </div>
                <div className="text-xl font-mono font-bold text-text-primary">
                  {backtestResult.winRate}%
                </div>
                <div className="text-xs font-mono mt-1 text-text-muted">
                  {backtestResult.winningTrades}/{backtestResult.totalTrades}{' '}
                  wins
                </div>
              </div>

              <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                    Profit Factor
                  </span>
                  <Activity className="w-3.5 h-3.5 text-accent-gold" />
                </div>
                <div className="text-xl font-mono font-bold text-text-primary">
                  {backtestResult.profitFactor}
                </div>
                <div className="text-xs font-mono mt-1 text-text-muted">
                  Gross win / loss
                </div>
              </div>

              <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                    Max Drawdown
                  </span>
                  <ArrowDownRight className="w-3.5 h-3.5 text-loss" />
                </div>
                <div className="text-xl font-mono font-bold text-text-primary">
                  {backtestResult.maxDrawdownPct}%
                </div>
                <div className="text-xs font-mono mt-1 text-text-muted">
                  Peak to trough
                </div>
              </div>
            </div>

            {/* Risk Exit Breakdown */}
            {(backtestResult.slExits > 0 || backtestResult.tpExits > 0 || backtestResult.signalExits > 0) && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-card border border-border-primary rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-loss/10 border border-loss/20">
                      <Shield className="w-3.5 h-3.5 text-loss" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                        Stop-Loss Exits
                      </div>
                      <div className="text-sm font-mono font-bold text-text-primary">
                        {backtestResult.slExits}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border-primary rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-profit/10 border border-profit/20">
                      <Target className="w-3.5 h-3.5 text-profit" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                        Take-Profit Exits
                      </div>
                      <div className="text-sm font-mono font-bold text-text-primary">
                        {backtestResult.tpExits}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-card border border-border-primary rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-accent-gold/10 border border-accent-gold/20">
                      <Activity className="w-3.5 h-3.5 text-accent-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                        Signal Exits
                      </div>
                      <div className="text-sm font-mono font-bold text-text-primary">
                        {backtestResult.signalExits}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && candles.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Price Chart · Trade Signals
              </h3>
              <span className="text-[10px] font-mono text-text-muted">
                {candles.length} candles · {activeSymbol}
              </span>
            </div>
            <TradingViewChart
              key={`${activeSymbol}-${config.timeframe}-${config.strategy}-${candles.length}`}
              candles={candles}
              trades={backtestResult?.trades || []}
            />
          </div>
        )}

        {/* Equity Curve + Trade Log Split */}
        {!loading && backtestResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 space-y-1.5">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-1">
                Equity Curve
              </h3>
              <EquityChart equityCurve={backtestResult.equityCurve || []} />
            </div>

            <div className="lg:col-span-7 space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Execution Log
                </h3>
                <span className="text-[10px] font-mono text-text-muted">
                  {backtestResult.totalTrades} trades
                </span>
              </div>
              <TradeTable trades={backtestResult.trades || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}