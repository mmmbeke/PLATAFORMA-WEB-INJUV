# Configuración de Email Automático

Este sistema envía emails automáticos cuando un usuario realiza una postulación exitosa.

## Instalación

Flask-Mail ya está instalado. Si necesitas reinstalarlo:

```bash
pip install flask-mail
```

## Configuración para Gmail

### Paso 1: Crear una Contraseña de Aplicación

**Método más rápido:**
1. Ve directamente a: **https://myaccount.google.com/apppasswords**
   - Si te pide verificación, confirma tu identidad
   - Si no aparece la opción, asegúrate de que la verificación en 2 pasos esté activada

**Si el enlace directo no funciona:**
1. Ve a: https://myaccount.google.com/security
2. Busca la sección **"Verificación en 2 pasos"** y asegúrate de que esté **ACTIVADA** (debe tener un check verde)
3. Una vez activada, busca **"Contraseñas de aplicaciones"** (puede estar más abajo en la página)
4. O intenta ir directamente a: https://myaccount.google.com/apppasswords

**Generar la contraseña:**
1. En la página de "Contraseñas de aplicaciones", selecciona:
   - **Aplicación**: "Correo"
   - **Dispositivo**: "Otro (nombre personalizado)"
2. Escribe un nombre (ej: "INJUV Flask App")
3. Haz clic en **"Generar"**
4. Google mostrará una contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)
5. **Cópiala completa** (sin espacios) - no podrás verla de nuevo

### Paso 2: Configurar las Credenciales

Tienes **tres opciones** (elige la más fácil para ti):

#### Opción A: Configurar directamente en el código (MÁS FÁCIL para empezar)

1. Abre el archivo `backend/src/app.py`
2. Busca las líneas que dicen:
   ```python
   MAIL_USER = ''  # Tu email de Gmail
   MAIL_PASS = ''  # Tu contraseña de aplicación
   ```
3. Reemplaza con tus credenciales:
   ```python
   MAIL_USER = 'tu_email@gmail.com'
   MAIL_PASS = 'tu_contraseña_de_16_caracteres_sin_espacios'
   ```
4. Guarda el archivo y reinicia el servidor Flask

⚠️ **ADVERTENCIA**: No subas estas credenciales a un repositorio público (GitHub, etc.)

#### Opción B: Variables de Entorno del Sistema (Recomendado para producción)

En Windows PowerShell:
```powershell
$env:MAIL_USERNAME="tu_email@gmail.com"
$env:MAIL_PASSWORD="tu_contraseña_de_aplicacion_de_16_caracteres"
$env:MAIL_DEFAULT_SENDER="tu_email@gmail.com"
```

En Linux/Mac:
```bash
export MAIL_USERNAME="tu_email@gmail.com"
export MAIL_PASSWORD="tu_contraseña_de_aplicacion_de_16_caracteres"
export MAIL_DEFAULT_SENDER="tu_email@gmail.com"
```

#### Opción B: Modificar directamente en app.py (Solo para pruebas)

Edita `backend/src/app.py` y reemplaza las líneas 30-31:

```python
app.config['MAIL_USERNAME'] = 'tu_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'tu_contraseña_de_aplicacion'
app.config['MAIL_DEFAULT_SENDER'] = 'tu_email@gmail.com'
```

⚠️ **ADVERTENCIA**: No subas estas credenciales a un repositorio público.

## Configuración para Otros Proveedores

### Outlook/Office 365
```python
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
```

### Yahoo
```python
app.config['MAIL_SERVER'] = 'smtp.mail.yahoo.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
```

## Probar el Envío de Emails

1. Configura las credenciales según las opciones anteriores
2. Reinicia el servidor Flask
3. Realiza una postulación desde el frontend
4. El usuario debería recibir un email de confirmación

## Solución de Problemas

### Error: "Authentication failed"
- Verifica que estés usando una **Contraseña de Aplicación**, no tu contraseña normal de Gmail
- Asegúrate de que la verificación en dos pasos esté activada

### Error: "Connection refused"
- Verifica que el puerto 587 no esté bloqueado por tu firewall
- Prueba con el puerto 465 y cambia `MAIL_USE_TLS` a `False` y `MAIL_USE_SSL` a `True`

### No se envían emails pero no hay error
- Revisa la consola del servidor Flask para ver mensajes de error
- Verifica que el usuario tenga un email válido en la base de datos
- Los emails pueden tardar unos minutos en llegar

## Notas

- Si no configuras las credenciales, la aplicación funcionará normalmente pero no enviará emails (solo mostrará warnings en la consola)
- Los emails se envían de forma asíncrona, por lo que un error en el envío no afectará la creación de la postulación

