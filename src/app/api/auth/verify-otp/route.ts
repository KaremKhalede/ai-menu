import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: 'رقم الجوال ورمز التحقق مطلوبان' },
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