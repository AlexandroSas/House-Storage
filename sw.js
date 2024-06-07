const CACHE_NAME = 'houst-storage-v1'
const URLS_TO_CHACHE = [
  './index.html',
  './css/styles.css',
]

// Install and Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache')
            return cache.addAll(URLS_TO_CHACHE).catch((error) => {
                console.error('Failed to cache resources:', error)
            })
        })
        .catch((error) => {
            console.error('Failed to open cache:', error)
        })
    )
})
  
// Fetch and Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response  
            }
  
            const fetchRequest = event.request.clone()
  
            return fetch(fetchRequest).then((fetchResponse) => {
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse
                }
  
                const responseToCache = fetchResponse.clone()
  
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache)
                })
  
                return fetchResponse
            })
            .catch((error) => {
                console.error('Fetching failed:', error)
                throw error
            })
        })
    )
})
  
// Clean Cache
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]
    event.waitUntil(
        caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
            if (!cacheWhitelist.includes(key)) {
                return caches.delete(key)
            }
        })))
    )
})