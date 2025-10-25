const CACHE_NAME = 'bosques-encinos-cache-v1';
// The start_url in manifest.json is '/', which resolves to the root.
// We will cache '/index.html' and serve it for all navigation requests.
const APP_SHELL_URL = '/index.html';
const urlsToCache = [
  '/',
  APP_SHELL_URL,
  '/manifest.json',
];

// Install: Caches the core app shell files.
self.addEventListener('install', event => {
  console.log('Service Worker: Install event in progress.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        console.log('Service Worker: Forcing activation with skipWaiting().');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Caching failed:', error);
      })
  );
});

// Activate: Cleans up old caches and takes control.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate event in progress.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => {
          console.log('Service Worker: Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
        console.log('Service Worker: Claiming clients.');
        return self.clients.claim();
    })
  );
});

// Fetch: Handles all network requests.
self.addEventListener('fetch', event => {
  const { request } = event;

  // For navigation requests, use the App Shell model (cache-first).
  // This is critical for the PWA to launch correctly when offline or in standalone mode.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(APP_SHELL_URL)
        .then(cachedResponse => {
          // If the App Shell is in the cache, serve it.
          if (cachedResponse) {
            console.log('Service Worker: Serving App Shell from cache.');
            return cachedResponse;
          }
          // If not in cache (should not happen after install), fetch it.
          console.log('Service Worker: App Shell not in cache, fetching from network.');
          return fetch(APP_SHELL_URL);
        })
    );
    return;
  }

  // For all other requests (assets, etc.), use a cache-first strategy.
  // This makes the app feel faster and work offline.
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // If we have a cached response, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from the network.
        return fetch(request).then(networkResponse => {
          // If the fetch is successful, clone the response and cache it for future use.
          if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
  );
});