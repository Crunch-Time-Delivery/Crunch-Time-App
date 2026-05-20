const CACHE_NAME = 'crunchtime-user-app-cache-v1';
const urlsToCache = [
  './', // cache index.html
  './index.html',
  './restaurant_info.html',
  './my_order.html',
  './checkout.html',
  './checkout-order.html',
  // CSS, JS, images, icons, fonts
  'assets/index.css',
  // icons
  'icon-192.png',
  'icon-512.png'
  // images used in pages
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        try {
          await cache.addAll(urlsToCache);
          console.log('Assets cached successfully.');
        } catch (err) {
          console.error('Error caching assets:', err);
        }
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(async cacheNames => {
      for (const name of cacheNames) {
        if (name !== CACHE_NAME) {
          await caches.delete(name);
        }
      }
    })
  );
});

// Fetch event: serve cached assets if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request);
    }).catch(err => {
      console.error('Fetch error:', err);
      // Optionally, return fallback assets here
    })
  );
});