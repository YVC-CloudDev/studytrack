function addTask() {
    const title = document.getElementById("taskTitle").value;
    const priority = document.getElementById("taskPriority").value;
    const dueDate = document.getElementById("taskDueDate").value;

    if (title === "" || dueDate === "") {
        alert("Please enter task title and due date");
        return;
    }

    const taskList = document.getElementById("taskList");

    const taskItem = document.createElement("li");
    taskItem.textContent = `${title} | Priority: ${priority} | Due: ${dueDate}`;

    taskList.appendChild(taskItem);

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDueDate").value = "";
}
function updatePanicMeter() {

    const taskCount =
        document.querySelectorAll("#taskList li").length;

    const panicLevel =
        document.getElementById("panicLevel");

    if (taskCount <= 2) {
        panicLevel.innerHTML =
            "Current Panic Level: 🟢 Relaxed";
    }

    else if (taskCount <= 4) {
        panicLevel.innerHTML =
            "Current Panic Level: 🟡 Warning";
    }

    else if (taskCount <= 6) {
        panicLevel.innerHTML =
            "Current Panic Level: 🔴 Panic";
    }

    else {
        panicLevel.innerHTML =
            "Current Panic Level: ⚫ Critical";
    }
}
function generatePlan() {
    const course = document.getElementById("courseName").value;
    const hours = document.getElementById("studyHours").value;

    if (course === "" || hours === "") {
        alert("Please enter course name and study hours");
        return;
    }

    document.getElementById("studyPlan").textContent =
        `Study ${course} for ${hours} hour(s) today.`;

    document.getElementById("botMessage").textContent =
        `Focus on ${course} today. You can do it!`;
}
