export function calculateBollingerBands(candles, period = 20, stdDevMultiplier = 2.0) {
  if (!candles || candles.length < period) return [];

  const upperBand = new Array(candles.length).fill(null);
  const middleBand = new Array(candles.length).fill(null);
  const lowerBand = new Array(candles.length).fill(null);

  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
    const sma = sum / period;
    middleBand[i] = sma;

    let varianceSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      varianceSum += Math.pow(candles[j].close - sma, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    upperBand[i] = sma + stdDev * stdDevMultiplier;
    lowerBand[i] = sma - stdDev * stdDevMultiplier;
  }

  return {
    upperBand,
    middleBand,
    lowerBand,
  };
}