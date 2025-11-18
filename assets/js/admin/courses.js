// Course Management Functions
function initCoursesTable() {
  const courses = JSON.parse(localStorage.getItem('adminCourses')) || [
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Computer Science',
      lecturer: 'Dr. Jane Smith',
      lecturerId: 2,
      year: '1st Year',
      semester: 'Fall',
      credits: 3,
      students: 45,
      status: 'Active'
    },
    {
      id: 2,
      code: 'MTH201',
      name: 'Advanced Mathematics',
      lecturer: 'Prof. Robert Brown',
      lecturerId: 3,
      year: '2nd Year',
      semester: 'Spring',
      credits: 4,
      students: 32,
      status: 'Active'
    },
    {
      id: 3,
      code: 'PHY150',
      name: 'Physics Fundamentals',
      lecturer: 'Dr. Alice Johnson',
      lecturerId: 4,
      year: '1st Year',
      semester: 'Fall',
      credits: 3,
      students: 28,
      status: 'Active'
    }
  ];

  localStorage.setItem('adminCourses', JSON.stringify(courses));
  renderCoursesTable();
}

function renderCoursesTable() {
  const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
  const tbody = document.getElementById('coursesTableBody');

  if (!tbody) return;

  tbody.innerHTML = '';

  courses.forEach(course => {
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
}

// Global function for delete operations
window.deleteCourse = function (id) {
  if (confirm('Are you sure you want to delete this course?')) {
    const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
    const updatedCourses = courses.filter(course => course.id !== id);
    localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));

    renderCoursesTable();
    updateDashboardStats();
    addToActivityLog('Deleted a course');

    showAlert('Course deleted successfully!', 'success');
  }
};

// Global function for edit operations
window.editCourse = function (id) {
  const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
  const course = courses.find(c => c.id === id);

  if (course) {
    // Populate edit modal with course data
    document.getElementById('editCourseId').value = course.id;
    document.getElementById('editCourseCode').value = course.code;
    document.getElementById('editCourseName').value = course.name;
    document.getElementById('editCourseLecturer').value = course.lecturerId;
    document.getElementById('editCourseYear').value = course.year;
    document.getElementById('editCourseSemester').value = course.semester;
    document.getElementById('editCourseCredits').value = course.credits;
    document.getElementById('editCourseStatus').value = course.status;

    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editCourseModal'));
    editModal.show();
  }
};

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

      // Update UI
      renderCoursesTable();
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

        // Update UI
        renderCoursesTable();
        updateDashboardStats();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('editCourseModal')).hide();

        // Show success message
        showAlert('Course updated successfully!', 'success');
      }
    });
  }

  // Initialize courses table
  initCoursesTable();
});
