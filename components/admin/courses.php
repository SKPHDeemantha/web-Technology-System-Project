<link rel="stylesheet" href="../assets/css/admincss/courses.css">
<div class="d-flex justify-content-between align-items-center mb-4">
  <div>
    <h2>Course Management</h2>
    <p class="text-muted">Manage all courses in the system</p>
  </div>
  <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#addCourseModal">
    <i class="fas fa-plus me-1"></i> Add Course
  </button>
</div>

<div class="card">
  <div class="card-header">
    <div class="row align-items-center">
      <div class="col-md-6">
        <h5 class="mb-0">All Courses</h5>
      </div>
      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <div class="input-group input-group-sm w-auto">
            <input type="text" class="form-control" placeholder="Search courses..." id="courseSearch">
            <button class="btn btn-outline-secondary" type="button" id="buttonSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Year</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="coursesTableBody">
          <!-- Courses will be populated by JavaScript -->
        </tbody>
      </table>
    </div>
  </div>
</div>
<script src="../assets/js/admin/courses.js"></script>
