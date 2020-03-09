importScripts("./localforage.js")

const cacheName = 'v1';
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
  const cache = await caches.open('showcase-static');
  cache.addAll(cacheAssets);
});

self.addEventListener('activate', e => {
  let cacheWhiteList = ['showcase-static']

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
    console.log("chacheFirst")
    e.respondWith(cacheFirst(req));
  // } else if (url.pathname === "/api/projects/tags/") {
  //   e.respondWith(networkOnly(req));
  } else {
    console.log("networkFirst")
    e.respondWith(networkFirst(req));
  }
});

// async function cacheFirst(req) {
//   const cachedResponse = await caches.match(req);
//   console.log(cachedResponse)
//   return cachedResponse || fetch(req);
// } 

// async function networkFirst(req) {
//   const dynamicCache = await caches.open('showcase-dynamic');

//   try {
//     const res = await fetch(req);
//     dynamicCache.put(req, res.clone());
//     console.log("try")
//     return res;
//   } catch (error) {
//     console.log("catch")
//     const cachedResponse = await dynamicCache.match(req);
//     return cachedResponse;
//   }
// }

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}

async function networkFirst(req) {
  const dynamicCache = await caches.open('showcase-dynamic-v1');

  try {
    const res = await fetch(req)
    dynamicCache.put(req, res.clone())
    return res
  } catch (error) {
    const cachedRes = await dynamicCache.match(req)
    return cachedRes
  }
}

async function networkOnly(req) {
  try {
    const res = await fetch(req)
    return res
  } catch (error) {
    return error
  }
}