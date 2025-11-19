<?php

include '../../connect.php';
session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: ../index.php");
    exit();
}

?>

<!-- Modals for CRUD -->
<!-- Add User Modal -->
<link rel="stylesheet" href="../assets/css/admincss/modals.css">
<script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
<div class="modal fade" id="addUserModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add New User</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="addUserForm">
          <div class="mb-3">
            <label for="userName" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="userName" required>
          </div>
          <div class="mb-3">
            <label for="userRole" class="form-label">Role</label>
            <select class="form-select" id="userRole" required>
              <option value="Student" selected>Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="userEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="userEmail" required>
          </div>
          <div class="mb-3">
            <label for="userPassword" class="form-label">Password</label>
            <input type="password" class="form-control" id="userPassword" required>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="sendWelcomeEmail">
            <label class="form-check-label" for="sendWelcomeEmail">Send welcome email</label>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-purple">Add User</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Add Community Modal -->
<div class="modal fade" id="addCommunityModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create New Community</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="addCommunityForm">
          <div class="mb-3">
            <label for="communityName" class="form-label">Community Name</label>
            <input type="text" class="form-control" id="communityName" required>
          </div>
          <div class="mb-3">
            <label for="communityDesc" class="form-label">Description</label>
            <textarea class="form-control" id="communityDesc" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="communityCategory" class="form-label">Category</label>
            <select class="form-select" id="communityCategory" required>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Technical">Technical</option>
              <option value="Social">Social</option>
            </select>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-purple">Create Community</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Add Course Modal -->
<div class="modal fade" id="addCourseModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add New Course</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="addCousrseForm">
          <div class="mb-3">
            <label for="courseCode" class="form-label">Course Code</label>
            <input type="text" class="form-control" id="courseCode" required>
          </div>
          <div class="mb-3">
            <label for="courseName" class="form-label">Course Name</label>
            <input type="text" class="form-control" id="courseName" required>
          </div>
          <div class="mb-3">
            <label for="courseDesc" class="form-label">Description</label>
            <textarea class="form-control" id="courseDesc" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="courseYear" class="form-label">Course Year</label>
            <select class="form-select" id="courseYear" required>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <?php

          $query = "SELECT id, display_name FROM users WHERE role_id = (SELECT id FROM user_roles WHERE role_name = 'lecturer') AND is_active = 1";
          $result = mysqli_query($con, $query);
          ?>
          <div class="mb-3">
            <label for="courseInstructor" class="form-label">Instructor</label>
            <select class="form-select" id="courseInstructor" required>
              <?php
              while ($row = mysqli_fetch_assoc($result)) {
                  echo '<option value="' . $row['id'] . '">' . $row['display_name'] . '</option>';
              }
              ?>
            </select>
          </div>
          <div class="mb-3">
            <label for="courseCredits" class="form-label">Credits</label>
            <input type="number" class="form-control" id="courseCredits" min="1" max="5" value="3">
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-purple">Add Course</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Edit User Model -->
<div class="modal fade" id="editUserModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit User</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="editUserForm">
          <div class="mb-3">
            <label for="editUserId" class="form-label">ID</label>
            <input type="text" class="form-control" id="editUserId" disabled>
          </div>
          <div class="mb-3">
            <label for="editUserName" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="editUserName" placeholder="" required>
          </div>
          <div class="mb-3">
            <label for="editUserRole" class="form-label">Role</label>
            <select class="form-select" id="editUserRole" required>
              <option value="Student">Student</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="editUserEmail" class="form-label">Email</label>
            <input type="email" class="form-control" id="editUserEmail" required>
          </div>
          <div class="mb-3">
            <label for="editUserStatus" class="form-label">Status</label>
            <select class="form-select" id="editUserStatus" required>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-purple">Edit User</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Edit Course Model -->

<div class="modal fade" id="editCourseModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit Course</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body ">
        <form id="editCourseForm">
          <div class="mb-3">
            <label for="editCourseId" class="form-label">Course ID</label>
            <input type="text" class="form-control" id="editCourseId" disabled>
          </div>
          <div class="mb-3">
            <label for="editCourseCode" class="form-label ">Course Code</label>
            <input type="text" class="form-control" id="editCourseCode" required>
          </div>
          <div class="mb-3">
            <label for="editCourseName" class="form-label ">Course Name</label>
            <input type="text" class="form-control" id="editCourseName" required>
          </div>
          <div class="mb-3">
            <label for="editCourseDesc" class="form-label ">Description</label>
            <textarea class="form-control" id="editCourseDesc" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="editCourseYear" class="form-label ">Course Year</label>
            <select class="form-select" id="editCourseYear" required>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="editCourseInstructor" class="form-label ">Instructor</label>
            <select class="form-select" id="editCourseInstructor" required>
              <?php
              // Reuse the same query to fetch lecturers
              $result = mysqli_query($con, $query);
              while ($row = mysqli_fetch_assoc($result)) {
                  echo '<option value="' . $row['id'] . '">' . $row['display_name'] . '</option>';
              }
              ?>
            </select>
          </div>
          <div class="mb-3">
            <label for="editCourseCredits" class="form-label ">Credits</label>
            <input type="number" class="form-control" id="editCourseCredits" min="1" max="5" required>
          </div>
          <div class="mb-3">
            <label for="editCourseStatus" class="form-label">Status</label>
            <select class="form-select" id="editCourseStatus" required>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-purple">Edit Course</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>


<!-- <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script> -->
<script src="../assets/js/admin/modals.js"></script>


