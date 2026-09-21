const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('web/js/vendor/devbrain-evidence.js', 'utf8');
const mockWindow = { __DEV__: true, setTimeout, clearTimeout };
mockWindow.window = mockWindow;
global.window = mockWindow;
global.document = {};
vm.runInThisContext(source, { filename: 'devbrain-evidence.js' });

const helpers = mockWindow.DevBrainEvidence.__testing;
assert.ok(helpers, 'Debe existir el contrato de pruebas del motor de evidencias.');
assert.equal(typeof helpers.crearRefrescoAgrupado, 'function');
assert.equal(typeof helpers.crearRefrescoProtegido, 'function', 'El dossier debe proteger el foco durante la edición.');
assert.equal(typeof helpers.limpiarPerfilPendiente, 'function', 'Los valores de ejemplo no deben parecer datos diligenciados.');
assert.deepEqual(
  helpers.limpiarPerfilPendiente({ name: 'APRENDIZ ADSO', ficha: '<NÚMERO_DE_FICHA>', centro: 'Por diligenciar', instructor: 'María' }),
  { name: '', ficha: '', centro: '', instructor: 'María' }
);

const sessionStorage = new Map();
const sessionWindow = { localStorage: {
  getItem: (key) => sessionStorage.get(key) || null,
  setItem: (key, value) => sessionStorage.set(key, value),
  removeItem: (key) => sessionStorage.delete(key)
} };
vm.runInNewContext(fs.readFileSync('web/js/testing-session.js', 'utf8'), {
  window: sessionWindow, localStorage: sessionWindow.localStorage, console
});
let avisos = 0;
sessionWindow.TestingSession.subscribe(() => { avisos += 1; });
sessionWindow.TestingSession.saveProfile({ name: 'Aprendiz de prueba' }, false);
assert.equal(sessionWindow.TestingSession.getProfile().name, 'Aprendiz de prueba', 'El dato debe persistirse de inmediato.');
assert.equal(avisos, 0, 'La escritura no debe calcular ni difundir el progreso en cada tecla.');
sessionWindow.TestingSession.notify();
assert.equal(avisos, 1, 'La notificación agrupada debe llegar al terminar la ráfaga.');
assert.ok(
  source.includes('window.TestingSession.subscribe(() => refresco.programar())'),
  'Los cambios del perfil también deben agruparse antes de reconstruir el dossier.'
);
assert.ok(
  source.includes("{ id: 'ev-doc', target: ['disp-doc', 'sig-doc'], key: 'docNumber' }"),
  'La hoja ya imprime C.C. fuera de los spans; el input no debe duplicar el prefijo.'
);
assert.ok(
  source.includes("aplicarFirma(firmaExistenteAprendiz, 'apprentice', 'draw', false)"),
  'Restaurar una firma no debe volver a guardarla ni disparar otro repintado.'
);
assert.ok(
  source.includes("aplicarFirma(firmaExistenteInstructor, 'instructor', 'draw', false)"),
  'Restaurar la firma del instructor no debe crear un ciclo de notificaciones.'
);

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  let repintados = 0;
  const refresco = helpers.crearRefrescoAgrupado(() => { repintados += 1; }, 20);

  refresco.programar();
  refresco.programar();
  refresco.programar();
  assert.equal(repintados, 0, 'El repintado no debe ejecutarse dentro del evento de escritura.');

  await esperar(35);
  assert.equal(repintados, 1, 'Tres escrituras cercanas deben producir un solo repintado.');

  refresco.ahora();
  assert.equal(repintados, 2, 'Una actualización explícita debe ejecutarse inmediatamente.');

  // Dado un campo activo, cuando llegan cambios de sesión, entonces no se reemplaza
  // el formulario hasta que el aprendiz salga de sus campos.
  let eventos = {};
  let enFormulario = true;
  let foco = { matches: (selector) => selector.includes('input') };
  const contenedor = {
    contains: (nodo) => enFormulario && nodo === foco,
    addEventListener: (tipo, listener) => { eventos[tipo] = listener; }
  };
  global.document.activeElement = foco;
  let reconstrucciones = 0;
  const protegido = helpers.crearRefrescoProtegido(() => { reconstrucciones += 1; }, contenedor, 20);
  protegido.programar();
  protegido.programar();
  await esperar(35);
  assert.equal(reconstrucciones, 0, 'El input enfocado no debe desaparecer tras una pausa al escribir.');
  enFormulario = false;
  global.document.activeElement = null;
  eventos.focusout();
  await esperar(35);
  assert.equal(reconstrucciones, 1, 'El cambio pendiente se aplica al salir del formulario.');
  console.log('EVIDENCE INPUT REGRESSION PASSED');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
