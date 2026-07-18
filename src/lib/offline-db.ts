// ─── IndexedDB wrapper for MenuAI offline support ───────────────────────────
// Database: menuai-offline
// Stores: cached-menu, pending-orders, analytics-events, ai-suggestions

const DB_NAME = 'menuai-offline';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('cached-menu')) {
        db.createObjectStore('cached-menu');
      }

      if (!db.objectStoreNames.contains('pending-orders')) {
        const orderStore = db.createObjectStore('pending-orders', {
          keyPath: 'id',
          autoIncrement: true,
        });
        orderStore.createIndex('createdAt', 'createdAt');
      }

      if (!db.objectStoreNames.contains('analytics-events')) {
        const analyticsStore = db.createObjectStore('analytics-events', {
          keyPath: 'id',
          autoIncrement: true,
        });
        analyticsStore.createIndex('type', 'type');
      }

      if (!db.objectStoreNames.contains('ai-suggestions')) {
        db.createObjectStore('ai-suggestions', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ─── Cached Menu ─────────────────────────────────────────────────────────────

export async function cacheMenu(categories: unknown[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('cached-menu', 'readwrite');
  tx.objectStore('cached-menu').put(categories, 'menu');
  await tx.done;
  db.close();
}

export async function getCachedMenu(): Promise<unknown | undefined> {
  const db = await openDB();
  const tx = db.transaction('cached-menu', 'readonly');
  const result = await tx.objectStore('cached-menu').get('menu');
  await tx.done;
  db.close();
  return result;
}

// ─── Pending Orders ─────────────────────────────────────────────────────────

export async function addPendingOrder(order: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('pending-orders', 'readwrite');
  tx.objectStore('pending-orders').add({
    ...order,
    createdAt: new Date().toISOString(),
  });
  await tx.done;
  db.close();

  // Register background sync if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as unknown as { sync: { register(tag: string): Promise<void> } }).sync.register(
        'sync-pending-orders'
      );
    } catch {
      // Sync not supported, orders will sync on next SW cycle
    }
  }
}

export async function getPendingOrders(): Promise<unknown[]> {
  const db = await openDB();
  const tx = db.transaction('pending-orders', 'readonly');
  const result = await tx.objectStore('pending-orders').getAll();
  await tx.done;
  db.close();
  return result;
}

export async function clearPendingOrders(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('pending-orders', 'readwrite');
  tx.objectStore('pending-orders').clear();
  await tx.done;
  db.close();
}

// ─── AI Suggestions Tracking ────────────────────────────────────────────────

export async function trackAISuggestion(suggestion: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('ai-suggestions', 'readwrite');
  tx.objectStore('ai-suggestions').put({
    ...suggestion,
    id: suggestion.id || crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  await tx.done;
  db.close();
}

// ─── Analytics Events ───────────────────────────────────────────────────────

export async function trackHeatmapEvent(event: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('analytics-events', 'readwrite');
  tx.objectStore('analytics-events').add({
    ...event,
    type: event.type || 'heatmap',
    timestamp: new Date().toISOString(),
  });
  await tx.done;
  db.close();

  // Register background sync for analytics if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as unknown as { sync: { register(tag: string): Promise<void> } }).sync.register(
        'sync-analytics'
      );
    } catch {
      // Sync not supported
    }
  }
}

export async function getAnalyticsEvents(): Promise<unknown[]> {
  const db = await openDB();
  const tx = db.transaction('analytics-events', 'readonly');
  const result = await tx.objectStore('analytics-events').getAll();
  await tx.done;
  db.close();
  return result;
}

export async function clearAnalyticsEvents(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('analytics-events', 'readwrite');
  tx.objectStore('analytics-events').clear();
  await tx.done;
  db.close();
}