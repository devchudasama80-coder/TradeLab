function calculateSMA(prices, period) {
  const sma = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      sma.push(sum / period);
    }
  }
  return sma;
}

function calculateEMA(prices, period) {
  const ema = [];
  if (!prices || prices.length === 0) return ema;
  const k = 2 / (period + 1);
  let prevEma = prices[0];
  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      ema.push(prevEma);
    } else {
      const val = prices[i] * k + prevEma * (1 - k);
      ema.push(val);
      prevEma = val;
    }
  }
  return ema;
}

function calculateRSI(prices, period = 14) {
  const rsi = [];
  if (!prices || prices.length < period) return prices.map(() => 50);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(50);
    } else if (i === period) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    } else {
      const diff = prices[i] - prices[i - 1];
      const gain = diff >= 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }
  }
  return rsi;
}

function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEma = calculateEMA(prices, fastPeriod);
  const slowEma = calculateEMA(prices, slowPeriod);
  const macdLine = prices.map((_, i) => fastEma[i] - slowEma[i]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  return { macdLine, signalLine };
}

function calculateBollingerBands(prices, period = 20, stdDevMult = 2.0) {
  const sma = calculateSMA(prices, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(prices[i]);
      lower.push(prices[i]);
    } else {
      let sumSq = 0;
      const mean = sma[i] || prices[i];
      for (let j = 0; j < period; j++) {
        sumSq += Math.pow(prices[i - j] - mean, 2);
      }
      const stdDev = Math.sqrt(sumSq / period);
      upper.push(mean + stdDevMult * stdDev);
      lower.push(mean - stdDevMult * stdDev);
    }
  }
  return { upper, lower, middle: sma };
}

export function getStrategySignals(candles = [], strategyCode = 'ma_crossover', params = {}) {
  if (!candles || !Array.isArray(candles) || candles.length === 0) {
    return { signals: [] };
  }

  const closes = candles.map((c) => c.close || 0);
  const signals = candles.map((c) => ({ time: c.time, signal: 'HOLD' }));

  const code = (strategyCode || 'ma_crossover').toLowerCase();

  try {
    if (code === 'ma_crossover' || code === 'ema_crossover') {
      const fastPeriod = parseInt(params.fastPeriod || 20, 10);
      const slowPeriod = parseInt(params.slowPeriod || 50, 10);
      const fastEma = calculateEMA(closes, fastPeriod);
      const slowEma = calculateEMA(closes, slowPeriod);

      for (let i = slowPeriod; i < candles.length; i++) {
        const prevFast = fastEma[i - 1];
        const prevSlow = slowEma[i - 1];
        const currFast = fastEma[i];
        const currSlow = slowEma[i];

        if (prevFast <= prevSlow && currFast > currSlow) {
          signals[i].signal = 'BUY';
        } else if (prevFast >= prevSlow && currFast < currSlow) {
          signals[i].signal = 'SELL';
        }
      }
    } else if (code === 'rsi') {
      const period = parseInt(params.period || 14, 10);
      const oversold = parseFloat(params.oversold || 30);
      const overbought = parseFloat(params.overbought || 70);
      const rsiValues = calculateRSI(closes, period);

      for (let i = period + 1; i < candles.length; i++) {
        const prevRsi = rsiValues[i - 1];
        const currRsi = rsiValues[i];

        if (prevRsi <= oversold && currRsi > oversold) {
          signals[i].signal = 'BUY';
        } else if (prevRsi >= overbought && currRsi < overbought) {
          signals[i].signal = 'SELL';
        }
      }
    } else if (code === 'macd') {
      const fastPeriod = parseInt(params.fastPeriod || 12, 10);
      const slowPeriod = parseInt(params.slowPeriod || 26, 10);
      const signalPeriod = parseInt(params.signalPeriod || 9, 10);
      const { macdLine, signalLine } = calculateMACD(closes, fastPeriod, slowPeriod, signalPeriod);

      for (let i = slowPeriod + signalPeriod; i < candles.length; i++) {
        const prevMacd = macdLine[i - 1];
        const prevSignal = signalLine[i - 1];
        const currMacd = macdLine[i];
        const currSignal = signalLine[i];

        if (prevMacd <= prevSignal && currMacd > currSignal) {
          signals[i].signal = 'BUY';
        } else if (prevMacd >= prevSignal && currMacd < currSignal) {
          signals[i].signal = 'SELL';
        }
      }
    } else if (code === 'bollinger') {
      const period = parseInt(params.period || 20, 10);
      const stdDev = parseFloat(params.stdDev || 2.0);
      const { upper, lower } = calculateBollingerBands(closes, period, stdDev);

      for (let i = period; i < candles.length; i++) {
        if (closes[i] <= lower[i] && closes[i - 1] > lower[i - 1]) {
          signals[i].signal = 'BUY';
        } else if (closes[i] >= upper[i] && closes[i - 1] < upper[i - 1]) {
          signals[i].signal = 'SELL';
        }
      }
    } else {
      const fastEma = calculateEMA(closes, 20);
      const slowEma = calculateEMA(closes, 50);

      for (let i = 50; i < candles.length; i++) {
        if (fastEma[i - 1] <= slowEma[i - 1] && fastEma[i] > slowEma[i]) {
          signals[i].signal = 'BUY';
        } else if (fastEma[i - 1] >= slowEma[i - 1] && fastEma[i] < slowEma[i]) {
          signals[i].signal = 'SELL';
        }
      }
    }
  } catch (err) {
  }

  return { signals };
}