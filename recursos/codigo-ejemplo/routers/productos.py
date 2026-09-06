"""Rutas del modulo de productos (CRUD con borrado logico)."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Producto
from schemas.producto import ProductoCreate, ProductoOut, ProductoUpdate

router = APIRouter(prefix="/productos", tags=["productos"])


def _get_producto_or_404(producto_id: int, db: Session) -> Producto:
    producto = db.get(Producto, producto_id)
    if not producto or not producto.activo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto


@router.get("/", response_model=list[ProductoOut])
def listar_productos(db: Session = Depends(get_db)):
    """Lista productos activos."""
    return db.query(Producto).filter(Producto.activo.is_(True)).all()


@router.post("/", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def crear_producto(payload: ProductoCreate, db: Session = Depends(get_db)):
    """Crea un producto."""
    nuevo = Producto(
        nombre=payload.nombre.strip(),
        precio=payload.precio,
        stock=payload.stock,
        categoria_id=payload.categoria_id,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{producto_id}", response_model=ProductoOut)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    """Obtiene un producto por id."""
    return _get_producto_or_404(producto_id, db)


@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar_producto(producto_id: int, payload: ProductoUpdate, db: Session = Depends(get_db)):
    """Actualiza campos parciales de un producto."""
    producto = _get_producto_or_404(producto_id, db)
    cambios = payload.model_dump(exclude_unset=True)
    if "nombre" in cambios:
        cambios["nombre"] = cambios["nombre"].strip()
    for campo, valor in cambios.items():
        setattr(producto, campo, valor)
    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    """Borra logico: activo=False conservando el registro."""
    producto = _get_producto_or_404(producto_id, db)
    producto.activo = False
    db.commit()
