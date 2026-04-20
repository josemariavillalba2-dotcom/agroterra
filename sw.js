// ═══════════════════════════════════════════════════
// Agroterra Service Worker — v1.0
// Cachea los archivos para funcionamiento offline
// ═══════════════════════════════════════════════════

const CACHE_NAME = 'agroterra-v1';
const ASSETS = [
  './agroterra_admin.html',
  './agroterra_tecnico.html',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap',
];

// Instalar — cachear archivos principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Cache install partial error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activar — limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — servir desde cache si no hay red
self.addEventListener('fetch', event => {
  // No interceptar llamadas a Google Apps Script (siempre necesitan red)
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cachear recursos estáticos nuevos
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached); // Si falla la red, devolver cache aunque sea viejo
    })
  );
});
