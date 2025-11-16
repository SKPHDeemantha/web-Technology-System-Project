<?php
include 'connect.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>University Sign Up</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="assets/css/signup.css" />
</head>
<body>
  <div class="auth-container">
    <div class="auth-card fade-in">
      <div class="auth-left">
        <h2 class="title">Create Account</h2>
        <p class="subtitle">Join the University Portal today</p>

        <form id="signupForm" method="POST" action="fileHandling/signuphandling.php">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="fullName" name="fullName" class="form-control" placeholder="John Doe" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" name="email" class="form-control" placeholder="you@example.com" required />
          </div>

          <div class="form-group password-group">
            <label>Password</label>
            <input type="password" class="form-control" id="signupPassword" name="password" placeholder="••••••••" required />
            <i class="fa-solid fa-eye toggle-password"></i>
          </div>

          <ul class="password-rules">
            <li>At least 8 characters</li>
            <li>At least one number or symbol</li>
            <li>Uppercase and lowercase letters</li>
          </ul>

 
          <div class="form-group">
            <label>Re-type Password</label>
            <input type="password" id="rePassword" name="rePassword" class="form-control" placeholder="••••••••" required />
          </div>
                   <div class="form-group">
            <label>Role</label>
            <select class="form-control" id="role" name="role" required>
              <option value="">Select Role</option>
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

          <button type="submit" class="btn-gradient w-100 mt-3">Sign Up</button>
          <p class="text-center mt-3">Already have an account? <a href="index.php">Login</a></p>
        </form>
      </div>

      <div class="auth-right">
             <div class="image-container">
         <img src="https://xvuxswvxdsxzfjtsdorn.supabase.co/storage/v1/object/public/images/login-LMS.jpg" alt="Login LMS Image" />
       </div>
      </div>
    </div>
  </div>

  <script src="assets/js/auth.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
</body>
</html>