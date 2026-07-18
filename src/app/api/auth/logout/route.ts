import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    await db.session.deleteMany({ where: { token } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}