// Community Details Page JavaScript
class CommunityDetails {
    constructor() {
        this.communityId = this.getCommunityId();
        this.currentSection = 'overview';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCommunityData();
        this.showSection('overview');
    }

    getCommunityId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1'; // Default to 1 for demo
    }

    bindEvents() {
        // Section navigation
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
        }

        // Section-specific search and filters
        this.bindSectionControls();

        // Modal forms
        this.bindModalForms();
    }

    bindSectionControls() {
        // Discussions controls
        const discussionsSearch = document.getElementById('discussionsSearch');
        const discussionsFilter = document.getElementById('discussionsFilter');
        const discussionsSort = document.getElementById('discussionsSort');

        if (discussionsSearch) {
            discussionsSearch.addEventListener('input', () => this.filterDiscussions());
        }
        if (discussionsFilter) {
            discussionsFilter.addEventListener('change', () => this.filterDiscussions());
        }
        if (discussionsSort) {
            discussionsSort.addEventListener('change', () => this.sortDiscussions());
        }

        // Events controls
        const eventsSearch = document.getElementById('eventsSearch');
        const eventsFilter = document.getElementById('eventsFilter');
        const eventsSort = document.getElementById('eventsSort');

        if (eventsSearch) {
            eventsSearch.addEventListener('input', () => this.filterEvents());
        }
        if (eventsFilter) {
            eventsFilter.addEventListener('change', () => this.filterEvents());
        }
        if (eventsSort) {
            eventsSort.addEventListener('change', () => this.sortEvents());
        }

        // Files controls
        const filesSearch = document.getElementById('filesSearch');
        const filesFilter = document.getElementById('filesFilter');
        const filesSort = document.getElementById('filesSort');

        if (filesSearch) {
            filesSearch.addEventListener('input', () => this.filterFiles());
        }
        if (filesFilter) {
            filesFilter.addEventListener('change', () => this.filterFiles());
        }
        if (filesSort) {
            filesSort.addEventListener('change', () => this.sortFiles());
        }
    }

    bindModalForms() {
        // Create Discussion Form
        const createDiscussionForm = document.getElementById('createDiscussionForm');
        if (createDiscussionForm) {
            createDiscussionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createDiscussion();
            });
        }

        // Create Event Form
        const createEventForm = document.getElementById('createEventForm');
        if (createEventForm) {
            createEventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createEvent();
            });
        }

        // Upload File Form
        const uploadFileForm = document.getElementById('uploadFileForm');
        if (uploadFileForm) {
            uploadFileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.uploadFile();
            });
        }

        // Add Member Form
        const addMemberForm = document.getElementById('addMemberForm');
        if (addMemberForm) {
            addMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMember();
            });
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.community-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Update active nav link
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`#sidebar .nav-link[href="#${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section data if needed
        this.loadSectionData(sectionName);
    }

    loadCommunityData() {
        // Load community header and stats
        const communityHeader = document.getElementById('communityHeader');
        const communityStats = document.getElementById('communityStats');

        if (communityHeader) {
            communityHeader.innerHTML = `
                <div class="d-flex align-items-center mb-3">
                    <img src="https://via.placeholder.com/60" alt="Community" class="rounded-circle me-3">
                    <div>
                        <h2>Computer Science Study Group</h2>
                        <p class="text-muted mb-0">A community for CS students to collaborate and share knowledge</p>
                    </div>
                </div>
            `;
        }

        if (communityStats) {
            communityStats.innerHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title text-primary">156</h4>
                                <p class="card-text">Members</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title text-success">23</h4>
                                <p class="card-text">Discussions</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title text-info">8</h4>
                                <p class="card-text">Events</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title text-warning">45</h4>
                                <p class="card-text">Files</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'discussions':
                this.loadDiscussions();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'files':
                this.loadFiles();
                break;
            case 'members':
                this.loadMembers();
                break;
        }
    }

    loadDiscussions() {
        const container = document.getElementById('discussionsContainer');
        if (!container) return;

        // Mock data for discussions
        const discussions = [
            {
                id: 1,
                title: 'Introduction to Algorithms Study Group',
                author: 'John Doe',
                category: 'academic',
                replies: 12,
                lastActivity: '2 hours ago',
                content: 'Let\'s discuss Chapter 5 of CLRS...'
            },
            {
                id: 2,
                title: 'Project Collaboration Opportunity',
                author: 'Jane Smith',
                category: 'technical',
                replies: 8,
                lastActivity: '1 day ago',
                content: 'Looking for team members for the AI project...'
            }
        ];

        container.innerHTML = discussions.map(discussion => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">
                                <a href="#" class="text-decoration-none">${discussion.title}</a>
                            </h5>
                            <p class="card-text text-muted small">
                                Posted by ${discussion.author} • ${discussion.lastActivity}
                            </p>
                            <p class="card-text">${discussion.content}</p>
                        </div>
                        <span class="badge bg-primary">${discussion.category}</span>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">${discussion.replies} replies</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadEvents() {
        const container = document.getElementById('eventsContainer');
        if (!container) return;

        // Mock data for events
        const events = [
            {
                id: 1,
                title: 'Machine Learning Workshop',
                date: '2024-01-15',
                time: '14:00',
                location: 'Room 101',
                type: 'workshop',
                attendees: 25,
                description: 'Hands-on ML workshop covering neural networks...'
            },
            {
                id: 2,
                title: 'Coding Competition',
                date: '2024-01-20',
                time: '10:00',
                location: 'Auditorium',
                type: 'meetup',
                attendees: 50,
                description: 'Annual coding competition open to all students...'
            }
        ];

        container.innerHTML = events.map(event => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">
                                <i class="fas fa-calendar me-2"></i>${event.date} at ${event.time}<br>
                                <i class="fas fa-map-marker-alt me-2"></i>${event.location}
                            </p>
                            <p class="card-text">${event.description}</p>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-success mb-2">${event.type}</span><br>
                            <small class="text-muted">${event.attendees} attending</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadFiles() {
        const container = document.getElementById('filesContainer');
        if (!container) return;

        // Mock data for files
        const files = [
            {
                id: 1,
                name: 'algorithms_notes.pdf',
                type: 'document',
                size: '2.5 MB',
                uploadedBy: 'John Doe',
                uploadDate: '2024-01-10',
                downloads: 45
            },
            {
                id: 2,
                name: 'project_proposal.docx',
                type: 'document',
                size: '1.2 MB',
                uploadedBy: 'Jane Smith',
                uploadDate: '2024-01-08',
                downloads: 23
            },
            {
                id: 3,
                name: 'presentation_slides.pptx',
                type: 'document',
                size: '5.1 MB',
                uploadedBy: 'Bob Johnson',
                uploadDate: '2024-01-05',
                downloads: 67
            }
        ];

        container.innerHTML = files.map(file => `
            <div class="card mb-2">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-file-${file.type === 'document' ? 'pdf' : file.type} fa-2x me-3 text-primary"></i>
                            <div>
                                <h6 class="mb-0">${file.name}</h6>
                                <small class="text-muted">
                                    ${file.size} • Uploaded by ${file.uploadedBy} • ${file.uploadDate}
                                </small>
                            </div>
                        </div>
                        <div class="text-end">
                            <small class="text-muted d-block">${file.downloads} downloads</small>
                            <button class="btn btn-sm btn-outline-primary">Download</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadMembers() {
        const container = document.getElementById('membersList');
        if (!container) return;

        // Mock data for members
        const members = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', joinDate: '2023-09-01' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'member', joinDate: '2023-09-15' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'member', joinDate: '2023-10-01' },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'moderator', joinDate: '2023-08-20' }
        ];

        container.innerHTML = members.map(member => `
            <div class="member-list-item d-flex align-items-center justify-content-between py-2">
                <div class="d-flex align-items-center">
                    <img src="https://via.placeholder.com/40" alt="${member.name}" class="member-avatar rounded-circle me-3">
                    <div>
                        <h6 class="mb-0">${member.name}</h6>
                        <small class="text-muted">${member.email}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="role-badge role-${member.role}">${member.role}</span>
                    <small class="text-muted">Joined ${member.joinDate}</small>
                </div>
            </div>
        `).join('');
    }

    handleGlobalSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 3) {
                this.performGlobalSearch(query);
            }
        }, 300);
    }

    performGlobalSearch(query) {
        // Mock search results
        const results = [
            { type: 'discussion', title: 'Algorithm Study Group', section: 'discussions' },
            { type: 'event', title: 'ML Workshop', section: 'events' },
            { type: 'file', title: 'algorithms_notes.pdf', section: 'files' },
            { type: 'member', title: 'John Doe', section: 'members' }
        ];

        const modal = new bootstrap.Modal(document.getElementById('searchResultsModal'));
        const container = document.getElementById('searchResultsContainer');

        container.innerHTML = results.map(result => `
            <div class="search-result-item p-2 border-bottom">
                <div class="d-flex align-items-center">
                    <i class="fas fa-${result.type} me-2 text-primary"></i>
                    <div class="flex-grow-1">
                        <strong>${result.title}</strong>
                        <small class="text-muted d-block">in ${result.section}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="window.communityDetails.showSection('${result.section}')">
                        View
                    </button>
                </div>
            </div>
        `).join('');

        modal.show();
    }

    filterDiscussions() {
        const searchTerm = document.getElementById('discussionsSearch').value.toLowerCase();
        const category = document.getElementById('discussionsFilter').value;

        // Apply filters to discussions container
        const discussions = document.querySelectorAll('#discussionsContainer .card');
        discussions.forEach(discussion => {
            const title = discussion.querySelector('.card-title').textContent.toLowerCase();
            const badge = discussion.querySelector('.badge').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = category === '' || badge.includes(category);

            discussion.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }

    sortDiscussions() {
        const sortBy = document.getElementById('discussionsSort').value;
        const container = document.getElementById('discussionsContainer');
        const discussions = Array.from(container.children);

        discussions.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.dataset.date || '2024-01-01') - new Date(a.dataset.date || '2024-01-01');
                case 'oldest':
                    return new Date(a.dataset.date || '2024-01-01') - new Date(b.dataset.date || '2024-01-01');
                case 'popular':
                    return (b.dataset.replies || 0) - (a.dataset.replies || 0);
                default:
                    return 0;
            }
        });

        discussions.forEach(discussion => container.appendChild(discussion));
    }

    filterEvents() {
        const searchTerm = document.getElementById('eventsSearch').value.toLowerCase();
        const type = document.getElementById('eventsFilter').value;

        const events = document.querySelectorAll('#eventsContainer .card');
        events.forEach(event => {
            const title = event.querySelector('.card-title').textContent.toLowerCase();
            const badge = event.querySelector('.badge').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm);
            const matchesType = type === '' || badge.includes(type);

            event.style.display = matchesSearch && matchesType ? 'block' : 'none';
        });
    }

    sortEvents() {
        const sortBy = document.getElementById('eventsSort').value;
        const container = document.getElementById('eventsContainer');
        const events = Array.from(container.children);

        events.sort((a, b) => {
            switch (sortBy) {
                case 'upcoming':
                    return new Date(a.dataset.date || '2024-01-01') - new Date(b.dataset.date || '2024-01-01');
                case 'recent':
                    return new Date(b.dataset.date || '2024-01-01') - new Date(a.dataset.date || '2024-01-01');
                case 'popular':
                    return (b.dataset.attendees || 0) - (a.dataset.attendees || 0);
                default:
                    return 0;
            }
        });

        events.forEach(event => container.appendChild(event));
    }

    filterFiles() {
        const searchTerm = document.getElementById('filesSearch').value.toLowerCase();
        const type = document.getElementById('filesFilter').value;

        const files = document.querySelectorAll('#filesContainer .card');
        files.forEach(file => {
            const name = file.querySelector('h6').textContent.toLowerCase();
            const fileType = file.querySelector('i').className.includes('pdf') ? 'document' :
                           file.querySelector('i').className.includes('image') ? 'image' : 'video';

            const matchesSearch = name.includes(searchTerm);
            const matchesType = type === '' || fileType === type;

            file.style.display = matchesSearch && matchesType ? 'block' : 'none';
        });
    }

    sortFiles() {
        const sortBy = document.getElementById('filesSort').value;
        const container = document.getElementById('filesContainer');
        const files = Array.from(container.children);

        files.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.dataset.date || '2024-01-01') - new Date(a.dataset.date || '2024-01-01');
                case 'oldest':
                    return new Date(a.dataset.date || '2024-01-01') - new Date(b.dataset.date || '2024-01-01');
                case 'name':
                    return a.querySelector('h6').textContent.localeCompare(b.querySelector('h6').textContent);
                case 'size':
                    return parseFloat(b.dataset.size || 0) - parseFloat(a.dataset.size || 0);
                default:
                    return 0;
            }
        });

        files.forEach(file => container.appendChild(file));
    }

    createDiscussion() {
        const form = document.getElementById('createDiscussionForm');
        const formData = new FormData(form);

        // Mock API call
        console.log('Creating discussion:', {
            title: formData.get('discussionTitle'),
            content: formData.get('discussionContent'),
            category: formData.get('discussionCategory')
        });

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('createDiscussionModal'));
        modal.hide();
        form.reset();

        // Refresh discussions
        this.loadDiscussions();

        // Show success message
        this.showToast('Discussion created successfully!', 'success');
    }

    createEvent() {
        const form = document.getElementById('createEventForm');
        const formData = new FormData(form);

        // Mock API call
        console.log('Creating event:', {
            title: formData.get('eventTitle'),
            description: formData.get('eventDescription'),
            date: formData.get('eventDate'),
            time: formData.get('eventTime'),
            location: formData.get('eventLocation'),
            type: formData.get('eventType')
        });

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
        modal.hide();
        form.reset();

        // Refresh events
        this.loadEvents();

        // Show success message
        this.showToast('Event created successfully!', 'success');
    }

    uploadFile() {
        const form = document.getElementById('uploadFileForm');
        const formData = new FormData(form);

        // Mock API call
        console.log('Uploading file:', formData.get('fileInput'));

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
        modal.hide();
        form.reset();

        // Refresh files
        this.loadFiles();

        // Show success message
        this.showToast('File uploaded successfully!', 'success');
    }

    addMember() {
        const form = document.getElementById('addMemberForm');
        const formData = new FormData(form);

        // Mock API call
        console.log('Adding member:', formData.get('memberUserId'));

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
        modal.hide();
        form.reset();

        // Refresh members
        this.loadMembers();

        // Show success message
        this.showToast('Member added successfully!', 'success');
    }

    inviteMembers() {
        // Mock invite functionality
        console.log('Opening invite modal...');
        this.showToast('Invite functionality would open here', 'info');
    }

    editCommunity() {
        // Mock edit functionality
        console.log('Opening edit modal...');
        this.showToast('Edit community functionality would open here', 'info');
    }

    showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.communityDetails = new CommunityDetails();
});

// Function to show sections (for backward compatibility)
function showSection(sectionName) {
    if (window.communityDetails) {
        window.communityDetails.showSection(sectionName);
    }
}
