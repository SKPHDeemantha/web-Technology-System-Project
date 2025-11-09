// Community Details JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityDetails();
});

function initializeCommunityDetails() {
    loadCommunityStats();
    loadMembers();
    loadGroups();
    setupEventListeners();
    initializeModals();
    initializeDarkMode();
}

function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('darkModeToggle').querySelector('i');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function loadCommunityStats() {
    // Simulate loading community statistics
    // In a real app, this would fetch data from an API
    const stats = {
        totalMembers: 25,
        totalPosts: 156,
        events: 8,
        activeUsers: 18
    };

    document.getElementById('totalMembersCount').textContent = stats.totalMembers;
    document.getElementById('totalPostsCount').textContent = stats.totalPosts;
    document.getElementById('eventsCount').textContent = stats.events;
    document.getElementById('activeUsersCount').textContent = stats.activeUsers;
}

function loadMembers() {
    const membersTable = document.getElementById('membersTable');
    const members = [
        { name: 'John Doe', role: 'Admin', joined: '2023-01-15', status: 'Active' },
        { name: 'Jane Smith', role: 'Moderator', joined: '2023-02-20', status: 'Active' },
        { name: 'Bob Johnson', role: 'Member', joined: '2023-03-10', status: 'Active' },
        { name: 'Alice Brown', role: 'Member', joined: '2023-04-05', status: 'Inactive' }
    ];

    membersTable.innerHTML = '';
    members.forEach(member => {
        const row = `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="https://via.placeholder.com/40" alt="${member.name}" class="member-avatar rounded-circle me-2">
                        ${member.name}
                    </div>
                </td>
                <td><span class="badge bg-${member.role === 'Admin' ? 'danger' : member.role === 'Moderator' ? 'warning' : 'secondary'}">${member.role}</span></td>
                <td>${new Date(member.joined).toLocaleDateString()}</td>
                <td><span class="badge bg-${member.status === 'Active' ? 'success' : 'secondary'}">${member.status}</span></td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="viewMember('${member.name}')">View Profile</a></li>
                            <li><a class="dropdown-item" href="#" onclick="changeRole('${member.name}')">Change Role</a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="removeMember('${member.name}')">Remove</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
        membersTable.insertAdjacentHTML('beforeend', row);
    });
}

function loadGroups() {
    const groupsContainer = document.getElementById('groupsContainer');
    const groups = [
        { name: 'General Discussion', type: 'Channel', description: 'General discussions about computer science', private: false, members: 25 },
        { name: 'Study Group A', type: 'Group', description: 'Group for algorithm studies', private: true, members: 8 },
        { name: 'Project Collaboration', type: 'Channel', description: 'Channel for project collaborations', private: false, members: 15 }
    ];

    groupsContainer.innerHTML = '';
    groups.forEach(group => {
        const groupCard = `
            <div class="col-md-4 mb-3">
                <div class="group-card">
                    <div class="group-icon">
                        <i class="fas fa-${group.type === 'Channel' ? 'hashtag' : 'users'}"></i>
                    </div>
                    <h6>${group.name}</h6>
                    <p>${group.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${group.members} members</small>
                        <span class="badge bg-${group.private ? 'warning' : 'success'}">${group.private ? 'Private' : 'Public'}</span>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="joinGroup('${group.name}')">Join</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="viewGroup('${group.name}')">View</button>
                    </div>
                </div>
            </div>
        `;
        groupsContainer.insertAdjacentHTML('beforeend', groupCard);
    });
}

function setupEventListeners() {
    // Add Member Form
    document.getElementById('addMemberForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addMember();
    });

    // Add Group Form
    document.getElementById('addGroupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addGroup();
    });

    // Community Settings Form
    document.getElementById('communitySettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('show');
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', function() {
        toggleDarkMode();
    });

    // Handle notification item clicks
    const notificationItems = document.querySelectorAll('#notificationsMenu .dropdown-item[data-id]');
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const notificationId = this.getAttribute('data-id');
            showNotificationDetails(notificationId);
        });
    });
}

function toggleDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    const icon = document.getElementById('darkModeToggle').querySelector('i');

    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

function initializeModals() {
    // Initialize Bootstrap modals if needed
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        new bootstrap.Modal(modal);
    });
}

function addMember() {
    const email = document.getElementById('memberEmail').value;
    const role = document.getElementById('memberRole').value;

    // Simulate adding member
    showToast('Member added successfully!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('addMemberModal')).hide();
    document.getElementById('addMemberForm').reset();

    // Reload members
    loadMembers();
}

function addGroup() {
    const name = document.getElementById('groupName').value;
    const type = document.getElementById('groupType').value;
    const description = document.getElementById('groupDescription').value;
    const isPrivate = document.getElementById('groupPrivate').checked;

    // Simulate adding group
    showToast('Group created successfully!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('addGroupModal')).hide();
    document.getElementById('addGroupForm').reset();

    // Reload groups
    loadGroups();
}

function saveSettings() {
    // Simulate saving settings
    showToast('Settings saved successfully!', 'success');
}

function viewMember(name) {
    showToast(`Viewing profile for ${name}`, 'info');
}

function changeRole(name) {
    showToast(`Changing role for ${name}`, 'info');
}

function removeMember(name) {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
        showToast(`${name} removed from community`, 'warning');
        loadMembers();
    }
}

function joinGroup(name) {
    showToast(`Joined ${name}`, 'success');
}

function viewGroup(name) {
    showToast(`Viewing ${name}`, 'info');
}

function showToast(message, type) {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function showTab(tabName) {
    const tabButton = document.getElementById(`${tabName}-tab`);
    if (tabButton) {
        tabButton.click();
    }
}

function showNotificationDetails(notificationId) {
    const notifications = {
        1: {
            title: 'New member joined',
            message: 'John Doe has joined the Computer Science Club community.',
            time: '2 hours ago',
            type: 'member_join'
        },
        2: {
            title: 'Event reminder',
            message: 'Web Development Workshop is scheduled for tomorrow at 14:00.',
            time: '1 day ago',
            type: 'event_reminder'
        }
    };

    const notification = notifications[notificationId];
    if (notification) {
        const content = `
            <div class="notification-detail">
                <div class="mb-3">
                    <h6 class="fw-bold">${notification.title}</h6>
                    <p class="text-muted small">${notification.time}</p>
                </div>
                <div class="mb-3">
                    <p>${notification.message}</p>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-outline-primary me-2" onclick="markAsRead('${notificationId}')">Mark as Read</button>
                    <button type="button" class="btn btn-sm btn-primary" onclick="takeAction('${notification.type}', '${notificationId}')">Take Action</button>
                </div>
            </div>
        `;

        document.getElementById('notificationDetailsContent').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('notificationDetailsModal'));
        modal.show();
    }
}

function markAsRead(notificationId) {
    // Update notification badge count
    const badge = document.getElementById('notificationCount');
    let count = parseInt(badge.textContent);
    if (count > 0) {
        count--;
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        }
    }

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('notificationDetailsModal')).hide();

    showToast('Notification marked as read', 'success');
}

function takeAction(type, notificationId) {
    switch(type) {
        case 'member_join':
            // Navigate to members tab
            showTab('members');
            break;
        case 'event_reminder':
            // Navigate to events page
            window.location.href = 'event/events.html';
            break;
        default:
            showToast('Action taken', 'info');
    }

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('notificationDetailsModal')).hide();
}

// Export functions for global access if needed
window.showTab = showTab;
window.viewMember = viewMember;
window.changeRole = changeRole;
window.removeMember = removeMember;
window.joinGroup = joinGroup;
window.viewGroup = viewGroup;
window.showNotificationDetails = showNotificationDetails;
window.markAsRead = markAsRead;
window.takeAction = takeAction;
