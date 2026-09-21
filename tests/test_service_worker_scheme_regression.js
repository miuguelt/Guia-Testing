const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const serviceWorkerPath = path.join(__dirname, '..', 'web', 'service-worker.js');
const source = fs.readFileSync(serviceWorkerPath, 'utf8');
const listeners = {};
let cacheMatchCalls = 0;
let networkFetchCalls = 0;
let cachePutCalls = 0;

const context = {
  console,
  URL,
  self: {
    addEventListener(type, handler) {
      listeners[type] = handler;
    },
    skipWaiting() {},
    clients: { claim() {} },
  },
  caches: {
    match() {
      cacheMatchCalls += 1;
      return Promise.resolve(null);
    },
    open() {
      return Promise.resolve({
        put() {
          cachePutCalls += 1;
          return Promise.resolve();
        },
      });
    },
    keys() {
      return Promise.resolve([]);
    },
  },
  fetch() {
    networkFetchCalls += 1;
    return Promise.resolve({
      status: 200,
      type: 'basic',
      clone() {
        return this;
      },
    });
  },
};

vm.runInNewContext(source, context, { filename: serviceWorkerPath });

assert.strictEqual(typeof listeners.fetch, 'function', 'El Service Worker debe registrar fetch');

let respondWithCalls = 0;
listeners.fetch({
  request: {
    method: 'GET',
    url: 'chrome-extension://abcdefghijklmnop/recurso.js',
  },
  respondWith() {
    respondWithCalls += 1;
  },
});

assert.strictEqual(respondWithCalls, 0, 'No se debe interceptar chrome-extension://');
assert.strictEqual(cacheMatchCalls, 0, 'Una solicitud no soportada no debe consultar Cache');
assert.strictEqual(networkFetchCalls, 0, 'Una solicitud no soportada no debe ir a la red desde el SW');
assert.strictEqual(cachePutCalls, 0, 'Una solicitud no soportada no debe escribirse en Cache');

console.log('SERVICE WORKER SCHEME REGRESSION PASSED');
