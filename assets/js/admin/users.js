// User Management Functions
function initUsersTable() {
  const users = JSON.parse(localStorage.getItem('adminUsers')) || [
    { id: 1, name: 'John Doe', role: 'Student', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Lecturer', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Admin User', role: 'Admin', email: 'admin@example.com', status: 'Active' },
    { id: 4, name: 'Chris Brown', role: 'Student', email: 'chris@example.com', status: 'Pending' },
    { id: 5, name: 'Maria Garcia', role: 'Student', email: 'maria@example.com', status: 'Active' },
  ];

  localStorage.setItem('adminUsers', JSON.stringify(users));
  renderUsersTable();

  // User filter functionality
  const userFilter = document.getElementById('userFilter');
  if (userFilter) {
    userFilter.addEventListener('change', function() {
      renderUsersTable(this.value);
    });
  }
}

function renderUsersTable(filter = 'all') {
  const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
  const tbody = document.getElementById('userTableBody');

  tbody.innerHTML = '';

  const filteredUsers = filter === 'all' ? users : users.filter(user => user.role === filter);

  filteredUsers.forEach(user => {
    const tr = document.createElement('tr');

    // Generate avatar initials
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

    tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <div class="avatar-sm bg-purple text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
            ${initials}
          </div>
          <div>${user.name}</div>
        </div>
      </td>
      <td>${user.role}</td>
      <td>${user.email}</td>
      <td>
        <span class="badge ${user.status === 'Active' ? 'bg-success' : 'bg-warning'}">
          ${user.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-purple me-1" onclick="editUser(${user.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Global function for delete operations
window.deleteUser = function(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
    const updatedUsers = users.filter(user => user.id !== id);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));

    renderUsersTable(document.getElementById('userFilter').value);
    updateDashboardStats();
    addToActivityLog('Deleted a user');

    showAlert('User deleted successfully!', 'success');
  }
};
