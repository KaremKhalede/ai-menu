import { addPendingOrder } from '@/lib/offline-db';
import type { OrderPayload } from '../types';

export async function submitOrder(orderData: OrderPayload): Promise<void> {
  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      throw new Error('فشل الإرسال للسيرفر');
    }
  } catch (err) {
    console.warn('Offline: queueing order for sync later', err);
    addPendingOrder(orderData as unknown as Record<string, unknown>);
  }
}
