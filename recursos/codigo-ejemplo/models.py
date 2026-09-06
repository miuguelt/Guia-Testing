"""Modelos ORM del microservicio de productos."""
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Producto(Base):
    """Producto del inventario con borrado logico (activo=False)."""

    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(nullable=False, index=True)
    precio: Mapped[float] = mapped_column(nullable=False)
    stock: Mapped[int] = mapped_column(default=0, nullable=False)
    categoria_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    activo: Mapped[bool] = mapped_column(default=True, nullable=False)
