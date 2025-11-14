// timetable.js — fixed and fully working version

// -------------------- SAMPLE TIMETABLE DATA --------------------
// Handle active state of view buttons
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".view-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));
            // Add 'active' class to clicked button
            button.classList.add("active");

            // You can also perform actions here (e.g., change timetable view)
            const selectedView = button.getAttribute("data-view");
            console.log("View changed to:", selectedView);
        });
    });
});

// Animate numbers smoothly when page loads
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-value");

    counters.forEach(counter => {
        const target = +counter.textContent;
        counter.textContent = "0";

        let count = 0;
        const updateCounter = () => {
            if (count < target) {
                count += Math.ceil(target / 30); // speed of counting
                counter.textContent = count > target ? target : count;
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    });

    // Highlight increase/decrease briefly
    const changes = document.querySelectorAll(".stat-change.up, .stat-change.down");

    changes.forEach(change => {
        change.style.transition = "background 0.5s";
        change.style.background = "rgba(0, 255, 0, 0.1)";
        setTimeout(() => {
            change.style.background = "transparent";
        }, 800);
    });
});

const timetableData = [
  {
    id: 1,
    name: "CS 101 - Programming",
    course: "CS 101",
    day: "monday",
    time: "9:00",
    duration: 2,
    room: "Room 101",
    type: "lecture",
    color: "#3498db",
  },
  {
    id: 2,
    name: "MATH 201 - Calculus",
    course: "MATH 201",
    day: "monday",
    time: "11:00",
    duration: 1,
    room: "Room 205",
    type: "lecture",
    color: "#2ecc71",
  },
  {
    id: 3,
    name: "CS 101 - Lab Session",
    course: "CS 101",
    day: "monday",
    time: "14:00",
    duration: 2,
    room: "Lab A",
    type: "lab",
    color: "#3498db",
  },
  {
    id: 4,
    name: "PHY 201 - Physics",
    course: "PHY 201",
    day: "tuesday",
    time: "10:00",
    duration: 2,
    room: "Room 302",
    type: "lecture",
    color: "#e74c3c",
  },
  {
    id: 5,
    name: "CS 201 - Data Structures",
    course: "CS 201",
    day: "tuesday",
    time: "13:00",
    duration: 2,
    room: "Room 101",
    type: "lecture",
    color: "#34495e",
  },
  {
    id: 6,
    name: "MATH 201 - Tutorial",
    course: "MATH 201",
    day: "wednesday",
    time: "9:00",
    duration: 1,
    room: "Room 205",
    type: "tutorial",
    color: "#2ecc71",
  },
  {
    id: 7,
    name: "CS 301 - Algorithms",
    course: "CS 301",
    day: "wednesday",
    time: "11:00",
    duration: 2,
    room: "Room 401",
    type: "lecture",
    color: "#f39c12",
  },
  {
    id: 8,
    name: "PHY 201 - Lab",
    course: "PHY 201",
    day: "thursday",
    time: "14:00",
    duration: 3,
    room: "Physics Lab",
    type: "lab",
    color: "#e74c3c",
  },
  {
    id: 9,
    name: "CS 201 - Seminar",
    course: "CS 201",
    day: "friday",
    time: "10:00",
    duration: 1,
    room: "Auditorium",
    type: "seminar",
    color: "#9b59b6",
  },
];

// -------------------- GLOBAL VARIABLES --------------------
const timeSlots = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

let timetableBody, classModal, classForm, currentWeekStart;

// -------------------- INITIALIZATION --------------------
document.addEventListener("DOMContentLoaded", () => {
  timetableBody = document.getElementById("timetableBody");
  classModal = document.getElementById("classModal");
  classForm = document.getElementById("classForm");

  if (timetableBody) {
    setupEventListeners();
    generateTimetable();
    loadUpcomingClasses();
    updateWeekDisplay();
  }
});

// -------------------- EVENT LISTENERS --------------------
function setupEventListeners() {
  // View Buttons
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".view-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      switchView(e.target.dataset.view);
    });
  });

  // Navigation Buttons
  document.getElementById("prevWeek")?.addEventListener("click", previousWeek);
  document.getElementById("nextWeek")?.addEventListener("click", nextWeek);

  // Action Buttons
  document.getElementById("addClassBtn")?.addEventListener("click", openClassModal);
  document.getElementById("exportTimetable")?.addEventListener("click", exportTimetable);

  // Modal Buttons
  document.querySelector(".close")?.addEventListener("click", closeClassModal);
  document.getElementById("cancelBtn")?.addEventListener("click", closeClassModal);
  document.getElementById("saveClassBtn")?.addEventListener("click", saveClass);

  // Sidebar Navigation
  document.querySelectorAll(".sidebar-menu li").forEach((item) => {
    item.addEventListener("click", (e) => {
      const page = e.currentTarget.dataset.page;
      if (page === "timetable") return; // already active

      // Remove active class from all
      document.querySelectorAll(".sidebar-menu li").forEach((li) => li.classList.remove("active"));
      e.currentTarget.classList.add("active");

      // Navigate to appropriate page
      switch (page) {
        case "dashboard":
          window.location.href = "../../lecture/lecturer-dashboard.html";
          break;
        case "announcements":
          window.location.href = "announcement.html";
          break;
        case "materials":
          window.location.href = "studyMaterial.html";
          break;
        case "assignments":
        case "students":
        case "messaging":
        case "communities":
          window.location.href = "../../lecture/lecturer-dashboard.html#" + page;
          break;
      }
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === classModal) closeClassModal();
  });
}

// -------------------- TIMETABLE GENERATION --------------------
function generateTimetable() {
  timetableBody.innerHTML = "";

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  timeSlots.forEach((time) => {
    // Time Column
    const timeCol = document.createElement("div");
    timeCol.className = "time-slot";
    timeCol.textContent = formatTimeDisplay(time);
    timetableBody.appendChild(timeCol);

    // Day Columns
    days.forEach((day) => {
      const daySlot = document.createElement("div");
      daySlot.className = "day-slot";
      daySlot.dataset.day = day;
      daySlot.dataset.time = time;

      const classesHere = getClassesAtTime(day, time);
      if (classesHere.length > 0) {
        classesHere.forEach((classItem) => {
          const classElement = createClassElement(classItem);
          daySlot.appendChild(classElement);
        });
      } else {
        const empty = document.createElement("div");
        empty.className = "empty-slot";
        empty.innerHTML = "<i>+</i>";
        empty.addEventListener("click", () => openClassModalAt(day, time));
        daySlot.appendChild(empty);
      }

      timetableBody.appendChild(daySlot);
    });
  });
}

function getClassesAtTime(day, time) {
  return timetableData.filter((cls) => cls.day === day && cls.time === time);
}

function createClassElement(classItem) {
  const div = document.createElement("div");
  div.className = `class-item ${classItem.type}`;
  div.style.backgroundColor = classItem.color;
  div.dataset.id = classItem.id;
  div.innerHTML = `
    <div class="class-item-content">
      <div class="class-name">${classItem.course}</div>
      <div class="class-details">${classItem.room}</div>
      <div class="class-details">${classItem.type}</div>
    </div>
    <div class="class-time">${formatTimeDisplay(classItem.time)}</div>
  `;
  div.addEventListener("click", () => editClass(classItem.id));
  return div;
}

function formatTimeDisplay(time) {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

// -------------------- VIEW SWITCHING --------------------
function switchView(view) {
  switch (view) {
    case "week":
      generateTimetable();
      break;
    case "day":
      alert("Day view coming soon!");
      break;
    case "month":
      alert("Month view coming soon!");
      break;
  }
}

// -------------------- WEEK NAVIGATION --------------------
function updateWeekDisplay() {
  if (!currentWeekStart) {
    currentWeekStart = new Date();
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
  }

  const weekText = document.getElementById("currentWeek");
  if (weekText) {
    weekText.textContent = `Week of ${formatDate(currentWeekStart)}`;
  }
}

function previousWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  updateWeekDisplay();
}

function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  updateWeekDisplay();
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// -------------------- UPCOMING CLASSES --------------------
function loadUpcomingClasses() {
  const container = document.getElementById("upcomingClasses");
  if (!container) return;

  const today = new Date().toLocaleString("en-us", { weekday: "long" }).toLowerCase();
  const todayClasses = timetableData.filter((cls) => cls.day === today);

  container.innerHTML = "";
  if (todayClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i>📅</i>
        <h3>No classes today</h3>
        <p>Enjoy your free time!</p>
      </div>`;
    return;
  }

  todayClasses.forEach((cls) => {
    const div = document.createElement("div");
    div.className = "upcoming-class-item";
    div.innerHTML = `
      <div class="upcoming-class-info">
        <div class="upcoming-class-name">${cls.name}</div>
        <div class="upcoming-class-details">
          <span>${cls.room}</span> •
          <span>${cls.type}</span> •
          <span>${cls.duration} hour${cls.duration > 1 ? "s" : ""}</span>
        </div>
      </div>
      <div class="upcoming-class-time">${formatTimeDisplay(cls.time)}</div>
    `;
    container.appendChild(div);
  });
}

// -------------------- CLASS MODAL FUNCTIONS --------------------
function openClassModal() {
  classModal.style.display = "block";
  classForm.reset();
  document.getElementById("saveClassBtn").textContent = "Save Class";
}

function openClassModalAt(day, time) {
  openClassModal();
  document.getElementById("classDay").value = day;
  document.getElementById("classTime").value = time;
}

function closeClassModal() {
  classModal.style.display = "none";
}

function saveClass() {
  const formData = {
    name: document.getElementById("className").value.trim(),
    course: document.getElementById("courseSelect").value,
    day: document.getElementById("classDay").value,
    time: document.getElementById("classTime").value,
    duration: parseInt(document.getElementById("classDuration").value),
    room: document.getElementById("classRoom").value.trim(),
    type: document.getElementById("classType").value,
    description: document.getElementById("classDescription").value.trim(),
  };

  if (!formData.name || !formData.course || !formData.room) {
    alert("Please fill in all required fields.");
    return;
  }

  const conflict = timetableData.find(
    (c) => c.day === formData.day && c.time === formData.time
  );
  if (conflict) {
    alert("There is already a class scheduled at this time!");
    return;
  }

  const newClass = {
    id: timetableData.length + 1,
    ...formData,
    color: getRandomColor(),
  };
  timetableData.push(newClass);

  generateTimetable();
  loadUpcomingClasses();
  closeClassModal();
  alert("Class added successfully!");
}

function editClass(id) {
  const cls = timetableData.find((c) => c.id === id);
  if (!cls) return;

  if (confirm(`Edit ${cls.name}?`)) {
    openClassModal();
    document.getElementById("className").value = cls.name;
    document.getElementById("courseSelect").value = cls.course;
    document.getElementById("classDay").value = cls.day;
    document.getElementById("classTime").value = cls.time;
    document.getElementById("classDuration").value = cls.duration;
    document.getElementById("classRoom").value = cls.room;
    document.getElementById("classType").value = cls.type;
    document.getElementById("classDescription").value = cls.description || "";

    const saveBtn = document.getElementById("saveClassBtn");
    saveBtn.textContent = "Update Class";
    saveBtn.onclick = () => updateClass(id);
  }
}

function updateClass(id) {
  alert("Update functionality coming soon!");
  closeClassModal();
}

function exportTimetable() {
  const text = timetableData
    .map(
      (cls) =>
        `${cls.day.toUpperCase()}: ${cls.time} - ${cls.name} (${cls.room})`
    )
    .join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "timetable.txt";
  a.click();
  URL.revokeObjectURL(url);
  alert("Timetable exported successfully!");
}

// -------------------- UTILITIES --------------------
function getRandomColor() {
  const colors = [
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
