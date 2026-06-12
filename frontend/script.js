let tasks = [];
let exams = [];

let editingTaskId = null;
let editingExamId = null;

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("exams", JSON.stringify(exams));
}

function loadData() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  exams = JSON.parse(localStorage.getItem("exams")) || [];
  renderAll();
}

function daysUntil(dateString) {
  const today = new Date();
  const target = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/* TASKS */

function saveTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const course = document.getElementById("taskCourse").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value;

  if (!title || !course || !dueDate) {
    alert("Please fill task title, course, and due date");
    return;
  }

  if (editingTaskId !== null) {
    const task = tasks.find((t) => t.id === editingTaskId);

    task.title = title;
    task.course = course;
    task.priority = priority;
    task.dueDate = dueDate;

    editingTaskId = null;
  } else {
    tasks.push({
      id: Date.now(),
      title,
      course,
      priority,
      dueDate,
      done: false,
    });
  }

  clearTaskForm();
  saveData();
  renderAll();
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

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );

  saveData();
  renderAll();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveData();
  renderAll();
}

/* EXAMS */

function saveExam() {
  const course = document.getElementById("courseName").value.trim();
  const date = document.getElementById("examDate").value;
  const difficulty = document.getElementById("examDifficulty").value;
  const hours = Number(document.getElementById("studyHours").value);

  if (!course || !date || !hours) {
    alert("Please fill course, exam date, and study hours");
    return;
  }

  if (editingExamId !== null) {
    const exam = exams.find((e) => e.id === editingExamId);

    exam.course = course;
    exam.date = date;
    exam.difficulty = difficulty;
    exam.hours = hours;

    editingExamId = null;
  } else {
    exams.push({
      id: Date.now(),
      course,
      date,
      difficulty,
      hours,
    });
  }

  clearExamForm();
  saveData();
  renderAll();
}

function editExam(id) {
  const exam = exams.find((e) => e.id === id);
  editingExamId = id;

  document.getElementById("courseName").value = exam.course;
  document.getElementById("examDate").value = exam.date;
  document.getElementById("examDifficulty").value = exam.difficulty;
  document.getElementById("studyHours").value = exam.hours;

  document.getElementById("saveExamBtn").textContent = "Update Exam";
  document.getElementById("cancelExamBtn").style.display = "inline-block";
}

function cancelExamEdit() {
  editingExamId = null;
  clearExamForm();
}

function clearExamForm() {
  document.getElementById("courseName").value = "";
  document.getElementById("examDate").value = "";
  document.getElementById("studyHours").value = "";

  document.getElementById("saveExamBtn").textContent = "+ Exam";
  document.getElementById("cancelExamBtn").style.display = "none";
}

function deleteExam(id) {
  exams = exams.filter((exam) => exam.id !== id);
  saveData();
  renderAll();
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
      <div onclick="toggleTask(${task.id})" class="check ${task.done ? "done" : ""}"></div>

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
        <button onclick="editTask(${task.id})">✎</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* RENDER EXAMS */

function renderExams() {
  const list = document.getElementById("examList");
  list.innerHTML = "";

  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach((exam) => {
    const days = daysUntil(exam.date);

    const div = document.createElement("div");
    div.className = "exam-card";

    div.innerHTML = `
      <small>${new Date(exam.date).toDateString()}</small>
      <h3>${exam.course}</h3>

      <span class="badge ${exam.difficulty}">${exam.difficulty.toUpperCase()}</span>
      <span>${exam.hours}h/day</span>

      <b style="float:right">${days}d left</b>

      <div class="actions">
        <button onclick="editExam(${exam.id})">✎</button>
        <button onclick="deleteExam(${exam.id})">🗑</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* STUDY SCHEDULE */

function renderStudySchedule() {
  const schedule = document.getElementById("studySchedule");
  schedule.innerHTML = "";

  if (exams.length === 0) {
    schedule.innerHTML =
      "<p>No exams yet. Add an exam to generate a study schedule.</p>";
    return;
  }

  const topics = [
    "Core concepts & overview",
    "Practice problems",
    "Past papers review",
  ];

  for (let day = 0; day < 3; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);

    let total = 0;
    let rows = "";

    exams.forEach((exam) => {
      total += exam.hours;

      rows += `
        <div class="study-row">
          <span><b>${exam.course}</b> · ${topics[day % topics.length]}</span>
          <b>${exam.hours}h</b>
        </div>
      `;
    });

    const box = document.createElement("div");
    box.className = "schedule-day";

    box.innerHTML = `
      <div class="schedule-head">
        <span>${date.toDateString()}</span>
        <span>${total}h total</span>
      </div>
      ${rows}
    `;

    schedule.appendChild(box);
  }
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

  exams.forEach((exam) => {
    const days = daysUntil(exam.date);

    if (exam.difficulty === "Hard") score += 18;
    if (exam.difficulty === "Medium") score += 12;
    if (exam.difficulty === "Easy") score += 7;

    if (days <= 2) score += 20;
    else if (days <= 7) score += 12;
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
  renderExams();
  renderStudySchedule();
  renderPanic();
  renderSmallCounts();
}

loadData();