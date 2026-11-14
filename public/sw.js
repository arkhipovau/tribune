// Caches the heavy 3D stadium files and the brand fonts on the visitor's device.
// Stale-while-revalidate: a repeat visit gets the stadium instantly from the cache,
// and a fresh copy is fetched in the background, so model updates arrive on the next visit.
const CACHE = "tribune-assets-v2";
const CACHED_PATHS = ["/assets/stadium/", "/assets/fonts/"];

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const path = new URL(request.url).pathname;
  if (request.method !== "GET" || !CACHED_PATHS.some((p) => path.includes(p))) return;
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
