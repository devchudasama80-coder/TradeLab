import { prisma } from '@/lib/database/prisma';
import { hashPassword, signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = await signJWT({ userId: user.id, email: user.email });

    const response = Response.json(
      { message: 'User registered successfully', user },
      { status: 201 }
    );

    response.headers.append(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}