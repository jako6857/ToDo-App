//#region   



//#endregion


//#region   

//#endregion


//#region   

//#endregion


//#region  editTask
let editingLi = null;

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;
  
  const li = document.createElement("li");
  li.innerHTML = `<span>${text}</span> 
    <button onclick="editTask(this)">Rediger</button> 
    <button onclick="removeTask(this)">Fjern</button>`;
  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function removeTask(btn) {
  btn.parentElement.remove();
}

function editTask(btn) {
  editingLi = btn.parentElement;
    // try span first, fallback to first text node
    const span = editingLi.querySelector('.task-text') || editingLi.querySelector('span');
    let current = '';
    if (span) {
        current = span.textContent;
    } else {
        const first = editingLi.firstChild;
        current = (first && first.nodeType === 3) ? first.nodeValue.trim() : '';
    }
    document.getElementById("editInput").value = current;
    document.getElementById("editModal").classList.add("open");
    // optional: focus input
    setTimeout(() => document.getElementById("editInput").focus(), 0);
}

function closeModal() {
      document.getElementById("editModal").classList.remove("open");
    editingLi = null;
}

function saveEdit() {
  const val = (document.getElementById("editInput").value || "").trim();
    if (!editingLi) { closeModal(); return; }
    if (!val) return; // prevent empty

    const span = editingLi.querySelector('.task-text') || editingLi.querySelector('span');
    if (span) {
        span.textContent = val;
    } else {
        // fallback: update first text node or insert new one
        const first = editingLi.firstChild;
        if (first && first.nodeType === 3) first.nodeValue = val + ' ';
        else editingLi.insertBefore(document.createTextNode(val + ' '), editingLi.firstChild);
    }
    closeModal();
}

//#endregion


//#region View Functions   

// Creates a new task in the list
function listCreator() {
    let taskInput = document.getElementById("taskInput").value;
    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");
    li.innerHTML = taskInput + 
    '<button id="removeTask" onclick="removeTask(this)">Fjern</button>'
    + '<button id="editTask" onclick="editTask(this)">Rediger</button>';
    taskList.appendChild(li);
    document.getElementById("taskInput").value = "";
}

// Removes a task from the list
function removeTask(button) {
    let li = button.parentNode;
    li.parentNode.removeChild(li);
}


// Edits a task in the list

switch (buttonlistener) {
    case "addBtn":
        listCreator();
        break;

    case "removeTask":
        removeTask();
        break;

    case "editTask":
        editTask();
        break;

    default: 

        break;
}

//#endregion