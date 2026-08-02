import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Simple password check (in production, use bcrypt)
function verifyPassword(input: string, hash: string): boolean {
  return Buffer.from(input).toString('base64') === hash;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required',
      }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0 || !verifyPassword(password, user[0].passwordHash)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 });
    }

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(`${user[0].id}:${Date.now()}`).toString('base64');

    const { passwordHash, ...userWithoutPassword } = user[0];

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during login',
    }, { status: 500 });
  }
}
