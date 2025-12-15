// ====================================================
// SISTEMA DE GESTIÓN DE TAREAS ACADÉMICAS
// ====================================================

// --- CONFIGURACIÓN Y CONSTANTES ---
const STORAGE_KEY = 'taskManager.v1';

let tasks = [];
let currentEditingId = null;
let currentSort = 'date-asc';
let currentFilterSubject = '';
let currentFilterPriority = '';
let deleteConfirmationId = null;

// Referencias del DOM
const taskModal = document.getElementById('task-modal');
const confirmModal = document.getElementById('confirm-modal');
const taskForm = document.getElementById('task-form');
const newTaskBtn = document.getElementById('new-task-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const confirmCancelBtn = document.getElementById('confirm-cancel');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const tasksGrid = document.getElementById('tasks-grid');
const emptyState = document.getElementById('empty-state');
const emptyCTA = document.getElementById('empty-cta-btn');

// Inputs del formulario
const fieldTitle = document.getElementById('field-title');
const fieldSubject = document.getElementById('field-subject');
const fieldPriority = document.getElementById('field-priority');
const fieldDueDate = document.getElementById('field-duedate');
const fieldDescription = document.getElementById('field-description');

// Selectores de filtros y orden
const filterSubjectSelect = document.getElementById('filter-subject');
const filterPrioritySelect = document.getElementById('filter-priority');
const sortSelect = document.getElementById('sort-select');

// --- PERSISTENCIA EN LOCALSTORAGE ---

/**
 * Carga las tareas desde localStorage
 */
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            console.error('Error al parsear localStorage:', e);
            tasks = getSeedData();
            saveTasks();
        }
    } else {
        // Primer uso: cargar datos de semilla
        tasks = getSeedData();
        saveTasks();
    }
}

/**
 * Guarda las tareas en localStorage
 */
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Datos de semilla (tareas de ejemplo)
 */
function getSeedData() {
    return [
        {
            id: 1,
            title: 'Resumen capítulo 3',
            subject: 'Historia',
            dueDate: '2025-03-05',
            priority: 'alta',
            status: 'pendiente',
            description: 'Elaborar un resumen de 2 páginas del capítulo 3 sobre la Revolución Francesa. Incluir contexto histórico, causas principales y consecuencias.',
            createdAt: new Date('2025-02-20T15:00:00Z').toISOString(),
            updatedAt: new Date('2025-02-20T15:00:00Z').toISOString(),
            completedAt: null
        },
        {
            id: 2,
            title: 'Ejercicios 5–10',
            subject: 'Matemáticas',
            dueDate: '2025-02-28',
            priority: 'media',
            status: 'retrasada',
            description: 'Resolver ejercicios de ecuaciones cuadráticas. Usar fórmula general y verificar resultados por sustitución.',
            createdAt: new Date('2025-02-10T12:00:00Z').toISOString(),
            updatedAt: new Date('2025-03-01T09:00:00Z').toISOString(),
            completedAt: null
        },
        {
            id: 3,
            title: 'Proyecto final de Programación',
            subject: 'Programación',
            dueDate: '2025-03-15',
            priority: 'alta',
            status: 'pendiente',
            description: 'Crear un sistema de gestión de tareas en HTML/CSS/JavaScript. Debe incluir CRUD completo, localStorage y diseño responsive.',
            createdAt: new Date('2025-02-15T10:30:00Z').toISOString(),
            updatedAt: new Date('2025-02-15T10:30:00Z').toISOString(),
            completedAt: null
        }
    ];
}

// --- UTILIDADES ---

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato legible (DD/MM/YYYY)
 */
function formatDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Determina el estado de una tarea (pendiente, completada, retrasada)
 */
function determineStatus(task) {
    if (task.status === 'completada') return 'completada';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate + 'T00:00:00');
    
    if (dueDate < today) return 'retrasada';
    return 'pendiente';
}

/**
 * Obtiene todas las materias únicas del listado de tareas
 */
function getUniqueSubjects() {
    return [...new Set(tasks.map(t => t.subject).filter(Boolean))].sort();
}

/**
 * Trunca texto a longitud máxima
 */
function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// --- RENDERIZADO ---

/**
 * Renderiza todas las tareas aplicando filtros y orden
 */
function renderTasks() {
    let filtered = tasks.slice();
    
    // Aplicar filtros
    if (currentFilterSubject) {
        filtered = filtered.filter(t => t.subject === currentFilterSubject);
    }
    if (currentFilterPriority) {
        filtered = filtered.filter(t => t.priority === currentFilterPriority);
    }
    
    // Aplicar orden
    filtered.sort((a, b) => {
        if (currentSort === 'date-asc') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (currentSort === 'date-desc') {
            return new Date(b.dueDate) - new Date(a.dueDate);
        } else if (currentSort === 'priority') {
            const priorityMap = { alta: 3, media: 2, baja: 1 };
            return priorityMap[b.priority] - priorityMap[a.priority];
        }
        return 0;
    });
    
    // Limpiar grid
    tasksGrid.innerHTML = '';
    
    // Mostrar u ocultar estado vacío
    if (filtered.length === 0) {
        emptyState.classList.add('show');
        tasksGrid.style.display = 'none';
    } else {
        emptyState.classList.remove('show');
        tasksGrid.style.display = 'grid';
        
        // Renderizar tarjetas
        filtered.forEach(task => {
            const card = createTaskCard(task);
            tasksGrid.appendChild(card);
        });
    }
    
    // Actualizar opciones de materias
    updateSubjectFilters();
}

/**
 * Crea un elemento de tarjeta de tarea
 */
function createTaskCard(task) {
    const status = determineStatus(task);
    const card = document.createElement('article');
    card.className = `task-card priority-${task.priority}`;
    card.dataset.taskId = task.id;
    
    // Badges
    const badges = document.createElement('div');
    badges.className = 'card-badges';
    
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `badge badge-priority ${task.priority}`;
    priorityBadge.innerHTML = `<i class="fas fa-${getPriorityIcon(task.priority)}"></i> ${task.priority}`;
    
    const statusBadge = document.createElement('span');
    statusBadge.className = `badge badge-status ${status}`;
    statusBadge.innerHTML = `${getStatusLabel(status)}`;
    
    badges.appendChild(priorityBadge);
    badges.appendChild(statusBadge);
    
    // Header
    const header = document.createElement('div');
    header.className = 'card-header';
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = task.title;
    header.appendChild(title);
    header.appendChild(badges);
    
    // Meta (materia y fecha)
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    
    const subject = document.createElement('span');
    subject.className = 'card-subject';
    subject.textContent = task.subject;
    
    const date = document.createElement('span');
    date.className = 'card-date';
    date.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formatDate(task.dueDate)}`;
    
    meta.appendChild(subject);
    meta.appendChild(date);
    
    // Descripción
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = truncateText(task.description, 150);
    
    // Acciones
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    
    const btnEdit = document.createElement('button');
    btnEdit.type = 'button';
    btnEdit.className = 'btn-card';
    btnEdit.innerHTML = '<i class="fas fa-edit"></i> Editar';
    btnEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(task.id);
    });
    
    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.className = 'btn-card danger';
    btnDelete.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar';
    btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteConfirm(task.id);
    });
    
    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);
    
    // Ensamblar tarjeta
    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(description);
    card.appendChild(actions);
    
    return card;
}

/**
 * Obtiene el ícono de Font Awesome para cada prioridad
 */
function getPriorityIcon(priority) {
    const icons = {
        alta: 'exclamation-circle',
        media: 'minus-circle',
        baja: 'check-circle'
    };
    return icons[priority] || 'circle';
}

/**
 * Obtiene la etiqueta legible de estado
 */
function getStatusLabel(status) {
    const labels = {
        pendiente: 'Pendiente',
        completada: 'Completada',
        retrasada: 'Retrasada'
    };
    return labels[status] || status;
}

/**
 * Actualiza las opciones del filtro de materias
 */
function updateSubjectFilters() {
    const subjects = getUniqueSubjects();
    const currentValue = filterSubjectSelect.value;
    
    // Preservar opción vacía
    filterSubjectSelect.innerHTML = '<option value="">Todas</option>';
    
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        filterSubjectSelect.appendChild(option);
    });
    
    filterSubjectSelect.value = currentValue;
}

// --- CRUD OPERATIONS ---

/**
 * Valida los datos del formulario
 */
function validateForm() {
    const errors = [];
    
    if (!fieldTitle.value.trim()) {
        errors.push('El título es obligatorio');
    }
    
    if (!fieldSubject.value.trim()) {
        errors.push('La materia/área es obligatoria');
    }
    
    if (!fieldDueDate.value) {
        errors.push('La fecha de entrega es obligatoria');
    }
    
    if (!fieldPriority.value) {
        errors.push('La prioridad es obligatoria');
    }
    
    if (!fieldDescription.value.trim()) {
        errors.push('La descripción es obligatoria');
    }
    
    if (fieldDescription.value.length > 1000) {
        errors.push('La descripción no puede exceder 1000 caracteres');
    }
    
    return errors;
}

/**
 * Limpia el formulario
 */
function resetForm() {
    taskForm.reset();
    currentEditingId = null;
    document.getElementById('field-title').value = '';
    document.getElementById('field-subject').value = '';
    document.getElementById('field-priority').value = '';
    document.getElementById('field-duedate').value = '';
    document.getElementById('field-description').value = '';
    updateCharCount();
}

/**
 * Abre el modal para crear una nueva tarea
 */
function openCreateModal() {
    currentEditingId = null;
    document.getElementById('modal-title').textContent = 'Nueva Tarea';
    resetForm();
    taskModal.classList.add('show');
    fieldTitle.focus();
}

/**
 * Abre el modal para editar una tarea existente
 */
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentEditingId = taskId;
    document.getElementById('modal-title').textContent = 'Editar Tarea';
    
    fieldTitle.value = task.title;
    fieldSubject.value = task.subject;
    fieldPriority.value = task.priority;
    fieldDueDate.value = task.dueDate;
    fieldDescription.value = task.description;
    updateCharCount();
    
    taskModal.classList.add('show');
    fieldTitle.focus();
}

/**
 * Cierra el modal de tareas
 */
function closeTaskModal() {
    taskModal.classList.remove('show');
    resetForm();
}

/**
 * Abre el diálogo de confirmación para eliminar
 */
function openDeleteConfirm(taskId) {
    deleteConfirmationId = taskId;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('confirm-message').textContent = 
            `¿Estás seguro de que deseas eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`;
        confirmModal.classList.add('show');
    }
}

/**
 * Cierra el modal de confirmación
 */
function closeConfirmModal() {
    confirmModal.classList.remove('show');
    deleteConfirmationId = null;
}

/**
 * Procesa el formulario (crear o actualizar)
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar
    const errors = validateForm();
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }
    
    if (currentEditingId) {
        // Actualizar tarea existente
        const task = tasks.find(t => t.id === currentEditingId);
        if (task) {
            task.title = fieldTitle.value.trim();
            task.subject = fieldSubject.value.trim();
            task.priority = fieldPriority.value;
            task.dueDate = fieldDueDate.value;
            task.description = fieldDescription.value.trim();
            task.updatedAt = new Date().toISOString();
        }
    } else {
        // Crear nueva tarea
        const newTask = {
            id: Date.now(),
            title: fieldTitle.value.trim(),
            subject: fieldSubject.value.trim(),
            dueDate: fieldDueDate.value,
            priority: fieldPriority.value,
            status: 'pendiente',
            description: fieldDescription.value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null
        };
        tasks.push(newTask);
    }
    
    saveTasks();
    renderTasks();
    closeTaskModal();
}

/**
 * Elimina una tarea
 */
function handleDeleteConfirm() {
    if (deleteConfirmationId) {
        tasks = tasks.filter(t => t.id !== deleteConfirmationId);
        saveTasks();
        renderTasks();
        closeConfirmModal();
    }
}

// --- EVENT LISTENERS ---

// Botón nueva tarea
newTaskBtn.addEventListener('click', openCreateModal);
emptyCTA.addEventListener('click', openCreateModal);

// Cerrar modal
closeModalBtn.addEventListener('click', closeTaskModal);
cancelBtn.addEventListener('click', closeTaskModal);

// Tecla ESC para cerrar modales
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTaskModal();
        closeConfirmModal();
    }
});

// Cerrar modal al hacer clic fuera
taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) closeTaskModal();
});

confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) closeConfirmModal();
});

// Formulario
taskForm.addEventListener('submit', handleFormSubmit);

// Confirmación de eliminación
confirmCancelBtn.addEventListener('click', closeConfirmModal);
confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);

// Contadores de caracteres
fieldTitle.addEventListener('input', updateCharCount);
fieldDescription.addEventListener('input', updateCharCount);

function updateCharCount() {
    const titleCount = document.querySelector('.task-form .form-group:nth-child(1) .char-count');
    const descCount = document.querySelector('.task-form .form-group:nth-child(5) .char-count');
    
    if (titleCount) titleCount.textContent = `${fieldTitle.value.length}/100`;
    if (descCount) descCount.textContent = `${fieldDescription.value.length}/1000`;
}

// Filtros y orden
filterSubjectSelect.addEventListener('change', (e) => {
    currentFilterSubject = e.target.value;
    renderTasks();
});

filterPrioritySelect.addEventListener('change', (e) => {
    currentFilterPriority = e.target.value;
    renderTasks();
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTasks();
});

// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateCharCount();
});