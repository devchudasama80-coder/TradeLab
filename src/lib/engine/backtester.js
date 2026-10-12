import { getStrategySignals } from './strategies';
import { calculateAnalytics } from './analytics';

export function runBacktest(candles = [], config = {}) {
  const startTime = Date.now();

  const {
    strategyCode = 'ma_crossover',
    initialCapital = 10000,
    riskPerTrade = 1.0,
    stopLossPct = 1.5,
    takeProfitPct = 3.0,
    useStopLoss = true,
    useTakeProfit = true,
    feeRate = 0.1,
    slippagePct = 0.05,
    parameters = {}
  } = config;

  if (!candles || !Array.isArray(candles) || candles.length === 0) {
    return {
      strategyCode,
      initialCapital,
      finalCapital: initialCapital,
      totalReturnPct: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdownPct: 0,
      executionTimeMs: Date.now() - startTime,
      slExits: 0,
      tpExits: 0,
      signalExits: 0,
      trades: [],
      equityCurve: []
    };
  }

  const { signals } = getStrategySignals(candles, strategyCode, parameters);

  let currentCapital = initialCapital;
  let currentPosition = null;
  const trades = [];
  const equityCurve = [];

  let slExits = 0;
  let tpExits = 0;
  let signalExits = 0;

  equityCurve.push({
    time: candles[0].time,
    equity: initialCapital
  });

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const signal = signals[i] ? signals[i].signal : 'HOLD';

    if (currentPosition) {
      const entryPrice = currentPosition.entryPrice;
      let exitReason = null;
      let exitPrice = candle.close;

      if (currentPosition.direction === 'BUY') {
        const currentReturnPct = ((candle.high - entryPrice) / entryPrice) * 100;
        const currentLossPct = ((entryPrice - candle.low) / entryPrice) * 100;

        if (useTakeProfit && takeProfitPct > 0 && currentReturnPct >= takeProfitPct) {
          exitReason = 'TAKE_PROFIT';
          exitPrice = entryPrice * (1 + takeProfitPct / 100);
          tpExits++;
        } else if (useStopLoss && stopLossPct > 0 && currentLossPct >= stopLossPct) {
          exitReason = 'STOP_LOSS';
          exitPrice = entryPrice * (1 - stopLossPct / 100);
          slExits++;
        } else if (signal === 'SELL') {
          exitReason = 'SIGNAL';
          exitPrice = candle.close;
          signalExits++;
        }
      } else if (currentPosition.direction === 'SELL') {
        const currentReturnPct = ((entryPrice - candle.low) / entryPrice) * 100;
        const currentLossPct = ((candle.high - entryPrice) / entryPrice) * 100;

        if (useTakeProfit && takeProfitPct > 0 && currentReturnPct >= takeProfitPct) {
          exitReason = 'TAKE_PROFIT';
          exitPrice = entryPrice * (1 - takeProfitPct / 100);
          tpExits++;
        } else if (useStopLoss && stopLossPct > 0 && currentLossPct >= stopLossPct) {
          exitReason = 'STOP_LOSS';
          exitPrice = entryPrice * (1 + stopLossPct / 100);
          slExits++;
        } else if (signal === 'BUY') {
          exitReason = 'SIGNAL';
          exitPrice = candle.close;
          signalExits++;
        }
      }

      if (i === candles.length - 1 && !exitReason) {
        exitReason = 'END_OF_DATA';
        exitPrice = candle.close;
      }

      if (exitReason) {
        let grossPnl = 0;
        if (currentPosition.direction === 'BUY') {
          grossPnl = (exitPrice - entryPrice) * currentPosition.quantity;
        } else {
          grossPnl = (entryPrice - exitPrice) * currentPosition.quantity;
        }

        const exitValue = exitPrice * currentPosition.quantity;
        const exitFee = exitValue * (feeRate / 100);
        const exitSlippageCost = exitValue * (slippagePct / 100);

        const netPnl = grossPnl - exitFee - exitSlippageCost;
        const totalFeePaid = currentPosition.entryFee + exitFee + currentPosition.entrySlippageCost;

        currentCapital += currentPosition.capitalAllocated + netPnl;
        const returnPct = (netPnl / currentPosition.capitalAllocated) * 100;

        trades.push({
          id: trades.length + 1,
          direction: currentPosition.direction,
          entryTime: currentPosition.entryTime,
          entryPrice: currentPosition.entryPrice,
          exitTime: candle.time,
          exitPrice,
          quantity: currentPosition.quantity,
          feePaid: totalFeePaid,
          pnl: netPnl,
          returnPct,
          exitReason,
          stopLoss: currentPosition.stopLoss,
          takeProfit: currentPosition.takeProfit,
          riskAmount: currentPosition.riskAmount,
          riskReward: takeProfitPct > 0 && stopLossPct > 0 ? (takeProfitPct / stopLossPct).toFixed(1) : '1.5'
        });

        currentPosition = null;
      }
    }

    if (!currentPosition && (signal === 'BUY' || signal === 'SELL') && i < candles.length - 1) {
      const entryPrice = candle.close;
      const riskAmount = currentCapital * (riskPerTrade / 100);

      const positionSizeByRisk = stopLossPct > 0
        ? (riskAmount / (stopLossPct / 100))
        : (currentCapital * 0.5);

      const capitalToAllocate = Math.min(currentCapital * 0.95, Math.max(positionSizeByRisk, currentCapital * 0.3));
      const rawQuantity = capitalToAllocate / entryPrice;

      const entryValue = entryPrice * rawQuantity;
      const entryFee = entryValue * (feeRate / 100);
      const entrySlippageCost = entryValue * (slippagePct / 100);

      const stopLossPrice = signal === 'BUY'
        ? entryPrice * (1 - stopLossPct / 100)
        : entryPrice * (1 + stopLossPct / 100);

      const takeProfitPrice = signal === 'BUY'
        ? entryPrice * (1 + takeProfitPct / 100)
        : entryPrice * (1 - takeProfitPct / 100);

      currentCapital -= (capitalToAllocate + entryFee + entrySlippageCost);

      currentPosition = {
        direction: signal,
        entryTime: candle.time,
        entryPrice,
        quantity: rawQuantity,
        capitalAllocated: capitalToAllocate,
        entryFee,
        entrySlippageCost,
        stopLoss: stopLossPrice,
        takeProfit: takeProfitPrice,
        riskAmount
      };
    }

    const unclosedValue = currentPosition ? (candle.close * currentPosition.quantity) : 0;
    const currentEquity = currentPosition
      ? currentCapital + unclosedValue
      : currentCapital;

    equityCurve.push({
      time: candle.time,
      equity: currentEquity
    });
  }

  const analytics = calculateAnalytics(trades, initialCapital, currentCapital, equityCurve);
  const executionTimeMs = Date.now() - startTime;

  return {
    strategyCode,
    initialCapital,
    finalCapital: analytics.finalCapital,
    totalReturnPct: analytics.totalReturnPct,
    totalTrades: analytics.totalTrades,
    winningTrades: analytics.winningTrades,
    losingTrades: analytics.losingTrades,
    winRate: analytics.winRate,
    profitFactor: analytics.profitFactor,
    maxDrawdownPct: analytics.maxDrawdownPct,
    executionTimeMs,
    startTimestamp: candles[0] ? candles[0].time : 0,
    endTimestamp: candles[candles.length - 1] ? candles[candles.length - 1].time : 0,
    durationDays: candles.length > 0 ? Math.round((candles[candles.length - 1].time - candles[0].time) / 86400) : 0,
    slExits,
    tpExits,
    signalExits,
    riskConfig: {
      riskPerTrade,
      stopLossPct,
      takeProfitPct,
      feeRate,
      slippagePct,
      useStopLoss,
      useTakeProfit
    },
    trades,
    equityCurve
  };
}

export const runBacktestEngine = runBacktest;