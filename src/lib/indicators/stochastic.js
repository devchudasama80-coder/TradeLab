export function calculateStochastic(candles, kPeriod = 14, dPeriod = 3) {
  if (!candles || candles.length < kPeriod) {
    return { k: [], d: [] };
  }

  const kValues = new Array(candles.length).fill(null);
  const dValues = new Array(candles.length).fill(null);

  for (let i = kPeriod - 1; i < candles.length; i++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;

    for (let j = i - kPeriod + 1; j <= i; j++) {
      if (candles[j].high > highestHigh) highestHigh = candles[j].high;
      if (candles[j].low < lowestLow) lowestLow = candles[j].low;
    }

    const range = highestHigh - lowestLow;
    kValues[i] = range === 0 ? 50 : ((candles[i].close - lowestLow) / range) * 100;
  }

  for (let i = kPeriod - 1 + dPeriod - 1; i < candles.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = i - dPeriod + 1; j <= i; j++) {
      if (kValues[j] !== null) {
        sum += kValues[j];
        count++;
      }
    }
    dValues[i] = count > 0 ? sum / count : null;
  }

  return { k: kValues, d: dValues };
}