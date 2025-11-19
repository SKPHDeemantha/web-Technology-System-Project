// Communities/Courses Management Functions
function initCommunitiesTable() {
  const communities = JSON.parse(localStorage.getItem('adminCommunities')) || [
    { id: 1, name: 'Math Study Group', description: 'For math enthusiasts to study together', members: 45 },
    { id: 2, name: 'CS Project Team', description: 'Computer science projects collaboration', members: 32 },
    { id: 3, name: 'Art Lovers', description: 'Community for creative minds', members: 28 },
    { id: 4, name: 'Business Club', description: 'Networking and business discussions', members: 51 },
  ];

  localStorage.setItem('adminCommunities', JSON.stringify(communities));
  renderCommunitiesTable();
}

// Note: initCoursesTable is an alias for initCommunitiesTable for backward compatibility
function initCoursesTable() {
  initCommunitiesTable();
}

function renderCommunitiesTable() {
  const communities = JSON.parse(localStorage.getItem('adminCommunities')) || [];
  const tbody = document.getElementById('communityTableBody');

  tbody.innerHTML = '';

  communities.forEach(community => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${community.name}</td>
      <td>${community.description}</td>
      <td>${community.members}</td>
      <td>
        <button class="btn btn-sm btn-outline-purple me-1">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteCommunity(${community.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Global function for delete operations
window.deleteCommunity = function (id) {
  if (confirm('Are you sure you want to delete this community?')) {
    const communities = JSON.parse(localStorage.getItem('adminCommunities')) || [];
    const updatedCommunities = communities.filter(community => community.id !== id);
    localStorage.setItem('adminCommunities', JSON.stringify(updatedCommunities));

    renderCommunitiesTable();
    updateDashboardStats();
    addToActivityLog('Deleted a community');

    showAlert('Community deleted successfully!', 'success');
  }
};