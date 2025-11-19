  // Dark/Light mode toggle with dynamic icons
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';

        // Set initial theme AND icon
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme); // This sets the correct icon on page load

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme); // This updates the icon when clicked
        });

        // Function to update theme toggle icon - COMBINED VERSION
        function updateThemeIcon(theme) {
            const themeToggle = document.getElementById('themeToggle');
            if (theme === 'dark') {
                // Elegant sun with perfect proportions (for dark mode - click to switch to light)
                themeToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        <g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round">
                            <path d="M12 3v2m0 14v2M21 12h-2M5 12H3m14.14-5.14l-1.42 1.42M7.86 16.14l-1.42 1.42m10.7 0l-1.42-1.42M7.86 7.86l-1.42-1.42"/>
                        </g>
                    </svg>
                `;
            } else {
                // Beautiful crescent moon (for light mode - click to switch to dark)
                themeToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.21 16.21A9 9 0 0 1 7.79 3.79 7 7 0 0 0 20.21 16.21z" 
                              fill="currentColor" stroke="currentColor" stroke-width="0.3"/>
                    </svg>
                `;
            }
        }

        // Navigation functionality
        function navigateTo(page) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
            });
            
            // Show the selected page
            document.getElementById(page + '-page').classList.add('active');
            
            // Update active navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Close mobile sidebar if open
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        // Mobile menu functionality
        document.getElementById('menuToggle').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        document.getElementById('overlay').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('active');
            this.classList.remove('active');
        });

        // Attendance page functionality
        // Sample attendance data
        const attendanceData = [
            {
                courseCode: "CS101",
                courseName: "Introduction to Programming",
                totalClasses: 30,
                attended: 28,
                percentage: 93.3
            },
            {
                courseCode: "MATH202",
                courseName: "Calculus II",
                totalClasses: 25,
                attended: 22,
                percentage: 88.0
            },
            {
                courseCode: "PHY105",
                courseName: "Physics for Engineers",
                totalClasses: 28,
                attended: 20,
                percentage: 71.4
            },
            {
                courseCode: "ENG101",
                courseName: "Academic Writing",
                totalClasses: 20,
                attended: 18,
                percentage: 90.0
            },
            {
                courseCode: "CS205",
                courseName: "Data Structures",
                totalClasses: 32,
                attended: 25,
                percentage: 78.1
            },
            {
                courseCode: "HIST110",
                courseName: "World History",
                totalClasses: 18,
                attended: 15,
                percentage: 83.3
            }
        ];

        // Function to determine status and styling
        function getAttendanceStatus(percentage) {
            if (percentage >= 90) return { class: 'excellent', text: 'Excellent', progress: 'progress-excellent' };
            if (percentage >= 80) return { class: 'good', text: 'Good', progress: 'progress-good' };
            if (percentage >= 70) return { class: 'average', text: 'Average', progress: 'progress-average' };
            return { class: 'low', text: 'Low', progress: 'progress-low' };
        }

        // Function to populate the table
        function populateAttendanceTable() {
            const tbody = document.querySelector('#attendanceTable tbody');
            tbody.innerHTML = ''; // Clear existing content
            
            attendanceData.forEach(item => {
                const status = getAttendanceStatus(item.percentage);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="Course">
                        <div class="course-badge">${item.courseCode}</div>
                        <div>${item.courseName}</div>
                    </td>
                    <td data-label="Total Classes">${item.totalClasses}</td>
                    <td data-label="Attended">${item.attended}</td>
                    <td data-label="Attendance %">
                        <span class="attendance-percentage">${item.percentage.toFixed(1)}%</span>
                        <div class="attendance-progress">
                            <div class="attendance-progress-bar ${status.progress}" style="width: ${item.percentage}%"></div>
                        </div>
                    </td>
                    <td data-label="Status">
                        <span class="status ${status.class}">${status.text}</span>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // Initialize the table when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            populateAttendanceTable();
            
            // Add animation to cards
            const card = document.querySelector('.card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300);

            // Add animation to table rows
            const rows = document.querySelectorAll('#attendanceTable tbody tr');
            rows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    row.style.transition = 'all 0.4s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, 500 + (index * 100));
            });
        });

        // Get current page name from URL
        const currentPage = window.location.pathname.split("/").pop();

        // Get all sidebar links
        const menuItems = document.querySelectorAll(".sidebar a");

        // Loop through and highlight the current page link
        menuItems.forEach(item => {
            if (item.getAttribute("href").includes(currentPage)) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });