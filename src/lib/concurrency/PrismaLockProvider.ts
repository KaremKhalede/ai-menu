import { db } from "@/lib/db";
import { LockProvider, AcquiredLock } from "./LockProvider";
import { randomUUID } from "crypto";

export class PrismaLockProvider implements LockProvider {
  async tryAcquire(lockKey: string, ttlMs: number): Promise<AcquiredLock | null> {
    const token = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);

    try {
      // Clean up dead lock if it exists before trying to insert
      // In PostgreSQL, this would be a single conditional INSERT.
      // For SQLite/Prisma compatibility, we check if a dead lock exists and delete it if so.
      const existingLock = await db.distributedLock.findUnique({
        where: { lockKey },
      });

      if (existingLock) {
        if (existingLock.expiresAt > now) {
          return null; // Lock is currently active and held by someone else
        } else {
          // Lock is dead, safely clear it out
          await db.distributedLock.delete({ where: { lockKey } });
        }
      }

      // Attempt to acquire
      await db.distributedLock.create({
        data: {
          lockKey,
          token,
          expiresAt,
        },
      });

      return { lockKey, token };
    } catch (e: any) {
      // Prisma P2002 error means someone else beat us to the create
      return null;
    }
  }

  async release(lockKey: string, token: string): Promise<boolean> {
    try {
      const result = await db.distributedLock.deleteMany({
        where: {
          lockKey,
          token,
        },
      });
      return result.count > 0;
    } catch (e) {
      return false;
    }
  }

  async extend(lockKey: string, token: string, extensionMs: number): Promise<boolean> {
    try {
      const lock = await db.distributedLock.findFirst({
        where: { lockKey, token },
      });

      if (!lock) return false;

      // Ensure we don't extend a lock that has already naturally expired 
      // (to prevent zombie processes reviving lost locks).
      if (lock.expiresAt < new Date()) {
        return false;
      }

      await db.distributedLock.update({
        where: { lockKey },
        data: {
          expiresAt: new Date(Date.now() + extensionMs),
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
