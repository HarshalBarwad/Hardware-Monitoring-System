import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reports, deviceEvents, devices, computers } from '@/db/schema';
import { eq, desc, gte, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const allReports = await db.select().from(reports).orderBy(desc(reports.createdAt));

    // Apply filters
    const filteredReports = allReports.filter(r => {
      if (type && r.type !== type) return false;
      return true;
    });

    const total = filteredReports.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedReports = filteredReports.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginatedReports,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch reports',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, periodStart, periodEnd } = body;

    if (!type || !periodStart || !periodEnd) {
      return NextResponse.json({
        success: false,
        message: 'Type, period start, and period end are required',
      }, { status: 400 });
    }

    // Generate report based on type
    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    let reportData = {
      totalEvents: 0,
      connected: 0,
      disconnected: 0,
      enabled: 0,
      disabled: 0,
      critical: 0,
      warning: 0,
      info: 0,
      byDeviceType: {} as Record<string, number>,
      byComputer: {} as Record<string, number>,
    };

    const events = await db.select({
      id: deviceEvents.id,
      eventType: deviceEvents.eventType,
      severity: deviceEvents.severity,
      timestamp: deviceEvents.timestamp,
      deviceId: deviceEvents.deviceId,
      computerId: deviceEvents.computerId,
    })
    .from(deviceEvents)
    .where(gte(deviceEvents.timestamp, startDate));

    const filteredEvents = events.filter(e => {
      const eventDate = new Date(e.timestamp || 0);
      return eventDate <= endDate;
    });

    reportData.totalEvents = filteredEvents.length;
    
    filteredEvents.forEach(e => {
      if (e.eventType === 'connected') reportData.connected++;
      else if (e.eventType === 'disconnected') reportData.disconnected++;
      else if (e.eventType === 'enabled') reportData.enabled++;
      else if (e.eventType === 'disabled') reportData.disabled++;

      if (e.severity === 'critical') reportData.critical++;
      else if (e.severity === 'warning') reportData.warning++;
      else if (e.severity === 'info') reportData.info++;
    });

    const newReport = await db.insert(reports).values({
      type,
      periodStart: startDate,
      periodEnd: endDate,
      fileUrl: `/reports/${type}-${Date.now()}.pdf`,
    }).returning();

    return NextResponse.json({
      success: true,
      data: {
        report: newReport[0],
        summary: reportData,
      },
      message: 'Report generated successfully',
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate report',
    }, { status: 500 });
  }
}
