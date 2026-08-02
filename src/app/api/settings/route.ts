import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allSettings = await db.select().from(settings).limit(1);
    const currentSettings = allSettings[0] || {
      id: 1,
      organizationName: 'DeviceGuard Corporation',
      theme: 'light',
      emailAlerts: true,
      smsAlerts: false,
      language: 'en',
    };

    return NextResponse.json({
      success: true,
      data: currentSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch settings',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationName, logoUrl, theme, emailAlerts, smsAlerts, language } = body;

    await db.update(settings)
      .set({
        organizationName,
        logoUrl,
        theme,
        emailAlerts,
        smsAlerts,
        language,
      })
      .where(eq(settings.id, 1));

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update settings',
    }, { status: 500 });
  }
}
