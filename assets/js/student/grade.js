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

        // Grades page functionality
        // Sample data - in a real application, this would come from an API
        const gradesData = [
            {
                courseCode: "CS101",
                courseName: "Introduction to Programming",
                assignment: "Final Project",
                grade: "A",
                date: "Dec 15, 2024"
            },
            {
                courseCode: "MATH202",
                courseName: "Calculus II",
                assignment: "Midterm Exam",
                grade: "B+",
                date: "Nov 10, 2024"
            },
            {
                courseCode: "PHY105",
                courseName: "Physics for Engineers",
                assignment: "Lab Report 5",
                grade: "B-",
                date: "Oct 28, 2024"
            },
            {
                courseCode: "ENG101",
                courseName: "Academic Writing",
                assignment: "Research Paper",
                grade: "A-",
                date: "Dec 5, 2024"
            },
            {
                courseCode: "CS205",
                courseName: "Data Structures",
                assignment: "Algorithm Analysis",
                grade: "B+",
                date: "Nov 22, 2024"
            }
        ];

        // Function to determine grade class
        function getGradeClass(grade) {
            if (grade.includes('A')) return 'grade-excellent';
            if (grade.includes('B')) return 'grade-good';
            if (grade.includes('C')) return 'grade-average';
            return 'grade-low';
        }

        // Function to populate the table
        function populateGradesTable() {
            const tbody = document.querySelector('#gradesTable tbody');
            tbody.innerHTML = ''; // Clear existing content
            
            gradesData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="Course">
                        <div class="course-badge">${item.courseCode}</div>
                        <div>${item.courseName}</div>
                    </td>
                    <td data-label="Assignment">${item.assignment}</td>
                    <td data-label="Grade"><span class="${getGradeClass(item.grade)}">${item.grade}</span></td>
                    <td data-label="Date">${item.date}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // Initialize the table when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            populateGradesTable();
            
            // Add animation to cards
            const cards = document.querySelectorAll('.card, .card-overview');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
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