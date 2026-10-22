'use strict';
const VERSION = 'v1';
const PREFIX = 'levi-pokemonquest-';
const CORE = `${PREFIX}core-${VERSION}`;
const MEDIA = `${PREFIX}media-${VERSION}`;
const BASE = new URL(self.registration.scope);
const INDEX = new URL('index.html', BASE).href;
const CORE_PATHS = ['index.html', 'pwa.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-192.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];
const CORE_URLS = CORE_PATHS.map(path => new URL(path, BASE).href);
const EXTERNAL_MEDIA = new Set(['raw.githubusercontent.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'www.serebii.net']);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CORE).then(cache => cache.addAll(CORE_URLS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && ![CORE, MEDIA].includes(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
async function putMedia(request, response) {
  if (!response || !(response.ok || response.type === 'opaque')) return;
  const cache = await caches.open(MEDIA);
  await cache.put(request, response.clone());
  const keys = await cache.keys();
  if (keys.length > 220) await cache.delete(keys[0]);
}
async function navigation(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(request, { signal: controller.signal });
    if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
      const cache = await caches.open(CORE);
      await cache.put(INDEX, response.clone());
      return response;
    }
    return (await caches.match(INDEX)) || response;
  } catch {
    return (await caches.match(INDEX)) || new Response('<!doctype html><html lang="de"><meta charset="utf-8"><title>Levis Quest</title><h1>Levis Quest</h1><p>Verbinde das Tablet einmal mit dem Internet und öffne die App erneut.</p></html>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } finally { clearTimeout(timeout); }
}
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const own = url.origin === BASE.origin && url.pathname.startsWith(BASE.pathname);
  if (own && request.mode === 'navigate') { event.respondWith(navigation(request)); return; }
  if (own && CORE_URLS.includes(url.href)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
    return;
  }
  if (EXTERNAL_MEDIA.has(url.hostname) && ['image', 'font', 'style'].includes(request.destination)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      try { await putMedia(request, response); } catch { /* Storage may be full; the network response is still useful. */ }
      return response;
    })());
  }
});
let imageJob = null;
async function cachePokemon(client) {
  let next = 1, done = 0, saved = 0;
  const report = data => { if (client?.postMessage) client.postMessage(data); };
  async function worker() {
    while (next <= 151) {
      const id = next++;
      const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      try {
        const request = new Request(url, { mode: 'no-cors', credentials: 'omit' });
        const cache = await caches.open(MEDIA);
        if (await cache.match(request)) saved++;
        else {
          const response = await fetch(request);
          if (response.ok || response.type === 'opaque') { await putMedia(request, response); saved++; }
        }
      } catch { /* Report partial progress instead of claiming that every picture was stored. */ }
      done++;
      report({ type: 'IMAGE_PROGRESS', done, saved });
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  report({ type: 'IMAGE_COMPLETE', done, saved });
}
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (event.data?.type === 'CACHE_POKEMON_IMAGES') {
    if (imageJob) { event.source?.postMessage({ type: 'IMAGE_PROGRESS', done: 0 }); return; }
    imageJob = cachePokemon(event.source).finally(() => { imageJob = null; });
    event.waitUntil(imageJob);
  }
});
