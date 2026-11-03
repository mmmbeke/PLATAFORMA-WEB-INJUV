import sys

# Importa app/db/modelos desde app.py (se registran los modelos al importar)
from app import app, db  # noqa: F401


def main() -> int:
    try:
        with app.app_context():
            db.create_all()
        print("✅ Tablas creadas/actualizadas con db.create_all()")
        return 0
    except Exception as e:
        print("❌ Error al crear tablas:", repr(e))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

