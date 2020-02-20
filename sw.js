const cacheName = 'v1';
const cacheAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json',
  './images/not-working.png',
  'index.html',
  'test.html'
];

self.addEventListener('install', async e => {
  console.log(`SW registered`);

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log("SW: Caching files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  )
});

self.addEventListener('activate', e => {
  console.log(`SW Activated`);
  //remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            console.log("SW Clearing old cache");
            return caches.delete(cache);
          }
        })
      )
    })
  );
});

self.addEventListener('fetch', e => {
  console.log("SW Fetching");
  const req = e.request;

  e.respondWith(fetch(req).catch(() => caches.match(e.req)));
});
