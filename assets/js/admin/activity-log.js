// Activity Logs Management Functions
function initActivityLogs() {
  // Check if DOM elements exist before proceeding
  if (!document.getElementById('logsTableBody') || !document.getElementById('logUserFilter')) {
    console.warn('Activity log DOM elements not found, retrying...');
    setTimeout(initActivityLogs, 200);
    return;
  }

  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [
    { user: 'John Doe', role: 'Student', action: 'Registered for course CS101', time: '2023-10-15 09:30:15' },
    { user: 'Admin User', role: 'Admin', action: 'Created new community "Math Study Group"', time: '2023-10-14 14:22:45' },
    { user: 'Jane Smith', role: 'Lecturer', action: 'Uploaded new lecture materials', time: '2023-10-14 11:05:33' },
    { user: 'Chris Brown', role: 'Student', action: 'Joined community "CS Project Team"', time: '2023-10-13 16:45:12' },
    { user: 'Admin User', role: 'Admin', action: 'Updated system settings', time: '2023-10-12 10:15:28' },
  ];

  localStorage.setItem('activityLogs', JSON.stringify(logs));
  renderActivityLogs();

  // Log filters functionality
  const logUserFilter = document.getElementById('logUserFilter');
  if (logUserFilter) {
    logUserFilter.addEventListener('change', renderActivityLogs);
  }
  const logRoleFilter = document.getElementById('logRoleFilter');
  if (logRoleFilter) {
    logRoleFilter.addEventListener('change', renderActivityLogs);
  }
  const logActionFilter = document.getElementById('logActionFilter');
  if (logActionFilter) {
    logActionFilter.addEventListener('change', renderActivityLogs);
  }
  const logDateFilter = document.getElementById('logDateFilter');
  if (logDateFilter) {
    logDateFilter.addEventListener('change', renderActivityLogs);
  }
}

function renderActivityLogs() {
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  const tbody = document.getElementById('logsTableBody');
  const userFilter = document.getElementById('logUserFilter').value;
  const roleFilter = document.getElementById('logRoleFilter').value;
  const actionFilter = document.getElementById('logActionFilter').value;
  const dateFilter = document.getElementById('logDateFilter').value;

  tbody.innerHTML = '';

  const filteredLogs = logs.filter(log => {
    if (userFilter !== 'all' && log.user !== userFilter) return false;
    if (roleFilter !== 'all' && log.role !== roleFilter) return false;
    if (actionFilter !== 'all' && !log.action.includes(actionFilter)) return false;
    if (dateFilter && !log.time.startsWith(dateFilter)) return false;
    return true;
  });

  filteredLogs.forEach(log => {
    const tr = document.createElement('tr');

    // Format time
    const logTime = new Date(log.time.replace(' ', 'T'));
    const formattedTime = logTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    tr.innerHTML = `
      <td>${log.user}</td>
      <td>${log.role}</td>
      <td>${log.action}</td>
      <td>${formattedTime}</td>
    `;

    tbody.appendChild(tr);
  });

  // Update filter options
  updateLogFilters(logs);
}

function updateLogFilters(logs) {
  const userFilter = document.getElementById('logUserFilter');
  const actionFilter = document.getElementById('logActionFilter');

  // Get unique users and actions
  const uniqueUsers = [...new Set(logs.map(log => log.user))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  // Update user filter
  userFilter.innerHTML = '<option value="all">All Users</option>';
  uniqueUsers.forEach(user => {
    userFilter.innerHTML += `<option value="${user}">${user}</option>`;
  });

  // Update action filter
  actionFilter.innerHTML = '<option value="all">All Actions</option>';
  uniqueActions.forEach(action => {
    // Extract the main action (first few words)
    const mainAction = action.split(' ').slice(0, 3).join(' ');
    actionFilter.innerHTML += `<option value="${mainAction}">${mainAction}</option>`;
  });
}

// Export logs functionality
document.addEventListener('DOMContentLoaded', function() {
  const exportLogsBtn = document.getElementById('exportLogsBtn');
  if (exportLogsBtn) {
    exportLogsBtn.addEventListener('click', function() {
      const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];

      if (logs.length === 0) {
        showAlert('No logs to export', 'warning');
        return;
      }

      // Convert to CSV
      const headers = ['User', 'Role', 'Action', 'Time'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [log.user, log.role, `"${log.action}"`, log.time].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Add to activity log
      addToActivityLog('Exported activity logs');

      // Show success message
      showAlert('Logs exported successfully!', 'success');
    });
  }
});
