import { calculateEMA } from './ema';

export function calculateMACD(
  candles,
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  if (!candles || candles.length < slowPeriod) return [];

  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);

  const macdLine = new Array(candles.length).fill(null);
  const macdCandles = [];

  for (let i = 0; i < candles.length; i++) {
    if (fastEMA[i] !== null && slowEMA[i] !== null) {
      const val = fastEMA[i] - slowEMA[i];
      macdLine[i] = val;
      macdCandles.push({ close: val });
    } else {
      macdCandles.push({ close: 0 });
    }
  }

  const signalLineRaw = calculateEMA(macdCandles, signalPeriod);
  const signalLine = new Array(candles.length).fill(null);
  const histogram = new Array(candles.length).fill(null);

  for (let i = 0; i < candles.length; i++) {
    if (i >= slowPeriod + signalPeriod - 2 && signalLineRaw[i] !== null) {
      signalLine[i] = signalLineRaw[i];
      histogram[i] = macdLine[i] - signalLine[i];
    }
  }

  return {
    macdLine,
    signalLine,
    histogram,
  };
}