export function calculateAnalytics(tradesInput = [], initialCapital = 10000, finalCapital = 10000, equityCurve = []) {
  const trades = Array.isArray(tradesInput)
    ? tradesInput
    : (tradesInput && Array.isArray(tradesInput.trades) ? tradesInput.trades : []);

  const totalTrades = trades.length;

  if (totalTrades === 0) {
    return {
      initialCapital,
      finalCapital,
      totalReturnPct: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdownPct: 0,
      averageWin: 0,
      averageLoss: 0,
      maxWin: 0,
      maxLoss: 0,
      expectancy: 0
    };
  }

  let winningTrades = 0;
  let losingTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let maxWin = 0;
  let maxLoss = 0;

  trades.forEach((trade) => {
    if (!trade) return;
    const pnl = Number(trade.pnl || 0);
    if (pnl > 0) {
      winningTrades++;
      grossProfit += pnl;
      if (pnl > maxWin) maxWin = pnl;
    } else if (pnl < 0) {
      losingTrades++;
      grossLoss += Math.abs(pnl);
      if (pnl < maxLoss) maxLoss = pnl;
    }
  });

  const winRate = parseFloat(((winningTrades / totalTrades) * 100).toFixed(2));
  const profitFactor = grossLoss > 0
    ? parseFloat((grossProfit / grossLoss).toFixed(2))
    : grossProfit > 0 ? 999 : 0;

  const totalReturnPct = parseFloat((((finalCapital - initialCapital) / initialCapital) * 100).toFixed(2));

  let peak = initialCapital;
  let maxDrawdown = 0;

  const safeEquityCurve = Array.isArray(equityCurve) ? equityCurve : [];

  safeEquityCurve.forEach((point) => {
    if (!point || typeof point.equity !== 'number') return;
    if (point.equity > peak) {
      peak = point.equity;
    }
    const dd = ((peak - point.equity) / peak) * 100;
    if (dd > maxDrawdown) {
      maxDrawdown = dd;
    }
  });

  const maxDrawdownPct = parseFloat(maxDrawdown.toFixed(2));

  const averageWin = winningTrades > 0 ? parseFloat((grossProfit / winningTrades).toFixed(2)) : 0;
  const averageLoss = losingTrades > 0 ? parseFloat((grossLoss / losingTrades).toFixed(2)) : 0;

  const expectancy = totalTrades > 0
    ? parseFloat((((winRate / 100) * averageWin) - ((1 - winRate / 100) * averageLoss)).toFixed(2))
    : 0;

  return {
    initialCapital,
    finalCapital,
    totalReturnPct,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    profitFactor,
    maxDrawdownPct,
    averageWin,
    averageLoss,
    maxWin,
    maxLoss,
    expectancy
  };
}

export function calculateAdvancedAnalytics(trades, initialCapital, finalCapital, equityCurve) {
  return calculateAnalytics(trades, initialCapital, finalCapital, equityCurve);
}