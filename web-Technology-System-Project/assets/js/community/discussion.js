// Discussion Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the discussions page
    if (document.getElementById('discussionsContainer')) {
        initializeDiscussionsPage();
    }
});

function initializeDiscussionsPage() {
    // Initialize discussions from localStorage or use sample data
    let discussions = JSON.parse(localStorage.getItem('communityDiscussions')) || [
        {
            id: 1,
            title: 'Best practices for React development',
            content: 'What are some best practices you follow when developing React applications?',
            category: 'technical',
            tags: ['react', 'javascript', 'web-development'],
            author: 'John Doe',
            createdAt: new Date().toISOString(),
            replies: [
                {
                    id: 1,
                    content: 'Always use functional components with hooks!',
                    author: 'Alice Johnson',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    content: 'Don\'t forget about proper state management.',
                    author: 'Bob Wilson',
                    createdAt: new Date().toISOString()
                }
            ],
            views: 120,
            likes: 8
        },
        {
            id: 2,
            title: 'Upcoming project deadlines',
            content: 'Reminder about the upcoming project submission deadlines for this semester.',
            category: 'academic',
            tags: ['deadlines', 'projects', 'reminder'],
            author: 'Jane Smith',
            createdAt: new Date().toISOString(),
            replies: [
                {
                    id: 3,
                    content: 'Thanks for the reminder! When is the exact deadline?',
                    author: 'Student User',
                    createdAt: new Date().toISOString()
                }
            ],
            views: 85,
            likes: 3
        }
    ];

    // Pagination and filtering variables
    let currentPage = 1;
    const itemsPerPage = 5;
    let filteredDiscussions = [...discussions];
    let currentFilter = 'all';
    let currentSort = 'newest';
    let searchQuery = '';

    // DOM Elements
    const discussionsContainer = document.getElementById('discussionsContainer');
    const paginationContainer = document.getElementById('paginationContainer');
    const startDiscussionForm = document.getElementById('startDiscussionForm');
    const editDiscussionForm = document.getElementById('editDiscussionForm');
    const replyForm = document.getElementById('replyForm');
    const discussionFilter = document.getElementById('discussionFilter');
    const discussionSort = document.getElementById('discussionSort');
    const discussionSearch = document.getElementById('discussionSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    // Initialize discussions display
    function initDiscussions() {
        applyFiltersAndSort();
        renderDiscussions();
        renderPagination();
        updateStatistics();
        renderChart();
        setupEventListeners();
    }

    // Setup event listeners for filters and search
    function setupEventListeners() {
        if (discussionFilter) {
            discussionFilter.addEventListener('change', function() {
                currentFilter = this.value;
                currentPage = 1;
                applyFiltersAndSort();
                renderDiscussions();
                renderPagination();
            });
        }

        if (discussionSort) {
            discussionSort.addEventListener('change', function() {
                currentSort = this.value;
                currentPage = 1;
                applyFiltersAndSort();
                renderDiscussions();
                renderPagination();
            });
        }

        if (discussionSearch) {
            discussionSearch.addEventListener('input', function() {
                searchQuery = this.value.toLowerCase();
                currentPage = 1;
                applyFiltersAndSort();
                renderDiscussions();
                renderPagination();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                searchQuery = discussionSearch.value.toLowerCase();
                currentPage = 1;
                applyFiltersAndSort();
                renderDiscussions();
                renderPagination();
            });
        }
    }

    // Apply filters and sorting
    function applyFiltersAndSort() {
        let filtered = [...discussions];

        // Apply category filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(d => d.category === currentFilter);
        }

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(d =>
                d.title.toLowerCase().includes(searchQuery) ||
                d.content.toLowerCase().includes(searchQuery) ||
                d.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
                d.author.toLowerCase().includes(searchQuery)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (currentSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'most-liked':
                    return b.likes - a.likes;
                case 'most-replies':
                    return b.replies.length - a.replies.length;
                case 'most-views':
                    return b.views - a.views;
                default:
                    return 0;
            }
        });

        filteredDiscussions = filtered;
    }

    // Render discussions with pagination
    function renderDiscussions() {
        if (!discussionsContainer) return;

        if (filteredDiscussions.length === 0) {
            discussionsContainer.innerHTML = `
                <div class="discussion-empty">
                    <i class="fas fa-search"></i>
                    <h4>No discussions found</h4>
                    <p>Try adjusting your search or filter criteria.</p>
                    <button class="btn btn-purple" onclick="resetFilters()">
                        <i class="fas fa-undo me-1"></i> Reset Filters
                    </button>
                </div>
            `;
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const discussionsToShow = filteredDiscussions.slice(startIndex, endIndex);

        discussionsContainer.innerHTML = discussionsToShow.map(discussion => {
            const createdDate = new Date(discussion.createdAt);
            const formattedDate = createdDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <div class="card discussion-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title">${discussion.title}</h5>
                            <span class="badge bg-purple">${discussion.category}</span>
                        </div>

                        <p class="card-text mb-3">${discussion.content.length > 200 ? discussion.content.substring(0, 200) + '...' : discussion.content}</p>

                        <div class="discussion-meta mb-3">
                            <small class="text-muted">
                                Posted by <strong>${discussion.author}</strong> on ${formattedDate}
                            </small>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="discussion-tags">
                                ${discussion.tags.slice(0, 3).map(tag => `<span class="badge bg-light text-dark me-1">#${tag}</span>`).join('')}
                                ${discussion.tags.length > 3 ? `<span class="badge bg-light text-dark">+${discussion.tags.length - 3}</span>` : ''}
                            </div>
                            <div class="discussion-stats">
                                <span class="badge bg-light text-dark me-2">
                                    <i class="fas fa-comment me-1"></i>${discussion.replies.length}
                                </span>
                                <span class="badge bg-light text-dark me-2">
                                    <i class="fas fa-eye me-1"></i>${discussion.views}
                                </span>
                                <span class="badge bg-light text-dark">
                                    <i class="fas fa-heart me-1"></i>${discussion.likes}
                                </span>
                            </div>
                        </div>

                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-purple me-1" onclick="viewDiscussion(${discussion.id})">
                                <i class="fas fa-eye me-1"></i> View
                            </button>
                            <button class="btn btn-sm btn-outline-success me-1" onclick="likeDiscussion(${discussion.id})">
                                <i class="fas fa-heart me-1"></i> Like
                            </button>
                            <button class="btn btn-sm btn-outline-info me-1" onclick="openReplyModal(${discussion.id})">
                                <i class="fas fa-reply me-1"></i> Reply
                            </button>
                            ${discussion.author === 'Student User' ? `
                                <button class="btn btn-sm btn-outline-warning me-1" onclick="editDiscussion(${discussion.id})">
                                    <i class="fas fa-edit me-1"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteDiscussion(${discussion.id})">
                                    <i class="fas fa-trash me-1"></i> Delete
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render pagination
    function renderPagination() {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')">&laquo;</a></li>';

        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += '<li class="page-item active"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
            } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        paginationHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')">&raquo;</a></li>';

        paginationContainer.innerHTML = paginationHTML;
    }

    // Change page
    window.changePage = function(page) {
        const totalPages = Math.ceil(filteredDiscussions.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;

        currentPage = page;
        renderDiscussions();
        renderPagination();

        // Scroll to top of discussions
        discussionsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset filters
    window.resetFilters = function() {
        currentFilter = 'all';
        currentSort = 'newest';
        searchQuery = '';
        currentPage = 1;

        if (discussionFilter) discussionFilter.value = 'all';
        if (discussionSort) discussionSort.value = 'newest';
        if (discussionSearch) discussionSearch.value = '';

        applyFiltersAndSort();
        renderDiscussions();
        renderPagination();
    }
    
    // Start new discussion
    if (startDiscussionForm) {
        startDiscussionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('discussionTitle').value;
            const content = document.getElementById('discussionContent').value;
            const category = document.getElementById('discussionCategory').value;
            const tags = document.getElementById('discussionTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            const newDiscussion = {
                id: discussions.length > 0 ? Math.max(...discussions.map(d => d.id)) + 1 : 1,
                title,
                content,
                category,
                tags,
                author: 'Student User',
                createdAt: new Date().toISOString(),
                replies: [],
                views: 0,
                likes: 0
            };
            
            discussions.push(newDiscussion);
            saveDiscussions();
            renderDiscussions();
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('startDiscussionModal'));
            modal.hide();
            startDiscussionForm.reset();
            
            showToast('Discussion started successfully!', 'success');
        });
    }
    
    // Save discussions to localStorage
    function saveDiscussions() {
        localStorage.setItem('communityDiscussions', JSON.stringify(discussions));
    }
    
    // Action functions
    window.viewDiscussion = function(discussionId) {
        const discussion = discussions.find(d => d.id === discussionId);
        if (discussion) {
            // Increment views
            discussion.views++;
            saveDiscussions();

            // Populate view modal
            document.getElementById('viewDiscussionTitle').textContent = discussion.title;

            const createdDate = new Date(discussion.createdAt);
            const formattedDate = createdDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const discussionContent = `
                <div class="discussion-content">
                    <div class="mb-3">
                        <small class="text-muted">
                            Posted by <strong>${discussion.author}</strong> on ${formattedDate}
                        </small>
                        <span class="badge bg-purple ms-2">${discussion.category}</span>
                    </div>
                    <div class="discussion-tags mb-3">
                        ${discussion.tags.map(tag => `<span class="badge bg-light text-dark me-1">#${tag}</span>`).join('')}
                    </div>
                    <p class="mb-3">${discussion.content}</p>
                    <div class="discussion-stats">
                        <span class="badge bg-light text-dark me-2">
                            <i class="fas fa-eye me-1"></i>${discussion.views} views
                        </span>
                        <span class="badge bg-light text-dark me-2">
                            <i class="fas fa-heart me-1"></i>${discussion.likes} likes
                        </span>
                    </div>
                </div>
            `;

            document.getElementById('viewDiscussionContent').innerHTML = discussionContent;

            // Populate replies
            const repliesContainer = document.getElementById('repliesContainer');
            if (discussion.replies.length > 0) {
                repliesContainer.innerHTML = discussion.replies.map(reply => {
                    const replyDate = new Date(reply.createdAt);
                    const replyFormattedDate = replyDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return `
                        <div class="reply-item border-start border-primary ps-3 mb-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <small class="text-muted">
                                    <strong>${reply.author}</strong> replied on ${replyFormattedDate}
                                </small>
                            </div>
                            <p class="mt-2 mb-0">${reply.content}</p>
                        </div>
                    `;
                }).join('');
            } else {
                repliesContainer.innerHTML = '<p class="text-muted">No replies yet. Be the first to reply!</p>';
            }

            // Set current discussion ID for replying
            window.currentReplyId = discussionId;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('viewDiscussionModal'));
            modal.show();

            // Update display
            renderDiscussions();
        }
    }
    
    window.likeDiscussion = function(discussionId) {
        const discussion = discussions.find(d => d.id === discussionId);
        if (discussion) {
            discussion.likes++;
            saveDiscussions();
            renderDiscussions();
            showToast(`Liked discussion: ${discussion.title}`, 'success');
        }
    }
    
    // Reply modal is now integrated into viewDiscussionModal, so this function is no longer needed

    window.editDiscussion = function(discussionId) {
        const discussion = discussions.find(d => d.id === discussionId);
        if (discussion && discussion.author === 'Student User') {
            // Populate edit modal
            document.getElementById('editDiscussionTitle').value = discussion.title;
            document.getElementById('editDiscussionContent').value = discussion.content;
            document.getElementById('editDiscussionCategory').value = discussion.category;
            document.getElementById('editDiscussionTags').value = discussion.tags.join(', ');

            // Store current discussion ID for editing
            window.currentEditId = discussionId;

            // Show edit modal
            const modal = new bootstrap.Modal(document.getElementById('editDiscussionModal'));
            modal.show();
        }
    }

    window.deleteDiscussion = function(discussionId) {
        const discussion = discussions.find(d => d.id === discussionId);
        if (discussion && discussion.author === 'Student User') {
            if (confirm(`Are you sure you want to delete the discussion "${discussion.title}"?`)) {
                discussions = discussions.filter(d => d.id !== discussionId);
                saveDiscussions();
                renderDiscussions();
                updateStatistics();
                renderChart();
                showToast('Discussion deleted successfully!', 'success');
            }
        }
    }
    
    // Update statistics
    function updateStatistics() {
        const totalDiscussions = discussions.length;
        const totalReplies = discussions.reduce((sum, d) => sum + d.replies.length, 0);
        const activeToday = discussions.filter(d => {
            const today = new Date();
            const discussionDate = new Date(d.createdAt);
            return discussionDate.toDateString() === today.toDateString();
        }).length;
        const mostLiked = discussions.length > 0 ? Math.max(...discussions.map(d => d.likes)) : 0;

        document.getElementById('totalDiscussionsCount').textContent = totalDiscussions;
        document.getElementById('totalRepliesCount').textContent = totalReplies;
        document.getElementById('activeDiscussionsCount').textContent = activeToday;
        document.getElementById('mostLikedCount').textContent = mostLiked;
    }

    // Render chart
    function renderChart() {
        const ctx = document.getElementById('discussionsChart');
        if (!ctx) return;

        const categoryCounts = discussions.reduce((acc, d) => {
            acc[d.category] = (acc[d.category] || 0) + 1;
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryCounts),
                datasets: [{
                    data: Object.values(categoryCounts),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Edit discussion form handler
    if (editDiscussionForm) {
        editDiscussionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const discussionId = window.currentEditId;
            const discussion = discussions.find(d => d.id === discussionId);
            if (discussion && discussion.author === 'Student User') {
                discussion.title = document.getElementById('editDiscussionTitle').value;
                discussion.content = document.getElementById('editDiscussionContent').value;
                discussion.category = document.getElementById('editDiscussionCategory').value;
                discussion.tags = document.getElementById('editDiscussionTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

                saveDiscussions();
                renderDiscussions();
                updateStatistics();
                renderChart();

                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('editDiscussionModal'));
                modal.hide();
                editDiscussionForm.reset();

                showToast('Discussion updated successfully!', 'success');
            }
        });
    }

    // Reply form handler
    if (replyForm) {
        replyForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const discussionId = window.currentReplyId;
            const discussion = discussions.find(d => d.id === discussionId);
            if (discussion) {
                const replyContent = document.getElementById('replyContent').value;
                const newReply = {
                    id: discussion.replies.length > 0 ? Math.max(...discussion.replies.map(r => r.id)) + 1 : 1,
                    content: replyContent,
                    author: 'Student User',
                    createdAt: new Date().toISOString()
                };
                discussion.replies.push(newReply);
                saveDiscussions();
                renderDiscussions();
                updateStatistics();

                // Refresh the view modal to show the new reply
                viewDiscussion(discussionId);

                // Reset form
                replyForm.reset();

                showToast('Reply added successfully!', 'success');
            }
        });
    }

    // Initialize discussions functionality
    initDiscussions();
}
