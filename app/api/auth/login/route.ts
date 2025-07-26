import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://serenity-peach.vercel.app',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === 'admin@admin.com' && password === 'admin') {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

      const token = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);

      const response = NextResponse.json(
        { message: 'Login successful' },
        { status: 200 }
      );

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: true, // Always true in production
        sameSite: 'none', // Required for cross-site
        path: '/',
        maxAge: 3600, // 1 hour
      });

      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } else {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email or password' }),
        {
          status: 401,
          headers: CORS_HEADERS,
        }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Something went wrong' }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
