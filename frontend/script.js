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
    const task = tasks.find(t => t.id === editingTaskId);

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
      done: false
    });
  }

  clearTaskForm();
  saveData();
  renderAll();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);

  editingTaskId = id;

  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskCourse").value = task.course;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDueDate").value = task.dueDate;

  document.getElementById("saveTaskBtn").textContent = "Update Task";
  document.getElementById("cancelTaskBtn").style.display = "inline-block";

  window.scrollTo({ top: 350, behavior: "smooth" });
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
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );

  saveData();
  renderAll();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

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
    const exam = exams.find(e => e.id === editingExamId);

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
      hours
    });
  }

  clearExamForm();
  saveData();
  renderAll();
}

function editExam(id) {
  const exam = exams.find(e => e.id === id);

  editingExamId = id;

  document.getElementById("courseName").value = exam.course;
  document.getElementById("examDate").value = exam.date;
  document.getElementById("examDifficulty").value = exam.difficulty;
  document.getElementById("studyHours").value = exam.hours;

  document.getElementById("saveExamBtn").textContent = "Update Exam";
  document.getElementById("cancelExamBtn").style.display = "inline-block";

  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
  exams = exams.filter(exam => exam.id !== id);

  saveData();
  renderAll();
}

/* RENDER */

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done - b.done;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  sorted.forEach(task => {
    const days = daysUntil(task.dueDate);

    let dueText =
      days < 0 ? `${Math.abs(days)}d overdue` :
      days === 0 ? "Due today" :
      days === 1 ? "Due tomorrow" :
      `Due in ${days}d`;

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

function renderExams() {
  const list = document.getElementById("examList");
  list.innerHTML = "";

  const sorted = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(exam => {
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

function renderStudySchedule() {
  const schedule = document.getElementById("studySchedule");
  schedule.innerHTML = "";

  if (exams.length === 0) {
    schedule.innerHTML = "<p>No exams yet. Add an exam to generate a study schedule.</p>";
    return;
  }

  const topics = [
    "Core concepts & overview",
    "Practice problems",
    "Past papers review"
  ];

  for (let day = 0; day < 3; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);

    let total = 0;
    let rows = "";

    exams.forEach(exam => {
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

  tasks.forEach(task => {
    if (task.done) return;

    const days = daysUntil(task.dueDate);

    if (task.priority === "High") score += 18;
    if (task.priority === "Medium") score += 10;
    if (task.priority === "Low") score += 5;

    if (days < 0) score += 25;
    else if (days <= 1) score += 18;
    else if (days <= 3) score += 10;
  });

  exams.forEach(exam => {
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
  document.getElementById("botMessage").textContent = getBotMessage(score);
}

function getBotMessage(score) {
  const urgent = tasks.find(t => !t.done && daysUntil(t.dueDate) <= 1);

  if (urgent) {
    return `Start with "${urgent.title}" today. Even 25 minutes helps.`;
  }

  if (score >= 80) return "Critical mode. Forget the rest — finish one task now.";
  if (score >= 55) return "Panic mode. Pick the nearest deadline and focus.";
  if (score >= 26) return "Warning. Make a small plan before starting.";

  return "You're doing great. Keep momentum.";
}

/* STATS */

function renderStats() {
  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  const urgent = tasks.filter(t => !t.done && daysUntil(t.dueDate) <= 2).length;

  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("taskPendingSmall").textContent = pending;
  document.getElementById("taskDoneSmall").textContent = done;

  document.getElementById("urgentText").textContent =
    urgent ? `${urgent} due in 2 days` : "No urgent tasks";

  if (exams.length > 0) {
    const next = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    document.getElementById("nextExamText").textContent = `${daysUntil(next.date)}d`;
    document.getElementById("nextExamName").textContent = next.course;
  } else {
    document.getElementById("nextExamText").textContent = "-";
    document.getElementById("nextExamName").textContent = "No exams yet";
  }
}

/* WHAT IF */

function whatIfSkipStudy() {
  const current = calculatePanicScore();
  const next = Math.min(100, current + 11);

  document.getElementById("whatIfResult").innerHTML =
    `Skipping study today increases your Panic Score<br>
     <b>${current} → ${next}</b> <span class="high">+11</span>`;
}

function whatIfFinishTask() {
  const current = calculatePanicScore();
  const next = Math.max(0, current - 14);

  document.getElementById("whatIfResult").innerHTML =
    `Finishing one important task lowers your Panic Score<br>
     <b>${current} → ${next}</b> <span class="low">-14</span>`;
}

/* DEMO DATA */

function loadDemoData() {
  tasks = [
    {
      id: 1,
      title: "Submit internship application",
      course: "Career",
      priority: "High",
      dueDate: "2026-06-01",
      done: false
    },
    {
      id: 2,
      title: "Data Structures problem set 5",
      course: "Data Structures",
      priority: "High",
      dueDate: "2026-06-02",
      done: false
    },
    {
      id: 3,
      title: "Cloud Computing project report",
      course: "Cloud Computing",
      priority: "High",
      dueDate: "2026-06-03",
      done: false
    },
    {
      id: 4,
      title: "Read chapter 7",
      course: "Mathematics",
      priority: "Medium",
      dueDate: "2026-06-05",
      done: false
    }
  ];

  exams = [
    {
      id: 10,
      course: "Mathematics",
      date: "2026-06-06",
      difficulty: "Hard",
      hours: 3
    },
    {
      id: 11,
      course: "Cloud Computing",
      date: "2026-06-09",
      difficulty: "Medium",
      hours: 1.5
    },
    {
      id: 12,
      course: "Physics",
      date: "2026-06-13",
      difficulty: "Hard",
      hours: 3
    }
  ];

  saveData();
  renderAll();
}

/* INIT */

function renderAll() {
  renderTasks();
  renderExams();
  renderStudySchedule();
  renderPanic();
  renderStats();
}

loadData();