export function calculateEMA(candles, period) {
  if (!candles || candles.length < period) return [];

  const k = 2 / (period + 1);
  const emaValues = new Array(candles.length).fill(null);

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  let prevEMA = sum / period;
  emaValues[period - 1] = prevEMA;

  for (let i = period; i < candles.length; i++) {
    const currentClose = candles[i].close;
    const currentEMA = currentClose * k + prevEMA * (1 - k);
    emaValues[i] = currentEMA;
    prevEMA = currentEMA;
  }

  return emaValues;
}