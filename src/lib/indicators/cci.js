export function calculateCCI(candles, period = 20) {
  if (!candles || candles.length < period) return [];

  const cci = new Array(candles.length).fill(null);

  for (let i = period - 1; i < candles.length; i++) {
    const typicalPrices = [];
    for (let j = i - period + 1; j <= i; j++) {
      typicalPrices.push((candles[j].high + candles[j].low + candles[j].close) / 3);
    }

    const sma = typicalPrices.reduce((a, b) => a + b, 0) / period;
    const meanDeviation =
      typicalPrices.reduce((sum, tp) => sum + Math.abs(tp - sma), 0) / period;

    const currentTP = typicalPrices[typicalPrices.length - 1];
    cci[i] = meanDeviation === 0 ? 0 : (currentTP - sma) / (0.015 * meanDeviation);
  }

  return cci;
}