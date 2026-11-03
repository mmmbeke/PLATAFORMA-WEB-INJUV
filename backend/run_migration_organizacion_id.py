"""
Script para añadir la columna organizacion_id a biblioteca_documentos si no existe.
Ejecutar desde la carpeta del proyecto con el venv activado:
  python backend/run_migration_organizacion_id.py
"""
import os
import sys

# URI por defecto (coincide con app.py); puede sobreescribirse con DATABASE_URI
URI = os.environ.get('DATABASE_URI', 'postgresql://postgres:fran0405@localhost/INJUV')

from sqlalchemy import text, create_engine

engine = create_engine(URI)
with engine.connect() as conn:
    r = conn.execute(text("""
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'biblioteca_documentos' AND column_name = 'organizacion_id'
    """))
    if r.fetchone():
        print("La columna biblioteca_documentos.organizacion_id ya existe. Nada que hacer.")
    else:
        conn.execute(text("""
            ALTER TABLE biblioteca_documentos
            ADD COLUMN organizacion_id INTEGER REFERENCES organizaciones(id) ON DELETE SET NULL
        """))
        conn.commit()
        print("Columna organizacion_id anadida a biblioteca_documentos correctamente.")
    try:
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_biblioteca_documentos_organizacion ON biblioteca_documentos(organizacion_id)
        """))
        conn.commit()
        print("Indice idx_biblioteca_documentos_organizacion creado o ya existia.")
    except Exception as e:
        conn.rollback()
        print("Indice (opcional):", e)
