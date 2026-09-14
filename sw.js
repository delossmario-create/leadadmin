/* Service worker de Lead Collector.
   Estrategia: la app (HTML/manifest/íconos) siempre se sirve desde la red si hay
   señal, para no quedar pegado a una versión vieja; si no hay conexión, se sirve
   la última copia cacheada. La tipografía (Google Fonts) se sirve cache-first
   porque no cambia. Subir CACHE_VERSION en cada release fuerza a limpiar la
   caché anterior. */
const CACHE_VERSION = 'lead-collector-v1';
const APP_SHELL = ['./', './index.html', './manifest.json'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      ),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Tipografía: cache-first, se completa en segundo plano si falta.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchAndCache = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchAndCache;
      })
    );
    return;
  }

  // Navegación (el documento HTML): red primero, caché como respaldo offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Resto de recursos propios (manifest, íconos, sw): red primero, caché de respaldo.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
