import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }

    if (new Date() > session.expiresAt) {
      await db.session.delete({ where: { id: session.id } });
      return NextResponse.json(
        { success: false, message: 'انتهت صلاحية الجلسة' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
        isOnboarded: session.user.isOnboarded,
        restaurantId: session.user.restaurantId,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}