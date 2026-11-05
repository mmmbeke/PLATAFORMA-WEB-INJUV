# INJUV — Estado del proyecto y guía operativa

Plataforma web de voluntariado INJUV desplegada en producción (nov 2026).

## Producción

| Componente | Ubicación |
|---|---|
| Frontend (estático) | https://plataforma-injuv-utem.vercel.app — Vercel, root dir `template/` |
| Backend (Flask API) | https://plataforma-web-injuv.onrender.com — Render, instancia Starter (pagada) |
| Swagger | https://plataforma-web-injuv.onrender.com/apidocs/ |
| Base de datos | Neon PostgreSQL (`neondb`) — 9 tablas |
| Storage uploads | Render Disk 1GB montado en `/opt/render/project/src/backend/uploads` |

## Arquitectura

- `backend/` — API Flask. Entry: `src/app.py` (~9.800 líneas, 9 modelos, ~80 endpoints).
  - `DATABASE_URL` obligatoria (normalizada a `postgresql+psycopg2://` en app.py).
  - `UPLOADS_DIR` opcional → disco persistente; default = raíz del repo.
  - `MAIL_*` opcionales (emails).
  - Start en Render: `gunicorn --chdir src app:app`, root dir `backend`, `.python-version` = 3.12.
- `template/` — frontend oficial: HTML/CSS/JS estático, SIN framework ni build.
  - `config.js` define `window.API_BASE_URL` (cargado antes de scripts en cada página).
  - header.html usa `INJUV_TEMPLATE_PREFIX` para rutas absolutas (soporta Live Server en raíz del repo y hosting con template/ como raíz).
  - Auth: localStorage (`isLoggedIn`, `userId`, `userRol`, `loggedUser`). Roles: `admin` → Roles/Admin/admin-modern.html, `organizacion` → Roles/Perfil_organizacion/dashboard.html, resto → index.html.
- `INJUV_github/` — copia LEGADO del frontend (no desplegar, no tocar).
- `backend/scripts/sync_noticias.py` — sincroniza noticias desde injuv.gob.cl/personas/noticias/ vía API (`--dry-run`, `--max N`, `--api URL`). Dedup por título.
- `backend/migrations/migracion_completa.sql` — esquema idempotente (ya aplicado en Neon).
- `backend/src/init_db.py` — `db.create_all()`.

## Carpetas de uploads (bajo UPLOADS_DIR)

`perfiles_usuarios`, `logos_organizaciones`, `imagenes_noticias`, `certificaciones_organizaciones`, `certificados_voluntarios`, `documentos_biblioteca`, `repositorio_academia`.

## Usuarios de prueba en Neon

| Email | Password | Rol |
|---|---|---|
| useradmi1..4@correo.cl | Admi2026! | admin |
| usuario1..3@correo.cl | Injuv2026! | user |
| usuarioinvitado1..5@correo.cl | Invitado2026! | user |
| devin@correo.cl | Devin2026!Test | admin (test) |

## Reglas del proyecto (del owner)

- NO cambiar el diseño visual del frontend; solo fixes técnicos.
- Repo autorizado: `mmmbeke/PLATAFORMA-WEB-INJUV` (el original `duranfrancisco0111/INJUV` queda intacto).
- Credenciales solo por variables de entorno — nunca en código ni docs.
- Migraciones/escrituras en BD solo con autorización.

## Backlog pendiente

- Proteger `/api/admin/*` en el servidor (hoy sin auth real; frontend oculta por rol).
- Migrar auth de localStorage a tokens (JWT/sesión).
- Limpieza: untrackear `.DS_Store`/`desktop.ini` (ya en .gitignore), evaluar carpeta `INJUV_github/`.
- Automatizar `sync_noticias.py` (cron/scheduled job en Render) si se quiere sync periódico.

## Verificación rápida

```bash
curl https://plataforma-web-injuv.onrender.com/                      # 200
curl https://plataforma-web-injuv.onrender.com/api/biblioteca/tematicas  # 9 tematicas
curl -I https://plataforma-injuv-utem.vercel.app/config.js           # 200
```
