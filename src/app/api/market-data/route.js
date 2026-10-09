import { fetchHistoricalCandles } from '@/lib/marketData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'BTC/USD';
    const timeframe = searchParams.get('timeframe') || '1h';
    const limitParam = searchParams.get('limit') || '500';

    const limit = Math.min(Math.max(parseInt(limitParam, 10) || 500, 10), 1000);

    const candles = await fetchHistoricalCandles(symbol, timeframe, limit);

    if (!candles || candles.length === 0) {
      return Response.json(
        { error: `No market data returned for ${symbol} (${timeframe}).` },
        { status: 404 }
      );
    }

    return Response.json({
      symbol,
      timeframe,
      count: candles.length,
      firstCandle: candles[0],
      lastCandle: candles[candles.length - 1],
      candles,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to retrieve historical market data.' },
      { status: 500 }
    );
  }
}