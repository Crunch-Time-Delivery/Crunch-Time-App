const CACHE_NAME = 'crunchtime-vendor-app-cache-v1';
const urlsToCache = [
  './', // cache index.html
  './index.html',
  
  // add all CSS, JS, images, icons, fonts, etc.
  'assets/index.css',
  // add your icons if any, e.g.
  'icon-192.png',
  'icon-512.png'
  // add images used in pages
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