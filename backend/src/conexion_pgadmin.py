import psycopg2
import os

connection = None

try:
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL no está configurada")
    connection = psycopg2.connect(database_url)
    print("conexion exitosa")
    cursor = connection.cursor()
except Exception as ex:
    print(ex)

finally:
    if connection is not None:
        connection.close()
    print("conexion terminada")