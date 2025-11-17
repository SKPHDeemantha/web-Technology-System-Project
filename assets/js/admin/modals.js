// Ensure jQuery is loaded FIRST
$(document).ready(function () {

  /* ============================================================
     ADD USER FORM (DB BASED)
     ============================================================ */
  $(document).on("submit", "#addUserForm", function (e) {
    e.preventDefault(); // stop page refresh

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
     ADD COURSE FORM (LOCALSTORAGE) - Tell me if you want DB!
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

        // Refresh User Table
        renderUsersTable($("#userFilter").val());

        // Refresh Dashboard
        updateDashboardStats();
        loadDashboardData();

        // Close modal
        $("#addUserModal").modal("hide");

        // Reset form
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

        // Refresh community table
        renderCommunitiesTable();

        // Refresh dashboard
        updateDashboardStats();
        loadDashboardData();

        // Close modal
        $("#addCommunityModal").modal("hide");

        // Reset form
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
