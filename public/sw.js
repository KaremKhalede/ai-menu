const CACHE_NAME = 'menuai-v1';

const CRITICAL_ASSETS = [
  '/',
  '/api/menu',
  '/manifest.json',
  '/logo.svg',
];

// ─── Install: pre-cache critical assets ─────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── Activate: clean old caches ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ─── Fetch: network-first for API, cache-first for static ───────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls → network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets → cache-first
  event.respondWith(cacheFirst(request));
});

/**
 * Network-first strategy:
 * Try the network; fall back to cache if offline.
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return a minimal offline fallback for API calls
    return new Response(
      JSON.stringify({ error: true, message: 'أنت غير متصل بالإنترنت' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Cache-first strategy:
 * Return from cache; fetch from network if not cached.
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// ─── Background Sync: offline orders ────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-orders') {
    event.waitUntil(syncPendingOrders());
  }
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalyticsEvents());
  }
});

/**
 * Read pending orders from IndexedDB and POST them to the API.
 */
async function syncPendingOrders() {
  try {
    const db = await openDB();
    const tx = db.transaction('pending-orders', 'readonly');
    const store = tx.objectStore('pending-orders');
    const orders = await store.getAll();
    await tx.done;

    for (const order of orders) {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });
      } catch (err) {
        // If one order fails, stop and retry next sync
        break;
      }
    }

    // Clear successfully synced orders
    if (orders.length > 0) {
      const clearTx = db.transaction('pending-orders', 'readwrite');
      clearTx.objectStore('pending-orders').clear();
      await clearTx.done;
    }
  } catch (err) {
    console.error('Background sync: failed to sync pending orders', err);
  }
}

/**
 * Sync analytics events from IndexedDB to the API.
 */
async function syncAnalyticsEvents() {
  try {
    const db = await openDB();
    const tx = db.transaction('analytics-events', 'readonly');
    const store = tx.objectStore('analytics-events');
    const events = await store.getAll();
    await tx.done;

    if (events.length === 0) return;

    await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });

    const clearTx = db.transaction('analytics-events', 'readwrite');
    clearTx.objectStore('analytics-events').clear();
    await clearTx.done;
  } catch (err) {
    console.error('Background sync: failed to sync analytics', err);
  }
}

// ─── Push Notifications ─────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {
    title: 'MenuAI',
    body: 'لديك إشعار جديد',
    icon: '/logo.svg',
    badge: '/logo.svg',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      dir: 'rtl',
      lang: 'ar',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || [],
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(urlToOpen);
    })
  );
});

// ─── IndexedDB helper (used by SW for background sync) ──────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('menuai-offline', 1);

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