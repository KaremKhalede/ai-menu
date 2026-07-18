import { NextRequest, NextResponse } from 'next/server';
import { storeEmailMagicLink } from '@/lib/otp-store';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    const result = storeEmailMagicLink(email);

    // In production, send email here. For demo, log to console.
    console.log(`📧 Magic link for ${email}: any non-empty token will work`);

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}