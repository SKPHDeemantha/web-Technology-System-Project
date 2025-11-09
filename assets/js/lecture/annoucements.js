// Announcements Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeAnnouncements();
    initializeModals();
    initializeFilters();
    initializeQuickActions();
});

// Dark Mode Functionality (same as dashboard)
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleSidebar = document.getElementById('darkModeToggleSidebar');
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    document.body.setAttribute('data-theme', currentTheme);
    updateDarkModeIcons(currentTheme);
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (darkModeToggleSidebar) {
        darkModeToggleSidebar.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.classList.add('theme-transition');
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcons(newTheme);
    
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
    
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'info');
}

function updateDarkModeIcons(theme) {
    const darkModeIcons = document.querySelectorAll('#darkModeToggle i, #darkModeToggleSidebar i');
    const buttonText = document.querySelector('#darkModeToggleSidebar');
    
    darkModeIcons.forEach(icon => {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun fa-lg';
            if (buttonText) {
                buttonText.innerHTML = '<i class="fas fa-sun me-2"></i> Switch to Light Mode';
            }
        } else {
            icon.className = 'fas fa-moon fa-lg';
            if (buttonText) {
                buttonText.innerHTML = '<i class="fas fa-moon me-2"></i> Switch to Dark Mode';
            }
        }
    });
}

// Announcements Data and Management
let announcements = [
    {
        id: 1,
        title: "Midterm Exam Schedule Update",
        content: "The midterm exam for CS101 has been rescheduled to next Friday. Please check the updated timetable.",
        course: "CS101 - Introduction to Programming",
        priority: "high",
        status: "active",
        createdAt: new Date('2024-01-15'),
        views: 245,
        author: "Dr. Sarah Johnson",
        scheduled: false
    },
    {
        id: 2,
        title: "Assignment Submission Deadline Extended",
        content: "Due to technical issues, the deadline for Assignment 3 has been extended by 48 hours.",
        course: "DS202 - Data Structures",
        priority: "normal",
        status: "active",
        createdAt: new Date('2024-01-14'),
        views: 189,
        author: "Dr. Sarah Johnson",
        scheduled: false
    },
    {
        id: 3,
        title: "Guest Lecture on AI Ethics",
        content: "We have a special guest lecture on AI Ethics scheduled for next Wednesday. Attendance is mandatory.",
        course: "AI301 - Artificial Intelligence",
        priority: "normal",
        status: "scheduled",
        createdAt: new Date('2024-01-16'),
        scheduledDate: new Date('2024-01-20'),
        views: 0,
        author: "Dr. Sarah Johnson",
        scheduled: true
    },
    {
        id: 4,
        title: "Lab Session Cancelled",
        content: "This week's lab session is cancelled due to maintenance work in the computer lab.",
        course: "CS101 - Introduction to Programming",
        priority: "urgent",
        status: "active",
        createdAt: new Date('2024-01-13'),
        views: 312,
        author: "Dr. Sarah Johnson",
        scheduled: false
    }
];

function initializeAnnouncements() {
    renderAnnouncementsList();
    renderActivityTimeline();
    initializeAnalyticsChart();
}

function renderAnnouncementsList() {
    const announcementsList = document.getElementById('announcementsList');
    if (!announcementsList) return;

    if (announcements.length === 0) {
        announcementsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-bullhorn fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No announcements yet</h5>
                <p class="text-muted">Create your first announcement to get started</p>
                <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#createAnnouncementModal">
                    <i class="fas fa-plus-circle me-1"></i> Create Announcement
                </button>
            </div>
        `;
        return;
    }

    announcementsList.innerHTML = announcements.map(announcement => `
        <div class="announcement-item card mb-3 ${announcement.status}" data-id="${announcement.id}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge bg-${getPriorityBadgeClass(announcement.priority)} me-2">${announcement.priority.toUpperCase()}</span>
                            ${announcement.scheduled ? '<span class="badge bg-warning me-2"><i class="fas fa-clock me-1"></i>SCHEDULED</span>' : ''}
                            <span class="badge bg-${announcement.status === 'active' ? 'success' : 'info'}">${announcement.status.toUpperCase()}</span>
                        </div>
                        <h5 class="card-title mb-1">${announcement.title}</h5>
                        <p class="card-text text-muted mb-2">${announcement.content}</p>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="editAnnouncement(${announcement.id})"><i class="fas fa-edit me-2"></i>Edit</a></li>
                            <li><a class="dropdown-item" href="#" onclick="duplicateAnnouncement(${announcement.id})"><i class="fas fa-copy me-2"></i>Duplicate</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteAnnouncement(${announcement.id})"><i class="fas fa-trash me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="announcement-meta">
                        <small class="text-muted">
                            <i class="fas fa-book me-1"></i>${announcement.course}
                            <i class="fas fa-eye ms-3 me-1"></i>${announcement.views} views
                            <i class="fas fa-calendar ms-3 me-1"></i>${formatDate(announcement.createdAt)}
                        </small>
                    </div>
                    <div class="announcement-actions">
                        <button class="btn btn-sm btn-outline-purple me-1" onclick="viewAnalytics(${announcement.id})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-${announcement.status === 'active' ? 'warning' : 'success'}" onclick="toggleAnnouncementStatus(${announcement.id})">
                            <i class="fas fa-${announcement.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderActivityTimeline() {
    const activityTimeline = document.getElementById('activityTimeline');
    if (!activityTimeline) return;

    const activities = [
        {
            type: 'created',
            message: 'Created "Midterm Exam Schedule Update"',
            time: '2 hours ago',
            icon: 'fas fa-plus-circle text-success'
        },
        {
            type: 'viewed',
            message: 'Assignment announcement viewed 45 times',
            time: '4 hours ago',
            icon: 'fas fa-eye text-primary'
        },
        {
            type: 'scheduled',
            message: 'Scheduled guest lecture announcement',
            time: '1 day ago',
            icon: 'fas fa-clock text-warning'
        },
        {
            type: 'updated',
            message: 'Updated lab session details',
            time: '2 days ago',
            icon: 'fas fa-edit text-info'
        }
    ];

    activityTimeline.innerHTML = activities.map(activity => `
        <div class="activity-item d-flex align-items-start mb-3">
            <div class="activity-icon me-3">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content flex-grow-1">
                <p class="mb-1 small">${activity.message}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

function initializeModals() {
    // Schedule fields toggle
    const scheduleCheckbox = document.getElementById('scheduleAnnouncement');
    const scheduleFields = document.getElementById('scheduleFields');
    
    if (scheduleCheckbox && scheduleFields) {
        scheduleCheckbox.addEventListener('change', function() {
            scheduleFields.style.display = this.checked ? 'flex' : 'none';
        });
    }

    // Save announcement
    const saveButton = document.getElementById('saveAnnouncement');
    if (saveButton) {
        saveButton.addEventListener('click', createAnnouncement);
    }
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterAnnouncements(filter);
        });
    });
}

function initializeQuickActions() {
    // Export announcements
    const exportButton = document.getElementById('exportAnnouncements');
    if (exportButton) {
        exportButton.addEventListener('click', exportAnnouncements);
    }
}

function initializeAnalyticsChart() {
    const analyticsChart = document.getElementById('analyticsChart');
    if (!analyticsChart) return;

    // Simple bar chart implementation
    const data = [45, 52, 38, 65, 72, 58, 49, 63, 55, 48, 61, 59];
    const maxValue = Math.max(...data);
    
    analyticsChart.innerHTML = `
        <div class="d-flex align-items-end h-100" style="gap: 4px;">
            ${data.map((value, index) => `
                <div class="flex-fill d-flex flex-column align-items-center">
                    <div class="bg-purple rounded-top" style="width: 20px; height: ${(value / maxValue) * 100}%;"></div>
                    <small class="text-muted mt-1">${index + 1}</small>
                </div>
            `).join('')}
        </div>
    `;
}

// Announcement Actions
function createAnnouncement() {
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    const course = document.getElementById('announcementCourse').value;
    const priority = document.getElementById('announcementPriority').value;
    const isScheduled = document.getElementById('scheduleAnnouncement').checked;
    
    if (!title || !content || !course) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }

    const newAnnouncement = {
        id: announcements.length + 1,
        title,
        content,
        course: document.querySelector(`#announcementCourse option[value="${course}"]`).text,
        priority,
        status: isScheduled ? 'scheduled' : 'active',
        createdAt: new Date(),
        views: 0,
        author: "Dr. Sarah Johnson",
        scheduled: isScheduled
    };

    if (isScheduled) {
        const date = document.getElementById('scheduleDate').value;
        const time = document.getElementById('scheduleTime').value;
        newAnnouncement.scheduledDate = new Date(`${date}T${time}`);
    }

    announcements.unshift(newAnnouncement);
    renderAnnouncementsList();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('createAnnouncementModal')).hide();
    document.getElementById('announcementForm').reset();
    document.getElementById('scheduleFields').style.display = 'none';
    
    showToast('Announcement created successfully!', 'success');
}

function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        showToast(`Editing: ${announcement.title}`, 'info');
        // In a real app, you would populate a form with the announcement data
    }
}

function duplicateAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        const duplicated = {
            ...announcement,
            id: announcements.length + 1,
            title: `${announcement.title} (Copy)`,
            createdAt: new Date(),
            views: 0
        };
        announcements.unshift(duplicated);
        renderAnnouncementsList();
        showToast('Announcement duplicated successfully!', 'success');
    }
}

function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        announcements = announcements.filter(a => a.id !== id);
        renderAnnouncementsList();
        showToast('Announcement deleted successfully!', 'success');
    }
}

function toggleAnnouncementStatus(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        announcement.status = announcement.status === 'active' ? 'inactive' : 'active';
        renderAnnouncementsList();
        showToast(`Announcement ${announcement.status === 'active' ? 'activated' : 'paused'}!`, 'info');
    }
}

function viewAnalytics(id) {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
        showToast(`Viewing analytics for: ${announcement.title}`, 'info');
        // In a real app, you would show detailed analytics
    }
}

function filterAnnouncements(filter) {
    const announcementItems = document.querySelectorAll('.announcement-item');
    
    announcementItems.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'block';
        } else {
            const matchesFilter = item.classList.contains(filter);
            item.style.display = matchesFilter ? 'block' : 'none';
        }
    });
}

function exportAnnouncements() {
    // Simulate export functionality
    showToast('Exporting announcements data...', 'info');
    setTimeout(() => {
        showToast('Announcements exported successfully!', 'success');
    }, 1500);
}

// Utility Functions
function getPriorityBadgeClass(priority) {
    const classes = {
        'low': 'secondary',
        'normal': 'info',
        'high': 'warning',
        'urgent': 'danger'
    };
    return classes[priority] || 'secondary';
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${getToastIcon(type)} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000,
    });
    
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

function getToastIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}