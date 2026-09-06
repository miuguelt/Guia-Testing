from contextlib import asynccontextmanager
from fastapi import FastAPI

from database import Base, engine
from routers.productos import router as productos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crea las tablas faltantes al arrancar y libera recursos al apagar."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="SGE API - Microservicio Productos",
    version="1.0.0",
    description="CRUD de productos de inventario con validacion Pydantic v2.",
    lifespan=lifespan,
)

app.include_router(productos_router)

