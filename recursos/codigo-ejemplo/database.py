"""Conexion y sesiones de la base de datos SQLAlchemy 2.0 (SQLite)."""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./finca.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base declarativa compartida por todos los modelos."""


def get_db():
    """Dependencia FastAPI entrega una sesion por peticion."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
