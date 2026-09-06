"""Busqueda de archivos fuente de un directorio (contexto de barrido)."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

SKIP_NAMES = {
    ".git", "node_modules", ".venv", "venv", "__pycache__", ".pytest_cache",
    "dist", "build", ".idea", ".vscode", "playwright-report", "test-results",
    "logs", ".mypy_cache", ".ruff_cache", ".next", "coverage", "htmlcov",
    "test.db", "_archive", "backups", "legacy", "_graveyard",
}

SKIP_SUFFIXES = {".sqlite3", ".sqlite", ".db", ".pyc", ".png", ".jpg", ".jpeg",
                 ".gif", ".webp", ".pdf", ".docx", ".xlsx", ".zip", ".woff",
                 ".woff2", ".ico", ".ttf", ".eot"}

TEXT_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".kt", ".html", ".css",
    ".json", ".yml", ".yaml", ".toml", ".properties", ".env", ".md",
    ".sql", ".xml", ".go", ".rb", ".php",
}


@dataclass
class ScanContext:
    """Contexto de barrido: carpeta objetivo y archivos fuente indexados."""

    root: Path
    files: list[Path] = field(default_factory=list)
    refs: list[Path] = field(default_factory=list)  # manifiestos de dependencias

    @classmethod
    def build(cls, root: Path) -> "ScanContext":
        root = root.resolve()
        ctx = cls(root=root)
        manifest_names = {"requirements.txt", "package.json", "pom.xml",
                          "package-lock.json", ".env.example", ".env",
                          "Dockerfile", "docker-compose.yml"}
        for path in sorted(root.rglob("*")):
            if not path.is_file():
                continue
            if ctx._is_skipped(path):
                continue
            if path.suffix in TEXT_EXTENSIONS or path.name in manifest_names:
                if path.name in manifest_names:
                    ctx.refs.append(path)
                elif path.name == ".env":
                    ctx.refs.append(path)
                else:
                    ctx.files.append(path)
        return ctx

    @classmethod
    def _is_skipped(cls, path: Path) -> bool:
        if path.name in SKIP_NAMES or path.suffix in SKIP_SUFFIXES:
            return True
        parts = set(path.parts)
        return bool(SKIP_NAMES & parts)

    def rel(self, path: Path) -> str:
        """Ruta relativa a la carpeta objetivo, con pendientes de carpetas."""
        return path.relative_to(self.root).as_posix()

    def read(self, path: Path) -> str:
        """Lee un archivo de texto con tolerancia de codificacion."""
        try:
            return path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            try:
                return path.read_text(encoding="latin-1")
            except Exception:
                return ""

    def all_text(self, include_refs: bool = False) -> list[tuple[Path, str]]:
        """Pares (archivo, contenido) para el barrido."""
        paths = list(self.files)
        if include_refs:
            paths += self.refs
        return [(p, self.read(p)) for p in paths if self.read(p) != ""]
