import { calculateEMA } from '@/lib/indicators/ema';
import { calculateRSI } from '@/lib/indicators/rsi';
import { calculateMACD } from '@/lib/indicators/macd';
import { calculateBollingerBands } from '@/lib/indicators/bollinger';
import { calculateStochastic } from '@/lib/indicators/stochastic';
import { calculateSupertrend } from '@/lib/indicators/supertrend';
import { calculateCCI } from '@/lib/indicators/cci';

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

      if (prevFast <= prevSlow && currFast > currSlow) signals[i] = 'BUY';
      else if (prevFast >= prevSlow && currFast < currSlow) signals[i] = 'SELL';
    }
  }

  else if (strategyCode === 'rsi') {
    const period = params.period || 14;
    const oversold = params.oversold || 30;
    const overbought = params.overbought || 70;
    const rsi = calculateRSI(candles, period);

    for (let i = period + 1; i < candles.length; i++) {
      if (rsi[i - 1] <= oversold && rsi[i] > oversold) signals[i] = 'BUY';
      else if (rsi[i - 1] >= overbought && rsi[i] < overbought) signals[i] = 'SELL';
    }
  }

  else if (strategyCode === 'macd') {
    const fastPeriod = params.fastPeriod || 12;
    const slowPeriod = params.slowPeriod || 26;
    const signalPeriod = params.signalPeriod || 9;
    const { macdLine, signalLine } = calculateMACD(candles, fastPeriod, slowPeriod, signalPeriod);

    for (let i = slowPeriod + signalPeriod; i < candles.length; i++) {
      if (macdLine[i - 1] <= signalLine[i - 1] && macdLine[i] > signalLine[i]) signals[i] = 'BUY';
      else if (macdLine[i - 1] >= signalLine[i - 1] && macdLine[i] < signalLine[i]) signals[i] = 'SELL';
    }
  }

  else if (strategyCode === 'bollinger') {
    const period = params.period || 20;
    const stdDev = params.stdDev || 2.0;
    const { upperBand, lowerBand } = calculateBollingerBands(candles, period, stdDev);

    for (let i = period; i < candles.length; i++) {
      if (candles[i - 1].close <= lowerBand[i - 1] && candles[i].close > lowerBand[i]) {
        signals[i] = 'BUY';
      } else if (candles[i - 1].close >= upperBand[i - 1] && candles[i].close < upperBand[i]) {
        signals[i] = 'SELL';
      }
    }
  }

  else if (strategyCode === 'stochastic') {
    const kPeriod = params.kPeriod || 14;
    const dPeriod = params.dPeriod || 3;
    const oversold = params.oversold || 20;
    const overbought = params.overbought || 80;
    const { k, d } = calculateStochastic(candles, kPeriod, dPeriod);

    for (let i = kPeriod + dPeriod; i < candles.length; i++) {
      if (k[i - 1] <= d[i - 1] && k[i] > d[i] && k[i] < oversold + 10) {
        signals[i] = 'BUY';
      } else if (k[i - 1] >= d[i - 1] && k[i] < d[i] && k[i] > overbought - 10) {
        signals[i] = 'SELL';
      }
    }
  }

  else if (strategyCode === 'supertrend') {
    const period = params.period || 10;
    const multiplier = params.multiplier || 3;
    const { direction } = calculateSupertrend(candles, period, multiplier);

    for (let i = period + 1; i < candles.length; i++) {
      if (direction[i - 1] === -1 && direction[i] === 1) signals[i] = 'BUY';
      else if (direction[i - 1] === 1 && direction[i] === -1) signals[i] = 'SELL';
    }
  }

  else if (strategyCode === 'cci') {
    const period = params.period || 20;
    const oversold = params.oversold || -100;
    const overbought = params.overbought || 100;
    const cci = calculateCCI(candles, period);

    for (let i = period + 1; i < candles.length; i++) {
      if (cci[i - 1] <= oversold && cci[i] > oversold) signals[i] = 'BUY';
      else if (cci[i - 1] >= overbought && cci[i] < overbought) signals[i] = 'SELL';
    }
  }

  else if (strategyCode === 'ema_rsi_combo') {
    const fastPeriod = params.fastPeriod || 20;
    const slowPeriod = params.slowPeriod || 50;
    const rsiPeriod = params.rsiPeriod || 14;
    const rsiOversold = params.rsiOversold || 40;
    const rsiOverbought = params.rsiOverbought || 60;

    const fastEMA = calculateEMA(candles, fastPeriod);
    const slowEMA = calculateEMA(candles, slowPeriod);
    const rsi = calculateRSI(candles, rsiPeriod);

    for (let i = Math.max(slowPeriod, rsiPeriod) + 1; i < candles.length; i++) {
      const bullishCross = fastEMA[i - 1] <= slowEMA[i - 1] && fastEMA[i] > slowEMA[i];
      const bearishCross = fastEMA[i - 1] >= slowEMA[i - 1] && fastEMA[i] < slowEMA[i];

      if (bullishCross && rsi[i] > rsiOversold) signals[i] = 'BUY';
      else if (bearishCross && rsi[i] < rsiOverbought) signals[i] = 'SELL';
    }
  }

  return signals;
}