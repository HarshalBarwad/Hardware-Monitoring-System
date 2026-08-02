import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { alerts, computers, devices, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const allAlerts = await db.select({
      id: alerts.id,
      type: alerts.type,
      severity: alerts.severity,
      title: alerts.title,
      description: alerts.description,
      status: alerts.status,
      createdAt: alerts.createdAt,
      acknowledgedAt: alerts.acknowledgedAt,
      computer: {
        id: computers.id,
        name: computers.name,
      },
      device: {
        id: devices.id,
        name: devices.name,
        type: devices.type,
      },
    })
    .from(alerts)
    .leftJoin(computers, eq(alerts.computerId, computers.id))
    .leftJoin(devices, eq(alerts.deviceId, devices.id))
    .orderBy(desc(alerts.createdAt));

    // Apply filters
    const filteredAlerts = allAlerts.filter(a => {
      if (severity && a.severity !== severity) return false;
      if (status && a.status !== status) return false;
      if (type && a.type !== type) return false;
      return true;
    });

    const total = filteredAlerts.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedAlerts = filteredAlerts.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginatedAlerts,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch alerts',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({
        success: false,
        message: 'Alert ID and action are required',
      }, { status: 400 });
    }

    if (action === 'acknowledge') {
      await db.update(alerts)
        .set({ status: 'acknowledged', acknowledgedAt: new Date() })
        .where(eq(alerts.id, id));
    } else if (action === 'dismiss') {
      await db.update(alerts)
        .set({ status: 'dismissed' })
        .where(eq(alerts.id, id));
    } else if (action === 'read-all') {
      await db.update(alerts)
        .set({ status: 'acknowledged', acknowledgedAt: new Date() })
        .where(eq(alerts.status, 'unread'));
    }

    return NextResponse.json({
      success: true,
      message: 'Alert updated successfully',
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update alert',
    }, { status: 500 });
  }
}
