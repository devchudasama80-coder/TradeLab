import { getStrategySignals } from './strategies';

export function runBacktest(strategyCode, candles, options = {}) {
  const {
    initialCapital = 10000,
    riskPerTrade = 0.01,
    feeRate = 0.001,
    slippagePct = 0.0005,
    parameters = {},
  } = options;

  if (!candles || candles.length < 20) {
    return null;
  }

  const signals = getStrategySignals(strategyCode, candles, parameters);

  let capital = initialCapital;
  let position = null;
  const trades = [];
  const equityCurve = [];
  let peakCapital = initialCapital;
  let maxDrawdownPct = 0;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const signal = signals[i];

    if (position && (signal === 'SELL' || i === candles.length - 1)) {
      const exitPriceNoSlippage = candle.close;
      const exitPrice = exitPriceNoSlippage * (1 - slippagePct);
      const rawPnl = (exitPrice - position.entryPrice) * position.quantity;
      const exitFee = exitPrice * position.quantity * feeRate;
      const netPnl = rawPnl - exitFee;

      capital += position.investedAmount + netPnl;

      trades.push({
        id: `TR-${trades.length + 1}`,
        direction: 'LONG',
        entryTime: position.entryTime,
        entryPrice: parseFloat(position.entryPrice.toFixed(4)),
        exitTime: candle.time,
        exitPrice: parseFloat(exitPrice.toFixed(4)),
        quantity: parseFloat(position.quantity.toFixed(6)),
        feePaid: parseFloat((position.entryFee + exitFee).toFixed(2)),
        pnl: parseFloat(netPnl.toFixed(2)),
        returnPct: parseFloat(((netPnl / position.investedAmount) * 100).toFixed(2)),
      });

      position = null;
    }

    if (!position && signal === 'BUY' && i < candles.length - 1) {
      const entryPriceNoSlippage = candle.close;
      const entryPrice = entryPriceNoSlippage * (1 + slippagePct);

      const riskAmount = capital * riskPerTrade;
      const investedAmount = Math.min(capital, Math.max(riskAmount * 10, capital * 0.1));
      const entryFee = investedAmount * feeRate;
      const netInvested = investedAmount - entryFee;
      const quantity = netInvested / entryPrice;

      capital -= investedAmount;

      position = {
        entryTime: candle.time,
        entryPrice,
        quantity,
        investedAmount,
        entryFee,
      };
    }

    const currentUnrealizedEquity = position
      ? capital + position.quantity * candle.close
      : capital;

    equityCurve.push({
      time: candle.time,
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

  const winningTrades = trades.filter((t) => t.pnl > 0);
  const losingTrades = trades.filter((t) => t.pnl < 0);

  const totalGrossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalGrossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const profitFactor =
    totalGrossLoss > 0
      ? totalGrossProfit / totalGrossLoss
      : totalGrossProfit > 0
      ? 99
      : 0;

  const totalReturnPct = ((capital - initialCapital) / initialCapital) * 100;

  return {
    strategyCode,
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