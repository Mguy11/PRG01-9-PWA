importScripts("./localforage.js")

const cacheName = 'v1';
const cacheAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json',
  './images/not-working.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons', 
  'https://fonts.googleapis.com/css?family=Montserrat&display=swap',
  './localforage.js',
  'index.html',
  'test.html'
];


self.addEventListener('install', async e => {
  const cache = await caches.open('showcase-static');
  cache.addAll(cacheAssets);
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if(url.origin == location.origin) {
    console.log("chacheFirst")
    e.respondWith(cacheFirst(req));
  } else {
    console.log("networkFirst")
    e.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
} 

async function networkFirst(req) {
  const dynamicCache = await caches.open('showcase-dynamic');

  try {
    const res = await fetch(req);
    dynamicCache.put(req, res.clone());
    return res;
    console.log("try")
  } catch (error) {
    console.log("catch")
    const cachedResponse = await dynamicCache.match(req);
    return cachedResponse;
  }
}

