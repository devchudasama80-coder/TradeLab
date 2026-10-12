'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

export default function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [symbol, setSymbol] = useState('BTC/USD');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadTrades() {
      setLoading(true);
      try {
        const res = await fetch('/api/backtests/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            strategy: 'ma_crossover',
            symbol,
            timeframe: '1h',
            initialCapital: 10000,
            riskPerTrade: 1.0,
            stopLossPct: 1.5,
            takeProfitPct: 3.0,
            useStopLoss: true,
            useTakeProfit: true,
            feeRate: 0.1,
            slippagePct: 0.05
          })
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.result && data.result.trades) {
            setTrades(data.result.trades);
          }
        }
      } catch (err) {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTrades();

    return () => {
      isMounted = false;
    };
  }, [symbol, refreshTrigger]);

  const filteredTrades = trades.filter((t) => {
    const tradeIdStr = String(t.id || '').toLowerCase();
    const directionStr = String(t.direction || '').toLowerCase();
    const exitReasonStr = String(t.exitReason || '').toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesSearch =
      tradeIdStr.includes(searchLower) ||
      directionStr.includes(searchLower) ||
      exitReasonStr.includes(searchLower);

    const matchesDirection =
      directionFilter === 'ALL' || t.direction === directionFilter;

    return matchesSearch && matchesDirection;
  });

  const totalTrades = filteredTrades.length;
  const totalPnL = filteredTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const wins = filteredTrades.filter((t) => (t.pnl || 0) > 0).length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0.0';
  const totalFees = filteredTrades.reduce((acc, t) => acc + (t.feePaid || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FC]">
            Execution Trade Logs
          </h1>
          <p className="text-xs text-[#8B949E] mt-1">
            Real-time trade fill auditing, slip costs, and stop/take execution reasons.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-[#0D111A] border border-[#1E2638] rounded-lg px-3 py-1.5 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
          >
            <option value="BTC/USD">BTC/USD (Binance)</option>
            <option value="ETH/USD">ETH/USD (Binance)</option>
            <option value="SOL/USD">SOL/USD (Binance)</option>
            <option value="EUR/USD">EUR/USD (Binance)</option>
            <option value="GBP/USD">GBP/USD (Binance)</option>
          </select>

          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-[#0D111A] border border-[#1E2638] hover:border-[#F59E0B]/40 text-[#8B949E] hover:text-[#F0F6FC] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F59E0B]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1">
            Filtered Trades
          </div>
          <div className="text-xl font-bold font-mono text-[#F0F6FC]">{totalTrades}</div>
        </div>

        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1">
            Net Realized P&amp;L
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              totalPnL >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
            }`}
          >
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1">
            Win Rate
          </div>
          <div className="text-xl font-bold font-mono text-[#F59E0B]">{winRate}%</div>
        </div>

        <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4">
          <div className="text-[#8B949E] text-[11px] font-medium uppercase tracking-wider mb-1">
            Total Fees Paid
          </div>
          <div className="text-xl font-bold font-mono text-[#8B949E]">${totalFees.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Trade ID, Side, Reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#07090E] border border-[#1E2638] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F0F6FC] focus:outline-none focus:border-[#F59E0B]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-[#8B949E] font-medium mr-1">Direction:</span>
          {['ALL', 'BUY', 'SELL'].map((dir) => (
            <button
              key={dir}
              onClick={() => setDirectionFilter(dir)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                directionFilter === dir
                  ? 'bg-[#F59E0B] text-[#07090E] font-bold'
                  : 'bg-[#07090E] border border-[#1E2638] text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0D111A] border border-[#1E2638] rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            <div className="text-xs font-mono text-[#8B949E]">Fetching trade execution history...</div>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#8B949E]">
            No trades match your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#1E2638] bg-[#07090E]/60 text-[#8B949E]">
                  <th className="py-3 px-4 font-semibold"># ID</th>
                  <th className="py-3 px-4 font-semibold">SIDE</th>
                  <th className="py-3 px-4 font-semibold">ENTRY TIME</th>
                  <th className="py-3 px-4 font-semibold text-right">ENTRY PRICE</th>
                  <th className="py-3 px-4 font-semibold">EXIT TIME</th>
                  <th className="py-3 px-4 font-semibold text-right">EXIT PRICE</th>
                  <th className="py-3 px-4 font-semibold">EXIT REASON</th>
                  <th className="py-3 px-4 font-semibold text-right">FEES</th>
                  <th className="py-3 px-4 font-semibold text-right">NET P&amp;L ($)</th>
                  <th className="py-3 px-4 font-semibold text-right">RETURN (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {filteredTrades.map((t) => {
                  const isProfit = (t.pnl || 0) >= 0;
                  const entryDate = t.entryTime
                    ? new Date(t.entryTime * 1000).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-';
                  const exitDate = t.exitTime
                    ? new Date(t.exitTime * 1000).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-';

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#1E2638]/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-[#F0F6FC]">#{t.id}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.direction === 'BUY'
                              ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                              : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                          }`}
                        >
                          {t.direction === 'BUY' ? (
                            <ArrowUpRight className="w-3 h-3 mr-0.5 inline" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-0.5 inline" />
                          )}
                          {t.direction}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#8B949E] text-[11px]">{entryDate}</td>
                      <td className="py-3 px-4 text-right text-[#F0F6FC]">
                        ${Number(t.entryPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-[#8B949E] text-[11px]">{exitDate}</td>
                      <td className="py-3 px-4 text-right text-[#F0F6FC]">
                        ${Number(t.exitPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.exitReason === 'TAKE_PROFIT'
                              ? 'bg-[#10B981]/20 text-[#10B981]'
                              : t.exitReason === 'STOP_LOSS'
                              ? 'bg-[#EF4444]/20 text-[#EF4444]'
                              : 'bg-[#1E2638] text-[#8B949E]'
                          }`}
                        >
                          {t.exitReason || 'SIGNAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[#8B949E]">
                        ${Number(t.feePaid || 0).toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isProfit ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isProfit ? '+' : ''}${Number(t.pnl || 0).toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isProfit ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isProfit ? '+' : ''}${Number(t.returnPct || 0).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}