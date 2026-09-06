"""Fixtures para tests de la guia Testing."""
import os
import sys
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@pytest.fixture
def guides_root():
    """Retorna la ruta raiz del workspace con todas las guias."""
    return os.path.dirname(BASE_DIR)


@pytest.fixture
def testing_guide_dir():
    """Retorna la ruta de la guia Testing."""
    return BASE_DIR
