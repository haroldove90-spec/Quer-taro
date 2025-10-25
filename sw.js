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
  // For navigation requests, serve the app shell from the cache immediately.
  // This is the App Shell model, which is ideal for Single Page Applications.
  // It ensures the app loads reliably and quickly, fixing the 404 issue on launch.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(APP_SHELL_URL).then(response => {
        // If the app shell is in the cache, return it.
        // Otherwise, fetch it from the network (this is a fallback).
        return response || fetch(APP_SHELL_URL);
      })
    );
    return;
  }

  // For all other requests (assets, scripts), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from cache.
        if (response) {
          return response;
        }

        // Not in cache - fetch from network.
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // If the fetch is successful, clone the response and cache it.
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
