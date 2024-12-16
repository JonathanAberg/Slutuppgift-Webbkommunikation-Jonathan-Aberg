const API_BASE = "http://localhost:3000"; // Base URL for your backend
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

let editingTaskId = null; // Tracks the task being edited

// Fetch and display tasks
async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE}/tasks`);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Render tasks in the task list
function renderTasks(tasks) {
  taskList.innerHTML = ""; // Clear existing tasks
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML = `
      <div>
        <strong>${task.description}</strong> - ${task.category} (${task.status})
      </div>
      <div>
        <button class="complete" onclick="markComplete('${task._id}')">Complete</button>
        <button class="edit" onclick="editTask('${task._id}', '${task.description}', '${task.category}')">Edit</button>
        <button class="delete" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
    taskList.appendChild(taskDiv);
  });
}

// Add or update a task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  try {
    if (editingTaskId) {
      // Update existing task
      await fetch(`${API_BASE}/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, category }),
      });
      editingTaskId = null; // Reset after updating
    } else {
      // Create new task
      await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, category }),
      });
    }

    taskForm.reset();
    fetchTasks();
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});

// Mark a task as complete
async function markComplete(id) {
  try {
    await fetch(`${API_BASE}/tasks/${id}/complete`, { method: "PUT" });
    fetchTasks();
  } catch (error) {
    console.error("Error marking task as complete:", error);
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

// Populate form for editing
function editTask(id, description, category) {
  document.getElementById("description").value = description;
  document.getElementById("category").value = category;

  editingTaskId = id; // Set the task ID for editing
}

// Initial fetch
fetchTasks();
