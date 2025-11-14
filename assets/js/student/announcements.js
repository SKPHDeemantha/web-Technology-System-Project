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

        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                filterAnnouncements(category);
            });
        });

        // Filter announcements based on category
        function filterAnnouncements(category) {
            const announcements = document.querySelectorAll('.announcement-card');
            
            announcements.forEach(announcement => {
                if (category === 'all' || announcement.getAttribute('data-category') === category) {
                    announcement.style.display = 'block';
                } else {
                    announcement.style.display = 'none';
                }
            });
        }

        // Search functionality
        document.getElementById('searchAnnouncements').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            document.querySelectorAll('.announcement-card').forEach(card => {
                const title = card.querySelector('.announcement-title').textContent.toLowerCase();
                const content = card.querySelector('.announcement-content').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Mark as read functionality
        document.querySelectorAll('.action-btn').forEach(button => {
            if (button.textContent === 'Mark as Read') {
                button.addEventListener('click', function() {
                    const card = this.closest('.announcement-card');
                    card.style.opacity = '0.7';
                    card.style.backgroundColor = 'var(--bg-tertiary)';
                    this.textContent = '✓ Marked as Read';
                    this.disabled = true;
                    
                    // Show confirmation
                    setTimeout(() => {
                        alert('Announcement marked as read!');
                    }, 300);
                });
            }
        });

        // Register button functionality
        document.querySelectorAll('.action-btn.primary').forEach(button => {
            if (button.textContent === 'Register') {
                button.addEventListener('click', function() {
                    alert('Redirecting to registration page...');
                    // In a real application, this would redirect to the registration page
                });
            }
            
            if (button.textContent === 'View Course Catalog') {
                button.addEventListener('click', function() {
                    alert('Opening course catalog...');
                    // In a real application, this would open the course catalog
                });
            }
        });

        // Add smooth scrolling for better UX
        document.querySelectorAll('.meta-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // In a real application, this would navigate to the department page
                alert('Navigating to department information...');
            });
        });

        // Initialize page with all announcements visible
        document.addEventListener('DOMContentLoaded', function() {
            filterAnnouncements('all');
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