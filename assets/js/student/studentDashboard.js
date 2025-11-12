// main_script.js
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- Mobile Sidebar Toggle ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  }
  const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('svg');
const moonPath = 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z';
const sunPath = 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM6.34 5.16l-1.42 1.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.42-1.42c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0zm13.08 12.42l1.42 1.42c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.42-1.42c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41zm-14.84 0c.39.39 1.02.39 1.41 0l1.42-1.42c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.42 1.42c-.39.39-.39 1.02 0 1.41zm13.08-12.42c-.39.39-.39 1.02 0 1.41l1.42 1.42c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.42-1.42c-.39-.39-1.02-.39-1.41 0z';

// Check the current theme and set the initial icon
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.querySelector('path').setAttribute('d', sunPath);
} else {
    document.body.classList.remove('dark-theme');
    themeIcon.querySelector('path').setAttribute('d', moonPath);
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        themeIcon.querySelector('path').setAttribute('d', moonPath);
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-theme');
        themeIcon.querySelector('path').setAttribute('d', sunPath);
        localStorage.setItem('theme', 'dark');
    }
});

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when clicking on menu items on mobile
  const menuItems = document.querySelectorAll(".menu li");
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // Close sidebar when window is resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  /* ---------------- Sidebar & Navigation ---------------- */
  const contentArea = document.getElementById("content-area");
  const dashboardContent = document.getElementById("dashboard-content");

  // Check if we're on the main dashboard page
  const isDashboardPage = window.location.pathname.includes('dashboard') || 
                         document.getElementById('dashboard-content');

  // Only use saved page if we're not specifically on the dashboard page
  let savedPage;
  if (isDashboardPage) {
    savedPage = "dashboard";
    localStorage.setItem("activePage", "dashboard");
  } else {
    savedPage = localStorage.getItem("activePage") || "dashboard";
  }

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

  /* ---------------- Load Pages Dynamically ---------------- */
  async function loadPage(page) {
    if (page === "dashboard") {
      if (dashboardContent) {
        dashboardContent.style.display = "block";
      }
      if (contentArea) {
        contentArea.innerHTML = "";
      }
      return;
    } else if (dashboardContent) {
      dashboardContent.style.display = "none";
    }

    if (!contentArea) return;

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

      // Initialize page-specific functionality
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

  /* ---------------- Attendance ---------------- */
  function populateAttendance() {
    const data = [
      { course: "Mathematics", total: 20, attended: 18 },
      { course: "Physics", total: 15, attended: 14 },
      { course: "Chemistry", total: 18, attended: 16 },
      { course: "History", total: 12, attended: 10 },
      { course: "English", total: 22, attended: 20 },
    ];

    const tbody = document.querySelector("#attendanceTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const labels = ["Course", "Total Classes", "Attended", "Attendance %", "Status"];

    data.forEach(item => {
      const percent = Math.round((item.attended / item.total) * 100);
      let statusClass, statusText;

      if (percent >= 90) { statusClass = "excellent"; statusText = "Excellent"; }
      else if (percent >= 85) { statusClass = "good"; statusText = "Good"; }
      else if (percent >= 80) { statusClass = "average"; statusText = "Average"; }
      else { statusClass = "low"; statusText = "Low"; }

      const tr = document.createElement("tr");

      const cells = [
        item.course,
        item.total,
        item.attended,
        percent + "%",
        `<span class="status ${statusClass}">${statusText}</span>`
      ];

      cells.forEach((cellContent, i) => {
        const td = document.createElement("td");
        td.setAttribute("data-label", labels[i]);
        td.innerHTML = cellContent;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /* ---------------- Grades ---------------- */
  function populateGrades() {
    const gradesData = [
      { course: "Mathematics", assignment: "Algebra Test", grade: "A", date: "2025-10-01" },
      { course: "Physics", assignment: "Mechanics Lab", grade: "B+", date: "2025-10-05" },
      { course: "Chemistry", assignment: "Chem Quiz", grade: "A-", date: "2025-10-07" },
      { course: "History", assignment: "Essay", grade: "B", date: "2025-10-10" },
      { course: "English", assignment: "Literature Exam", grade: "C", date: "2025-10-12" },
    ];

    const tbody = document.querySelector("#gradesTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const labels = ["Course", "Assignment", "Grade", "Date"];

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

      const cells = [
        item.course,
        item.assignment,
        `<span class="${gradeClass}">${item.grade}</span>`,
        item.date
      ];

      cells.forEach((content, i) => {
        const td = document.createElement("td");
        td.setAttribute("data-label", labels[i]);
        td.innerHTML = content;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /* ---------------- Profile ---------------- */
  function loadProfile() {
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    if (!profileName || !profileEmail) return;

    profileName.textContent = "Alex Johnson";
    profileEmail.textContent = "alex@example.com";
  }

  /* ---------------- Courses ---------------- */
  function initCourses() {
    const enrolledPanel = document.getElementById("enrolled");
    const availablePanel = document.getElementById("available");
    if (!enrolledPanel || !availablePanel) return;

    const availableGrid = availablePanel.querySelector(".grid");
    const enrolledGrid = enrolledPanel.querySelector(".grid");

    // Load previously enrolled courses from localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

    // First reset all courses back to available
    const allCards = [...availableGrid.children, ...enrolledGrid.children];
    allCards.forEach(card => {
      const badge = card.querySelector(".badge");
      badge.textContent = "Available";
      badge.classList.add("available");
      badge.classList.remove("enrolled");
      card.querySelector(".card-actions").innerHTML = `
        <button class="btn primary" data-action="enroll">Enroll</button>
        <button class="btn outline" data-action="view">Details</button>
      `;
      availableGrid.appendChild(card);
    });

    // Move enrolled ones to enrolled panel
    enrolledCourses.forEach(courseName => {
      const card = [...availableGrid.children].find(
        c => c.querySelector(".course-title").textContent === courseName
      );
      if (card) {
        const badge = card.querySelector(".badge");
        badge.textContent = "Enrolled";
        badge.classList.remove("available");
        badge.classList.add("enrolled");
        card.querySelector(".card-actions").innerHTML = `
          <button class="btn primary" data-action="view">View Details</button>
          <button class="btn outline" data-action="drop">Drop Course</button>
        `;
        enrolledGrid.appendChild(card);
      }
    });

    updateEnrolledCount();

    // Tab switching
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

    // Enroll / Drop / View
    document.addEventListener("click", e => {
      const action = e.target.dataset.action;
      if (!action) return;
      const card = e.target.closest(".card");
      if (!card) return;

      const courseTitle = card.querySelector(".course-title").textContent;
      let courses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

      if (action === "enroll") {
        if (!courses.includes(courseTitle)) {
          courses.push(courseTitle);
          localStorage.setItem("enrolledCourses", JSON.stringify(courses));
        }
        const badge = card.querySelector(".badge");
        badge.textContent = "Enrolled";
        badge.classList.remove("available");
        badge.classList.add("enrolled");
        card.querySelector(".card-actions").innerHTML = `
          <button class="btn primary" data-action="view">View Details</button>
          <button class="btn outline" data-action="drop">Drop Course</button>
        `;
        enrolledGrid.appendChild(card);
        updateEnrolledCount();
      } 
      
      else if (action === "drop") {
        if (confirm(`Are you sure you want to drop ${courseTitle}?`)) {
          courses = courses.filter(c => c !== courseTitle);
          localStorage.setItem("enrolledCourses", JSON.stringify(courses));
          const badge = card.querySelector(".badge");
          badge.textContent = "Available";
          badge.classList.remove("enrolled");
          badge.classList.add("available");
          card.querySelector(".card-actions").innerHTML = `
            <button class="btn primary" data-action="enroll">Enroll</button>
            <button class="btn outline" data-action="view">Details</button>
          `;
          availableGrid.appendChild(card);
          updateEnrolledCount();
        }
      } 
      
      else if (action === "view") {
        alert(`Course: ${courseTitle}\nStatus: ${card.querySelector(".badge").textContent}`);
      }
    });

    function updateEnrolledCount() {
      const count = enrolledGrid.querySelectorAll(".card").length;
      const enrolledTab = document.querySelector('.tab-btn[data-target="enrolled"]');
      if (enrolledTab) enrolledTab.textContent = `Enrolled Courses (${count})`;
    }
  }

  /* ---------------- Schedule ---------------- */
  function loadSchedule() {
    // Add schedule JS here
  }
});
