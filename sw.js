const CACHE_NAME = 'llama-queretaro-cache-v2';
const APP_SHELL_URL = '/index.html';
const urlsToCache = [
  '/',
  APP_SHELL_URL,
  '/index.tsx',
  '/manifest.json',
];

// Install event: cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: handle requests
self.addEventListener('fetch', event => {
  // For navigation requests, use a network-first strategy to get updates,
  // but fall back to cache if the network fails, ensuring the app always loads.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Network failed, serve the app shell from cache
          return caches.open(CACHE_NAME)
            .then(cache => cache.match(APP_SHELL_URL));
        })
    );
    return;
  }

  // For all other requests (assets, scripts), use a cache-first strategy for speed.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, then add to cache for next time.
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});