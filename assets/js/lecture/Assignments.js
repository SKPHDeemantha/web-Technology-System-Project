// Assignments Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeAssignments();
    initializeModals();
    initializeFilters();
    initializeQuickActions();
    initializeDeadlines();
});

// Dark Mode Functionality
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

// Assignments Data and Management
let assignments = [
    {
        id: 1,
        title: "Programming Fundamentals Assignment",
        description: "Complete the programming exercises covering variables, data types, and basic operations.",
        course: "CS101 - Introduction to Programming",
        type: "homework",
        points: 100,
        weight: 15,
        dueDate: new Date('2024-02-15T23:59:00'),
        submissionType: "file",
        submissions: 30,
        graded: 24,
        status: "active",
        allowLate: true,
        latePenalty: 10,
        created: new Date('2024-01-20'),
        averageScore: 78.5
    },
    {
        id: 2,
        title: "Data Structures Project - Linked List Implementation",
        description: "Implement a linked list data structure with all basic operations and write comprehensive tests.",
        course: "DS202 - Data Structures",
        type: "project",
        points: 200,
        weight: 25,
        dueDate: new Date('2024-02-28T23:59:00'),
        submissionType: "both",
        submissions: 25,
        graded: 15,
        status: "active",
        allowLate: false,
        created: new Date('2024-01-25'),
        averageScore: 72.3
    },
    {
        id: 3,
        title: "AI Research Paper - Ethics in Machine Learning",
        description: "Write a research paper discussing ethical considerations in machine learning applications.",
        course: "AI301 - Artificial Intelligence",
        type: "research",
        points: 150,
        weight: 20,
        dueDate: new Date('2024-02-10T23:59:00'),
        submissionType: "file",
        submissions: 20,
        graded: 8,
        status: "grading",
        allowLate: true,
        latePenalty: 5,
        created: new Date('2024-01-15'),
        averageScore: 0
    },
    {
        id: 4,
        title: "Software Engineering Quiz 1",
        description: "Multiple choice quiz covering software development methodologies and project management.",
        course: "SE401 - Software Engineering",
        type: "quiz",
        points: 50,
        weight: 10,
        dueDate: new Date('2024-01-30T23:59:00'),
        submissionType: "text",
        submissions: 35,
        graded: 35,
        status: "completed",
        allowLate: false,
        created: new Date('2024-01-10'),
        averageScore: 85.2
    },
    {
        id: 5,
        title: "Database Design Assignment",
        description: "Design a normalized database schema for a university management system.",
        course: "DB301 - Database Systems",
        type: "homework",
        points: 100,
        weight: 15,
        dueDate: new Date('2024-02-20T23:59:00'),
        submissionType: "file",
        submissions: 28,
        graded: 12,
        status: "active",
        allowLate: true,
        latePenalty: 15,
        created: new Date('2024-01-28'),
        averageScore: 81.7
    }
];

function initializeAssignments() {
    renderAssignmentsList();
    updateGradingProgress();
}

function renderAssignmentsList() {
    const assignmentsList = document.getElementById('assignmentsList');
    if (!assignmentsList) return;

    if (assignments.length === 0) {
        assignmentsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No assignments yet</h5>
                <p class="text-muted">Create your first assignment to get started</p>
                <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#createAssignmentModal">
                    <i class="fas fa-plus-circle me-1"></i> Create Assignment
                </button>
            </div>
        `;
        return;
    }

    assignmentsList.innerHTML = assignments.map(assignment => `
        <div class="assignment-item card mb-3 ${assignment.status}" data-id="${assignment.id}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge bg-${getStatusBadgeClass(assignment.status)} me-2">${assignment.status.toUpperCase()}</span>
                            <span class="badge bg-secondary me-2">${assignment.type.toUpperCase()}</span>
                            ${assignment.allowLate ? '<span class="badge bg-warning me-2"><i class="fas fa-clock me-1"></i>LATE SUBMISSION</span>' : ''}
                        </div>
                        <h5 class="card-title mb-1">${assignment.title}</h5>
                        <p class="card-text text-muted mb-2">${assignment.description}</p>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="viewSubmissions(${assignment.id})"><i class="fas fa-eye me-2"></i>View Submissions</a></li>
                            <li><a class="dropdown-item" href="#" onclick="gradeAssignment(${assignment.id})"><i class="fas fa-clipboard-check me-2"></i>Grade</a></li>
                            <li><a class="dropdown-item" href="#" onclick="editAssignment(${assignment.id})"><i class="fas fa-edit me-2"></i>Edit</a></li>
                            <li><a class="dropdown-item" href="#" onclick="duplicateAssignment(${assignment.id})"><i class="fas fa-copy me-2"></i>Duplicate</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteAssignment(${assignment.id})"><i class="fas fa-trash me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="assignment-meta">
                            <small class="text-muted">
                                <i class="fas fa-book me-1"></i>${assignment.course}
                                <br>
                                <i class="fas fa-file-upload me-1"></i>${assignment.submissions} submissions
                                <br>
                                <i class="fas fa-clipboard-check me-1"></i>${assignment.graded} graded
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="assignment-details text-end">
                            <small class="text-muted">
                                <i class="fas fa-star me-1"></i>${assignment.points} points (${assignment.weight}%)
                                <br>
                                <i class="fas fa-clock me-1"></i>Due: ${formatDateTime(assignment.dueDate)}
                                ${assignment.averageScore > 0 ? `<br><i class="fas fa-chart-line me-1"></i>Avg: ${assignment.averageScore}%` : ''}
                            </small>
                        </div>
                    </div>
                </div>
                
                ${assignment.status === 'active' || assignment.status === 'grading' ? `
                <div class="grading-progress">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small>Grading Progress</small>
                        <small class="text-muted">${assignment.graded}/${assignment.submissions}</small>
                    </div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-${getProgressColor(assignment.graded, assignment.submissions)}" 
                             style="width: ${(assignment.graded / assignment.submissions) * 100}%">
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function initializeModals() {
    // Late submission fields toggle
    const allowLateCheckbox = document.getElementById('allowLateSubmission');
    const lateSubmissionFields = document.getElementById('lateSubmissionFields');
    
    if (allowLateCheckbox && lateSubmissionFields) {
        allowLateCheckbox.addEventListener('change', function() {
            lateSubmissionFields.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Save assignment
    const saveButton = document.getElementById('saveAssignment');
    if (saveButton) {
        saveButton.addEventListener('click', createAssignment);
    }

    // Save grade
    const saveGradeButton = document.getElementById('saveGrade');
    if (saveGradeButton) {
        saveGradeButton.addEventListener('click', saveGrade);
    }
}

function initializeFilters() {
    // Filter dropdown
    const filterOptions = document.querySelectorAll('.filter-option');
    const searchInput = document.getElementById('searchAssignments');

    filterOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            filterAssignments(this.getAttribute('data-filter'));
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchAssignments(this.value);
        });
    }
}

function initializeQuickActions() {
    // Grade submissions
    const gradeButton = document.getElementById('gradeSubmissions');
    if (gradeButton) {
        gradeButton.addEventListener('click', function() {
            const gradingAssignment = assignments.find(a => a.status === 'grading' || a.graded < a.submissions);
            if (gradingAssignment) {
                gradeAssignment(gradingAssignment.id);
            } else {
                showToast('No assignments need grading at the moment', 'info');
            }
        });
    }

    // Export grades
    const exportButton = document.getElementById('exportGrades');
    if (exportButton) {
        exportButton.addEventListener('click', exportGrades);
    }
}

function initializeDeadlines() {
    const deadlinesList = document.getElementById('deadlinesList');
    if (!deadlinesList) return;

    const upcomingAssignments = assignments
        .filter(a => a.status === 'active' && new Date(a.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    if (upcomingAssignments.length === 0) {
        deadlinesList.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-check-circle text-muted fa-2x mb-2"></i>
                <p class="text-muted mb-0">No upcoming deadlines</p>
            </div>
        `;
        return;
    }

    deadlinesList.innerHTML = upcomingAssignments.map(assignment => {
        const daysLeft = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        const urgencyClass = daysLeft <= 1 ? 'text-danger' : daysLeft <= 3 ? 'text-warning' : 'text-info';
        
        return `
            <div class="deadline-item d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                <div class="flex-grow-1">
                    <h6 class="mb-1 small">${assignment.title}</h6>
                    <small class="text-muted">${assignment.course}</small>
                </div>
                <div class="text-end">
                    <small class="${urgencyClass} fw-bold">${daysLeft}d</small>
                    <br>
                    <small class="text-muted">${formatDate(assignment.dueDate)}</small>
                </div>
            </div>
        `;
    }).join('');
}

function updateGradingProgress() {
    // This function updates the grading progress in the sidebar
    // The progress bars are already rendered in the assignments list
}

// Assignment Actions
function createAssignment() {
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDescription').value;
    const course = document.getElementById('assignmentCourse').value;
    const type = document.getElementById('assignmentType').value;
    const points = parseInt(document.getElementById('assignmentPoints').value);
    const weight = parseInt(document.getElementById('assignmentWeight').value);
    const dueDate = document.getElementById('assignmentDueDate').value;
    const submissionType = document.getElementById('assignmentSubmissionType').value;
    const allowLate = document.getElementById('allowLateSubmission').checked;
    const latePenalty = allowLate ? parseInt(document.getElementById('lateSubmissionPenalty').value) : 0;
    const lateDays = allowLate ? parseInt(document.getElementById('lateSubmissionDays').value) : 0;

    if (!title || !description || !course || !type || !points || !weight || !dueDate) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }

    const newAssignment = {
        id: assignments.length + 1,
        title,
        description,
        course: document.querySelector(`#assignmentCourse option[value="${course}"]`).text,
        type,
        points,
        weight,
        dueDate: new Date(dueDate),
        submissionType,
        submissions: 0,
        graded: 0,
        status: "active",
        allowLate,
        latePenalty,
        lateDays,
        created: new Date(),
        averageScore: 0
    };

    assignments.unshift(newAssignment);
    renderAssignmentsList();
    initializeDeadlines();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('createAssignmentModal')).hide();
    document.getElementById('assignmentForm').reset();
    document.getElementById('lateSubmissionFields').style.display = 'none';
    
    showToast('Assignment created successfully!', 'success');
}

function viewSubmissions(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        showToast(`Viewing submissions for: ${assignment.title}`, 'info');
        // In a real app, you would show submissions list
    }
}

function gradeAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    // Simulate grading interface
    const gradingContent = document.getElementById('gradingContent');
    gradingContent.innerHTML = `
        <div class="grading-interface">
            <h6 class="mb-3">${assignment.title}</h6>
            <div class="mb-3">
                <label class="form-label">Student: John Doe</label>
                <div class="submission-content p-3 border rounded bg-light mb-3">
                    <p>Student submission content would appear here...</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="gradeScore" class="form-label">Score (out of ${assignment.points})</label>
                        <input type="number" class="form-control" id="gradeScore" min="0" max="${assignment.points}" value="${Math.floor(assignment.points * 0.8)}">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="gradeFeedback" class="form-label">Feedback</label>
                        <textarea class="form-control" id="gradeFeedback" rows="3" placeholder="Provide feedback to the student..."></textarea>
                    </div>
                </div>
            </div>
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="publishGrade">
                <label class="form-check-label" for="publishGrade">
                    Publish grade to student
                </label>
            </div>
        </div>
    `;

    // Show grading modal
    const gradeModal = new bootstrap.Modal(document.getElementById('gradeAssignmentModal'));
    gradeModal.show();
}

function saveGrade() {
    const score = parseInt(document.getElementById('gradeScore').value);
    const feedback = document.getElementById('gradeFeedback').value;
    
    if (isNaN(score)) {
        showToast('Please enter a valid score', 'warning');
        return;
    }

    // Simulate saving grade
    showToast('Grade saved successfully!', 'success');
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('gradeAssignmentModal')).hide();
    
    // Update assignment stats (in a real app, this would be more sophisticated)
    const assignment = assignments[0]; // Simplified for demo
    if (assignment) {
        assignment.graded++;
        assignment.averageScore = assignment.averageScore > 0 ? 
            (assignment.averageScore + (score / assignment.points * 100)) / 2 : 
            (score / assignment.points * 100);
        renderAssignmentsList();
    }
}

function editAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        showToast(`Editing: ${assignment.title}`, 'info');
        // In a real app, you would populate the create form with assignment data
    }
}

function duplicateAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        const duplicated = {
            ...assignment,
            id: assignments.length + 1,
            title: `${assignment.title} (Copy)`,
            created: new Date(),
            submissions: 0,
            graded: 0,
            averageScore: 0
        };
        assignments.unshift(duplicated);
        renderAssignmentsList();
        showToast('Assignment duplicated successfully!', 'success');
    }
}

function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
        assignments = assignments.filter(a => a.id !== id);
        renderAssignmentsList();
        initializeDeadlines();
        showToast('Assignment deleted successfully!', 'success');
    }
}

function filterAssignments(filter) {
    const assignmentItems = document.querySelectorAll('.assignment-item');
    
    assignmentItems.forEach(item => {
        const assignmentId = parseInt(item.getAttribute('data-id'));
        const assignment = assignments.find(a => a.id === assignmentId);
        
        if (!assignment) return;
        
        switch(filter) {
            case 'all':
                item.style.display = 'block';
                break;
            case 'active':
                item.style.display = assignment.status === 'active' ? 'block' : 'none';
                break;
            case 'grading':
                item.style.display = (assignment.status === 'grading' || assignment.graded < assignment.submissions) ? 'block' : 'none';
                break;
            case 'completed':
                item.style.display = assignment.status === 'completed' ? 'block' : 'none';
                break;
            default:
                item.style.display = 'block';
        }
    });
}

function searchAssignments(query) {
    const assignmentItems = document.querySelectorAll('.assignment-item');
    const searchTerm = query.toLowerCase();
    
    assignmentItems.forEach(item => {
        const assignmentTitle = item.querySelector('.card-title').textContent.toLowerCase();
        const assignmentDescription = item.querySelector('.card-text').textContent.toLowerCase();
        const assignmentCourse = item.querySelector('.assignment-meta').textContent.toLowerCase();
        
        const matches = assignmentTitle.includes(searchTerm) || 
                       assignmentDescription.includes(searchTerm) || 
                       assignmentCourse.includes(searchTerm);
        
        item.style.display = matches ? 'block' : 'none';
    });
}

function exportGrades() {
    showToast('Exporting grades data...', 'info');
    setTimeout(() => {
        showToast('Grades exported successfully!', 'success');
    }, 1500);
}

// Utility Functions
function getStatusBadgeClass(status) {
    const classes = {
        'active': 'success',
        'grading': 'warning',
        'completed': 'info'
    };
    return classes[status] || 'secondary';
}

function getProgressColor(graded, total) {
    const percentage = (graded / total) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
}

function formatDateTime(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
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