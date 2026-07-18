import { NextRequest, NextResponse } from 'next/server';
import { storeOTP } from '@/lib/otp-store';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'رقم الجوال غير صالح. يجب أن يبدأ بـ + متبوعاً بـ 10-15 رقم' },
        { status: 400 }
      );
    }

    const result = storeOTP(phone);

    if (!result.success) {
      return NextResponse.json(result, { status: 429 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}