# Guía paso a paso: conexión a la base de datos y puesta en marcha del backend INJUV

Esta guía permite que todo el equipo tenga la misma versión del proyecto: mismas librerías, misma base de datos y mismos pasos para ejecutar el backend.

---

## 1. Requisitos previos

| Herramienta   | Versión recomendada | Comprobación en terminal |
|---------------|---------------------|---------------------------|
| **Python**    | 3.8 o superior (ideal 3.10+) | `python --version` |
| **pip**       | Incluido con Python | `pip --version` |
| **PostgreSQL**| 12 o superior       | `psql --version` (o desde pgAdmin) |

---

## 2. Instalar PostgreSQL (si no lo tienes)

### Windows
1. Descarga el instalador desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador y completa el asistente.
3. **Anota la contraseña que definas para el usuario `postgres`** (la usarás en el paso 5).
4. Deja el puerto por defecto **5432**.
5. Opcional: instala **pgAdmin** (incluido en el instalador) para gestionar la base de datos con interfaz gráfica.

### macOS
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 3. Crear la base de datos en PostgreSQL

### Opción A: Con pgAdmin
1. Abre **pgAdmin** y conéctate al servidor (usuario `postgres` y tu contraseña).
2. Clic derecho en **Databases** → **Create** → **Database**.
3. Nombre: `INJUV`.
4. Guardar.

### Opción B: Con psql (terminal)
1. Abre una terminal y entra a PostgreSQL con el usuario `postgres`:
   - **Windows:** abre "SQL Shell (psql)" desde el menú de PostgreSQL.
   - **Linux/macOS:** `sudo -u postgres psql`
2. Ejecuta:
```sql
CREATE DATABASE "INJUV";
\q
```

---

## 4. Estructura del backend y librerías necesarias

Estructura relevante del proyecto:

```
backend/
├── docs/
│   └── CONEXION_BASE_DATOS.md   ← Esta guía
├── migrations/                   ← Scripts SQL (ejecutar en orden cuando se indique)
├── src/
│   ├── app.py                    ← Aplicación Flask y configuración de la BD
│   └── ...
└── requirements.txt              ← Dependencias Python
```

### Librerías (requirements.txt)

| Paquete              | Uso principal                          |
|----------------------|----------------------------------------|
| Flask                | API REST y servidor web                |
| flask-sqlalchemy     | Conexión y ORM con PostgreSQL          |
| flask-mail           | Envío de correos                       |
| psycopg2-binary      | Driver de PostgreSQL para Python       |
| werkzeug             | Utilidades web (archivos, seguridad)   |
| openpyxl             | Exportar reportes a Excel              |

---

## 5. Configurar la conexión a la base de datos

La conexión se define en **`backend/src/app.py`**.

1. Abre el archivo `backend/src/app.py`.
2. Busca la línea que contiene `SQLALCHEMY_DATABASE_URI` (cerca del inicio del archivo).
3. Sustituye por tu **usuario** y **contraseña** de PostgreSQL. Formato:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://USUARIO:CONTRASEÑA@localhost/INJUV'
```

**Ejemplo** (usuario `postgres`, contraseña `mi_password`):

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mi_password@localhost/INJUV'
```

- **USUARIO:** normalmente `postgres` (o el usuario que hayas creado en PostgreSQL).
- **CONTRASEÑA:** la que definiste al instalar PostgreSQL (o la de tu usuario).
- **Host:** `localhost` si la base está en tu máquina.
- **Base de datos:** `INJUV` (nombre creado en el paso 3).

**Importante:** no subas contraseñas al repositorio. Cada persona usa su propia contraseña local en `app.py` o con variables de entorno (ver sección 9).

---

## 6. Instalación paso a paso (misma versión para todo el equipo)

Sigue estos pasos en orden para tener el mismo entorno.

### Paso 1: Entrar en la carpeta del backend
```bash
cd backend
```
(Ajusta la ruta si abriste el proyecto en otra ubicación.)

### Paso 2: Crear entorno virtual (recomendado)
```bash
python -m venv venv
```

Activar el entorno:
- **Windows (CMD):** `venv\Scripts\activate.bat`
- **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
- **Linux/macOS:** `source venv/bin/activate`

Cuando el entorno esté activo, verás `(venv)` al inicio de la línea en la terminal.

### Paso 3: Instalar las librerías
Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

Esto instala las mismas versiones que en el proyecto (Flask, flask-sqlalchemy, psycopg2-binary, etc.).

### Paso 4: Configurar la base de datos
- Asegúrate de que PostgreSQL esté en ejecución.
- Verifica que la base de datos `INJUV` exista (paso 3).
- Edita `src/app.py` y configura `SQLALCHEMY_DATABASE_URI` con tu usuario y contraseña (paso 5).

### Paso 4.1: Crear tablas automáticamente (recomendado)
Si borraste la base de datos o estás partiendo de cero, puedes crear las tablas desde los modelos del backend ejecutando:

```bash
cd backend/src
python init_db.py
```

Esto ejecuta `db.create_all()` y crea las tablas definidas en `app.py`.

### Paso 5: Aplicar migraciones en la base de datos

Las migraciones son scripts SQL que crean o modifican tablas y columnas. Deben ejecutarse en la base `INJUV` cuando el equipo lo indique o cuando falte alguna tabla/columna.

**Dónde ejecutarlas:** en **pgAdmin** (Query Tool sobre la base `INJUV`) o con `psql` conectado a `INJUV`.

**Migración única (recomendado):**

1. Crea las tablas base desde los modelos:

```bash
cd backend/src
python init_db.py
```

2. Ejecuta el script consolidado en pgAdmin (Query Tool) conectado a `INJUV`:

- `backend/migrations/migracion_completa.sql`

**Nota:** Si la app ya crea tablas con Flask/SQLAlchemy o tienes un backup de la BD, puede que solo necesites ejecutar algunas migraciones. Si aparece un error del tipo "column does not exist", revisa el mensaje y ejecuta la migración que añada esa columna o tabla.

### Paso 6: Ejecutar el servidor
Desde la carpeta **`backend/src`**:

```bash
cd src
python app.py
```

Si todo está bien, verás que el servidor está en marcha. La API quedará disponible en:

- **URL base:** `http://127.0.0.1:5000`
- **Ejemplo de ruta API:** `http://127.0.0.1:5000/api/...`

El frontend debe usar esta misma URL como base para las llamadas a la API.

---

## 7. Resumen de procedimientos habituales

| Procedimiento              | Acción |
|----------------------------|--------|
| **Primera vez en el proyecto** | Pasos 1 a 6 (instalar dependencias, configurar BD, migraciones, ejecutar `app.py`). |
| **Cambiar de máquina o clonar de nuevo** | Repetir desde el paso 1; configurar de nuevo la URI en `app.py` con el usuario/contraseña local. |
| **Error "column does not exist"** | Ejecutar en `INJUV` la migración que añada esa columna (revisar nombre en el error). |
| **Actualizar librerías** | `pip install -r requirements.txt` (con el venv activado). |
| **Reiniciar el servidor** | Detener con Ctrl+C en la terminal donde corre `python app.py` y volver a ejecutar `python app.py`. |

---

## 8. Uso de variables de entorno (opcional)

Para no escribir la contraseña en `app.py`, puedes usar una variable de entorno.

1. Crea un archivo **`.env`** en la carpeta `backend/` (o `backend/src/`) con:
   ```
   DATABASE_URI=postgresql://postgres:TU_CONTRASEÑA@localhost/INJUV
   ```
2. En `app.py`, carga la variable (por ejemplo con `python-dotenv`) y usa:
   ```python
   import os
   app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI', 'postgresql://postgres:fallback@localhost/INJUV')
   ```
3. Añade `.env` al `.gitignore` para no subir contraseñas.

Así cada desarrollador mantiene su propia contraseña en `.env` y la versión en repo queda igual para todo el equipo.

---

## 9. Problemas frecuentes y soluciones

| Error o síntoma | Qué hacer |
|------------------|-----------|
| **"No module named 'flask'"** | Activa el entorno virtual y ejecuta `pip install -r requirements.txt`. |
| **"connection refused" / error de conexión a PostgreSQL** | Comprueba que el servicio PostgreSQL esté iniciado y que usuario, contraseña, host y nombre de BD en `app.py` sean correctos. |
| **"column does not exist"** | Ejecuta en la base `INJUV` la migración correspondiente desde `backend/migrations/`. |
| **CORS en el navegador** | Verifica que el frontend use la URL correcta del backend (ej. `http://127.0.0.1:5000`) y que el servidor esté corriendo. |
| **Archivos o descargas que fallan** | Los documentos se guardan en carpetas como `repositorio_academia/` o `repositorio_biblioteca/` (junto a donde se ejecuta `app.py`). Asegura permisos de lectura y que la ruta exista. |

---

## 10. Checklist para tener la misma versión que el equipo

- [ ] Python 3.8+ y PostgreSQL instalados.
- [ ] Base de datos `INJUV` creada.
- [ ] Entorno virtual creado y activado.
- [ ] `pip install -r requirements.txt` ejecutado.
- [ ] `SQLALCHEMY_DATABASE_URI` en `src/app.py` configurado con tu usuario y contraseña local.
- [ ] Migraciones necesarias ejecutadas en `INJUV`.
- [ ] `python app.py` desde `backend/src` y servidor respondiendo en `http://127.0.0.1:5000`.

Con esto, todo el equipo puede tener la misma versión del backend y conectarse a su propia base de datos local siguiendo los mismos pasos.
