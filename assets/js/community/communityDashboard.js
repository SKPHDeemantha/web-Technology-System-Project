// Community Dashboard JavaScript
(function () {
  // Initialize dashboard when DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    loadFooter();
    initializeDashboard();
    setupNavigation();
    applyRoleBasedVisibility();
    setupDarkMode();
    setupCardClickHandlers();
    setupModalHandlers();
    setupNotifications();
    loadDashboardData();

    // Setup logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
          window.location.href = "../../../index.html";
        }
      });
    }

    // Setup notifications dropdown
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    if (notificationsDropdown) {
      notificationsDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        // Prevent default dropdown behavior to handle custom logic
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
  });

  function loadFooter() {
    fetch('../../../components/footer.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('main-footer').innerHTML = html;
        // Now load footer.js as a script tag
        const script = document.createElement('script');
        script.src = '../../../assets/js/footer.js';
        script.onload = function() {
          // Now initialize footer
          if (typeof initializeFooter === 'function') {
            initializeFooter();
          }
        };
        document.head.appendChild(script);
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });
  }

  function initializeDashboard() {
    // Set up section switching
    const navLinks = document.querySelectorAll(
      "#sidebar .nav-link[data-section]"
    );

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute("data-section");

        // Remove active class from all nav links
        navLinks.forEach((navLink) => navLink.classList.remove("active"));

        // Add active class to clicked link
        this.classList.add("active");

        // Hide all sections
        document.querySelectorAll(".dashboard-section").forEach((section) => {
          section.classList.remove("active");
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.classList.add("active");
        }
      });
    });
  }

  function setupNavigation() {
    // Additional navigation setup if needed
  }

  function getCurrentUserRole() {
    const user = JSON.parse(localStorage.getItem('auth.user'));
    return user ? user.role : 'student'; // default to student if no user
  }

  function applyRoleBasedVisibility() {
    const role = getCurrentUserRole();

    // Sidebar modifications
    const sidebar = document.getElementById('sidebar');
    const navUl = sidebar.querySelector('.nav');

    if (role === 'admin') {
      // Add Admin Panel
      const adminLi = document.createElement('li');
      adminLi.className = 'nav-item';
      adminLi.innerHTML = `<button class="nav-link" data-section="AdminPanel" onclick="window.location.href='../admin/admin-panel.html'"><i class="fas fa-cog me-2"></i> Admin Panel</button>`;
      navUl.appendChild(adminLi);
    }

    if (role === 'lecturer' || role === 'admin') {
      // Add My Communities
      const myCommLi = document.createElement('li');
      myCommLi.className = 'nav-item';
      myCommLi.innerHTML = `<button class="nav-link" data-section="MyCommunities"><i class="fas fa-users-cog me-2"></i> My Communities</button>`;
      navUl.appendChild(myCommLi);
    }

    // Quick Actions visibility
    const quickActions = document.querySelector('.card-body .d-grid');
    if (quickActions) {
      const buttons = quickActions.querySelectorAll('.btn');
      buttons.forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Create Community')) {
          if (role !== 'admin' && role !== 'lecturer') btn.style.display = 'none';
        } else if (text.includes('Join Community')) {
          if (role !== 'student') btn.style.display = 'none';
        } else if (text.includes('Create Event')) {
          if (role !== 'admin' && role !== 'lecturer') btn.style.display = 'none';
        } else if (text.includes('Start Discussion')) {
          if (role !== 'student') btn.style.display = 'none';
        }
      });
    }

    // Update user info in header based on role
    const userInfo = document.querySelector('.user-info .fw-bold');
    if (userInfo) {
      const user = JSON.parse(localStorage.getItem('auth.user'));
      if (user) {
        userInfo.textContent = user.name;
        const emailEl = document.querySelector('.user-info .text-white-50');
        if (emailEl) emailEl.textContent = user.email;
      }
    }
  }

  function loadDashboardData() {
    // Load community stats if on communities page
    if (document.getElementById("totalCommunities")) {
      updateCommunityStats();
      loadRecentCommunities();
    }

    // Load upcoming events if container exists
    if (document.getElementById("upcomingEventsContainer")) {
      loadUpcomingEvents();
    }

    // Load recent discussions if container exists
    if (document.getElementById("recentDiscussionsContainer")) {
      loadRecentDiscussions();
    }
  }

  function updateCommunityStats() {
    // Simulate loading stats - in real app, this would be from API
    const stats = {
      totalCommunities: 24,
      activeMembers: 1847,
      upcomingEvents: 12,
      activeDiscussions: 89,
    };

    document.getElementById("totalCommunities").textContent =
      stats.totalCommunities;
    document.getElementById("activeMembers").textContent =
      stats.activeMembers.toLocaleString();
    document.getElementById("upcomingEvents").textContent =
      stats.upcomingEvents;
    document.getElementById("activeDiscussions").textContent =
      stats.activeDiscussions;
  }

  function loadRecentCommunities() {
    const communities = [
      {
        name: "Computer Science Club",
        members: 142,
        category: "Technical",
        status: "Active",
      },
      {
        name: "Math Study Group",
        members: 98,
        category: "Academic",
        status: "Active",
      },
      {
        name: "Art & Design Society",
        members: 76,
        category: "Cultural",
        status: "Active",
      },
      {
        name: "Business Leaders Forum",
        members: 65,
        category: "Social",
        status: "Active",
      },
      {
        name: "Environmental Club",
        members: 54,
        category: "Social",
        status: "Active",
      },
    ];

    const tbody = document.getElementById("recentCommunitiesTable");
    if (tbody) {
      tbody.innerHTML = communities
        .map(
          (community) => `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-sm bg-purple text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                                ${community.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .toUpperCase()}
                            </div>
                            <div>
                                <div class="fw-bold">${community.name}</div>
                                <small class="text-muted">${
                                  community.category
                                }</small>
                            </div>
                        </div>
                    </td>
                    <td>${community.members}</td>
                    <td><span class="badge bg-success">${
                      community.status
                    }</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-purple me-1" onclick="viewCommunity('${
                          community.name
                        }')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="joinCommunity('${
                          community.name
                        }')">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    </td>
                </tr>
            `
        )
        .join("");
    }
  }

  function loadUpcomingEvents() {
    const events = [
      {
        title: "Web Development Workshop",
        date: "2023-12-15",
        time: "14:00",
        location: "Tech Lab A",
        type: "workshop",
      },
      {
        title: "Monthly Community Meeting",
        date: "2023-12-20",
        time: "18:00",
        location: "Community Hall",
        type: "meeting",
      },
      {
        title: "AI Research Seminar",
        date: "2023-12-22",
        time: "16:00",
        location: "Lecture Hall B",
        type: "seminar",
      },
    ];

    const container = document.getElementById("upcomingEventsContainer");
    if (container) {
      container.innerHTML = events
        .map(
          (event) => `
                <div class="col-md-12 mb-3">
                    <div class="card event-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="card-title mb-1">${
                                      event.title
                                    }</h6>
                                    <p class="card-text mb-1">
                                        <small class="text-muted">
                                            <i class="fas fa-calendar me-1"></i>${new Date(
                                              event.date
                                            ).toLocaleDateString()}
                                            at ${event.time}
                                        </small>
                                    </p>
                                    <p class="card-text mb-0">
                                        <small class="text-muted">
                                            <i class="fas fa-map-marker-alt me-1"></i>${
                                              event.location
                                            }
                                        </small>
                                    </p>
                                </div>
                                <span class="badge bg-purple">${
                                  event.type
                                }</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
    }
  }

  function loadRecentDiscussions() {
    const discussions = [
      {
        title: "Best practices for React development",
        author: "John Doe",
        replies: 15,
        views: 120,
        lastActivity: "2 hours ago",
      },
      {
        title: "Upcoming project deadlines",
        author: "Jane Smith",
        replies: 8,
        views: 85,
        lastActivity: "5 hours ago",
      },
      {
        title: "Study group for final exams",
        author: "Mike Johnson",
        replies: 23,
        views: 210,
        lastActivity: "1 day ago",
      },
    ];

    const container = document.getElementById("recentDiscussionsContainer");
    if (container) {
      container.innerHTML = discussions
        .map(
          (discussion) => `
                <div class="card discussion-card mb-3">
                    <div class="card-body">
                        <h6 class="card-title mb-1">${discussion.title}</h6>
                        <p class="card-text mb-2">
                            <small class="text-muted">
                                By ${discussion.author} • ${discussion.lastActivity}
                            </small>
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-light text-dark me-2">
                                    <i class="fas fa-comment me-1"></i>${discussion.replies}
                                </span>
                                <span class="badge bg-light text-dark">
                                    <i class="fas fa-eye me-1"></i>${discussion.views}
                                </span>
                            </div>
                            <button class="btn btn-sm btn-outline-purple" onclick="viewDiscussion('${discussion.title}')">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
    }
  }

  // Action functions
  window.viewCommunity = function (name) {
    showToast(`Viewing community: ${name}`, "info");
  };

  window.joinCommunity = function (name) {
    showToast(`Joining community: ${name}`, "success");
  };

  window.joinEvent = function (title) {
    showToast(`Joining event: ${title}`, "success");
  };

  window.viewEvent = function (title) {
    showToast(`Viewing event: ${title}`, "info");
  };

  window.editEvent = function (title) {
    showToast(`Editing event: ${title}`, "info");
  };

  window.deleteEvent = function (title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      showToast(`Event "${title}" deleted`, "success");
    }
  };

  window.viewDiscussion = function (title) {
    showToast(`Viewing discussion: ${title}`, "info");
  };

  window.likeDiscussion = function (title) {
    showToast(`Liking discussion: ${title}`, "success");
  };

  window.downloadFile = function (name) {
    showToast(`Downloading file: ${name}`, "success");
  };

  // Dark mode setup
  function setupDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;

    const darkModeIcon = toggle.querySelector("i");

    // Check for saved dark mode preference
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");

    if (savedTheme === "dark" || savedTheme === "enabled") {
      document.body.setAttribute("data-theme", "dark");
      darkModeIcon.classList.remove("fa-moon");
      darkModeIcon.classList.add("fa-sun");
    } else {
      document.body.removeAttribute("data-theme");
      darkModeIcon.classList.remove("fa-sun");
      darkModeIcon.classList.add("fa-moon");
    }

    toggle.addEventListener("click", function () {
      const isDark = document.body.getAttribute("data-theme") === "dark";

      if (isDark) {
        // Switch to light mode
        document.body.removeAttribute("data-theme");
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
        localStorage.setItem("darkMode", "disabled");
      } else {
        // Switch to dark mode
        document.body.setAttribute("data-theme", "dark");
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
        localStorage.setItem("darkMode", "enabled");
      }
    });
  }

  // Card click handlers
  function setupCardClickHandlers() {
    // Stats cards navigation
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", function () {
        const sections = [
          "communities",
          "communities",
          "events",
          "discussions",
        ];
        const targetSection = sections[index];
        if (targetSection) {
          navigateToSection(targetSection);
        }
      });
    });
  }

  // Modal handlers
  function setupModalHandlers() {
    // Create Community Form
    const createCommunityForm = document.getElementById("createCommunityForm");
    if (createCommunityForm) {
      createCommunityForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const communityData = {
          name: document.getElementById("communityName").value,
          description: document.getElementById("communityDescription").value,
          category: document.getElementById("communityCategory").value,
          isPublic: document.getElementById("isPublic").checked,
        };

        // Simulate API call
        showToast("Community created successfully!", "success");
        bootstrap.Modal.getInstance(
          document.getElementById("createCommunityModal")
        ).hide();
        this.reset();
        loadDashboardData(); // Refresh data
      });
    }

    // Create Event Form
    const createEventForm = document.getElementById("createEventForm");
    if (createEventForm) {
      createEventForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const eventData = {
          title: document.getElementById("eventTitle").value,
          description: document.getElementById("eventDescription").value,
          date: document.getElementById("eventDate").value,
          time: document.getElementById("eventTime").value,
          location: document.getElementById("eventLocation").value,
          type: document.getElementById("eventType").value,
        };

        // Save to localStorage
        const events =
          JSON.parse(localStorage.getItem("communityEvents")) || [];
        eventData.id =
          events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
        eventData.attendees = 0;
        eventData.createdBy = "Student User";
        eventData.createdAt = new Date().toISOString();

        events.push(eventData);
        localStorage.setItem("communityEvents", JSON.stringify(events));

        showToast("Event created successfully!", "success");
        bootstrap.Modal.getInstance(
          document.getElementById("createEventModal")
        ).hide();
        this.reset();
        loadDashboardData(); // Refresh data
      });
    }

    // Start Discussion Form
    const startDiscussionForm = document.getElementById("startDiscussionForm");
    if (startDiscussionForm) {
      startDiscussionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const discussionData = {
          title: document.getElementById("discussionTitle").value,
          content: document.getElementById("discussionContent").value,
          category: document.getElementById("discussionCategory").value,
          tags: document
            .getElementById("discussionTags")
            .value.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        };

        // Save to localStorage
        const discussions =
          JSON.parse(localStorage.getItem("communityDiscussions")) || [];
        discussionData.id =
          discussions.length > 0
            ? Math.max(...discussions.map((d) => d.id)) + 1
            : 1;
        discussionData.author = "Student User";
        discussionData.createdAt = new Date().toISOString();
        discussionData.replies = 0;
        discussionData.views = 0;
        discussionData.likes = 0;

        discussions.push(discussionData);
        localStorage.setItem(
          "communityDiscussions",
          JSON.stringify(discussions)
        );

        showToast("Discussion started successfully!", "success");
        bootstrap.Modal.getInstance(
          document.getElementById("startDiscussionModal")
        ).hide();
        this.reset();
        loadDashboardData(); // Refresh data
      });
    }

    // Join Community Search
    const searchCommunity = document.getElementById("searchCommunity");
    if (searchCommunity) {
      searchCommunity.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const results = document.getElementById("communitySearchResults");

        if (query.length > 2) {
          // Simulate search results
          const mockResults = [
            {
              name: "Computer Science Club",
              members: 142,
              category: "Technical",
            },
            { name: "Math Study Group", members: 98, category: "Academic" },
            { name: "Art & Design Society", members: 76, category: "Cultural" },
          ].filter((community) => community.name.toLowerCase().includes(query));

          if (mockResults.length > 0) {
            results.innerHTML = mockResults
              .map(
                (community) => `
                            <div class="search-result-item">
                                <div>
                                    <strong>${community.name}</strong>
                                    <br><small class="text-muted">${community.category} • ${community.members} members</small>
                                </div>
                                <button class="btn btn-sm btn-purple" onclick="joinCommunity('${community.name}')">Join</button>
                            </div>
                        `
              )
              .join("");
          } else {
            results.innerHTML =
              '<div class="empty-state"><i class="fas fa-search"></i><p>No communities found</p></div>';
          }
        } else {
          results.innerHTML =
            '<div class="empty-state"><i class="fas fa-search"></i><p>Start typing to search for communities...</p></div>';
        }
      });
    }
  }

  // Notifications system
  function setupNotifications() {
    const notificationItems = document.querySelectorAll(".notification-item");
    const notificationBadge = document.getElementById("notificationCount");

    if (!notificationItems.length || !notificationBadge) return;

    notificationItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const notificationId = this.getAttribute("data-id");

        // Mark as read (in a real app, this would call an API)
        this.style.opacity = "0.6";
        this.classList.add("text-muted");

        // Update badge count
        let currentCount = parseInt(notificationBadge.textContent);
        if (currentCount > 0) {
          currentCount--;
          notificationBadge.textContent = currentCount;

          // Hide badge if no notifications
          if (currentCount === 0) {
            notificationBadge.style.display = "none";
          }
        }
      });
    });
  }

  // Utility functions
  window.navigateToSection = function (sectionId) {
    const navLinks = document.querySelectorAll(
      "#sidebar .nav-link[data-section]"
    );
    navLinks.forEach((link) => {
      if (link.getAttribute("data-section") === sectionId) {
        link.click();
      }
    });
  };

  window.showToast = function (message, type = "info") {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    const toastId = "toast-" + Date.now();

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

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

    // Remove toast from DOM after it's hidden
    toast.addEventListener("hidden.bs.toast", function () {
      toast.remove();
    });
  };

  // Refresh data function
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      loadDashboardData();
      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML = '<span class="spinner me-1"></span> Refreshing...';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
        showToast("Data refreshed successfully!", "success");
      }, 1000);
    });
  }
})();

window.reloadPage = function () {
  window.location.reload();
};
