const fs = require('fs');
const vm = require('vm');

class Element {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.classList = { add: () => {}, remove: () => {}, toggle: () => {} };
    this.style = {};
    this.attributes = {};
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  appendChild(c) { this.children.push(c); return c; }
  replaceChildren(...nodes) { this.children = nodes; }
  querySelector(sel) {
    if (sel === '#signature-canvas') return new Canvas();
    return new Element('div');
  }
  querySelectorAll(sel) { return []; }
  addEventListener() {}
}

class Canvas extends Element {
  constructor() {
    super('canvas');
    this.width = 440;
    this.height = 140;
  }
  getContext() {
    return {
      clearRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillRect: () => {},
      fillText: () => {},
      measureText: () => ({ width: 100 }),
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      bezierCurveTo: () => {}
    };
  }
  toDataURL() { return 'data:image/png;base64,mock'; }
}

const mockDocument = {
  createElement: (tag) => tag === 'canvas' ? new Canvas() : new Element(tag),
  createTextNode: (txt) => ({ textContent: txt }),
  querySelector: (sel) => new Element('div'),
  querySelectorAll: (sel) => [],
  getElementById: (id) => new Element('div'),
  addEventListener: () => {},
  documentElement: new Element('html'),
  body: new Element('body')
};

const mockWindow = {
  document: mockDocument,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  location: { hash: '#m-evidencias-sena' },
  addEventListener: () => {},
  removeEventListener: () => {}
};
mockWindow.window = mockWindow;
global.window = mockWindow;
global.document = mockDocument;
global.localStorage = mockWindow.localStorage;
global.Image = class { constructor() {} };

const delivCode = fs.readFileSync('web/js/deliverables-registry.js', 'utf8');
vm.runInThisContext(delivCode);

const testSessCode = fs.readFileSync('web/js/testing-session.js', 'utf8');
vm.runInThisContext(testSessCode);

const evCode = fs.readFileSync('web/js/vendor/devbrain-evidence.js', 'utf8');
vm.runInThisContext(evCode);

mockWindow.DevBrainEvidence.montar({
  registro: mockWindow.GUIDE_DELIVERABLES,
  prefijo: 'guia_testing',
  dossierHref: '#m-evidencias-sena'
}).then(() => {
  console.log('SUCCESS! Montar completed with zero errors!');

  if (typeof mockWindow.DevBrainEvidence.refrescarDossier === 'function') {
    console.log('Testing refrescarDossier...');
    mockWindow.DevBrainEvidence.refrescarDossier();
    console.log('refrescarDossier OK!');
  } else {
    console.error('refrescarDossier is not a function!');
    process.exit(1);
  }

  if (typeof mockWindow.DevBrainEvidence.imprimir === 'function') {
    console.log('Testing imprimir...');
    // Mock window.print
    mockWindow.print = () => console.log('window.print called!');
    mockWindow.DevBrainEvidence.imprimir();
    console.log('imprimir OK!');
  } else {
    console.error('imprimir is not a function!');
    process.exit(1);
  }

  console.log('ALL INTEGRATION CHECKS PASSED!');
}).catch(err => {
  console.error('Montar error:', err);
  process.exit(1);
});
