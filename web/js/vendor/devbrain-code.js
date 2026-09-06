/* DevBrain · bloques de código para guías. Generado por bundle.cjs. */
(function (global) {
  /* --- code/tokenizer.js --- */
  /**
   * Motor de tokenización genérico para bloques de código de las guías.
   *
   * No usa dependencias externas: las guías deben resaltar código sin conexión y
   * sin CDN. Un CDN caído deja al aprendiz con un muro de texto gris, y el
   * estándar educativo exige que el aprendizaje central funcione sin proveedor.
   *
   * Una gramática es una lista ordenada de reglas `{ t, re }` con expresiones
   * regulares ancladas (`y`). Gana la primera que casa en la posición actual, así
   * que el orden de la lista ES la precedencia: comentarios y cadenas primero,
   * porque dentro de ellos ninguna otra regla debe aplicarse.
   */
  
  /**
   * Recorre el texto y devuelve la lista plana de tokens.
   * Lo que ninguna regla reconoce se acumula como `plain` en lugar de perderse.
   */
  function tokenize(codigo, gramatica) {
    const reglas = (gramatica && gramatica.rules) || [];
    const tokens = [];
    const n = codigo.length;
    let i = 0;
    let sueltoDesde = -1;
  
    function cerrarSuelto(hasta) {
      if (sueltoDesde < 0) return;
      tokens.push({ type: 'plain', text: codigo.slice(sueltoDesde, hasta) });
      sueltoDesde = -1;
    }
  
    while (i < n) {
      let encontrado = null;
  
      for (let r = 0; r < reglas.length; r++) {
        const regla = reglas[r];
        regla.re.lastIndex = i;
        const m = regla.re.exec(codigo);
        if (m && m.index === i && m[0].length > 0) {
          encontrado = { type: regla.t, text: m[0] };
          break;
        }
      }
  
      if (encontrado) {
        cerrarSuelto(i);
        tokens.push(encontrado);
        i += encontrado.text.length;
      } else {
        if (sueltoDesde < 0) sueltoDesde = i;
        i++;
      }
    }
  
    cerrarSuelto(n);
    return tokens;
  }
  
  /**
   * Reparte los tokens por línea física.
   *
   * Un token puede abarcar varias líneas (comentario de bloque, cadena triple de
   * Python, plantilla de JavaScript). Se parte conservando su tipo, porque el
   * renderizador pinta línea a línea y necesita que cada trozo siga sabiendo que
   * es una cadena.
   */
  function repartirPorLineas(tokens) {
    const lineas = [[]];
  
    tokens.forEach(function (tk) {
      const partes = String(tk.text).split('\n');
      partes.forEach(function (parte, idx) {
        if (idx > 0) lineas.push([]);
        if (parte) lineas[lineas.length - 1].push({ type: tk.type, text: parte });
      });
    });
  
    return lineas;
  }
  

  /* --- code/languages/comunes.js --- */
  /**
   * Piezas de gramática que repiten casi todos los lenguajes.
   *
   * Se factorizan aquí para que añadir un lenguaje nuevo sea declarar su lista de
   * palabras clave, no volver a escribir el reconocimiento de cadenas ni números.
   */
  
  /** Une palabras en una alternancia anclada con frontera de palabra. */
  function palabras(lista) {
    const orden = lista.slice().sort(function (a, b) { return b.length - a.length; });
    return new RegExp(String.raw`\b(?:` + orden.join('|') + String.raw`)\b`, 'y');
  }
  
  /** Cadenas de comillas simples y dobles que no cruzan línea. */
  const CADENA_SIMPLE = [
    { t: 'string', re: new RegExp('"(?:\\\\.|[^"\\\\\\n])*"', 'y') },
    { t: 'string', re: new RegExp("'(?:\\\\.|[^'\\\\\\n])*'", 'y') }
  ];
  
  /** Enteros, decimales, notación científica, hexadecimal y binario. */
  const NUMERO = {
    t: 'number',
    re: /\b(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?)\b/y
  };
  
  /** Identificador seguido de paréntesis: llamada o declaración de función. */
  const LLAMADA = { t: 'function', re: /\b[A-Za-z_$][\w$]*(?=\s*\()/y };
  
  /** Identificador en mayúscula inicial: por convención, un tipo o una clase. */
  const TIPO = { t: 'type', re: /\b[A-Z][A-Za-z0-9_]*\b/y };
  
  /** Operadores y signos de puntuación, en ese orden para no partir `=>` ni `==`. */
  const SIGNOS = [
    { t: 'operator', re: /(?:=>|===|!==|<=>|\?\?=|\*\*=|\/\/=|<<=|>>=|&&=|\|\|=|\?\?|\.\.\.|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|%=|\|=|&=|\^=|->|::|\?\.|\*\*|\/\/)/y },
    { t: 'operator', re: /[=+\-*/%<>!&|^~?:]/y },
    { t: 'punct', re: /[{}()[\];,.@#]/y }
  ];
  
  /** Ensambla una gramática con el orden de precedencia correcto ya resuelto. */
  function gramatica(config) {
    return {
      name: config.name,
      label: config.label,
      family: config.family || 'curly',
      indentUnit: config.indentUnit || 4,
      rules: []
        .concat(config.comentarios || [])
        .concat(config.cadenas || CADENA_SIMPLE)
        .concat(config.previas || [])
        .concat(config.control ? [{ t: 'control', re: palabras(config.control) }] : [])
        .concat(config.claves ? [{ t: 'keyword', re: palabras(config.claves) }] : [])
        .concat(config.literales ? [{ t: 'literal', re: palabras(config.literales) }] : [])
        .concat(config.nativos ? [{ t: 'builtin', re: palabras(config.nativos) }] : [])
        .concat([NUMERO])
        .concat(config.sinLlamada ? [] : [LLAMADA])
        .concat(config.sinTipo ? [] : [TIPO])
        .concat(config.posteriores || [])
        .concat(SIGNOS)
    };
  }
  

  /* --- code/languages/llaves.js --- */
  /**
   * Lenguajes de llaves: JavaScript, TypeScript, JSX, Dart y Java.
   *
   * Comparten estructura de bloque `{ … }`, así que el detector de estructura los
   * trata igual; lo único que cambia es el vocabulario.
   */
  
  const COMENTARIOS_C = [
    { t: 'comment', re: /\/\*[\s\S]*?\*\//y },
    { t: 'comment', re: /\/\/[^\n]*/y }
  ];
  
  const CONTROL_C = [
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break',
    'continue', 'return', 'throw', 'try', 'catch', 'finally', 'yield', 'await'
  ];
  
  /* Plantilla de JavaScript. Se construye desde una cadena cruda porque la
     expresión mezcla acento grave, barra invertida y `${…}`: escrita como literal
     de expresión regular es ilegible y fácil de romper al editar. */
  const PLANTILLA_JS = {
    t: 'string',
    re: new RegExp(String.raw`\x60(?:\\.|\$\{[^}]*\}|[^\x60\\])*\x60`, 'y')
  };
  
  const javascript = gramatica({
    name: 'javascript',
    label: 'JavaScript',
    indentUnit: 2,
    comentarios: COMENTARIOS_C,
    cadenas: [PLANTILLA_JS].concat(CADENA_SIMPLE),
    control: CONTROL_C,
    claves: [
      'const', 'let', 'var', 'function', 'class', 'extends', 'new', 'delete',
      'typeof', 'instanceof', 'in', 'of', 'async', 'import', 'export', 'from',
      'as', 'static', 'get', 'set', 'this', 'super', 'void'
    ],
    literales: ['true', 'false', 'null', 'undefined', 'NaN'],
    nativos: [
      'console', 'document', 'window', 'Math', 'JSON', 'Object', 'Array',
      'Promise', 'Map', 'Set', 'Number', 'String', 'Boolean', 'Error'
    ]
  });
  
  const typescript = gramatica({
    name: 'typescript',
    label: 'TypeScript',
    indentUnit: 2,
    comentarios: COMENTARIOS_C,
    cadenas: [PLANTILLA_JS].concat(CADENA_SIMPLE),
    control: CONTROL_C,
    claves: [
      'const', 'let', 'var', 'function', 'class', 'interface', 'type', 'enum',
      'implements', 'extends', 'new', 'typeof', 'keyof', 'instanceof', 'in',
      'of', 'async', 'import', 'export', 'from', 'as', 'static', 'readonly',
      'public', 'private', 'protected', 'abstract', 'declare', 'this', 'super'
    ],
    literales: ['true', 'false', 'null', 'undefined'],
    nativos: ['string', 'number', 'boolean', 'any', 'unknown', 'never', 'void', 'console', 'Promise']
  });
  
  const dart = gramatica({
    name: 'dart',
    label: 'Dart',
    indentUnit: 2,
    comentarios: COMENTARIOS_C,
    cadenas: [
      { t: 'string', re: /r?'''[\s\S]*?'''/y },
      { t: 'string', re: /r?"""[\s\S]*?"""/y }
    ].concat(CADENA_SIMPLE),
    previas: [{ t: 'decorator', re: /@[A-Za-z_]\w*/y }],
    control: CONTROL_C.concat(['rethrow']),
    claves: [
      'class', 'extends', 'implements', 'with', 'mixin', 'abstract', 'enum',
      'final', 'const', 'var', 'late', 'static', 'factory', 'new', 'this',
      'super', 'get', 'set', 'async', 'sync', 'import', 'export', 'library',
      'part', 'show', 'hide', 'required', 'covariant', 'operator', 'typedef', 'is', 'as'
    ],
    literales: ['true', 'false', 'null'],
    nativos: ['int', 'double', 'num', 'bool', 'String', 'List', 'Map', 'Set', 'Future', 'Stream', 'void', 'dynamic', 'print']
  });
  
  const java = gramatica({
    name: 'java',
    label: 'Java',
    indentUnit: 4,
    comentarios: COMENTARIOS_C,
    previas: [{ t: 'decorator', re: /@[A-Za-z_]\w*/y }],
    control: CONTROL_C,
    claves: [
      'class', 'interface', 'enum', 'record', 'extends', 'implements', 'package',
      'import', 'public', 'private', 'protected', 'static', 'final', 'abstract',
      'synchronized', 'transient', 'volatile', 'native', 'new', 'this', 'super',
      'instanceof', 'throws', 'var'
    ],
    literales: ['true', 'false', 'null'],
    nativos: ['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'void', 'String', 'List', 'Map', 'Optional', 'System']
  });
  
  const csharpLike = { javascript: javascript, typescript: typescript, dart: dart, java: java };
  

  /* --- code/languages/indentados.js --- */
  /**
   * Lenguajes cuya estructura la marca la indentación: Python y YAML.
   *
   * Para estos el detector de estructura no cuenta llaves: compara sangrías. Por
   * eso `family: 'indent'` no es una etiqueta cosmética, decide el algoritmo.
   */
  
  const CADENAS_PY = [
    { t: 'string', re: /[rbfuRBFU]{0,2}"""[\s\S]*?"""/y },
    { t: 'string', re: /[rbfuRBFU]{0,2}'''[\s\S]*?'''/y },
    { t: 'string', re: new RegExp('[rbfuRBFU]{0,2}"(?:\\\\.|[^"\\\\\\n])*"', 'y') },
    { t: 'string', re: new RegExp("[rbfuRBFU]{0,2}'(?:\\\\.|[^'\\\\\\n])*'", 'y') }
  ];
  
  const python = gramatica({
    name: 'python',
    label: 'Python',
    family: 'indent',
    indentUnit: 4,
    comentarios: [{ t: 'comment', re: /#[^\n]*/y }],
    cadenas: CADENAS_PY,
    previas: [{ t: 'decorator', re: /@[A-Za-z_][\w.]*/y }],
    control: [
      'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'return',
      'try', 'except', 'finally', 'raise', 'with', 'yield', 'await', 'match', 'case', 'pass'
    ],
    claves: [
      'def', 'class', 'lambda', 'async', 'import', 'from', 'as', 'global',
      'nonlocal', 'assert', 'del', 'in', 'is', 'not', 'and', 'or', 'self', 'cls'
    ],
    literales: ['True', 'False', 'None'],
    nativos: [
      'print', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 'dict',
      'set', 'tuple', 'super', 'isinstance', 'enumerate', 'zip', 'open',
      'sorted', 'sum', 'min', 'max', 'any', 'all', 'type'
    ]
  });
  
  const yaml = {
    name: 'yaml',
    label: 'YAML',
    family: 'indent',
    indentUnit: 2,
    rules: [
      { t: 'comment', re: /#[^\n]*/y },
      { t: 'property', re: /^[ \t]*-?[ \t]*[A-Za-z_][\w.-]*(?=\s*:)/my },
      CADENA_SIMPLE[0],
      CADENA_SIMPLE[1],
      { t: 'literal', re: /\b(?:true|false|null|yes|no|on|off)\b/iy },
      { t: 'number', re: /\b\d[\d_]*(?:\.\d+)?\b/y },
      { t: 'operator', re: /[-|>&*]/y },
      { t: 'punct', re: /[:{}[\],]/y }
    ]
  };
  

  /* --- code/languages/datos.js --- */
  /**
   * Formatos de datos y de consola: JSON, SQL, Bash, PowerShell, HTTP,
   * properties/env y texto plano.
   *
   * Ninguno de ellos declara funciones, así que casi todos se marcan
   * `family: 'flat'`: el detector de estructura no intenta encontrar bloques
   * donde no los hay, y así no dibuja rieles falsos.
   */
  
  const json = {
    name: 'json',
    label: 'JSON',
    family: 'flat',
    indentUnit: 2,
    rules: [
      { t: 'property', re: /"(?:\\.|[^"\\])*"(?=\s*:)/y },
      { t: 'string', re: /"(?:\\.|[^"\\])*"/y },
      { t: 'literal', re: /\b(?:true|false|null)\b/y },
      { t: 'number', re: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y },
      { t: 'punct', re: /[{}[\]:,]/y }
    ]
  };
  
  const sql = gramatica({
    name: 'sql',
    label: 'SQL',
    family: 'flat',
    indentUnit: 2,
    comentarios: [
      { t: 'comment', re: /--[^\n]*/y },
      { t: 'comment', re: /\/\*[\s\S]*?\*\//y }
    ],
    control: [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON',
      'GROUP', 'ORDER', 'BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'WITH',
      'CASE', 'WHEN', 'THEN', 'END', 'ELSE', 'RETURNING'
    ],
    claves: [
      'CREATE', 'TABLE', 'ALTER', 'DROP', 'INSERT', 'INTO', 'VALUES', 'UPDATE',
      'SET', 'DELETE', 'INDEX', 'VIEW', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
      'CONSTRAINT', 'NOT', 'DEFAULT', 'AS', 'AND', 'OR', 'IN', 'IS', 'DISTINCT',
      'CASCADE', 'UNIQUE', 'EXISTS', 'BEGIN', 'COMMIT', 'ROLLBACK'
    ],
    literales: ['NULL', 'TRUE', 'FALSE'],
    nativos: [
      'INTEGER', 'SERIAL', 'BIGINT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'TIMESTAMP',
      'DATE', 'NUMERIC', 'UUID', 'JSONB', 'COUNT', 'SUM', 'AVG', 'NOW', 'COALESCE'
    ],
    sinTipo: true
  });
  
  const bash = {
    name: 'bash',
    label: 'Bash',
    family: 'flat',
    indentUnit: 2,
    rules: [
      { t: 'comment', re: /#[^\n]*/y },
      { t: 'string', re: /"(?:\\.|[^"\\])*"/y },
      { t: 'string', re: /'[^']*'/y },
      { t: 'control', re: palabras(['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'return', 'exit']) },
      { t: 'keyword', re: palabras(['function', 'export', 'source', 'local', 'set', 'cd', 'sudo']) },
      { t: 'builtin', re: palabras(['echo', 'cat', 'grep', 'curl', 'git', 'npm', 'npx', 'pip', 'python', 'docker', 'uvicorn', 'pytest', 'flutter', 'mvn', 'java', 'psql', 'alembic']) },
      { t: 'variable', re: /\$\{?[A-Za-z_]\w*\}?/y },
      { t: 'operator', re: /(?:&&|\|\||>>|[|><=])/y },
      { t: 'number', re: /\b\d+\b/y },
      { t: 'punct', re: /[-{}()[\];,]/y }
    ]
  };
  
  const powershell = {
    name: 'powershell',
    label: 'PowerShell',
    family: 'curly',
    indentUnit: 4,
    rules: [
      { t: 'comment', re: /<#[\s\S]*?#>/y },
      { t: 'comment', re: /#[^\n]*/y },
      { t: 'string', re: /"(?:`.|[^"`])*"/y },
      { t: 'string', re: /'[^']*'/y },
      { t: 'control', re: palabras(['if', 'else', 'elseif', 'foreach', 'for', 'while', 'switch', 'try', 'catch', 'finally', 'return', 'break', 'continue', 'throw']) },
      { t: 'keyword', re: palabras(['function', 'param', 'begin', 'process', 'end', 'class', 'filter']) },
      { t: 'builtin', re: /\b[A-Z][a-z]+-[A-Z][A-Za-z]+\b/y },
      { t: 'variable', re: /\$[A-Za-z_][\w:]*/y },
      { t: 'decorator', re: /(?<=\s)-[A-Za-z]\w*/y },
      { t: 'number', re: /\b\d+\b/y },
      { t: 'operator', re: /[|=+><]/y },
      { t: 'punct', re: /[{}()[\];,.]/y }
    ]
  };
  
  const http = {
    name: 'http',
    label: 'HTTP',
    family: 'flat',
    indentUnit: 2,
    rules: [
      { t: 'keyword', re: /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/my },
      { t: 'property', re: /^[A-Za-z][\w-]*(?=:)/my },
      { t: 'control', re: /\bHTTP\/[\d.]+\b/y },
      { t: 'string', re: /"(?:\\.|[^"\\])*"/y },
      { t: 'number', re: /\b\d+\b/y },
      { t: 'punct', re: /[:{}[\],/?&=]/y }
    ]
  };
  
  const properties = {
    name: 'properties',
    label: 'Properties',
    family: 'flat',
    indentUnit: 2,
    rules: [
      { t: 'comment', re: /[#;][^\n]*/y },
      { t: 'property', re: /^[ \t]*[A-Za-z_][\w.-]*(?=\s*=)/my },
      { t: 'variable', re: /\$\{[^}]*\}/y },
      { t: 'operator', re: /=/y },
      { t: 'literal', re: /\b(?:true|false)\b/y },
      { t: 'number', re: /\b\d+\b/y }
    ]
  };
  
  const texto = {
    name: 'text',
    label: 'Texto',
    family: 'flat',
    indentUnit: 2,
    rules: []
  };
  
  

  /* --- code/languages/marcado.js --- */
  /**
   * Lenguajes de marcado y estilo: HTML, XML y CSS.
   *
   * En HTML la unidad legible no es la función sino la etiqueta, así que se
   * resaltan por separado el nombre de etiqueta, el atributo y su valor: el
   * aprendiz necesita distinguir de un vistazo qué es estructura y qué es dato.
   */
  
  const html = {
    name: 'html',
    label: 'HTML',
    family: 'markup',
    indentUnit: 2,
    rules: [
      { t: 'comment', re: /<!--[\s\S]*?-->/y },
      { t: 'meta', re: /<!DOCTYPE[^>]*>/iy },
      { t: 'tag', re: /<\/?[A-Za-z][\w-]*/y },
      { t: 'string', re: /"(?:[^"]*)"/y },
      { t: 'string', re: /'(?:[^']*)'/y },
      { t: 'property', re: /\b[A-Za-z_:][\w:.-]*(?=\s*=)/y },
      { t: 'punct', re: /\/?>/y },
      { t: 'operator', re: /=/y }
    ]
  };
  
  const xml = {
    name: 'xml',
    label: 'XML',
    family: 'markup',
    indentUnit: 2,
    rules: html.rules
  };
  
  const css = {
    name: 'css',
    label: 'CSS',
    family: 'curly',
    indentUnit: 2,
    rules: [
      { t: 'comment', re: /\/\*[\s\S]*?\*\//y },
      { t: 'decorator', re: /@[A-Za-z-]+/y },
      { t: 'string', re: /"(?:[^"]*)"/y },
      { t: 'string', re: /'(?:[^']*)'/y },
      { t: 'variable', re: /--[A-Za-z][\w-]*/y },
      { t: 'property', re: /\b[a-z-]+(?=\s*:)/y },
      { t: 'builtin', re: /\b[a-z-]+(?=\()/y },
      { t: 'number', re: /-?\b\d*\.?\d+(?:px|rem|em|%|vh|vw|ch|s|ms|deg|fr)?\b/y },
      { t: 'type', re: /#[0-9a-fA-F]{3,8}\b/y },
      { t: 'tag', re: /(?:\.|#)[A-Za-z][\w-]*/y },
      { t: 'punct', re: /[{}();:,]/y },
      { t: 'operator', re: /[>~+*]/y }
    ]
  };
  
  const mermaid = {
    name: 'mermaid',
    label: 'Mermaid',
    family: 'flat',
    indentUnit: 2,
    rules: [
      { t: 'comment', re: /%%[^\n]*/y },
      { t: 'keyword', re: /\b(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|subgraph|end|participant|actor|note|style|classDef)\b/y },
      { t: 'string', re: /"(?:[^"]*)"/y },
      { t: 'operator', re: /(?:-->|---|-\.->|==>|->>|-->>|[|>])/y },
      { t: 'punct', re: /[[\]{}()]/y }
    ]
  };
  

  /* --- code/languages/index.js --- */
  /**
   * Registro de gramáticas y resolución de alias.
   *
   * Las guías escriben el lenguaje a mano (`py`, `python`, `Python 3`), así que
   * la resolución normaliza antes de buscar. Cuando no hay coincidencia se
   * devuelve la gramática de texto plano: un lenguaje desconocido debe verse sin
   * color, nunca romper el bloque.
   */
  
  
  
  
  const REGISTRO = {
    javascript: javascript,
    typescript: typescript,
    dart: dart,
    java: java,
    python: python,
    yaml: yaml,
    json: json,
    sql: sql,
    bash: bash,
    powershell: powershell,
    http: http,
    properties: properties,
    html: html,
    xml: xml,
    css: css,
    mermaid: mermaid,
    text: texto
  };
  
  const ALIAS = {
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    node: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    python3: 'python',
    flutter: 'dart',
    kotlin: 'java',
    kt: 'java',
    yml: 'yaml',
    postgres: 'sql',
    postgresql: 'sql',
    psql: 'sql',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    console: 'bash',
    terminal: 'bash',
    cmd: 'powershell',
    ps1: 'powershell',
    pwsh: 'powershell',
    env: 'properties',
    dotenv: 'properties',
    ini: 'properties',
    conf: 'properties',
    htm: 'html',
    jinja: 'html',
    jsp: 'html',
    vue: 'html',
    svg: 'xml',
    pom: 'xml',
    scss: 'css',
    rest: 'http',
    curl: 'bash',
    dockerfile: 'bash',
    plaintext: 'text',
    txt: 'text',
    output: 'text',
    salida: 'text'
  };
  
  /** Normaliza `Python 3`, `PY`, `.py` → `python`. */
  function normalizarLenguaje(valor) {
    const bruto = String(valor || '').trim().toLowerCase();
    if (!bruto) return 'text';
    const limpio = bruto.replace(/^[.#]/, '').replace(/[\s\d.]+$/, '').replace(/[^a-z0-9+-]/g, '');
    if (REGISTRO[limpio]) return limpio;
    if (ALIAS[limpio]) return ALIAS[limpio];
    return 'text';
  }
  
  /**
   * Deduce el lenguaje a partir de la ruta del archivo del encabezado.
   *
   * Varias guías declaran la ruta («app/main.py») pero no el lenguaje, porque
   * cuando se escribieron el bloque no coloreaba nada y el campo daba igual.
   * Rellenar el hueco aquí evita tener que editar cientos de bloques de datos
   * solo para recuperar un dato que ya estaba escrito en la ruta.
   */
  function lenguajeDesdeRuta(ruta) {
    const m = /\.([A-Za-z0-9]+)\s*$/.exec(String(ruta || '').split(/[\s·—-]/)[0] || '');
    if (!m) return '';
    const sufijo = m[1].toLowerCase();
    if (sufijo === 'md' || sufijo === 'markdown') return 'text';
    const resuelto = normalizarLenguaje(sufijo);
    return resuelto === 'text' ? '' : resuelto;
  }
  
  /** Devuelve la gramática de un lenguaje; nunca devuelve nulo. */
  function obtenerGramatica(valor) {
    return REGISTRO[normalizarLenguaje(valor)] || texto;
  }
  
  /** Etiqueta legible para la cabecera de la tarjeta. */
  function etiquetaLenguaje(valor) {
    return obtenerGramatica(valor).label;
  }
  
  /** Lenguajes con gramática propia, para pruebas y para el validador. */
  function lenguajesSoportados() {
    return Object.keys(REGISTRO);
  }
  

  /* --- code/structure.js --- */
  /**
   * Detección de ámbitos: dónde empieza y dónde termina cada función o clase.
   *
   * Es la pieza que resuelve el problema pedagógico real. Un aprendiz que ve
   * treinta líneas de colores sigue sin saber qué pertenece a `list_equipment` y
   * qué ya es la función siguiente. Aquí se calculan esos límites para que el
   * renderizador pueda dibujarlos.
   *
   * Dos estrategias según la familia del lenguaje:
   *   indent → se comparan sangrías (Python, YAML)
   *   curly  → se cuentan llaves sobre el flujo de tokens, no sobre el texto, así
   *            una llave dentro de una cadena o de un comentario no descuadra el
   *            conteo.
   */
  
  const ENCABEZADOS_INDENT = [
    { re: /^(\s*)(?:async\s+)?def\s+([A-Za-z_]\w*)/, tipo: 'funcion' },
    { re: /^(\s*)class\s+([A-Za-z_]\w*)/, tipo: 'clase' }
  ];
  
  const ENCABEZADOS_LLAVES = [
    { re: /\b(?:class|interface|enum|mixin|record|abstract\s+class)\s+([A-Za-z_]\w*)/, tipo: 'clase' },
    { re: /\bfunction\s+\*?\s*([A-Za-z_$][\w$]*)/i, tipo: 'funcion' },
    { re: /\b(?:const|let|var|final)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function|\()/, tipo: 'funcion' },
    { re: /^\s*(?:@\w+\s+)*(?:public|private|protected|static|final|async|override|external)?[\w<>,[\]?.\s]*?\b([A-Za-z_$][\w$]*)\s*\([^;]*\)\s*(?:async\s*)?(?:\{|=>)/, tipo: 'metodo' }
  ];
  
  /** Cuenta los espacios iniciales tratando el tabulador como una unidad. */
  function sangria(linea, unidad) {
    const m = /^[ \t]*/.exec(linea)[0];
    let ancho = 0;
    for (let i = 0; i < m.length; i++) ancho += m[i] === '\t' ? unidad : 1;
    return ancho;
  }
  
  /** Ámbitos por sangría: el cuerpo es todo lo que queda más adentro. */
  function ambitosPorSangria(lineas, unidad) {
    const ambitos = [];
  
    lineas.forEach(function (linea, idx) {
      for (let e = 0; e < ENCABEZADOS_INDENT.length; e++) {
        const m = ENCABEZADOS_INDENT[e].re.exec(linea);
        if (!m) continue;
  
        const base = sangria(linea, unidad);
        let fin = idx;
        for (let j = idx + 1; j < lineas.length; j++) {
          if (!lineas[j].trim()) continue;
          if (sangria(lineas[j], unidad) <= base) break;
          fin = j;
        }
  
        // Los decoradores pegados encima pertenecen a la definición.
        let inicio = idx;
        while (inicio > 0 && /^\s*@[\w.]/.test(lineas[inicio - 1])) inicio--;
  
        if (fin > idx) {
          ambitos.push({ inicio: inicio, cabecera: idx, fin: fin, tipo: ENCABEZADOS_INDENT[e].tipo, nombre: m[2] });
        }
        break;
      }
    });
  
    return ambitos;
  }
  
  /** Profundidad de llaves al inicio y al final de cada línea, según los tokens. */
  function profundidades(lineasTokens) {
    const marcas = [];
    let nivel = 0;
  
    lineasTokens.forEach(function (tokens) {
      const antes = nivel;
      tokens.forEach(function (tk) {
        if (tk.type === 'string' || tk.type === 'comment') return;
        for (let i = 0; i < tk.text.length; i++) {
          if (tk.text[i] === '{') nivel++;
          else if (tk.text[i] === '}') nivel = Math.max(0, nivel - 1);
        }
      });
      marcas.push({ antes: antes, despues: nivel });
    });
  
    return marcas;
  }
  
  /** Ámbitos por llaves: el cuerpo termina donde la profundidad vuelve a su valor. */
  function ambitosPorLlaves(lineas, lineasTokens) {
    const marcas = profundidades(lineasTokens);
    const ambitos = [];
  
    lineas.forEach(function (linea, idx) {
      const marca = marcas[idx];
      if (!marca || marca.despues <= marca.antes) return;
      if (/^\s*(?:if|for|while|switch|catch|else|try|do)\b/.test(linea)) return;
  
      for (let e = 0; e < ENCABEZADOS_LLAVES.length; e++) {
        const m = ENCABEZADOS_LLAVES[e].re.exec(linea);
        if (!m || !m[1]) continue;
  
        let fin = idx;
        for (let j = idx + 1; j < lineas.length; j++) {
          fin = j;
          if (marcas[j].despues <= marca.antes) break;
        }
  
        let inicio = idx;
        while (inicio > 0 && /^\s*@[\w.]/.test(lineas[inicio - 1])) inicio--;
  
        if (fin > idx) {
          ambitos.push({ inicio: inicio, cabecera: idx, fin: fin, tipo: ENCABEZADOS_LLAVES[e].tipo, nombre: m[1] });
        }
        break;
      }
    });
  
    return ambitos;
  }
  
  /**
   * Devuelve los ámbitos ordenados y con su nivel de anidamiento calculado, para
   * que el renderizador sepa cuántos rieles dibujar sin volver a recorrer nada.
   */
  function detectarAmbitos(lineas, lineasTokens, gramatica) {
    const familia = (gramatica && gramatica.family) || 'flat';
    let ambitos = [];
  
    if (familia === 'indent') ambitos = ambitosPorSangria(lineas, gramatica.indentUnit || 4);
    else if (familia === 'curly') ambitos = ambitosPorLlaves(lineas, lineasTokens);
  
    ambitos.sort(function (a, b) { return a.inicio - b.inicio || b.fin - a.fin; });
  
    ambitos.forEach(function (amb, i) {
      let nivel = 0;
      for (let j = 0; j < i; j++) {
        if (ambitos[j].inicio <= amb.inicio && ambitos[j].fin >= amb.fin) nivel++;
      }
      amb.nivel = nivel;
    });
  
    return ambitos;
  }
  
  

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
  

  /* --- code/render-line.js --- */
  /**
   * Construcción de una línea de código.
   *
   * Cada línea es un `<li>` con tres zonas fijas: número, rieles de ámbito y
   * texto. Las tres son columnas reales, no adornos: el número permite que el
   * instructor diga «mira la línea 14», los rieles muestran a qué función
   * pertenece la línea, y la sangría se dibuja aparte para que se vea el nivel de
   * anidamiento incluso cuando la línea está vacía de contenido visible.
   */
  
  /** Separa la sangría inicial del resto de tokens sin alterar el texto. */
  function partirSangria(tokens) {
    const copia = tokens.slice();
    let sangria = '';
  
    while (copia.length) {
      const tk = copia[0];
      const m = /^[ \t]+/.exec(tk.text);
      if (!m) break;
      sangria += m[0];
      if (m[0].length === tk.text.length) copia.shift();
      else { copia[0] = { type: tk.type, text: tk.text.slice(m[0].length) }; break; }
    }
  
    return { sangria: sangria, resto: copia };
  }
  
  function span(clase, texto) {
    const el = document.createElement('span');
    el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }
  
  /**
   * Rieles verticales, uno por ámbito abierto en esta línea.
   * `ini` dibuja la esquina de apertura, `fin` la de cierre y `med` el tramo
   * intermedio: el aprendiz ve el bloque completo sin contar sangrías a mano.
   */
  function rieles(indice, ambitos) {
    const frag = document.createDocumentFragment();
  
    ambitos.forEach(function (amb) {
      if (indice < amb.inicio || indice > amb.fin) return;
      let pos = 'med';
      if (indice <= amb.cabecera) pos = 'ini';
      else if (indice === amb.fin) pos = 'fin';
  
      const riel = span('dbc__riel');
      riel.dataset.pos = pos;
      riel.dataset.tipo = amb.tipo;
      riel.setAttribute('aria-hidden', 'true');
      frag.appendChild(riel);
    });
  
    return frag;
  }
  
  /**
   * Devuelve el `<li>` de una línea.
   *
   * `opciones.resaltadas` recibe el conjunto de números de línea que la guía
   * quiere destacar; se marcan con fondo y con una marca en el margen, nunca solo
   * con color, para no depender de la percepción cromática.
   */
  function construirLinea(numero, tokens, contexto) {
    const li = document.createElement('li');
    li.className = 'dbc__linea';
    li.dataset.n = String(numero);
  
    const partes = partirSangria(tokens);
    const unidad = contexto.indentUnit || 2;
  
    // El número lo pinta CSS con `content: attr(data-n)`, no un `<span>`.
    // Como nodo real acabaría dentro de cualquier `textContent` que alguien
    // leyera del bloque —empezando por los botones de copiar que ya existen en
    // varias guías—, y el aprendiz pegaría el código con los números incrustados.
    const canal = span('dbc__canal');
    canal.appendChild(rieles(numero - 1, contexto.ambitos));
    li.appendChild(canal);
  
    const cuerpo = span('dbc__txt');
  
    if (partes.sangria) {
      const ind = span('dbc__ind', partes.sangria);
      ind.style.setProperty('--dbc-unidad', String(unidad));
      cuerpo.appendChild(ind);
    }
  
    partes.resto.forEach(function (tk) {
      if (tk.type === 'plain') cuerpo.appendChild(document.createTextNode(tk.text));
      else cuerpo.appendChild(span('tk tk--' + tk.type, tk.text));
    });
  
    if (!partes.sangria && !partes.resto.length) cuerpo.appendChild(document.createTextNode('​'));
  
    li.appendChild(cuerpo);
  
    if (contexto.resaltadas && contexto.resaltadas.has(numero)) {
      li.classList.add('dbc__linea--foco');
    }
  
    const abre = contexto.ambitos.find(function (a) { return a.cabecera === numero - 1; });
    if (abre) {
      li.classList.add('dbc__linea--abre');
      li.dataset.ambito = abre.nombre;
    }
    const cierra = contexto.ambitos.find(function (a) { return a.fin === numero - 1; });
    if (cierra) li.classList.add('dbc__linea--cierra');
  
    return li;
  }
  

  /* --- code/render-block.js --- */
  /**
   * Tarjeta completa de un bloque de código.
   *
   * Orden fijo de arriba abajo: cabecera (lenguaje, archivo, tamaño, acciones),
   * cuerpo desplazable y, cuando el listado tiene varias funciones, un índice de
   * ámbitos. Ese índice es lo que convierte un listado largo en algo navegable:
   * dice qué funciones hay y en qué líneas viven, antes de leerlas.
   */
  
  
  
  
  
  /* Código fuente de cada bloque, para quien necesite recuperarlo íntegro.
     No se guarda en un atributo: un listado de 80 líneas dentro de `data-*`
     ensucia el DOM y se escapa mal. El mapa débil desaparece con el nodo. */
  const FUENTES = new WeakMap();
  
  function el(tag, clase, texto) {
    const nodo = document.createElement(tag);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }
  
  /** Acepta texto, arreglo de líneas o nulo; siempre devuelve texto sin saltos finales. */
  function normalizarTexto(entrada) {
    const bruto = Array.isArray(entrada) ? entrada.join('\n') : String(entrada == null ? '' : entrada);
    return bruto.replace(/\r\n?/g, '\n').replace(/\s+$/, '');
  }
  
  /** Ancho del canal de rieles: tantos caracteres como ámbitos lleguen a solaparse. */
  function anchoCanal(totalLineas, ambitos) {
    let maximo = 0;
    for (let i = 0; i < totalLineas; i++) {
      let activos = 0;
      for (let a = 0; a < ambitos.length; a++) {
        if (i >= ambitos[a].inicio && i <= ambitos[a].fin) activos++;
      }
      if (activos > maximo) maximo = activos;
    }
    return maximo;
  }
  
  function botonCopiar(codigo) {
    const boton = el('button', 'dbc__btn dbc__btn--copiar');
    boton.type = 'button';
    const etiqueta = el('span', 'dbc__btn-txt', 'Copiar');
    boton.appendChild(el('span', 'dbc__btn-icono', '⧉'));
    boton.appendChild(etiqueta);
    boton.setAttribute('aria-label', 'Copiar el código de este bloque');
  
    boton.addEventListener('click', function () {
      const fin = function (ok) {
        boton.classList.toggle('is-ok', ok);
        boton.classList.toggle('is-fail', !ok);
        etiqueta.textContent = ok ? 'Copiado' : 'No se pudo';
        setTimeout(function () {
          boton.classList.remove('is-ok', 'is-fail');
          etiqueta.textContent = 'Copiar';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codigo).then(function () { fin(true); }, function () { fin(false); });
      } else {
        fin(false);
      }
    });
  
    return boton;
  }
  
  /** Alterna entre desplazamiento horizontal y ajuste de línea, sin recargar nada. */
  function botonAjustar(figura) {
    const boton = el('button', 'dbc__btn dbc__btn--ajustar');
    boton.type = 'button';
    boton.setAttribute('aria-pressed', 'false');
    boton.appendChild(el('span', 'dbc__btn-icono', '↵'));
    boton.appendChild(el('span', 'dbc__btn-txt', 'Ajustar'));
    boton.title = 'Ajustar las líneas largas al ancho de la pantalla';
  
    boton.addEventListener('click', function () {
      const activo = figura.classList.toggle('dbc--ajustado');
      boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
  
    return boton;
  }
  
  /** Chips con el nombre y el rango de líneas de cada función o clase detectada. */
  function indiceAmbitos(ambitos, alSaltar) {
    const nav = el('nav', 'dbc__indice');
    nav.setAttribute('aria-label', 'Funciones y clases de este bloque');
    nav.appendChild(el('span', 'dbc__indice-rotulo', 'En este bloque:'));
  
    ambitos.forEach(function (amb) {
      const chip = el('button', 'dbc__chip');
      chip.type = 'button';
      chip.dataset.tipo = amb.tipo;
      chip.appendChild(el('span', 'dbc__chip-nombre', amb.nombre));
      chip.appendChild(el('span', 'dbc__chip-rango', 'líneas ' + (amb.cabecera + 1) + '–' + (amb.fin + 1)));
      chip.addEventListener('click', function () { alSaltar(amb); });
      nav.appendChild(chip);
    });
  
    return nav;
  }
  
  /**
   * Construye la tarjeta.
   *
   * @param {object} bloque  { texto|codigo, titulo|archivo, lenguaje|lang, resaltar }
   * @returns {HTMLElement}  la figura lista para insertar en el DOM
   */
  function construirBloqueCodigo(bloque) {
    const datos = bloque || {};
    const codigo = normalizarTexto(datos.texto != null ? datos.texto : datos.codigo != null ? datos.codigo : datos.code);
    const ruta = datos.titulo || datos.archivo || datos.file || datos.path || '';
    const declarado = normalizarLenguaje(datos.lenguaje || datos.lang || datos.language);
    const lenguaje = declarado !== 'text' ? declarado : (lenguajeDesdeRuta(ruta) || 'text');
    const gramatica = obtenerGramatica(lenguaje);
  
    const lineas = codigo.split('\n');
    const lineasTokens = repartirPorLineas(tokenize(codigo, gramatica));
    while (lineasTokens.length < lineas.length) lineasTokens.push([]);
    const ambitos = detectarAmbitos(lineas, lineasTokens, gramatica);
  
    const figura = el('figure', 'dbc');
    figura.dataset.lang = lenguaje;
  
    // Las dos columnas fijas se miden aquí, no en CSS: su ancho depende de los
    // datos (cuántos dígitos tiene el número mayor, cuántos ámbitos se solapan).
    // Si variaran por línea, el código no arrancaría en la misma columna.
    figura.style.setProperty('--dbc-num-w', String(lineas.length).length + 'ch');
    figura.style.setProperty('--dbc-canal-w', anchoCanal(lineas.length, ambitos) + 'ch');
  
    const cabeza = el('figcaption', 'dbc__cabeza');
    cabeza.appendChild(el('span', 'dbc__lenguaje', etiquetaLenguaje(lenguaje)));
    if (ruta) {
      const p = el('code', 'dbc__ruta', ruta);
      cabeza.appendChild(p);
    }
    cabeza.appendChild(el('span', 'dbc__tam', lineas.length + (lineas.length === 1 ? ' línea' : ' líneas')));
    const acciones = el('span', 'dbc__acciones');
    acciones.appendChild(botonAjustar(figura));
    acciones.appendChild(botonCopiar(codigo));
    cabeza.appendChild(acciones);
    figura.appendChild(cabeza);
  
    const resaltadas = new Set(Array.isArray(datos.resaltar) ? datos.resaltar.map(Number) : []);
    const contexto = { ambitos: ambitos, indentUnit: gramatica.indentUnit || 2, resaltadas: resaltadas };
  
    const scroll = el('div', 'dbc__scroll');
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', ruta ? 'Código de ' + ruta : 'Bloque de código en ' + etiquetaLenguaje(lenguaje));
  
    const lista = el('ol', 'dbc__codigo');
    lineas.forEach(function (_, i) {
      lista.appendChild(construirLinea(i + 1, lineasTokens[i] || [], contexto));
    });
    scroll.appendChild(lista);
    figura.appendChild(scroll);
  
    if (ambitos.length >= 2) {
      figura.appendChild(indiceAmbitos(ambitos, function (amb) {
        const destino = lista.children[amb.cabecera];
        if (!destino) return;
        destino.scrollIntoView({ block: 'center', behavior: 'smooth' });
        destino.classList.add('dbc__linea--senalada');
        setTimeout(function () { destino.classList.remove('dbc__linea--senalada'); }, 1600);
      }));
    }
  
    FUENTES.set(figura, codigo);
    seguirTema(figura);
    return figura;
  }
  
  /** Código fuente exacto de un bloque ya construido, sin números ni adornos. */
  function codigoDe(figura) {
    return FUENTES.get(figura) || '';
  }
  
  /**
   * Sustituye un bloque por otro conservando su posición y su identificador.
   *
   * Existe por los simuladores: varias guías repintan un listado cada vez que el
   * aprendiz mueve un control, y lo hacían asignando `textContent` a un `<code>`
   * que guardaban en una variable. Ese nodo ya no existe cuando el bloque pasa a
   * ser una tarjeta, así que aquí se devuelve el nodo nuevo para que el llamador
   * lo reasigne.
   *
   * @param {Node} referencia  el bloque actual, o el `<pre>`/`<code>` original
   * @param {object} bloque    los mismos datos que acepta `construirBloqueCodigo`
   * @returns {HTMLElement|null} la figura nueva, ya insertada
   */
  function actualizarBloqueCodigo(referencia, bloque) {
    if (!referencia) return null;
  
    const anterior = (referencia.closest && referencia.closest('.dbc')) ||
      (referencia.closest && referencia.closest('pre')) || referencia;
    if (!anterior.parentNode) return null;
  
    const figura = construirBloqueCodigo(bloque);
  
    // El identificador puede estar en el `<pre>`, en el `<code>` de dentro o ya en
    // la tarjeta anterior. Las guías buscan su listado por ese id en cada
    // repintado, así que se recupera de donde esté y viaja con el bloque nuevo.
    const id = anterior.id || referencia.id ||
      (anterior.querySelector && anterior.querySelector('[id]') ? anterior.querySelector('[id]').id : '');
    if (id) figura.id = id;
  
    anterior.parentNode.replaceChild(figura, anterior);
    return figura;
  }
  
  /** API auxiliar: devuelve solo el análisis, útil para pruebas y validadores. */
  function analizarCodigo(texto, lenguaje) {
    const codigo = normalizarTexto(texto);
    const gramatica = obtenerGramatica(lenguaje);
    const lineas = codigo.split('\n');
    const lineasTokens = repartirPorLineas(tokenize(codigo, gramatica));
    return { lineas: lineas, tokens: lineasTokens, ambitos: detectarAmbitos(lineas, lineasTokens, gramatica) };
  }
  

  /* --- code/index.js --- */
  /**
   * API pública del módulo de código del SDK.
   *
   * Dos formas de usarlo:
   *
   *   1. Declarativa — la guía construye el bloque desde sus datos:
   *        DevBrainSDK.code.bloque({ texto, titulo, lenguaje })
   *
   *   2. Adopción — la guía ya tiene `<pre><code>` en su HTML y se sustituyen en
   *      sitio: DevBrainSDK.code.mejorarDocumento(document)
   *
   * La segunda existe porque varias guías nacieron con HTML plano o con Prism por
   * CDN. Reescribir su contenido a mano habría multiplicado el riesgo de erratas;
   * adoptarlo en tiempo de carga deja una sola presentación sin tocar el texto.
   */
  
  
  
  
  /** Lee el lenguaje de las convenciones habituales de un `<pre>` o `<code>`. */
  function lenguajeDeNodo(pre, code) {
    const clases = ((code && code.className) || '') + ' ' + (pre.className || '');
    const m = /(?:language|lang)-([\w+#.]+)/i.exec(clases);
    if (m) return m[1];
    return pre.dataset.lang || pre.dataset.lenguaje || (code && code.dataset ? code.dataset.lang : '') || 'text';
  }
  
  /** Busca la ruta del archivo en la cabecera que ya tuviera la tarjeta anterior. */
  function rutaDeNodo(pre) {
    const contenedor = pre.closest('.code-card, .code-block-wrapper, .code-window, figure, div');
    if (!contenedor) return '';
    const marca = contenedor.querySelector('.code-card__path, .code-file-path, .code-file, [data-ruta]');
    return marca ? marca.textContent.trim() : '';
  }
  
  /**
   * Sustituye cada `<pre>` del ámbito indicado por una tarjeta del SDK.
   * Los bloques ya convertidos se ignoran, así que llamarla varias veces es seguro.
   *
   * No todo `<pre>` es un listado: varias guías usan uno como consola de un
   * simulador y le escriben la salida en cada paso. Convertir esos rompería el
   * simulador, así que se respeta `data-dbc="omitir"` como exclusión explícita.
   */
  function mejorarDocumento(raiz) {
    const ambito = raiz || document;
    const pendientes = ambito.querySelectorAll('pre:not([data-dbc-listo]):not([data-dbc="omitir"])');
    let convertidos = 0;
  
    pendientes.forEach(function (pre) {
      if (pre.closest('.dbc') || pre.closest('[data-dbc="omitir"]')) return;
      const code = pre.querySelector('code');
      const texto = (code || pre).textContent;
      if (!texto || !texto.trim()) return;
  
      const figura = construirBloqueCodigo({
        texto: texto,
        lenguaje: lenguajeDeNodo(pre, code),
        titulo: rutaDeNodo(pre)
      });
      figura.dataset.dbcListo = 'adoptado';
  
      const anterior = pre.closest('.code-card, .code-block-wrapper, .code-window');
      const destino = anterior && anterior.querySelectorAll('pre').length === 1 ? anterior : pre;
      if (destino.parentNode) {
        // El identificador viaja con el bloque. Varias guías buscan su listado
        // por `getElementById` para copiarlo o repintarlo; si el id se quedara en
        // el nodo que acabamos de retirar, esos botones dejarían de encontrar nada.
        const id = destino.id || (code && code.id) || pre.id;
        if (id) figura.id = id;
        destino.parentNode.replaceChild(figura, destino);
        convertidos++;
      }
    });
  
    return convertidos;
  }
  
  /** Conecta la adopción automática al ciclo de vida de la página. */
  function activarAdopcionAutomatica(opciones) {
    const config = opciones || {};
    const raiz = config.raiz || document;
  
    const pasar = function () { mejorarDocumento(raiz); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pasar);
    else pasar();
  
    if (config.observar !== false && typeof MutationObserver === 'function') {
      const observador = new MutationObserver(function (cambios) {
        const hayNuevos = cambios.some(function (c) { return c.addedNodes && c.addedNodes.length; });
        if (hayNuevos) pasar();
      });
      observador.observe(raiz === document ? document.body : raiz, { childList: true, subtree: true });
      return observador;
    }
  
    return null;
  }
  
  const code = {
    bloque: construirBloqueCodigo,
    actualizar: actualizarBloqueCodigo,
    codigoDe: codigoDe,
    analizar: analizarCodigo,
    mejorarDocumento: mejorarDocumento,
    activarAdopcionAutomatica: activarAdopcionAutomatica,
    normalizarLenguaje: normalizarLenguaje,
    etiquetaLenguaje: etiquetaLenguaje,
    obtenerGramatica: obtenerGramatica,
    lenguajesSoportados: lenguajesSoportados,
    tokenize: tokenize,
    repartirPorLineas: repartirPorLineas,
    detectarAmbitos: detectarAmbitos
  };
  
  

  global.DevBrainCode = code;
})(window);
