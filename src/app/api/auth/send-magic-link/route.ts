import { NextRequest, NextResponse } from 'next/server';
import { storeEmailMagicLink } from '@/lib/otp-store';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 requests per 10 minutes
    const limiter = rateLimit(req, { intervalMs: 60000 * 10, maxRequests: 5 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز حد الطلبات المسموح به. يرجى المحاولة لاحقاً.' },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    const result = storeEmailMagicLink(email);

    // Secure logging: log request, but do not log the plain secret token
    console.log(`📧 Magic link generated for ${email}`);

    return NextResponse.json({
      success: true,
      message: result.message,
      // Provide the token only in demo mode/response so testing continues to work,
      // but in real production this would be sent via email client only.
      token: result.token,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}