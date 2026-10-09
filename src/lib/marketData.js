const BINANCE_SYMBOL_MAP = {
  'BTC/USD': 'BTCUSDT',
  'ETH/USD': 'ETHUSDT',
  'SOL/USD': 'SOLUSDT',
  'EUR/USD': 'EURUSDT',
  'GBP/USD': 'GBPUSDT',
  'USD/JPY': 'BTCUSDT',
  'BTCUSDT': 'BTCUSDT',
  'ETHUSDT': 'ETHUSDT',
  'SOLUSDT': 'SOLUSDT',
  'EURUSDT': 'EURUSDT',
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
    const apiSymbol = BINANCE_SYMBOL_MAP[symbol] || 'BTCUSDT';
    const apiInterval = TIMEFRAME_MAP[interval] || '1h';

    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${apiSymbol}&interval=${apiInterval}&limit=${limit}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      console.warn(`Binance API returned status ${response.status} for ${apiSymbol}. Using fallback.`);
      const fallbackResponse = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${apiInterval}&limit=${limit}`,
        { cache: 'no-store' }
      );
      if (!fallbackResponse.ok) return [];
      const fallbackData = await fallbackResponse.json();
      return parseCandles(fallbackData);
    }

    const rawData = await response.json();
    return parseCandles(rawData);
  } catch (error) {
    console.error('Error in fetchHistoricalCandles:', error);
    return [];
  }
}

function parseCandles(rawData) {
  if (!Array.isArray(rawData)) return [];
  return rawData
    .map((d) => ({
      timestamp: d[0],
      time: Math.floor(d[0] / 1000),
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}