"""Esquemas Pydantic v2 de entrada y salida de productos."""
from pydantic import BaseModel, ConfigDict, Field


class ProductoCreate(BaseModel):
    """Payload de creacion con validacion estricta de negocio."""

    nombre: str = Field(min_length=1, max_length=120)
    precio: float = Field(gt=0, description="Debe ser mayor a cero")
    stock: int = Field(ge=0, default=0)
    categoria_id: int | None = None


class ProductoUpdate(BaseModel):
    """Payload parcial de actualizacion."""

    nombre: str | None = Field(default=None, min_length=1, max_length=120)
    precio: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)


class ProductoOut(BaseModel):
    """Respuesta publica sin columnas sensibles."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    precio: float
    stock: int
    categoria_id: int | None
    activo: bool
