const CACHE_NAME = 'crunchtime-driver-app-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'driver_view_account.html'
  // add other static assets like CSS, JS, images
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

