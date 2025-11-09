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
            document.getElementById('overlay').classlist.remove('active');
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
                    card.style.backgroundColor = '#f8f9fa';
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