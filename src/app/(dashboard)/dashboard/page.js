'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  BarChart2,
  Clock,
  Play
} from 'lucide-react';
import EquityChart from '@/components/charts/EquityChart';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mainResult, setMainResult] = useState(null);
  const [presetResults, setPresetResults] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      try {
        const presets = [
          { strategy: 'ma_crossover', symbol: 'BTC/USD', timeframe: '1h', title: 'EMA Crossover (BTC 1h)' },
          { strategy: 'rsi', symbol: 'ETH/USD', timeframe: '1h', title: 'RSI Reversal (ETH 1h)' },
          { strategy: 'macd', symbol: 'SOL/USD', timeframe: '1h', title: 'MACD Momentum (SOL 1h)' },
          { strategy: 'bollinger', symbol: 'BTC/USD', timeframe: '4h', title: 'Bollinger Bands (BTC 4h)' }
        ];

        const requests = presets.map((p) =>
          fetch('/api/backtests/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              strategy: p.strategy,
              symbol: p.symbol,
              timeframe: p.timeframe,
              initialCapital: 10000,
              riskPerTrade: 1.0,
              stopLossPct: 1.5,
              takeProfitPct: 3.0,
              useStopLoss: true,
              useTakeProfit: true,
              feeRate: 0.1,
              slippagePct: 0.05
            })
          }).then((res) => (res.ok ? res.json() : null))
        );

        const responses = await Promise.all(requests);

        if (isMounted) {
          const validResults = responses
            .map((res, idx) => {
              if (res && res.result) {
                return {
                  ...res.result,
                  title: presets[idx].title,
                  symbol: presets[idx].symbol,
                  timeframe: presets[idx].timeframe
                };
              }
              return null;
            })
            .filter(Boolean);

          if (validResults.length > 0) {
            setMainResult(validResults[0]);
            setPresetResults(validResults);
          }
        }
      } catch (err) {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const netPnl = mainResult ? mainResult.finalCapital - mainResult.initialCapital : 0;
  const returnPct = mainResult ? mainResult.totalReturnPct : 0;
  const isPositive = netPnl >= 0;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FC]">
              Terminal Overview
            </h1>
            <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 font-mono px-2 py-0.5 rounded flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>LIVE BINANCE OHLCV</span>
            </span>
          </div>
          <p className="text-xs text-[#8B949E] mt-1">
            Live strategy performance computed directly from Binance market candles.
          </p>
        </div>

        <Link
          href="/backtester"
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#07090E] px-4 py-2 rounded-lg font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-[#07090E]" />
          <span>Open Backtester</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4 relative overflow-hidden">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Net Profit</span>
            <DollarSign className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          {loading ? (
            <div className="h-8 bg-[#1E2638]/40 animate-pulse rounded my-1" />
          ) : (
            <div
              className={`text-2xl font-bold font-mono ${
                isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            >
              {isPositive ? '+' : ''}${netPnl.toFixed(2)}
            </div>
          )}
          <div className="text-[11px] font-mono text-[#8B949E] mt-1 flex items-center space-x-2">
            <span className={isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}>
              {isPositive ? '+' : ''}{returnPct}%
            </span>
            <span>•</span>
            <span>Capital: ${mainResult ? mainResult.finalCapital.toFixed(2) : '10,000.00'}</span>
          </div>
        </div>

        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Win Rate</span>
            <Percent className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          {loading ? (
            <div className="h-8 bg-[#1E2638]/40 animate-pulse rounded my-1" />
          ) : (
            <div className="text-2xl font-bold font-mono text-[#F0F6FC]">
              {mainResult ? mainResult.winRate : 0}%
            </div>
          )}
          <div className="text-[11px] font-mono text-[#8B949E] mt-1">
            {mainResult ? `${mainResult.winningTrades}/${mainResult.totalTrades} winning trades` : '0 trades'}
          </div>
        </div>

        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Profit Factor</span>
            <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          {loading ? (
            <div className="h-8 bg-[#1E2638]/40 animate-pulse rounded my-1" />
          ) : (
            <div className="text-2xl font-bold font-mono text-[#F0F6FC]">
              {mainResult ? mainResult.profitFactor : 0}
            </div>
          )}
          <div className="text-[11px] font-mono text-[#8B949E] mt-1">
            Gross profit / gross loss
          </div>
        </div>

        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Max Drawdown</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
          </div>
          {loading ? (
            <div className="h-8 bg-[#1E2638]/40 animate-pulse rounded my-1" />
          ) : (
            <div className="text-2xl font-bold font-mono text-[#EF4444]">
              {mainResult ? mainResult.maxDrawdownPct : 0}%
            </div>
          )}
          <div className="text-[11px] font-mono text-[#8B949E] mt-1">
            Peak to trough decline
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#0D111A] border border-[#1E2638] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F0F6FC]">Live Equity Curve</h2>
              <p className="text-xs text-[#8B949E] font-mono">
                {mainResult ? `${mainResult.title || 'EMA Crossover • BTC'} • computed from 500 Binance candles` : 'Loading market data...'}
              </p>
            </div>
            <div
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                isPositive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
              }`}
            >
              {isPositive ? '+' : ''}{returnPct}%
            </div>
          </div>

          <div className="bg-[#07090E] border border-[#1E2638] rounded-lg p-3">
            {loading ? (
              <div className="h-[280px] flex items-center justify-center text-xs font-mono text-[#8B949E]">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-6 h-6 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                  <span>Computing Live Equity Curve...</span>
                </div>
              </div>
            ) : (
              <EquityChart
                data={mainResult ? mainResult.equityCurve : []}
                height={280}
                isPositive={isPositive}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0D111A] border border-[#1E2638] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[#F59E0B]">
              <Zap className="w-4 h-4" />
              <h2 className="text-base font-bold text-[#F0F6FC]">Featured Strategy</h2>
            </div>
            <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">
              {mainResult ? mainResult.title : 'EMA Crossover'} is live-computed against recent Binance candles with realistic fees and slippage.
            </p>

            <div className="mt-6 space-y-3 bg-[#07090E] border border-[#1E2638] p-4 rounded-lg text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Final Capital:</span>
                <span className="text-[#F0F6FC] font-bold">
                  ${mainResult ? mainResult.finalCapital.toFixed(2) : '10,000.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Trades:</span>
                <span className="text-[#F0F6FC] font-bold">
                  {mainResult ? mainResult.totalTrades : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Win Rate:</span>
                <span className="text-[#F59E0B] font-bold">
                  {mainResult ? mainResult.winRate : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Execution Speed:</span>
                <span className="text-[#10B981] font-bold">
                  {mainResult ? mainResult.executionTimeMs : 0}ms
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/backtester"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#07090E] font-bold px-4 py-2.5 rounded-lg shadow-md hover:brightness-110 transition-all text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-[#07090E]" />
            <span>Launch Backtester</span>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F0F6FC]">Live Strategy Runs</h2>
          <span className="text-xs text-[#8B949E] font-mono">Real-time backtests computed on page load from Binance OHLCV</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetResults.map((preset, idx) => {
            const presetPnl = preset.finalCapital - preset.initialCapital;
            const presetPositive = presetPnl >= 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#0D111A] border border-[#1E2638] hover:border-[#F59E0B]/40 rounded-xl p-4 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F0F6FC]">{preset.title}</div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      presetPositive
                        ? 'bg-[#10B981]/10 text-[#10B981]'
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}
                  >
                    {presetPositive ? '+' : ''}{preset.totalReturnPct}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#07090E] p-2.5 rounded-lg border border-[#1E2638]">
                  <div>
                    <span className="text-[#8B949E] block text-[10px]">Net P&amp;L</span>
                    <span className={presetPositive ? 'text-[#10B981] font-bold' : 'text-[#EF4444] font-bold'}>
                      {presetPositive ? '+' : ''}${presetPnl.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8B949E] block text-[10px]">Win Rate</span>
                    <span className="text-[#F0F6FC] font-bold">{preset.winRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E]">
                  <span>{preset.totalTrades} trades</span>
                  <span>Max DD: {preset.maxDrawdownPct}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}