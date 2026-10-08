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