import { calculateEMA } from '@/lib/indicators/ema';
import { calculateRSI } from '@/lib/indicators/rsi';
import { calculateMACD } from '@/lib/indicators/macd';
import { calculateBollingerBands } from '@/lib/indicators/bollinger';

export function getStrategySignals(strategyCode, candles, params = {}) {
  const signals = new Array(candles.length).fill(null);

  if (strategyCode === 'ma_crossover') {
    const fastPeriod = params.fastPeriod || 20;
    const slowPeriod = params.slowPeriod || 50;

    const fastEMA = calculateEMA(candles, fastPeriod);
    const slowEMA = calculateEMA(candles, slowPeriod);

    for (let i = slowPeriod; i < candles.length; i++) {
      const prevFast = fastEMA[i - 1];
      const prevSlow = slowEMA[i - 1];
      const currFast = fastEMA[i];
      const currSlow = slowEMA[i];

      if (prevFast <= prevSlow && currFast > currSlow) {
        signals[i] = 'BUY';
      } else if (prevFast >= prevSlow && currFast < currSlow) {
        signals[i] = 'SELL';
      }
    }
  } else if (strategyCode === 'rsi') {
    const period = params.period || 14;
    const oversold = params.oversold || 30;
    const overbought = params.overbought || 70;

    const rsi = calculateRSI(candles, period);

    for (let i = period + 1; i < candles.length; i++) {
      const prevRSI = rsi[i - 1];
      const currRSI = rsi[i];

      if (prevRSI <= oversold && currRSI > oversold) {
        signals[i] = 'BUY';
      } else if (prevRSI >= overbought && currRSI < overbought) {
        signals[i] = 'SELL';
      }
    }
  } else if (strategyCode === 'macd') {
    const fastPeriod = params.fastPeriod || 12;
    const slowPeriod = params.slowPeriod || 26;
    const signalPeriod = params.signalPeriod || 9;

    const { macdLine, signalLine } = calculateMACD(
      candles,
      fastPeriod,
      slowPeriod,
      signalPeriod
    );

    for (let i = slowPeriod + signalPeriod; i < candles.length; i++) {
      const prevMacd = macdLine[i - 1];
      const prevSig = signalLine[i - 1];
      const currMacd = macdLine[i];
      const currSig = signalLine[i];

      if (prevMacd <= prevSig && currMacd > currSig) {
        signals[i] = 'BUY';
      } else if (prevMacd >= prevSig && currMacd < currSig) {
        signals[i] = 'SELL';
      }
    }
  } else if (strategyCode === 'bollinger') {
    const period = params.period || 20;
    const stdDev = params.stdDev || 2.0;

    const { upperBand, lowerBand } = calculateBollingerBands(
      candles,
      period,
      stdDev
    );

    for (let i = period; i < candles.length; i++) {
      const prevClose = candles[i - 1].close;
      const currClose = candles[i].close;

      if (prevClose <= lowerBand[i - 1] && currClose > lowerBand[i]) {
        signals[i] = 'BUY';
      } else if (prevClose >= upperBand[i - 1] && currClose < upperBand[i]) {
        signals[i] = 'SELL';
      }
    }
  }

  return signals;
}