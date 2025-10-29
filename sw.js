// Service Worker for Image Caching
const CACHE_NAME = 'portfolio-cache-v2';
const IMAGE_CACHE = 'portfolio-images-v2';

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/pp/',
        '/pp/assets/css/style.css',
        '/pp/assets/js/script.js'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache images and serve from cache when available
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle http and https requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Cache images with cache-first strategy
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached image immediately
            return cachedResponse;
          }

          // Fetch from network and cache it
          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return a fallback image or error response
            return new Response('Image not available', {
              status: 404,
              statusText: 'Not Found'
            });
          });
        });
      })
    );
    return;
  }

  // For other resources, use network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache the response
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Try to return from cache if network fails
        return caches.match(request);
      })
  );
});
