const STORAGE_KEY = "todoAppState";
let appState = { lists: [], theme: "light" };
let currentListIndex = null;
let editingLi = null;

/* ---------- LISTS ---------- */
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

    // whole li clickable to open list
    li.innerHTML = `
      <span class="list-name" onclick="showListDetail(${idx})">${list.name}</span>
      <button onclick="editList(${idx})">Rediger</button>
      <button onclick="deleteList(${idx})">Slet</button>
    `;

    container.appendChild(li);
  });
}

function editList(idx) {
  const newName = prompt("Rediger listenavn:", appState.lists[idx].name);
  if (newName && newName.trim()) {
    appState.lists[idx].name = newName.trim();
    saveAppState();
    renderLists();
  }
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

/* ---------- TASKS ---------- */
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
      <button onclick="editTask(this)">Rediger</button>
      <button onclick="removeTask(${idx})">Fjern</button>
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

/* ---------- TASK EDIT/DELETE ---------- */
function editTask(btn) {
  editingLi = btn.parentElement;
  const span = editingLi.querySelector(".task-text");
  document.getElementById("editInput").value = span ? span.textContent : "";

  const modal = document.getElementById("editModal");
  modal.classList.add("open");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("editModal");
  modal.classList.remove("open");
  modal.style.display = "none";
  editingLi = null;
}

function saveEdit() {
  if (!editingLi || currentListIndex === null) return;

  const val = document.getElementById("editInput").value.trim();
  if (!val) return;

  const index = Array.from(editingLi.parentElement.children).indexOf(editingLi);
  appState.lists[currentListIndex].tasks[index].text = val;

  saveAppState();
  renderTasks();
  closeModal();
}

function removeTask(idx) {
  appState.lists[currentListIndex].tasks.splice(idx, 1);
  saveAppState();
  renderTasks();
}

/* ---------- COMPLETE TASK ---------- */
function toggleTask(idx) {
  const task = appState.lists[currentListIndex].tasks[idx];
  task.completed = !task.completed;
  saveAppState();
  renderTasks();
}

/* ---------- THEME ---------- */
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

/* ---------- STORAGE ---------- */
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

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  applyTheme();
  showListsView();

  // Enter key to add list
  document.getElementById("listInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addList();
  });

  // Enter key to add task
  document.getElementById("taskInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
});
