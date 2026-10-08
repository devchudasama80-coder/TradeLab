import { calculateEMA } from '@/lib/indicators/ema';

export function runMACrossoverBacktest(candles, options = {}) {
  const {
    fastPeriod = 20,
    slowPeriod = 50,
    initialCapital = 10000,
    riskPerTrade = 0.01,
    feeRate = 0.001,
  } = options;

  if (!candles || candles.length < slowPeriod) {
    return null;
  }

  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);

  let capital = initialCapital;
  let position = null;
  const trades = [];
  const equityCurve = [];
  let peakCapital = initialCapital;
  let maxDrawdownPct = 0;

  for (let i = slowPeriod; i < candles.length; i++) {
    const currentCandle = candles[i];
    const prevFast = fastEMA[i - 1];
    const prevSlow = slowEMA[i - 1];
    const currFast = fastEMA[i];
    const currSlow = slowEMA[i];

    if (!prevFast || !prevSlow || !currFast || !currSlow) continue;

    const isBullishCrossover = prevFast <= prevSlow && currFast > currSlow;
    const isBearishCrossover = prevFast >= prevSlow && currFast < currSlow;

    if (position && isBearishCrossover) {
      const exitPrice = currentCandle.close;
      const rawPnl = (exitPrice - position.entryPrice) * position.quantity;
      const exitFee = exitPrice * position.quantity * feeRate;
      const netPnl = rawPnl - exitFee;

      capital += position.investedAmount + netPnl;

      trades.push({
        id: `T-${trades.length + 1}`,
        entryTime: position.entryTime,
        entryPrice: position.entryPrice,
        exitTime: currentCandle.time,
        exitPrice: exitPrice,
        quantity: position.quantity,
        feePaid: position.entryFee + exitFee,
        pnl: netPnl,
        returnPct: (netPnl / position.investedAmount) * 100,
      });

      position = null;
    }

    if (!position && isBullishCrossover) {
      const entryPrice = currentCandle.close;
      const riskAmount = capital * riskPerTrade;
      const investedAmount = Math.min(capital, riskAmount * 10);
      const entryFee = investedAmount * feeRate;
      const netInvested = investedAmount - entryFee;
      const quantity = netInvested / entryPrice;

      capital -= investedAmount;

      position = {
        entryTime: currentCandle.time,
        entryPrice: entryPrice,
        quantity: quantity,
        investedAmount: investedAmount,
        entryFee: entryFee,
      };
    }

    const currentUnrealizedEquity = position
      ? capital + position.quantity * currentCandle.close
      : capital;

    equityCurve.push({
      time: currentCandle.time,
      equity: parseFloat(currentUnrealizedEquity.toFixed(2)),
    });

    if (currentUnrealizedEquity > peakCapital) {
      peakCapital = currentUnrealizedEquity;
    }
    const currentDrawdownPct = ((peakCapital - currentUnrealizedEquity) / peakCapital) * 100;
    if (currentDrawdownPct > maxDrawdownPct) {
      maxDrawdownPct = currentDrawdownPct;
    }
  }

  if (position) {
    const lastCandle = candles[candles.length - 1];
    const exitPrice = lastCandle.close;
    const rawPnl = (exitPrice - position.entryPrice) * position.quantity;
    const exitFee = exitPrice * position.quantity * feeRate;
    const netPnl = rawPnl - exitFee;

    capital += position.investedAmount + netPnl;

    trades.push({
      id: `T-${trades.length + 1}`,
      entryTime: position.entryTime,
      entryPrice: position.entryPrice,
      exitTime: lastCandle.time,
      exitPrice: exitPrice,
      quantity: position.quantity,
      feePaid: position.entryFee + exitFee,
      pnl: netPnl,
      returnPct: (netPnl / position.investedAmount) * 100,
    });
  }

  const winningTrades = trades.filter((t) => t.pnl > 0);
  const losingTrades = trades.filter((t) => t.pnl < 0);

  const totalGrossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalGrossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const profitFactor = totalGrossLoss > 0 ? totalGrossProfit / totalGrossLoss : totalGrossProfit > 0 ? 99 : 0;
  const totalReturnPct = ((capital - initialCapital) / initialCapital) * 100;

  return {
    initialCapital,
    finalCapital: parseFloat(capital.toFixed(2)),
    totalReturnPct: parseFloat(totalReturnPct.toFixed(2)),
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: parseFloat(winRate.toFixed(1)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    maxDrawdownPct: parseFloat(maxDrawdownPct.toFixed(1)),
    trades,
    equityCurve,
  };
}