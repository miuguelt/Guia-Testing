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
assert.ok(
  source.includes('window.TestingSession.subscribe(() => refresco.programar())'),
  'Los cambios del perfil también deben agruparse antes de reconstruir el dossier.'
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
  console.log('EVIDENCE INPUT REGRESSION PASSED');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
