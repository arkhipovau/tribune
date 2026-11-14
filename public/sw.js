// Caches the heavy 3D stadium files on the visitor's device.
// Stale-while-revalidate: a repeat visit gets the stadium instantly from the cache,
// and a fresh copy is fetched in the background, so model updates arrive on the next visit.
const CACHE = "tribune-stadium-v1";
const CACHED_PATH = "/assets/stadium/";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !new URL(request.url).pathname.includes(CACHED_PATH)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    const network = fetch(request).then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    }).catch(() => cached);
    if (cached) { event.waitUntil(network); return cached; }
    return network;
  })());
});
