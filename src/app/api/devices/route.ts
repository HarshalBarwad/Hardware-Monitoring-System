import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { devices, computers } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = db.select({
      id: devices.id,
      name: devices.name,
      type: devices.type,
      computerId: devices.computerId,
      serialNumber: devices.serialNumber,
      vendor: devices.vendor,
      status: devices.status,
      lastSeen: devices.lastSeen,
      createdAt: devices.createdAt,
      computer: {
        id: computers.id,
        name: computers.name,
        ipAddress: computers.ipAddress,
        operatingSystem: computers.operatingSystem,
        status: computers.status,
      },
    })
    .from(devices)
    .leftJoin(computers, eq(devices.computerId, computers.id))
    .orderBy(desc(devices.lastSeen));

    // Apply filters
    const conditions = [];
    if (search) {
      conditions.push(
        like(devices.name, `%${search}%`),
        like(devices.serialNumber, `%${search}%`),
        like(devices.vendor, `%${search}%`),
        like(computers.name, `%${search}%`)
      );
    }
    if (type) {
      conditions.push(eq(devices.type, type as any));
    }
    if (status) {
      conditions.push(eq(devices.status, status as any));
    }

    const allDevices = await query;
    const filteredDevices = allDevices.filter(d => {
      if (search) {
        const searchLower = search.toLowerCase();
        const match = d.name.toLowerCase().includes(searchLower) ||
          d.serialNumber?.toLowerCase().includes(searchLower) ||
          d.vendor?.toLowerCase().includes(searchLower) ||
          d.computer?.name.toLowerCase().includes(searchLower);
        if (!match) return false;
      }
      if (type && d.type !== type) return false;
      if (status && d.status !== status) return false;
      return true;
    });

    const total = filteredDevices.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedDevices = filteredDevices.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginatedDevices,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch devices',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, computerId, serialNumber, vendor } = body;

    if (!name || !type || !computerId) {
      return NextResponse.json({
        success: false,
        message: 'Name, type, and computer ID are required',
      }, { status: 400 });
    }

    const newDevice = await db.insert(devices).values({
      name,
      type,
      computerId,
      serialNumber,
      vendor,
      status: 'active',
    }).returning();

    return NextResponse.json({
      success: true,
      data: newDevice[0],
      message: 'Device added successfully',
    });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create device',
    }, { status: 500 });
  }
}
