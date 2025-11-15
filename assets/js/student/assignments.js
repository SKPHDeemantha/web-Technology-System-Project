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
        const assignmentDetails = assignmentItem.querySelector('.assignment-details').innerHTML;
        const statusBadge = assignmentItem.querySelector('.status-badge').textContent;

        if (e.target.classList.contains('primary')) {
            if (e.target.textContent.includes('Start') || e.target.textContent.includes('Continue')) {
                openAssignmentModal('edit', assignmentTitle, assignmentDetails, statusBadge);
            }
        } else if (e.target.classList.contains('view')) {
            openAssignmentModal('view', assignmentTitle, assignmentDetails, statusBadge);
        } else if (e.target.classList.contains('download')) {
            // Handle download functionality
            alert(`Downloading: ${assignmentTitle}`);
        } else {
            // Handle other action buttons
            const action = e.target.textContent;
            if (action === 'Save Draft' || action === 'View Requirements' || action === 'View Resources') {
                openAssignmentModal('info', assignmentTitle, assignmentDetails, statusBadge, action);
            } else {
                alert(`${action} for: ${assignmentTitle}`);
            }
        }
    }
});

// Modal functions
function openAssignmentModal(type, title, details, status, action = '') {
    const modal = document.getElementById('assignmentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalActionBtn = document.getElementById('modalActionBtn');

    modalTitle.textContent = title;

    let bodyContent = '';

    if (type === 'view') {
        bodyContent = `
            <div class="assignment-detail-view">
                <div class="status-section">
                    <span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span>
                </div>
                <div class="details-section">
                    ${details}
                </div>
                <div class="feedback-section">
                    <h4>Instructor Feedback</h4>
                    <p>Great work on this assignment! Your analysis was thorough and well-structured. Consider adding more examples in future submissions.</p>
                    <div class="grade-display">
                        <strong>Grade: 88%</strong>
                    </div>
                </div>
            </div>
        `;
        modalActionBtn.style.display = 'none';
    } else if (type === 'edit') {
        bodyContent = `
            <div class="assignment-edit-form">
                <div class="status-section">
                    <span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span>
                </div>
                <div class="details-section">
                    ${details}
                </div>
                <div class="form-section">
                    <h4>Assignment Submission</h4>
                    <form id="assignmentForm">
                        <div class="form-group">
                            <label for="assignmentFile">Upload File:</label>
                            <input type="file" id="assignmentFile" accept=".pdf,.doc,.docx,.txt" required>
                        </div>
                        <div class="form-group">
                            <label for="assignmentNotes">Additional Notes:</label>
                            <textarea id="assignmentNotes" rows="4" placeholder="Add any additional notes or comments..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="confirmSubmission"> I confirm that this is my original work
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        `;
        modalActionBtn.textContent = 'Submit Assignment';
        modalActionBtn.style.display = 'inline-block';
        modalActionBtn.onclick = () => submitAssignment(title);
    } else if (type === 'info') {
        bodyContent = `
            <div class="assignment-info-view">
                <div class="status-section">
                    <span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span>
                </div>
                <div class="details-section">
                    ${details}
                </div>
                <div class="info-section">
                    <h4>${action}</h4>
                    ${getInfoContent(action, title)}
                </div>
            </div>
        `;
        modalActionBtn.style.display = 'none';
    }

    modalBody.innerHTML = bodyContent;
    modal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function submitAssignment(title) {
    const fileInput = document.getElementById('assignmentFile');
    const notes = document.getElementById('assignmentNotes').value;
    const confirmed = document.getElementById('confirmSubmission').checked;

    if (!fileInput.files[0]) {
        alert('Please select a file to upload.');
        return;
    }

    if (!confirmed) {
        alert('Please confirm that this is your original work.');
        return;
    }

    // Simulate submission
    alert(`Assignment "${title}" submitted successfully!\nFile: ${fileInput.files[0].name}\nNotes: ${notes || 'None'}`);
    closeModal('assignmentModal');
}

function getInfoContent(action, title) {
    switch(action) {
        case 'Save Draft':
            return '<p>Your progress has been saved as a draft. You can continue working on this assignment later.</p>';
        case 'View Requirements':
            return `
                <div class="requirements-list">
                    <h5>Assignment Requirements:</h5>
                    <ul>
                        <li>Minimum 1500 words</li>
                        <li>Include at least 3 references</li>
                        <li>Use APA citation format</li>
                        <li>Submit as PDF or Word document</li>
                        <li>Due date: January 22, 2024</li>
                    </ul>
                </div>
            `;
        case 'View Resources':
            return `
                <div class="resources-list">
                    <h5>Available Resources:</h5>
                    <ul>
                        <li><a href="#">Research Paper Template</a></li>
                        <li><a href="#">APA Citation Guide</a></li>
                        <li><a href="#">Chemistry Lab Manual</a></li>
                        <li><a href="#">Online Research Databases</a></li>
                    </ul>
                </div>
            `;
        default:
            return '<p>Additional information will be displayed here.</p>';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('assignmentModal');
    if (event.target === modal) {
        closeModal('assignmentModal');
    }
}

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