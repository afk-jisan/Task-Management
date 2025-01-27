const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");

const updateTaskModal = document.getElementById("updateTaskModal");
const updateTaskForm = document.getElementById("updateTaskForm");
const filterDropdown = document.getElementById("filterTasks");
const searchInput = document.getElementById("searchTasks");
const sortDropdown = document.getElementById("sortTasks");
let currentTaskId = null;
let tasks = [];

// Load tasks from localStorage
const loadTasks = () => {
  try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    displayTasksToDom(tasks);
  } catch (error) {
    console.error("Something went wrong while fetching data:", error);
  }
};

// Add a new task
const addTask = (title, description, priority, dueDate) => {
  const id = Date.now();
  const task = { id, title, description, priority, dueDate, completed: false };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasksToDom(tasks);
};

// Delete a task
const deleteTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasksToDom(tasks);
};

// Update a task
const updateTask = (taskId, updates) => {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    Object.assign(task, updates);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasksToDom(tasks);
  }
};

// Toggle task completion
const toggleTaskCompletion = (taskId) => {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasksToDom(tasks);
  }
};

// Show update modal
const showUpdateModal = (task) => {
  currentTaskId = task.id;
  document.getElementById("updateTaskTitle").value = task.title;
  document.getElementById("updateTaskDescription").value = task.description;
  document.getElementById("updateTaskPriority").value = task.priority;
  document.getElementById("updateTaskDueDate").value = task.dueDate;
  updateTaskModal.classList.remove("hidden");
};

// Hide update modal
const hideUpdateModal = () => {
  currentTaskId = null;
  taskTitle.value = "";
  taskDescription.value = "";
  taskPriority.value = "low"; // Reset to default option
  taskDueDate.value = "";
  updateTaskModal.classList.add("hidden");
};

// Event Listeners
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskTitle.value;
  const description = taskDescription.value;
  const priority = taskPriority.value;
  const dueDate = taskDueDate.value;
  if (title) {
    addTask(title, description, priority, dueDate);
    taskTitle.value = "";
    taskDescription.value = "";
    taskPriority.value = "low";
    taskDueDate.value = "";
  } else {
    alert("Task title is required!");
  }
});

filterDropdown.addEventListener("change", (e) => filterTasks(e.target.value));
searchInput.addEventListener("input", (e) => searchTasks(e.target.value));
sortDropdown.addEventListener("change", (e) => sortTasks(e.target.value));

document.querySelector(".close-btn").addEventListener("click", hideUpdateModal);

updateTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("updateTaskTitle").value;
  const description = document.getElementById("updateTaskDescription").value;
  const priority = document.getElementById("updateTaskPriority").value;
  const dueDate = document.getElementById("updateTaskDueDate").value;

  if (currentTaskId !== null) {
    updateTask(currentTaskId, { title, description, priority, dueDate });
    hideUpdateModal();
  }
});

// Filter tasks
const filterTasks = (filter) => {
  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filter === "incomplete") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }
  displayTasksToDom(filteredTasks);
};

// Search tasks
const searchTasks = (searchTerm) => {
  const lowerTerm = searchTerm.toLowerCase();
  const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(lowerTerm) ||
      task.description.toLowerCase().includes(lowerTerm)
  );
  displayTasksToDom(filteredTasks);
};

// Sort tasks
const sortTasks = (sortBy) => {
    let sortedTasks = [...tasks];
    if (sortBy === "priority") {
      const priorityOrder = { low: 3, medium: 2, high: 1 }; // Defining priority
      sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "dueDate") {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    displayTasksToDom(sortedTasks);
  };

// Display tasks to DOM
const displayTasksToDom = (taskList = tasks) => {
  const taskContainer = document.getElementById("taskList");
  taskContainer.innerHTML = "";
  taskList.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${task.completed ? "task-completed" : ""}`;

    taskItem.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Due Date: ${task.dueDate || "No due date"}</p>
      </div>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="complete-btn">${task.completed ? "Undo" : "✔"}</button>
        <button class="delete-btn">✘</button>
      </div>
    `;

    taskItem.querySelector(".complete-btn").addEventListener("click", () => toggleTaskCompletion(task.id));
    taskItem.querySelector(".edit-btn").addEventListener("click", () => showUpdateModal(task));
    taskItem.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));
    taskContainer.appendChild(taskItem);
  });
};

// Load tasks when the page loads
loadTasks();