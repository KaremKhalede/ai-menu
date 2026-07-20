import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 attempts per 10 minutes
    const limiter = rateLimit(req, { intervalMs: 60000 * 10, maxRequests: 10 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز حد المحاولات المسموح به. يرجى المحاولة لاحقاً.' },
        { status: 429 }
      );
    }

    const { phone, code } = await req.json();

    if (!phone || !code || typeof phone !== 'string' || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'رقم الجوال ورمز التحقق مطلوبان وصالحان' },
        { status: 400 }
      );
    }

    if (!/^\+\d{10,15}$/.test(phone) || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: 'البيانات المرسلة غير صالحة' },
        { status: 400 }
      );
    }

    const result = verifyOTP(phone, code);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    // Find or create user by phone
    const user = await db.user.upsert({
      where: { phone },
      update: {},
      create: { phone, role: 'owner' },
    });

    // Create session
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}