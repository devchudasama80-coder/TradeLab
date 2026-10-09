import { prisma } from '@/lib/database/prisma';
import { verifyJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenCookie = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('token='));

    let userId = null;
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      const payload = await verifyJWT(token);
      if (payload) userId = payload.userId;
    }

    const body = await request.json();
    const {
      strategyCode,
      market,
      timeframe,
      initialCapital,
      riskPerTrade,
      result,
    } = body;

    const strategy = await prisma.strategy.findUnique({
      where: { code: strategyCode },
    });

    if (!strategy) {
      return Response.json({ error: 'Strategy not found.' }, { status: 404 });
    }

    const savedBacktest = await prisma.backtest.create({
      data: {
        userId: userId || null,
        strategyId: strategy.id,
        market,
        timeframe,
        initialCapital: parseFloat(initialCapital),
        riskPerTrade: parseFloat(riskPerTrade),
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        result: {
          create: {
            finalCapital: result.finalCapital,
            totalReturnPct: result.totalReturnPct,
            totalTrades: result.totalTrades,
            winRate: result.winRate,
            profitFactor: result.profitFactor,
            maxDrawdown: result.maxDrawdownPct,
          },
        },
      },
      include: {
        result: true,
        strategy: true,
      },
    });

    return Response.json({ success: true, backtest: savedBacktest });
  } catch (error) {
    console.error('Save Backtest Error:', error);
    return Response.json({ error: 'Failed to save backtest to database.' }, { status: 500 });
  }
}