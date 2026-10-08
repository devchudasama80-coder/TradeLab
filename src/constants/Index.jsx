export const APP_NAME = 'TradeLab';
export const APP_DESCRIPTION =
  'Professional algorithmic trading backtesting platform';

export const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Backtester',
    href: '/backtester',
    icon: 'FlaskConical',
  },
  {
    label: 'Strategies',
    href: '/strategies',
    icon: 'Brain',
  },
  {
    label: 'Trades',
    href: '/trades',
    icon: 'ArrowLeftRight',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'BarChart3',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
];

export const SUPPORTED_MARKETS = [
  { value: 'BTC/USD', label: 'BTC/USD (Bitcoin)', type: 'crypto' },
  { value: 'ETH/USD', label: 'ETH/USD (Ethereum)', type: 'crypto' },
  { value: 'SOL/USD', label: 'SOL/USD (Solana)', type: 'crypto' },
  { value: 'EUR/USD', label: 'EUR/USD (Euro / US Dollar)', type: 'forex' },
  { value: 'GBP/USD', label: 'GBP/USD (British Pound)', type: 'forex' },
  { value: 'USD/JPY', label: 'USD/JPY (US Dollar / Yen)', type: 'forex' },
];

export const TIMEFRAMES = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

export const STRATEGIES = [
  {
    value: 'ma_crossover',
    label: 'Moving Average Crossover',
    description: 'EMA Fast / EMA Slow crossover momentum strategy',
  },
  {
    value: 'rsi',
    label: 'RSI Reversal',
    description: 'Relative Strength Index overbought and oversold extremes',
  },
  {
    value: 'macd',
    label: 'MACD Signal',
    description: 'MACD line and signal line crossovers with histogram confirmation',
  },
  {
    value: 'bollinger',
    label: 'Bollinger Bands Mean Reversion',
    description: 'Price standard deviation bands for breakout/mean reversion',
  },
];