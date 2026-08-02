import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { deviceEvents, devices, computers, users } from '@/db/schema';
import { eq, desc, gte, and, or, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const severity = searchParams.get('severity');
    const eventType = searchParams.get('eventType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const allEvents = await db.select({
      id: deviceEvents.id,
      eventType: deviceEvents.eventType,
      severity: deviceEvents.severity,
      location: deviceEvents.location,
      ipAddress: deviceEvents.ipAddress,
      details: deviceEvents.details,
      timestamp: deviceEvents.timestamp,
      device: {
        id: devices.id,
        name: devices.name,
        type: devices.type,
        serialNumber: devices.serialNumber,
        vendor: devices.vendor,
      },
      computer: {
        id: computers.id,
        name: computers.name,
        operatingSystem: computers.operatingSystem,
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(deviceEvents)
    .leftJoin(devices, eq(deviceEvents.deviceId, devices.id))
    .leftJoin(computers, eq(deviceEvents.computerId, computers.id))
    .leftJoin(users, eq(deviceEvents.userId, users.id))
    .orderBy(desc(deviceEvents.timestamp));

    // Apply filters
    const filteredEvents = allEvents.filter(e => {
      if (search) {
        const searchLower = search.toLowerCase();
        const match = 
          e.device?.name.toLowerCase().includes(searchLower) ||
          e.device?.serialNumber?.toLowerCase().includes(searchLower) ||
          e.computer?.name.toLowerCase().includes(searchLower) ||
          e.user?.name.toLowerCase().includes(searchLower) ||
          e.location?.toLowerCase().includes(searchLower);
        if (!match) return false;
      }
      if (severity && e.severity !== severity) return false;
      if (eventType && e.eventType !== eventType) return false;
      if (startDate) {
        const eventDate = e.timestamp ? new Date(e.timestamp) : null;
        const start = new Date(startDate);
        if (!eventDate || eventDate < start) return false;
      }
      if (endDate) {
        const eventDate = e.timestamp ? new Date(e.timestamp) : null;
        const end = new Date(endDate);
        if (!eventDate || eventDate > end) return false;
      }
      return true;
    });

    const total = filteredEvents.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedEvents = filteredEvents.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginatedEvents,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch events',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, computerId, userId, eventType, severity, location, ipAddress, details } = body;

    if (!deviceId || !computerId || !eventType) {
      return NextResponse.json({
        success: false,
        message: 'Device ID, Computer ID, and Event Type are required',
      }, { status: 400 });
    }

    const newEvent = await db.insert(deviceEvents).values({
      deviceId,
      computerId,
      userId,
      eventType,
      severity: severity || 'info',
      location,
      ipAddress,
      details,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newEvent[0],
      message: 'Event recorded successfully',
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create event',
    }, { status: 500 });
  }
}
