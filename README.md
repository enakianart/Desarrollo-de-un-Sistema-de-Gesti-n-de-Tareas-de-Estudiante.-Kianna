# Tasky — Sistema de Gestión de Tareas Académicas

Pequeña aplicación Kanban en HTML/CSS/Vanilla JS que implementa CRUD sobre una estructura JSON en el navegador y guarda en `localStorage`.

## Estructura del proyecto

- `index.html` — Interfaz principal.
- `style.css` — Estilos (responsive: 3/2/1 columnas).
- `script.js` — Lógica: CRUD, render, persistencia, import/export JSON, filtros y ordenamiento.
- `tasks.json` — Ejemplo de tareas (puede importarse al app).

## Formato JSON de las tareas

Cada tarea es un objeto con los siguientes campos:

- `id` (string): identificador único.
- `title` (string): título de la tarea.
- `description` (string): descripción completa.
- `deliveryDate` (string, ISO): fecha de entrega, p. ej. `2025-12-23`.
- `materia` (string): materia o área.
- `priority` (string): `alta` | `media` | `baja`.
- `status` (string): `in-progress` | `completed` | `overdue`.

Ejemplo:

```json
{
  "id": "task-1",
  "title": "User Flow",
  "description": "Diseñar la interfaz principal...",
  "deliveryDate": "2025-12-23",
  "materia": "UX Design",
  "priority": "alta",
  "status": "in-progress"
}
```

## Cómo usar localmente

1. Abrir `index.html` en el navegador (doble clic o `Live Server`).
2. Si no hay datos en `localStorage`, la app intentará cargar `tasks.json`.
3. Crear tareas con el botón `Add task`.
4. Editar o eliminar con los iconos de la tarjeta.
5. Buscar con la barra superior, filtrar por prioridad o materia, y ordenar con `Sort`.

## Publicación en GitHub Pages

1. Crear un repositorio nuevo en GitHub y subir estos archivos.
2. En la configuración del repo -> Pages, seleccionar la rama `main` (o `master`) y la carpeta `/`.
3. Guardar; GitHub Pages publicará la web — la URL aparecerá en la misma página de configuración.

## Notas

- La aplicación mantiene los datos en `localStorage`. Para limpiar: abrir DevTools → `Application` → `Local Storage` → eliminar la clave `tasky_tasks`.
- Si usas `file://` para abrir `index.html`, la import desde `tasks.json` puede fallar por restricciones CORS; usa un servidor local (p. ej. extensión Live Server de VS Code o `python -m http.server`).

Si quieres, puedo:
- Añadir validaciones más estrictas al importar JSON.
- Crear tests básicos o un script `npm` para correr un servidor local.
- Ayudarte a preparar el repo y publicar en GitHub Pages (necesitaré permiso para acceder al repo o acciones que tú ejecutes).
