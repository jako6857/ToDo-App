// assets/js/script.js
const STORAGE_KEY = 'todoAppState';
let editingLi = null;

/* ---------- helpers ---------- */
function createTaskElement(text) {
  const li = document.createElement('li');

  // Full template string for each task
  li.innerHTML = `
    <span class="task-text">${text}</span>
    <div class="task-actions">
      <button type="button" class="edit-btn">Rediger</button>
      <button type="button" class="remove-btn">Fjern</button>
    </div>
  `;

  // Attach listeners
  li.querySelector('.edit-btn').addEventListener('click', () => editTask(li));
  li.querySelector('.remove-btn').addEventListener('click', () => {
    li.remove();
    saveAppState();
  });

  return li;
}

/* ---------- main actions ---------- */
function addTask() {
  const input = document.getElementById('taskInput');
  const text = (input.value || '').trim();
  if (!text) return;

  const li = createTaskElement(text);
  document.getElementById('taskList').appendChild(li);
  input.value = '';
  input.focus();

  saveAppState();
}

function removeTask(btn) {
  // fallback if called inline
  const li = btn.closest('li');
  if (li) {
    li.remove();
    saveAppState();
  }
}

function editTask(li) {
  editingLi = li;
  if (!editingLi) return;

  const span = editingLi.querySelector('.task-text');
  document.getElementById('editInput').value = span ? span.textContent : '';

  const modal = document.getElementById('editModal');
  modal.classList.add('open');
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('editInput').focus(), 0);
}

function closeModal() {
  const modal = document.getElementById('editModal');
  modal.classList.remove('open');
  modal.style.display = 'none';
  editingLi = null;
}

function saveEdit() {
  if (!editingLi) { closeModal(); return; }
  const v = (document.getElementById('editInput').value || '').trim();
  if (!v) return; // prevent empty

  const span = editingLi.querySelector('.task-text');
  if (span) span.textContent = v;

  saveAppState();
  closeModal();
}

/* ---------- persistence ---------- */
function saveAppState() {
  const tasks = Array.from(document.querySelectorAll('#taskList .task-text'))
                     .map(s => s.textContent.trim());
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  const state = { tasks, theme };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save app state:', err);
  }
}

function loadAppState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let state = null;

  if (raw) {
    try { state = JSON.parse(raw); }
    catch (e) { console.warn('Invalid JSON in', STORAGE_KEY, e); }
  }

  if (!state || !Array.isArray(state.tasks)) return;

  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  state.tasks.forEach(t => {
    taskList.appendChild(createTaskElement(t));
  });

  if (state.theme === 'dark') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}

/* ---------- wiring ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadAppState();

  // add task with Enter
  document.getElementById('taskInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  // modal interactions
  const modal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');

  // click outside modal closes it
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // keyboard shortcuts for modal
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex' && !modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter') saveEdit();
  });

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
  });
});
