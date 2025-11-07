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

        // Message functionality
        document.querySelectorAll('.message-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Handle checkbox selection
            });
        });

        document.getElementById('markAllRead').addEventListener('click', function() {
            alert('All messages marked as read');
        });

        document.getElementById('deleteSelected').addEventListener('click', function() {
            const selected = document.querySelectorAll('.message-checkbox:checked');
            if (selected.length > 0) {
                if (confirm(`Delete ${selected.length} selected message(s)?`)) {
                    selected.forEach(checkbox => {
                        checkbox.closest('.message-item').remove();
                    });
                }
            } else {
                alert('Please select messages to delete');
            }
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const messages = document.querySelectorAll('.message-item');
            
            messages.forEach(message => {
                const text = message.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    message.style.display = 'flex';
                } else {
                    message.style.display = 'none';
                }
            });
        });

        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Messages page is active by default
        });