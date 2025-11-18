// Ensure jQuery is loaded FIRST
$(document).ready(function () {

  /* ============================================================
     ADD USER FORM (DB BASED)
     ============================================================ */
  $(document).on("submit", "#addUserForm", function (e) {
    e.preventDefault();

    const name = $("#userName").val();
    const role = $("#userRole").val();
    const email = $("#userEmail").val();
    const password = $("#userPassword").val();

    newUserHandler(name, email, password, role);

    addToActivityLog(`Added new user: ${name} (${role})`);
  });


  /* ============================================================
     ADD COMMUNITY FORM (DB BASED)
     ============================================================ */
  $(document).on("submit", "#addCommunityForm", function (e) {
    e.preventDefault();

    const name        = $("#communityName").val();
    const description = $("#communityDesc").val();
    const category    = $("#communityCategory").val();

    newCommunityHandler(name, description, category);

    addToActivityLog(`Created new community: ${name}`);
  });


  /* ============================================================
     ADD COURSE FORM (LOCALSTORAGE)
     ============================================================ */
  $("#addCourseModal form").on("submit", function (e) {
    e.preventDefault();

    const code = $("#courseCode").val();
    const name = $("#courseName").val();
    const instructor = $("#courseInstructor").val();
    const credits = $("#courseCredits").val();

    const courses = JSON.parse(localStorage.getItem("adminCourses")) || [];

    const newCourse = {
      id: Date.now(),
      code,
      name,
      instructor,
      credits
    };

    courses.push(newCourse);
    localStorage.setItem("adminCourses", JSON.stringify(courses));

    addToActivityLog(`Added new course: ${name} (${code})`);

    renderCoursesTable();
    updateDashboardStats();

    $("#addCourseModal").modal("hide");
    this.reset();

    showAlert("Course added successfully!", "success");
  });

});

  /* ============================================================
     EDIT USER FORM (DB BASED)
     ============================================================ */
  $(document).on("submit", "#editUserForm", function (e) {
    e.preventDefault();

    const name = $("#editUserName").val();
    const role = $("#editUserRole").val();
    const email = $("#editUserEmail").val();
    const user_id = $("#editUserId").val();
    const status = $("#editUserStatus").val();

    editUserHandler(name, email, role, user_id, status);

    addToActivityLog(`Edited user: ${name} (${role})`);
  });



/* ============================================================
   AJAX: ADD NEW USER
   ============================================================ */
function newUserHandler(fullname, email, password, role) {
  $.ajax({
    url: "../fileHandling/adminNewUser.php?id=save",
    type: "POST",
    data: { fullname, email, password, role },

    success: function (response) {
      if (response == 1) {

        alert("User added successfully!");

        renderUsersTable($("#userFilter").val()); // Refresh table
        updateDashboardStats();
        loadDashboardData();

        $("#addUserModal").modal("hide");
        $("#addUserForm")[0].reset();

      } else {
        alert("Error adding user!");
      }
    },
    error: function () {
      alert("AJAX Error!");
    }
  });
}

/* ============================================================
   AJAX: EDIT USER
   ============================================================ */
function editUserHandler(fullname, email, role, user_id, status) {
  $.ajax({
    url: "../fileHandling/adminNewUser.php?id=update",
    type: "POST",
    data: { fullname, email, role, user_id, status },

    success: function (response) {
      if (response == 1) {

        alert("User updated successfully!");

        renderUsersTable($("#userFilter").val()); // Refresh table
        updateDashboardStats();
        loadDashboardData();

        $("#editUserModal").modal("hide");
        $("#editUserForm")[0].reset();

      } else {
        alert("Error editing user!");
      }
    },
    error: function () {
      alert("AJAX Error!");
    }
  });
}



/* ============================================================
   AJAX: ADD NEW COMMUNITY
   ============================================================ */
function newCommunityHandler(name, description, category) {
  $.ajax({
    url: "../fileHandling/adminNewCommunity.php?id=save",
    type: "POST",
    data: { name, description, category },

    success: function (response) {
      if (response == 1) {

        alert("Community created successfully!");

        renderCommunitiesTable();
        updateDashboardStats();
        loadDashboardData();

        $("#addCommunityModal").modal("hide");
        $("#addCommunityForm")[0].reset();

      } else {
        alert("Error creating community!");
      }
    },

    error: function () {
      alert("AJAX Error!");
    }
  });
}



/* ============================================================
   📌 ACTIVITY LOG — LOCALSTORAGE ONLY
   ============================================================ */
function addToActivityLog(message) {

  let activity = JSON.parse(localStorage.getItem("recentActivity")) || [];

  const newEntry = {
    id: Date.now(),
    message: message,
    time: new Date().toLocaleString()
  };

  // Newest on top
  activity.unshift(newEntry);

  // Keep only last 10
  activity = activity.slice(0, 10);

  localStorage.setItem("recentActivity", JSON.stringify(activity));

  // Auto update dashboard if visible
  if (typeof renderRecentActivity === "function") {
    renderRecentActivity();
  }
}



/* ============================================================
   📌 RENDER RECENT ACTIVITY UI
   ============================================================ */
function renderRecentActivity() {

  const container = document.getElementById("recentActivityList");
  if (!container) return;

  const activity = JSON.parse(localStorage.getItem("recentActivity")) || [];

  container.innerHTML = "";

  activity.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("activity-item");

    div.innerHTML = `
      <p class="activity-message">${item.message}</p>
      <small class="activity-time">${item.time}</small>
    `;

    container.appendChild(div);
  });
}
