import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

type SanitizedHeatmapEvent = {
  type: 'click' | 'hover' | 'scroll' | 'view' | 'add_to_cart' | 'detail_view';
  dishId?: string;
  x?: number;
  y?: number;
  selector?: string;
  timestamp: string;
};

export async function POST(request: NextRequest) {
  try {
    // Rate limit: max 60 heatmap flushes per minute to prevent DB spam
    const limiter = rateLimit(request, { intervalMs: 60000, maxRequests: 60 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'تم تجاوز الحد المسموح به للمزامنة. يرجى المحاولة لاحقاً.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate: must be a non-empty array
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'يجب إرسال مصفوفة أحداث غير فارغة' },
        { status: 400 },
      );
    }

    // Limit array size to prevent payload overflow
    if (body.length > 200) {
      return NextResponse.json(
        { error: 'حجم المصفوفة كبير جداً' },
        { status: 400 }
      );
    }

    // Basic per-event validation
    const sanitizedEvents: SanitizedHeatmapEvent[] = [];

    for (let i = 0; i < body.length; i++) {
      const ev = body[i];

      if (!ev || typeof ev !== 'object') {
        return NextResponse.json(
          { error: `حدث غير صالح في الفهرس ${i}` },
          { status: 400 }
        );
      }

      if (
        !ev.type ||
        !['click', 'hover', 'scroll', 'view', 'add_to_cart', 'detail_view'].includes(ev.type)
      ) {
        return NextResponse.json(
          { error: `حدث غير صالح في الفهرس ${i}: نوع غير معروف` },
          { status: 400 },
        );
      }

      // Sanitize fields to protect database write content
      sanitizedEvents.push({
        type: ev.type as SanitizedHeatmapEvent['type'],
        dishId:
          typeof ev.dishId === 'string'
            ? ev.dishId.substring(0, 100)
            : undefined,
        x: typeof ev.x === 'number' ? ev.x : undefined,
        y: typeof ev.y === 'number' ? ev.y : undefined,
        selector:
          typeof ev.selector === 'string'
            ? ev.selector
                .substring(0, 200)
                .replace(/<[^>]*>/g, '')
            : undefined,
        timestamp:
          typeof ev.timestamp === 'string'
            ? ev.timestamp
            : new Date().toISOString(),
      });
    }

    // Store as a single analytics row
    await db.analyticsEvent.create({
      data: {
        type: 'heatmap',
        data: JSON.stringify(sanitizedEvents),
      },
    });

    return NextResponse.json({
      success: true,
      count: sanitizedEvents.length,
    });
  } catch (error) {
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