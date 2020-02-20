const staticAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json',
  './images/not-working.png'
];

self.addEventListener('install', async e => {
  const cache = await caches.open('showcase-static');
  cache.addAll(staticAssets);
});

// self.addEventListener('activate', e => {
//   e.waitUntil(self.ClientRectList.claim());
// });

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if(url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
} 

async function networkFirst(req) {
  const dynamicCache  = await caches.open('showcase-dynamic');

  try {
    const res = await fetch(req);
    dynamicCache .put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await dynamicCache.match(req);
    return cachedResponse || await caches.match('./fallback.json')
  }
}