// Navigation functionality
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(page + '-page').classList.add('active');
    
    // Update active navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Close mobile sidebar if open
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Mobile menu functionality
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

document.getElementById('overlay').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
    this.classList.remove('active');
});

// Schedule week navigation
document.getElementById('prevWeek').addEventListener('click', function() {
    // Logic to navigate to previous week
    updateWeekDisplay('prev');
});

document.getElementById('nextWeek').addEventListener('click', function() {
    // Logic to navigate to next week
    updateWeekDisplay('next');
});

function updateWeekDisplay(direction) {
    const weekElement = document.getElementById('currentWeek');
    // Simple week navigation logic - in a real app, you'd use date libraries
    const currentText = weekElement.textContent;
    alert(`Navigating to ${direction} week: ${currentText}`);
    
    // Here you would typically update the schedule table with new week data
    // For demonstration, we'll just show an alert
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Schedule page is active by default
    // You can add any schedule-specific initialization here
});

//For Side bar and Header

document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu li");
    const contentArea = document.getElementById("content-area");
    const dashboardContent = document.getElementById("dashboard-content");

    // Get saved page from localStorage or default to dashboard
    const savedPage = localStorage.getItem("activePage") || "dashboard";
    setActive(savedPage);
    loadPage(savedPage);

    // Menu click handling
    menuItems.forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            const page = item.dataset.page;
            setActive(page);
            localStorage.setItem("activePage", page);
            loadPage(page);
        });
    });

    // Set active menu item
    function setActive(page) {
        menuItems.forEach(i => i.classList.remove("active"));
        const activeItem = [...menuItems].find(i => i.dataset.page === page);
        if (activeItem) activeItem.classList.add("active");
    }

    // Load page content dynamically
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

            // Run component-specific JS manually
            if (page === "attendence") populateAttendance();
            if (page === "grade") populateGrades();
            if (page === "profile") loadProfile();
            if (page === "course") loadCourses();
            // Add more components here if needed

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

            // Assign color classes based on grade
            switch (item.grade) {
                case "A":
                case "A-":
                    gradeClass = "grade-excellent"; // green
                    break;
                case "B+":
                case "B":
                    gradeClass = "grade-good"; // blue
                    break;
                case "C":
                case "C-":
                    gradeClass = "grade-average"; // orange
                    break;
                default:
                    gradeClass = "grade-low"; // red
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

    // Profile page example
    function loadProfile() {
        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");

        if (!profileName || !profileEmail) return;

        profileName.textContent = "Alex Johnson";
        profileEmail.textContent = "alex@example.com";
    }

    function loadCourses() {
        const availableList = document.getElementById("availableCourses");
        const enrolledList = document.getElementById("enrolledCourses");
        if (!availableList || !enrolledList) return;

        const courses = ["Mathematics", "Physics", "Chemistry", "History", "English"];

        availableList.innerHTML = courses.map(c => `
            <div class="card">
                <h3 class="course-title">${c}</h3>
                <div class="card-actions">
                    <button class="btn primary" data-action="enroll">Enroll</button>
                </div>
                <span class="badge available">Available</span>
            </div>
        `).join("");

        enrolledList.innerHTML = "";

        updateEnrolledCount();
    }

    // Enroll a course
    function enrollCourse(button) {
        const card = button.closest(".card");
        const enrolledList = document.getElementById("enrolledCourses");
        if (!card || !enrolledList) return;

        const newCard = card.cloneNode(true);
        newCard.querySelector(".badge").textContent = "Enrolled";
        newCard.querySelector(".badge").classList.replace("available", "enrolled");
        newCard.querySelector(".card-actions").innerHTML = `
            <button class="btn primary" data-action="view">View Details</button>
            <button class="btn outline" data-action="drop">Drop Course</button>
        `;
        enrolledList.appendChild(newCard);
        card.remove();
        updateEnrolledCount();
    }

    // Drop a course
    function dropCourse(button) {
        const card = button.closest(".card");
        if (!card) return;

        if (confirm(`Are you sure you want to drop ${card.querySelector(".course-title").textContent}?`)) {
            card.remove();
            updateEnrolledCount();
        }
    }

    // View course details
    function viewDetails(button) {
        const card = button.closest(".card");
        if (!card) return;

        const courseName = card.querySelector(".course-title").textContent;
        const status = card.querySelector(".badge").textContent;
        alert(`Course: ${courseName}\nStatus: ${status}`);
    }

    // Update enrolled courses count in tab
    function updateEnrolledCount() {
        const count = document.querySelectorAll("#enrolledCourses .card").length;
        const enrolledTab = document.querySelector('.tab-btn[data-target="enrolled"]');
        if (enrolledTab) enrolledTab.textContent = `Enrolled Courses (${count})`;
    }

    // Event delegation for course buttons
    document.addEventListener("click", e => {
        const action = e.target.dataset.action;
        if (!action) return;

        if (action === "enroll") enrollCourse(e.target);
        else if (action === "drop") dropCourse(e.target);
        else if (action === "view") viewDetails(e.target);
    });
});