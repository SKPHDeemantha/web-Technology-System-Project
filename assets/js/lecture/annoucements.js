// Announcements Page JavaScript

// Sample announcements data
const announcementsData = [
    {
        id: 1,
        title: "Midterm Exam Schedule",
        content: "The midterm exams will be held from October 15th to October 20th. Please check the timetable for your specific exam dates and locations. Make sure to bring your student ID and arrive 15 minutes early.",
        course: "Computer Science 101",
        priority: "high",
        status: "published",
        createdAt: "2024-10-25",
        views: 156,
        author: "Dr. Smith"
    },
    {
        id: 2,
        title: "Assignment Submission Deadline Extended",
        content: "Due to technical issues with the LMS, the deadline for Assignment 3 has been extended to Friday, October 27th at 11:59 PM.",
        course: "Mathematics 201",
        priority: "normal",
        status: "published",
        createdAt: "2024-10-24",
        views: 89,
        author: "Prof. Johnson"
    },
    {
        id: 3,
        title: "Lab Session Cancelled",
        content: "This week's lab session for Physics 301 has been cancelled. We will resume next week as scheduled.",
        course: "Physics 301",
        priority: "normal",
        status: "published",
        createdAt: "2024-10-23",
        views: 42,
        author: "Dr. Wilson"
    },
    {
        id: 4,
        title: "Important: System Maintenance",
        content: "The LMS will be undergoing maintenance this Saturday from 2:00 AM to 6:00 AM. The system may be unavailable during this time.",
        course: "All Courses",
        priority: "urgent",
        status: "published",
        createdAt: "2024-10-22",
        views: 37,
        author: "Admin"
    },
    {
        id: 5,
        title: "Guest Lecture Announcement",
        content: "We are pleased to announce a guest lecture by industry expert Jane Doe on 'The Future of AI in Education' next Monday at 3:00 PM in the main auditorium.",
        course: "Computer Science 101",
        priority: "normal",
        status: "published",
        createdAt: "2024-10-21",
        views: 67,
        author: "Dr. Smith"
    },
    {
        id: 6,
        title: "New Reading Materials Available",
        content: "I've uploaded additional reading materials for the upcoming module on quantum mechanics. These are recommended but not mandatory.",
        course: "Physics 301",
        priority: "low",
        status: "draft",
        createdAt: "2024-10-20",
        views: 0,
        author: "Dr. Wilson"
    },
    {
        id: 7,
        title: "Final Project Guidelines",
        content: "The guidelines for the final project have been finalized and will be distributed next week. Please ensure you have formed your project groups.",
        course: "Computer Science 101",
        priority: "normal",
        status: "scheduled",
        scheduledFor: "2024-10-30",
        views: 0,
        author: "Dr. Smith"
    }
];

// DOM Elements
const announcementsContainer = document.getElementById('announcementsContainer');
const newAnnouncementBtn = document.getElementById('newAnnouncementBtn');
const announcementModal = document.getElementById('announcementModal');
const closeModal = document.querySelector('.close');
const announcementForm = document.getElementById('announcementForm');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const publishBtn = document.getElementById('publishBtn');
const searchInput = document.getElementById('searchAnnouncements');
const filterStatus = document.getElementById('filterStatus');
const viewButtons = document.querySelectorAll('.view-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadAnnouncements();
    setupEventListeners();
});

// Load announcements into the container
function loadAnnouncements(filteredData = announcementsData) {
    announcementsContainer.innerHTML = '';
    
    if (filteredData.length === 0) {
        announcementsContainer.innerHTML = `
            <div class="empty-state">
                <i>📢</i>
                <h3>No announcements found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    filteredData.forEach(announcement => {
        const announcementElement = createAnnouncementElement(announcement);
        announcementsContainer.appendChild(announcementElement);
    });
}

// Create announcement card element
function createAnnouncementElement(announcement) {
    const card = document.createElement('div');
    card.className = `announcement-card ${announcement.priority}`;
    
    const statusText = announcement.status === 'published' ? 'Published' : 
                      announcement.status === 'draft' ? 'Draft' : 'Scheduled';
    
    const scheduledInfo = announcement.scheduledFor ? 
        `<div class="announcement-meta">Scheduled for: ${formatDate(announcement.scheduledFor)}</div>` : '';
    
    card.innerHTML = `
        <div class="announcement-header">
            <div>
                <div class="announcement-title">${announcement.title}</div>
                <div class="announcement-meta">
                    <span>${formatDate(announcement.createdAt)}</span>
                    <span>•</span>
                    <span>${announcement.author}</span>
                    <span>•</span>
                    <span>${announcement.views} views</span>
                </div>
                ${scheduledInfo}
            </div>
            <div class="announcement-status status-${announcement.status}">${statusText}</div>
        </div>
        <div class="announcement-content">
            ${announcement.content}
        </div>
        <div class="announcement-footer">
            <span class="announcement-course">${announcement.course}</span>
            <div class="announcement-actions">
                <button class="action-btn edit-btn" data-id="${announcement.id}" title="Edit">
                    <i>✏️</i>
                </button>
                <button class="action-btn delete-btn" data-id="${announcement.id}" title="Delete">
                    <i>🗑️</i>
                </button>
                ${announcement.status === 'draft' ? 
                    `<button class="action-btn publish-btn" data-id="${announcement.id}" title="Publish">
                        <i>📤</i>
                    </button>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Set up event listeners
function setupEventListeners() {
    // New announcement button
    newAnnouncementBtn.addEventListener('click', openModal);
    
    // Close modal
    closeModal.addEventListener('click', closeModalWindow);
    window.addEventListener('click', (e) => {
        if (e.target === announcementModal) {
            closeModalWindow();
        }
    });
    
    // Form buttons
    saveDraftBtn.addEventListener('click', saveAsDraft);
    publishBtn.addEventListener('click', publishAnnouncement);
    
    // Search and filter
    searchInput.addEventListener('input', filterAnnouncements);
    filterStatus.addEventListener('change', filterAnnouncements);
    
    // View options
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viewButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            toggleView(e.target.dataset.view);
        });
    });
    
    // Handle announcement actions (using event delegation)
    announcementsContainer.addEventListener('click', handleAnnouncementActions);
}

// Open modal for new announcement
function openModal() {
    announcementModal.style.display = 'block';
    announcementForm.reset();
}

// Close modal
function closeModalWindow() {
    announcementModal.style.display = 'none';
}

// Save announcement as draft
function saveAsDraft() {
    if (validateForm()) {
        const formData = getFormData();
        formData.status = 'draft';
        formData.views = 0;
        
        // In a real application, you would save to a database
        console.log('Saving as draft:', formData);
        alert('Announcement saved as draft successfully!');
        closeModalWindow();
        
        // Reload announcements to show the new one
        announcementsData.unshift({
            id: announcementsData.length + 1,
            ...formData,
            createdAt: new Date().toISOString().split('T')[0],
            author: 'Lecturer'
        });
        
        loadAnnouncements();
    }
}

// Publish announcement
function publishAnnouncement() {
    if (validateForm()) {
        const formData = getFormData();
        formData.status = 'published';
        formData.views = 0;
        
        // In a real application, you would save to a database
        console.log('Publishing announcement:', formData);
        alert('Announcement published successfully!');
        closeModalWindow();
        
        // Reload announcements to show the new one
        announcementsData.unshift({
            id: announcementsData.length + 1,
            ...formData,
            createdAt: new Date().toISOString().split('T')[0],
            author: 'Lecturer'
        });
        
        loadAnnouncements();
    }
}

// Get form data
function getFormData() {
    return {
        title: document.getElementById('announcementTitle').value,
        content: document.getElementById('announcementContent').value,
        course: document.getElementById('announcementCourse').options[document.getElementById('announcementCourse').selectedIndex].text,
        priority: document.getElementById('announcementPriority').value,
        scheduledFor: document.getElementById('announcementSchedule').value || null
    };
}

// Validate form
function validateForm() {
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    
    if (!title.trim()) {
        alert('Please enter a title for the announcement');
        return false;
    }
    
    if (!content.trim()) {
        alert('Please enter content for the announcement');
        return false;
    }
    
    return true;
}

// Filter announcements based on search and status
function filterAnnouncements() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    
    const filtered = announcementsData.filter(announcement => {
        const matchesSearch = announcement.title.toLowerCase().includes(searchTerm) || 
                            announcement.content.toLowerCase().includes(searchTerm) ||
                            announcement.course.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    loadAnnouncements(filtered);
}

// Toggle between list and grid view
function toggleView(viewType) {
    if (viewType === 'grid') {
        announcementsContainer.classList.add('grid-view');
    } else {
        announcementsContainer.classList.remove('grid-view');
    }
}

// Handle announcement actions (edit, delete, publish)
function handleAnnouncementActions(e) {
    const target = e.target.closest('button');
    if (!target) return;
    
    const announcementId = parseInt(target.dataset.id);
    const announcement = announcementsData.find(a => a.id === announcementId);
    
    if (target.classList.contains('edit-btn')) {
        editAnnouncement(announcement);
    } else if (target.classList.contains('delete-btn')) {
        deleteAnnouncement(announcementId);
    } else if (target.classList.contains('publish-btn')) {
        publishExistingAnnouncement(announcementId);
    }
}

// Edit announcement
function editAnnouncement(announcement) {
    alert(`Editing announcement: ${announcement.title}\n\nIn a full application, this would open the edit form.`);
    // In a real application, you would populate the modal with the announcement data
}

// Delete announcement
function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        const index = announcementsData.findIndex(a => a.id === id);
        if (index !== -1) {
            announcementsData.splice(index, 1);
            loadAnnouncements();
            alert('Announcement deleted successfully!');
        }
    }
}

// Publish existing draft announcement
function publishExistingAnnouncement(id) {
    const announcement = announcementsData.find(a => a.id === id);
    if (announcement && announcement.status === 'draft') {
        announcement.status = 'published';
        loadAnnouncements();
        alert('Announcement published successfully!');
    }
}