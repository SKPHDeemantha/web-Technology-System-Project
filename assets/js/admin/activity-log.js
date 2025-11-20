// Activity Logs Management Functions
var activityLogs = [];

function initActivityLogs() {
  // Check if DOM elements exist before proceeding
  if (!document.getElementById('logsTableBody') || !document.getElementById('logUserFilter')) {
    console.warn('Activity log DOM elements not found, retrying...');
    setTimeout(initActivityLogs, 200);
    return;
  }

  // Show loading state
  const tbody = document.getElementById('logsTableBody');
  tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Loading activity logs...</td></tr>';

  console.log('Fetching activity logs...');
  
  // Fetch logs from database
  fetch('../fileHandling/activitylogfetch.php')
  .then(response => {
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.text().then(text => {
      console.log('Raw response length:', text.length);
      
      if (!text.trim()) {
        throw new Error('Server returned empty response');
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Problematic response:', text);
        throw new Error('Server returned invalid JSON. Check PHP for errors.');
      }
    });
  })
  .then(data => {
    console.log('Parsed data:', data);
    
    if (data && data.error) {
      throw new Error(data.error);
    }
    
    activityLogs = Array.isArray(data) ? data : [];
    console.log('Loaded', activityLogs.length, 'activity logs');
    
    // Update filters FIRST, then render
    updateLogFilters(activityLogs);
    renderActivityLogs();
    
    // Setup event listeners AFTER data is loaded
    setupExportButton();
    setupClearFiltersButton();
  })
  .catch(error => {
    console.error('Error loading activity logs:', error);
    
    // Show error in table
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #d32f2f;">
          Error loading activity logs: ${error.message}
        </td>
      </tr>
    `;
    
    showAlert('Error: ' + error.message, 'error');
  });

  // Setup filter event listeners
  setupFilterListeners();
}

function setupFilterListeners() {
  const logUserFilter = document.getElementById('logUserFilter');
  const logRoleFilter = document.getElementById('logRoleFilter');
  const logActionFilter = document.getElementById('logActionFilter');
  const logDateFilter = document.getElementById('logDateFilter');

  if (logUserFilter) logUserFilter.addEventListener('change', renderActivityLogs);
  if (logRoleFilter) logRoleFilter.addEventListener('change', renderActivityLogs);
  if (logActionFilter) logActionFilter.addEventListener('change', renderActivityLogs);
  if (logDateFilter) logDateFilter.addEventListener('change', renderActivityLogs);
}

function setupExportButton() {
  const exportLogsBtn = document.getElementById('exportLogsBtn');
  if (exportLogsBtn) {
    // Remove any existing event listeners to prevent duplicates
    exportLogsBtn.replaceWith(exportLogsBtn.cloneNode(true));
    const newExportBtn = document.getElementById('exportLogsBtn');
    
    newExportBtn.addEventListener('click', function() {
      console.log('Export button clicked');
      
      if (!activityLogs || activityLogs.length === 0) {
        showAlert('No logs to export', 'warning');
        return;
      }

      // Get current filter values to export filtered data
      const userFilter = document.getElementById('logUserFilter');
      const roleFilter = document.getElementById('logRoleFilter');
      const actionFilter = document.getElementById('logActionFilter');
      const dateFilter = document.getElementById('logDateFilter');

      const userFilterValue = userFilter ? userFilter.value : 'all';
      const roleFilterValue = roleFilter ? roleFilter.value : 'all';
      const actionFilterValue = actionFilter ? actionFilter.value : 'all';
      const dateFilterValue = dateFilter ? dateFilter.value : 'all';

      let logsToExport = activityLogs;

      // Apply same filters as display
      if (userFilterValue !== 'all' || roleFilterValue !== 'all' || actionFilterValue !== 'all' || dateFilterValue !== 'all') {
        logsToExport = activityLogs.filter(log => {
          if (userFilterValue !== 'all' && log.user !== userFilterValue) return false;
          if (roleFilterValue !== 'all' && log.role !== roleFilterValue) return false;
          if (actionFilterValue !== 'all' && (!log.action || log.action.toLowerCase().indexOf(actionFilterValue.toLowerCase()) === -1)) return false;
          if (dateFilterValue !== 'all' && log.created_at && !log.created_at.startsWith(dateFilterValue)) return false;
          return true;
        });
      }

      if (logsToExport.length === 0) {
        showAlert('No logs to export with current filters', 'warning');
        return;
      }

      console.log('Exporting', logsToExport.length, 'logs');

      // Convert to CSV - Use consistent date formatting
      const headers = ['User', 'Role', 'Action', 'Time'];
      const csvContent = [
        headers.join(','),
        ...logsToExport.map(log => {
          // Format date consistently for CSV (same as table display)
          const date = new Date(log.created_at);
          const formattedTime = date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          
          return [
            log.user || 'Unknown',
            log.role || 'Unknown',
            `"${(log.action || 'No action recorded').replace(/"/g, '""')}"`,
            `"${formattedTime}"`
          ].join(',');
        })
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      showAlert(`Exported ${logsToExport.length} logs successfully!`, 'success');
    });
  } else {
    console.warn('Export button not found');
  }
}

function setupClearFiltersButton() {
  const clearFiltersBtn = document.getElementById('clearLogFiltersBtn');
  if (clearFiltersBtn) {
    // Remove any existing event listeners to prevent duplicates
    clearFiltersBtn.replaceWith(clearFiltersBtn.cloneNode(true));
    const newClearBtn = document.getElementById('clearLogFiltersBtn');
    
    newClearBtn.addEventListener('click', clearLogFilters);
  }
}

function renderActivityLogs() {
  const tbody = document.getElementById('logsTableBody');
  const userFilter = document.getElementById('logUserFilter');
  const roleFilter = document.getElementById('logRoleFilter');
  const actionFilter = document.getElementById('logActionFilter');
  const dateFilter = document.getElementById('logDateFilter');

  // Get filter values
  const userFilterValue = userFilter ? userFilter.value : 'all';
  const roleFilterValue = roleFilter ? roleFilter.value : 'all';
  const actionFilterValue = actionFilter ? actionFilter.value : 'all';
  const dateFilterValue = dateFilter ? dateFilter.value : 'all';

  tbody.innerHTML = '';

  // If no logs available
  if (!activityLogs || activityLogs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No activity logs found</td></tr>';
    return;
  }

  const filteredLogs = activityLogs.filter(log => {
    // User filter
    if (userFilterValue !== 'all' && log.user !== userFilterValue) {
      return false;
    }
    
    // Role filter
    if (roleFilterValue !== 'all' && log.role !== roleFilterValue) {
      return false;
    }
    
    // Action filter - fixed logic
    if (actionFilterValue !== 'all') {
      // Check if the action contains the filter text (case insensitive)
      if (!log.action || log.action.toLowerCase().indexOf(actionFilterValue.toLowerCase()) === -1) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilterValue !== 'all' && log.created_at) {
      // Check if the created_at date starts with the selected date (YYYY-MM)
      if (!log.created_at.startsWith(dateFilterValue)) {
        return false;
      }
    }
    
    return true;
  });

  // Display filtered results or no results message
  if (filteredLogs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No logs match the selected filters</td></tr>';
  } else {
    filteredLogs.forEach(log => {
      const tr = document.createElement('tr');
      const formattedTime = new Date(log.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      tr.innerHTML = `
        <td>${log.user || 'Unknown'}</td>
        <td>${log.role || 'Unknown'}</td>
        <td>${log.action || 'No action recorded'}</td>
        <td>${formattedTime}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  // Update filter counts or show current results count
  console.log(`Displaying ${filteredLogs.length} of ${activityLogs.length} total logs`);
}

function updateLogFilters(logs) {
  const userFilter = document.getElementById('logUserFilter');
  const roleFilter = document.getElementById('logRoleFilter');
  const actionFilter = document.getElementById('logActionFilter');
  const dateFilter = document.getElementById('logDateFilter');

  if (!logs || logs.length === 0) return;

  // Get unique values for each filter
  const uniqueUsers = [...new Set(logs.map(log => log.user).filter(Boolean))].sort();
  const uniqueRoles = [...new Set(logs.map(log => log.role).filter(Boolean))].sort();
  const uniqueActions = [...new Set(logs.map(log => log.action).filter(Boolean))].sort();
  
  // Get unique dates (YYYY-MM format)
  const uniqueDates = [...new Set(logs.map(log => {
    if (log.created_at) {
      return log.created_at.substring(0, 7); // Get YYYY-MM
    }
    return null;
  }).filter(Boolean))].sort().reverse();

  // Update user filter - preserve current selection
  const currentUser = userFilter ? userFilter.value : 'all';
  if (userFilter) {
    userFilter.innerHTML = '<option value="all">All Users</option>';
    uniqueUsers.forEach(user => {
      const selected = user === currentUser ? 'selected' : '';
      userFilter.innerHTML += `<option value="${user}" ${selected}>${user}</option>`;
    });
  }

  // Update role filter - preserve current selection
  const currentRole = roleFilter ? roleFilter.value : 'all';
  if (roleFilter) {
    roleFilter.innerHTML = '<option value="all">All Roles</option>';
    uniqueRoles.forEach(role => {
      const selected = role === currentRole ? 'selected' : '';
      roleFilter.innerHTML += `<option value="${role}" ${selected}>${role}</option>`;
    });
  }

  // Update action filter - FIXED: Use full actions, not truncated
  const currentAction = actionFilter ? actionFilter.value : 'all';
  if (actionFilter) {
    actionFilter.innerHTML = '<option value="all">All Actions</option>';
    uniqueActions.forEach(action => {
      const selected = action === currentAction ? 'selected' : '';
      // Use the full action text, not truncated
      actionFilter.innerHTML += `<option value="${action}" ${selected}>${action}</option>`;
    });
  }

  // Update date filter - preserve current selection
  const currentDate = dateFilter ? dateFilter.value : 'all';
  if (dateFilter) {
    dateFilter.innerHTML = '<option value="all">All Dates</option>';
    uniqueDates.forEach(date => {
      const selected = date === currentDate ? 'selected' : '';
      const formattedDate = new Date(date + '-01').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
      dateFilter.innerHTML += `<option value="${date}" ${selected}>${formattedDate}</option>`;
    });
  }
}

// Clear all filters function
function clearLogFilters() {
  const userFilter = document.getElementById('logUserFilter');
  const roleFilter = document.getElementById('logRoleFilter');
  const actionFilter = document.getElementById('logActionFilter');
  const dateFilter = document.getElementById('logDateFilter');

  if (userFilter) userFilter.value = 'all';
  if (roleFilter) roleFilter.value = 'all';
  if (actionFilter) actionFilter.value = 'all';
  if (dateFilter) dateFilter.value = 'all';

  renderActivityLogs();
  showAlert('All filters cleared', 'success');
}

// Utility function to show alerts (if not already defined)
function showAlert(message, type = 'info') {
  // You can implement your own alert system or use an existing one
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // Simple alert implementation
  alert(`${type.toUpperCase()}: ${message}`);
}

// Initialize when the section loads
if (typeof initializeSection === 'undefined') {
  // If not using componentLoader, initialize directly when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('logsTableBody')) {
      initActivityLogs();
    }
  });
}