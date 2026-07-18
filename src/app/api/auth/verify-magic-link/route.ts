import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink } from '@/lib/otp-store';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: 'البريد والرمز مطلوبان' },
        { status: 400 }
      );
    }

    const result = verifyMagicLink(email, token);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    // Find or create user by email
    const user = await db.user.upsert({
      where: { email },
      update: {},
      create: { email, role: 'owner' },
    });

    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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