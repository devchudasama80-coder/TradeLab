import { prisma } from '@/lib/database/prisma';

export async function GET() {
  try {
    const strategies = await prisma.strategy.findMany({
      orderBy: { name: 'asc' },
    });
    return Response.json({ success: true, count: strategies.length, strategies });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch strategies from database.' }, { status: 500 });
  }
}