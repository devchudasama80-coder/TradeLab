require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.strategy.upsert({
    where: { code: 'ma_crossover' },
    update: {},
    create: {
      name: 'Moving Average Crossover',
      code: 'ma_crossover',
      description: 'EMA Fast / EMA Slow crossover momentum strategy',
      parameters: {
        fastPeriod: 20,
        slowPeriod: 50,
      },
    },
  });

  await prisma.strategy.upsert({
    where: { code: 'rsi' },
    update: {},
    create: {
      name: 'RSI Reversal',
      code: 'rsi',
      description: 'Relative Strength Index overbought and oversold extremes',
      parameters: {
        period: 14,
        oversold: 30,
        overbought: 70,
      },
    },
  });

  await prisma.strategy.upsert({
    where: { code: 'macd' },
    update: {},
    create: {
      name: 'MACD Signal',
      code: 'macd',
      description: 'MACD line and signal line crossovers with histogram confirmation',
      parameters: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
      },
    },
  });

    await prisma.strategy.upsert({
    where: { code: 'stochastic' },
    update: {},
    create: {
      name: 'Stochastic Oscillator',
      code: 'stochastic',
      description: 'Stochastic %K/%D crossover with overbought and oversold filters',
      parameters: { kPeriod: 14, dPeriod: 3, oversold: 20, overbought: 80 },
    },
  });

  await prisma.strategy.upsert({
    where: { code: 'supertrend' },
    update: {},
    create: {
      name: 'Supertrend',
      code: 'supertrend',
      description: 'ATR-based trailing stop trend-following system',
      parameters: { period: 10, multiplier: 3 },
    },
  });

  await prisma.strategy.upsert({
    where: { code: 'cci' },
    update: {},
    create: {
      name: 'CCI Reversal',
      code: 'cci',
      description: 'Commodity Channel Index mean reversion at extreme levels',
      parameters: { period: 20, oversold: -100, overbought: 100 },
    },
  });

  await prisma.strategy.upsert({
    where: { code: 'ema_rsi_combo' },
    update: {},
    create: {
      name: 'EMA + RSI Combo',
      code: 'ema_rsi_combo',
      description: 'EMA crossover confirmed by RSI momentum filter',
      parameters: {
        fastPeriod: 20,
        slowPeriod: 50,
        rsiPeriod: 14,
        rsiOversold: 40,
        rsiOverbought: 60,
      },
    },
  });

  await prisma.strategy.upsert({
    where: { code: 'bollinger' },
    update: {},
    create: {
      name: 'Bollinger Bands Mean Reversion',
      code: 'bollinger',
      description: 'Price standard deviation bands for breakout/mean reversion',
      parameters: {
        period: 20,
        stdDev: 2.0,
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });