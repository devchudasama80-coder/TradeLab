import { fetchHistoricalCandles } from '@/lib/marketData';
import { runMACrossoverBacktest } from '@/lib/engine/backtester';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const interval = searchParams.get('interval') || '1h';

  const candles = await fetchHistoricalCandles(symbol, interval, 500);

  if (!candles || candles.length === 0) {
    return Response.json(
      { error: 'Failed to retrieve real historical market data from Binance.' },
      { status: 500 }
    );
  }

  const result = runMACrossoverBacktest(candles, {
    fastPeriod: 20,
    slowPeriod: 50,
    initialCapital: 10000,
    riskPerTrade: 0.01,
  });

  return Response.json({
    symbol,
    interval,
    candleCount: candles.length,
    result,
  });
}