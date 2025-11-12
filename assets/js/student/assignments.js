 // Dark/Light mode toggle
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';

        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

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

        // Assignment filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all filter buttons
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter assignments based on selected filter
                const filter = this.textContent.toLowerCase();
                filterAssignments(filter);
            });
        });

        function filterAssignments(filter) {
            const assignments = document.querySelectorAll('.assignment-item');
            
            assignments.forEach(assignment => {
                const status = assignment.querySelector('.status-badge').textContent.toLowerCase();
                
                switch(filter) {
                    case 'all':
                        assignment.style.display = 'block';
                        break;
                    case 'pending':
                        assignment.style.display = status.includes('progress') || status.includes('not started') ? 'block' : 'none';
                        break;
                    case 'submitted':
                        assignment.style.display = status.includes('submitted') ? 'block' : 'none';
                        break;
                    case 'graded':
                        assignment.style.display = assignment.querySelector('.assignment-details').textContent.includes('Grade:') ? 'block' : 'none';
                        break;
                    default:
                        assignment.style.display = 'block';
                }
            });
        }

        // Assignment action button functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('action-btn')) {
                const assignmentItem = e.target.closest('.assignment-item');
                const assignmentTitle = assignmentItem.querySelector('h3').textContent;
                
                if (e.target.classList.contains('primary')) {
                    if (e.target.textContent.includes('Start') || e.target.textContent.includes('Continue')) {
                        alert(`Opening assignment: ${assignmentTitle}`);
                        // In a real app, this would open the assignment editor
                    }
                } else if (e.target.classList.contains('view')) {
                    alert(`Viewing feedback for: ${assignmentTitle}`);
                    // In a real app, this would show assignment feedback
                } else if (e.target.classList.contains('download')) {
                    alert(`Downloading: ${assignmentTitle}`);
                    // In a real app, this would trigger file download
                } else {
                    // Handle other action buttons
                    const action = e.target.textContent;
                    alert(`${action} for: ${assignmentTitle}`);
                }
            }
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Assignments page is active by default
            // Any additional initialization for assignments page
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