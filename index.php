<?php
include 'connect.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>University Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <link rel="stylesheet" href="assets/css/login.css" />
</head>
<body>
  <div class="auth-container">
    <div class="auth-card fade-in">
      <div class="auth-left">
        <h2 class="title">Welcome Back</h2>
        <p class="subtitle">Login to your University Portal</p>

        <form id="loginForm">
          <div class="form-group">
            <label for="role">Login as:</label>
            <select class="form-select" id="role" required>
              <option value="" disabled selected>Select Role</option>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="form-group">
            <label id="yearLabel" style="display:none;">Year</label>
            <select class="form-control" id="year" name="year" style="display:none;">
              <option value="">Select Year</option>
              <option value="first">First Year</option>
              <option value="second">Second Year</option>
              <option value="third">Third Year</option>
              <option value="fourth">Fourth Year</option>
            </select>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" class="form-control" placeholder="you@example.com" required />
          </div>

          <div class="form-group password-group">
            <label>Password</label>
            <input type="password" class="form-control" id="password" placeholder="••••••••" required />
            <!-- <i class="fa-solid fa-eye toggle-password"></i> -->
          </div>

          <button type="submit" class="btn-gradient w-100 mt-3">Login</button>
          <p class="text-center mt-3">Don't have an account? <a href="signup.php">Sign up</a></p>
        </form>

        <div class="oauth-login">
        </div>
      </div>

      <div class="auth-right">
        <div class="info-card">
          <div class="image-container">
            <img src="https://xvuxswvxdsxzfjtsdorn.supabase.co/storage/v1/object/public/images/login-LMS.jpg" alt="Login LMS Image">
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="assets/js/auth.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
</body>
</html>