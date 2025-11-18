// Announcement Management Functions
function initAnnouncementsTable() {
  const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [
    {
      id: 1,
      title: 'Welcome to the New Semester',
      content: 'We are excited to welcome all students back for the new semester. Please check your course schedules and be prepared for the first day of classes.',
      target: 'all',
      priority: 'normal',
      publishDate: '2024-01-15T09:00',
      expiryDate: '2024-02-15T23:59',
      status: 'active',
      author: 'Admin',
      createdAt: '2024-01-10T10:00:00'
    },
    {
      id: 2,
      title: 'Library Hours Extended',
      content: 'Due to increased demand, the main library will now be open until 10 PM on weekdays starting next week.',
      target: 'students',
      priority: 'normal',
      publishDate: '2024-01-20T14:00',
      expiryDate: null,
      status: 'scheduled',
      author: 'Admin',
      createdAt: '2024-01-12T11:30:00'
    }
  ];

  localStorage.setItem('adminAnnouncements', JSON.stringify(announcements));
  renderAnnouncementsTable();
  updateAnnouncementStats();
}

function renderAnnouncementsTable(filter = 'all') {
  const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];
  const tbody = document.getElementById('announcementsTableBody');
  const searchTerm = document.getElementById('announcementSearch')?.value.toLowerCase() || '';

  tbody.innerHTML = '';

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesFilter = filter === 'all' || announcement.status === filter;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm) ||
      announcement.content.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  filteredAnnouncements.forEach(announcement => {
    const tr = document.createElement('tr');

    // Format dates
    const publishDate = new Date(announcement.publishDate);
    const formattedDate = publishDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Status badge
    const statusBadge = getStatusBadge(announcement.status);
    const targetDisplay = getTargetDisplay(announcement.target);

    tr.innerHTML = `
      <td>
        <div>
          <strong>${announcement.title}</strong>
          ${announcement.priority !== 'normal' ? `<span class="badge bg-${announcement.priority === 'urgent' ? 'danger' : 'warning'} ms-2">${announcement.priority}</span>` : ''}
        </div>
      </td>
      <td>${targetDisplay}</td>
      <td>${statusBadge}</td>
      <td>${formattedDate}</td>
      <td>
        <button class="btn btn-sm btn-outline-purple me-1" onclick="editAnnouncement(${announcement.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger me-1" onclick="deleteAnnouncement(${announcement.id})">
          <i class="fas fa-trash"></i>
        </button>
        <button class="btn btn-sm btn-outline-info" onclick="viewAnnouncement(${announcement.id})">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function getStatusBadge(status) {
  const badges = {
    active: '<span class="badge bg-success">Active</span>',
    scheduled: '<span class="badge bg-warning">Scheduled</span>',
    expired: '<span class="badge bg-secondary">Expired</span>',
    draft: '<span class="badge bg-light text-dark">Draft</span>'
  };
  return badges[status] || badges.draft;
}

function getTargetDisplay(target) {
  const targets = {
    all: 'All Users',
    students: 'Students Only',
    lecturers: 'Lecturers Only',
    '1st Year': '1st Year Students',
    '2nd Year': '2nd Year Students',
    '3rd Year': '3rd Year Students',
    '4th Year': '4th Year Students'
  };
  return targets[target] || target;
}

// Global function for delete operations
window.deleteAnnouncement = function (id) {
  if (confirm('Are you sure you want to delete this announcement?')) {
    const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    localStorage.setItem('adminAnnouncements', JSON.stringify(updatedAnnouncements));

    renderAnnouncementsTable(document.getElementById('announcementFilter').value);
    updateAnnouncementStats();
    addToActivityLog('Deleted an announcement');

    showAlert('Announcement deleted successfully!', 'success');
  }
};

// Global function for edit operations
window.editAnnouncement = function (id) {
  const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];
  const announcement = announcements.find(a => a.id === id);

  if (announcement) {
    // Populate edit modal with announcement data
    document.getElementById('editAnnouncementId').value = announcement.id;
    document.getElementById('editAnnouncementTitle').value = announcement.title;
    document.getElementById('editAnnouncementContent').value = announcement.content;
    document.getElementById('editAnnouncementTarget').value = announcement.target;
    document.getElementById('editAnnouncementPriority').value = announcement.priority;
    document.getElementById('editPublishDate').value = announcement.publishDate;
    document.getElementById('editExpiryDate').value = announcement.expiryDate || '';
    document.getElementById('editSendNotification').checked = false; // Reset checkbox

    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editAnnouncementModal'));
    editModal.show();
  }
};

// Global function for view operations
window.viewAnnouncement = function (id) {
  const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];
  const announcement = announcements.find(a => a.id === id);

  if (announcement) {
    // Create a simple view modal or alert with announcement details
    const content = `
      <strong>Title:</strong> ${announcement.title}<br><br>
      <strong>Content:</strong><br>${announcement.content.replace(/\n/g, '<br>')}<br><br>
      <strong>Target:</strong> ${getTargetDisplay(announcement.target)}<br>
      <strong>Priority:</strong> ${announcement.priority}<br>
      <strong>Status:</strong> ${announcement.status}<br>
      <strong>Published:</strong> ${new Date(announcement.publishDate).toLocaleString()}
    `;

    // Simple alert for now - could be enhanced with a proper modal
    alert(`Announcement Details:\n\n${content}`);
  }
};

function updateAnnouncementStats() {
  const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];

  const total = announcements.length;
  const active = announcements.filter(a => a.status === 'active').length;
  const scheduled = announcements.filter(a => a.status === 'scheduled').length;

  document.getElementById('totalAnnouncements').textContent = total;
  document.getElementById('activeAnnouncements').textContent = active;
  document.getElementById('scheduledAnnouncements').textContent = scheduled;
}

// Initialize announcements when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Handle add announcement form submission
  const addAnnouncementForm = document.getElementById('addAnnouncementForm');
  if (addAnnouncementForm) {
    addAnnouncementForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const announcementData = {
        id: Date.now(),
        title: document.getElementById('announcementTitle').value,
        content: document.getElementById('announcementContent').value,
        target: document.getElementById('announcementTarget').value,
        priority: document.getElementById('announcementPriority').value,
        publishDate: document.getElementById('publishDate').value,
        expiryDate: document.getElementById('expiryDate').value || null,
        status: new Date(document.getElementById('publishDate').value) > new Date() ? 'scheduled' : 'active',
        author: 'Admin',
        createdAt: new Date().toISOString()
      };

      const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];
      announcements.push(announcementData);
      localStorage.setItem('adminAnnouncements', JSON.stringify(announcements));

      // Add to activity log
      addToActivityLog(`Created announcement: ${announcementData.title}`);

      // Update UI
      renderAnnouncementsTable(document.getElementById('announcementFilter').value);
      updateAnnouncementStats();

      // Close modal and reset form
      bootstrap.Modal.getInstance(document.getElementById('addAnnouncementModal')).hide();
      this.reset();

      // Show success message
      showAlert('Announcement created successfully!', 'success');
    });
  }

  // Handle edit announcement form submission
  const editAnnouncementForm = document.getElementById('editAnnouncementForm');
  if (editAnnouncementForm) {
    editAnnouncementForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const announcementId = parseInt(document.getElementById('editAnnouncementId').value);
      const updatedAnnouncement = {
        id: announcementId,
        title: document.getElementById('editAnnouncementTitle').value,
        content: document.getElementById('editAnnouncementContent').value,
        target: document.getElementById('editAnnouncementTarget').value,
        priority: document.getElementById('editAnnouncementPriority').value,
        publishDate: document.getElementById('editPublishDate').value,
        expiryDate: document.getElementById('editExpiryDate').value || null,
        status: new Date(document.getElementById('editPublishDate').value) > new Date() ? 'scheduled' : 'active',
        author: 'Admin',
        createdAt: new Date().toISOString() // Update timestamp
      };

      const announcements = JSON.parse(localStorage.getItem('adminAnnouncements')) || [];
      const index = announcements.findIndex(a => a.id === announcementId);
      if (index !== -1) {
        announcements[index] = updatedAnnouncement;
        localStorage.setItem('adminAnnouncements', JSON.stringify(announcements));

        // Add to activity log
        addToActivityLog(`Updated announcement: ${updatedAnnouncement.title}`);

        // Update UI
        renderAnnouncementsTable(document.getElementById('announcementFilter').value);
        updateAnnouncementStats();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('editAnnouncementModal')).hide();

        // Show success message
        showAlert('Announcement updated successfully!', 'success');
      }
    });
  }

  // Handle filter changes
  const announcementFilter = document.getElementById('announcementFilter');
  if (announcementFilter) {
    announcementFilter.addEventListener('change', function () {
      renderAnnouncementsTable(this.value);
    });
  }

  // Handle search
  const announcementSearch = document.getElementById('announcementSearch');
  if (announcementSearch) {
    announcementSearch.addEventListener('input', function () {
      renderAnnouncementsTable(document.getElementById('announcementFilter').value);
    });
  }

  // Initialize announcements table
  initAnnouncementsTable();
});
