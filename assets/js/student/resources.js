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

        // Upload Modal functionality
        const uploadModal = document.getElementById('uploadModal');
        const uploadBtn = document.getElementById('uploadBtn');
        const closeModal = document.getElementById('closeModal');
        const cancelUpload = document.getElementById('cancelUpload');
        const dropZone = document.getElementById('dropZone');
        const browseBtn = document.getElementById('browseBtn');

        // Open modal
        uploadBtn.addEventListener('click', function() {
            uploadModal.classList.add('active');
        });

        // Close modal
        function closeUploadModal() {
            uploadModal.classList.remove('active');
        }

        closeModal.addEventListener('click', closeUploadModal);
        cancelUpload.addEventListener('click', closeUploadModal);

        // Close modal when clicking outside
        uploadModal.addEventListener('click', function(e) {
            if (e.target === uploadModal) {
                closeUploadModal();
            }
        });

        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropZone.classList.add('dragover');
        }

        function unhighlight() {
            dropZone.classList.remove('dragover');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                alert(`File selected: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                // Here you would typically handle the file upload
            }
        }

        browseBtn.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,.mp4,.doc,.docx,.ppt,.pptx';
            fileInput.onchange = function(e) {
                handleFiles(e.target.files);
            };
            fileInput.click();
        });

        // Resources filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active filter button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter resources
                document.querySelectorAll('.resource-card').forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-type') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Search functionality
        document.getElementById('searchResources').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            document.querySelectorAll('.resource-card').forEach(card => {
                const title = card.querySelector('.resource-title').textContent.toLowerCase();
                const description = card.querySelector('.resource-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Download button functionality
        document.querySelectorAll('.action-btn.download').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.resource-card');
                const title = card.querySelector('.resource-title').textContent;
                alert(`Downloading: ${title}`);
            });
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Resources page is active by default
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