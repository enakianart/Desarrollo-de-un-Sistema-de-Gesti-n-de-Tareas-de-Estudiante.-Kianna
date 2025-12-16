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

// Referencias del DOM (se inicializan en `init()` para evitar valores null)
let taskModal;
let confirmModal;
let taskForm;
let newTaskBtn;
let closeModalBtn;
let cancelBtn;
let confirmCancelBtn;
let confirmDeleteBtn;
let tasksGrid;
let emptyState;
let emptyCTA;

// Inputs del formulario (se inicializan en init)
let fieldTitle;
let fieldSubject;
let fieldPriority;
let fieldDueDate;
let fieldDescription;

// Selectores de filtros y orden (se inicializan en init)
let filterSubjectSelect;
let filterPrioritySelect;
let sortSelect;

// --- PERSISTENCIA EN LOCALSTORAGE ---



/**
 * Datos de semilla (tareas de ejemplo) — ahora vacío por defecto
 */
function getSeedData() {
    // La aplicación inicia sin tareas por defecto
    return [];
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
 * Trunca texto a longitud máxima
 */
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
}

// Helper pequeño y seguro para renderizar texto
function escapeHtml(str = '') {
    return String(str).replace(/[&<>"]/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

// Comparador de fechas: tareas sin fecha van al final
// dir = 1 (asc: más próxima primero), dir = -1 (desc: más lejana primero)
function compareDates(a, b, dir = 1) {
    const ta = a.dueDate ? Date.parse(a.dueDate) : null;
    const tb = b.dueDate ? Date.parse(b.dueDate) : null;
    if (ta === null && tb === null) return 0;
    if (ta === null) return 1; // a sin fecha -> después
    if (tb === null) return -1; // b sin fecha -> después
    return dir * (ta - tb);
}

// Mantener persistencia simple
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : getSeedData();
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getSeedData() { return []; }

// Render muy simple: tarjetas con botones de editar/eliminar
function renderTasks() {
    if (!tasksGrid) return;

    // Copia la lista y aplica orden simple
    let list = tasks.slice();
    if (currentSort === 'date-asc') list.sort((a, b) => compareDates(a, b, 1));
    else if (currentSort === 'date-desc') list.sort((a, b) => compareDates(a, b, -1));
    else if (currentSort === 'priority') {
        const p = { alta: 3, media: 2, baja: 1 };
        list.sort((a, b) => (p[b.priority] || 0) - (p[a.priority] || 0));
    }

    if (list.length === 0) {
        if (emptyState) emptyState.classList.add('show');
        tasksGrid.innerHTML = '<div class="empty">No hay tareas</div>';
        return;
    }

    if (emptyState) emptyState.classList.remove('show');

    tasksGrid.innerHTML = list.map(t => `
        <article class="task-card" data-id="${t.id}">
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(t.title)}</h3>
                <div class="card-meta"><span class="card-subject">${escapeHtml(t.subject || '')}</span> <span class="card-date">${formatDate(t.dueDate || '')}</span></div>
            </div>
            <p class="card-description">${escapeHtml(truncateText(t.description || '', 200))}</p>
            <div class="card-actions">
                <button type="button" data-action="edit" data-id="${t.id}" class="btn-card">Editar</button>
                <button type="button" data-action="delete" data-id="${t.id}" class="btn-card danger">Eliminar</button>
            </div>
        </article>
    `).join('');
}

// Validación mínima
function validateForm() {
    if (!fieldTitle) return ['Formulario no disponible'];
    return fieldTitle.value.trim() ? [] : ['El título es obligatorio'];
}

function resetForm() {
    if (!taskForm) return;
    taskForm.reset();
    currentEditingId = null;
}

function openCreateModal() {
    currentEditingId = null;
    const title = document.getElementById('titulo-modal'); if (title) title.textContent = 'Nueva Tarea';
    resetForm();
    if (taskModal) taskModal.classList.add('show');
    if (fieldTitle) fieldTitle.focus();
}

function openEditModal(id) {
    const t = tasks.find(x => x.id === id); if (!t || !taskModal) return;
    currentEditingId = id;
    const title = document.getElementById('titulo-modal'); if (title) title.textContent = 'Editar Tarea';
    if (fieldTitle) fieldTitle.value = t.title || '';
    if (fieldSubject) fieldSubject.value = t.subject || '';
    if (fieldPriority) fieldPriority.value = t.priority || '';
    if (fieldDueDate) fieldDueDate.value = t.dueDate || '';
    if (fieldDescription) fieldDescription.value = t.description || '';
    taskModal.classList.add('show');
    if (fieldTitle) fieldTitle.focus();
}

function closeTaskModal() { if (taskModal) taskModal.classList.remove('show'); resetForm(); }

function handleFormSubmit(e) {
    e.preventDefault();
    const errors = validateForm(); if (errors.length) { alert(errors.join('\n')); return; }

    if (currentEditingId) {
        const t = tasks.find(x => x.id === currentEditingId); if (t) {
            t.title = fieldTitle.value.trim(); t.subject = fieldSubject.value.trim(); t.priority = fieldPriority.value; t.dueDate = fieldDueDate.value; t.description = fieldDescription.value.trim();
        }
    } else {
        tasks.push({ id: Date.now(), title: fieldTitle.value.trim(), subject: fieldSubject.value.trim(), priority: fieldPriority.value, dueDate: fieldDueDate.value, description: fieldDescription.value.trim() });
    }

    saveTasks(); renderTasks(); closeTaskModal();
}

// Delegación simple para botones de editar/eliminar
function initListeners() {
    if (newTaskBtn) newTaskBtn.addEventListener('click', openCreateModal);
    if (emptyCTA) emptyCTA.addEventListener('click', openCreateModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeTaskModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeTaskModal);

    if (taskForm) taskForm.addEventListener('submit', handleFormSubmit);

    if (tasksGrid) tasksGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]'); if (!btn) return;
        const id = Number(btn.dataset.id); if (btn.dataset.action === 'edit') openEditModal(id);
        else if (btn.dataset.action === 'delete') {
            if (confirm('¿Eliminar esta tarea?')) { tasks = tasks.filter(t => t.id !== id); saveTasks(); renderTasks(); }
        }
    });

    if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderTasks(); });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTaskModal(); });
}

function init() {
    taskModal = document.getElementById('modal-tarea');
    taskForm = document.getElementById('formulario-tarea');
    newTaskBtn = document.getElementById('btn-nueva-tarea');
    closeModalBtn = document.getElementById('btn-cerrar-modal');
    cancelBtn = document.getElementById('btn-cancelar');
    tasksGrid = document.getElementById('grid-tareas');
    emptyState = document.getElementById('estado-vacio');
    emptyCTA = document.getElementById('btn-crear-primera-tarea');

    fieldTitle = document.getElementById('campo-titulo');
    fieldSubject = document.getElementById('campo-materia');
    fieldPriority = document.getElementById('campo-prioridad');
    fieldDueDate = document.getElementById('campo-fecha-entrega');
    fieldDescription = document.getElementById('campo-descripcion');

    // Selector de orden
    sortSelect = document.getElementById('select-ordenar');
    if (sortSelect) sortSelect.value = currentSort;

    loadTasks(); renderTasks(); initListeners();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();