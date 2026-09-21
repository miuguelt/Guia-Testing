/**
 * Service Worker para Guía de Testing & QA
 * Proporciona soporte 100% offline (Cache-First con Network Fallback)
 */
// Se migra desde guia-testing-v3.7.2-cache para invalidar estilos y controles
// que pudieron quedar persistidos durante una sesión offline anterior.
const CACHE_NAME = 'guia-testing-v3.7.13-cache';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './img/icon.svg',
  './css/styles.css',
  './css/ai-testing-coach.css',
  './css/ai-guided-practice.css',
  './css/module-learning-kit.css',
  './css/controls.css',
  './css/vendor/devbrain-code.css',
  './css/vendor/devbrain-evidence.css',
  './js/vendor/devbrain-code.js',
  './js/vendor/devbrain-evidence.js',
  './js/main.js',
  './js/testing-session.js',
  './js/gamification.js',
  './js/simulators.js',
  './js/learning-visuals.js',
  './js/code-renderer.js',
  './js/ai-testing-coach.js',
  './js/ai-tools-lab.js',
  './js/ai-guided-practice.js',
  './js/ai-guided-practice-data.js',
  './js/module-learning-kit.js',
  './js/module-learning-kit-data.js',
  './js/deliverables-registry.js',
  './js/modules-content.js',
  './js/modules-riesgo.js',
  './js/modules-defectos.js',
  './js/modules-content-2.js',
  './js/modules-cicd.js',
  './js/modules-observability.js',
  './js/modules-ai-testing.js',
  './js/modules-ai-coach.js',
  './js/modules-ai-tools.js',
  './js/modules-challenge.js',
  './js/modules-tdd.js',
  './js/modules-bdd.js',
  './js/modules-foundations.js',
  './js/modules-test-strategy.js'
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
  const requestUrl = new URL(event.request.url);
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
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
            return cache.put(event.request, responseToCache);
          }).catch((err) => {
            console.warn('[ServiceWorker] Fallo al guardar recurso en caché:', event.request.url, err);
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
