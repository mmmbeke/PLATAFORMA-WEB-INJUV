# Voluntariados INJUV

Una aplicación web para buscar y postular a voluntariados del Instituto Nacional de la Juventud (INJUV) de Chile.

## 🚀 Características

- **Búsqueda en tiempo real**: Filtra voluntariados por palabra clave, región o actividad
- **Interfaz responsiva**: Diseño adaptativo para dispositivos móviles y desktop
- **Modal de detalles**: Información completa de cada voluntariado
- **Sistema de postulación**: Simulación de postulación a voluntariados
- **Repositorio de recursos**: Acceso a guías, plantillas y videos tutoriales
- **Animaciones suaves**: Efectos visuales para mejorar la experiencia de usuario

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos personalizados con variables CSS y animaciones
- **JavaScript (ES6+)**: Funcionalidad interactiva sin dependencias
- **Tailwind CSS**: Framework de utilidades CSS via CDN
- **Google Fonts**: Tipografía Inter para mejor legibilidad

## 📁 Estructura del Proyecto

```
project 3/
├── index.html          # Archivo principal HTML
├── styles.css          # Estilos personalizados
├── INJUV-logo-menor.png # Logo de INJUV
└── README.md           # Documentación del proyecto
```

## 🎯 Funcionalidades

### Búsqueda y Filtrado
- Búsqueda por palabra clave en título, región u organización
- Filtro por región específica
- Contador dinámico de resultados
- Resaltado de términos de búsqueda

### Tarjetas de Voluntariado
- Información detallada de cada voluntariado
- Badges de organización con colores distintivos
- Detalles de ubicación, fecha y cupos disponibles
- Botones de acción (Postular y Ver detalles)

### Modales Interactivos
- Modal de detalles con información completa
- Modal de confirmación de postulación
- Cierre con clic fuera del modal o botón de cerrar

### Repositorio de Recursos
- Enlaces a guías y manuales
- Plantillas descargables
- Videos tutoriales
- Enlaces externos a recursos oficiales

## 🎨 Diseño

- **Paleta de colores**: Azul institucional (#2151ff) con grises neutros
- **Tipografía**: Inter para mejor legibilidad
- **Animaciones**: Transiciones suaves y efectos hover
- **Responsive**: Adaptable a todos los tamaños de pantalla
- **Accesibilidad**: Cumple estándares de accesibilidad web

## 🚀 Cómo usar

1. Abre el archivo `index.html` en tu navegador web
2. Utiliza la barra de búsqueda para encontrar voluntariados específicos
3. Filtra por región usando el selector desplegable
4. Haz clic en "Ver detalles" para más información
5. Haz clic en "Postular" para simular una postulación
6. Explora el repositorio de recursos en la parte inferior

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles (iOS/Android)

## 🔧 Personalización

### Colores
Los colores principales se pueden modificar en el archivo `styles.css`:

```css
:root {
  --brand-blue: #2151ff;
  --brand-blue-hover: #1a42e6;
  /* ... más variables */
}
```

### Contenido
Los datos de voluntariados se encuentran en el objeto `voluntariados` dentro del archivo `index.html`:

```javascript
const voluntariados = {
  'Nombre del voluntariado': {
    titulo: 'Título',
    descripcion: 'Descripción corta',
    organizacion: 'Organización',
    region: 'Región',
    fecha: 'DD-MM-YYYY',
    cupos: 25,
    detalles: 'HTML con detalles completos'
  }
};
```

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo. El logo de INJUV es propiedad del Instituto Nacional de la Juventud de Chile.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, por favor abre un issue primero para discutir qué te gustaría cambiar.

## 📞 Contacto

Para preguntas sobre este proyecto, contacta al desarrollador o visita el sitio oficial de INJUV: https://www.injuv.gob.cl
