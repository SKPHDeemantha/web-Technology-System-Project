<?php
include 'connect.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDUNEXXUS - Virtual Learning Environment</title>
    <link rel="stylesheet" href="assets/css/login.css">
</head>
<body>

<!-- Hidden checkbox for login modal -->
<input type="checkbox" id="login-modal" class="modal-toggle">

<!-- Landing Page -->
<div class="landing-page">

    <!-- Header -->
    <header class="header">
        <div class="logo-container">
            <div class="logo-icon">
                <svg viewBox="0 0 50 50" fill="none">
                    <circle cx="25" cy="25" r="24" fill="url(#gradient1)" />
                    <path d="M25 10L30 20H35L27 26L30 36L25 30L20 36L23 26L15 20H20L25 10Z" fill="white" />
                    <defs>
                        <linearGradient id="gradient1" x1="0" y1="0" x2="50" y2="50">
                            <stop offset="0%" stop-color="#9333ea" />
                            <stop offset="100%" stop-color="#6366f1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="logo-text">EDUNEXXUS</div>
        </div>

        <nav class="nav-buttons">
            <label for="login-modal" class="btn btn-outline">Login</label>
        </nav>

        <nav class="nav-buttons">
            <button class="btn btn-outline" onclick="window.location.href='signup.php'">Sign Up</button>
        </nav>
    </header>

    <!-- Hero Section -->
    <main class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Welcome to <span class="gradient-text">EDUNEXXUS</span></h1>
            <p class="hero-subtitle">Your Gateway to Modern Virtual Learning Experience</p>
            <p class="hero-description">
                Empower your educational journey with our Virtual Learning Environment.
                Connect, learn, and grow with modern tools made for students & educators.
            </p>

            <div class="hero-buttons">
                <label for="login-modal" class="btn btn-large btn-primary">Get Started</label>
            </div>
        </div>

        <!-- Small Features -->
        <div class="hero-features">
            <div class="feature-card">
                <div class="feature-icon">📚</div>
                <h3>Interactive Courses</h3>
                <p>Engage with dynamic multimedia content</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">👥</div>
                <h3>Collaborative Learning</h3>
                <p>Real-time student & lecturer interactions</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>Track Progress</h3>
                <p>Monitor your achievements with insights</p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>EDUNEXXUS</h4>
                <p>Innovative virtual learning for modern education.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">Support</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <ul>
                    <li>info@edunexxus.com</li>
                    <li>+1 (555) 123-4567</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 EDUNEXXUS. All rights reserved.</p>
        </div>
    </footer>
</div>

<!-- LOGIN MODAL (OLD FIELDS + NEW DESIGN) -->
<div class="modal-overlay">
    <label for="login-modal" class="modal-backdrop"></label>

    <div class="modal-container">
        <label for="login-modal" class="modal-close">&times;</label>

        <div class="modal-content">
            <div class="modal-header">
                <h2>Welcome Back</h2>
                <p>Login to your portal</p>
            </div>

            <form id="loginForm" class="auth-form">

                <!-- ROLE -->
                <div class="form-group">
                    <label for="role">Login as:</label>
                    <select id="role" class="form-input" required>
                        <option value="" disabled selected>Select Role</option>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <!-- YEAR (only for students) -->
                <div class="form-group" id="yearGroup" style="display:none;">
                    <label for="year">Select Year:</label>
                    <select id="year" class="form-input">
                        <option value="" disabled selected>Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>

                <!-- EMAIL -->
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" class="form-input" placeholder="you@example.com" required>
                </div>

                <!-- PASSWORD -->
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" class="form-input" placeholder="••••••••" required>
                </div>

                <button type="submit" class="btn btn-primary btn-full">Login</button>

            </form>
        </div>
    </div>
</div>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script>
    // Show Year for Student
    document.getElementById('role').addEventListener('change', function () {
        const yearGroup = document.getElementById('yearGroup');
        yearGroup.style.display = (this.value === 'student') ? 'block' : 'none';
    });

    // Form Submit
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const role = document.getElementById('role').value;
        const year = document.getElementById('year').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!role || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        if (role === 'student' && !year) {
            alert("Please select your year.");
            return;
        }

        loginHandler(email, password, role, year);
    });

    // AJAX Login Handler
    function loginHandler(email, password, role, year) {
        $.ajax({
            url: "fileHandling/signuphandling.php?id=check",
            type: "POST",
            data: { email, password, role, year },
            success: function (response) {
                if (response == 1) {
                    alert("Login Successful!");

                    if (role === 'admin') {
                        window.location.href = "admin/admin-panel.php";
                    } else {
                        window.location.href = "community/communities.php";
                    }

                } else {
                    alert("Invalid credentials or user not found!");
                }
            },
            error: function () {
                alert("AJAX Error!");
            }
        });
    }
</script>

</body>
</html>
