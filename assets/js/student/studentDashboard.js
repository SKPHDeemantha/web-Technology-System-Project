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
            
            // Set active navigation item
            const activeNavItem = document.querySelector(`.nav-item[onclick*="${page}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
            
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

        // Dashboard Chart functionality
        let gpaChartInstance = null;

        function initGpaChart() {
            const canvas = document.getElementById("gpaChart");
            if (!canvas) return;

            const ctx = canvas.getContext("2d");

            // Destroy previous chart instance if exists
            if (gpaChartInstance) {
                gpaChartInstance.destroy();
            }

            // Get colors based on current theme
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
            const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary');

            gpaChartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"],
                    datasets: [{
                        label: "GPA Progress",
                        data: [3.4, 3.5, 3.6, 3.75, 3.8],
                        borderColor: accentColor,
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: accentColor,
                        pointHoverRadius: 8,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            display: false 
                        },
                        tooltip: {
                            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary'),
                            titleColor: textColor,
                            bodyColor: textColor,
                            borderColor: accentColor,
                            borderWidth: 1,
                            padding: 10,
                            cornerRadius: 6,
                        },
                    },
                    scales: {
                        x: { 
                            grid: { 
                                display: false 
                            },
                            ticks: {
                                color: textColor
                            },
                            title: {
                                display: true,
                                text: "Semester",
                                color: textColor,
                                font: { size: 14 }
                            }
                        },
                        y: {
                            beginAtZero: false,
                            min: 3.0,
                            max: 4.0,
                            ticks: { 
                                stepSize: 0.1,
                                color: textColor
                            },
                            title: {
                                display: true,
                                text: "GPA",
                                color: textColor,
                                font: { size: 14 }
                            },
                            grid: { 
                                color: gridColor
                            },
                        },
                    },
                },
            });
        }

        // Initialize chart when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Small delay to ensure DOM is fully ready
            setTimeout(initGpaChart, 100);
            
            // Add hover animations to cards
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
                
                // Add click functionality to cards
                card.addEventListener('click', function() {
                    const cardText = this.querySelector('h4').textContent;
                    if (cardText.includes('Courses')) navigateTo('courses');
                    if (cardText.includes('GPA')) navigateTo('grades');
                    if (cardText.includes('Attendance')) navigateTo('attendance');
                    if (cardText.includes('Tasks')) navigateTo('assignments');
                });
            });

            // Add click animations to buttons
            const buttons = document.querySelectorAll('.quick-actions button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        });

        // Reinitialize chart on window resize
        window.addEventListener('resize', function() {
            if (gpaChartInstance) {
                setTimeout(initGpaChart, 100);
            }
        });

        // Reinitialize chart when theme changes
        themeToggle.addEventListener('click', function() {
            setTimeout(initGpaChart, 300);
        });

        // Dropdown functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Notification dropdown
            const notificationBtn = document.getElementById('notificationBtn');
            const notificationDropdown = document.querySelector('.notification-dropdown');

            // Profile dropdown
            const profileBtn = document.getElementById('profileBtn');
            const profileDropdown = document.querySelector('.profile-dropdown');

            // Toggle notification dropdown
            notificationBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
                profileDropdown.style.display = 'none'; // Close profile dropdown
            });

            // Toggle profile dropdown
            profileBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
                notificationDropdown.style.display = 'none'; // Close notification dropdown
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', function() {
                notificationDropdown.style.display = 'none';
                profileDropdown.style.display = 'none';
            });

            // Prevent dropdowns from closing when clicking inside them
            notificationDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            profileDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // Logout function
        function logout() {
            // Clear any stored session data
            localStorage.removeItem('userSession');
            localStorage.removeItem('theme');
            // Redirect to login page
            window.location.href = '../index.html';
        }

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
