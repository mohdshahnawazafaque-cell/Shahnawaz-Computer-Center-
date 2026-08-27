const CACHE_NAME = 'shahnawaz-portal-static-v1';
const API_CACHE_NAME = 'shahnawaz-portal-api-v1';

// Core assets to pre-cache for offline access
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
];

// Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Bypass cache for browser extensions and internal schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Never cache Admin and Auth endpoints (always fetch live, never store stale credentials)
  if (url.pathname.startsWith('/api/admin') || url.pathname.startsWith('/api/auth')) {
    return;
  }

  // 1. PUBLIC API REQUESTS (/api/posts, /api/settings, /api/categories, etc.)
  // Strategy: Network-First with Cache Fallback for offline access to visited items
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback empty JSON response if not cached yet
          return new Response(JSON.stringify({ error: 'Offline mode: content not in cache', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // 2. HTML NAVIGATION REQUESTS (SPA routes: /post/..., /category/..., /services, /contact)
  // Strategy: Network-First with SPA index.html fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Try direct cached navigation
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Try cached SPA root index.html so React router can render visited client states
          const cachedIndex = await caches.match('/index.html') || await caches.match('/');
          if (cachedIndex) {
            return cachedIndex;
          }
          // Fallback to offline warning page
          const offlinePage = await caches.match('/offline.html');
          return offlinePage || new Response('Offline - No connection available', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // 3. STATIC ASSETS (JS, CSS, Images, Google Fonts, Icons)
  // Strategy: Stale-While-Revalidate (Fast offline loading + background update)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fetch fails, it's okay because we might have cachedResponse
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================
// PUSH NOTIFICATIONS EVENT LISTENERS
// ==========================================

// Push Event: Received push payload from server
self.addEventListener('push', (event) => {
  let data = {
    title: '🚨 New Sarkari Update',
    body: 'A new job notification, admit card, or result has just been published!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    url: '/',
    tag: 'sarkari-instant-alert',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const notificationTitle = data.title || 'Government Recruitment Alert';
  const targetUrl = data.url || '/';

  const notificationOptions = {
    body: data.body || 'Click to view full application details, dates & syllabus.',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    image: data.image || undefined,
    tag: data.tag || `sarkari-alert-${Date.now()}`,
    data: {
      url: targetUrl,
      postId: data.postId,
      slug: data.slug,
      type: data.type,
      timestamp: Date.now(),
    },
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: false,
    actions: data.actions || [
      { action: 'open_url', title: 'Open & Apply' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Notification Click Event: Open or focus application window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const notificationData = event.notification.data || {};
  let targetUrl = notificationData.url || '/';

  // Make sure targetUrl is absolute or relative properly
  if (!targetUrl.startsWith('http') && !targetUrl.startsWith('/')) {
    targetUrl = '/' + targetUrl;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Check if any window is already open on this origin
      for (const client of windowClients) {
        if (client.url && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // 2. If no window is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Notification Close Event
self.addEventListener('notificationclose', (event) => {
  // Can be used for dismissal analytics if needed
  console.log('[SW] Notification closed by user:', event.notification.tag);
});
