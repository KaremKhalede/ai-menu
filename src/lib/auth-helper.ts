import { NextRequest } from 'next/server';
import { db } from './db';

export interface AuthenticatedUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  isOnboarded: boolean;
  restaurantId: string | null;
}

export async function getSessionUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    if (new Date() > session.expiresAt) {
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone,
      role: session.user.role,
      isOnboarded: session.user.isOnboarded,
      restaurantId: session.user.restaurantId,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export function authorizeRoles(user: AuthenticatedUser, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}
