// Get current date
const currentDate = new Date().toLocaleDateString();
document.getElementById("currentDate").textContent = currentDate;

// Get task input fields
const taskInput = document.getElementById("task");
const dueDateInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");

// Get task list
const taskList = document.getElementById("taskList");

// Create task array
let tasks = [];

function getTasksFromStorage() {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  displayTasks();
}

function persistTasks() {
  var tasksJson = JSON.stringify(tasks);
  console.log(tasksJson);
  localStorage.setItem("tasks", tasksJson);
}

// Add task function
function addTask() {
  // Get task details
  const task = taskInput.value;
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  // Create task object
  const newTask = {
    id: Date.now(),
    task: task,
    dueDate: dueDate,
    priority: priority,
    completed: false,
  };

  // Add task to array
  tasks.push(newTask);

  // Clear input fields
  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "";

  //update local storage with updated values
  persistTasks();
  // Update task list displayed
  displayTasks();
}

// Display tasks function
function displayTasks() {
  // Sort tasks alphabetically
  tasks.sort((a, b) => a.task.localeCompare(b.task));

  // Clear task list
  taskList.innerHTML = "";

  // Loop through tasks
  tasks.forEach((task) => {
    // Create task element
    const li = document.createElement("li");
    li.classList.add("task-item");

    // Add task details to element
    li.innerHTML = `
      <div class="task-name">${task.task}</div>
      <div class="due-date">${task.dueDate}</div>
      <div class="priority">
        <div class="priority-bar" style="width: ${
          task.priority * 20
        }%; background: ${getColor(task.priority)}">&nbsp;</div>
      </div>
      <div class="actions">
        <div class="edit" onclick="editTask(${task.id})">Edit</div>
        <div class="delete" onclick="deleteTask(${task.id})">Delete</div>
      </div>
    `;

    // Add strike-through if task is completed
    if (task.completed) {
      li.classList.add("completed");
    }

    // Add click event to task name to toggle completion
    const taskName = li.querySelector(".task-name");
    taskName.addEventListener("click", () => {
      strike(task.id);
      li.classList.toggle("completed");
    });

    // Add task element to task list
    taskList.appendChild(li);
  });
}
function getColor(taskPriority) {
  var color = "pink";
  console.log(taskPriority);
  if (taskPriority == 1 || taskPriority == 2) {
    color = "green";
  } else if ((taskPriority == 3) | (taskPriority == 4)) {
    color = "orange";
  } else {
    color = "red";
  }

  console.log(color);
  return color;
}

function strike(id) {
  // Get task object by id
  const taskIndex = tasks.findIndex((task) => task.id === id);
  const task = tasks[taskIndex];

  task.completed = !task.completed;
  tasks[taskIndex] = task;

  //update local storage with updated values
  persistTasks();
  // Update task list
  displayTasks();
}

// Edit task function
function editTask(id) {
  // Get task object by id
  const taskIndex = tasks.findIndex((task) => task.id === id);
  const task = tasks[taskIndex];

  // Update input fields with task details
  taskInput.value = task.task;
  dueDateInput.value = task.dueDate;
  priorityInput.value = task.priority;

  // Remove task from array
  tasks.splice(taskIndex, 1);

  //update local storage with updated values
  persistTasks();
  // Update task list
  displayTasks();
}

// Delete task function
function deleteTask(id) {
  // Get task index by id
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Remove task from array
  tasks.splice(taskIndex, 1);

  //update local storage with updated values
  persistTasks();
  // Update task list
  displayTasks();
}

// Add event listener to add task button
const addTaskButton = document.getElementById("add");
addTaskButton.addEventListener("click", addTask);

// Display initial tasks
getTasksFromStorage();
