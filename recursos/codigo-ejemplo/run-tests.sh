#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PYTHON=".venv/bin/python"
if [[ ! -x "$PYTHON" ]]; then
  echo "No existe .venv. Ejecuta python3 -m venv .venv y pip install -r requirements.txt." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "No se encontró npm. Instala Node.js 20 o posterior." >&2
  exit 1
fi

"$PYTHON" -m pytest tests -v
"$PYTHON" -m behave -q
npm test

if [[ "${SKIP_JAVA:-0}" != "1" ]]; then
  if ! command -v mvn >/dev/null 2>&1; then
    echo "No se encontró Maven. Instálalo o ejecuta SKIP_JAVA=1 ./run-tests.sh." >&2
    exit 1
  fi
  mvn --batch-mode test jacoco:report
fi

if [[ "${SKIP_E2E:-0}" != "1" ]]; then
  export FLASK_SECRET_KEY="${FLASK_SECRET_KEY:-$($PYTHON -c 'import secrets; print(secrets.token_hex(32))')}"
  npm run e2e
fi

echo "Todas las verificaciones solicitadas terminaron correctamente."
