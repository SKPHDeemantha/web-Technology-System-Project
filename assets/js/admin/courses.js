// Global fetchXML function
function fetchXML(url) {
  return $.ajax({ url, async: false }).responseXML;
}

// Course Management Functions
function initCoursesTable() {

  const userDataXML = fetchXML('../admin/adminxml.php?request=getCourseData');

  const rowNos     = userDataXML.getElementsByTagName("rowNo");
  const courseIds    = userDataXML.getElementsByTagName("courseId");
  const courseCodes  = userDataXML.getElementsByTagName("courseCode");
  const courseNames      = userDataXML.getElementsByTagName("courseName");
  const courseDescriptions     = userDataXML.getElementsByTagName("courseDescription");
  const courseCredits   = userDataXML.getElementsByTagName("courseCredit");
  const courseYears   = userDataXML.getElementsByTagName("courseYear");
  const courseLecturers   = userDataXML.getElementsByTagName("courseLecturer");
  const courseStudents   = userDataXML.getElementsByTagName("courseStudentCount");
  const courseStatuses   = userDataXML.getElementsByTagName("courseStatus");

    // --- Build JS array from XML ---
    const courseList = [];
    for (let i = 0; i < rowNos.length; i++) {
        courseList.push({
            id: courseIds[i].textContent,
            code: courseCodes[i].textContent,
            name: courseNames[i].textContent,
            description: courseDescriptions[i].textContent,
            credits: courseCredits[i].textContent,
            year: courseYears[i].textContent,
            lecturer: courseLecturers[i].textContent,
            students: courseStudents[i].textContent,
            status: courseStatuses[i].textContent == "1" ? "Active" : "Inactive"
        });
    }
    // --- Save to localStorage ---
    localStorage.setItem('adminCourses', JSON.stringify(courseList));

    // --- Render table initially ---
    renderCoursesTable();

    // --- Add search functionality ---
    const courseSearch = document.getElementById('courseSearch');
    const buttonSearch = document.getElementById('buttonSearch');
    
    if (courseSearch) {
        // Search on input (real-time)
        courseSearch.addEventListener('input', function () {
            renderCoursesTable(this.value);
        });

        // Also trigger search on Enter key
        courseSearch.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                renderCoursesTable(this.value);
            }
        });
    }

    if (buttonSearch) {
        // Search on button click
        buttonSearch.addEventListener('click', function () {
            const searchTerm = courseSearch ? courseSearch.value : '';
            renderCoursesTable(searchTerm);
        });
    }
}

function renderCoursesTable(searchTerm = '') {
  const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
  const tbody = document.getElementById('coursesTableBody');

  if (!tbody) return;

  tbody.innerHTML = '';

  // Apply search filter if search term exists
  let filteredCourses = courses;
  if (searchTerm) {
    filteredCourses = courses.filter(course =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.year.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filteredCourses.forEach(course => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${course.code}</td>
      <td>${course.name}</td>
      <td>${course.lecturer}</td>
      <td>${course.year}</td>
      <td>${course.students}</td>
      <td>
        <span class="badge ${course.status === 'Active' ? 'bg-success' : 'bg-warning'}">
          ${course.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-purple me-1" onclick="editCourse(${course.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${course.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Show message if no courses found
  if (filteredCourses.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="7" class="text-center text-muted py-4">
        ${searchTerm ? 'No courses found matching your search.' : 'No courses available.'}
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// Global function for delete operations
window.deleteCourse = function (id) {
  if (confirm('Are you sure you want to delete this course?')) {
    const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
    const updatedCourses = courses.filter(course => course.id !== id);
    localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));

    deleteCourseHandler(id);

    // Get current search term
    const courseSearch = document.getElementById('courseSearch');
    const searchTerm = courseSearch ? courseSearch.value : '';
    
    renderCoursesTable(searchTerm);
    updateDashboardStats();
    addToActivityLog('Deleted a course');

    showAlert('Course deleted successfully!', 'success');
  }
};

// edit course function
window.editCourse = function(id) {
  const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
  const course = courses.find(u => u.id === id);

  const userDataXML = fetchXML('../admin/adminxml.php?request=getCourseDataForEdit&courseId=' + id);

  const courseCode = userDataXML.getElementsByTagName("courseCode")[0].textContent;
  const courseName = userDataXML.getElementsByTagName("courseName")[0].textContent;
  const courseDescription = userDataXML.getElementsByTagName("courseDescription")[0].textContent;
  const courseCredits = userDataXML.getElementsByTagName("courseCredit")[0].textContent;
  const courseYear = userDataXML.getElementsByTagName("courseYear")[0].textContent;
  const courseLecturer = userDataXML.getElementsByTagName("courseLecturer")[0].textContent;
  const courseLecturerId = userDataXML.getElementsByTagName("courseLecturerId")[0].textContent;
  // const courseStudentCount = userDataXML.getElementsByTagName("courseStudentCount")[0].textContent;
  const courseStatus = userDataXML.getElementsByTagName("courseStatus")[0].textContent;

  if (courseCode.length > 0 && courseName.length > 0 && courseDescription.length > 0 && courseCredits.length > 0 && courseYear.length > 0 && courseLecturer.length > 0) {
    $('#editCourseId').val(id);
    $('#editCourseCode').val(courseCode);
    $('#editCourseName').val(courseName);
    $('#editCourseDesc').val(courseDescription);
    $('#editCourseYear').val(courseYear);
    $('#editCourseInstructor').val(courseLecturerId);
    $('#editCourseCredits').val(courseCredits);
    $('#editCourseModal').modal('show');
  } else {
    alert('Error loading course data for editing.');
  }

};

/* ============================================================
   AJAX: DELETE USER
   ============================================================ */
function deleteCourseHandler(course_id) {
  $.ajax({
    url: "../fileHandling/adminNewCourse.php?id=delete",
    type: "POST",
    data: {course_id},

    success: function (response) {
      if (response == 1) {

        alert("User deleted successfully!");

        const courseSearch = document.getElementById('courseSearch');
        const searchTerm = courseSearch ? courseSearch.value : '';
    
        renderCoursesTable(searchTerm);
        updateDashboardStats();
        loadDashboardData();

      } else {
        alert("Error deleting user!");
      }
    },
    error: function () {
      alert("AJAX Error!");
    }
  });
}

// Initialize courses when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Handle add course form submission
  const addCourseForm = document.getElementById('addCourseForm');
  if (addCourseForm) {
    addCourseForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const lecturerSelect = document.getElementById('courseInstructor');
      const selectedOption = lecturerSelect.options[lecturerSelect.selectedIndex];
      const lecturerName = selectedOption.text;
      const lecturerId = parseInt(lecturerSelect.value);

      const courseData = {
        id: Date.now(),
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseName').value,
        lecturer: lecturerName,
        lecturerId: lecturerId,
        year: document.getElementById('courseYear').value,
        semester: document.getElementById('courseSemester').value,
        credits: parseInt(document.getElementById('courseCredits').value),
        students: 0,
        status: 'Active'
      };

      const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
      courses.push(courseData);
      localStorage.setItem('adminCourses', JSON.stringify(courses));

      // Add to activity log
      addToActivityLog(`Created new course: ${courseData.code} - ${courseData.name}`);

      // Get current search term
      const courseSearch = document.getElementById('courseSearch');
      const searchTerm = courseSearch ? courseSearch.value : '';

      // Update UI
      renderCoursesTable(searchTerm);
      updateDashboardStats();

      // Close modal and reset form
      bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();
      this.reset();

      // Show success message
      showAlert('Course created successfully!', 'success');
    });
  }

  // Handle edit course form submission
  const editCourseForm = document.getElementById('editCourseForm');
  if (editCourseForm) {
    editCourseForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const courseId = parseInt(document.getElementById('editCourseId').value);
      const lecturerSelect = document.getElementById('editCourseLecturer');
      const selectedOption = lecturerSelect.options[lecturerSelect.selectedIndex];
      const lecturerName = selectedOption.text;
      const lecturerId = parseInt(lecturerSelect.value);

      const updatedCourse = {
        id: courseId,
        code: document.getElementById('editCourseCode').value,
        name: document.getElementById('editCourseName').value,
        lecturer: lecturerName,
        lecturerId: lecturerId,
        year: document.getElementById('editCourseYear').value,
        semester: document.getElementById('editCourseSemester').value,
        credits: parseInt(document.getElementById('editCourseCredits').value),
        students: 0, // Reset or keep existing
        status: document.getElementById('editCourseStatus').value
      };

      const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
      const index = courses.findIndex(c => c.id === courseId);
      if (index !== -1) {
        courses[index] = updatedCourse;
        localStorage.setItem('adminCourses', JSON.stringify(courses));

        // Add to activity log
        addToActivityLog(`Updated course: ${updatedCourse.code} - ${updatedCourse.name}`);

        // Get current search term
        const courseSearch = document.getElementById('courseSearch');
        const searchTerm = courseSearch ? courseSearch.value : '';

        // Update UI
        renderCoursesTable(searchTerm);
        updateDashboardStats();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('editCourseModal')).hide();

        // Show success message
        showAlert('Course updated successfully!', 'success');
      }
    });
  }

  // Initialize courses table
  $(document).ready(function() {
  initCoursesTable();
});
  // initCoursesTable();
});
