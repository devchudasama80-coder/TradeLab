import { prisma } from '@/lib/database/prisma';
import { verifyPassword, signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = await signJWT({ userId: user.id, email: user.email });

    const response = Response.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.headers.append(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}