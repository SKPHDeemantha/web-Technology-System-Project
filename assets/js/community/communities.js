// Communities Management JavaScript with DataManager integration
document.addEventListener('DOMContentLoaded', function() {
    // Ensure DataManager is loaded
    if (typeof dataManager === 'undefined') {
        console.error('DataManager not loaded. Please include dataManager.js');
        return;
    }

    // Check if we're on the communities page
    if (document.getElementById('recentCommunitiesTable')) {
        initializeCommunitiesPage();
    }
});

function initializeCommunitiesPage() {
    // Initialize communities using DataManager
    let communities = dataManager.getItem('communities', [
        {
            id: 1,
            name: 'Computer Science Study Group',
            description: 'A community for computer science students to collaborate on projects and share knowledge.',
            category: 'academic',
            type: 'public',
            members: 45,
            events: 3,
            discussions: 12,
            files: 8,
            createdBy: 'John Doe',
            createdAt: new Date().toISOString(),
            status: 'active',
            tags: ['programming', 'algorithms', 'web-development'],
            allowDiscussions: true,
            allowEvents: true,
            allowFileSharing: true,
            memberList: [
                { id: 1, name: 'John Doe', role: 'admin', joinedAt: new Date().toISOString() },
                { id: 2, name: 'Jane Smith', role: 'member', joinedAt: new Date().toISOString() }
            ]
        },
        {
            id: 2,
            name: 'Data Science Hub',
            description: 'Exploring the world of data science, machine learning, and AI together.',
            category: 'technical',
            type: 'public',
            members: 32,
            events: 2,
            discussions: 8,
            files: 5,
            createdBy: 'Alice Johnson',
            createdAt: new Date().toISOString(),
            status: 'active',
            tags: ['data-science', 'machine-learning', 'ai'],
            allowDiscussions: true,
            allowEvents: true,
            allowFileSharing: true,
            memberList: [
                { id: 3, name: 'Alice Johnson', role: 'admin', joinedAt: new Date().toISOString() }
            ]
        },
        {
            id: 3,
            name: 'Art & Design Society',
            description: 'A creative space for artists, designers, and anyone interested in visual arts.',
            category: 'cultural',
            type: 'public',
            members: 28,
            events: 4,
            discussions: 15,
            files: 12,
            createdBy: 'Mike Wilson',
            createdAt: new Date().toISOString(),
            status: 'active',
            tags: ['art', 'design', 'creativity'],
            allowDiscussions: true,
            allowEvents: true,
            allowFileSharing: true,
            memberList: [
                { id: 4, name: 'Mike Wilson', role: 'admin', joinedAt: new Date().toISOString() }
            ]
        }
    ]);

    // DOM Elements
    const recentCommunitiesTable = document.getElementById('recentCommunitiesTable');
    const activityFeed = document.getElementById('activityFeed');

    // Initialize communities display
    function initCommunities() {
        renderCommunitiesTable();
        renderActivityFeed();
        updateDashboardStats();
    }

    // Render communities table
    function renderCommunitiesTable() {
        if (!recentCommunitiesTable) return;

        recentCommunitiesTable.innerHTML = '';

        if (communities.length === 0) {
            recentCommunitiesTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4">
                        <i class="fas fa-users fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No communities yet</p>
                        <a href="../components/community/create-community.html" class="btn btn-purple">
                            <i class="fas fa-plus me-1"></i> Create First Community
                        </a>
                    </td>
                </tr>
            `;
            return;
        }

        communities.slice(0, 5).forEach(community => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-purple text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                            ${community.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                            <div class="fw-bold">${community.name}</div>
                            <small class="text-muted">${community.category.charAt(0).toUpperCase() + community.category.slice(1)}</small>
                        </div>
                    </div>
                </td>
                <td>${community.members}</td>
                <td><span class="badge bg-success">${community.status}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="viewCommunity(${community.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="joinCommunity(${community.id})">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    </div>
                </td>
            `;

            recentCommunitiesTable.appendChild(row);
        });
    }

    // Render activity feed
    function renderActivityFeed() {
        if (!activityFeed) return;

        // Generate sample activity data
        const activities = [
            {
                type: 'community_created',
                message: 'New community "Web Development Club" was created',
                time: '2 hours ago',
                icon: 'fas fa-plus-circle text-success'
            },
            {
                type: 'member_joined',
                message: 'Sarah joined "Data Science Hub"',
                time: '4 hours ago',
                icon: 'fas fa-user-plus text-primary'
            },
            {
                type: 'event_created',
                message: 'New event "AI Workshop" scheduled',
                time: '6 hours ago',
                icon: 'fas fa-calendar-plus text-info'
            },
            {
                type: 'discussion_started',
                message: 'Discussion "React Best Practices" started',
                time: '1 day ago',
                icon: 'fas fa-comments text-warning'
            }
        ];

        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item d-flex align-items-start mb-3">
                <div class="activity-icon me-3">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <p class="mb-1">${activity.message}</p>
                    <small class="text-muted">${activity.time}</small>
                </div>
            </div>
        `).join('');
    }

    // Update dashboard stats
    function updateDashboardStats() {
        const totalCommunities = communities.length;
        const totalMembers = communities.reduce((sum, community) => sum + community.members, 0);
        const totalEvents = communities.reduce((sum, community) => sum + community.events, 0);
        const totalDiscussions = communities.reduce((sum, community) => sum + community.discussions, 0);

        // Update stats if elements exist
        const totalCommunitiesEl = document.getElementById('totalCommunities');
        const activeMembersEl = document.getElementById('activeMembers');
        const upcomingEventsEl = document.getElementById('upcomingEvents');
        const activeDiscussionsEl = document.getElementById('activeDiscussions');

        if (totalCommunitiesEl) totalCommunitiesEl.textContent = totalCommunities;
        if (activeMembersEl) activeMembersEl.textContent = totalMembers.toLocaleString();
        if (upcomingEventsEl) upcomingEventsEl.textContent = totalEvents;
        if (activeDiscussionsEl) activeDiscussionsEl.textContent = totalDiscussions;
    }

    // Action functions
    window.viewCommunity = function(communityId) {
        const community = communities.find(c => c.id === communityId);
        if (community) {
            // In a real app, this would navigate to community detail page
            showToast(`Viewing community: ${community.name}`, 'info');
        }
    };

    window.joinCommunity = function(communityId) {
        const community = communities.find(c => c.id === communityId);
        if (community) {
            // Check if user is already a member
            const currentUserId = 1; // In a real app, this would be the current user ID
            const isMember = community.memberList.some(member => member.id === currentUserId);

            if (isMember) {
                showToast('You are already a member of this community', 'warning');
                return;
            }

            // Add user to community
            community.memberList.push({
                id: currentUserId,
                name: 'Student User',
                role: 'member',
                joinedAt: new Date().toISOString()
            });
            community.members++;

            // Save changes using DataManager
            dataManager.setItem('communities', communities);

            // Update display
            renderCommunitiesTable();
            updateDashboardStats();

            showToast(`Successfully joined ${community.name}!`, 'success');
        }
    };

    // Search communities functionality
    const searchCommunity = document.getElementById('searchCommunity');
    if (searchCommunity) {
        searchCommunity.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const results = document.getElementById('communitySearchResults');

            if (query.length > 2) {
                const filteredCommunities = communities.filter(community =>
                    community.name.toLowerCase().includes(query) ||
                    community.description.toLowerCase().includes(query) ||
                    community.category.toLowerCase().includes(query)
                );

                if (filteredCommunities.length > 0) {
                    results.innerHTML = filteredCommunities.map(community => `
                        <div class="search-result-item p-3 border-bottom">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">${community.name}</h6>
                                    <p class="mb-2 text-muted small">${community.description.substring(0, 100)}...</p>
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-secondary me-2">${community.category}</span>
                                        <small class="text-muted">${community.members} members</small>
                                    </div>
                                </div>
                                <button class="btn btn-sm btn-purple" onclick="joinCommunity(${community.id})">
                                    <i class="fas fa-user-plus me-1"></i>Join
                                </button>
                            </div>
                        </div>
                    `).join('');
                } else {
                    results.innerHTML = `
                        <div class="empty-state p-4 text-center">
                            <i class="fas fa-search fa-2x text-muted mb-2"></i>
                            <p class="text-muted">No communities found matching "${query}"</p>
                        </div>
                    `;
                }
            } else {
                results.innerHTML = `
                    <div class="empty-state p-4 text-center">
                        <i class="fas fa-search fa-2x text-muted mb-2"></i>
                        <p class="text-muted">Start typing to search for communities...</p>
                    </div>
                `;
            }
        });
    }

    // Initialize communities functionality
    initCommunities();
}

// Utility function for toasts (if not already defined)
if (typeof showToast === 'undefined') {
    window.showToast = function(message, type = 'info') {
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
    };
}
