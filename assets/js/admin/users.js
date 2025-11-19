// User Management Functions

// Global variables for pagination
let currentPage = 1;
const itemsPerPage = 5;

// Global fetchXML function
function fetchXML(url) {
  return $.ajax({ url, async: false }).responseXML;
}

function initUsersTable() {

  const userDataXML = fetchXML('adminxml.php?request=getUserData');

  const rowNos     = userDataXML.getElementsByTagName("rowNo");
  const userIds    = userDataXML.getElementsByTagName("userId");
  const fullNames  = userDataXML.getElementsByTagName("fullName");
  const roles      = userDataXML.getElementsByTagName("role");
  const emails     = userDataXML.getElementsByTagName("email");
  const statuses   = userDataXML.getElementsByTagName("status");

  // --- Convert numeric role to readable text ---
  function convertRole(r) {
    switch (r) {
      case "1": return "Student";
      case "2": return "Lecturer";
      case "3": return "Admin";
      default: return "Unknown";
    }
  }

  // --- Build JS array from XML ---
  const userList = [];

  for (let i = 0; i < rowNos.length; i++) {
    userList.push({
      id: userIds[i].textContent,
      name: fullNames[i].textContent,
      role: convertRole(roles[i].textContent),
      email: emails[i].textContent,
      status: statuses[i].textContent == "1" ? "Active" : "Inactive"
    });
  }

  // --- Save to localStorage ---
  localStorage.setItem("adminUsers", JSON.stringify(userList));

  // --- Render table initially ---
  renderUsersTable();

  // --- Add filter functionality ---
  const userFilter = document.getElementById('userFilter');
  if (userFilter) {
    userFilter.addEventListener('change', function () {
      currentPage = 1; // Reset to first page when filter changes
      renderUsersTable(this.value, currentPage, $('#userSearch').val() || '');
    });
  }

  // --- Add search functionality ---
  const userSearch = document.getElementById('userSearch');
  if (userSearch) {
    userSearch.addEventListener('input', function () {
      currentPage = 1; // Reset to first page when searching
      renderUsersTable($('#userFilter').val(), currentPage, this.value);
    });
  }
}


function renderUsersTable(filter = 'all', page = currentPage, searchTerm = '') {
  const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
  const tbody = document.getElementById('userTableBody');

  tbody.innerHTML = '';

  let filteredUsers = filter === 'all' ? users : users.filter(user => user.role === filter);

  // Apply search filter
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Calculate pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToShow = filteredUsers.slice(startIndex, endIndex);

  usersToShow.forEach(user => {
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
        <button class="btn btn-sm btn-outline-purple me-1" onclick="editUser('${user.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Render pagination
  renderPagination(totalPages, page);
}

// Global function for delete operations
window.deleteUser = function (id) {
  if (confirm('Are you sure you want to delete this user?')) {
    const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
    const updatedUsers = users.filter(user => user.id !== id);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));

    deleteUserHandler(id);

    renderUsersTable(document.getElementById('userFilter').value, currentPage, $('#userSearch').val() || '');
    updateDashboardStats();
    addToActivityLog('Deleted a user');

    showAlert('User deleted successfully!', 'success');

    // Adjust currentPage if necessary after deletion
    const allUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
    const filteredUsers = document.getElementById('userFilter').value === 'all' ? allUsers : allUsers.filter(user => user.role === document.getElementById('userFilter').value);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages || 1;
    }
  }
};

//edit user function

window.editUser = function(id) {
  const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
  const user = users.find(u => u.id === id);

  const userDataXML = fetchXML('adminxml.php?request=getUserDataForEdit&userId=' + id);

  const fullName = userDataXML.getElementsByTagName("fullName")[0].textContent;
  const email = userDataXML.getElementsByTagName("email")[0].textContent;
  const role = userDataXML.getElementsByTagName("role")[0].textContent;
  const status = userDataXML.getElementsByTagName("status")[0].textContent;

  function mapRole(num) {
    switch (num) {
      case "1": return "Student";
      case "2": return "Lecturer";
      case "3": return "Admin";
      default: return "Unknown";
    }
  }

  if (fullName.length > 0 && email.length > 0 && role.length > 0) {
    $('#editUserId').val(id);
    $('#editUserName').val(fullName);
    $('#editUserEmail').val(email);
    $('#editUserStatus').val(status);
    $('#editUserRole').val(mapRole(role));
    $('#editUserModal').modal('show');
  } else {
    alert('Error loading user data for editing.');
  }

};

/* ============================================================
   AJAX: DELETE USER
   ============================================================ */
function deleteUserHandler(user_id) {
  $.ajax({
    url: "../fileHandling/adminNewUser.php?id=delete",
    type: "POST",
    data: {user_id},

    success: function (response) {
      if (response == 1) {

        alert("User deleted successfully!");

        renderUsersTable($("#userFilter").val(), currentPage, $('#userSearch').val() || ''); // Refresh table
        updateDashboardStats();
        loadDashboardData();

      } else {
        alert("Error deleting user!");
      }
    },
    error: function () {
      alert("AJAX Error!");
    }
  });
}

// Function to render pagination
function renderPagination(totalPages, currentPage) {
  const paginationContainer = $('.pagination');
  if (!paginationContainer.length) return;

  paginationContainer.html('');

  // Previous button
  const prevLi = $('<li>', {
    class: `page-item ${currentPage === 1 ? 'disabled' : ''}`
  });
  const prevA = $('<a>', {
    class: 'page-link',
    href: '#',
    tabindex: '-1',
    text: 'Previous'
  });
  prevLi.append(prevA);
  paginationContainer.append(prevLi);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = $('<li>', {
      class: `page-item ${i === currentPage ? 'active' : ''}`
    });
    const pageA = $('<a>', {
      class: 'page-link',
      href: '#',
      text: i
    });
    pageLi.append(pageA);
    paginationContainer.append(pageLi);
  }

  // Next button
  const nextLi = $('<li>', {
    class: `page-item ${currentPage === totalPages ? 'disabled' : ''}`
  });
  const nextA = $('<a>', {
    class: 'page-link',
    href: '#',
    text: 'Next'
  });
  nextLi.append(nextA);
  paginationContainer.append(nextLi);

  // Attach click events directly to the newly created pagination links
  paginationContainer.find('.page-link').on('click', function(e) {
    e.preventDefault();
    const text = $(this).text();
    const searchTerm = $('#userSearch').val() || '';
    if (text === 'Previous') {
      if (currentPage > 1) {
        currentPage--;
        renderUsersTable($('#userFilter').val(), currentPage, searchTerm);
      }
    } else if (text === 'Next') {
      if (currentPage < totalPages) {
        currentPage++;
        renderUsersTable($('#userFilter').val(), currentPage, searchTerm);
      }
    } else {
      const pageNum = parseInt(text);
      if (!isNaN(pageNum) && pageNum !== currentPage && pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        renderUsersTable($('#userFilter').val(), currentPage, searchTerm);
      }
    }
  });
}

// Initialize the users table when the document is ready
$(document).ready(function() {
  initUsersTable();
});
