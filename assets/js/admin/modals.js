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
     ADD COURSE FORM (DB BASED)
     ============================================================ */

     $(document).on("submit", "#addCousrseForm", function (e){
      e.preventDefault();

      const courseCode = $("#courseCode").val();
      const courseName = $("#courseName").val();
      const courseInstructor = $("#courseInstructor").val();
      const courseCredits = $("#courseCredits").val();
      const courseYear = $("#courseYear").val();
      const courseDesc = $("#courseDesc").val();

      newCourseHandler(courseCode, courseName, courseDesc, courseInstructor, courseCredits, courseYear);

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
     EDIT COURSES FORM (DB BASED)
     ============================================================ */
  $(document).on("submit", "#editCourseForm", function (e) {
    e.preventDefault();
    
    const course_id = $("#editCourseId").val();
    const courseCode = $("#editCourseCode").val();
    const courseName = $("#editCourseName").val();
    const courseDesc = $("#editCourseDesc").val();
    const courseInstructor = $("#editCourseInstructor").val();
    const courseCredits = $("#editCourseCredits").val();
    const courseYear = $("#editCourseYear").val();
    const courseStatus = $("#editCourseStatus").val();

    editCourseHandler( courseCode, courseName, courseDesc, courseInstructor, courseCredits, courseYear, course_id, courseStatus );

    addToActivityLog(`Edited course: ${courseName} (${courseCode})`);

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
   AJAX: EDIT COURSE
   ============================================================ */

function editCourseHandler( courseCode, courseName, courseDesc, courseInstructor, courseCredits, courseYear, course_id, courseStatus ) {
  $.ajax({
    url: "../fileHandling/adminNewCourse.php?id=update",
    type: "POST",
    data: { courseCode, courseName, courseDesc, courseInstructor, courseCredits, courseYear, course_id, courseStatus },
    success: function (response) {
      if (response == 1) {
        alert("Course updated successfully!");
        renderCoursesTable(); // Refresh table

        updateDashboardStats();

        loadDashboardData();

        $("#editCourseModal").modal("hide");
        $("#editCourseForm")[0].reset();
      } else {
        alert("Error editing course!");
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
   AJAX: ADD NEW COURSE
   ============================================================ */

  function newCourseHandler(courseCode, courseName, courseDesc, courseInstructor, courseCredits, courseYear){
    $.ajax({
      url: "../fileHandling/adminNewCourse.php?id=save",
      type: "POST",
      data: { courseCode, courseName, courseDesc, courseInstructor, courseCredits, courseYear },

      success: function (response) {
        if (response == 1) {
          alert("Course added successfully!");
          renderCoursesTable();

          updateDashboardStats();
          loadDashboardData();
          $("#addCourseModal").modal("hide");
          $("#addCousrseForm")[0].reset();

        } else {
          alert("Error adding course!");
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
