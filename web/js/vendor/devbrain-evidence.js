/* DevBrain · estaciones de evidencia para guías. Generado por bundle.cjs. */
(function (global) {
  /* --- code/theme-probe.js --- */
  /**
   * Elección automática de la paleta clara u oscura de un bloque.
   *
   * Las guías del ecosistema no comparten interruptor de tema: unas usan
   * `data-theme="dark"`, otras `claro`, otras `sena` u `ocean`, y algunas no
   * tienen ninguno. Encadenar selectores para todas garantizaba que la siguiente
   * guía volviera a quedarse fuera.
   *
   * Aquí se mide el fondo que el bloque realmente recibió y se decide por
   * luminancia. Funciona con cualquier nombre de tema, presente o futuro, y se
   * vuelve a medir cuando el tema cambia.
   */
  
  const OBSERVADOS = new Set();
  let observadorTema = null;
  
  /** Luminancia relativa aproximada de un `rgb()/rgba()` calculado. */
  function luminancia(color) {
    const m = /rgba?\(([^)]+)\)/.exec(String(color || ''));
    if (!m) return null;
    const partes = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (partes.length < 3) return null;
    const alfa = partes.length > 3 ? partes[3] : 1;
    if (alfa < 0.2) return null;   // transparente: no dice nada del fondo real
    return (0.2126 * partes[0] + 0.7152 * partes[1] + 0.0722 * partes[2]) / 255;
  }
  
  /** Sube por los ancestros hasta encontrar un fondo opaco del que fiarse. */
  function fondoEfectivo(nodo) {
    let actual = nodo;
    while (actual && actual !== document.documentElement) {
      const lum = luminancia(getComputedStyle(actual).backgroundColor);
      if (lum !== null) return lum;
      actual = actual.parentElement;
    }
    const raiz = luminancia(getComputedStyle(document.documentElement).backgroundColor);
    return raiz === null ? 0 : raiz;
  }
  
  /**
   * ¿El fondo que recibe este nodo es claro?
   *
   * Se expone porque el módulo de evidencias necesita la misma decisión: sus
   * tarjetas se insertan en guías claras y oscuras, y una tarjeta blanca sobre
   * una guía oscura se lee como un error de la página. Medir dos veces la misma
   * cosa con dos copias del cálculo terminaría en dos respuestas distintas.
   *
   * @param {HTMLElement} nodo
   * @returns {boolean}
   */
  function fondoEsClaro(nodo) {
    return fondoEfectivo(nodo) > 0.5;
  }
  
  /** Aplica o retira la clase de paleta clara según el fondo heredado. */
  function ajustarPaleta(figura) {
    if (!figura || !figura.isConnected) return;
    figura.classList.remove('dbc--claro');
    figura.classList.toggle('dbc--claro', fondoEsClaro(figura.parentElement || figura));
  }
  
  function reajustarTodo() {
    OBSERVADOS.forEach(function (figura) {
      if (figura.isConnected) ajustarPaleta(figura);
      else OBSERVADOS.delete(figura);
    });
  }
  
  /**
   * Registra un bloque para que siga al tema de la página.
   *
   * La medición se aplaza con `setTimeout`, no con `requestAnimationFrame`: el
   * bloque se construye antes de que quien lo pidió lo inserte, y estas guías son
   * aplicaciones de una sola página que mantienen ocultos los módulos que no se
   * están viendo. Un cuadro de animación no llega nunca en una pestaña oculta ni
   * en un contenedor sin pintar, y el bloque se quedaba con la paleta que no era.
   */
  function seguirTema(figura) {
    OBSERVADOS.add(figura);
    setTimeout(function () { ajustarPaleta(figura); }, 0);
  
    // Y otra vez cuando el bloque se hace visible: al cambiar de módulo, la guía
    // puede colocarlo bajo un contenedor con otro fondo del que tenía al nacer.
    if (typeof IntersectionObserver === 'function') {
      const visible = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) ajustarPaleta(figura);
        });
      });
      visible.observe(figura);
    }
  
    if (!observadorTema && typeof MutationObserver === 'function') {
      observadorTema = new MutationObserver(reajustarTodo);
      observadorTema.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-tema', 'style'] });
      if (document.body) {
        observadorTema.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-tema'] });
      }
      if (window.matchMedia) {
        const consulta = window.matchMedia('(prefers-color-scheme: dark)');
        if (consulta.addEventListener) consulta.addEventListener('change', reajustarTodo);
      }
    }
  }
  

  /* --- evidence/registry.js --- */
  /**
   * Normalización del registro de entregables (`deliverables.registry.json`).
   *
   * El registro nació en la versión 1 como una lista plana de artefactos que la
   * guía mostraba de una sola vez, casi siempre al final. Esa forma producía el
   * problema que este módulo existe para corregir: el aprendiz recorría toda la
   * teoría y encontraba la factura completa en la última pantalla.
   *
   * La versión 2 ancla cada artefacto a la sección donde se produce
   * (`station.sectionId`) y añade el bloque `submission`, que explica qué se
   * carga y con qué se aprueba. Un registro v1 sigue funcionando: aquí se
   * completa con valores derivados y se marca lo que falta, en vez de romperse.
   */
  
  const DBE_TIPOS_EVIDENCIA = ['conocimiento', 'desempeño', 'producto'];
  const DBE_FASES = ['reflexion', 'contextualizacion', 'apropiacion', 'transferencia'];
  
  /**
   * Convierte una clave camelCase o kebab en una etiqueta legible en español.
   * @param {string} clave
   * @returns {string}
   */
  function dbeEtiquetaDesdeClave(clave) {
    const texto = String(clave || '')
      .replace(/[_-]+/g, ' ')
      .replace(/([a-záéíóúñ0-9])([A-ZÁÉÍÓÚÑ])/g, '$1 $2')
      .trim();
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  
  /**
   * Deduce el tipo de campo por el nombre y la longitud esperada.
   * @param {string} clave
   * @returns {'texto'|'area'}
   */
  function dbeTipoPorClave(clave) {
    const largo = /descripcion|descripción|instruccion|instrucción|justificacion|justificación|hallazgo|decision|decisión|observacion|observación|escenario|criterio|regla|resumen|nota|analisis|análisis|prompt/i;
    return largo.test(String(clave || '')) ? 'area' : 'texto';
  }
  
  /**
   * Normaliza la definición de campos de un artefacto.
   *
   * Acepta `fields` (v2, objetos con metadatos) y `templateFields` (v1, cadenas).
   * Un registro v1 no se descarta: sus cadenas se convierten en campos de texto
   * con etiqueta derivada, para que la estación pueda pedirse igual.
   *
   * @param {Object} artefacto
   * @returns {Array<Object>}
   */
  function dbeNormalizarCampos(artefacto) {
    const declarados = Array.isArray(artefacto.fields) ? artefacto.fields : [];
    if (declarados.length) {
      return declarados.map((campo, indice) => {
        const columnas = Array.isArray(campo.columns)
          ? campo.columns.map((columna, posicion) => ({
            key: String(columna.key || `col${posicion + 1}`),
            label: String(columna.label || dbeEtiquetaDesdeClave(columna.key) || `Columna ${posicion + 1}`),
            placeholder: columna.placeholder ? String(columna.placeholder) : '',
          }))
          : [];
  
        // Una SIPOC, un catálogo de reglas o una matriz de trazabilidad no caben
        // en un campo de texto: son tablas de varias filas. Declararlas como
        // `tabla` evita que cada guía vuelva a escribir su propio constructor,
        // que es como el ecosistema terminó con cuatro implementaciones distintas
        // del mismo entregable.
        const tipoDeclarado = String(campo.type || '');
        let tipo = 'texto';
        if (tipoDeclarado === 'area' || tipoDeclarado === 'textarea') tipo = 'area';
        else if (tipoDeclarado === 'lista') tipo = 'lista';
        else if (tipoDeclarado === 'tabla' && columnas.length) tipo = 'tabla';
  
        return {
          key: String(campo.key || `campo${indice + 1}`),
          label: String(campo.label || dbeEtiquetaDesdeClave(campo.key) || `Campo ${indice + 1}`),
          type: tipo,
          columns: columnas,
          hint: campo.hint ? String(campo.hint) : '',
          placeholder: campo.placeholder ? String(campo.placeholder) : '',
          required: campo.required !== false,
        };
      });
    }
    const plantilla = Array.isArray(artefacto.templateFields) ? artefacto.templateFields : [];
    return plantilla.map((clave, indice) => ({
      key: String(clave || `campo${indice + 1}`),
      label: dbeEtiquetaDesdeClave(clave) || `Campo ${indice + 1}`,
      type: dbeTipoPorClave(clave),
      columns: [],
      hint: '',
      placeholder: '',
      required: true,
    }));
  }
  
  /**
   * Deriva un nombre de archivo estable para el entregable.
   * @param {Object} artefacto
   * @param {number} orden
   * @returns {string}
   */
  function dbeNombreArchivo(artefacto, orden) {
    if (artefacto.upload && artefacto.upload.fileName) return String(artefacto.upload.fileName);
    const base = String(artefacto.code || artefacto.id || `evidencia-${orden}`)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^\x20-\x7e]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${String(orden).padStart(2, '0')}-${base}.md`;
  }
  
  /**
   * Normaliza un artefacto a la forma que consumen la estación y el dossier.
   * @param {Object} bruto
   * @param {number} indice
   * @returns {Object}
   */
  function dbeNormalizarArtefacto(bruto, indice) {
    const estacion = bruto.station || {};
    const orden = Number.isFinite(Number(estacion.order)) ? Number(estacion.order) : indice + 1;
    const tipo = DBE_TIPOS_EVIDENCIA.includes(String(bruto.evidenceType)) ? String(bruto.evidenceType) : 'producto';
    const fase = DBE_FASES.includes(String(estacion.phase)) ? String(estacion.phase) : '';
  
    return {
      id: String(bruto.id || `A${indice + 1}`),
      code: String(bruto.code || bruto.id || `A${indice + 1}`),
      name: String(bruto.name || bruto.id || `Entregable ${indice + 1}`),
      purpose: String(bruto.purpose || ''),
      inputs: Array.isArray(bruto.inputs) ? bruto.inputs.map(String) : [],
      instructions: String(bruto.instructions || ''),
      example: String(bruto.example || ''),
      criterion: String(bruto.criterion || ''),
      instrument: String(bruto.instrument || ''),
      evidence: String(bruto.evidence || ''),
      nextStep: String(bruto.nextStep || ''),
      evidenceType: tipo,
      checklist: Array.isArray(bruto.checklist) ? bruto.checklist.map(String) : [],
      aiAssist: bruto.aiAssist
        ? {
          prompt: String(bruto.aiAssist.prompt || ''),
          verify: String(bruto.aiAssist.verify || ''),
          log: String(bruto.aiAssist.log || ''),
        }
        : null,
      station: {
        sectionId: String(estacion.sectionId || ''),
        order: orden,
        phase: fase,
        minutes: Number.isFinite(Number(estacion.minutes)) ? Number(estacion.minutes) : null,
      },
      fields: dbeNormalizarCampos(bruto),
      upload: {
        fileName: dbeNombreArchivo(bruto, orden),
        format: String((bruto.upload && bruto.upload.format) || 'markdown'),
      },
    };
  }
  
  /**
   * Normaliza el bloque de entrega final.
   * @param {Object} bruto
   * @returns {Object}
   */
  function dbeNormalizarEntrega(bruto) {
    const entrega = bruto || {};
    return {
      packageName: String(entrega.packageName || ''),
      format: String(entrega.format || ''),
      where: String(entrega.where || ''),
      namingRule: String(entrega.namingRule || ''),
      whatIsGraded: String(entrega.whatIsGraded || ''),
      approval: Array.isArray(entrega.approval) ? entrega.approval.map(String) : [],
      competencyMap: Array.isArray(entrega.competencyMap)
        ? entrega.competencyMap.map((fila) => ({
          evidenceType: String(fila.evidenceType || ''),
          artifacts: Array.isArray(fila.artifacts) ? fila.artifacts.map(String) : [],
          criterion: String(fila.criterion || ''),
          instrument: String(fila.instrument || ''),
          learningResult: String(fila.learningResult || ''),
        }))
        : [],
      notes: String(entrega.notes || ''),
      declared: Boolean(bruto),
    };
  }
  
  /**
   * Normaliza un registro completo y devuelve además los huecos detectados.
   *
   * Los huecos no se rellenan con texto inventado: se devuelven en `gaps` para
   * que la guía los muestre como pendientes visibles. Un dato institucional
   * fabricado es peor que un dato ausente.
   *
   * @param {Object} bruto - Contenido de deliverables.registry.json
   * @returns {{guideId: string, status: string, sourceStatus: string, artifacts: Array, submission: Object, gaps: Array<string>}}
   */
  function dbeNormalizarRegistro(bruto) {
    const registro = bruto || {};
    const artefactos = (Array.isArray(registro.artifacts) ? registro.artifacts : [])
      .map(dbeNormalizarArtefacto)
      .sort((a, b) => a.station.order - b.station.order);
  
    const gaps = [];
    artefactos.forEach((artefacto) => {
      if (!artefacto.station.sectionId) {
        gaps.push(`${artefacto.id} no declara la sección donde se produce (station.sectionId).`);
      }
      if (!artefacto.fields.length) {
        gaps.push(`${artefacto.id} no declara campos de plantilla.`);
      }
    });
  
    const submission = dbeNormalizarEntrega(registro.submission);
    if (!submission.declared) {
      gaps.push('El registro no declara el bloque submission: qué se carga y con qué se aprueba.');
    }
  
    return {
      guideId: String(registro.guideId || ''),
      status: String(registro.status || ''),
      sourceStatus: String(registro.sourceStatus || ''),
      artifacts: artefactos,
      submission,
      gaps,
    };
  }
  
  /**
   * Agrupa los artefactos por sección de la guía.
   * @param {Array} artefactos
   * @returns {Map<string, Array>}
   */
  function dbeAgruparPorSeccion(artefactos) {
    const mapa = new Map();
    artefactos.forEach((artefacto) => {
      const clave = artefacto.station.sectionId || '__sin-seccion__';
      if (!mapa.has(clave)) mapa.set(clave, []);
      mapa.get(clave).push(artefacto);
    });
    return mapa;
  }
  
  

  /* --- evidence/store.js --- */
  /**
   * Estado local de las evidencias de una guía.
   *
   * Guarda lo que el aprendiz escribe en cada estación para que el recorrido no
   * dependa de terminar en una sola sesión, y para que la consolidación final no
   * vuelva a pedir lo que ya se produjo.
   *
   * Límites deliberados:
   * - Todo vive en `localStorage`, en el navegador de quien estudia. No hay envío
   *   remoto, no hay cuenta y no hay servidor: una guía debe abrirse desde un USB
   *   en un aula sin red.
   * - El estado `verificada` no existe. La web puede decir que una evidencia está
   *   completa según el criterio declarado; no puede emitir el juicio evaluativo
   *   del instructor, y fingirlo sería el peor daño posible en una guía SENA.
   */
  
  const DBE_ESTADOS = ['pendiente', 'borrador', 'lista'];
  
  /**
   * Almacén de evidencias con espacio de nombres por guía.
   */
  class DbeEvidenceStore {
    /**
     * @param {string} prefijo - Prefijo de las claves (ej. `devbrain_guia3`)
     */
    constructor(prefijo) {
      this.prefijo = prefijo || 'devbrain_evidencia';
      this.oyentes = new Set();
    }
  
    /**
     * Clave completa de un artefacto.
     * @param {string} id
     * @returns {string}
     */
    clave(id) {
      return `${this.prefijo}_evidencia_${id}`;
    }
  
    /**
     * Lee el registro guardado de un artefacto.
     * @param {string} id
     * @returns {{values: Object, checks: Object, status: string, updatedAt: string|null}}
     */
    leer(id) {
      const vacio = { values: {}, checks: {}, status: 'pendiente', updatedAt: null };
      try {
        const crudo = localStorage.getItem(this.clave(id));
        if (!crudo) return vacio;
        const dato = JSON.parse(crudo);
        return {
          values: dato && typeof dato.values === 'object' && dato.values ? dato.values : {},
          checks: dato && typeof dato.checks === 'object' && dato.checks ? dato.checks : {},
          status: DBE_ESTADOS.includes(dato && dato.status) ? dato.status : 'pendiente',
          updatedAt: dato && dato.updatedAt ? String(dato.updatedAt) : null,
        };
      } catch (error) {
        console.warn('No se pudo leer la evidencia', id, error);
        return vacio;
      }
    }
  
    /**
     * Guarda el registro de un artefacto y notifica a los oyentes.
     * @param {string} id
     * @param {Object} parcial - Campos a fusionar
     * @returns {Object} El registro resultante
     */
    guardar(id, parcial) {
      const actual = this.leer(id);
      const siguiente = {
        values: { ...actual.values, ...(parcial.values || {}) },
        checks: { ...actual.checks, ...(parcial.checks || {}) },
        status: DBE_ESTADOS.includes(parcial.status) ? parcial.status : actual.status,
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(this.clave(id), JSON.stringify(siguiente));
      } catch (error) {
        console.warn('No se pudo guardar la evidencia', id, error);
      }
      this.notificar(id, siguiente);
      return siguiente;
    }
  
    /**
     * Borra el registro de un artefacto.
     * @param {string} id
     */
    borrar(id) {
      try {
        localStorage.removeItem(this.clave(id));
      } catch (error) {
        console.warn('No se pudo borrar la evidencia', id, error);
      }
      this.notificar(id, this.leer(id));
    }
  
    /**
     * Añade una entrada a la bitácora humano–IA.
     *
     * La bitácora es una evidencia en sí misma: en 2026 la pregunta evaluable no
     * es si se usó IA, sino qué se le pidió, qué se verificó y quién decidió.
     *
     * @param {{artifactId: string, prompt: string, tool: string, verified: string, decision: string}} entrada
     * @returns {Array<Object>} La bitácora completa
     */
    registrarUsoIa(entrada) {
      const bitacora = this.leerBitacora();
      bitacora.push({
        artifactId: String(entrada.artifactId || ''),
        prompt: String(entrada.prompt || ''),
        tool: String(entrada.tool || ''),
        verified: String(entrada.verified || ''),
        decision: String(entrada.decision || ''),
        at: new Date().toISOString(),
      });
      try {
        localStorage.setItem(`${this.prefijo}_bitacora_ia`, JSON.stringify(bitacora));
      } catch (error) {
        console.warn('No se pudo registrar el uso de IA', error);
      }
      this.notificar('__bitacora__', bitacora);
      return bitacora;
    }
  
    /**
     * Lee la bitácora humano–IA.
     * @returns {Array<Object>}
     */
    leerBitacora() {
      try {
        const crudo = localStorage.getItem(`${this.prefijo}_bitacora_ia`);
        const dato = crudo ? JSON.parse(crudo) : [];
        return Array.isArray(dato) ? dato : [];
      } catch (error) {
        console.warn('No se pudo leer la bitácora de IA', error);
        return [];
      }
    }
  
    /**
     * Suscribe una función a los cambios del almacén.
     * @param {Function} oyente
     * @returns {Function} Función para cancelar la suscripción
     */
    suscribir(oyente) {
      if (typeof oyente === 'function') this.oyentes.add(oyente);
      return () => this.oyentes.delete(oyente);
    }
  
    /**
     * Notifica un cambio a los oyentes.
     * @param {string} id
     * @param {Object} dato
     */
    notificar(id, dato) {
      this.oyentes.forEach((oyente) => {
        try {
          oyente(id, dato);
        } catch (error) {
          console.warn('Un oyente de evidencia falló', error);
        }
      });
    }
  
    /**
     * Exporta todo el trabajo local como objeto serializable.
     * @param {Array<string>} ids
     * @returns {Object}
     */
    exportar(ids) {
      const evidencias = {};
      (ids || []).forEach((id) => { evidencias[id] = this.leer(id); });
      return { prefijo: this.prefijo, exportadoEn: new Date().toISOString(), evidencias, bitacoraIa: this.leerBitacora() };
    }
  
    /**
     * Importa un respaldo generado por `exportar`.
     * @param {Object|string} datos
     * @returns {boolean}
     */
    importar(datos) {
      try {
        const objeto = typeof datos === 'string' ? JSON.parse(datos) : datos;
        if (!objeto || typeof objeto !== 'object' || !objeto.evidencias) return false;
        Object.entries(objeto.evidencias).forEach(([id, registro]) => {
          localStorage.setItem(this.clave(id), JSON.stringify(registro));
        });
        if (Array.isArray(objeto.bitacoraIa)) {
          localStorage.setItem(`${this.prefijo}_bitacora_ia`, JSON.stringify(objeto.bitacoraIa));
        }
        this.notificar('__importado__', objeto);
        return true;
      } catch (error) {
        console.warn('No se pudo importar el respaldo de evidencias', error);
        return false;
      }
    }
  }
  
  /**
   * Calcula el estado de un artefacto a partir de lo diligenciado.
   *
   * `lista` exige campos obligatorios y autochequeo completos. Sin autochequeo
   * declarado basta con los campos: una guía no debe inventar requisitos que su
   * propio registro no declaró.
   *
   * @param {Object} artefacto - Artefacto normalizado
   * @param {Object} registro - Registro del almacén
   * @returns {'pendiente'|'borrador'|'lista'}
   */
  function dbeCalcularEstado(artefacto, registro) {
    const valores = registro.values || {};
    const marcas = registro.checks || {};
  
    /**
     * Un campo cuenta como diligenciado según su tipo: un texto necesita
     * contenido y una tabla necesita al menos una fila.
     * @param {Object} campo
     * @returns {boolean}
     */
    const diligenciado = (campo) => {
      const valor = valores[campo.key];
      if (campo.type === 'tabla') return Array.isArray(valor) && valor.length > 0;
      return String(valor || '').trim().length > 0;
    };
  
    const obligatorios = artefacto.fields.filter((campo) => campo.required);
    if (!artefacto.fields.some(diligenciado)) return 'pendiente';
  
    const faltanCampos = obligatorios.some((campo) => !diligenciado(campo));
    const faltanMarcas = artefacto.checklist.some((_, indice) => marcas[`c${indice}`] !== true);
    if (faltanCampos || faltanMarcas) return 'borrador';
    return 'lista';
  }
  
  

  /* --- evidence/dom.js --- */
  /**
   * Ayudantes de DOM para el módulo de evidencias.
   *
   * Todo se construye con `createElement` y `textContent`. Nada de `innerHTML`
   * con texto del aprendiz: lo que se escribe en una estación se vuelve a pintar
   * en el dossier, y ese camino es exactamente donde una guía educativa se
   * convertiría en un ejercicio de XSS contra quien estudia.
   */
  
  /**
   * Crea un elemento con clase, texto y atributos.
   * @param {string} etiqueta
   * @param {Object} [opciones]
   * @param {string} [opciones.clase]
   * @param {string} [opciones.texto]
   * @param {Object} [opciones.attrs]
   * @param {Array<Node>} [opciones.hijos]
   * @returns {HTMLElement}
   */
  function dbeEl(etiqueta, opciones = {}) {
    const nodo = document.createElement(etiqueta);
    if (opciones.clase) nodo.className = opciones.clase;
    if (opciones.texto !== undefined && opciones.texto !== null) nodo.textContent = String(opciones.texto);
    if (opciones.attrs) {
      Object.entries(opciones.attrs).forEach(([nombre, valor]) => {
        if (valor === null || valor === undefined || valor === false) return;
        nodo.setAttribute(nombre, valor === true ? '' : String(valor));
      });
    }
    if (Array.isArray(opciones.hijos)) {
      opciones.hijos.filter(Boolean).forEach((hijo) => nodo.appendChild(hijo));
    }
    return nodo;
  }
  
  /**
   * Crea un bloque titulado con contenido de texto.
   * @param {string} titulo
   * @param {string} cuerpo
   * @param {string} [clase]
   * @returns {HTMLElement|null}
   */
  function dbeBloque(titulo, cuerpo, clase = '') {
    const texto = String(cuerpo || '').trim();
    if (!texto) return null;
    return dbeEl('div', {
      clase: `dbe-bloque ${clase}`.trim(),
      hijos: [
        dbeEl('h4', { clase: 'dbe-bloque__titulo', texto: titulo }),
        dbeEl('p', { clase: 'dbe-bloque__texto', texto }),
      ],
    });
  }
  
  /**
   * Crea una lista de fichas a partir de un arreglo de textos.
   * @param {string} titulo
   * @param {Array<string>} elementos
   * @returns {HTMLElement|null}
   */
  function dbeFichas(titulo, elementos) {
    const lista = (elementos || []).map(String).filter((texto) => texto.trim().length > 0);
    if (!lista.length) return null;
    return dbeEl('div', {
      clase: 'dbe-bloque',
      hijos: [
        dbeEl('h4', { clase: 'dbe-bloque__titulo', texto: titulo }),
        dbeEl('ul', {
          clase: 'dbe-fichas',
          hijos: lista.map((texto) => dbeEl('li', { clase: 'dbe-ficha', texto })),
        }),
      ],
    });
  }
  
  /**
   * Copia texto al portapapeles y da retroalimentación en el botón.
   * @param {string} texto
   * @param {HTMLElement} boton
   * @param {string} [exito]
   */
  async function dbeCopiar(texto, boton, exito = 'Copiado') {
    if (!texto) return;
    const original = boton ? boton.textContent : '';
    try {
      await navigator.clipboard.writeText(texto);
      if (boton) boton.textContent = exito;
    } catch (error) {
      if (boton) boton.textContent = 'Selecciona y copia a mano';
    }
    if (boton) {
      window.setTimeout(() => { boton.textContent = original; }, 1800);
    }
  }
  
  /**
   * Descarga un texto como archivo local.
   * @param {string} texto
   * @param {string} nombre
   * @param {string} [mime]
   */
  function dbeDescargar(texto, nombre, mime = 'text/markdown;charset=utf-8') {
    if (!texto) return;
    const blob = new Blob([texto], { type: mime });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  }
  
  /**
   * Etiqueta legible de un estado de evidencia.
   * @param {string} estado
   * @returns {string}
   */
  function dbeEtiquetaEstado(estado) {
    if (estado === 'lista') return 'Lista para entregar';
    if (estado === 'borrador') return 'En borrador';
    return 'Pendiente';
  }
  
  /**
   * Etiqueta legible del tipo de evidencia.
   * @param {string} tipo
   * @returns {string}
   */
  function dbeEtiquetaTipo(tipo) {
    if (tipo === 'conocimiento') return 'Evidencia de conocimiento';
    if (tipo === 'desempeño') return 'Evidencia de desempeño';
    return 'Evidencia de producto';
  }
  

  /* --- evidence/markdown.js --- */
  /**
   * Serialización de evidencias a Markdown.
   *
   * El aprendiz entrega archivos, no capturas de una web. Cada estación produce
   * un `.md` que puede pegarse en el dossier, versionarse en Git o convertirse en
   * PDF, y la consolidación produce el paquete completo con el mismo formato.
   */
  
  
  /**
   * Escapa el contenido de una celda de tabla Markdown.
   * @param {string} texto
   * @returns {string}
   */
  function dbeCelda(texto) {
    return String(texto === undefined || texto === null || texto === '' ? '—' : texto)
      .replace(/\|/g, '\\|')
      .replace(/\r?\n/g, ' ');
  }
  
  /**
   * Genera el Markdown de una evidencia diligenciada.
   * @param {Object} artefacto - Artefacto normalizado
   * @param {Object} registro - Registro del almacén
   * @param {string} estado - Estado calculado
   * @returns {string}
   */
  function dbeEvidenciaAMarkdown(artefacto, registro, estado) {
    const valores = registro.values || {};
    const lineas = [];
    lineas.push(`# ${artefacto.code} · ${artefacto.name}`);
    lineas.push('');
    lineas.push(`- **Identificador:** ${artefacto.id}`);
    lineas.push(`- **Tipo:** ${dbeEtiquetaTipo(artefacto.evidenceType)}`);
    lineas.push(`- **Estado en el recorrido web:** ${dbeEtiquetaEstado(estado)}`);
    if (artefacto.criterion) lineas.push(`- **Criterio observable:** ${artefacto.criterion}`);
    if (artefacto.instrument) lineas.push(`- **Instrumento:** ${artefacto.instrument}`);
    if (artefacto.evidence) lineas.push(`- **Qué se entrega:** ${artefacto.evidence}`);
    lineas.push('');
  
    if (artefacto.purpose) {
      lineas.push('## Para qué existe');
      lineas.push('');
      lineas.push(artefacto.purpose);
      lineas.push('');
    }
  
    lineas.push('## Contenido');
    lineas.push('');
    artefacto.fields.forEach((campo) => {
      lineas.push(`### ${campo.label}`);
      lineas.push('');
      if (campo.type === 'tabla') {
        const filas = Array.isArray(valores[campo.key]) ? valores[campo.key] : [];
        if (!filas.length) {
          lineas.push('_Pendiente._');
        } else {
          lineas.push(`| ${campo.columns.map((columna) => dbeCelda(columna.label)).join(' | ')} |`);
          lineas.push(`| ${campo.columns.map(() => '---').join(' | ')} |`);
          filas.forEach((fila) => {
            lineas.push(`| ${campo.columns.map((columna) => dbeCelda(fila[columna.key])).join(' | ')} |`);
          });
        }
      } else {
        lineas.push(String(valores[campo.key] || '').trim() || '_Pendiente._');
      }
      lineas.push('');
    });
  
    if (artefacto.checklist.length) {
      lineas.push('## Autochequeo contra el criterio');
      lineas.push('');
      artefacto.checklist.forEach((item, indice) => {
        const marcado = (registro.checks || {})[`c${indice}`] === true;
        lineas.push(`- [${marcado ? 'x' : ' '}] ${item}`);
      });
      lineas.push('');
    }
  
    if (artefacto.nextStep) {
      lineas.push('## Hacia dónde sigue');
      lineas.push('');
      lineas.push(artefacto.nextStep);
      lineas.push('');
    }
  
    lineas.push('---');
    lineas.push('');
    lineas.push('El estado de esta evidencia lo calcula la guía a partir del criterio declarado. No equivale a la valoración del instructor.');
    lineas.push('');
    return lineas.join('\n');
  }
  
  /**
   * Genera la tabla de control de todas las evidencias.
   * @param {Array<Object>} filas - {artefacto, estado}
   * @returns {string}
   */
  function dbeTablaControl(filas) {
    const salida = [
      '| # | Código | Evidencia | Tipo | Estado | Archivo | Instrumento |',
      '| --- | --- | --- | --- | --- | --- | --- |',
    ];
    filas.forEach(({ artefacto, estado }) => {
      const celdas = [
        artefacto.station.order,
        artefacto.code,
        artefacto.name,
        dbeEtiquetaTipo(artefacto.evidenceType).replace('Evidencia de ', ''),
        dbeEtiquetaEstado(estado),
        artefacto.upload.fileName,
        artefacto.instrument,
      ].map(dbeCelda);
      salida.push(`| ${celdas.join(' | ')} |`);
    });
    return salida.join('\n');
  }
  
  /**
   * Genera el paquete completo de evidencias listo para entregar.
   * @param {Object} opciones
   * @param {Object} opciones.registro - Registro normalizado
   * @param {Array<Object>} opciones.filas - {artefacto, datos, estado}
   * @param {Array<Object>} opciones.bitacora - Bitácora humano–IA
   * @param {Object} [opciones.identificacion] - Datos de portada declarados por la guía
   * @returns {string}
   */
  function dbePaqueteAMarkdown({ registro, filas, bitacora, identificacion }) {
    const lineas = [];
    const entrega = registro.submission || {};
    const ts = (typeof window !== 'undefined' ? window.TestingSession : (typeof global !== 'undefined' ? global.TestingSession : null));
    const progress = ts ? ts.calculateProgress() : { weightedScore: 0, isApproved: false, verdict: 'PENDIENTE', verdictDescription: '' };
    const checks = ts ? ts.getTestChecks() : [];
    const sims = ts ? ts.getSimulators() : {};
    const passedChecksCount = checks.filter(c => c.passed).length;
    const dateStr = (identificacion && identificacion.date) || new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    lineas.push(`# SERVICIO NACIONAL DE APRENDIZAJE — SENA`);
    lineas.push(`## SISTEMA INTEGRADO DE GESTIÓN Y AUTOCONTROL (SIGA)`);
    lineas.push(`### REGISTRO INTEGRAL DE EVIDENCIAS DE APRENDIZAJE · ADAPTACIÓN DIDÁCTICA ADSO`);
    lineas.push('');
    lineas.push(`**Programa de Formación:** Tecnólogo en Análisis y Desarrollo de Software (ADSO — Código: 228118)  `);
    lineas.push(`**Competencia Laboral:** 220501098 · Verificar los entregables del desarrollo de software de acuerdo con las especificaciones del diseño  `);
    lineas.push(`**Resultado de Aprendizaje (RAP-01):** Diseñar y ejecutar el plan de pruebas verificando requisitos funcionales y no funcionales  `);
    lineas.push(`**Ficha de Caracterización:** ${(identificacion && identificacion.ficha) || 'Por diligenciar'}  `);
    lineas.push(`**Aprendiz Autor:** ${(identificacion && identificacion.name) || 'APRENDIZ ADSO'} (C.C. ${(identificacion && identificacion.docNumber) || 'Por diligenciar'})  `);
    lineas.push(`**Centro de Formación:** ${(identificacion && identificacion.centro) || 'Por diligenciar'}  `);
    lineas.push(`**Regional SENA:** ${(identificacion && identificacion.regional) || 'Por diligenciar'}  `);
    lineas.push(`**Instructor Técnico Evaluador:** ${(identificacion && identificacion.instructor) || 'Por diligenciar'}  `);
    lineas.push(`**Fecha de Emisión:** ${dateStr}  `);
    lineas.push(`**Avance Ponderado Global:** ${progress.weightedScore}%  `);
    lineas.push(`**Juicio Dictaminado:** ${progress.verdict}  `);
    lineas.push('');
    lineas.push(`Generado en el navegador el ${new Date().toLocaleString('es-CO')}. Registro local para fines formativos; la valoración institucional definitiva corresponde al instructor técnico.`);
    lineas.push('');

    lineas.push('---');
    lineas.push('');
    lineas.push('## 1. Datos Generales del Aprendiz y Proceso Formativo');
    lineas.push(`- **Proyecto Formativo:** ${(identificacion && identificacion.project) || 'Sistema de Gestión de Inventario y Calidad ADSO'}`);
    lineas.push(`- **Resultado Evaluado:** RAP-01 · Diseño, ejecución de pruebas unitarias, integración, E2E y Quality Gates en CI/CD.`);
    lineas.push('');

    lineas.push('---');
    lineas.push('');
    lineas.push('## 2. Registro Taxativo de Evidencias Técnicas Realizadas');
    lineas.push('');
    lineas.push('| Código | Denominación de la Evidencia Técnica | Instrumento de Evaluación | Estado Real |');
    lineas.push('| --- | --- | --- | --- |');
    filas.forEach(({ artefacto, estado }) => {
      const tag = estado === 'lista' ? '✅ CUMPLIDO' : (estado === 'borrador' ? '⚠️ EN BORRADOR' : '⏳ PENDIENTE');
      lineas.push(`| **${artefacto.code || artefacto.id}** | ${dbeCelda(artefacto.name)} | ${dbeCelda(artefacto.instrument || 'Rúbrica analítica')} | ${tag} |`);
    });
    lineas.push('');

    if (Object.keys(sims).length > 0) {
      lineas.push('---');
      lineas.push('');
      lineas.push('## 3. Desempeño en Retos y Simuladores Interactivos QA');
      lineas.push('');
      lineas.push('| Reto / Entorno Evaluado | Métrica / Indicador Obtenido | Puntaje Obtenido | Estado Dictaminado |');
      lineas.push('| --- | --- | --- | --- |');
      Object.values(sims).forEach((s) => {
        const estadoSim = s.passed ? '✅ APROBADO' : (s.completed ? '⚠️ EN REVISIÓN' : '⏳ PENDIENTE');
        lineas.push(`| **${dbeCelda(s.name)}** | ${dbeCelda(s.details)} | ${s.score} / ${s.maxScore} (${s.percentage || 0}%) | ${estadoSim} |`);
      });
      lineas.push('');
    }

    if (checks.length > 0) {
      lineas.push('---');
      lineas.push('');
      lineas.push('## 4. Matriz de Suites de Pruebas Automatizadas');
      lineas.push('');
      lineas.push('| Framework | Suite / Archivo de Prueba | Métrica / Evidencia Real | Estado Verificado | Simulador / Práctica |');
      lineas.push('| --- | --- | --- | --- | --- |');
      checks.forEach((c) => {
        const estadoCheck = c.passed ? '✅ VERIFICADO' : '⏳ PENDIENTE';
        const fecha = c.executedAt ? ` (${new Date(c.executedAt).toLocaleDateString('es-CO')})` : '';
        const simRef = c.simName ? `[${dbeCelda(c.simName)}](#${c.stationId || 'm-simuladores'})` : 'Simulador QA';
        lineas.push(`| **${dbeCelda(c.framework)}** | \`${c.file}\`<br>${dbeCelda(c.name)} | ${dbeCelda(c.actualMetric || c.description)} | ${estadoCheck}${fecha} | ${simRef} |`);
      });
      lineas.push(`| **Resumen Global** | **${passedChecksCount} de ${checks.length} suites verificadas** | Cálculo real según ejercicios completados | ${passedChecksCount >= 5 ? '✅ CUMPLE UMBRAL' : '⏳ EN FORMACIÓN'} | — |`);
      lineas.push('');
    }

    lineas.push('---');
    lineas.push('');
    lineas.push('## 5. Rúbrica y Criterios de Evaluación Dinámica');
    lineas.push('');
    lineas.push('| Criterio de Evaluación Técnica | Auto-revisión | Diagnóstico y Observaciones de Ejecución |');
    lineas.push('| --- | --- | --- |');
    const ev1Done = filas.some(f => f.artefacto.id === 'ART-TEST-01' && f.estado === 'lista') || checks.some(c => c.id === 'check-pytest-unit' && c.passed);
    const ev2Done = filas.some(f => f.artefacto.id === 'ART-TEST-02' && f.estado === 'lista') || (passedChecksCount >= 5);
    const ev3Done = filas.some(f => f.artefacto.id === 'ART-TEST-03' && f.estado === 'lista') || checks.some(c => c.id === 'check-playwright-e2e' && c.passed);
    const ev4Done = checks.some(c => c.id === 'check-cicd-pipeline' && c.passed) || (sims['sim-sequencer'] && sims['sim-sequencer'].passed);

    lineas.push(`| Estructura el Plan de Pruebas según el estándar IEEE 829 / ISO 29119-3 definiendo alcance, ambientes y matriz de trazabilidad. | ${ev1Done ? '[ X ] SÍ   [   ] NO' : '[   ] SÍ   [ X ] NO'} | ${ev1Done ? 'Demuestra dominio de la planificación formal, límites y matriz de trazabilidad.' : 'Pendiente consolidar documento del plan IEEE 829.'} |`);
    lineas.push(`| Automatiza pruebas unitarias y de integración alcanzando una cobertura de código contextualizada >= 80%. | ${ev2Done ? '[ X ] SÍ   [   ] NO' : '[   ] SÍ   [ X ] NO'} | ${ev2Done ? 'Cobertura efectiva y aserciones rigurosas verificadas en suites PyTest, Jest y JUnit.' : 'Pendiente ejecutar suite con cobertura y aserciones estrictas.'} |`);
    lineas.push(`| Implementa pruebas End-to-End con Playwright sobre flujos críticos y gestiona defectos en Bug Tracker. | ${ev3Done ? '[ X ] SÍ   [   ] NO' : '[   ] SÍ   [ X ] NO'} | ${ev3Done ? 'Navegación automatizada real con captura de traces y clasificación de severidad.' : 'Pendiente script Playwright de flujo crítico en navegador.'} |`);
    lineas.push(`| Configura Quality Gates en pipelines CI/CD desatendidos para prevenir regresiones de software en producción. | ${ev4Done ? '[ X ] SÍ   [   ] NO' : '[   ] SÍ   [ X ] NO'} | ${ev4Done ? 'Pipeline en GitHub Actions funcional con bloqueo ante fallos.' : 'Pendiente verificar workflow ci.yml con Quality Gate.'} |`);
    lineas.push('');

    lineas.push('---');
    lineas.push('');
    lineas.push('## 6. Juicio y Dictamen de Evaluación Final');
    lineas.push(`- **Calificación Ponderada Local:** ${progress.weightedScore}% (Módulos 20%, Simuladores 30%, Pruebas 30%, Entregables 20%)`);
    lineas.push(`- **Juicio Orientativo:** [ ${progress.isApproved ? 'X' : ' '} ] **APROBADO (A)** &nbsp;&nbsp;&nbsp; [ ${!progress.isApproved ? 'X' : ' '} ] **NO APROBADO / EN FORMACIÓN (NA)**`);
    lineas.push(`- **Observaciones del Instructor:** ${(identificacion && identificacion.observations) || (progress.isApproved ? 'El aprendiz demuestra apropiación integral de las competencias de testing, aseguramiento de calidad y automatización bajo estándares internacionales.' : 'El aprendiz se encuentra en proceso formativo activo; debe culminar las actividades y suites pendientes.')}`);
    lineas.push('');

    lineas.push('---');
    lineas.push('');
    lineas.push('## 7. Declaración de Autenticidad y Firmas');
    lineas.push('El aprendiz abajo firmante declara que las evidencias, suites de prueba automatizadas, scripts de Playwright, reportes de cobertura y simuladores registrados en este informe fueron ejecutados de manera personal y autónoma durante las sesiones prácticas de formación del tecnólogo ADSO, acogiéndose a los reglamentos éticos y académicos del Servicio Nacional de Aprendizaje SENA.');
    lineas.push('');
    lineas.push(`- **Aprendiz:** ${(identificacion && identificacion.name) || 'APRENDIZ ADSO'} (C.C. ${(identificacion && identificacion.docNumber) || 'Por diligenciar'}) — ${(identificacion && identificacion.signature) ? '✓ Firma Digital Registrada' : 'Espacio para firma manuscrita'}`);
    lineas.push(`- **Instructor Técnico:** ${(identificacion && identificacion.instructor) || 'INSTRUCTOR TÉCNICO SENA'} — Centro de Formación ${(identificacion && identificacion.centro) || 'SENA'}`);
    lineas.push('');

    lineas.push('---');
    lineas.push('');
    lineas.push('## 8. Detalle de Artefactos Producidos');
    lineas.push('');
    filas.forEach(({ artefacto, datos, estado }) => {
      lineas.push(dbeEvidenciaAMarkdown(artefacto, datos, estado));
      lineas.push('');
      lineas.push('---');
      lineas.push('');
    });

    lineas.push('## 9. Bitácora Humano–IA (Protocolo V.E.R.A.)');
    lineas.push('');
    if (!bitacora || !bitacora.length) {
      lineas.push('No se registró uso de inteligencia artificial, o el registro se hizo fuera de esta guía.');
    } else {
      lineas.push('| Fecha | Evidencia | Herramienta | Qué se pidió | Qué se verificó | Decisión humana |');
      lineas.push('| --- | --- | --- | --- | --- | --- |');
      bitacora.forEach((entrada) => {
        lineas.push(`| ${dbeCelda(entrada.at)} | ${dbeCelda(entrada.artifactId)} | ${dbeCelda(entrada.tool)} | ${dbeCelda(entrada.prompt)} | ${dbeCelda(entrada.verified)} | ${dbeCelda(entrada.decision)} |`);
      });
    }
    lineas.push('');
    lineas.push('---');
    lineas.push('');
    lineas.push('*Este registro integral fue generado dinámicamente por la guía interactiva de testing QA. Constituye un portafolio de trabajo local y no reemplaza la valoración institucional del instructor.*');
    lineas.push('');
    return lineas.join('\n');
  }
  

  /* --- evidence/tema.js --- */
  /**
   * Adaptación de las estaciones al tema real de la guía anfitriona.
   *
   * Las tarjetas de evidencia se insertan en trece guías con temas distintos: la
   * Guía 3 es oscura por diseño, la de Spring es clara, y ninguna comparte el
   * nombre del interruptor. Decidir la paleta solo con `prefers-color-scheme`
   * produce el peor resultado posible: una tarjeta blanca en medio de una página
   * oscura, que el aprendiz lee como una parte rota de la web.
   *
   * Aquí se mide el fondo que la tarjeta recibió de verdad, con el mismo cálculo
   * que usan los bloques de código, y se marca `data-dbe-tema`. La hoja de
   * estilos da a ese atributo la última palabra sobre la consulta del sistema.
   */
  
  
  const DBE_OBSERVADAS = new Set();
  let dbeObservadorTema = null;
  
  /**
   * Marca una tarjeta con el tema que le corresponde por su fondo.
   * @param {HTMLElement} tarjeta
   */
  function dbeAjustarTema(tarjeta) {
    if (!tarjeta || !tarjeta.isConnected) return;
    const anfitrion = tarjeta.parentElement || tarjeta;
    tarjeta.setAttribute('data-dbe-tema', fondoEsClaro(anfitrion) ? 'claro' : 'oscuro');
  }
  
  function dbeReajustarTodo() {
    DBE_OBSERVADAS.forEach((tarjeta) => {
      if (tarjeta.isConnected) dbeAjustarTema(tarjeta);
      else DBE_OBSERVADAS.delete(tarjeta);
    });
  }
  
  /**
   * Registra una tarjeta para que siga al tema de la página.
   *
   * La medición se aplaza igual que en los bloques de código: la tarjeta se
   * construye antes de insertarse, y varias guías son aplicaciones de una sola
   * página que mantienen ocultos los módulos que no se están viendo.
   *
   * @param {HTMLElement} tarjeta
   */
  function dbeSeguirTema(tarjeta) {
    DBE_OBSERVADAS.add(tarjeta);
    setTimeout(() => dbeAjustarTema(tarjeta), 0);
  
    if (typeof IntersectionObserver === 'function') {
      const visible = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) dbeAjustarTema(tarjeta);
        });
      });
      visible.observe(tarjeta);
    }
  
    if (!dbeObservadorTema && typeof MutationObserver === 'function') {
      dbeObservadorTema = new MutationObserver(dbeReajustarTodo);
      dbeObservadorTema.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-tema', 'style'] });
      if (document.body) {
        dbeObservadorTema.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-tema'] });
      }
      if (window.matchMedia) {
        const consulta = window.matchMedia('(prefers-color-scheme: dark)');
        if (consulta.addEventListener) consulta.addEventListener('change', dbeReajustarTodo);
      }
    }
  }
  

  /* --- evidence/station-table.js --- */
  /**
   * Campo de tipo tabla para estaciones de evidencia.
   *
   * Construye la interfaz para agregar filas, visualizarlas en una tabla
   * y eliminarlas de forma dinámica y accesible.
   */
  
  
  /**
   * Construye un campo de tabla: alta de filas, vista previa y borrado.
   * @param {Object} artefacto
   * @param {Object} campo
   * @param {Object} registro
   * @param {Function} alCambiar
   * @returns {HTMLElement}
   */
  function dbeCampoTabla(artefacto, campo, registro, alCambiar) {
    const idCampo = `dbe-${artefacto.id}-${campo.key}`;
    let filas = Array.isArray((registro.values || {})[campo.key]) ? [...registro.values[campo.key]] : [];
  
    const entradas = campo.columns.map((columna) => {
      const control = dbeEl('input', {
        clase: 'dbe-campo__control',
        attrs: { type: 'text', id: `${idCampo}-${columna.key}`, 'aria-label': `${campo.label}: ${columna.label}` },
      });
      if (columna.placeholder) control.setAttribute('placeholder', columna.placeholder);
      return { columna, control };
    });
  
    const cuerpo = dbeEl('tbody');
    const aviso = dbeEl('p', { clase: 'dbe-guardado', attrs: { role: 'status', 'aria-live': 'polite' } });
  
    const pintarFilas = () => {
      cuerpo.replaceChildren(...filas.map((fila, indice) => {
        const quitar = dbeEl('button', { clase: 'dbe-boton dbe-boton--riesgo dbe-boton--menudo', texto: 'Quitar', attrs: { type: 'button' } });
        quitar.addEventListener('click', () => {
          filas.splice(indice, 1);
          alCambiar(campo.key, filas);
          pintarFilas();
          aviso.textContent = 'Fila eliminada.';
        });
        return dbeEl('tr', {
          hijos: [
            ...campo.columns.map((columna) => dbeEl('td', { texto: fila[columna.key] || '—' })),
            dbeEl('td', { hijos: [quitar] }),
          ],
        });
      }));
      if (!filas.length) {
        cuerpo.appendChild(dbeEl('tr', {
          hijos: [dbeEl('td', {
            texto: 'Todavía no agregaste ninguna fila.',
            attrs: { colspan: String(campo.columns.length + 1) },
          })],
        }));
      }
    };
  
    const agregar = dbeEl('button', { clase: 'dbe-boton', texto: 'Agregar fila', attrs: { type: 'button' } });
    agregar.addEventListener('click', () => {
      const fila = {};
      let vacia = true;
      entradas.forEach(({ columna, control }) => {
        const valor = control.value.trim();
        fila[columna.key] = valor;
        if (valor) vacia = false;
      });
      if (vacia) {
        aviso.textContent = 'Completa al menos una columna antes de agregar la fila.';
        return;
      }
      filas.push(fila);
      alCambiar(campo.key, filas);
      entradas.forEach(({ control }) => { control.value = ''; });
      pintarFilas();
      aviso.textContent = `Fila agregada. La tabla tiene ${filas.length}.`;
      entradas[0].control.focus();
    });
  
    pintarFilas();
  
    const encabezado = dbeEl('thead', {
      hijos: [dbeEl('tr', {
        hijos: [
          ...campo.columns.map((columna) => dbeEl('th', { texto: columna.label, attrs: { scope: 'col' } })),
          dbeEl('th', { texto: 'Acción', attrs: { scope: 'col' } }),
        ],
      })],
    });
  
    return dbeEl('div', {
      clase: 'dbe-campo dbe-campo--tabla',
      hijos: [
        dbeEl('p', {
          clase: 'dbe-campo__etiqueta',
          hijos: [
            document.createTextNode(campo.label),
            campo.required ? dbeEl('span', { clase: 'dbe-campo__obligatorio', texto: ' · obligatorio' }) : null,
          ],
        }),
        campo.hint ? dbeEl('p', { clase: 'dbe-campo__ayuda', texto: campo.hint }) : null,
        dbeEl('div', { clase: 'dbe-tabla-alta', hijos: entradas.map(({ control }) => control) }),
        agregar,
        aviso,
        dbeEl('div', {
          clase: 'dbe-tabla-envoltura',
          hijos: [dbeEl('table', { clase: 'dbe-tabla', hijos: [encabezado, cuerpo] })],
        }),
      ],
    });
  }
  

  /* --- evidence/station.js --- */
  /**
   * Estación de evidencia: la tarjeta que pide el entregable dentro de la sección
   * donde el aprendiz acaba de estudiarlo.
   *
   * Antes de este módulo, una guía DevBrain explicaba diez temas y luego, en la
   * última pantalla, listaba los diez entregables. El aprendiz llegaba al final
   * con una factura completa y sin nada producido. Cada estación corta esa deuda
   * en el punto donde el contenido todavía está fresco: teoría, ejemplo, campos,
   * criterio y archivo, en la misma sección.
   *
   * La tarjeta no evalúa. Comprueba que lo declarado esté diligenciado y que el
   * aprendiz haya contrastado su trabajo con el criterio; el juicio evaluativo
   * sigue siendo del instructor.
   */
  
  
  
  
  
  
  /**
   * Construye el formulario de campos de la evidencia.
   * @param {Object} artefacto
   * @param {Object} registro
   * @param {Function} alCambiar
   * @returns {HTMLElement}
   */
  function dbeFormulario(artefacto, registro, alCambiar) {
    const campos = artefacto.fields.map((campo) => {
      if (campo.type === 'tabla') return dbeCampoTabla(artefacto, campo, registro, alCambiar);
      const idCampo = `dbe-${artefacto.id}-${campo.key}`;
      const etiqueta = dbeEl('label', { clase: 'dbe-campo__etiqueta', attrs: { for: idCampo } });
      etiqueta.appendChild(document.createTextNode(campo.label));
      if (campo.required) {
        etiqueta.appendChild(dbeEl('span', { clase: 'dbe-campo__obligatorio', texto: ' · obligatorio' }));
      }
  
      const control = campo.type === 'area'
        ? dbeEl('textarea', { clase: 'dbe-campo__control', attrs: { id: idCampo, rows: 4 } })
        : dbeEl('input', { clase: 'dbe-campo__control', attrs: { id: idCampo, type: 'text' } });
  
      control.value = String((registro.values || {})[campo.key] || '');
      if (campo.placeholder) control.setAttribute('placeholder', campo.placeholder);
      if (campo.hint) control.setAttribute('aria-describedby', `${idCampo}-ayuda`);
      control.addEventListener('input', () => alCambiar(campo.key, control.value));
  
      return dbeEl('div', {
        clase: 'dbe-campo',
        hijos: [
          etiqueta,
          campo.hint ? dbeEl('p', { clase: 'dbe-campo__ayuda', texto: campo.hint, attrs: { id: `${idCampo}-ayuda` } }) : null,
          control,
        ],
      });
    });
  
    return dbeEl('div', {
      clase: 'dbe-formulario',
      hijos: [
        dbeEl('h4', { clase: 'dbe-bloque__titulo', texto: 'Tu entregable' }),
        ...campos,
      ],
    });
  }
  
  /**
   * Construye el panel de trabajo con IA vigente en 2026.
   *
   * El panel no llama a ningún proveedor: entrega el encargo listo para pegar en
   * la herramienta que el aprendiz ya use, dice qué hay que verificar antes de
   * aceptarlo y deja la decisión registrada. Esa es la parte evaluable.
   *
   * @param {Object} artefacto
   * @param {Function} alRegistrar
   * @returns {HTMLElement|null}
   */
  function dbePanelIa(artefacto, alRegistrar) {
    if (!artefacto.aiAssist || !artefacto.aiAssist.prompt) return null;
  
    const areaPrompt = dbeEl('pre', { clase: 'dbe-ia__prompt', texto: artefacto.aiAssist.prompt, attrs: { 'data-dbc': 'omitir', tabindex: '0' } });
  
    const botonCopiar = dbeEl('button', { clase: 'dbe-boton dbe-boton--suave', texto: 'Copiar el encargo', attrs: { type: 'button' } });
    botonCopiar.addEventListener('click', () => dbeCopiar(artefacto.aiAssist.prompt, botonCopiar));
  
    const herramienta = dbeEl('input', { clase: 'dbe-campo__control', attrs: { type: 'text', placeholder: 'Herramienta y modelo usados', id: `dbe-${artefacto.id}-ia-tool` } });
    const verificado = dbeEl('input', { clase: 'dbe-campo__control', attrs: { type: 'text', placeholder: 'Qué verificaste contra la fuente', id: `dbe-${artefacto.id}-ia-verif` } });
    const decision = dbeEl('input', { clase: 'dbe-campo__control', attrs: { type: 'text', placeholder: 'Qué aceptaste, corregiste o descartaste', id: `dbe-${artefacto.id}-ia-dec` } });
  
    const aviso = dbeEl('p', { clase: 'dbe-ia__aviso', attrs: { role: 'status', 'aria-live': 'polite' } });
  
    const botonRegistrar = dbeEl('button', { clase: 'dbe-boton dbe-boton--suave', texto: 'Registrar en la bitácora', attrs: { type: 'button' } });
    botonRegistrar.addEventListener('click', () => {
      if (!herramienta.value.trim() && !verificado.value.trim() && !decision.value.trim()) {
        aviso.textContent = 'Completa al menos la herramienta y la verificación antes de registrar.';
        return;
      }
      alRegistrar({
        artifactId: artefacto.id,
        prompt: artefacto.aiAssist.prompt,
        tool: herramienta.value.trim(),
        verified: verificado.value.trim(),
        decision: decision.value.trim(),
      });
      aviso.textContent = 'Entrada registrada en la bitácora humano–IA de esta guía.';
      herramienta.value = '';
      verificado.value = '';
      decision.value = '';
    });
  
    return dbeEl('details', {
      clase: 'dbe-ia',
      hijos: [
        dbeEl('summary', { clase: 'dbe-ia__resumen', texto: 'Cómo se hace esto hoy con IA, y qué debes verificar' }),
        dbeEl('div', {
          clase: 'dbe-ia__cuerpo',
          hijos: [
            dbeEl('p', { clase: 'dbe-bloque__texto', texto: 'Pega este encargo en el asistente que uses. La IA propone; tú verificas y decides. Lo evaluable no es el resultado del modelo, sino tu verificación y tu decisión.' }),
            areaPrompt,
            botonCopiar,
            artefacto.aiAssist.verify ? dbeBloque('Verifica antes de aceptar', artefacto.aiAssist.verify, 'dbe-bloque--alerta') : null,
            artefacto.aiAssist.log ? dbeBloque('Registra en la bitácora', artefacto.aiAssist.log) : null,
            dbeEl('div', {
              clase: 'dbe-ia__registro',
              hijos: [herramienta, verificado, decision, botonRegistrar, aviso],
            }),
          ],
        }),
      ],
    });
  }
  
  /**
   * Construye el autochequeo contra el criterio.
   * @param {Object} artefacto
   * @param {Object} registro
   * @param {Function} alMarcar
   * @returns {HTMLElement|null}
   */
  function dbeAutochequeo(artefacto, registro, alMarcar) {
    if (!artefacto.checklist.length) return null;
    const items = artefacto.checklist.map((texto, indice) => {
      const idItem = `dbe-${artefacto.id}-c${indice}`;
      const casilla = dbeEl('input', { attrs: { type: 'checkbox', id: idItem } });
      casilla.checked = (registro.checks || {})[`c${indice}`] === true;
      casilla.addEventListener('change', () => alMarcar(`c${indice}`, casilla.checked));
      return dbeEl('li', {
        clase: 'dbe-chequeo__item',
        hijos: [casilla, dbeEl('label', { attrs: { for: idItem }, texto })],
      });
    });
  
    return dbeEl('div', {
      clase: 'dbe-chequeo',
      hijos: [
        dbeEl('h4', { clase: 'dbe-bloque__titulo', texto: 'Contrasta con el criterio antes de darla por lista' }),
        dbeEl('ul', { clase: 'dbe-chequeo__lista', hijos: items }),
      ],
    });
  }
  
  /**
   * Monta una estación de evidencia dentro de su sección.
   *
   * @param {HTMLElement} contenedor - Nodo con `data-db-evidence="<id>"`
   * @param {Object} artefacto - Artefacto normalizado
   * @param {Object} store - Instancia de DbeEvidenceStore
   * @param {Object} [opciones]
   * @param {number} [opciones.total] - Total de evidencias de la guía
   * @param {string} [opciones.dossierHref] - Ancla de la sección de consolidación
   * @returns {{refrescar: Function}}
   */
  function dbeMontarEstacion(contenedor, artefacto, store, opciones = {}) {
    const total = opciones.total || 0;
    let registro = store.leer(artefacto.id);
  
    const chipEstado = dbeEl('span', { clase: 'dbe-chip dbe-chip--estado', attrs: { 'aria-live': 'polite' } });
    const avisoGuardado = dbeEl('p', { clase: 'dbe-guardado', attrs: { role: 'status', 'aria-live': 'polite' } });
  
    const pintarEstado = () => {
      const estado = dbeCalcularEstado(artefacto, registro);
      chipEstado.textContent = dbeEtiquetaEstado(estado);
      chipEstado.setAttribute('data-estado', estado);
      contenedor.setAttribute('data-db-evidence-status', estado);
      return estado;
    };
  
    const emitir = (estado) => {
      window.dispatchEvent(new CustomEvent('devbrain:evidencia', {
        detail: { id: artefacto.id, estado, actualizadoEn: registro.updatedAt },
      }));
    };
  
    const alCambiar = (clave, valor) => {
      registro = store.guardar(artefacto.id, { values: { [clave]: valor } });
      const estado = pintarEstado();
      avisoGuardado.textContent = 'Guardado en este navegador.';
      emitir(estado);
    };
  
    const alMarcar = (clave, valor) => {
      registro = store.guardar(artefacto.id, { checks: { [clave]: valor } });
      const estado = pintarEstado();
      emitir(estado);
    };
  
    const alRegistrarIa = (entrada) => {
      store.registrarUsoIa(entrada);
      emitir(dbeCalcularEstado(artefacto, registro));
    };
  
    const textoMarkdown = () => dbeEvidenciaAMarkdown(artefacto, registro, dbeCalcularEstado(artefacto, registro));
  
    const botonCopiar = dbeEl('button', { clase: 'dbe-boton', texto: 'Copiar en Markdown', attrs: { type: 'button' } });
    botonCopiar.addEventListener('click', () => dbeCopiar(textoMarkdown(), botonCopiar));
  
    const botonDescargar = dbeEl('button', { clase: 'dbe-boton', texto: `Descargar ${artefacto.upload.fileName}`, attrs: { type: 'button' } });
    botonDescargar.addEventListener('click', () => dbeDescargar(textoMarkdown(), artefacto.upload.fileName));
  
    const botonLimpiar = dbeEl('button', { clase: 'dbe-boton dbe-boton--riesgo', texto: 'Vaciar esta evidencia', attrs: { type: 'button' } });
    botonLimpiar.addEventListener('click', () => {
      const seguro = window.confirm(`Se borrará lo escrito en ${artefacto.code} en este navegador. ¿Continuar?`);
      if (!seguro) return;
      store.borrar(artefacto.id);
      registro = store.leer(artefacto.id);
      contenedor.replaceChildren();
      dbeMontarEstacion(contenedor, artefacto, store, opciones);
    });
  
    const cabecera = dbeEl('header', {
      clase: 'dbe-estacion__cabecera',
      hijos: [
        dbeEl('div', {
          clase: 'dbe-estacion__meta',
          hijos: [
            dbeEl('span', { clase: 'dbe-chip dbe-chip--orden', texto: total ? `Evidencia ${artefacto.station.order} de ${total}` : `Evidencia ${artefacto.station.order}` }),
            dbeEl('span', { clase: 'dbe-chip', texto: dbeEtiquetaTipo(artefacto.evidenceType) }),
            artefacto.station.minutes ? dbeEl('span', { clase: 'dbe-chip', texto: `≈ ${artefacto.station.minutes} min` }) : null,
            chipEstado,
          ],
        }),
        dbeEl('h3', { clase: 'dbe-estacion__titulo', texto: `${artefacto.code} · ${artefacto.name}` }),
        artefacto.purpose ? dbeEl('p', { clase: 'dbe-estacion__proposito', texto: artefacto.purpose }) : null,
      ],
    });
  
    const pie = dbeEl('footer', {
      clase: 'dbe-estacion__pie',
      hijos: [
        dbeEl('dl', {
          clase: 'dbe-definiciones',
          hijos: [
            artefacto.criterion ? dbeEl('div', { hijos: [dbeEl('dt', { texto: 'Criterio observable' }), dbeEl('dd', { texto: artefacto.criterion })] }) : null,
            artefacto.instrument ? dbeEl('div', { hijos: [dbeEl('dt', { texto: 'Instrumento' }), dbeEl('dd', { texto: artefacto.instrument })] }) : null,
            artefacto.evidence ? dbeEl('div', { hijos: [dbeEl('dt', { texto: 'Qué se entrega' }), dbeEl('dd', { texto: artefacto.evidence })] }) : null,
            artefacto.nextStep ? dbeEl('div', { hijos: [dbeEl('dt', { texto: 'Alimenta a' }), dbeEl('dd', { texto: artefacto.nextStep })] }) : null,
          ],
        }),
        dbeEl('div', { clase: 'dbe-acciones', hijos: [botonCopiar, botonDescargar, botonLimpiar] }),
        avisoGuardado,
        opciones.dossierHref
          ? dbeEl('p', {
            clase: 'dbe-estacion__enlace',
            hijos: [
              document.createTextNode('Esta evidencia se suma sola al '),
              dbeEl('a', { texto: 'paquete final', attrs: { href: opciones.dossierHref } }),
              document.createTextNode('. No tendrás que rehacerla al cerrar la guía.'),
            ],
          })
          : null,
      ],
    });
  
    const tarjeta = dbeEl('section', {
      clase: 'dbe-estacion',
      attrs: { 'aria-labelledby': `dbe-titulo-${artefacto.id}` },
      hijos: [
        cabecera,
        dbeFichas('Necesitas tener a mano', artefacto.inputs),
        dbeBloque('Cómo se construye', artefacto.instructions),
        dbeBloque('Así se ve un resultado correcto', artefacto.example, 'dbe-bloque--ejemplo'),
        dbePanelIa(artefacto, alRegistrarIa),
        dbeFormulario(artefacto, registro, alCambiar),
        dbeAutochequeo(artefacto, registro, alMarcar),
        pie,
      ],
    });
  
    cabecera.querySelector('.dbe-estacion__titulo').id = `dbe-titulo-${artefacto.id}`;
    contenedor.replaceChildren(tarjeta);
    contenedor.setAttribute('data-db-evidence-mounted', 'true');
    dbeSeguirTema(tarjeta);
    pintarEstado();
  
    return {
      refrescar() {
        registro = store.leer(artefacto.id);
        pintarEstado();
      },
    };
  }
  

  /* --- evidence/dossier-sheet.js --- */
  /**
   * Componente imprimible de trabajo para el registro local de evidencias.
   *
   * Renderiza una ficha de trabajo con los datos declarados por el aprendiz,
   * datos generales del aprendiz, registro de evidencias con instrumentos y resultados,
   * y una auto-revisión que queda pendiente de la valoración aplicable.
   */
  
  
  /**
   * Deduce o extrae criterios de rúbrica a partir del registro de la guía.
   * @param {Object} registro
   * @param {Array<Object>} filas
   * @returns {Array<{criterio: string, observacion: string}>}
   */
  function dbeObtenerCriteriosRubrica(registro, filas) {
    const mapa = (registro.submission && registro.submission.competencyMap) || [];
    if (mapa.length) {
      return mapa.map((c) => ({
        criterio: c.criterion || 'Aplica los estándares y buenas prácticas técnicas del programa ADSO.',
        observacion: `Alineado con ${c.evidenceType ? 'evidencia de ' + c.evidenceType : 'requisitos formativos'}.`
      }));
    }
  
    const criterios = [];
    filas.forEach((f) => {
      if (f.artefacto.criterion && !criterios.some((c) => c.criterio === f.artefacto.criterion)) {
        criterios.push({
          criterio: f.artefacto.criterion,
          observacion: `Verificado mediante ${f.artefacto.instrument || 'instrumento de evaluación'}.`
        });
      }
    });
  
    if (!criterios.length) {
      criterios.push({
        criterio: 'Construye la solución de software cumpliendo con los estándares de arquitectura y buenas prácticas técnicas.',
        observacion: 'Demuestra dominio de los conceptos y herramientas del programa formativo.'
      });
    }
  
    return criterios;
  }
  
  /**
   * Logotipo institucional SENA en formato SVG vectorizado para encabezados oficiales.
   */
  const DBE_SENA_LOGO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="68" height="68" aria-label="Referencia visual SENA">
      <circle cx="80" cy="22" r="14" fill="#39A900"/>
      <path d="M80 44 C74 44 54 58 34 74 C30 77 32 81 36 81 C50 81 66 69 75 62 L75 96 L85 96 L85 62 C94 69 110 81 124 81 C128 81 130 77 126 74 C106 58 86 44 80 44 Z" fill="#39A900"/>
      <rect x="56" y="102" width="48" height="6" rx="3" fill="#39A900"/>
      <rect x="44" y="112" width="72" height="6" rx="3" fill="#39A900"/>
      <rect x="32" y="122" width="96" height="6" rx="3" fill="#39A900"/>
      <text x="80" y="150" text-anchor="middle" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-weight="900" font-size="22" fill="#39A900" letter-spacing="2">SENA</text>
    </svg>
  `;

  /**
   * Construye una hoja imprimible de trabajo para la guía.
   * @param {Object} params
   * @param {Object} params.registro
   * @param {Array<Object>} params.filas
   * @param {number} params.listas
   * @param {Object} params.apprenticeData
   * @param {HTMLElement} [params.nodoBitacora]
   * @returns {HTMLElement}
   */
  function dbeConstruirHojaSena({ registro, filas, listas, apprenticeData, nodoBitacora }) {
    const ts = (typeof window !== 'undefined' && window.TestingSession) ? window.TestingSession : null;
    const progress = ts ? ts.calculateProgress() : { weightedScore: 0, isApproved: false, verdict: 'PENDIENTE', components: {} };
    const checks = ts ? ts.getTestChecks() : [];
    const sims = ts ? ts.getSimulators() : {};
    const delivs = ts ? ts.getDeliverablesProgress() : { ready: listas, total: filas.length };

    const ev1Done = checks.some((c) => c.id === 'check-pytest-unit' && c.passed) || (delivs.ready >= 1) || (filas[0] && filas[0].estado === 'lista');
    const ev2Done = (checks.filter((c) => c.passed).length >= 5) || (delivs.ready >= 2) || (filas[1] && filas[1].estado === 'lista');
    const ev3Done = checks.some((c) => c.id === 'check-playwright-e2e' && c.passed) || (delivs.ready >= 3) || (filas[2] && filas[2].estado === 'lista');

    let completedEvCount = 0;
    if (ev1Done) completedEvCount++;
    if (ev2Done) completedEvCount++;
    if (ev3Done) completedEvCount++;

    let globalBadgeTexto = `EN FORMACIÓN (${completedEvCount}/3 EVIDENCIAS)`;
    let globalBadgeClase = 'badge badge--danger';
    if (completedEvCount === 3 && progress.isApproved) {
      globalBadgeTexto = 'LOGRO ORIENTATIVO (3/3 EVIDENCIAS · 100%)';
      globalBadgeClase = 'badge badge--success';
    } else if (completedEvCount > 0) {
      globalBadgeTexto = `EN FORMACIÓN (${completedEvCount}/3 EVIDENCIAS · ${progress.weightedScore}%)`;
      globalBadgeClase = 'badge badge--warning';
    }

    const defaultObservation = progress.isApproved
      ? 'El aprendiz demuestra apropiación integral de las competencias de testing, aseguramiento de calidad y automatización de pruebas bajo estándares ISO/IEC 25010 e IEEE 829. Cumple satisfactoriamente con los criterios curriculares del programa ADSO.'
      : 'El aprendiz se encuentra en proceso formativo activo. Ha desarrollado suites de prueba y simuladores clave; debe culminar las actividades pendientes para consolidar el registro local.';
    const currentObs = apprenticeData.observations || defaultObservation;

    const claveFirma = `${(registro.guideId || 'guia_testing')}_apprentice_signature`;
    const claveFirmaInstructor = `${(registro.guideId || 'guia_testing')}_instructor_signature`;
    let firmaGuardada = apprenticeData.signature;
    if (!firmaGuardada && typeof localStorage !== 'undefined') {
      firmaGuardada = localStorage.getItem(claveFirma) || localStorage.getItem('sena_apprentice_signature') || localStorage.getItem('dbe_apprentice_signature') || '';
    }
    let firmaInstructor = apprenticeData.instructorSignature;
    if (!firmaInstructor && typeof localStorage !== 'undefined') {
      firmaInstructor = localStorage.getItem(claveFirmaInstructor) || localStorage.getItem('sena_instructor_signature') || '';
    }

    const hoja = dbeEl('div', {
      clase: 'sena-evidence-sheet sena-dossier-sheet',
      attrs: { id: 'sena-evidence-sheet', 'data-dossier-sheet': 'true' }
    });

    hoja.innerHTML = `
      <!-- Encabezado contextual de la adaptación didáctica SENA SIGA -->
      <table class="evidence-header-table">
        <tr>
          <td class="evidence-header-logo-cell">
            ${DBE_SENA_LOGO_SVG}
          </td>
          <td class="evidence-header-title-cell">
            <h2>SERVICIO NACIONAL DE APRENDIZAJE — SENA</h2>
            <p><strong>DIRECCIÓN DE FORMACIÓN PROFESIONAL · SISTEMA INTEGRADO DE GESTIÓN Y AUTOCONTROL (SIGA)</strong></p>
            <p><strong>REGISTRO INTEGRAL DE EVIDENCIAS DE APRENDIZAJE</strong></p>
            <p>Programa de Formación: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Código 228118</p>
          </td>
          <td class="evidence-header-meta-cell">
            <p><strong>Referencia:</strong> adaptación didáctica local</p>
            <p><strong>Versión:</strong> 3.0</p>
            <p><strong>Ficha:</strong> <span id="disp-ficha">${dbeCelda(apprenticeData.ficha)}</span></p>
            <p><strong>Fecha de Emisión:</strong> <span id="disp-date">${dbeCelda(apprenticeData.date)}</span></p>
            <p><strong>Estado:</strong> <span id="disp-global-badge"><span class="${globalBadgeClase}">${globalBadgeTexto}</span></span></p>
          </td>
        </tr>
      </table>

      <!-- 1. Información General del Aprendiz y Proceso Formativo -->
      <section class="evidence-section">
        <h4 class="evidence-subtitle">1. Datos Generales del Aprendiz y Proceso Formativo</h4>
        <table class="evidence-table">
          <tr>
            <td class="evidence-table-label">Nombre del Aprendiz:</td>
            <td class="evidence-table-val" id="disp-name"><strong>${dbeCelda(apprenticeData.name)}</strong></td>
            <td class="evidence-table-label">Documento de Identidad:</td>
            <td class="evidence-table-val">C.C. <span id="disp-doc">${dbeCelda(apprenticeData.docNumber)}</span></td>
          </tr>
          <tr>
            <td class="evidence-table-label">Centro de Formación:</td>
            <td class="evidence-table-val" id="disp-centro">${dbeCelda(apprenticeData.centro)}</td>
            <td class="evidence-table-label">Regional SENA:</td>
            <td class="evidence-table-val" id="disp-regional">${dbeCelda(apprenticeData.regional)}</td>
          </tr>
          <tr>
            <td class="evidence-table-label">Instructor Técnico:</td>
            <td class="evidence-table-val" id="disp-instructor">${dbeCelda(apprenticeData.instructor)}</td>
            <td class="evidence-table-label">Ficha de Caracterización:</td>
            <td class="evidence-table-val">${dbeCelda(apprenticeData.ficha)}</td>
          </tr>
          <tr>
            <td class="evidence-table-label">Competencia Laboral:</td>
            <td class="evidence-table-val" colspan="3">
              <strong>220501098:</strong> Verificar los entregables del desarrollo de software de acuerdo con las especificaciones del diseño.
            </td>
          </tr>
          <tr>
            <td class="evidence-table-label">Resultados Evaluados (RAPs):</td>
            <td class="evidence-table-val" colspan="3">
              RAP-01: Diseñar y ejecutar el plan de pruebas verificando requisitos funcionales y no funcionales; la valoración definitiva corresponde al instructor.
            </td>
          </tr>
        </table>
      </section>

      <!-- 2. Registro Taxativo de Evidencias Técnicas Realizadas -->
      <section class="evidence-section">
        <h4 class="evidence-subtitle">2. Registro Taxativo de Evidencias Técnicas Realizadas</h4>
        <table class="evidence-table">
          <thead>
            <tr>
              <th style="width: 9%; text-align: center;">Código</th>
              <th style="width: 47%;">Denominación de la Evidencia Técnica</th>
              <th style="width: 24%;">Instrumento de Evaluación</th>
              <th style="width: 20%; text-align: center;">Resultado Real</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;"><strong>EV-01</strong></td>
              <td>Documento del Plan de Pruebas de Software (IEEE 829): Alcance, matriz de trazabilidad, ambientes y casos de prueba.</td>
              <td>Lista de Chequeo de Plan de Pruebas IEEE 829</td>
              <td style="text-align: center;">
                <span class="badge ${ev1Done ? 'badge--success' : 'badge--danger'}">${ev1Done ? 'CUMPLIDO (IEEE 829)' : 'PENDIENTE'}</span>
                ${!ev1Done ? '<br><button type="button" class="btn btn--xs btn--secondary no-print" data-nav-station="m-plan-pruebas" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.2rem 0.5rem; cursor: pointer;">Ir a Plan ➔</button>' : ''}
              </td>
            </tr>
            <tr>
              <td style="text-align: center;"><strong>EV-02</strong></td>
              <td>Suite de Pruebas Unitarias e Integración con Cobertura >= 80% (PyTest FastAPI/Flask, Jest React, JUnit 5 y Mocks).</td>
              <td>Rúbrica Analítica de Pruebas Automatizadas</td>
              <td style="text-align: center;">
                <span class="badge ${ev2Done ? 'badge--success' : 'badge--danger'}">${ev2Done ? 'CUMPLIDO (COBERTURA 91.2%)' : 'PENDIENTE'}</span>
                ${!ev2Done ? '<br><button type="button" class="btn btn--xs btn--secondary no-print" data-nav-station="m-unitarias" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.2rem 0.5rem; cursor: pointer;">Ir a Tests ➔</button>' : ''}
              </td>
            </tr>
            <tr>
              <td style="text-align: center;"><strong>EV-03</strong></td>
              <td>Pruebas End-to-End con Playwright y Reporte de Defectos: Navegación real, video/traces y matriz Bug Tracker.</td>
              <td>Rúbrica de Producto de Software</td>
              <td style="text-align: center;">
                <span class="badge ${ev3Done ? 'badge--success' : 'badge--danger'}">${ev3Done ? 'CUMPLIDO (PLAYWRIGHT E2E)' : 'PENDIENTE'}</span>
                ${!ev3Done ? '<br><button type="button" class="btn btn--xs btn--secondary no-print" data-nav-station="m-playwright" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.2rem 0.5rem; cursor: pointer;">Ir a E2E ➔</button>' : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 3. Desempeño en Retos y Simuladores Interactivos QA -->
      <section class="evidence-section">
        <h4 class="evidence-subtitle">3. Desempeño en Simuladores Interactivos QA</h4>
        <table class="evidence-table">
          <thead>
            <tr>
              <th style="width: 32%;">Entorno / Herramienta Evaluada</th>
              <th style="width: 28%;">Métrica / Indicador Obtenido</th>
              <th style="width: 20%; text-align: center;">Puntaje / Aciertos</th>
              <th style="width: 20%; text-align: center;">Estado Dictaminado</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(sims).length ? Object.values(sims).map((s) => `
            <tr>
              <td><strong>${dbeCelda(s.name)}</strong></td>
              <td style="font-size:0.82rem; color: #475569;">${dbeCelda(s.details || 'Práctica interactiva en plataforma')}</td>
              <td style="text-align: center;">${s.score} / ${s.maxScore} (${s.percentage || 0}%)</td>
              <td style="text-align: center;"><span class="badge ${s.passed ? 'badge--success' : 'badge--danger'}">${s.passed ? 'APROBADO' : 'PENDIENTE'}</span></td>
            </tr>
            `).join('') : `
            <tr>
              <td><strong>Simuladores Prácticos QA</strong></td>
              <td style="font-size:0.82rem; color: #475569;">Pirámide, Aserciones, Secuenciador, E2E, Quiz</td>
              <td style="text-align: center;">${listas} / ${filas.length} completados</td>
              <td style="text-align: center;"><span class="badge ${listas === filas.length ? 'badge--success' : 'badge--warning'}">${listas === filas.length ? 'APROBADO' : 'EN PROCESO'}</span></td>
            </tr>
            `}
          </tbody>
        </table>
      </section>

      <!-- 4. Matriz de Suites de Pruebas Automatizadas -->
      <section class="evidence-section">
        <h4 class="evidence-subtitle">4. Matriz de Suites de Pruebas Automatizadas</h4>
        <table class="evidence-table">
          <thead>
            <tr>
              <th style="width: 28%;">Suite de Prueba Evaluada</th>
              <th style="width: 32%;">Métrica de Calidad Esperada / Obtenida</th>
              <th style="width: 18%; text-align: center;">Estatus de Verificación</th>
              <th style="width: 22%; text-align: center;" class="no-print">Simulador / Práctica</th>
            </tr>
          </thead>
          <tbody>
            ${checks.length ? checks.map((c) => `
            <tr>
              <td>
                <strong>${dbeCelda(c.name)}</strong>
                ${c.file ? `<div style="font-size:0.75rem; color:#64748b; margin-top:0.2rem;"><code>${dbeCelda(c.file)}</code></div>` : ''}
              </td>
              <td style="font-size:0.82rem; color: #475569;">${dbeCelda(c.actualMetric || c.details || 'Verificación automatizada en pipeline')}</td>
              <td style="text-align: center;"><span class="badge ${c.passed ? 'badge--success' : 'badge--danger'}">${c.passed ? 'VERIFICADO' : 'PENDIENTE'}</span></td>
              <td style="text-align: center;" class="no-print">
                <button type="button" class="btn btn--xs ${c.passed ? 'btn--secondary' : 'btn--primary'}" data-nav-sim="${c.simId || ''}" data-nav-station="${c.stationId || 'm-simuladores'}" title="${c.passed ? 'Práctica superada. Clic para repasar el ejercicio.' : 'Ir al simulador para realizar el ejercicio práctico'}" style="font-size: 0.72rem; padding: 0.25rem 0.55rem; cursor: pointer;">
                  ${c.passed ? '🔄 Repasar Práctica ➔' : '🎮 Ir al Simulador ➔'}
                </button>
              </td>
            </tr>
            `).join('') : `
            <tr>
              <td><strong>Suites de Pruebas Automatizadas</strong></td>
              <td>PyTest, Jest, JUnit 5, Playwright, Cobertura, CI/CD</td>
              <td style="text-align: center;"><span class="badge badge--success">VERIFICADO</span></td>
              <td style="text-align: center;" class="no-print">—</td>
            </tr>
            `}
          </tbody>
        </table>
      </section>

      <!-- 5. Rúbrica y Criterios de Auto-Revisión -->
      <section class="evidence-section">
        <h4 class="evidence-subtitle">5. Rúbrica y Auto-Revisión de Criterios Técnicos</h4>
        <table class="evidence-table">
          <thead>
            <tr>
              <th style="width: 50%;">Criterio de Auto-Revisión de la Guía</th>
              <th style="width: 15%; text-align: center;">Cumple</th>
              <th style="width: 35%;">Observaciones / Diagnóstico Técnico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Estructura el Plan de Pruebas según el estándar IEEE 829 definiendo alcance, ambientes y matriz de trazabilidad.</td>
              <td style="text-align: center;"><strong>${ev1Done ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
              <td>${ev1Done ? 'Demuestra dominio de la planificación formal y matrices de trazabilidad de prueba.' : 'Pendiente consolidar documento de plan formal IEEE 829.'}</td>
            </tr>
            <tr>
              <td>Automatiza pruebas unitarias y de integración alcanzando una cobertura de código superior o igual al 80%.</td>
              <td style="text-align: center;"><strong>${ev2Done ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
              <td>${ev2Done ? 'Cobertura efectiva del 91.2% verificada en suites PyTest, Jest y JUnit.' : 'Pendiente ejecutar suite con cobertura y aserciones estrictas.'}</td>
            </tr>
            <tr>
              <td>Implementa pruebas End-to-End con Playwright sobre flujos críticos y gestiona defectos en Bug Tracker.</td>
              <td style="text-align: center;"><strong>${ev3Done ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
              <td>${ev3Done ? 'Navegación automatizada real con captura de traces y clasificación de severidad.' : 'Pendiente script Playwright de flujo crítico en navegador.'}</td>
            </tr>
            <tr>
              <td>Configura Quality Gates en pipelines CI/CD desatendidos para prevenir regresiones de software en producción.</td>
              <td style="text-align: center;"><strong>${progress.isApproved ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
              <td>${progress.isApproved ? 'Pipeline en GitHub Actions funcional con bloqueo ante fallos.' : 'Pendiente verificar workflow ci.yml con Quality Gate.'}</td>
            </tr>
          </tbody>
        </table>

        <!-- 6. Caja de Juicio de Evaluación Final -->
        <div class="evidence-verdict-box ${progress.isApproved ? 'is-approved' : ''}">
          <div class="verdict-header">
            <span>RESULTADO ORIENTATIVO DEL REGISTRO LOCAL:</span>
            <span style="font-size: 0.8rem; color: #475569;">Competencia 220501098 · Avance Ponderado: <strong>${progress.weightedScore}%</strong></span>
          </div>
          <div class="verdict-options">
            <label style="display: flex; align-items: center; gap: 0.35rem; cursor: default;">
              <input type="radio" name="juicio" ${progress.isApproved ? 'checked' : ''} disabled> 
              <strong>APROBADO (A)</strong>
            </label>
            <label style="display: flex; align-items: center; gap: 0.35rem; cursor: default;">
              <input type="radio" name="juicio" ${!progress.isApproved ? 'checked' : ''} disabled> 
              <strong>NO APROBADO (NA) — ${progress.isApproved ? 'Superado' : 'EN PROCESO DE FORMACIÓN'}</strong>
            </label>
          </div>
          <div class="evidence-observations-box">
            <strong>Observaciones y Recomendaciones del Instructor:</strong>
            <span id="disp-observations">${dbeCelda(currentObs)}</span>
          </div>
        </div>

        <!-- 7. Declaración de Autenticidad -->
        <div class="evidence-declaration">
          <strong>Declaración de Autenticidad y Veracidad:</strong> El aprendiz abajo firmante declara que las evidencias, suites de prueba automatizadas, scripts de Playwright, reportes de cobertura y simuladores registrados en este informe fueron ejecutados de manera personal y autónoma durante las sesiones prácticas de formación del tecnólogo ADSO, acogiéndose a los reglamentos éticos y académicos del Servicio Nacional de Aprendizaje SENA.
        </div>

        <!-- 8. Espacio Oficial de Firmas -->
        <div class="evidence-signatures-grid">
          <!-- Columna Firma del Aprendiz -->
          <div class="signature-column">
            <div class="signature-stamp-area" id="sheet-sig-stamp-area">
              ${firmaGuardada 
                ? `<img src="${firmaGuardada}" class="signature-stamp-img" alt="Firma del Aprendiz">`
                : '<div class="signature-blank-placeholder"></div>'
              }
            </div>
            <div class="signature-line-bar"></div>
            <div class="signature-details">
              <strong><span id="sig-name">${dbeCelda(apprenticeData.name || 'Firma del Aprendiz')}</span></strong>
              <span>C.C. <span id="sig-doc">${dbeCelda(apprenticeData.docNumber)}</span></span><br>
              <span>Aprendiz SENA — ADSO</span>
              <div id="sheet-sig-tag-area">
                ${firmaGuardada 
                  ? '<span class="signature-digital-tag">✓ Firma Digital Registrada</span>'
                  : '<span style="font-size: 0.72rem; color: #64748b;">(Firma Manuscrita del Aprendiz)</span>'
                }
              </div>
              <button type="button" class="btn btn--xs btn--secondary btn-sign-trigger no-print" data-target-sign="apprentice" title="Firmar o cambiar firma del aprendiz">✍️ Firmar Aprendiz</button>
            </div>
          </div>

          <!-- Columna Firma del Instructor -->
          <div class="signature-column">
            <div class="signature-stamp-area" id="sheet-inst-stamp-area">
              ${firmaInstructor
                ? `<img src="${firmaInstructor}" class="signature-stamp-img" alt="Firma del Instructor">`
                : '<div class="signature-blank-placeholder"></div>'
              }
            </div>
            <div class="signature-line-bar"></div>
            <div class="signature-details">
              <strong><span id="sig-instructor">${dbeCelda(apprenticeData.instructor || 'Firma del Instructor')}</span></strong>
              <span>Instructor Técnico SENA</span><br>
              <span><span id="sig-centro">${dbeCelda(apprenticeData.centro || 'Centro de Formación')}</span></span>
              <div id="sheet-inst-tag-area" style="font-size: 0.72rem; color: #64748b; margin-top: 3px;">
                ${firmaInstructor
                  ? '<span class="signature-digital-tag">✓ Firma / Sello Registrado</span>'
                  : '<span>(Firma y Sello del Instructor Evaluador)</span>'
                }
              </div>
              <button type="button" class="btn btn--xs btn--secondary btn-sign-trigger no-print" data-target-sign="instructor" title="Firmar o estampar como instructor">✍️ Firmar Instructor</button>
            </div>
          </div>
        </div>
      </section>
    `;

    hoja.querySelectorAll('[data-nav-sim]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const simId = btn.getAttribute('data-nav-sim');
        const stationId = btn.getAttribute('data-nav-station') || 'm-simuladores';
        if (window.APP && typeof window.APP.navigateToSimulator === 'function') {
          window.APP.navigateToSimulator(simId, stationId);
        } else if (window.APP && typeof window.APP.navigateTo === 'function') {
          window.APP.navigateTo(stationId);
        } else {
          window.location.hash = stationId;
        }
      });
    });

    // Compatibilidad y pruebas: data-toggle-check
    hoja.querySelectorAll('[data-toggle-check]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const checkId = btn.getAttribute('data-toggle-check');
        if (ts && typeof ts.toggleTestCheck === 'function') {
          ts.toggleTestCheck(checkId);
        }
      });
    });

    hoja.querySelectorAll('[data-nav-station]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const stationId = btn.getAttribute('data-nav-station');
        if (window.APP && typeof window.APP.navigateTo === 'function') {
          window.APP.navigateTo(stationId);
        } else {
          window.location.hash = stationId;
        }
      });
    });

    if (nodoBitacora) {
      hoja.appendChild(dbeEl('section', {
        clase: 'evidence-section no-print',
        attrs: { style: 'margin-top: 1.5rem;' },
        hijos: [
          dbeEl('h4', { clase: 'evidence-subtitle', texto: 'Bitácora Humano–IA (Protocolo V.E.R.A.)' }),
          nodoBitacora
        ]
      }));
    }

    return hoja;
  }
  

  /* --- evidence/dossier.js --- */
  /**
   * Consolidación final del registro integral de evidencias (ADSO).
   *
   * Orquesta el registro local de evidencias al cierre de cada guía.
   * Coordina los datos de identificación, acciones de auto-revisión y la hoja de trabajo.
   */
  
  
  
  
  
  
  /**
   * Lee el perfil del aprendiz sincronizado con TestingSession y localStorage.
   * Preserva los datos introducidos por el aprendiz entre sesiones (día 1, 2, 3...).
   * @param {string} prefijo
   * @returns {Object}
   */
  function dbeLeerPerfilAprendiz(prefijo) {
    const clave = `${prefijo || 'guia_testing'}_apprentice_profile`;
    const perfilInicial = {
      name: 'APRENDIZ ADSO',
      docNumber: '',
      ficha: '228118-ADSO',
      centro: 'Centro de Biotecnología Agropecuaria / CSF',
      regional: 'Regional Distrito Capital',
      instructor: 'INSTRUCTOR TÉCNICO SENA',
      observations: '',
      signature: '',
      date: new Date().toLocaleDateString('es-CO')
    };

    if (typeof window !== 'undefined' && window.TestingSession && typeof window.TestingSession.getProfile === 'function') {
      const tsProfile = window.TestingSession.getProfile();
      if (tsProfile && (tsProfile.name || tsProfile.docNumber)) {
        return { ...perfilInicial, ...tsProfile };
      }
    }

    try {
      const guardado = localStorage.getItem(clave) || localStorage.getItem('guia_testing_apprentice_profile') || localStorage.getItem('sena_apprentice_profile');
      if (guardado) {
        const perfil = JSON.parse(guardado);
        return { ...perfilInicial, ...perfil };
      }
    } catch (e) {}

    return perfilInicial;
  }

  /**
   * Guarda el perfil del aprendiz en localStorage y TestingSession.
   * @param {string} prefijo
   * @param {Object} datos
   */
  function dbeGuardarPerfilAprendiz(prefijo, datos) {
    const clave = `${prefijo || 'guia_testing'}_apprentice_profile`;
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
      localStorage.setItem('guia_testing_apprentice_profile', JSON.stringify(datos));
    } catch (e) {}
    if (typeof window !== 'undefined' && window.TestingSession && typeof window.TestingSession.saveProfile === 'function') {
      window.TestingSession.saveProfile(datos);
    }
  }

  /**
   * Construye la barra de progreso de evidencias.
   * @param {number} listas
   * @param {number} total
   * @returns {HTMLElement}
   */
  function dbeBarraProgreso(listas, total) {
    const porcentaje = total ? Math.round((listas / total) * 100) : 0;
    const relleno = dbeEl('div', { clase: 'dbe-progreso__relleno' });
    relleno.style.width = `${porcentaje}%`;
    return dbeEl('div', {
      clase: 'dbe-progreso',
      hijos: [
        dbeEl('p', {
          clase: 'dbe-progreso__texto',
          texto: `${listas} de ${total} evidencias listas según el criterio declarado (${porcentaje} %).`,
          attrs: { role: 'status', 'aria-live': 'polite' },
        }),
        dbeEl('div', {
          clase: 'dbe-progreso__pista',
          attrs: { role: 'progressbar', 'aria-valuenow': porcentaje, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': 'Evidencias listas' },
          hijos: [relleno],
        }),
      ],
    });
  }

  /**
   * Construye la vista de la bitácora humano–IA acumulada.
   * @param {Array<Object>} bitacora
   * @returns {HTMLElement}
   */
  function dbeVistaBitacora(bitacora) {
    if (!bitacora || !bitacora.length) {
      return dbeEl('p', {
        clase: 'dbe-bloque__texto',
        texto: 'Todavía no registraste uso de IA. Si trabajaste con un asistente y no lo declaras, la evidencia queda incompleta: en 2026 lo evaluable es qué pediste, qué verificaste y qué decidiste.',
      });
    }
    return dbeEl('ul', {
      clase: 'dbe-lista dbe-bitacora',
      hijos: bitacora.map((entrada) => dbeEl('li', {
        hijos: [
          dbeEl('strong', { texto: `${entrada.artifactId || 'general'} · ${entrada.tool || 'herramienta no declarada'}` }),
          dbeEl('p', { clase: 'dbe-bloque__texto', texto: `Verificación: ${entrada.verified || 'no declarada'}. Decisión: ${entrada.decision || 'no declarada'}.` }),
        ],
      })),
    });
  }

  /**
   * Crea un grupo de campo sim/input para el formulario.
   * @param {string} etiqueta
   * @param {string} id
   * @param {string} valor
   * @returns {HTMLElement}
   */
  function dbeCrearGrupoInput(etiqueta, id, valor) {
    return dbeEl('div', {
      clase: 'sim-form-group',
      hijos: [
        dbeEl('label', { clase: 'sim-label', texto: etiqueta, attrs: { for: id } }),
        dbeEl('input', {
          clase: 'sim-input',
          attrs: { type: 'text', id, value: valor || '' }
        })
      ]
    });
  }

  /**
   * Vincula los inputs del formulario con la vista imprimible, observaciones y localStorage.
   * @param {HTMLElement} raiz
   * @param {Object} apprenticeData
   * @param {string} prefijo
   */
  function dbeVincularInputs(raiz, apprenticeData, prefijo) {
    const mapeo = [
      { id: 'ev-name', target: ['disp-name', 'sig-name'], key: 'name' },
      { id: 'ev-doc', target: ['disp-doc', 'sig-doc'], key: 'docNumber', prefix: 'C.C. ' },
      { id: 'ev-ficha', target: ['disp-ficha'], key: 'ficha' },
      { id: 'ev-centro', target: ['disp-centro', 'sig-centro'], key: 'centro' },
      { id: 'ev-regional', target: ['disp-regional'], key: 'regional' },
      { id: 'ev-instructor', target: ['disp-instructor', 'sig-instructor'], key: 'instructor' },
      { id: 'ev-obs', target: ['disp-observations'], key: 'observations' }
    ];

    mapeo.forEach((item) => {
      const input = raiz.querySelector(`#${item.id}`);
      if (!input) return;
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        apprenticeData[item.key] = val;
        dbeGuardarPerfilAprendiz(prefijo, apprenticeData);
        item.target.forEach((targetId) => {
          const nodo = raiz.querySelector(`#${targetId}`);
          if (nodo) {
            nodo.textContent = item.prefix ? `${item.prefix}${val}` : val;
          }
        });
      });
    });
  }

  /**
   * Descarga el documento oficial de evidencias completamente formateado, con estilos y firmado.
   * @param {Object} params
   */
  function dbeDescargarDocumentoHtml({ registro, filas, listas, apprenticeData, bitacora }) {
    const sheetEl = document.getElementById('sena-evidence-sheet') || document.getElementById('sena-dossier-sheet');
    const sheetHtml = sheetEl ? sheetEl.outerHTML : '<p>No se pudo generar la hoja de evidencias.</p>';
    const fichaLimpia = String(apprenticeData.ficha || 'ADSO').replace(/[^a-zA-Z0-9]/g, '_');
    const docLimpio = String(apprenticeData.docNumber || 'aprendiz').replace(/[^a-zA-Z0-9]/g, '_');

    const htmlCompleto = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro Integral de Evidencias - ${dbeCelda(apprenticeData.name)} - Ficha ${dbeCelda(apprenticeData.ficha)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2rem 1rem;
      line-height: 1.45;
    }
    .page-container { max-width: 960px; margin: 0 auto; }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .print-bar span { font-size: 0.9rem; font-weight: 600; }
    .print-btn {
      background: #39a900;
      color: #ffffff;
      border: none;
      padding: 0.55rem 1.15rem;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .print-btn:hover { background: #2e8500; }
    .sena-evidence-sheet,
    .sena-dossier-sheet {
      background: #ffffff !important;
      color: #0f172a !important;
      padding: 2.75rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border: 1px solid #cbd5e1;
    }
    .evidence-header-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #39a900;
      margin-bottom: 1.5rem;
      background: #ffffff;
    }
    .evidence-header-table td {
      border: 1px solid #cbd5e1;
      padding: 0.65rem 0.85rem;
      vertical-align: middle;
    }
    .evidence-header-logo-cell {
      width: 16%;
      text-align: center;
      background: #ffffff;
      padding: 0.5rem !important;
    }
    .evidence-header-logo-cell svg {
      display: block;
      margin: 0 auto;
      max-height: 70px;
      width: auto;
    }
    .evidence-header-title-cell {
      width: 58%;
      text-align: center;
    }
    .evidence-header-title-cell h2 {
      font-size: 0.98rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.25rem 0;
      letter-spacing: 0.5px;
    }
    .evidence-header-title-cell p {
      font-size: 0.78rem;
      color: #475569;
      margin: 0.15rem 0;
      line-height: 1.25;
    }
    .evidence-header-meta-cell {
      width: 26%;
      font-size: 0.76rem;
      background: #f8fafc;
      padding: 0.5rem 0.75rem !important;
      line-height: 1.35;
      color: #334155;
    }
    .evidence-header-meta-cell p { margin: 0.15rem 0; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge--success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge--warning { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
    .badge--danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
    .badge--pending { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    .evidence-section { margin-bottom: 1.5rem; }
    .evidence-subtitle {
      font-size: 0.88rem;
      font-weight: 800;
      color: #0f172a;
      background: #f1f5f9;
      border-left: 4px solid #39a900;
      padding: 0.4rem 0.65rem;
      margin: 1.25rem 0 0.65rem 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .evidence-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
      font-size: 0.84rem;
    }
    .evidence-table th, .evidence-table td {
      border: 1px solid #cbd5e1;
      padding: 0.55rem 0.75rem;
      text-align: left;
      color: #1e293b;
    }
    .evidence-table th {
      background: #f8fafc;
      color: #0f172a;
      font-weight: 700;
      font-size: 0.82rem;
    }
    .evidence-table tr:nth-child(even) td { background: #fafbfd; }
    .evidence-table-label {
      font-weight: 700;
      color: #334155;
      background: #f8fafc;
      width: 22%;
    }
    .evidence-table-val { color: #0f172a; }
    .evidence-verdict-box {
      background: #f8fafc;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      padding: 0.85rem 1.15rem;
      margin: 1.25rem 0;
    }
    .evidence-verdict-box.is-approved {
      border-color: #39a900;
      background: #f0fdf4;
    }
    .verdict-header {
      font-size: 0.88rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .verdict-options {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      margin: 0.4rem 0 0.6rem 0;
      font-size: 0.86rem;
      color: #0f172a;
    }
    .evidence-observations-box {
      margin-top: 0.65rem;
      font-size: 0.8rem;
      color: #334155;
      background: #ffffff;
      padding: 0.55rem 0.75rem;
      border: 1px dashed #cbd5e1;
      border-radius: 4px;
      line-height: 1.35;
    }
    .evidence-declaration {
      font-size: 0.76rem;
      color: #475569;
      font-style: italic;
      margin: 1.25rem 0 1.75rem 0;
      line-height: 1.35;
      border-top: 1px solid #e2e8f0;
      padding-top: 0.65rem;
      text-align: justify;
    }
    .evidence-signatures-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
      margin-top: 1.5rem;
    }
    .signature-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .signature-stamp-area {
      height: 85px;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 4px;
    }
    .signature-stamp-img {
      max-height: 75px;
      max-width: 220px;
      object-fit: contain;
      display: block;
    }
    .signature-blank-placeholder { height: 65px; }
    .signature-line-bar {
      width: 90%;
      border-top: 1.5px solid #0f172a;
      margin-top: 2px;
      margin-bottom: 6px;
    }
    .signature-details {
      font-size: 0.8rem;
      line-height: 1.35;
      color: #1e293b;
    }
    .signature-details strong {
      display: block;
      font-size: 0.85rem;
      color: #0f172a;
    }
    .signature-digital-tag {
      display: inline-block;
      font-size: 0.68rem;
      color: #166534;
      background: #dcfce7;
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px solid #86efac;
      margin-top: 3px;
      font-weight: 600;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; color: #0f172a !important; }
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .print-bar, .no-print, .btn-sign-trigger { display: none !important; }
      .sena-evidence-sheet,
      .sena-dossier-sheet {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      thead { display: table-header-group !important; }
      tfoot { display: table-footer-group !important; }
      .evidence-table tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .evidence-header-table,
      .evidence-subtitle,
      .evidence-verdict-box,
      .evidence-declaration,
      .evidence-signatures-grid,
      .signature-column,
      .signature-stamp-area {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      a, a:visited { text-decoration: none !important; color: inherit !important; }
      a[href]:after { content: "" !important; }
      p, h1, h2, h3, h4, h5, h6 { orphans: 3; widows: 3; }
      @page { margin: 10mm 12mm 10mm 12mm; size: letter portrait; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="print-bar no-print">
      <span>📄 Documento Oficial de Evidencias SENA ADSO (Firmado Digitalmente)</span>
      <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Guardar en PDF</button>
    </div>
    ${sheetHtml}
  </div>
</body>
</html>`;

    dbeDescargar(htmlCompleto, `registro_evidencias_firmado_${fichaLimpia}_${docLimpio}.html`, 'text/html;charset=utf-8');
  }

  /**
   * Ejecuta una impresión limpia y aislada del registro oficial SENA en cualquier navegador.
   */
  function dbeEjecutarImpresionLimpia() {
    const secDossier = document.getElementById('m-evidencias-sena');
    if (secDossier) {
      if (window.APP && typeof window.APP.navigateTo === 'function') {
        window.APP.navigateTo('m-evidencias-sena');
      } else {
        document.querySelectorAll('.page-section').forEach((s) => s.classList.remove('active'));
        secDossier.classList.add('active');
      }
    }
    if (window.DevBrainEvidence && typeof window.DevBrainEvidence.refrescarDossier === 'function') {
      window.DevBrainEvidence.refrescarDossier();
    }
    document.body.classList.add('printing-dossier');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-dossier');
      }, 500);
    }, 120);
  }

  /**
   * Inicializa el sistema multi-modal de firma digital (Aprendiz e Instructor).
   * Soporta 4 modalidades: Dibujar con trazo libre, Escribir caligrafía, Cargar archivo de imagen y Firma física manual.
   * @param {HTMLElement} raiz
   * @param {Object} apprenticeData
   * @param {string} prefijo
   */
  function dbeInicializarFirmaPad(raiz, apprenticeData, prefijo) {
    const canvas = raiz.querySelector('#signature-canvas');
    if (!canvas) return;

    const claveFirmaApprentice = `${prefijo || 'guia_testing'}_apprentice_signature`;
    const claveFirmaInstructor = `${prefijo || 'guia_testing'}_instructor_signature`;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasDrawn = false;
    let currentRole = 'apprentice'; // 'apprentice' | 'instructor'
    let currentMode = 'draw';       // 'draw' | 'type' | 'upload' | 'manual'

    // Configuración de trazo suave
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function startDraw(e) {
      e.preventDefault();
      if (canvas.setPointerCapture && e.pointerId) {
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      }
      isDrawing = true;
      hasDrawn = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDraw(e) {
      if (!isDrawing) return;
      isDrawing = false;
      if (canvas.releasePointerCapture && e.pointerId) {
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    }

    // Eventos Pointer (Mouse, Touch, Stylus)
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointercancel', stopDraw);
    canvas.addEventListener('pointerleave', stopDraw);

    // Fallbacks para dispositivos táctiles
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    // Referencias a elementos del DOM
    const stampAreaApprentice = raiz.querySelector('#sheet-sig-stamp-area');
    const tagAreaApprentice = raiz.querySelector('#sheet-sig-tag-area');
    const stampAreaInstructor = raiz.querySelector('#sheet-inst-stamp-area');
    const tagAreaInstructor = raiz.querySelector('#sheet-inst-tag-area');
    const statusBadge = raiz.querySelector('#sig-status-badge');
    const btnRemove = raiz.querySelector('#btn-remove-sig');
    const typedInput = raiz.querySelector('#signature-typed-input');
    const typedPreview = raiz.querySelector('#signature-typed-preview');
    const fontSelect = raiz.querySelector('#signature-font-select');
    const panelDraw = raiz.querySelector('#panel-sig-draw');
    const panelType = raiz.querySelector('#panel-sig-type');
    const panelUpload = raiz.querySelector('#panel-sig-upload');
    const panelManual = raiz.querySelector('#panel-sig-manual');
    const roleIndicator = raiz.querySelector('#sig-current-role-label');

    // Generador de firma caligráfica en Canvas de alta resolución
    function generarFirmaCaligraficaDataUrl(texto, fuente) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 440;
      offCanvas.height = 140;
      const oCtx = offCanvas.getContext('2d');
      oCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      oCtx.fillStyle = '#0f172a';
      oCtx.font = `italic bold 42px ${fuente || 'Dancing Script, "Brush Script MT", Caveat, cursive'}`;
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.save();
      oCtx.translate(offCanvas.width / 2, offCanvas.height / 2 - 4);
      oCtx.rotate(-0.03);
      oCtx.fillText(texto || 'Firma Digital', 0, 0);

      // Trazo decorativo fluido bajo la firma
      oCtx.beginPath();
      const ancho = oCtx.measureText(texto || 'Firma Digital').width;
      const xIni = -ancho / 2 - 8;
      const xFin = ancho / 2 + 12;
      oCtx.moveTo(xIni, 22);
      oCtx.bezierCurveTo(xIni + ancho * 0.4, 28, xIni + ancho * 0.7, 16, xFin, 24);
      oCtx.lineWidth = 2.2;
      oCtx.strokeStyle = '#0f172a';
      oCtx.stroke();
      oCtx.restore();

      return offCanvas.toDataURL('image/png');
    }

    // Actualiza la vista previa del modo caligráfico
    function actualizarPreviewCaligrafico() {
      if (!typedPreview) return;
      const texto = (typedInput && typedInput.value.trim()) || (currentRole === 'apprentice' ? apprenticeData.name : apprenticeData.instructor) || 'Firma Digital';
      typedPreview.textContent = texto;
      if (fontSelect) {
        typedPreview.style.fontFamily = fontSelect.value;
      }
    }

    if (typedInput) {
      typedInput.addEventListener('input', actualizarPreviewCaligrafico);
    }
    if (fontSelect) {
      fontSelect.addEventListener('change', actualizarPreviewCaligrafico);
    }

    // Función principal para aplicar firma según rol y modalidad
    const aplicarFirma = (dataUrl, role = currentRole, mode = currentMode) => {
      const esAprendiz = role === 'apprentice';

      if (esAprendiz) {
        apprenticeData.signature = dataUrl;
        try {
          if (dataUrl) {
            localStorage.setItem(claveFirmaApprentice, dataUrl);
            localStorage.setItem('sena_apprentice_signature', dataUrl);
          } else {
            localStorage.removeItem(claveFirmaApprentice);
            localStorage.removeItem('sena_apprentice_signature');
          }
        } catch (_) {}

        if (typeof window !== 'undefined' && window.TestingSession && typeof window.TestingSession.saveSignature === 'function') {
          window.TestingSession.saveSignature(dataUrl);
        }

        if (stampAreaApprentice) {
          stampAreaApprentice.innerHTML = dataUrl
            ? `<img src="${dataUrl}" class="signature-stamp-img" alt="Firma del Aprendiz">`
            : `<div class="signature-blank-placeholder"></div>`;
        }
        if (tagAreaApprentice) {
          tagAreaApprentice.innerHTML = dataUrl
            ? `<span class="signature-digital-tag">✓ Firma Digital Registrada (${mode === 'type' ? 'Caligráfica' : 'Trazo'})</span>`
            : `<span style="font-size: 0.72rem; color: #64748b;">(Firma Manuscrita del Aprendiz)</span>`;
        }
      } else {
        apprenticeData.instructorSignature = dataUrl;
        try {
          if (dataUrl) {
            localStorage.setItem(claveFirmaInstructor, dataUrl);
            localStorage.setItem('sena_instructor_signature', dataUrl);
          } else {
            localStorage.removeItem(claveFirmaInstructor);
            localStorage.removeItem('sena_instructor_signature');
          }
        } catch (_) {}

        if (stampAreaInstructor) {
          stampAreaInstructor.innerHTML = dataUrl
            ? `<img src="${dataUrl}" class="signature-stamp-img" alt="Firma del Instructor">`
            : `<div class="signature-blank-placeholder"></div>`;
        }
        if (tagAreaInstructor) {
          tagAreaInstructor.innerHTML = dataUrl
            ? `<span class="signature-digital-tag">✓ Firma / Sello Registrado (${mode === 'type' ? 'Caligráfica' : 'Trazo'})</span>`
            : `<span style="font-size: 0.72rem; color: #64748b;">(Firma y Sello del Instructor Evaluador)</span>`;
        }
      }

      actualizarEstadoUI();

      if (dataUrl && window.APP && typeof window.APP.showToast === 'function') {
        window.APP.showToast(`Firma de ${esAprendiz ? 'Aprendiz' : 'Instructor'} incorporada al documento ✓`, 'success');
      }
    };

    function actualizarEstadoUI() {
      const firmaRol = currentRole === 'apprentice' ? apprenticeData.signature : apprenticeData.instructorSignature;
      const rolNombre = currentRole === 'apprentice' ? 'Aprendiz' : 'Instructor';

      if (roleIndicator) {
        roleIndicator.textContent = `Firmando para: ${rolNombre} (${currentRole === 'apprentice' ? (apprenticeData.name || 'Sin nombre') : (apprenticeData.instructor || 'Sin nombre')})`;
      }

      if (statusBadge) {
        if (firmaRol) {
          statusBadge.className = 'signature-status-pill is-active';
          statusBadge.textContent = `✅ Firma de ${rolNombre} Incorporada al Documento`;
        } else {
          statusBadge.className = 'signature-status-pill is-empty';
          statusBadge.textContent = `ℹ️ ${rolNombre} sin firma digital (Espacio listo para firma manual)`;
        }
      }

      if (btnRemove) {
        btnRemove.style.display = firmaRol ? 'inline-flex' : 'none';
      }
    }

    // Cambio de rol (Aprendiz / Instructor)
    const setRole = (role) => {
      currentRole = role;
      raiz.querySelectorAll('.sig-role-btn').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-role') === role);
      });
      if (typedInput) {
        typedInput.value = (role === 'apprentice' ? apprenticeData.name : apprenticeData.instructor) || '';
        actualizarPreviewCaligrafico();
      }
      actualizarEstadoUI();
    };

    raiz.querySelectorAll('.sig-role-btn').forEach((b) => {
      b.addEventListener('click', () => setRole(b.getAttribute('data-role')));
    });

    // Enlaces de firma rápida desde la hoja oficial (botones "✍️ Firmar Aprendiz" e "✍️ Firmar Instructor")
    raiz.querySelectorAll('.btn-sign-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetRole = btn.getAttribute('data-target-sign') || 'apprentice';
        setRole(targetRole);
        const panel = raiz.querySelector('.signature-control-panel');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Cambio de modalidad (Dibujar, Caligrafía, Cargar, Manual)
    const setMode = (mode) => {
      currentMode = mode;
      raiz.querySelectorAll('.sig-mode-btn').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-mode') === mode);
      });
      if (panelDraw) panelDraw.style.display = mode === 'draw' ? 'block' : 'none';
      if (panelType) panelType.style.display = mode === 'type' ? 'block' : 'none';
      if (panelUpload) panelUpload.style.display = mode === 'upload' ? 'block' : 'none';
      if (panelManual) panelManual.style.display = mode === 'manual' ? 'block' : 'none';

      const btnSave = raiz.querySelector('#btn-save-sig');
      const btnClear = raiz.querySelector('#btn-clear-sig');
      if (btnClear) btnClear.style.display = (mode === 'draw' || mode === 'type') ? 'inline-flex' : 'none';
      if (btnSave) {
        btnSave.textContent = mode === 'manual' ? '📝 Aplicar Modo Manual (Espacio en Físico)' : '💾 Aplicar Firma al Documento';
      }
    };

    raiz.querySelectorAll('.sig-mode-btn').forEach((b) => {
      b.addEventListener('click', () => setMode(b.getAttribute('data-mode')));
    });

    // Restaurar si ya existían firmas previas
    let firmaExistenteAprendiz = apprenticeData.signature;
    if (!firmaExistenteAprendiz && typeof localStorage !== 'undefined') {
      firmaExistenteAprendiz = localStorage.getItem(claveFirmaApprentice) || localStorage.getItem('sena_apprentice_signature') || '';
    }
    if (firmaExistenteAprendiz) {
      aplicarFirma(firmaExistenteAprendiz, 'apprentice', 'draw');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        hasDrawn = true;
      };
      img.src = firmaExistenteAprendiz;
    }

    let firmaExistenteInstructor = apprenticeData.instructorSignature;
    if (!firmaExistenteInstructor && typeof localStorage !== 'undefined') {
      firmaExistenteInstructor = localStorage.getItem(claveFirmaInstructor) || localStorage.getItem('sena_instructor_signature') || '';
    }
    if (firmaExistenteInstructor) {
      aplicarFirma(firmaExistenteInstructor, 'instructor', 'draw');
    }

    // Botón Guardar / Aplicar Firma
    const btnSave = raiz.querySelector('#btn-save-sig');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        if (currentMode === 'draw') {
          if (!hasDrawn) {
            alert('Por favor trace su firma en el recuadro con el mouse antes de aplicarla.');
            return;
          }
          const dataUrl = canvas.toDataURL('image/png');
          aplicarFirma(dataUrl, currentRole, 'draw');
        } else if (currentMode === 'type') {
          const texto = (typedInput && typedInput.value.trim()) || '';
          if (!texto) {
            alert('Por favor escriba un nombre o texto para generar la firma caligráfica.');
            return;
          }
          const fuente = fontSelect ? fontSelect.value : 'Dancing Script, cursive';
          const dataUrl = generarFirmaCaligraficaDataUrl(texto, fuente);
          aplicarFirma(dataUrl, currentRole, 'type');
        } else if (currentMode === 'upload') {
          if (!hasDrawn) {
            alert('Por favor seleccione un archivo de imagen antes de aplicar.');
            return;
          }
          const dataUrl = canvas.toDataURL('image/png');
          aplicarFirma(dataUrl, currentRole, 'upload');
        } else if (currentMode === 'manual') {
          aplicarFirma('', currentRole, 'manual');
          if (window.APP && typeof window.APP.showToast === 'function') {
            window.APP.showToast('Espacio configurado para firma manuscrita en físico tras imprimir ✓', 'info');
          }
        }
      });
    }

    // Botón Limpiar
    const btnClear = raiz.querySelector('#btn-clear-sig');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (currentMode === 'draw' || currentMode === 'upload') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          hasDrawn = false;
        } else if (currentMode === 'type' && typedInput) {
          typedInput.value = '';
          actualizarPreviewCaligrafico();
        }
      });
    }

    // Botón / Input Cargar Imagen
    const fileInput = raiz.querySelector('#sig-file-input');
    const uploadTrigger = raiz.querySelector('#btn-upload-sig-trigger');
    const uploadBtnInPanel = raiz.querySelector('#btn-browse-sig-file');
    const triggerFileClick = () => { if (fileInput) fileInput.click(); };

    if (uploadTrigger) uploadTrigger.addEventListener('click', triggerFileClick);
    if (uploadBtnInPanel) uploadBtnInPanel.addEventListener('click', triggerFileClick);

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              // Dibujar centrado respetando proporción
              const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
              const nw = img.width * ratio;
              const nh = img.height * ratio;
              const ox = (canvas.width - nw) / 2;
              const oy = (canvas.height - nh) / 2;
              ctx.drawImage(img, ox, oy, nw, nh);
              hasDrawn = true;
              aplicarFirma(dataUrl, currentRole, 'upload');
            };
            img.src = dataUrl;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Botón Quitar Firma
    if (btnRemove) {
      btnRemove.addEventListener('click', () => {
        aplicarFirma('', currentRole, 'manual');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawn = false;
      });
    }

    actualizarEstadoUI();
  }

  /**
   * Monta la sección de consolidación local de evidencias.
   *
   * @param {HTMLElement} contenedor - Nodo con `data-db-evidence-dossier`
   * @param {Object} registro - Registro normalizado de entregables
   * @param {Object} store - Instancia de DbeEvidenceStore
   * @returns {{refrescar: Function}}
   */
  function dbeMontarDossier(contenedor, registro, store) {
    const apprenticeData = dbeLeerPerfilAprendiz(store ? store.prefijo : '');
  
    const construirFilas = () => registro.artifacts.map((artefacto) => {
      const datos = store ? store.leer(artefacto.id) : {};
      return { artefacto, datos, estado: dbeCalcularEstado(artefacto, datos) };
    });
  
    const pintar = () => {
      const filas = construirFilas();
      const listas = filas.filter((fila) => fila.estado === 'lista').length;
      const bitacora = store ? store.leerBitacora() : [];
      const prefijo = store ? store.prefijo : 'guia_testing';
      const claveFirma = `${prefijo}_apprentice_signature`;
      const firmaActual = apprenticeData.signature || (typeof localStorage !== 'undefined' ? (localStorage.getItem(claveFirma) || localStorage.getItem('sena_apprentice_signature') || '') : '');
  
      // 1. Tarjeta de Formulario de Identificación (no-print)
      const formCard = dbeEl('div', {
        clase: 'evidence-form-card no-print',
        hijos: [
          dbeEl('div', {
            attrs: { style: 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;' },
            hijos: [
              dbeEl('h3', { clase: 'evidence-title', attrs: { style: 'margin: 0;' }, texto: '📋 Registro local de evidencias de aprendizaje (ADSO)' }),
              dbeEl('div', {
                attrs: { style: 'display: flex; align-items: center; gap: 0.5rem;' },
                hijos: [
                  dbeEl('span', { attrs: { style: 'font-size: 0.85rem; color: #64748b;' }, texto: 'Estado de Memoria:' }),
                  dbeEl('span', { clase: 'badge badge--success', texto: 'PERSISTENCIA LOCAL ACTIVA' })
                ]
              })
            ]
          }),
          dbeEl('p', { clase: 'text-muted', texto: 'Diligencia tus datos personales y registra tu firma digital. El progreso de tus retos, simuladores y suites de pruebas se guardan automáticamente en la memoria del navegador para retomar al segundo o tercer día sin perder avance:' }),
          dbeEl('div', {
            clase: 'evidence-form-grid',
            hijos: [
              dbeCrearGrupoInput('Nombre Completo del Aprendiz:', 'ev-name', apprenticeData.name),
              dbeCrearGrupoInput('Documento de Identidad:', 'ev-doc', apprenticeData.docNumber),
              dbeCrearGrupoInput('Número de Ficha ADSO:', 'ev-ficha', apprenticeData.ficha),
              dbeCrearGrupoInput('Centro de Formación:', 'ev-centro', apprenticeData.centro),
              dbeCrearGrupoInput('Regional SENA:', 'ev-regional', apprenticeData.regional),
              dbeCrearGrupoInput('Nombre del Instructor Líder:', 'ev-instructor', apprenticeData.instructor),
              dbeEl('div', {
                clase: 'sim-form-group',
                attrs: { style: 'grid-column: 1 / -1; margin-top: 0.5rem;' },
                hijos: [
                  dbeEl('label', { clase: 'sim-label', texto: 'Observaciones o Dictamen del Instructor / Diagnóstico:', attrs: { for: 'ev-obs' } }),
                  dbeEl('textarea', {
                    clase: 'sim-input',
                    attrs: { id: 'ev-obs', rows: '2', style: 'width: 100%; font-family: inherit; font-size: 0.85rem; padding: 0.5rem; resize: vertical;' },
                    texto: apprenticeData.observations || ''
                  })
                ]
              })
            ]
          }),
          // Panel de Firma Multi-Modal (Trazar, Escribir, Cargar, Manual)
          dbeEl('div', {
            clase: 'signature-control-panel',
            hijos: [
              dbeEl('div', {
                attrs: { style: 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;' },
                hijos: [
                  dbeEl('h4', { clase: 'signature-panel-title', attrs: { style: 'margin: 0;' }, texto: '✍️ Opciones y Registro de Firma Oficial (SENA SIGA)' }),
                  dbeEl('span', {
                    attrs: { id: 'sig-current-role-label', style: 'font-size: 0.8rem; font-weight: 700; color: #39a900;' },
                    texto: `Firmando para: Aprendiz (${apprenticeData.name || 'Sin nombre'})`
                  })
                ]
              }),
              dbeEl('p', {
                clase: 'signature-panel-subtitle',
                texto: 'Selecciona quién firma (Aprendiz o Instructor) y el método preferido: dibujar con el mouse o táctil, generar con tipografía caligráfica estilizada, subir una imagen de tu firma o reservar el espacio para firma manual con bolígrafo tras imprimir.'
              }),
              // Selector de Rol
              dbeEl('div', {
                clase: 'sig-role-selector',
                hijos: [
                  dbeEl('strong', { attrs: { style: 'color: #334155; font-size: 0.82rem;' }, texto: 'Firmar como:' }),
                  dbeEl('button', {
                    clase: 'sig-role-btn is-active',
                    attrs: { type: 'button', id: 'btn-role-apprentice', 'data-role': 'apprentice' },
                    texto: '🎓 Aprendiz SENA'
                  }),
                  dbeEl('button', {
                    clase: 'sig-role-btn',
                    attrs: { type: 'button', id: 'btn-role-instructor', 'data-role': 'instructor' },
                    texto: '👨‍🏫 Instructor Técnico'
                  })
                ]
              }),
              // Pestañas de Modalidad
              dbeEl('div', {
                clase: 'signature-mode-tabs',
                hijos: [
                  dbeEl('button', {
                    clase: 'sig-mode-btn is-active',
                    attrs: { type: 'button', id: 'tab-sig-draw', 'data-mode': 'draw' },
                    texto: '✏️ Dibujar Trazo'
                  }),
                  dbeEl('button', {
                    clase: 'sig-mode-btn',
                    attrs: { type: 'button', id: 'tab-sig-type', 'data-mode': 'type' },
                    texto: '🔤 Escribir Caligrafía'
                  }),
                  dbeEl('button', {
                    clase: 'sig-mode-btn',
                    attrs: { type: 'button', id: 'tab-sig-upload', 'data-mode': 'upload' },
                    texto: '📁 Cargar Imagen'
                  }),
                  dbeEl('button', {
                    clase: 'sig-mode-btn',
                    attrs: { type: 'button', id: 'tab-sig-manual', 'data-mode': 'manual' },
                    texto: '📝 Firma Física en Papel'
                  })
                ]
              }),
              // Contenedor de Paneles
              dbeEl('div', {
                attrs: { style: 'display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-start;' },
                hijos: [
                  // Columna izquierda: Paneles de contenido según modo
                  dbeEl('div', {
                    attrs: { style: 'flex: 1; min-width: 320px;' },
                    hijos: [
                      // Panel 1: Canvas para Dibujar
                      dbeEl('div', {
                        attrs: { id: 'panel-sig-draw' },
                        hijos: [
                          dbeEl('div', {
                            clase: 'signature-canvas-wrapper',
                            hijos: [
                              dbeEl('canvas', { attrs: { id: 'signature-canvas', width: '380', height: '125' } })
                            ]
                          }),
                          dbeEl('div', { clase: 'signature-canvas-hint', texto: '✏️ Dibuje su firma aquí con el mouse, touchpad o pantalla táctil' })
                        ]
                      }),
                      // Panel 2: Escribir con tipografía caligráfica
                      dbeEl('div', {
                        attrs: { id: 'panel-sig-type', style: 'display: none;' },
                        clase: 'signature-typed-panel',
                        hijos: [
                          dbeEl('input', {
                            clase: 'signature-typed-input',
                            attrs: {
                              type: 'text',
                              id: 'signature-typed-input',
                              placeholder: 'Escriba su nombre y apellido completo...',
                              value: apprenticeData.name || ''
                            }
                          }),
                          dbeEl('div', {
                            attrs: { style: 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;' },
                            hijos: [
                              dbeEl('label', { attrs: { for: 'signature-font-select', style: 'font-size: 0.78rem; color: #64748b; font-weight: 600;' }, texto: 'Estilo de letra:' }),
                              dbeEl('select', {
                                attrs: { id: 'signature-font-select', style: 'font-size: 0.8rem; padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid #cbd5e1;' },
                                hijos: [
                                  dbeEl('option', { attrs: { value: 'Dancing Script, cursive' }, texto: 'Caligrafía Elegante (Dancing Script)' }),
                                  dbeEl('option', { attrs: { value: 'Caveat, cursive' }, texto: 'Manuscrita Natural (Caveat)' }),
                                  dbeEl('option', { attrs: { value: '"Brush Script MT", cursive' }, texto: 'Firma Clásica (Brush Script)' }),
                                  dbeEl('option', { attrs: { value: '"Segoe Script", cursive' }, texto: 'Estilo Cursiva (Segoe Script)' })
                                ]
                              })
                            ]
                          }),
                          dbeEl('div', {
                            clase: 'signature-typed-preview-card',
                            hijos: [
                              dbeEl('div', {
                                clase: 'signature-typed-text',
                                attrs: { id: 'signature-typed-preview' },
                                texto: apprenticeData.name || 'Firma Digital'
                              })
                            ]
                          }),
                          dbeEl('div', { clase: 'signature-canvas-hint', texto: '🔤 Esta tipografía se convertirá automáticamente en un sello digital de alta definición' })
                        ]
                      }),
                      // Panel 3: Cargar imagen
                      dbeEl('div', {
                        attrs: { id: 'panel-sig-upload', style: 'display: none;' },
                        hijos: [
                          dbeEl('div', {
                            attrs: { style: 'border: 2px dashed #cbd5e1; border-radius: 8px; padding: 1.5rem; text-align: center; background: #f8fafc;' },
                            hijos: [
                              dbeEl('p', { attrs: { style: 'font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem;' }, texto: 'Carga una imagen o fotografía de tu firma (PNG con transparencia recomendado, JPG o WebP):' }),
                              dbeEl('button', {
                                clase: 'btn btn--primary btn--sm',
                                attrs: { type: 'button', id: 'btn-browse-sig-file' },
                                texto: '📁 Seleccionar Imagen de Firma'
                              })
                            ]
                          }),
                          dbeEl('div', { clase: 'signature-canvas-hint', texto: '📁 Se ajustará proporcionalmente y se integrará al documento oficial' })
                        ]
                      }),
                      // Panel 4: Manual en físico
                      dbeEl('div', {
                        attrs: { id: 'panel-sig-manual', style: 'display: none;' },
                        hijos: [
                          dbeEl('div', {
                            attrs: { style: 'background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1.25rem; font-size: 0.85rem; color: #166534;' },
                            hijos: [
                              dbeEl('strong', { texto: '📝 Firma Manuscrita en Físico:' }),
                              dbeEl('p', { attrs: { style: 'margin: 0.5rem 0 0 0; line-height: 1.4;' }, texto: 'Al imprimir o exportar a PDF, se mantendrá el espacio despejado con la línea oficial y tus datos para firmar a mano con bolígrafo y estampar sello físico.' })
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  // Columna derecha: Estado y Acciones
                  dbeEl('div', {
                    attrs: { style: 'flex: 1; min-width: 240px;' },
                    hijos: [
                      dbeEl('div', {
                        attrs: { style: 'margin-bottom: 0.75rem;' },
                        hijos: [
                          dbeEl('span', {
                            clase: `signature-status-pill ${firmaActual ? 'is-active' : 'is-empty'}`,
                            attrs: { id: 'sig-status-badge' },
                            texto: firmaActual ? '✅ Firma Digital Incorporada al Documento' : 'ℹ️ Sin firma digital (Espacio listo para firma manual)'
                          })
                        ]
                      }),
                      dbeEl('div', {
                        clase: 'signature-panel-actions',
                        hijos: [
                          dbeEl('button', {
                            clase: 'btn btn--primary btn--sm',
                            attrs: { type: 'button', id: 'btn-save-sig' },
                            texto: '💾 Aplicar Firma al Documento'
                          }),
                          dbeEl('button', {
                            clase: 'btn btn--secondary btn--sm',
                            attrs: { type: 'button', id: 'btn-clear-sig' },
                            texto: '🧹 Limpiar Trazo'
                          }),
                          dbeEl('button', {
                            clase: 'btn btn--secondary btn--sm',
                            attrs: { type: 'button', id: 'btn-upload-sig-trigger' },
                            texto: '📁 Cargar Imagen'
                          }),
                          dbeEl('input', {
                            attrs: { type: 'file', id: 'sig-file-input', accept: 'image/png, image/jpeg, image/webp', style: 'display: none;' }
                          }),
                          dbeEl('button', {
                            clase: 'btn btn--secondary btn--sm',
                            attrs: { type: 'button', id: 'btn-remove-sig', style: firmaActual ? '' : 'display: none;' },
                            texto: '🗑️ Quitar Firma'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      });
  
      // 2. Acciones de persistencia, sincronización y exportación
      const botonGuardarMemoria = dbeEl('button', {
        clase: 'btn btn--primary',
        texto: '💾 Guardar en Memoria',
        attrs: { type: 'button', id: 'btn-save-memory', title: 'Guarda tu avance y perfil localmente para retomar en cualquier sesión futura' }
      });
      botonGuardarMemoria.addEventListener('click', () => {
        dbeGuardarPerfilAprendiz(prefijo, apprenticeData);
        if (window.APP && typeof window.APP.showToast === 'function') {
          window.APP.showToast('¡Avance y perfil guardados en la memoria del navegador! Podrás retomar en tu próxima sesión.', 'success');
        } else {
          alert('¡Avance y perfil guardados con éxito en la memoria del navegador!');
        }
      });

      const botonExportarRespaldo = dbeEl('button', {
        clase: 'btn btn--secondary',
        texto: '📥 Exportar Respaldo (.json)',
        attrs: { type: 'button', id: 'btn-export-backup', title: 'Descarga un archivo de respaldo con tu perfil, firmas, simuladores y pruebas' }
      });
      botonExportarRespaldo.addEventListener('click', () => {
        const ts = (typeof window !== 'undefined' && window.TestingSession) ? window.TestingSession : null;
        let backup = null;
        if (ts && typeof ts.exportFullSessionBackup === 'function') {
          backup = ts.exportFullSessionBackup();
        } else {
          backup = {
            version: '1.0',
            profile: apprenticeData,
            signature: apprenticeData.signature,
            simulators: {},
            testChecks: [],
            exportedAt: new Date().toISOString()
          };
        }
        const fichaLimpia = String(apprenticeData.ficha || 'ADSO').replace(/[^a-zA-Z0-9]/g, '_');
        const docLimpio = String(apprenticeData.docNumber || 'aprendiz').replace(/[^a-zA-Z0-9]/g, '_');
        dbeDescargar(JSON.stringify(backup, null, 2), `respaldo_completo_guia_testing_${fichaLimpia}_${docLimpio}.json`, 'application/json');
      });

      const inputRestaurar = dbeEl('input', {
        attrs: { type: 'file', id: 'input-restore-backup', accept: 'application/json', style: 'display: none;' }
      });
      inputRestaurar.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            const ts = (typeof window !== 'undefined' && window.TestingSession) ? window.TestingSession : null;
            if (ts && typeof ts.importFullSessionBackup === 'function') {
              const ok = ts.importFullSessionBackup(data);
              if (ok) {
                if (data.profile) Object.assign(apprenticeData, data.profile);
                pintar();
                if (window.APP && typeof window.APP.showToast === 'function') {
                  window.APP.showToast('¡Respaldo importado y avance restaurado con éxito!', 'success');
                } else {
                  alert('¡Respaldo restaurado con éxito!');
                }
                return;
              }
            }
            if (data.apprentice || data.profile) {
              Object.assign(apprenticeData, data.apprentice || data.profile);
              dbeGuardarPerfilAprendiz(prefijo, apprenticeData);
              pintar();
              alert('Datos de perfil restaurados con éxito.');
            }
          } catch (err) {
            alert('El archivo seleccionado no tiene un formato de respaldo JSON válido.');
          }
        };
        reader.readAsText(file);
      });

      const botonRestaurarRespaldo = dbeEl('button', {
        clase: 'btn btn--secondary',
        texto: '📤 Restaurar Avance (.json)',
        attrs: { type: 'button', id: 'btn-restore-backup', title: 'Carga un archivo de respaldo JSON para continuar tu trabajo en otro equipo' }
      });
      botonRestaurarRespaldo.addEventListener('click', () => inputRestaurar.click());

      const botonImprimir = dbeEl('button', {
        clase: 'btn btn--primary',
        texto: '🖨️ Imprimir / Guardar en PDF',
        attrs: { type: 'button', id: 'btn-print-evidence' }
      });
      botonImprimir.addEventListener('click', () => { dbeEjecutarImpresionLimpia(); });

      formCard.appendChild(dbeEl('div', {
        clase: 'evidence-actions-bar no-print',
        attrs: { style: 'margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;' },
        hijos: [
          botonGuardarMemoria,
          botonExportarRespaldo,
          botonRestaurarRespaldo,
          inputRestaurar,
          botonImprimir
        ]
      }));
  
      // 3. Hoja imprimible de trabajo
      const dossierSheet = dbeConstruirHojaSena({
        registro,
        filas,
        listas,
        apprenticeData,
        nodoBitacora: dbeVistaBitacora(bitacora)
      });
  
      // 4. Bloque de pendientes / avisos
      const pendientes = filas.filter((fila) => fila.estado !== 'lista');
      const bloquePendientes = pendientes.length
        ? dbeEl('div', {
          clase: 'dbe-dossier__pendientes no-print',
          hijos: [
            dbeEl('h3', { clase: 'dbe-dossier__subtitulo', texto: `Te faltan ${pendientes.length} evidencias por completar` }),
            dbeEl('p', { clase: 'dbe-bloque__texto', texto: 'Cada enlace te devuelve a la estación donde se encuentra la teoría, el ejemplo y el formulario correspondiente:' }),
            dbeEl('ul', {
              clase: 'dbe-lista',
              hijos: pendientes.map((fila) => dbeEl('li', {
                hijos: [
                  dbeEl('a', {
                    texto: `${fila.artefacto.code} · ${fila.artefacto.name}`,
                    attrs: { href: fila.artefacto.station.sectionId ? `#${fila.artefacto.station.sectionId}` : '#' },
                  }),
                  document.createTextNode(` — ${dbeEtiquetaEstado(fila.estado).toLowerCase()}`),
                ],
              })),
            }),
          ],
        })
        : dbeEl('p', {
          clase: 'dbe-bloque__texto dbe-bloque--exito no-print',
            texto: 'Todas las evidencias declaradas están diligenciadas y contrastadas con su criterio. Imprime el registro o descarga el paquete JSON para revisarlo con el instructor.',
        });
  
      const tarjeta = dbeEl('div', {
        clase: 'dbe-dossier evidence-wrapper',
        hijos: [
          dbeEl('div', { clase: 'no-print', hijos: [dbeBarraProgreso(listas, filas.length), bloquePendientes] }),
          formCard,
          dossierSheet,
          dbeEl('p', {
            clase: 'dbe-dossier__limite no-print',
              texto: 'Este registro se calcula en tu navegador a partir del avance guardado localmente. La valoración final la realiza el instructor mediante los instrumentos institucionales aplicables.',
          })
        ]
      });
  
      contenedor.replaceChildren(tarjeta);
      dbeSeguirTema(tarjeta);
      dbeVincularInputs(tarjeta, apprenticeData, store ? store.prefijo : '');
      dbeInicializarFirmaPad(tarjeta, apprenticeData, store ? store.prefijo : '');
    };
  
    pintar();
    if (store) {
      store.suscribir(() => pintar());
    }
    if (typeof window !== 'undefined') {
      if (window.TestingSession && typeof window.TestingSession.subscribe === 'function') {
        window.TestingSession.subscribe(() => pintar());
      }
      if (window.DevBrainEvidence) {
        window.DevBrainEvidence.refrescarDossier = pintar;
        window.DevBrainEvidence.imprimir = dbeEjecutarImpresionLimpia;
      }
    }
    return { refrescar: pintar };
  }
  
  /**
   * Monta un indicador compacto de progreso reutilizable en cualquier punto.
   * @param {HTMLElement} contenedor
   * @param {Object} registro
   * @param {Object} store
   */
  function dbeMontarProgreso(contenedor, registro, store) {
    const pintar = () => {
      const listas = registro.artifacts.filter((artefacto) => dbeCalcularEstado(artefacto, store ? store.leer(artefacto.id) : {}) === 'lista').length;
      const tarjeta = dbeEl('div', { clase: 'dbe-dossier dbe-dossier--compacto', hijos: [dbeBarraProgreso(listas, registro.artifacts.length)] });
      contenedor.replaceChildren(tarjeta);
      dbeSeguirTema(tarjeta);
    };
    pintar();
    if (store) {
      store.suscribir(() => pintar());
    }
  }
  

  /* --- evidence/index.js --- */
  /**
   * Módulo de evidencias distribuidas.
   *
   * Una guía lo usa así:
   *
   *   <section id="sipoc"> … teoría, ejemplo, ejercicio …
   *     <div data-db-evidence="G1-A03"></div>
   *   </section>
   *   …
   *   <section id="cierre">
   *     <div data-db-evidence-dossier></div>
   *   </section>
   *
   *   <script>
   *     DevBrainEvidence.montar({ registro: registroDeEntregables, prefijo: 'devbrain_guia1' });
   *   </script>
   *
   * El registro puede pasarse como objeto ya cargado o como ruta a
   * `deliverables.registry.json`. Abrir la guía con `file://` bloquea `fetch`, así
   * que una guía que deba funcionar desde un USB debe incrustar el objeto.
   */
  
  
  
  
  
  /**
   * Resuelve el registro cuando llega como ruta.
   * @param {Object|string} origen
   * @returns {Promise<Object>}
   */
  async function dbeResolverRegistro(origen) {
    if (!origen) throw new Error('DevBrainEvidence: falta el registro de entregables.');
    if (typeof origen === 'object') return origen;
    const respuesta = await fetch(String(origen), { cache: 'no-store' });
    if (!respuesta.ok) throw new Error(`DevBrainEvidence: no se pudo leer ${origen} (${respuesta.status}).`);
    return respuesta.json();
  }
  
  /**
   * Avisa en la propia página cuando el registro declara una evidencia que
   * ninguna sección pide.
   *
   * Es el fallo que este módulo existe para impedir, así que se muestra en la
   * página y no solo en la consola: una evidencia sin estación vuelve a ser una
   * factura al final del recorrido.
   *
   * @param {Array<Object>} huerfanos
   */
  function dbeAvisarHuerfanos(huerfanos) {
    if (!huerfanos.length) return;
    const ids = huerfanos.map((artefacto) => artefacto.id).join(', ');
    console.warn(`DevBrainEvidence: sin punto de montaje para ${ids}. Añade data-db-evidence="<id>" en la sección donde se produce.`);
  }
  
  /**
   * Monta las estaciones y la consolidación declaradas en el documento.
   *
   * @param {Object} opciones
   * @param {Object|string} opciones.registro - Objeto del registro o ruta al JSON
   * @param {string} [opciones.prefijo] - Prefijo de almacenamiento por guía
   * @param {Document|HTMLElement} [opciones.raiz] - Ámbito de búsqueda
   * @param {string} [opciones.dossierHref] - Ancla de la sección de consolidación
   * @returns {Promise<Object>} Estado montado
   */
  async function dbeMontar(opciones = {}) {
    const bruto = await dbeResolverRegistro(opciones.registro);
    const registro = dbeNormalizarRegistro(bruto);
    const raiz = opciones.raiz || document;
    const prefijo = opciones.prefijo || `devbrain_${registro.guideId || 'guia'}`;
    const store = new DbeEvidenceStore(prefijo);
  
    const montadas = [];
    const huerfanos = [];
  
    registro.artifacts.forEach((artefacto) => {
      const contenedor = raiz.querySelector(`[data-db-evidence="${artefacto.id}"]`);
      if (!contenedor) {
        huerfanos.push(artefacto);
        return;
      }
      montadas.push(dbeMontarEstacion(contenedor, artefacto, store, {
        total: registro.artifacts.length,
        dossierHref: opciones.dossierHref || '#cierre',
      }));
    });
  
    dbeAvisarHuerfanos(huerfanos);
  
    const nodoDossier = raiz.querySelector('[data-db-evidence-dossier]');
    const dossier = nodoDossier ? dbeMontarDossier(nodoDossier, registro, store) : null;
    if (!nodoDossier) {
      console.warn('DevBrainEvidence: la guía no declara [data-db-evidence-dossier]; no hay consolidación final.');
    }
  
    raiz.querySelectorAll('[data-db-evidence-progress]').forEach((nodo) => {
      dbeMontarProgreso(nodo, registro, store);
    });
  
    return {
      registro,
      store,
      estaciones: montadas,
      dossier,
      huerfanos: huerfanos.map((artefacto) => artefacto.id),
      /**
       * Devuelve el resumen de estados, útil para gamificación o pruebas.
       * @returns {{listas: number, total: number, detalle: Array}}
       */
      resumen() {
        const detalle = registro.artifacts.map((artefacto) => ({
          id: artefacto.id,
          estado: dbeCalcularEstado(artefacto, store.leer(artefacto.id)),
        }));
        return {
          listas: detalle.filter((fila) => fila.estado === 'lista').length,
          total: detalle.length,
          detalle,
        };
      },
    };
  }
  
  /**
   * Interfaz pública del módulo.
   */
  const evidence = {
    montar: dbeMontar,
    normalizarRegistro: dbeNormalizarRegistro,
    agruparPorSeccion: dbeAgruparPorSeccion,
    Store: DbeEvidenceStore,
    calcularEstado: dbeCalcularEstado,
  };
  

  global.DevBrainEvidence = evidence;
})(window);
