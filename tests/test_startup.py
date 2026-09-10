"""Pruebas de regresión para el punto de entrada web en Windows."""

from __future__ import annotations

import socket
import shutil
import subprocess
import sys
import time
from pathlib import Path

import pytest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
START_SCRIPT = PROJECT_ROOT / "start-windows.ps1"
COMPOSE_FILE = PROJECT_ROOT / "docker-compose.yml"


def _free_local_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def test_status_reports_an_existing_listener_without_net_tcpip_module():
    """El estado debe funcionar incluso cuando falta el cmdlet NetTCPIP."""
    if shutil.which("pwsh") is None:
        pytest.skip("PowerShell no está disponible en este entorno")

    port = _free_local_port()
    server = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "http.server",
            str(port),
            "--bind",
            "127.0.0.1",
            "--directory",
            str(PROJECT_ROOT / "web"),
        ],
        cwd=PROJECT_ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        deadline = time.monotonic() + 3
        while time.monotonic() < deadline:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
                if probe.connect_ex(("127.0.0.1", port)) == 0:
                    break
            time.sleep(0.05)
        else:
            raise AssertionError("El servidor de prueba no abrió el puerto")

        result = subprocess.run(
            [
                "pwsh",
                "-NoProfile",
                "-File",
                str(START_SCRIPT),
                "-Status",
                "-Port",
                str(port),
            ],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=10,
        )

        output = f"{result.stdout}\n{result.stderr}"
        assert result.returncode == 0, output
        assert "ONLINE" in output, output
    finally:
        server.terminate()
        server.wait(timeout=5)


def test_root_entrypoint_redirects_to_the_canonical_web_guide():
    """Abrir index.html desde la raíz no debe cargar una versión antigua y parcial."""
    root_index = (PROJECT_ROOT / "index.html").read_text(encoding="utf-8")

    assert "web/index.html" in root_index
    assert "window.location.replace" in root_index
    assert "m-dossier" not in root_index


def test_docker_compose_publishes_the_guide_port_to_the_host():
    """Compose debe hacer visible Nginx desde el navegador del equipo local."""
    compose = COMPOSE_FILE.read_text(encoding="utf-8")

    assert '"${GUIDE_HOST_PORT:-8035}:80"' in compose
