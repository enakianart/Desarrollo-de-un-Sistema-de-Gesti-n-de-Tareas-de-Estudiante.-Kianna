# Sistema de Gestión de Tareas Académicas

**Gestor de Tareas** es una aplicación web progresiva para la gestión de tareas académicas con CRUD completo, persistencia en localStorage y un diseño responsive basado en tarjetas (cards).

## 🎯 Características Principales

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar tareas sin necesidad de backend
- 💾 **Persistencia en localStorage**: Los datos se guardan automáticamente en el navegador
- 📱 **Diseño Responsive**: Se adapta perfectamente a móvil (1 columna), tablet (2 columnas) y escritorio (3 columnas)
- 🎨 **Interfaz Moderna**: Tarjetas con efectos hover, badges de prioridad y estado
- 🔍 **Filtrado Inteligente**: Filtra por materia y por prioridad de forma combinable
- 📊 **Ordenamiento Flexible**: Ordena por fecha de entrega (ascendente/descendente) o por prioridad
- ⌨️ **Accesibilidad**: Soporte completo para navegación por teclado, etiquetas semánticas y contraste WCAG
- 🎯 **Validación de Formularios**: Validaciones en tiempo real con mensajes de error claros
- 🚀 **Sin Dependencias Externas**: Solo HTML, CSS y JavaScript vanilla (usa Font Awesome para íconos)

## 📦 Estructura del Proyecto

```
/
├── index.html              # Página principal con estructura HTML
├── style.css               # Estilos CSS responsive
├── script.js               # Lógica JavaScript del CRUD y gestión de estado
├── tasks.json              # Datos de semilla (ejemplo inicial)
├── README.md               # Este archivo
└── .gitignore              # Archivos a ignorar en git
```

## 🚀 Instalación y Uso Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/enakianart/Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna.git
cd Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna
```

### 2. Abrir en el navegador

**Opción A: Sin servidor (recomendado para desarrollo rápido)**
- Abre directamente el archivo `index.html` en tu navegador
- Las tareas se guardarán en localStorage automáticamente

**Opción B: Con servidor local (para simular un entorno de producción)**

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
http-server -p 8000

# Con PHP
php -S localhost:8000
```

Luego accede a `http://localhost:8000`

## 📚 Estructura de Datos (JSON)

Las tareas se almacenan en localStorage bajo la clave `taskManager.v1` con la siguiente estructura:

```json
{
  "version": 1,
  "tasks": [
    {
      "id": 1,
      "title": "Título de la tarea",
      "subject": "Materia/Área",
      "dueDate": "2025-03-05",
      "priority": "alta",
      "status": "pendiente",
      "description": "Descripción detallada de la tarea",
      "createdAt": "2025-02-20T15:00:00Z",
      "updatedAt": "2025-02-20T15:00:00Z",
      "completedAt": null
    }
  ]
}
```

### Campos:

| Campo | Tipo | Descripción | Valores Válidos |
|-------|------|-------------|-----------------|
| `id` | number | Identificador único (timestamp) | Auto-generado |
| `title` | string | Título de la tarea | 1-100 caracteres |
| `subject` | string | Materia o área académica | Libre (p.ej: "Historia", "Matemáticas") |
| `dueDate` | string | Fecha de entrega | Formato ISO: YYYY-MM-DD |
| `priority` | string | Nivel de prioridad | "alta", "media", "baja" |
| `status` | string | Estado de la tarea | "pendiente", "completada", "retrasada" |
| `description` | string | Descripción detallada | 1-1000 caracteres |
| `createdAt` | string | Timestamp de creación | ISO 8601 |
| `updatedAt` | string | Timestamp de última edición | ISO 8601 |
| `completedAt` | string \| null | Timestamp de finalización | ISO 8601 o null |

## 🎨 Paleta de Colores

```css
--primary-color: #5b48e3      /* Púrpura principal */
--priority-alta: #ff4d4f      /* Rojo */
--priority-media: #ffc53d     /* Naranja */
--priority-baja: #52c41a      /* Verde */
--status-pendiente: #1890ff   /* Azul */
--status-completada: #52c41a  /* Verde */
--status-retrasada: #ff7875   /* Rojo claro */
```

## 📱 Responsividad

| Dispositivo | Ancho | Columnas | Comportamiento |
|-------------|-------|----------|---|
| **Escritorio** | ≥ 1024px | 3 | Grid de 3 columnas |
| **Tablet** | 768–1023px | 2 | Grid de 2 columnas |
| **Móvil** | ≤ 767px | 1 | Stack en una columna |

## 🔍 Funcionalidades Detalladas

### Crear Tarea

1. Haz clic en el botón **"Nueva Tarea"** en la esquina superior derecha
2. Rellena todos los campos obligatorios:
   - Título (máx 100 caracteres)
   - Materia/Área
   - Fecha de Entrega
   - Prioridad (Alta/Media/Baja)
   - Descripción (máx 1000 caracteres)
3. Haz clic en **"Guardar Tarea"**
4. La tarea aparecerá inmediatamente en la cuadrícula

### Leer y Visualizar

- Las tareas se muestran en tarjetas organizadas por grid responsive
- Cada tarjeta muestra:
  - Título en negrita
  - Badges de prioridad y estado con colores diferenciados
  - Materia/Área en color púrpura
  - Fecha de entrega en formato DD/MM/YYYY
  - Vista previa de la descripción (primeros 150 caracteres)

### Editar Tarea

1. Haz clic en **"Editar"** en cualquier tarjeta
2. Se abrirá el modal con todos los datos precargados
3. Modifica los campos deseados
4. Haz clic en **"Guardar Tarea"**
5. Los cambios se aplican inmediatamente

### Eliminar Tarea

1. Haz clic en **"Eliminar"** en la tarjeta
2. Confirma la acción en el diálogo que aparece
3. La tarea se eliminará de forma permanente

### Filtrar Tareas

**Por Materia:**
- Abre el desplegable "Por Materia"
- Selecciona una materia para ver solo tareas de esa asignatura
- Selecciona "Todas" para ver todas las tareas

**Por Prioridad:**
- Abre el desplegable "Por Prioridad"
- Selecciona Alta, Media o Baja
- Los filtros se pueden combinar

### Ordenar Tareas

Usa el desplegable "Ordenar por" para cambiar el orden:
- **Fecha (próxima primero)**: Ordena de forma ascendente por fecha de entrega
- **Fecha (lejana primero)**: Ordena de forma descendente por fecha de entrega
- **Prioridad (Alta → Baja)**: Agrupa por nivel de prioridad

## 🎯 Determinación Automática de Estado

El sistema determina automáticamente el estado basándose en:

- **Pendiente**: Tarea sin completar y con fecha futura
- **Completada**: Tarea marcada explícitamente como completada
- **Retrasada**: Tarea sin completar con fecha anterior a hoy

*Nota: El estado se recalcula en cada carga para reflejar la realidad actual.*

## ⌨️ Navegación por Teclado

- **Tab**: Navega entre elementos
- **Shift + Tab**: Navega hacia atrás
- **Enter**: Activa botones y envía formularios
- **Escape**: Cierra modales
- **Space**: Activa checkboxes y botones

## 🔒 Almacenamiento de Datos

- Los datos se guardan **automáticamente** en `localStorage` tras cada acción (crear, editar, eliminar)
- **No se requiere sincronización con servidor**
- Los datos persisten incluso después de cerrar el navegador
- Si deseas resetear los datos, borra el localStorage: `localStorage.clear()`

## 🎓 Ejemplos de Tareas Incluidas

Al abrir la aplicación por primera vez, se cargan 3 tareas de ejemplo:

1. **Resumen capítulo 3** (Historia) - Alta prioridad, 5 de Marzo
2. **Ejercicios 5–10** (Matemáticas) - Media prioridad, 28 de Febrero (retrasada)
3. **Proyecto final de Programación** - Alta prioridad, 15 de Marzo

## 📊 Validaciones

El sistema valida todos los siguientes aspectos:

- ✅ Título requerido (no vacío)
- ✅ Materia requerida
- ✅ Fecha de entrega válida (formato ISO)
- ✅ Prioridad seleccionada
- ✅ Descripción requerida (no vacía)
- ✅ Longitud máxima de descripción (1000 caracteres)
- ✅ Confirmación antes de eliminar

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages:

1. **Requisitos**: Tu repositorio debe ser público
2. **Acceso**: Ve a `Settings` → `Pages` en tu repositorio
3. **Rama**: Selecciona `main` como rama de publicación
4. **Espera**: GitHub Pages se actualizará en 1-2 minutos
5. **URL**: Tu aplicación estará disponible en `https://tu-usuario.github.io/nombre-del-repo`

## 🛠️ Stack Técnico

- **HTML5** Semántico con `<section>`, `<article>`, `<button>`, `<label>`
- **CSS3** con variables CSS, Grid, Flexbox y media queries
- **JavaScript ES6+** (Arrow functions, destructuring, template literals)
- **Font Awesome 6.4.0** para iconografía
- **Web APIs**: localStorage, localStorage.getItem/setItem
- **Sin frameworks**: Vanilla JavaScript puro para máxima compatibilidad

## 📈 Compatibilidad de Navegadores

✅ Chrome/Edge (versión 60+)
✅ Firefox (versión 55+)
✅ Safari (versión 12+)
✅ Mobile Safari (iOS 12+)
✅ Chrome Mobile (Android)

## 💡 Decisiones de Diseño

### 1. **Arquitectura sin Framework**
Se eligió JavaScript vanilla para máxima portabilidad y sin dependencias. Ideal para proyectos académicos y fácil de mantener.

### 2. **localStorage como BD**
Se utilizó localStorage en lugar de un servidor porque:
- No requiere backend
- Datos persisten en el navegador
- Suficiente para 100+ tareas
- No hay latencia de red

### 3. **Grid 3-2-1 Responsive**
El diseño se adapta naturalmente en breakpoints estándar:
- 1024px para desktop
- 768px para tablet
- <768px para móvil

### 4. **IDs con Timestamp**
Se usa `Date.now()` para generar IDs únicos, garantizando que no haya colisiones en la práctica.

### 5. **Validación en Cliente**
Todas las validaciones ocurren en el navegador para una experiencia más rápida.

## 🐛 Limitaciones Conocidas

- **Máximo recomendado de tareas**: ~500 (localStorage típicamente permite 5-10MB)
- **Sin sincronización multi-dispositivo**: Cada navegador tiene su propio localStorage
- **Sin historial de cambios**: Se guarda el estado actual, no versiones previas
- **Sin imágenes o adjuntos**: Solo texto
- **Sin categorías anidadas**: Solo un nivel de materia

## 📝 Ejemplo de Uso

```javascript
// Ver tareas actuales en la consola
console.log(JSON.parse(localStorage.getItem('taskManager.v1')));

// Limpiar todos los datos (cuidado: ¡irreversible!)
localStorage.removeItem('taskManager.v1');
```

## 🤝 Contribuciones

Este es un proyecto educativo. Si deseas mejorarlo:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/mi-mejora`)
3. Commit tus cambios (`git commit -m 'Agrega mi mejora'`)
4. Push a la rama (`git push origin feature/mi-mejora`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo `LICENSE` para detalles.

## 👤 Autor

**Kianna** - Diciembre 2025

## 📞 Soporte

Si encuentras problemas:

1. Verifica la consola del navegador (F12) para errores
2. Intenta limpiar localStorage: `localStorage.clear()`
3. Abre un issue en GitHub con detalles

## 🔗 Enlaces Útiles

- [Repositorio en GitHub](https://github.com/enakianart/Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna)
- [localStorage MDN](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [Grid CSS MDN](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Grid_Layout)

---

**Creado con ❤️ para educadores y estudiantes**

## Notas

- La aplicación mantiene los datos en `localStorage`. Para limpiar: abrir DevTools → `Application` → `Local Storage` → eliminar la clave `tasky_tasks`.
- Si usas `file://` para abrir `index.html`, la import desde `tasks.json` puede fallar por restricciones CORS; usa un servidor local (p. ej. extensión Live Server de VS Code o `python -m http.server`).

Si quieres, puedo:
- Añadir validaciones más estrictas al importar JSON.
- Crear tests básicos o un script `npm` para correr un servidor local.
- Ayudarte a preparar el repo y publicar en GitHub Pages (necesitaré permiso para acceder al repo o acciones que tú ejecutes).
