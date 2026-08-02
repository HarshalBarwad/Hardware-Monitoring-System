import { NextResponse } from 'next/server';
import { db } from '@/db';
import { computers, devices, deviceEvents, alerts } from '@/db/schema';
import { eq, desc, gte, and, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all data
    const allComputers = await db.select().from(computers);
    const allDevices = await db.select().from(devices);
    const allEvents = await db.select().from(deviceEvents);
    const allAlerts = await db.select().from(alerts);

    // Calculate statistics
    const totalComputers = allComputers.length;
    const onlineComputers = allComputers.filter(c => c.status === 'online').length;
    const offlineComputers = allComputers.filter(c => c.status === 'offline').length;
    
    const connectedDevices = allDevices.filter(d => d.status === 'active').length;
    const activeDevices = allDevices.filter(d => d.status === 'active').length;
    
    // Today's events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEvents = allEvents.filter(e => {
      const eventDate = new Date(e.timestamp || 0);
      return eventDate >= today;
    }).length;

    // Critical alerts (unread)
    const criticalAlerts = allAlerts.filter(a => a.severity === 'critical' && a.status === 'unread').length;

    // Device type distribution
    const deviceTypeCounts: Record<string, number> = {};
    allDevices.forEach(d => {
      deviceTypeCounts[d.type] = (deviceTypeCounts[d.type] || 0) + 1;
    });

    // Monthly events (last 6 months)
    const monthlyData: Record<string, number> = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    allEvents.forEach(e => {
      const eventDate = new Date(e.timestamp || 0);
      if (eventDate >= sixMonthsAgo) {
        const monthKey = eventDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });

    // Device connections over time (last 7 days)
    const dailyData: Record<string, { connected: number; disconnected: number }> = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    allEvents.forEach(e => {
      const eventDate = new Date(e.timestamp || 0);
      if (eventDate >= sevenDaysAgo) {
        const dayKey = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = { connected: 0, disconnected: 0 };
        }
        if (e.eventType === 'connected') {
          dailyData[dayKey].connected++;
        } else if (e.eventType === 'disconnected') {
          dailyData[dayKey].disconnected++;
        }
      }
    });

    // Recent events
    const recentEvents = await db.select({
      id: deviceEvents.id,
      eventType: deviceEvents.eventType,
      severity: deviceEvents.severity,
      timestamp: deviceEvents.timestamp,
      device: {
        id: devices.id,
        name: devices.name,
        type: devices.type,
      },
      computer: {
        id: computers.id,
        name: computers.name,
      },
    })
    .from(deviceEvents)
    .leftJoin(devices, eq(deviceEvents.deviceId, devices.id))
    .leftJoin(computers, eq(deviceEvents.computerId, computers.id))
    .orderBy(desc(deviceEvents.timestamp))
    .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalComputers,
          connectedDevices,
          activeDevices,
          offlineDevices: offlineComputers,
          todayEvents,
          criticalAlerts,
        },
        deviceTypeDistribution: Object.entries(deviceTypeCounts).map(([name, value]) => ({ name, value })),
        monthlyEvents: Object.entries(monthlyData).map(([month, events]) => ({ month, events })),
        dailyConnections: Object.entries(dailyData).map(([date, data]) => ({ date, ...data })),
        recentEvents,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
    }, { status: 500 });
  }
}
