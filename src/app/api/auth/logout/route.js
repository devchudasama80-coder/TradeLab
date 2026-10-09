export async function POST() {
  const response = Response.json({ message: 'Logged out successfully' });

  response.headers.append(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );

  return response;
}