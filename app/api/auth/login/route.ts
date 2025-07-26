// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const ORIGIN = 'https://serenity-peach.vercel.app';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  // Preflight
  return NextResponse.json(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    const { username, password }: { username: string; password: string } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const token = await new SignJWT({ id: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(SECRET_KEY));

    // Build the response, set the cookie, and attach CORS headers
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200, headers: CORS_HEADERS }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 3600,
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
