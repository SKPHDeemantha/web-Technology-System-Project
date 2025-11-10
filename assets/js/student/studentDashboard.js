// main_script.js
document.addEventListener("DOMContentLoaded", () => {

  // ---------------- Sidebar & Navigation ----------------
  const menuItems = document.querySelectorAll(".menu li");
  const contentArea = document.getElementById("content-area");
  const dashboardContent = document.getElementById("dashboard-content");

  const savedPage = localStorage.getItem("activePage") || "dashboard";
  setActive(savedPage);
  loadPage(savedPage);

  menuItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const page = item.dataset.page;
      setActive(page);
      localStorage.setItem("activePage", page);
      loadPage(page);
    });
  });

  function setActive(page) {
    menuItems.forEach(i => i.classList.remove("active"));
    const activeItem = [...menuItems].find(i => i.dataset.page === page);
    if (activeItem) activeItem.classList.add("active");
  }

  // ---------------- Load Pages Dynamically ----------------
  async function loadPage(page) {
    if (page === "dashboard") {
      dashboardContent.style.display = "block";
      contentArea.innerHTML = "";
      return;
    } else {
      dashboardContent.style.display = "none";
    }

    contentArea.innerHTML = `
      <div class="loader-container">
        <div class="loader"></div>
        <p>Loading ${page.charAt(0).toUpperCase() + page.slice(1)}...</p>
      </div>
    `;

    try {
      const response = await fetch(`/components/student/${page}.html`);
      if (!response.ok) throw new Error("Page not found");
      const html = await response.text();
      contentArea.innerHTML = html;

      // Component-specific initialization
      if (page === "attendence") populateAttendance();
      if (page === "grade") populateGrades();
      if (page === "profile") loadProfile();
      if (page === "course") initCourses();
      if (page === "schedule") loadSchedule();

    } catch (error) {
      contentArea.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Error</h3>
          <p>Could not load <strong>${page}</strong> page.</p>
          <p style="color:red;">${error.message}</p>
        </div>
      `;
    }
  }

  // ---------------- Attendance ----------------
  function populateAttendance() {
    const data = [
      { course: "Mathematics", total: 20, attended: 18 },
      { course: "Physics", total: 75, attended: 14 },
      { course: "Chemistry", total: 18, attended: 16 },
      { course: "History", total: 12, attended: 10 },
      { course: "English", total: 22, attended: 20 },
    ];

    const tbody = document.querySelector("#attendanceTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach(item => {
      const percent = Math.round((item.attended / item.total) * 100);
      let statusClass, statusText;

      if (percent >= 90) { statusClass = "excellent"; statusText = "Excellent"; }
      else if (percent >= 85) { statusClass = "good"; statusText = "Good"; }
      else if (percent >= 80) { statusClass = "average"; statusText = "Average"; }
      else { statusClass = "low"; statusText = "Low"; }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.course}</td>
        <td>${item.total}</td>
        <td>${item.attended}</td>
        <td>${percent}%</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ---------------- Grades ----------------
  function populateGrades() {
    const gradesData = [
      { course: "Mathematics", assignment: "Algebra Test", grade: "A", date: "2025-10-01" },
      { course: "Physics", assignment: "Mechanics Lab", grade: "B+", date: "2025-10-05" },
      { course: "Chemistry", assignment: "Organic Chem Quiz", grade: "A-", date: "2025-10-07" },
      { course: "History", assignment: "Essay", grade: "B", date: "2025-10-10" },
      { course: "English", assignment: "Literature Exam", grade: "C", date: "2025-10-12" },
    ];

    const tbody = document.querySelector("#gradesTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    gradesData.forEach(item => {
      let gradeClass;
      switch (item.grade) {
        case "A":
        case "A-": gradeClass = "grade-excellent"; break;
        case "B+": case "B": gradeClass = "grade-good"; break;
        case "C": case "C-": gradeClass = "grade-average"; break;
        default: gradeClass = "grade-low"; break;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.course}</td>
        <td>${item.assignment}</td>
        <td><span class="${gradeClass}">${item.grade}</span></td>
        <td>${item.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ---------------- Profile ----------------
  function loadProfile() {
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    if (!profileName || !profileEmail) return;

    profileName.textContent = "Alex Johnson";
    profileEmail.textContent = "alex@example.com";
  }

  // ---------------- Courses ----------------
  function initCourses() {
    const enrolledPanel = document.getElementById("enrolled");
    const availablePanel = document.getElementById("available");

    if (!enrolledPanel || !availablePanel) return;

    const availableGrid = availablePanel.querySelector(".grid");
    const enrolledGrid = enrolledPanel.querySelector(".grid");

    const courses = ["Mathematics", "Physics", "Chemistry", "History", "English"];

    // Render available courses
    availableGrid.innerHTML = courses.map(c => `
      <article class="card available">
        <div class="card-head">
          <div class="course-title">${c}</div>
          <span class="badge available">Available</span>
        </div>
        <div class="card-actions">
          <button class="btn primary" data-action="enroll">Enroll</button>
          <button class="btn outline" data-action="view">Details</button>
        </div>
      </article>
    `).join("");

    updateEnrolledCount();

    // Tab buttons for Enrolled / Available
    const tabButtons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".panel");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.dataset.target;
        panels.forEach(panel => panel.classList.toggle("hidden", panel.id !== target));
      });
    });

    // Enroll / Drop / View functionality
    document.addEventListener("click", e => {
      const action = e.target.dataset.action;
      if (!action) return;

      const card = e.target.closest(".card");
      if (!card) return;

      if (action === "enroll") {
        card.querySelector(".badge").textContent = "Enrolled";
        card.querySelector(".badge").classList.replace("available", "enrolled");
        card.querySelector(".card-actions").innerHTML = `
          <button class="btn primary" data-action="view">View Details</button>
          <button class="btn outline" data-action="drop">Drop Course</button>
        `;
        enrolledGrid.appendChild(card);
        updateEnrolledCount();
      } else if (action === "drop") {
        if (confirm(`Are you sure you want to drop ${card.querySelector(".course-title").textContent}?`)) {
          card.remove();
          updateEnrolledCount();
        }
      } else if (action === "view") {
        alert(`Course: ${card.querySelector(".course-title").textContent}\nStatus: ${card.querySelector(".badge").textContent}`);
      }
    });

    function updateEnrolledCount() {
      const count = enrolledGrid.querySelectorAll(".card").length;
      const enrolledTab = document.querySelector('.tab-btn[data-target="enrolled"]');
      if (enrolledTab) enrolledTab.textContent = `Enrolled Courses (${count})`;
    }
  }

  // ---------------- Schedule Placeholder ----------------
  function loadSchedule() {
    // Add schedule JS here
  }

  // ---------------- Mobile Sidebar ----------------
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

});
