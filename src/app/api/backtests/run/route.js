import { NextResponse } from 'next/server';
import { runBacktest } from '@/lib/engine/backtester';
import { fetchHistoricalCandles } from '@/lib/marketData';

function normalizeSymbol(sym) {
  if (!sym) return 'BTC/USD';
  if (sym === 'BTCUSDT' || sym === 'BTC/USD') return 'BTC/USD';
  if (sym === 'ETHUSDT' || sym === 'ETH/USD') return 'ETH/USD';
  if (sym === 'SOLUSDT' || sym === 'SOL/USD') return 'SOL/USD';
  if (sym === 'EURUSDT' || sym === 'EUR/USD') return 'EUR/USD';
  if (sym === 'GBPUSDT' || sym === 'GBP/USD') return 'GBP/USD';
  if (sym === 'USDJPY' || sym === 'USD/JPY') return 'USD/JPY';
  return 'BTC/USD';
}

function normalizeTimeframe(tf) {
  if (!tf) return '1h';
  if (tf === '1m' || tf === '5m' || tf === '15m' || tf === '1h' || tf === '4h' || tf === '1d') return tf;
  return '1h';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSymbol = searchParams.get('symbol') || searchParams.get('pair') || 'BTC/USD';
    const rawTimeframe = searchParams.get('timeframe') || searchParams.get('interval') || '1h';
    const strategy = searchParams.get('strategy') || searchParams.get('strategyCode') || 'ma_crossover';

    const symbol = normalizeSymbol(rawSymbol);
    const timeframe = normalizeTimeframe(rawTimeframe);

    const candles = await fetchHistoricalCandles(symbol, timeframe, 500);

    const result = runBacktest(candles, {
      strategyCode: strategy,
      initialCapital: 10000,
      riskPerTrade: 1.0,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      useStopLoss: true,
      useTakeProfit: true,
      feeRate: 0.1,
      slippagePct: 0.05
    });

    return NextResponse.json({
      success: true,
      symbol,
      timeframe,
      result,
      candles
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (err) {}

    const {
      strategy = body.strategyCode || 'ma_crossover',
      symbol: rawSymbol = 'BTC/USD',
      timeframe: rawTimeframe = '1h',
      initialCapital = 10000,
      riskPerTrade = 1.0,
      stopLossPct = 1.5,
      takeProfitPct = 3.0,
      useStopLoss = true,
      useTakeProfit = true,
      feeRate = 0.1,
      slippagePct = 0.05,
      parameters = {}
    } = body;

    const symbol = normalizeSymbol(rawSymbol);
    const timeframe = normalizeTimeframe(rawTimeframe);

    const candles = await fetchHistoricalCandles(symbol, timeframe, 500);

    const result = runBacktest(candles, {
      strategyCode: strategy,
      initialCapital,
      riskPerTrade,
      stopLossPct,
      takeProfitPct,
      useStopLoss,
      useTakeProfit,
      feeRate,
      slippagePct,
      parameters
    });

    return NextResponse.json({
      success: true,
      symbol,
      timeframe,
      result,
      candles
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}