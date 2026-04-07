// Notion Light Kanban Board with Modal Input and Priority

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const columns = document.querySelectorAll(".column");
const addTaskBtns = document.querySelectorAll(".add-task-btn");
const modal = document.getElementById("modal");
const modalInput = document.getElementById("modal-input");
const modalPriority = document.getElementById("modal-priority");
const modalSave = document.getElementById("modal-save");
const modalCancel = document.getElementById("modal-cancel");

let editTaskId = null;

// Render tasks
function renderTasks(){
  columns.forEach(col => {
    const status = col.dataset.status;
    const taskList = col.querySelector(".task-list");
    taskList.innerHTML = "";
    tasks.filter(t => t.status === status).forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.id = task.id;

      const text = document.createElement("div");
      text.className = "task-text";
      const priorityTag = document.createElement("span");
      priorityTag.className = `priority ${task.priority}`;
      text.append(priorityTag, document.createTextNode(task.text));

      const buttons = document.createElement("div");
      buttons.className = "task-buttons";

      const editBtn = document.createElement("button");
      editBtn.innerText = "✏️";
      editBtn.onclick = () => openEditModal(task.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "🗑";
      deleteBtn.onclick = () => deleteTask(task.id);

      buttons.append(editBtn, deleteBtn);
      card.append(text, buttons);

      addDragEvents(card);
      taskList.appendChild(card);
    });
  });
  saveTasks();
}

// Save to localStorage
function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
addTaskBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    editTaskId = null;
    modalInput.value = "";
    modalPriority.value = "Low";
    modal.classList.remove("hidden");
    modal.dataset.status = btn.parentElement.dataset.status;
  });
});

// Delete task
function deleteTask(id){
  tasks = tasks.filter(t => t.id != id);
  renderTasks();
}

// Edit task
function openEditModal(id){
  editTaskId = id;
  const task = tasks.find(t => t.id == id);
  modalInput.value = task.text;
  modalPriority.value = task.priority;
  modal.classList.remove("hidden");
  modal.dataset.status = task.status;
}

// Modal Save
modalSave.addEventListener("click", ()=>{
  const status = modal.dataset.status;
  const text = modalInput.value.trim();
  const priority = modalPriority.value;
  if(text === "") return;

  if(editTaskId){
    const task = tasks.find(t => t.id == editTaskId);
    task.text = text;
    task.priority = priority;
  } else {
    const id = Date.now();
    tasks.push({id, text, status, priority});
  }
  modal.classList.add("hidden");
  renderTasks();
});

// Modal Cancel
modalCancel.addEventListener("click", ()=>{
  modal.classList.add("hidden");
  editTaskId = null;
});

// Drag & Drop
function addDragEvents(card){
  card.addEventListener("dragstart", dragStart);
}

let draggedTaskId = null;

function dragStart(e){
  draggedTaskId = e.target.dataset.id;
  e.dataTransfer.effectAllowed = "move";
}

columns.forEach(col => {
  const taskList = col.querySelector(".task-list");
  taskList.addEventListener("dragover", e => e.preventDefault());
  taskList.addEventListener("drop", e => {
    const status = col.dataset.status;
    tasks = tasks.map(t => t.id == draggedTaskId ? {...t, status} : t);
    renderTasks();
  });
});

// Initial render
renderTasks();