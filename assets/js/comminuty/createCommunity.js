// Enhanced Create Community JavaScript with DataManager integration
document.addEventListener('DOMContentLoaded', function() {
    // Ensure DataManager is loaded
    if (typeof dataManager === 'undefined') {
        console.error('DataManager not loaded. Please include dataManager.js');
        return;
    }

    initializeCreateCommunity();
});

function initializeCreateCommunity() {
    const form = document.getElementById('createCommunityForm');
    if (form) {
        form.addEventListener('submit', handleCreateCommunity);

        // Real-time preview updates
        setupPreviewUpdates();

        // Dark mode toggle
        setupDarkMode();

        // Load existing communities for validation
        loadExistingCommunities();
    }
}

function setupPreviewUpdates() {
    const inputs = [
        'communityName',
        'communityDescription',
        'communityCategory',
        'communityType'
    ];

    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        }
    });

    // Initial preview update
    updatePreview();
}

function updatePreview() {
    const name = document.getElementById('communityName').value || 'Community Name';
    const description = document.getElementById('communityDescription').value || 'Community description will appear here...';
    const category = document.getElementById('communityCategory').value;
    const type = document.getElementById('communityType').value;

    document.getElementById('previewName').textContent = name;
    document.getElementById('previewDescription').textContent = description;

    // Update category badge
    const categoryBadge = document.getElementById('previewCategory');
    categoryBadge.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category';

    // Update type badge
    const typeBadge = document.getElementById('previewType');
    const typeText = type === 'private' ? 'Private' : type === 'invite-only' ? 'Invite Only' : 'Public';
    typeBadge.textContent = typeText;
}

function loadExistingCommunities() {
    // Load existing communities for duplicate checking
    window.existingCommunities = dataManager.getItem('communities', []);
}

function handleCreateCommunity(e) {
    e.preventDefault();

    try {
        // Get form values
        const communityData = {
            name: document.getElementById('communityName').value.trim(),
            description: document.getElementById('communityDescription').value.trim(),
            category: document.getElementById('communityCategory').value,
            type: document.getElementById('communityType').value || 'public',
            maxMembers: document.getElementById('maxMembers').value ? parseInt(document.getElementById('maxMembers').value) : null,
            tags: document.getElementById('communityTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            rules: document.getElementById('communityRules').value.trim(),
            allowDiscussions: document.getElementById('allowDiscussions').checked,
            allowEvents: document.getElementById('allowEvents').checked,
            allowFileSharing: document.getElementById('allowFileSharing').checked,
            createdBy: 'Student User', // In a real app, this would be the current user
            createdAt: new Date().toISOString(),
            members: 1, // Creator is the first member
            events: 0,
            discussions: 0,
            files: 0,
            status: 'active',
            lastActivity: new Date().toISOString()
        };

        // Validate required fields
        if (!communityData.name || !communityData.description || !communityData.category) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        // Validate community name length
        if (communityData.name.length < 3) {
            showToast('Community name must be at least 3 characters long', 'warning');
            return;
        }

        if (communityData.name.length > 100) {
            showToast('Community name must be less than 100 characters', 'warning');
            return;
        }

        // Check for duplicate community names
        const existingCommunities = dataManager.getItem('communities', []);
        const duplicate = existingCommunities.find(c => c.name.toLowerCase() === communityData.name.toLowerCase());
        if (duplicate) {
            showToast('A community with this name already exists', 'warning');
            return;
        }

        // Generate unique ID
        communityData.id = existingCommunities.length > 0
            ? Math.max(...existingCommunities.map(c => c.id || 0)) + 1
            : 1;

        // Add member information
        communityData.memberList = [{
            id: 1, // Current user ID
            name: 'Student User',
            role: 'admin',
            joinedAt: new Date().toISOString(),
            status: 'active'
        }];

        // Add default settings
        communityData.settings = {
            allowJoinRequests: communityData.type !== 'invite-only',
            requireApproval: communityData.type === 'private',
            showMemberList: true,
            allowAnonymousPosts: false
        };

        // Save using DataManager with validation
        const schema = DataManager.getValidationSchemas().community;
        existingCommunities.push(communityData);
        dataManager.setItem('communities', existingCommunities, schema);

        // Update user activity
        updateUserActivity('created_community', { communityId: communityData.id, communityName: communityData.name });

        // Show success message
        showToast('Community created successfully!', 'success');

        // Redirect to communities page after a short delay
        setTimeout(() => {
            window.location.href = '../../community/communities.html';
        }, 1500);

    } catch (error) {
        console.error('Error creating community:', error);
        showToast('Error creating community: ' + error.message, 'error');
    }
}

function updateUserActivity(action, details) {
    try {
        const activities = dataManager.getItem('userActivities', []);
        activities.push({
            id: Date.now(),
            userId: 1, // Current user
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }

        dataManager.setItem('userActivities', activities);
    } catch (error) {
        console.warn('Failed to update user activity:', error);
    }
}

function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const darkModeIcon = toggle.querySelector('i');

    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme') || localStorage.getItem('darkMode');

    if (savedTheme === 'dark' || savedTheme === 'enabled') {
        document.body.setAttribute('data-theme', 'dark');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    } else {
        document.body.removeAttribute('data-theme');
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
    }

    toggle.addEventListener('click', function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.body.removeAttribute('data-theme');
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
            localStorage.setItem('darkMode', 'disabled');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
            localStorage.setItem('darkMode', 'enabled');
        }
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
