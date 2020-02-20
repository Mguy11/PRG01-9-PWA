const cacheName = 'v2';

self.addEventListener('install', async e => {
  console.log(`SW registered`);
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
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log("SW Fetching");
  e.respondWith(
    fetch(e.request)
      .then(res => {
        //Make copy/clone of response
        const resClone = res.clone();
        //Open cache
        caches.open(cacheName).then(cache => {
            // Add response to cache
            cache.put(e.request, resClone);
          });
          return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
