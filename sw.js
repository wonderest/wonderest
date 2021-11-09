// const cacheData = "appV1";
// this.addEventListener("install", (e)=>{
//     e.waitUntil(
//         caches.open(cacheData).then((cache)=>{
//             cache.addAll([
//                 '/',
//                 '/index.html',
//                 '/assets/css/fontawesome/all.css',
//                 '/assets/js/fontawesome/all.js',
//                 '/static/js/bundle.js',
//                 '/static/js/0.chunk.js',
//                 '/static/js/1.chunk.js',
//                 '/static/js/main.chunk.js',
//                 '/manifest.json',
//                 '/favicon.ico',
//                 '/assets/css/free-v4-font-face.min.css',
//                 '/assets/css/free-v4-shims.min.css',
//                 '/assets/css/free.min.css',
//                 '/assets/css/webfonts/fa-solid-900.woff2',
//                 '/assets/L0x5DF4xlVMF-BfR8bXMIjhLq3-cXbKD.woff2'
//             ])
//         })
//     )
// })

// this.addEventListener('fetch', (e)=>{
//     if(!navigator.onLine) {
//         e.respondWith(
//             caches.match(e.request).then((res)=>{
//                 if(res){
//                     return res
//                 }
//             })
//         )
//     }
// })
// importScripts('/src/js/idb.js');
// importScripts('/src/js/idb-utility.js');

const CACHE_NAME = 'version-1';
const dynamicCacheName = 'version-2';
const urlsToCache = ['index.html', 'offlinepage.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');

      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        return caches.match('offlinepage.html');
      })
  );
});

// Activate the SW
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
