import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { computers, devices } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const allComputers = await db.select().from(computers).orderBy(desc(computers.lastOnline));

    // Apply filters
    const filteredComputers = allComputers.filter(c => {
      if (search) {
        const searchLower = search.toLowerCase();
        const match = 
          c.name.toLowerCase().includes(searchLower) ||
          c.username.toLowerCase().includes(searchLower) ||
          c.ipAddress.includes(searchLower) ||
          c.macAddress.toLowerCase().includes(searchLower);
        if (!match) return false;
      }
      if (status && c.status !== status) return false;
      return true;
    });

    const total = filteredComputers.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedComputers = filteredComputers.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginatedComputers,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching computers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch computers',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, ipAddress, macAddress, operatingSystem } = body;

    if (!name || !username || !ipAddress || !macAddress) {
      return NextResponse.json({
        success: false,
        message: 'Name, username, IP address, and MAC address are required',
      }, { status: 400 });
    }

    const newComputer = await db.insert(computers).values({
      name,
      username,
      ipAddress,
      macAddress,
      operatingSystem: operatingSystem || 'Windows 11 Pro',
      status: 'online',
    }).returning();

    return NextResponse.json({
      success: true,
      data: newComputer[0],
      message: 'Computer registered successfully',
    });
  } catch (error) {
    console.error('Error creating computer:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create computer',
    }, { status: 500 });
  }
}
