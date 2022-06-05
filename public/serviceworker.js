const CACHE_NAME = "version_1";
const urlsToCache = [ 'index.html', 'offline.html' ];

const self = this;
//Install the service worker.
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Cache is open');

            return cache.addAll(urlsToCache);
        })
    )
});

//Listen for requests.
    self.addEventListener('fetch', (e)=>{
        console.log('Fetch event intercepted by service worker');
        console.log('request mode', e.request);

        e.respondWith(
            caches.match(e.request)
            
            .then(()=>{
                console.log('Network request for', e.request.url);
                return fetch(e.request)  
                            .catch((ev)=> {
                                console.error('Fetch failed; returning offline page instead.', ev);
                                return caches.open(CACHE_NAME)
                                .then((cache) => {
                                  return cache.match('offline.html'); })
                            })


            })
        )

    });

//Activate the service worker.
self.addEventListener('activate', (e) => {
    const catchWhiteList = [];
    catchWhiteList.push(CACHE_NAME);

    e.waitUntil(
        caches.keys().then( (cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!catchWhiteList.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )

});