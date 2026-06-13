const API_URL = "https://u24x4b9vd9.execute-api.eu-north-1.amazonaws.com";

let tasks = [];
let editingTaskId = null;

async function loadData() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    tasks = await response.json();
    renderAll();
  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("Failed to load tasks from AWS");
  }
}

function daysUntil(dateString) {
  const today = new Date();
  const target = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/* TASKS */

async function saveTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const course = document.getElementById("taskCourse").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value;

  if (!title || !course || !dueDate) {
    alert("Please fill task title, course, and due date");
    return;
  }

  try {
    if (editingTaskId !== null) {
      const oldTask = tasks.find((t) => t.id === editingTaskId);

      const updatedTask = {
        ...oldTask,
        title,
        course,
        priority,
        dueDate,
      };

      await fetch(`${API_URL}/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      editingTaskId = null;
    } else {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          course,
          priority,
          dueDate,
        }),
      });
    }

    clearTaskForm();
    await loadData();
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Failed to save task");
  }
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  editingTaskId = id;

  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskCourse").value = task.course;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDueDate").value = task.dueDate;

  document.getElementById("saveTaskBtn").textContent = "Update Task";
  document.getElementById("cancelTaskBtn").style.display = "inline-block";
}

function cancelTaskEdit() {
  editingTaskId = null;
  clearTaskForm();
}

function clearTaskForm() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskCourse").value = "";
  document.getElementById("taskDueDate").value = "";

  document.getElementById("saveTaskBtn").textContent = "+ New";
  document.getElementById("cancelTaskBtn").style.display = "none";
}

async function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);

  const updatedTask = {
    ...task,
    done: !task.done,
  };

  try {
    await fetch(`${API_URL}/tasks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    await loadData();
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task");
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    await loadData();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task");
  }
}

/* RENDER TASKS */

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done - b.done;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  sorted.forEach((task) => {
    const days = daysUntil(task.dueDate);

    const dueText =
      days < 0
        ? `${Math.abs(days)}d overdue`
        : days === 0
          ? "Due today"
          : days === 1
            ? "Due tomorrow"
            : `Due in ${days}d`;

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div onclick="toggleTask('${task.id}')" class="check ${task.done ? "done" : ""}"></div>

      <div>
        <div class="item-title ${task.done ? "done-text" : ""}">
          <span class="${task.priority.toLowerCase()}">●</span>
          ${task.title}
        </div>

        <div class="meta">
          ${task.course} ·
          <span class="${task.priority.toLowerCase()}">${task.priority}</span> ·
          ${dueText}
        </div>
      </div>

      <div class="actions">
        <button onclick="editTask('${task.id}')">✎</button>
        <button onclick="deleteTask('${task.id}')">🗑</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* PANIC */

function calculatePanicScore() {
  let score = 0;

  tasks.forEach((task) => {
    if (task.done) return;

    const days = daysUntil(task.dueDate);

    if (task.priority === "High") score += 18;
    if (task.priority === "Medium") score += 10;
    if (task.priority === "Low") score += 5;

    if (days < 0) score += 25;
    else if (days <= 1) score += 18;
    else if (days <= 3) score += 10;
  });

  return Math.min(score, 100);
}

function renderPanic() {
  const score = calculatePanicScore();

  document.getElementById("panicScore").textContent = score;
  document.getElementById("panicFill").style.width = `${score}%`;

  let title = "🟢 Relaxed";
  let msg = "You're doing fine. Keep going.";

  if (score >= 80) {
    title = "⚫ Critical";
    msg = "Emergency mode. One task at a time.";
  } else if (score >= 55) {
    title = "🔴 Panic";
    msg = "Focus on the closest high-priority deadline.";
  } else if (score >= 26) {
    title = "🟡 Warning";
    msg = "You have several deadlines. Plan carefully.";
  }

  document.getElementById("panicTitle").textContent = title;
  document.getElementById("panicMessage").textContent = msg;
}

/* SMALL COUNTS */

function renderSmallCounts() {
  const pending = tasks.filter((t) => !t.done).length;
  const done = tasks.filter((t) => t.done).length;

  document.getElementById("taskPendingSmall").textContent = pending;
  document.getElementById("taskDoneSmall").textContent = done;
}

/* INIT */

function renderAll() {
  renderTasks();
  renderPanic();
  renderSmallCounts();
}

loadData();