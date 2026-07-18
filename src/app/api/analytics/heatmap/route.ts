import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/analytics/heatmap
 * Receives an array of heatmap events and persists them as a single
 * AnalyticsEvent record (type: 'heatmap', data: JSON array).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate: must be a non-empty array
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'يجب إرسال مصفوفة أحداث غير فارغة' },
        { status: 400 },
      );
    }

    // Basic per-event validation
    for (let i = 0; i < body.length; i++) {
      const ev = body[i];
      if (!ev.type || !['click', 'hover', 'scroll', 'view', 'add_to_cart', 'detail_view'].includes(ev.type)) {
        return NextResponse.json(
          { error: `حدث غير صالح في الفهرس ${i}: نوع غير معروف` },
          { status: 400 },
        );
      }
    }

    // Store as a single analytics row — the entire batch is the `data` JSON.
    await db.analyticsEvent.create({
      data: {
        type: 'heatmap',
        data: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, count: body.length });
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'تنسيق JSON غير صالح' },
        { status: 400 },
      );
    }

    console.error('Heatmap flush failed:', error);
    return NextResponse.json(
      { error: 'فشل في حفظ بيانات الخريطة الحرارية' },
      { status: 500 },
    );
  }
}