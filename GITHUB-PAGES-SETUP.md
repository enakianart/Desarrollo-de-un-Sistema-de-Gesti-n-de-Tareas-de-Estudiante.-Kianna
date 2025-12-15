# 🚀 Guía de Publicación en GitHub Pages

## Paso 1: Preparar el Repositorio Local

```bash
# En la carpeta del proyecto
cd "Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna"

# Inicializar git (si aún no lo has hecho)
git init

# Agregar los archivos
git add .

# Commit inicial
git commit -m "Initial commit: Sistema de Gestión de Tareas con CRUD y responsividad"
```

## Paso 2: Crear Repositorio en GitHub

1. Abre https://github.com/new
2. Nombre: `Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna`
3. Descripción: `Sistema CRUD de Gestión de Tareas Académicas con HTML, CSS y JavaScript - Responsivo`
4. **Selecciona "Public"** (importante para Pages)
5. NO inicialices con README (ya tienes uno)
6. Click en **Create repository**

## Paso 3: Conectar con Remoto y Push

```bash
# Agregar remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna.git

# Cambiar a rama main (si es necesario)
git branch -M main

# Push al repositorio
git push -u origin main
```

## Paso 4: Configurar GitHub Pages

### Opción A: Automática (Recomendado)
1. En GitHub, ve a tu repositorio
2. Click en **Settings** (arriba a la derecha)
3. En el menú izquierdo, click en **Pages**
4. En "Source", selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**
6. **Espera 1-2 minutos** mientras GitHub construye la página

### Opción B: Acciones (Si Automatic no funciona)
1. Ve a **Actions** en tu repo
2. Selecciona un workflow (cualquier sugerencia)
3. Configura para publicar en Pages

## Paso 5: Verificar Publicación

1. Espera 2-3 minutos
2. Vuelve a **Settings → Pages**
3. Deberías ver un mensaje como:
   ```
   ✅ Your site is published at:
   https://tu-usuario.github.io/Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna/
   ```

4. **Click en el link** para ver tu sitio en vivo

## Paso 6: Agregar Link al Repositorio

1. Ve a la página principal de tu repositorio
2. Click en **Edit** (ícono de lápiz) en la descripción
3. En "Website", pega tu URL de GitHub Pages
4. Click en **Save**

---

## 📱 Probar en Diferentes Dispositivos

### Móvil
- Abre la URL en tu teléfono
- Redimensiona DevTools al tamaño de móvil

### Tablet
- DevTools: iPad (768x1024)
- Safari iPad real

### Desktop
- Navegador normal
- Redimensiona a 1920x1080

---

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

```bash
# 1. Hacer cambios locales
# 2. Agregar los cambios
git add .

# 3. Commit
git commit -m "Descripción del cambio"

# 4. Push a GitHub
git push origin main

# 5. Espera 1-2 minutos para que se actualice
```

---

## 🐛 Troubleshooting

### El sitio no aparece
- **Verificar Settings → Pages**: Debe estar habilitado
- **Rama correcta**: Asegúrate que sea `main` o `master`
- **Archivo index.html**: Debe estar en la raíz
- **Esperar más tiempo**: A veces toma hasta 5 minutos

### Cambios no se ven
- **Limpiar caché**: Ctrl+Shift+R (Chrome) o Cmd+Shift+R (Safari)
- **Verificar push**: `git log` debe mostrar tu último commit
- **Ver Actions**: En GitHub → Actions → workflow reciente

### MIME type error en estilos
- **Verificar archivo style.css**: Debe existir en la raíz
- **Verificar link en HTML**: `<link rel="stylesheet" href="style.css">`
- **Case sensitive**: `style.css` no `Style.css`

### Página en blanco
- Abre Console (F12) para ver errores
- Verifica que todos los archivos estén en la raíz
- Recarga la página completamente (Ctrl+Shift+R)

---

## 📊 URL Final

Tu aplicación estará en:
```
https://tu-usuario.github.io/Desarrollo-de-un-Sistema-de-Gesti-n-de-Tareas-de-Estudiante.-Kianna/
```

O versión corta (si configuras custom domain):
```
https://tudominio.com
```

---

## 🔐 Mantener Privado (Opcional)

Si no quieres que sea público:
1. **Settings → Visibility → Change to Private**
   (Nota: GitHub Pages requiere repositorio público para free)

---

## 📚 Recursos Adicionales

- [GitHub Pages Docs](https://docs.github.com/es/pages)
- [Git Basics](https://git-scm.com/book/es/v2)
- [GitHub CLI](https://cli.github.com/) (para línea de comandos)

---

## ✅ Checklist Final

- [x] Código probado localmente
- [x] Todos los archivos en la carpeta raíz
- [x] index.html presente
- [x] style.css cargado correctamente
- [x] script.js sin errores
- [x] tasks.json en la raíz (para semilla)
- [x] README.md documentado
- [x] Repositorio público en GitHub
- [x] GitHub Pages habilitado
- [x] URL funcionando

---

**¡Tu aplicación está lista para publicar en GitHub Pages!** 🎉
