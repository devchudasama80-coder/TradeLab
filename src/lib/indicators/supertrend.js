export function calculateSupertrend(candles, period = 10, multiplier = 3) {
  if (!candles || candles.length < period) {
    return { supertrend: [], direction: [] };
  }

  const atr = new Array(candles.length).fill(null);
  const upperBand = new Array(candles.length).fill(null);
  const lowerBand = new Array(candles.length).fill(null);
  const supertrend = new Array(candles.length).fill(null);
  const direction = new Array(candles.length).fill(null);

  let trSum = 0;
  for (let i = 1; i <= period; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    );
    trSum += tr;
  }
  atr[period] = trSum / period;

  for (let i = period + 1; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    );
    atr[i] = (atr[i - 1] * (period - 1) + tr) / period;
  }

  for (let i = period; i < candles.length; i++) {
    const hl2 = (candles[i].high + candles[i].low) / 2;
    let basicUpper = hl2 + multiplier * atr[i];
    let basicLower = hl2 - multiplier * atr[i];

    if (i === period) {
      upperBand[i] = basicUpper;
      lowerBand[i] = basicLower;
      supertrend[i] = basicUpper;
      direction[i] = -1;
      continue;
    }

    upperBand[i] =
      basicUpper < upperBand[i - 1] || candles[i - 1].close > upperBand[i - 1]
        ? basicUpper
        : upperBand[i - 1];

    lowerBand[i] =
      basicLower > lowerBand[i - 1] || candles[i - 1].close < lowerBand[i - 1]
        ? basicLower
        : lowerBand[i - 1];

    if (supertrend[i - 1] === upperBand[i - 1]) {
      if (candles[i].close <= upperBand[i]) {
        supertrend[i] = upperBand[i];
        direction[i] = -1;
      } else {
        supertrend[i] = lowerBand[i];
        direction[i] = 1;
      }
    } else {
      if (candles[i].close >= lowerBand[i]) {
        supertrend[i] = lowerBand[i];
        direction[i] = 1;
      } else {
        supertrend[i] = upperBand[i];
        direction[i] = -1;
      }
    }
  }

  return { supertrend, direction };
}