const BINANCE_SYMBOL_MAP = {
  'BTC/USD': 'BTCUSDT',
  'ETH/USD': 'ETHUSDT',
  'SOL/USD': 'SOLUSDT',
  'EUR/USD': 'EURUSDT',
  'GBP/USD': 'GBPUSDT',
  'USD/JPY': 'USDJPY',
};

const TIMEFRAME_MAP = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};

export async function fetchHistoricalCandles(symbol = 'BTC/USD', interval = '1h', limit = 500) {
  try {
    const apiSymbol = BINANCE_SYMBOL_MAP[symbol] || symbol.replace('/', '');
    const apiInterval = TIMEFRAME_MAP[interval] || '1h';

    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${apiSymbol}&interval=${apiInterval}&limit=${limit}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Market data provider HTTP error: ${response.status}`);
    }

    const rawData = await response.json();

    const sanitizedCandles = rawData.map((d) => ({
      timestamp: d[0],
      time: Math.floor(d[0] / 1000),
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));

    return sanitizedCandles.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Error in fetchHistoricalCandles:', error);
    return [];
  }
}