const STORAGE_KEY = "todoAppState";
let appState = { lists: [], theme: "light" };
let currentListIndex = null;
let editingType = null; // "list" or "task"
let editingIndex = null;

// ---------- LISTS ----------
function addList() {
  const input = document.getElementById("listInput");
  const name = input.value.trim();
  if (!name) return;
  appState.lists.push({ name, tasks: [] });
  input.value = "";
  saveAppState();
  renderLists();
}

function renderLists() {
  const container = document.getElementById("listsContainer");
  container.innerHTML = "";
  appState.lists.forEach((list, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="list-name" onclick="showListDetail(${idx})">${list.name}</span>
      <div class="actions">
        <button onclick="openEditModal('list', ${idx}, '${list.name}')">Rediger</button>
        <button onclick="deleteList(${idx})">Slet</button>
      </div>
    `;
    container.appendChild(li);
  });
}

function deleteList(idx) {
  if (!confirm("Vil du slette denne liste?")) return;
  appState.lists.splice(idx, 1);
  saveAppState();
  renderLists();
}

function showListsView() {
  document.getElementById("listsView").style.display = "block";
  document.getElementById("listDetail").style.display = "none";
  currentListIndex = null;
  renderLists();
}

// ---------- TASKS ----------
function addTask() {
  if (currentListIndex === null) return;
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;
  appState.lists[currentListIndex].tasks.push({ text, completed: false });
  input.value = "";
  saveAppState();
  renderTasks();
}

function renderTasks() {
  const list = appState.lists[currentListIndex];
  document.getElementById("listTitle").textContent = list.name;
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  list.tasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${idx})" />
      <span class="task-text">${task.text}</span>
      <div class="actions">
        <button onclick="openEditModal('task', ${idx}, '${task.text}', ${currentListIndex})">Rediger</button>
        <button onclick="removeTask(${idx})">Fjern</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function showListDetail(idx) {
  currentListIndex = idx;
  document.getElementById("listsView").style.display = "none";
  document.getElementById("listDetail").style.display = "block";
  renderTasks();
}

// ---------- EDIT MODAL ----------
function openEditModal(type, idx, currentText, listIdx = null) {
  editingType = type;
  editingIndex = idx;
  if (listIdx !== null) currentListIndex = listIdx;
  document.getElementById("editInput").value = currentText;
  document.getElementById("editTitle").textContent =
    type === "task" ? "Rediger opgave" : "Rediger liste";
  document.getElementById("editModal").classList.add("open");
  setTimeout(() => document.getElementById("editInput").focus(), 0);
}

function closeModal() {
  document.getElementById("editModal").classList.remove("open");
  editingType = null;
  editingIndex = null;
}

function saveEdit() {
  const newText = document.getElementById("editInput").value.trim();
  if (!newText) return;
  if (editingType === "list") {
    appState.lists[editingIndex].name = newText;
    renderLists();
  } else if (editingType === "task") {
    appState.lists[currentListIndex].tasks[editingIndex].text = newText;
    renderTasks();
  }
  saveAppState();
  closeModal();
}

// ---------- TASK DELETE / TOGGLE ----------
function removeTask(idx) {
  appState.lists[currentListIndex].tasks.splice(idx, 1);
  saveAppState();
  renderTasks();
}

function toggleTask(idx) {
  const task = appState.lists[currentListIndex].tasks[idx];
  task.completed = !task.completed;
  saveAppState();
  renderTasks();
}

// ---------- THEME ----------
function toggleTheme() {
  appState.theme = appState.theme === "light" ? "dark" : "light";
  applyTheme();
  saveAppState();
}

function applyTheme() {
  document.body.className = appState.theme;
  document.getElementById("themeToggle").textContent =
    appState.theme === "dark" ? "☀️" : "🌙";
}

// ---------- STORAGE ----------
function saveAppState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadAppState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.lists) appState = parsed;
  } catch (e) {
    console.warn("Invalid localStorage data");
  }
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  applyTheme();
  showListsView();
  document.getElementById("listInput").addEventListener("keydown", e => {
    if (e.key === "Enter") addList();
  });
  document.getElementById("taskInput").addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });
});
