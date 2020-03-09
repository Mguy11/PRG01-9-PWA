importScripts("./localforage.js")

const staticCacheName = 'staticCache-v1';
const dynamicCacheName = 'dynamicCache-v1';
const cacheAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json',
  './images/not-working.png',
  './localforage.js',
  'index.html',
  'test.html'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(staticCacheName);
  cache.addAll(cacheAssets);
});

self.addEventListener('activate', e => {
  let cacheWhiteList = ['staticCache-v1']

  e.waitUntil(
    caches.keys().then (cacheNames => {
      return Promise.all(
        cacheNames.map (cacheName => {
          if(cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if(url.origin === location.origin) {
    console.log("chacheFirst-test")
    e.respondWith(cacheFirst(req));
  } else {
    console.log("networkFirst")
    e.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const json = await res.json();

    console.log(json.projects)

    json.projects.forEach((project) => {
      localforage.setItem(project._id, project).catch((err) => {
          // This code runs if there were any errors
          console.log(err);
      });
    });
    console.log("Updated indexedDB and returning fetch result");
    return res
  } catch (error) {
    //const indexedRes = await localforage.getItem(req.url)
    console.log(error)
    cachedRes = console.log("No network so returning dynamic cache result")
    return cachedRes
  }
}