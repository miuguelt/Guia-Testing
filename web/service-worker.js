/**
 * Service Worker para Guía de Testing & QA
 * Proporciona soporte 100% offline (Cache-First con Network Fallback)
 */
const CACHE_NAME = 'guia-testing-v3.7.1-cache';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './img/icon.svg',
  './css/styles.css',
  './css/ai-testing-coach.css',
  './css/ai-guided-practice.css',
  './css/module-learning-kit.css',
  './css/vendor/devbrain-code.css',
  './css/vendor/devbrain-evidence.css',
  './js/main.js',
  './js/testing-session.js',
  './js/simulators.js',
  './js/sena-dossier.js',
  './js/gamification.js',
  './js/deliverables-registry.js',
  './js/learning-visuals.js',
  './js/code-renderer.js',
  './js/ai-testing-coach.js',
  './js/ai-guided-practice.js',
  './js/ai-guided-practice-data.js',
  './js/ai-tools-lab.js',
  './js/module-learning-kit.js',
  './js/module-learning-kit-data.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos map individual o Promise.allSettled para que si un recurso opcional falla no impida la instalación
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[ServiceWorker] Fallo al precachear recurso:', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Eliminando caché antigua:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignoramos peticiones no GET o de esquemas no soportados (como chrome-extension://)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Si estamos offline y se solicita un documento de navegación, retornamos index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
