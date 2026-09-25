const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

class Element {
  constructor() {
    this.children = new Map();
    this.options = [];
    this.listeners = {};
    this.disabled = false;
    this.dataset = {};
    this.classList = { add() {}, remove() {}, toggle() {} };
    this._html = '';
    this.textContent = '';
  }

  set innerHTML(value) {
    this._html = String(value);
    this.children = new Map();
    this.options = [];
    for (const match of this._html.matchAll(/\bid="([^"]+)"/g)) this.children.set(match[1], new Element());
    for (const match of this._html.matchAll(/<button\b[^>]*class="quiz-opt"[^>]*data-i="(\d+)"[^>]*>/g)) {
      const option = new Element();
      option.dataset.i = match[1];
      this.options.push(option);
    }
  }

  get innerHTML() { return this._html; }
  querySelector(selector) {
    return selector.startsWith('#') ? this.children.get(selector.slice(1)) || null : null;
  }
  querySelectorAll(selector) { return selector === '.quiz-opt' ? this.options : []; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  insertAdjacentHTML(_position, html) { this.innerHTML = this._html + html; }
  click() {
    if (!this.disabled && this.listeners.click) this.listeners.click({ preventDefault() {} });
  }
}

const storage = new Map();
const localStorage = {
  getItem: (key) => storage.has(key) ? storage.get(key) : null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};
const assertionContainer = new Element();
const designContainer = new Element();
const counter = new Element();
const document = {
  querySelector: (selector) => selector === '.sim-assertion-container' ? assertionContainer
    : selector === '.sim-diseno-container' ? designContainer : null,
  getElementById: (id) => id === 'sim-completed-counter' ? counter : null,
  addEventListener() {}
};
const gamification = { addXP() {} };
const window = { localStorage, document, GAMIFICATION: gamification };
window.window = window;
const context = { window, document, localStorage, GAMIFICATION: gamification, console };
vm.createContext(context);

vm.runInContext(fs.readFileSync('web/js/testing-session.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('web/js/module-learning-kit-data.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('web/js/simulators.js', 'utf8'), context);

const moduleKits = window.MODULE_LEARNING_KITS;
assert.equal(Object.keys(moduleKits).length, 18, 'La decisión QA debe tener recorrido en las 18 estaciones.');
for (const [moduleId, kit] of Object.entries(moduleKits)) {
  const [prompt, choices, answer, rationale] = kit.scenario || [];
  assert(prompt && Array.isArray(choices) && choices.length >= 2, `${moduleId} debe tener una decisión y opciones.`);
  assert(Number.isInteger(answer) && answer >= 0 && answer < choices.length, `${moduleId} debe tener una respuesta válida.`);
  assert(rationale, `${moduleId} debe explicar el criterio de su respuesta.`);
}

function answerAssertion(answers) {
  for (const answer of answers) {
    (answer ? assertionContainer.querySelector('#assert-pass') : assertionContainer.querySelector('#assert-fail')).click();
    assertionContainer.querySelector('#assert-feedback').querySelector('#assert-next').click();
  }
}

vm.runInContext('SIMULATORS.renderAssertionValidator()', context);
const assertionAnswers = [true, true, false, true, true, true, true, false];
assertionContainer.querySelector('#assert-fail').click();
const firstQuestion = assertionContainer.querySelector('#assert-progress').textContent;
assert.equal(assertionContainer.querySelector('#assert-language').textContent, 'Python');
assertionContainer.querySelector('#assert-fail').click();
assert.equal(assertionContainer.querySelector('#assert-progress').textContent, firstQuestion, 'Un doble clic no debe saltar preguntas.');
assertionContainer.querySelector('#assert-feedback').querySelector('#assert-next').click();
assert.equal(window.TestingSession.getSimulators()['sim-assertion'].inProgress.currentIndex, 1, 'El avance parcial debe guardarse en la sesión.');
vm.runInContext('SIMULATORS.renderAssertionValidator()', context);
assert.equal(assertionContainer.querySelector('#assert-progress').textContent, 'Pregunta 2 de 8', 'La evaluación de aserciones debe reanudarse tras recrear la pantalla.');
const failedAnswers = assertionAnswers.map((answer) => !answer);
for (let index = 1; index < 4; index++) {
  if (index === 3) assert.equal(assertionContainer.querySelector('#assert-language').textContent, 'JavaScript');
  (failedAnswers[index] ? assertionContainer.querySelector('#assert-pass') : assertionContainer.querySelector('#assert-fail')).click();
  assertionContainer.querySelector('#assert-feedback').querySelector('#assert-next').click();
}
answerAssertion(failedAnswers.slice(4));
assert.equal(window.TestingSession.getSimulators()['sim-assertion'].passed, false, 'Un intento sin aciertos debe quedar pendiente.');
assert(assertionContainer.querySelector('#assert-feedback').innerHTML.includes('assert-retry'), 'La evaluación de aserciones debe permitir reintentar.');
assertionContainer.querySelector('#assert-feedback').querySelector('#assert-retry').click();
answerAssertion(assertionAnswers);
assert.equal(window.TestingSession.getSimulators()['sim-assertion'].score, 8);
assert.equal(window.TestingSession.getSimulators()['sim-assertion'].passed, true, 'El puntaje aprobatorio debe reflejarse en la sesión.');
assertionContainer.querySelector('#assert-feedback').querySelector('#assert-retry').click();
answerAssertion(assertionAnswers.map((answer) => !answer));
assert.equal(window.TestingSession.getSimulators()['sim-assertion'].score, 8, 'Un reintento posterior no debe revocar el mejor resultado.');

vm.runInContext('SIMULATORS.renderDesignQuiz()', context);
const designAnswers = [2, 0, 1, 2, 1, 3, 1, 1, 2, 1];
const failedDesignAnswers = designAnswers.map((answer) => answer === 0 ? 1 : 0);
function answerDesign(answers) {
  for (const answer of answers) {
    const options = designContainer.querySelector('#diseno-content').querySelectorAll('.quiz-opt');
    options[answer].click();
    designContainer.querySelector('#diseno-content').querySelector('#diseno-feedback').querySelector('#diseno-next').click();
  }
}
const firstDesignOptions = designContainer.querySelector('#diseno-content').querySelectorAll('.quiz-opt');
firstDesignOptions[failedDesignAnswers[0]].click();
designContainer.querySelector('#diseno-content').querySelector('#diseno-feedback').querySelector('#diseno-next').click();
assert.equal(window.TestingSession.getSimulators()['sim-diseno'].inProgress.currentIndex, 1, 'El avance del reto de préstamos debe guardarse.');
vm.runInContext('SIMULATORS.renderDesignQuiz()', context);
assert(designContainer.querySelector('#diseno-content').innerHTML.includes('Pregunta 2 de 10'), `El reto de préstamos debe reanudarse tras recrear la pantalla: ${designContainer.querySelector('#diseno-content').innerHTML}`);
answerDesign(failedDesignAnswers.slice(1));
assert.equal(window.TestingSession.getSimulators()['sim-diseno'].passed, false, 'El primer intento incorrecto debe permanecer pendiente.');
assert(designContainer.querySelector('#diseno-content').innerHTML.includes('diseno-retry'), 'El reto de préstamos debe permitir reintentar.');
designContainer.querySelector('#diseno-content').querySelector('#diseno-retry').click();
answerDesign(designAnswers);
assert.equal(window.TestingSession.getSimulators()['sim-diseno'].score, 10);
assert.equal(window.TestingSession.getSimulators()['sim-diseno'].passed, true, 'El reto de préstamos debe aprobarse al superar el umbral.');
designContainer.querySelector('#diseno-content').querySelector('#diseno-retry').click();
answerDesign(failedDesignAnswers);
assert.equal(window.TestingSession.getSimulators()['sim-diseno'].score, 10, 'Un reintento posterior no debe revocar el mejor resultado.');

window.TestingSession.recordSimulator('sim-module-decisions', 1, 1, 'Decisión acertada en un módulo.');
window.TestingSession.recordSimulator('sim-module-decisions', 0, 1, 'Otro intento incorrecto.');
assert.equal(window.TestingSession.getSimulators()['sim-module-decisions'].passed, true, 'Una respuesta correcta previa debe conservar la aprobación compartida entre módulos.');

console.log('SIMULATOR COMPLETION REGRESSION PASSED');
