-- INJUV - Migración completa (un solo archivo)
--
-- IMPORTANTE (para que funcione desde 0):
-- 1) Crea la BD "INJUV" (UTF8).
-- 2) Configura la conexión en backend/src/app.py
-- 3) Crea las tablas base desde los modelos:
--      cd backend/src
--      python init_db.py
-- 4) Ejecuta ESTE archivo en pgAdmin (Query Tool) conectado a la BD INJUV.
--
-- Este archivo consolida el contenido de los antiguos scripts en backend/migrations/.

BEGIN;

-- ============================================================
-- -1) Tabla de solicitudes de creación de organización
-- ============================================================
CREATE TABLE IF NOT EXISTS solicitudes_organizacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    rut VARCHAR(20),
    email_contacto VARCHAR(150),
    fecha_creacion DATE,
    region VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    sitio_web TEXT,
    redes_sociales JSONB DEFAULT '[]'::jsonb,
    id_usuario_org INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    comentario_revision TEXT,
    revisado_por_admin_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_organizacion_estado ON solicitudes_organizacion(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_organizacion_usuario ON solicitudes_organizacion(id_usuario_org);

-- ============================================================
-- 0) Fix: largo de password_hash (Werkzeug suele ser > 100)
-- ============================================================
ALTER TABLE usuarios
ALTER COLUMN password_hash TYPE VARCHAR(255);

-- ============================================================
-- 1) Biblioteca: tablas + columnas + temáticas + índices
-- ============================================================
-- (Si ya existen, IF NOT EXISTS / DO $$ lo hace idempotente)
CREATE TABLE IF NOT EXISTS biblioteca_tematicas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS biblioteca_documentos (
    id SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    archivo_filename VARCHAR(255) NOT NULL,
    archivo_mime VARCHAR(120),
    archivo_tamano_bytes BIGINT,
    autor VARCHAR(150),
    fecha_edicion TIMESTAMP,
    descripcion VARCHAR(500),
    tematica_id INTEGER REFERENCES biblioteca_tematicas(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'biblioteca_documentos' AND column_name = 'organizacion_id'
    ) THEN
        ALTER TABLE biblioteca_documentos
        ADD COLUMN organizacion_id INTEGER REFERENCES organizaciones(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_biblioteca_documentos_tematica ON biblioteca_documentos(tematica_id);
CREATE INDEX IF NOT EXISTS idx_biblioteca_documentos_fecha_edicion ON biblioteca_documentos(fecha_edicion);
CREATE INDEX IF NOT EXISTS idx_biblioteca_documentos_organizacion ON biblioteca_documentos(organizacion_id);

INSERT INTO biblioteca_tematicas (nombre) VALUES
    ('Voluntariado'),
    ('Medio Ambiente'),
    ('Educación'),
    ('Salud'),
    ('Emergencia'),
    ('Noticias'),
    ('Desarrollo Comunitario'),
    ('Cultura'),
    ('Deportes')
ON CONFLICT (nombre) DO NOTHING;

-- Columnas esperadas por el modelo BibliotecaDocumento (idempotente)
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS archivo_tamano_bytes BIGINT;
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS descripcion VARCHAR(500);
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS archivo_mime VARCHAR(120);
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS autor VARCHAR(150);
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS fecha_edicion TIMESTAMP;
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS tematica_id INTEGER REFERENCES biblioteca_tematicas(id) ON DELETE SET NULL;
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS organizacion_id INTEGER REFERENCES organizaciones(id) ON DELETE SET NULL;
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE biblioteca_documentos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================================
-- 2) Academia: tabla + campos + estado + categoría + índices
-- ============================================================
CREATE TABLE IF NOT EXISTS academia_documentos (
    id SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    archivo_filename VARCHAR(255) NOT NULL,
    archivo_mime VARCHAR(120),
    archivo_tamano_bytes BIGINT,
    autor VARCHAR(150),
    fecha_edicion TIMESTAMP,
    descripcion VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE academia_documentos
ADD COLUMN IF NOT EXISTS organizacion_id INTEGER REFERENCES organizaciones(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_academia_documentos_organizacion ON academia_documentos(organizacion_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academia_documentos' AND column_name = 'estado'
  ) THEN
    ALTER TABLE academia_documentos
    ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'pendiente';
  END IF;
END $$;

UPDATE academia_documentos SET estado = 'aprobado' WHERE estado = 'pendiente' OR estado IS NULL;

CREATE INDEX IF NOT EXISTS idx_academia_documentos_estado ON academia_documentos(estado);

ALTER TABLE academia_documentos ADD COLUMN IF NOT EXISTS categoria VARCHAR(80);

-- ============================================================
-- 3) Oportunidades: organizacion_id + horas_voluntariado
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'oportunidades' 
        AND column_name = 'organizacion_id'
    ) THEN
        ALTER TABLE oportunidades 
        ADD COLUMN organizacion_id INTEGER;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_oportunidades_organizacion' 
            AND table_name = 'oportunidades'
        ) THEN
            ALTER TABLE oportunidades 
            ADD CONSTRAINT fk_oportunidades_organizacion 
            FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id);
        END IF;
    END IF;
END $$;

ALTER TABLE oportunidades
ADD COLUMN IF NOT EXISTS horas_voluntariado INTEGER;

-- ============================================================
-- 4) Postulaciones: horas + reseñas + flag público
-- ============================================================
ALTER TABLE postulaciones 
ADD COLUMN IF NOT EXISTS horas_voluntariado INTEGER DEFAULT 0;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'postulaciones' 
        AND column_name = 'resena_usuario_sobre_org'
    ) THEN
        ALTER TABLE postulaciones 
        ADD COLUMN resena_usuario_sobre_org TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'postulaciones' 
        AND column_name = 'calificacion_usuario_org'
    ) THEN
        ALTER TABLE postulaciones 
        ADD COLUMN calificacion_usuario_org NUMERIC(3, 1);
    END IF;
END $$;

ALTER TABLE postulaciones 
ADD COLUMN IF NOT EXISTS resena_usuario_publica BOOLEAN DEFAULT true;

COMMENT ON COLUMN postulaciones.resena_usuario_publica IS 'Indica si la reseña del usuario sobre la organización es pública (true) o privada (false). Por defecto es pública.';

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'postulaciones' 
        AND column_name = 'reseña_org'
    ) THEN
        ALTER TABLE postulaciones 
        ADD COLUMN "reseña_org" TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'postulaciones' 
        AND column_name = 'reseña_organizacion'
    ) THEN
        ALTER TABLE postulaciones 
        ADD COLUMN "reseña_organizacion" TEXT;
    END IF;
END $$;

-- ============================================================
-- 5) Organizaciones: columnas faltantes + nullability + tipo fecha
-- ============================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizaciones' 
        AND column_name = 'id_usuario_admin'
    ) THEN
        ALTER TABLE organizaciones 
        ADD COLUMN id_usuario_admin INTEGER;
        
        ALTER TABLE organizaciones 
        ADD CONSTRAINT fk_organizaciones_usuario_admin 
        FOREIGN KEY (id_usuario_admin) REFERENCES usuarios(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'ciudad') THEN
        ALTER TABLE organizaciones ADD COLUMN ciudad VARCHAR(100);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'siglas_nombre') THEN
        ALTER TABLE organizaciones ADD COLUMN siglas_nombre VARCHAR(100);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'documentos_legales') THEN
        ALTER TABLE organizaciones ADD COLUMN documentos_legales JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'fecha_creacion') THEN
        ALTER TABLE organizaciones ADD COLUMN fecha_creacion DATE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'descripcion_breve') THEN
        ALTER TABLE organizaciones ADD COLUMN descripcion_breve VARCHAR(500);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'area_trabajo') THEN
        ALTER TABLE organizaciones ADD COLUMN area_trabajo VARCHAR(100);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'tipo_org') THEN
        ALTER TABLE organizaciones ADD COLUMN tipo_org VARCHAR(100);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'sitio_web') THEN
        ALTER TABLE organizaciones ADD COLUMN sitio_web TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'redes_sociales') THEN
        ALTER TABLE organizaciones ADD COLUMN redes_sociales JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'experiencia_anios') THEN
        ALTER TABLE organizaciones ADD COLUMN experiencia_anios INTEGER;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'voluntarios_anuales') THEN
        ALTER TABLE organizaciones ADD COLUMN voluntarios_anuales VARCHAR(100);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'organizaciones' AND column_name = 'certificacion') THEN
        ALTER TABLE organizaciones ADD COLUMN certificacion JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizaciones' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE organizaciones 
        ADD COLUMN created_at TIMESTAMP;
    END IF;
END $$;

-- Permitir NULL en id_usuario_org si existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizaciones' 
        AND column_name = 'id_usuario_org'
    ) THEN
        ALTER TABLE organizaciones 
        ALTER COLUMN id_usuario_org DROP NOT NULL;
    END IF;
END $$;

-- Asegurar tipo DATE para fecha_creacion si existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizaciones' 
        AND column_name = 'fecha_creacion'
    ) THEN
        ALTER TABLE organizaciones 
        ALTER COLUMN fecha_creacion TYPE DATE USING 
            CASE 
                WHEN fecha_creacion IS NULL THEN NULL
                WHEN fecha_creacion::text ~ '^\d{4}-\d{2}-\d{2}$' THEN fecha_creacion::text::DATE
                ELSE NULL
            END;
    END IF;
END $$;

-- Foto de perfil (usuario) y logo (organización): archivos en disco, nombre guardado en BD
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'usuarios' AND column_name = 'foto_perfil'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'organizaciones' AND column_name = 'logo_filename'
    ) THEN
        ALTER TABLE organizaciones ADD COLUMN logo_filename VARCHAR(255);
    END IF;
END $$;

COMMIT;

CREATE TABLE IF NOT EXISTS solicitudes_organizacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    rut VARCHAR(20),
    email_contacto VARCHAR(150),
    fecha_creacion DATE,
    region VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    sitio_web TEXT,
    redes_sociales JSONB DEFAULT '[]'::jsonb,
    id_usuario_org INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    comentario_revision TEXT,
    revisado_por_admin_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_organizacion_estado ON solicitudes_organizacion(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_organizacion_usuario ON solicitudes_organizacion(id_usuario_org);