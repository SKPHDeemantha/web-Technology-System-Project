<?php
include '../connect.php';
session_start();
// if(!isset($_SESSION['user_id'])){
//     header("Location: ../index.php");
//     exit();
// }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Panel - University Management System</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
   <link rel="stylesheet" href="../assets/css/admincss/admin-panel.css">
   <link rel="stylesheet" href="../assets/css/admincss/dashboard.css">
</head>
<body>
  <div id="header-placeholder"></div>

  <div class="container-fluid">
    <div class="row">
      <div id="sidebar-placeholder"></div>

      <!-- Main Content -->
      <main class="col-md-9 ms-sm-auto col-lg-10 dashboard-main">
        <!-- Dashboard Section -->
        <div id="dashboard" class="dashboard-section active">
          <div id="dashboard-content"></div>
        </div>

        <!-- Users Section -->
        <div id="users" class="dashboard-section">
          <div id="users-content"></div>
        </div>

        <!-- Communities Section -->
        <div id="communities" class="dashboard-section">
          <div id="communities-content"></div>
        </div>

        <!-- Events Section -->
    

        <!-- Courses Section -->
        <div id="courses" class="dashboard-section">
          <div id="courses-content"></div>
        </div>

        <!-- Activity Log Section -->
        <div id="activity" class="dashboard-section">
          <div id="activity-content"></div>
        </div>

        <!-- Analytics Section -->
        <div id="analytics" class="dashboard-section">
          <div id="analytics-content"></div>
        </div>

        <!-- Settings Section -->
        <div id="settings" class="dashboard-section">
          <div id="settings-content"></div>
        </div>
      </main>
    </div>
  </div>

  <!-- Include Footer -->
<footer id="main-footer" class="footer" role="contentinfo">
    <!-- Main Footer Content Container -->
    <div class="footer-container">
        <!-- University Logo and Description Section -->
        <div class="footer-section logo-section">
            <div class="logo">
                <i class="fas fa-university"></i>
                <h3>University App</h3>
            </div>
            <p class="description">
                Empowering education through innovative technology. Connect, learn, and grow with our comprehensive university platform.
            </p>
        </div>

        <!-- Quick Links Section -->
        <div class="footer-section links-section">
            <h4>Quick Links</h4>
            <ul class="footer-links">
                <li><a href="../index.php"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="../student/student-dashboard.php"><i class="fas fa-book"></i> Courses</a></li>
                <li><a href="../components/lecture/announcement.php"><i class="fas fa-bullhorn"></i> Announcements</a></li>
                <li><a href="../community/communities.php"><i class="fas fa-users"></i> Community</a></li>
                <li><a href="#contact"><i class="fas fa-envelope"></i> Contact</a></li>
            </ul>
        </div>

        <!-- Useful Resources Section -->
        <div class="footer-section resources-section">
            <h4>Useful Resources</h4>
            <ul class="footer-links">
                <li><a href="#help"><i class="fas fa-question-circle"></i> Help Center</a></li>
                <li><a href="#terms"><i class="fas fa-file-contract"></i> Terms of Service</a></li>
                <li><a href="#privacy"><i class="fas fa-shield-alt"></i> Privacy Policy</a></li>
                <li><a href="#faq"><i class="fas fa-info-circle"></i> FAQ</a></li>
            </ul>
        </div>

        <!-- Newsletter Subscription Section -->
        <div class="footer-section newsletter-section">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest updates and announcements.</p>
            <form id="newsletter-form" class="newsletter-form" novalidate>
                <div class="input-group">
                    <input type="email" id="newsletter-email" placeholder="Enter your email" aria-label="Email address for newsletter" required>
                    <button type="submit" class="subscribe-btn" aria-label="Subscribe to newsletter">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Social Media and Copyright Section -->
    <div class="footer-bottom">
        <!-- Social Media Icons -->
        <div class="social-media">
            <a href="#" class="social-link" aria-label="Follow us on Facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link" aria-label="Follow us on Twitter">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="Follow us on LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-link" aria-label="Follow us on Instagram">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link" aria-label="Follow us on YouTube">
                <i class="fab fa-youtube"></i>
            </a>
        </div>

        <!-- Copyright -->
        <div class="copyright">
            <p>&copy; <span id="current-year"></span> University App. All rights reserved.</p>
        </div>
    </div>

    <!-- Back to Top Button -->
    <button id="back-to-top" class="back-to-top" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
    </button>
</footer>

  <link href="../assets/css/footer.css" rel="stylesheet">
    <script src="../assets/js/footer.js"></script>

  <div id="modals-placeholder"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="../assets/js/darkModeToggle.js"></script>
    <script src="../assets/js/admin/dashboard.js"></script>
  <script src="../assets/js/admin/componentLoader.js"></script>
  <script src="../assets/js/admin/users.js"></script>
  <script src="../assets/js/admin/courses.js"></script>
  <script src="../assets/js/admin/events.js"></script>
  <script src="../assets/js/admin/activity-log.js"></script>
  <script src="../assets/js/admin/analytics.js"></script>
  <script src="../assets/js/admin/header.js"></script>
  <script src="../assets/js/admin/sidebar.js"></script>
  <script src="../assets/js/admin/modals.js"></script>
  <script src="../assets/js/admin/settings.js"></script>
  <script src="../assets/js/admin/profile.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
</body>
</html>