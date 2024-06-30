var catches = ['/'];

self.addEventListener('install', e => {
    e.waitUntil((async () => {
      caches.keys().then(function(keys) {
        keys.forEach(function(key) {
            caches.delete(key);
        });
      });
      const cache = await caches.open('wsa-catche');
      console.log('[ServiceWorker] - WebServerAI catche Installed!');
      try {
        const response = await fetch('/WebServerAI/caches/cache.txt');
        const data = await response.text();
        const arr = data.split(/\n|\r|\r\n/).filter((data)=>{return data!==''});
        catches = arr;
      } catch (error) {
        console.error(error);
      }
      await cache.addAll(catches);
    })());
  });
  
  self.addEventListener('fetch', e => {
    console.log('[ServiceWorker] - Fetch');
    if (e.request.url === '/api/data') {
      e.respondWith(fetch(e.request));
    } else {
      e.respondWith(caches.match(e.request));
    }
  });