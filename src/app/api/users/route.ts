import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      avatar: users.avatar,
      phone: users.phone,
      department: users.department,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt));

    // Apply filters
    const filteredUsers = allUsers.filter(u => {
      if (search) {
        const searchLower = search.toLowerCase();
        const match = 
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.department?.toLowerCase().includes(searchLower);
        if (!match) return false;
      }
      if (role && u.role !== role) return false;
      return true;
    });

    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch users',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, department, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        message: 'Email, password, and name are required',
      }, { status: 400 });
    }

    const passwordHash = Buffer.from(password).toString('base64');

    const newUser = await db.insert(users).values({
      email,
      passwordHash,
      name,
      role: role || 'viewer',
      department,
      phone,
    }).returning();

    const { passwordHash: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create user',
    }, { status: 500 });
  }
}
