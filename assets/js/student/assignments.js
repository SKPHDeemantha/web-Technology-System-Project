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