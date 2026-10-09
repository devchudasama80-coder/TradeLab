import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/database/prisma';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenCookie = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('token='));

    if (!tokenCookie) {
      return Response.json({ user: null }, { status: 401 });
    }

    const token = tokenCookie.split('=')[1];
    const payload = await verifyJWT(token);

    if (!payload || !payload.userId) {
      return Response.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Response.json({ user: null }, { status: 401 });
    }

    return Response.json({ user });
  } catch (error) {
    return Response.json({ user: null }, { status: 401 });
  }
}