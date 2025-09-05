//#region   

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


//#region   

//#endregion


//#region   

//#endregion


//#region  

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
function editTask(button) {
    let li = button.parentNode;
    let taskText = li.firstChild.nodeValue.trim();
    let newTaskText = prompt("Rediger opgaven:", taskText); 
    if (newTaskText !== null && newTaskText.trim() !== "") {
        li.firstChild.nodeValue = newTaskText + " ";
    }
}
//#endregion