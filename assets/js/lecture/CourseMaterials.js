// Course Materials Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeMaterials();
    initializeModals();
    initializeFilters();
    initializeQuickActions();
    initializeStorageChart();
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

// Materials Data and Management
let materials = [
    {
        id: 1,
        name: "Introduction to Programming.pdf",
        type: "lecture",
        course: "CS101 - Introduction to Programming",
        size: "2.4 MB",
        downloads: 245,
        uploaded: new Date('2024-01-10'),
        author: "Dr. Sarah Johnson",
        description: "Week 1 lecture notes covering basic programming concepts",
        folder: "lectures",
        icon: "fas fa-file-pdf",
        color: "text-danger"
    },
    {
        id: 2,
        name: "Data Structures Slides.pptx",
        type: "slides",
        course: "DS202 - Data Structures",
        size: "5.7 MB",
        downloads: 189,
        uploaded: new Date('2024-01-12'),
        author: "Dr. Sarah Johnson",
        description: "Presentation slides for arrays, linked lists, and stacks",
        folder: "lectures",
        icon: "fas fa-file-powerpoint",
        color: "text-warning"
    },
    {
        id: 3,
        name: "Assignment 1 - Algorithms.zip",
        type: "assignment",
        course: "AI301 - Artificial Intelligence",
        size: "1.2 MB",
        downloads: 156,
        uploaded: new Date('2024-01-08'),
        author: "Dr. Sarah Johnson",
        description: "First assignment on search algorithms and problem solving",
        folder: "assignments",
        icon: "fas fa-file-archive",
        color: "text-secondary"
    },
    {
        id: 4,
        name: "Python Code Examples.py",
        type: "code",
        course: "CS101 - Introduction to Programming",
        size: "0.8 MB",
        downloads: 312,
        uploaded: new Date('2024-01-15'),
        author: "Dr. Sarah Johnson",
        description: "Sample Python code for basic programming exercises",
        folder: "resources",
        icon: "fas fa-file-code",
        color: "text-info"
    },
    {
        id: 5,
        name: "Database Design.docx",
        type: "reading",
        course: "DB301 - Database Systems",
        size: "3.1 MB",
        downloads: 98,
        uploaded: new Date('2024-01-14'),
        author: "Dr. Sarah Johnson",
        description: "Reading material on database normalization and design",
        folder: "resources",
        icon: "fas fa-file-word",
        color: "text-primary"
    },
    {
        id: 6,
        name: "Midterm Review Session.mp4",
        type: "lecture",
        course: "SE401 - Software Engineering",
        size: "45.2 MB",
        downloads: 167,
        uploaded: new Date('2024-01-13'),
        author: "Dr. Sarah Johnson",
        description: "Recorded review session for midterm exam preparation",
        folder: "lectures",
        icon: "fas fa-file-video",
        color: "text-danger"
    }
];

function initializeMaterials() {
    renderMaterialsGrid();
    renderActivityTimeline();
    initializeFileUpload();
}

function renderMaterialsGrid() {
    const materialsGrid = document.getElementById('materialsGrid');
    if (!materialsGrid) return;

    if (materials.length === 0) {
        materialsGrid.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No materials yet</h5>
                <p class="text-muted">Upload your first course material to get started</p>
                <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#uploadMaterialModal">
                    <i class="fas fa-upload me-1"></i> Upload Material
                </button>
            </div>
        `;
        return;
    }

    materialsGrid.innerHTML = materials.map(material => `
        <div class="material-item card mb-3" data-id="${material.id}" data-type="${material.type}" data-course="${material.course.split(' - ')[0]}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="d-flex align-items-start flex-grow-1">
                        <div class="material-icon me-3">
                            <i class="${material.icon} ${material.color} fa-2x"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="card-title mb-1">${material.name}</h6>
                            <p class="card-text text-muted small mb-2">${material.description}</p>
                            <div class="material-meta">
                                <small class="text-muted">
                                    <i class="fas fa-book me-1"></i>${material.course}
                                    <i class="fas fa-download ms-3 me-1"></i>${material.downloads} downloads
                                    <i class="fas fa-database ms-3 me-1"></i>${material.size}
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="downloadMaterial(${material.id})"><i class="fas fa-download me-2"></i>Download</a></li>
                            <li><a class="dropdown-item" href="#" onclick="shareMaterial(${material.id})"><i class="fas fa-share me-2"></i>Share</a></li>
                            <li><a class="dropdown-item" href="#" onclick="editMaterial(${material.id})"><i class="fas fa-edit me-2"></i>Edit</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteMaterial(${material.id})"><i class="fas fa-trash me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-secondary me-2">${material.type.charAt(0).toUpperCase() + material.type.slice(1)}</span>
                        <span class="badge bg-light text-dark">${material.folder}</span>
                    </div>
                    <small class="text-muted">Uploaded ${formatDate(material.uploaded)}</small>
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
            type: 'uploaded',
            message: 'Uploaded "Python Code Examples.py"',
            time: '2 hours ago',
            icon: 'fas fa-upload text-success'
        },
        {
            type: 'downloaded',
            message: 'Material downloaded 45 times',
            time: '4 hours ago',
            icon: 'fas fa-download text-primary'
        },
        {
            type: 'organized',
            message: 'Organized materials by course',
            time: '1 day ago',
            icon: 'fas fa-folder text-warning'
        },
        {
            type: 'shared',
            message: 'Shared assignment with students',
            time: '2 days ago',
            icon: 'fas fa-share text-info'
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
    // File upload handling
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const selectedFiles = document.getElementById('selectedFiles');
    const uploadBtn = document.getElementById('uploadMaterialBtn');

    if (uploadArea && fileInput) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('upload-area-dragover');
        });

        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('upload-area-dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('upload-area-dragover');
            handleFiles(e.dataTransfer.files);
        });

        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }

    // Create folder modal
    const createFolderBtn = document.getElementById('createFolderBtn');
    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', createFolder);
    }

    // Upload material button
    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadMaterial);
    }
}

function initializeFilters() {
    // Filter dropdown
    const filterOptions = document.querySelectorAll('.filter-option');
    const searchInput = document.getElementById('searchMaterials');

    filterOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            filterMaterials(this.getAttribute('data-filter'));
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchMaterials(this.value);
        });
    }
}

function initializeQuickActions() {
    // Organize materials
    const organizeBtn = document.getElementById('organizeMaterials');
    if (organizeBtn) {
        organizeBtn.addEventListener('click', organizeMaterials);
    }

    // Export materials
    const exportBtn = document.getElementById('exportMaterials');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportMaterials);
    }
}

function initializeStorageChart() {
    const storageChart = document.getElementById('storageChart');
    if (!storageChart) return;

    // Simple storage visualization
    const storageData = [
        { type: 'Lecture Notes', size: 1.2, color: 'primary' },
        { type: 'Assignments', size: 0.8, color: 'success' },
        { type: 'Slides', size: 0.7, color: 'warning' },
        { type: 'Others', size: 0.5, color: 'info' }
    ];

    const totalSize = storageData.reduce((sum, item) => sum + item.size, 0);
    
    storageChart.innerHTML = `
        <div class="storage-visualization mb-3">
            <div class="progress" style="height: 20px;">
                ${storageData.map((item, index) => `
                    <div class="progress-bar bg-${item.color}" 
                         style="width: ${(item.size / totalSize) * 100}%"
                         title="${item.type}: ${item.size}GB">
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="storage-info text-center">
            <h4 class="text-purple">${totalSize}GB / 10GB</h4>
            <small class="text-muted">${Math.round((totalSize / 10) * 100)}% of storage used</small>
        </div>
    `;
}

function initializeFileUpload() {
    // This would be implemented for actual file upload
}

// File Handling Functions
function handleFiles(files) {
    const selectedFiles = document.getElementById('selectedFiles');
    const uploadBtn = document.getElementById('uploadMaterialBtn');
    
    if (!files.length) return;

    selectedFiles.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item d-flex justify-content-between align-items-center p-2 border rounded mb-2';
        fileElement.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-file me-2 text-muted"></i>
                <span class="file-name">${file.name}</span>
            </div>
            <small class="text-muted">${formatFileSize(file.size)}</small>
        `;
        selectedFiles.appendChild(fileElement);
    });

    if (uploadBtn) {
        uploadBtn.disabled = false;
    }
}

function uploadMaterial() {
    const course = document.getElementById('materialCourse').value;
    const type = document.getElementById('materialType').value;
    const description = document.getElementById('materialDescription').value;
    const folder = document.getElementById('materialFolder').value;
    const access = document.getElementById('materialAccess').value;

    if (!course || !type) {
        showToast('Please select course and material type', 'warning');
        return;
    }

    // Simulate file upload
    showToast('Uploading materials...', 'info');
    
    setTimeout(() => {
        // Add new material to the list
        const newMaterial = {
            id: materials.length + 1,
            name: "New Uploaded File.pdf",
            type: type,
            course: document.querySelector(`#materialCourse option[value="${course}"]`).text,
            size: "2.1 MB",
            downloads: 0,
            uploaded: new Date(),
            author: "Dr. Sarah Johnson",
            description: description || "No description provided",
            folder: folder || "root",
            icon: getFileIcon(type),
            color: getFileColor(type)
        };

        materials.unshift(newMaterial);
        renderMaterialsGrid();
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('uploadMaterialModal')).hide();
        document.getElementById('uploadMaterialForm').reset();
        document.getElementById('selectedFiles').innerHTML = '';
        document.getElementById('uploadMaterialBtn').disabled = true;
        
        showToast('Material uploaded successfully!', 'success');
    }, 2000);
}

function createFolder() {
    const folderName = document.getElementById('folderName').value;
    const parentFolder = document.getElementById('folderParent').value;
    const description = document.getElementById('folderDescription').value;

    if (!folderName) {
        showToast('Please enter a folder name', 'warning');
        return;
    }

    showToast(`Folder "${folderName}" created successfully!`, 'success');
    bootstrap.Modal.getInstance(document.getElementById('createFolderModal')).hide();
    document.getElementById('createFolderForm').reset();
}

// Material Actions
function downloadMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (material) {
        material.downloads++;
        renderMaterialsGrid();
        showToast(`Downloading ${material.name}...`, 'info');
    }
}

function shareMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (material) {
        showToast(`Sharing options for ${material.name}`, 'info');
        // In a real app, you would show sharing dialog
    }
}

function editMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (material) {
        showToast(`Editing: ${material.name}`, 'info');
        // In a real app, you would populate edit form
    }
}

function deleteMaterial(id) {
    if (confirm('Are you sure you want to delete this material?')) {
        materials = materials.filter(m => m.id !== id);
        renderMaterialsGrid();
        showToast('Material deleted successfully!', 'success');
    }
}

function filterMaterials(filter) {
    const materialItems = document.querySelectorAll('.material-item');
    
    materialItems.forEach(item => {
        switch(filter) {
            case 'all':
                item.style.display = 'block';
                break;
            case 'course':
                // Group by course logic would go here
                item.style.display = 'block';
                break;
            case 'type':
                // Group by type logic would go here
                item.style.display = 'block';
                break;
            case 'recent':
                // Show recent items logic would go here
                item.style.display = 'block';
                break;
            default:
                item.style.display = 'block';
        }
    });
}

function searchMaterials(query) {
    const materialItems = document.querySelectorAll('.material-item');
    const searchTerm = query.toLowerCase();
    
    materialItems.forEach(item => {
        const materialName = item.querySelector('.card-title').textContent.toLowerCase();
        const materialDescription = item.querySelector('.card-text').textContent.toLowerCase();
        const materialCourse = item.querySelector('.material-meta').textContent.toLowerCase();
        
        const matches = materialName.includes(searchTerm) || 
                       materialDescription.includes(searchTerm) || 
                       materialCourse.includes(searchTerm);
        
        item.style.display = matches ? 'block' : 'none';
    });
}

function organizeMaterials() {
    showToast('Opening organization view...', 'info');
    // In a real app, you would show folder organization interface
}

function exportMaterials() {
    showToast('Exporting materials list...', 'info');
    setTimeout(() => {
        showToast('Materials list exported successfully!', 'success');
    }, 1500);
}

// Utility Functions
function getFileIcon(type) {
    const icons = {
        'lecture': 'fas fa-file-pdf',
        'slides': 'fas fa-file-powerpoint',
        'assignment': 'fas fa-file-archive',
        'reading': 'fas fa-file-word',
        'code': 'fas fa-file-code',
        'other': 'fas fa-file'
    };
    return icons[type] || 'fas fa-file';
}

function getFileColor(type) {
    const colors = {
        'lecture': 'text-danger',
        'slides': 'text-warning',
        'assignment': 'text-secondary',
        'reading': 'text-primary',
        'code': 'text-info',
        'other': 'text-muted'
    };
    return colors[type] || 'text-muted';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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