// --- 1. CONFIGURACIÓN Y PERSISTENCIA DE DATOS ---
const STORAGE_KEY = 'tasky_tasks';
let tasks = []; // Nuestro JSON (el arreglo principal)

// URL local de JSON de ejemplo (se incluye tasks.json en el repo)
const DEFAULT_JSON = 'tasks.json';
// Estado de filtros/orden
let currentFilter = { priority: 'all', materia: 'all' };
let currentSort = 'none'; // 'none' | 'date-asc' | 'date-desc' | 'priority'
let searchTerm = '';

// Referencias del DOM
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const boardColumns = {
    'in-progress': document.getElementById('task-list-in-progress'),
    'completed': document.getElementById('task-list-completed'),
    'overdue': document.getElementById('task-list-overdue'),
};
const countElements = {
    'in-progress': document.getElementById('count-in-progress'),
    'completed': document.getElementById('count-completed'),
    'overdue': document.getElementById('count-overdue'),
};


// Cargar tareas desde localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    } else {
        // Intentar cargar tasks.json del servidor/workspace
        fetch(DEFAULT_JSON)
            .then(res => {
                if (!res.ok) throw new Error('No se encontró ' + DEFAULT_JSON);
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    tasks = data;
                    saveTasks();
                    renderTasks();
                } else {
                    throw new Error('Formato JSON inválido');
                }
            })
            .catch(err => {
                // Fallback: tarea de ejemplo mínima
                tasks = [
                    { id: Date.now().toString() + 'a', title: 'User Flow', description: 'Diseñar la interfaz...', deliveryDate: '2025-12-23', materia: 'UX Design', priority: 'alta', status: 'in-progress' }
                ];
                saveTasks();
                renderTasks();
            });
}

// Utilidades
function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function shorten(text, max) {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Crear tarjeta como elemento DOM (más seguro que innerHTML)
function createTaskElement(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status}`;
    card.dataset.id = task.id;
    card.dataset.priority = task.priority;

    const header = document.createElement('div');
    header.className = 'card-header';

    const priorityTag = document.createElement('span');
    priorityTag.className = 'priority-tag';
    priorityTag.dataset.priority = task.priority;
    priorityTag.textContent = task.priority;

    const due = document.createElement('span');
    due.className = 'due-date';
    due.textContent = formatDateShort(task.deliveryDate);

    const materia = document.createElement('span');
    materia.className = 'materia-tag';
    materia.textContent = task.materia;

    header.append(priorityTag, due, materia);

    const details = document.createElement('div');
    details.className = 'card-details';

    const h4 = document.createElement('h4');
    h4.textContent = task.title;

    const desc = document.createElement('p');
    desc.className = 'card-description';
    desc.textContent = shorten(task.description, 140);

    const readBtn = document.createElement('button');
    readBtn.className = 'read-more-btn';
    readBtn.type = 'button';
    readBtn.textContent = 'Ver más';
    readBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleReadMoreElement(readBtn, task.id); });

    details.append(h4, desc, readBtn);

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const delBtn = document.createElement('button');
    delBtn.title = 'Eliminar';
    delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    delBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteTask(task.id, e); });

    const editBtn = document.createElement('button');
    editBtn.title = 'Editar';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', (e) => { e.stopPropagation(); openEditModal(task.id, e); });

    const checkBtn = document.createElement('button');
    checkBtn.title = 'Marcar/Desmarcar';
    checkBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    checkBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleCompleted(task.id, e); });

    actions.append(delBtn, editBtn, checkBtn);
    footer.appendChild(actions);

    // Abrir modal al hacer click en la tarjeta
    card.addEventListener('click', () => openEditModal(task.id));

    card.append(header, details, footer);
    return card;
}

function toggleReadMoreElement(btn, taskId) {
    const card = btn.closest('.task-card');
    const desc = card.querySelector('.card-description');
    const full = tasks.find(t => t.id === taskId)?.description || '';
    if (btn.dataset.expanded === '1') {
        desc.textContent = shorten(full, 140);
        btn.textContent = 'Ver más';
        btn.dataset.expanded = '0';
    } else {
        desc.textContent = full;
        btn.textContent = 'Ver menos';
        btn.dataset.expanded = '1';
    }
}

function toggleReadMore(btn, taskId) {
    const card = btn.closest('.task-card');
    const desc = card.querySelector('.card-description');
    const full = tasks.find(t => t.id === taskId)?.description || '';
    if (btn.dataset.expanded === '1') {
        desc.textContent = shorten(full, 140);
        btn.textContent = 'Ver más';
        btn.dataset.expanded = '0';
    } else {
        desc.textContent = full;
        btn.textContent = 'Ver menos';
        btn.dataset.expanded = '1';
    }
}

// Función principal para dibujar las tareas en el tablero
function renderTasks() {
    // 1. Limpiar columnas y resetear contadores
    Object.values(boardColumns).forEach(list => list.innerHTML = '');
    let counts = { 'in-progress': 0, 'completed': 0, 'overdue': 0 };

    // 2. Aplicar búsqueda, filtros y ordenamiento
    let visible = tasks.slice();

    // Búsqueda (titulo, descripción, materia)
    if (searchTerm && searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        visible = visible.filter(t => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q) || (t.materia || '').toLowerCase().includes(q));
    }

    // Filtro prioridad
    if (currentFilter.priority && currentFilter.priority !== 'all') {
        visible = visible.filter(t => t.priority === currentFilter.priority);
    }

    // Filtro materia
    if (currentFilter.materia && currentFilter.materia !== 'all') {
        visible = visible.filter(t => t.materia === currentFilter.materia);
    }

    // Ordenamiento
    if (currentSort === 'date-asc') {
        visible.sort((a,b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
    } else if (currentSort === 'date-desc') {
        visible.sort((a,b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));
    } else if (currentSort === 'priority') {
        const weight = p => p === 'alta' ? 3 : p === 'media' ? 2 : 1;
        visible.sort((a,b) => weight(b.priority) - weight(a.priority));
    }

    // 3. Dibujar tareas filtradas (usar elementos DOM para seguridad y rendimiento)
    const fragments = { 'in-progress': document.createDocumentFragment(), 'completed': document.createDocumentFragment(), 'overdue': document.createDocumentFragment() };
    visible.forEach(task => {
        const el = createTaskElement(task);
        const column = boardColumns[task.status];
        if (column) {
            fragments[task.status].appendChild(el);
            counts[task.status]++;
        }
    });
    Object.keys(fragments).forEach(k => boardColumns[k].appendChild(fragments[k]));

    // 3. Actualizar contadores
    Object.keys(counts).forEach(status => {
        countElements[status].textContent = counts[status];
    });

    // Actualizar lista de materias para filtro (dinámica)
    updateMateriaFilters();
}

function updateMateriaFilters() {
    // coger materias únicas y añadir al dropdown si no existe
    const linksContainer = document.querySelector('.filter-content');
    if (!linksContainer) return;
    // eliminar materias previas (marcadas como data-materia)
    Array.from(linksContainer.querySelectorAll('a[data-materia]')).forEach(n => n.remove());
    const materias = Array.from(new Set(tasks.map(t => t.materia).filter(Boolean)));
    materias.forEach(m => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = m;
        a.dataset.materia = m;
        a.addEventListener('click', e => { e.preventDefault(); currentFilter.materia = m; renderTasks(); });
        linksContainer.appendChild(a);
    });
}


// --- 3. FUNCIONES CRUD Y MANIPULACIÓN DE TAREAS ---

/**
 * Función que se ejecuta al enviar el formulario (Crear o Actualizar).
 * @param {Event} e - Evento de formulario.
 */
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = taskIdInput.value;
    
    // Recolectar datos del formulario (usar elementos cacheados)
    const newTaskData = {
        title: taskTitleInput.value.trim(),
        description: taskDescriptionInput.value.trim(),
        deliveryDate: taskDeliveryInput.value,
        materia: taskMateriaInput.value.trim(),
        priority: taskPrioritySelect.value,
        status: taskStatusSelect.value,
    };

    // Validaciones mínimas
    if (!newTaskData.title) { alert('El título es obligatorio'); taskTitleInput.focus(); return; }
    if (!newTaskData.deliveryDate) { alert('La fecha de entrega es obligatoria'); taskDeliveryInput.focus(); return; }
    if (!newTaskData.materia) { alert('La materia/área es obligatoria'); taskMateriaInput.focus(); return; }

    if (id) {
        // A. ACTUALIZAR (Update)
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex] = { id: id, ...newTaskData }; // Mantiene el ID y actualiza el resto
        }
        console.log(`Tarea ${id} actualizada.`);
    } else {
        // B. REGISTRAR (Create)
        const newId = Date.now().toString(); 
        const newTask = { id: newId, ...newTaskData };
        tasks.push(newTask);
        console.log(`Nueva tarea ${newId} registrada.`);
    }

    saveTasks(); // 1. Actualiza localStorage
    renderTasks(); // 2. Vuelve a dibujar la interfaz
    closeModal('taskFormModal'); // 3. Cierra el modal
});

/**
 * Abre el modal y precarga los datos para editar (Update - parte 1).
 * @param {string} taskId - ID de la tarea a editar.
 * @param {Event} e - Evento (para detener la burbuja si es necesario).
 */
function openEditModal(taskId, e) {
    if (e) e.stopPropagation(); // Evita clics en elementos subyacentes

    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Cargar datos en el formulario
        document.getElementById('modal-title').textContent = 'Editar';
        taskIdInput.value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-delivery-date').value = task.deliveryDate;
        document.getElementById('task-materia').value = task.materia;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;
        
        openModal('taskFormModal'); // Abre el modal
    }
}

/**
 * Elimina la tarea del JSON y actualiza el DOM (Delete).
 * @param {string} taskId - ID de la tarea a eliminar.
 * @param {Event} e - Evento (para detener la burbuja si es necesario).
 */
function deleteTask(taskId, e) {
    if (e) e.stopPropagation(); 
    if (confirm('¿Está seguro de que desea eliminar esta tarea? Esta acción es irreversible.')) {
        // Filtrar: devuelve un nuevo arreglo sin la tarea con ese ID
        tasks = tasks.filter(task => task.id !== taskId); 
        
        saveTasks(); // 1. Actualiza localStorage
        renderTasks(); // 2. Vuelve a dibujar la interfaz
    }
}

/**
 * Cambia el estado de la tarea (ej. de 'in-progress' a 'completed').
 * @param {string} taskId - ID de la tarea a modificar.
 * @param {Event} e - Evento (para detener la burbuja si es necesario).
 */
function toggleCompleted(taskId, e) {
    if (e) e.stopPropagation(); 
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        task.status = (task.status === 'completed') ? 'in-progress' : 'completed';
        
        saveTasks();
        renderTasks(); // El renderizado moverá la tarjeta a la columna correcta
    }
}

// --- 4. IMPORT/EXPORT JSON ---




// Funciones de control de Modal (se mantienen simples)
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    if(modalId === 'taskFormModal' && taskIdInput.value === '') {
         // Configurar para CREACIÓN si no hay ID
        document.getElementById('modal-title').textContent = 'Registrar';
    }
}

function openCreateModal() {
    // Asegurar estado limpio para creación
    taskForm.reset();
    taskIdInput.value = '';
    document.getElementById('modal-title').textContent = 'Registrar';
    openModal('taskFormModal');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    taskForm.reset(); // Limpia el formulario al cerrar
    taskIdInput.value = ''; // Asegura que el ID oculto se borre
}

// Inicialización de la aplicación
function initApp() {
    // Cargar tareas (desde localStorage o tasks.json)
    loadTasks();

    // (Import/Export removed)

    // Buscador
    const searchInput = document.getElementById('search-tasks');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => { searchTerm = e.target.value; renderTasks(); });
    }

    // Filtros rápidos (prioridad)
    document.querySelectorAll('.filter-content a[data-filter]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const f = a.dataset.filter;
            currentFilter.priority = f === 'all' ? 'all' : f;
            renderTasks();
        });
    });

    // Botón sort: ciclo de estados
    const sortBtn = document.getElementById('sort-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            if (currentSort === 'none') currentSort = 'date-asc';
            else if (currentSort === 'date-asc') currentSort = 'date-desc';
            else if (currentSort === 'date-desc') currentSort = 'priority';
            else currentSort = 'none';
            sortBtn.innerHTML = `<i class="fas fa-sort-amount-down"></i> Sort (${currentSort})`;
            renderTasks();
        });
    }
}

document.addEventListener('DOMContentLoaded', initApp);