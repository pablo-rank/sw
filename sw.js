self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('video-store').then(function(cache) {
     return cache.addAll([
       'sw/',
       'sw/index.html',
       'sw/index.js',
       'sw/style.css',
       'sw/images/fox1.jpg',
       'sw/images/fox2.jpg',
       'sw/images/fox3.jpg',
       'sw/images/fox4.jpg'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
