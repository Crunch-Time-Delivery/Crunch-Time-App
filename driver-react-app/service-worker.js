

const CACHE_NAME = 'crunchtime-driver-app-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'driver_view_account.html',
  // Add other static assets like CSS, JS, images here
];

// Install event: cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Caching failed during install:', error))
  );
});

// Activate event: clean up old caches if needed
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch event: serve cached assets, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch((error) => {
        console.error('Fetch failed:', error);
        // Optionally, return a fallback page or image here
      });
    })
  );
});