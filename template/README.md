# Panel de Administración - INJUV

## Descripción

Sistema de administración completo para la plataforma de voluntariado INJUV, diseñado para gestionar usuarios, contenido y configuración de la plataforma de manera eficiente y segura.

## Características Principales

### 🔐 Gestión de Usuarios
- **Registro de Usuarios**: Sistema completo de registro con campos obligatorios y opcionales
- **Gestión de Roles**: Diferentes niveles de acceso (Administrador, Moderador, Editor, Visualizador)
- **Organizaciones**: Soporte para múltiples organizaciones con usuarios miembros
- **Información de Contacto**: Múltiples correos y teléfonos por usuario

### 📊 Reportes
- **Reportes de Usuarios**: Por organización, actividad y período
- **Reportes de Actividades**: Oportunidades de voluntariado y formación
- **Filtros Avanzados**: Criterios personalizables para generar reportes específicos
- **Exportación**: Descarga de reportes en diferentes formatos

### 🎨 Edición de Plataforma
- **Personalización de Colores**: Selector de colores para tema principal y secundario
- **Gestión de Logos**: Carga y actualización de logos y favicons
- **Textos del Sitio**: Edición de títulos y descripciones principales
- **Configuración Visual**: Modificación de elementos estéticos sin afectar funcionalidad

### 📰 Gestión de Noticias
- **Carga de Noticias**: Sistema de subida de contenido
- **Flujo de Aprobación**: Aprobación/rechazo de noticias antes de publicación
- **Estado de Contenido**: Seguimiento de noticias pendientes, aprobadas y rechazadas
- **Edición**: Modificación de noticias existentes

### 🤝 Gestión de Oportunidades
- **Tipos de Actividad**: Voluntariado y formación
- **Sistema de Aprobación**: Control de calidad para nuevas oportunidades
- **Estados**: Seguimiento de oportunidades pendientes, activas y cerradas
- **Gestión Completa**: Creación, edición y desactivación de oportunidades

### 📁 Repositorio de Documentos
- **Carga de Archivos**: Soporte para múltiples formatos (PDF, DOCX, etc.)
- **Control de Acceso**: Aprobación/rechazo de documentos
- **Metadatos**: Información detallada de archivos (tamaño, tipo, subido por)
- **Gestión de Versiones**: Control de documentos aprobados y pendientes

## Estructura del Proyecto

```
Diseño de paginas/
├── index.html              # Página principal del sitio
├── style.css               # Estilos del sitio principal
├── admin.html              # Panel de administración
├── admin-style.css         # Estilos del panel de administración
├── admin.js                # Funcionalidad JavaScript del panel
└── README.md               # Este archivo
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con Grid, Flexbox y animaciones
- **JavaScript ES6+**: Funcionalidad interactiva y manejo de datos
- **Font Awesome**: Iconografía profesional
- **Diseño Responsive**: Compatible con dispositivos móviles y de escritorio

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local o remoto (opcional para desarrollo)

### Configuración
1. Clona o descarga el proyecto
2. Abre `admin.html` en tu navegador
3. El panel de administración estará completamente funcional

### Desarrollo
- Modifica `admin-style.css` para personalizar estilos
- Edita `admin.js` para agregar funcionalidades
- Actualiza `admin.html` para modificar la estructura

## Funcionalidades Técnicas

### Sistema de Navegación
- **Sidebar Responsive**: Navegación lateral con colapso automático en móviles
- **Breadcrumbs**: Indicador de ubicación actual en el sistema
- **Navegación por Pestañas**: Cambio dinámico entre secciones

### Gestión de Estado
- **Estados Visuales**: Indicadores claros para diferentes estados de elementos
- **Transiciones Suaves**: Animaciones CSS para mejor experiencia de usuario
- **Feedback Inmediato**: Notificaciones y confirmaciones para todas las acciones

### Formularios Inteligentes
- **Validación en Tiempo Real**: Verificación de datos antes del envío
- **Campos Dinámicos**: Formularios que se adaptan al contexto
- **Manejo de Errores**: Mensajes claros para problemas de validación

### Modales y Overlays
- **Sistema de Modales**: Ventanas emergentes para formularios y confirmaciones
- **Gestión de Estado**: Control de apertura/cierre de modales
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## Personalización

### Colores del Tema
```css
:root {
  --primary-color: #004996;    /* Azul principal */
  --secondary-color: #e30613;  /* Rojo secundario */
  --background-color: #f8fafc; /* Fondo general */
  --text-color: #333;          /* Color de texto */
}
```

### Tipografías
- **Fuente Principal**: Segoe UI (Windows), Tahoma (fallback)
- **Tamaños Responsivos**: Escalado automático según dispositivo
- **Jerarquía Visual**: Diferentes pesos y tamaños para mejor legibilidad

### Componentes Reutilizables
- **Botones**: Múltiples variantes (primario, secundario, éxito, peligro)
- **Tarjetas**: Diseño consistente para diferentes tipos de contenido
- **Tablas**: Estructura clara para datos tabulares
- **Formularios**: Campos de entrada estandarizados

## Responsive Design

### Breakpoints
- **Desktop**: > 1024px (navegación lateral completa)
- **Tablet**: 768px - 1024px (sidebar colapsado)
- **Mobile**: < 768px (navegación adaptada)

### Adaptaciones Móviles
- **Sidebar Colapsable**: Menú hamburguesa en dispositivos pequeños
- **Grids Adaptativos**: Cambio automático de columnas según pantalla
- **Touch Friendly**: Botones y controles optimizados para pantallas táctiles

## Seguridad y Acceso

### Control de Acceso
- **Sistema de Roles**: Diferentes niveles de permisos
- **Validación de Datos**: Verificación en frontend y backend
- **Sesiones Seguras**: Manejo seguro de autenticación

### Validaciones
- **Campos Requeridos**: Verificación de datos obligatorios
- **Formatos de Datos**: Validación de emails, teléfonos, etc.
- **Longitudes Mínimas**: Restricciones de caracteres para campos críticos

## Mantenimiento y Escalabilidad

### Código Limpio
- **Estructura Modular**: Separación clara de responsabilidades
- **Comentarios**: Documentación inline para funciones complejas
- **Nomenclatura**: Convenciones consistentes para clases y funciones

### Extensibilidad
- **Arquitectura Flexible**: Fácil agregar nuevas funcionalidades
- **APIs Simuladas**: Estructura preparada para integración con backend
- **Componentes Reutilizables**: Elementos que se pueden reutilizar

## Próximas Mejoras

### Funcionalidades Planificadas
- [ ] **Dashboard Avanzado**: Gráficos y métricas en tiempo real
- [ ] **Sistema de Notificaciones**: Alertas push para administradores
- [ ] **Auditoría**: Log de cambios y acciones realizadas
- [ ] **Backup Automático**: Respaldo automático de configuraciones
- [ ] **API REST**: Endpoints para integración con otros sistemas

### Mejoras Técnicas
- [ ] **PWA**: Aplicación web progresiva para acceso offline
- [ ] **TypeScript**: Tipado estático para mejor mantenibilidad
- [ ] **Testing**: Suite de pruebas automatizadas
- [ ] **CI/CD**: Pipeline de integración continua

## Soporte y Contacto

### Documentación
- Este README contiene toda la información necesaria para usar el sistema
- Los comentarios en el código proporcionan contexto adicional
- La estructura del proyecto es intuitiva y fácil de navegar

### Contribuciones
- El código está diseñado para ser fácilmente modificable
- Se recomienda seguir las convenciones establecidas
- Las nuevas funcionalidades deben mantener la consistencia visual

## Licencia

Este proyecto está desarrollado para INJUV y su uso está restringido a la organización.

---

**Desarrollado con ❤️ para INJUV - Ministerio de Desarrollo Social y Familia** 