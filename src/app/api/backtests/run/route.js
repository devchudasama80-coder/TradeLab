import { fetchHistoricalCandles } from '@/lib/marketData';
import { runBacktest } from '@/lib/engine/backtester';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      strategy = 'ma_crossover',
      symbol = 'BTC/USD',
      timeframe = '1h',
      initialCapital = 10000,
      riskPerTrade = 0.01,
      feeRate = 0.001,
      slippagePct = 0.0005,
      parameters = {},
    } = body;

    const candles = await fetchHistoricalCandles(symbol, timeframe, 500);

    if (!candles || candles.length === 0) {
      return Response.json(
        { error: `Unable to fetch candles for ${symbol} (${timeframe}).` },
        { status: 400 }
      );
    }

    const backtestResult = runBacktest(strategy, candles, {
      initialCapital: parseFloat(initialCapital),
      riskPerTrade: parseFloat(riskPerTrade),
      feeRate: parseFloat(feeRate),
      slippagePct: parseFloat(slippagePct),
      parameters,
    });

    if (!backtestResult) {
      return Response.json(
        { error: 'Insufficient candles to run the selected strategy.' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      symbol,
      timeframe,
      candleCount: candles.length,
      result: backtestResult,
    });
  } catch (error) {
    console.error('Backtest API Error:', error);
    return Response.json(
      { error: 'Internal server error while executing backtest.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTC/USD';
  const timeframe = searchParams.get('timeframe') || '1h';
  const strategy = searchParams.get('strategy') || 'ma_crossover';

  const candles = await fetchHistoricalCandles(symbol, timeframe, 500);

  if (!candles || candles.length === 0) {
    return Response.json(
      { error: 'Failed to retrieve historical market data.' },
      { status: 500 }
    );
  }

  const result = runBacktest(strategy, candles, {
    initialCapital: 10000,
    riskPerTrade: 0.01,
  });

  return Response.json({
    symbol,
    timeframe,
    strategy,
    candleCount: candles.length,
    result,
  });
}