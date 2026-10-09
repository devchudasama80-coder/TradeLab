export function calculateAdvancedAnalytics(backtestResult) {
  if (!backtestResult || !backtestResult.trades || backtestResult.trades.length === 0) {
    return {
      sharpeRatio: 0,
      avgTradePnl: 0,
      avgWin: 0,
      avgLoss: 0,
      winLossRatio: 0,
      bestTrade: 0,
      worstTrade: 0,
      totalFees: 0,
      expectancy: 0,
    };
  }

  const trades = backtestResult.trades;
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl < 0);

  const totalFees = trades.reduce((sum, t) => sum + (t.feePaid || 0), 0);
  const sumPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const avgTradePnl = sumPnl / trades.length;

  const totalWinAmount = wins.reduce((sum, t) => sum + t.pnl, 0);
  const totalLossAmount = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));

  const avgWin = wins.length > 0 ? totalWinAmount / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLossAmount / losses.length : 0;
  const winLossRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? 99 : 0;

  const bestTrade = Math.max(...trades.map((t) => t.pnl));
  const worstTrade = Math.min(...trades.map((t) => t.pnl));

  const winRateDecimal = wins.length / trades.length;
  const lossRateDecimal = 1 - winRateDecimal;
  const expectancy = winRateDecimal * avgWin - lossRateDecimal * avgLoss;

  const returns = trades.map((t) => t.returnPct);
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance) || 1;
  const sharpeRatio = (meanReturn / stdDev) * Math.sqrt(252);

  return {
    sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
    avgTradePnl: parseFloat(avgTradePnl.toFixed(2)),
    avgWin: parseFloat(avgWin.toFixed(2)),
    avgLoss: parseFloat(avgLoss.toFixed(2)),
    winLossRatio: parseFloat(winLossRatio.toFixed(2)),
    bestTrade: parseFloat(bestTrade.toFixed(2)),
    worstTrade: parseFloat(worstTrade.toFixed(2)),
    totalFees: parseFloat(totalFees.toFixed(2)),
    expectancy: parseFloat(expectancy.toFixed(2)),
  };
}