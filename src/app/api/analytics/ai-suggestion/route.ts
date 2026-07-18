import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ─── POST: تسجيل اقتراح ذكاء اصطناعي جديد ──────────────────────────────────

interface SuggestionInput {
  dishId: string;
  dishName: string;
  context: 'chat' | 'cart_upsell' | 'menu_featured';
  message: string;
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SuggestionInput = await request.json();

    const { dishId, dishName, context, message, sessionId } = body;

    if (!dishId || !dishName || !context || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة: dishId, dishName, context, message' },
        { status: 400 },
      );
    }

    const validContexts = ['chat', 'cart_upsell', 'menu_featured'];
    if (!validContexts.includes(context)) {
      return NextResponse.json(
        { error: `قيمة context غير صالحة. القيم المقبولة: ${validContexts.join(', ')}` },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();

    await db.analyticsEvent.create({
      data: {
        id,
        type: 'ai_suggestion',
        data: JSON.stringify({
          dishId,
          dishName,
          context,
          message,
          sessionId: sessionId || null,
          converted: false,
          createdAt: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json(
      { success: true, id },
      { status: 201 },
    );
  } catch (error) {
    console.error('فشل تسجيل اقتراح الذكاء الاصطناعي:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'بيانات JSON غير صالحة' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'فشل تسجيل الاقتراح' },
      { status: 500 },
    );
  }
}

// ─── PUT: تحديث حالة التحويل لاقتراح موجود ───────────────────────────────

interface ConversionInput {
  suggestionId: string;
  converted: boolean;
  orderValue?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const body: ConversionInput = await request.json();

    const { suggestionId, converted, orderValue } = body;

    if (!suggestionId || converted === undefined) {
      return NextResponse.json(
        { error: 'الحقول المطلوبة: suggestionId, converted' },
        { status: 400 },
      );
    }

    // البحث عن حدث الاقتراح الأصلي
    const existingEvent = await db.analyticsEvent.findUnique({
      where: { id: suggestionId },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'اقتراح غير موجود' },
        { status: 404 },
      );
    }

    // تحديث بيانات الاقتراح
    const existingData = JSON.parse(existingEvent.data);
    const updatedData = {
      ...existingData,
      converted,
      ...(converted && orderValue !== undefined ? { orderValue, convertedAt: new Date().toISOString() } : {}),
      updatedAt: new Date().toISOString(),
    };

    await db.analyticsEvent.update({
      where: { id: suggestionId },
      data: {
        data: JSON.stringify(updatedData),
      },
    });

    // إذا كان تحويلاً، أنشئ حدث تحويل منفصل أيضاً
    if (converted) {
      await db.analyticsEvent.create({
        data: {
          type: 'ai_conversion',
          data: JSON.stringify({
            suggestionId,
            orderValue: orderValue ?? null,
            originalSuggestion: existingData,
            convertedAt: new Date().toISOString(),
          }),
        },
      });
    }

    return NextResponse.json({ success: true, id: suggestionId });
  } catch (error) {
    console.error('فشل تحديث حالة الاقتراح:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'بيانات JSON غير صالحة' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'فشل تحديث حالة الاقتراح' },
      { status: 500 },
    );
  }
}