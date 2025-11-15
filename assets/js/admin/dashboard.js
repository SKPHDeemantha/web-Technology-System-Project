// Dashboard Functions
function initDashboard() {
  loadDashboardData();
  renderStats();
  renderActivityChart();
  renderRecentUsers();
  renderRecentActivity();

  // Add event listeners
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshData);
  }

  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
  }
}

function loadDashboardData() {
  // Load or initialize dashboard data in localStorage
  if (!localStorage.getItem('dashboardStats')) {
    const defaultStats = {
      totalUsers: 1248,
      totalCommunities: 42,
      totalEvents: 18,
      activeLogs: 327,
      userGrowth: 4.3,
      communityGrowth: 2.1,
      eventGrowth: 0.0,
      logGrowth: 8.7
    };
    localStorage.setItem('dashboardStats', JSON.stringify(defaultStats));
  }

  if (!localStorage.getItem('recentUsers')) {
    const defaultUsers = [
      { name: 'John Doe', role: 'Student', status: 'Active' },
      { name: 'Jane Smith', role: 'Lecturer', status: 'Active' },
      { name: 'Robert Johnson', role: 'Student', status: 'Pending' }
    ];
    localStorage.setItem('recentUsers', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('recentActivity')) {
    const defaultActivity = [
      { type: 'user', title: 'New User Registration', description: 'John Doe joined as Student', time: '2 hours ago', marker: 'bg-success' },
      { type: 'community', title: 'Community Created', description: 'Computer Science Club created by Admin', time: '4 hours ago', marker: 'bg-primary' },
      { type: 'event', title: 'Event Scheduled', description: 'Tech Conference scheduled for Oct 15', time: '1 day ago', marker: 'bg-warning' },
      { type: 'system', title: 'System Update', description: 'Admin panel updated to version 2.1', time: '2 days ago', marker: 'bg-info' }
    ];
    localStorage.setItem('recentActivity', JSON.stringify(defaultActivity));
  }

  if (!localStorage.getItem('activityChartData')) {
    const defaultChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'User Activity',
          data: [65, 78, 66, 74, 58, 80, 67],
          borderColor: '#6a11cb',
          backgroundColor: 'rgba(106, 17, 203, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Community Activity',
          data: [28, 40, 35, 50, 46, 55, 60],
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
    localStorage.setItem('activityChartData', JSON.stringify(defaultChartData));
  }
}

function renderStats() {
  const stats = JSON.parse(localStorage.getItem('dashboardStats'));

  document.getElementById('totalUsers').textContent = stats.totalUsers.toLocaleString();
  document.getElementById('totalCommunities').textContent = stats.totalCommunities;
  document.getElementById('totalEvents').textContent = stats.totalEvents;
  document.getElementById('activeLogs').textContent = stats.activeLogs;

  // Update growth indicators
  updateGrowthIndicator('totalUsers', stats.userGrowth, 'success');
  updateGrowthIndicator('totalCommunities', stats.communityGrowth, 'success');
  updateGrowthIndicator('totalEvents', stats.eventGrowth, 'warning');
  updateGrowthIndicator('activeLogs', stats.logGrowth, 'danger');
}

function updateGrowthIndicator(statId, growth, type) {
  const container = document.getElementById(statId).closest('.card-body').querySelector('.mt-3');
  const icon = growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
  const colorClass = type === 'success' ? 'text-success' : type === 'danger' ? 'text-danger' : 'text-warning';

  container.className = `mt-3 mb-0 ${colorClass}`;
  container.innerHTML = `
    <span class="me-2"><i class="fas ${icon}"></i> ${Math.abs(growth)}%</span>
    <span class="text-nowrap">Since last month</span>
  `;
}

function renderActivityChart() {
  const canvas = document.getElementById('activityChart');
  if (!canvas) return;

  // Destroy existing chart if it exists
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  // Ensure Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  const chartData = JSON.parse(localStorage.getItem('activityChartData'));
  const ctx = canvas.getContext('2d');

  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderRecentUsers() {
  const users = JSON.parse(localStorage.getItem('recentUsers'));
  const tbody = document.querySelector('#dashboard-content .table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  users.forEach(user => {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const statusClass = user.status === 'Active' ? 'bg-success' : 'bg-warning';

    const tr = document.createElement('tr');
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
      <td><span class="badge ${statusClass}">${user.status}</span></td>
    `;

    tbody.appendChild(tr);
  });
}

function renderRecentActivity() {
  const activities = JSON.parse(localStorage.getItem('recentActivity'));
  const timeline = document.querySelector('.activity-timeline');
  if (!timeline) return;

  timeline.innerHTML = '';

  activities.forEach(activity => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-marker ${activity.marker}"></div>
      <div class="activity-content">
        <h6>${activity.title}</h6>
        <p>${activity.description}</p>
        <small class="text-muted">${activity.time}</small>
      </div>
    `;

    timeline.appendChild(item);
  });
}

function refreshData() {
  // Simulate data refresh
  const refreshBtn = document.getElementById('refreshBtn');
  const originalText = refreshBtn.innerHTML;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
  refreshBtn.disabled = true;

  // Simulate API call delay
  setTimeout(() => {
    // Update stats with slight changes
    const stats = JSON.parse(localStorage.getItem('dashboardStats'));
    stats.totalUsers += Math.floor(Math.random() * 10) - 5;
    stats.totalCommunities += Math.floor(Math.random() * 5) - 2;
    stats.totalEvents += Math.floor(Math.random() * 3) - 1;
    stats.activeLogs += Math.floor(Math.random() * 20) - 10;

    localStorage.setItem('dashboardStats', JSON.stringify(stats));

    // Update chart data
    const chartData = JSON.parse(localStorage.getItem('activityChartData'));
    chartData.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(val => val + Math.floor(Math.random() * 10) - 5);
    });
    localStorage.setItem('activityChartData', JSON.stringify(chartData));

    // Re-render dashboard
    renderStats();
    renderActivityChart();

    refreshBtn.innerHTML = originalText;
    refreshBtn.disabled = false;

    showAlert('Dashboard data refreshed successfully!', 'success');
  }, 1500);
}

function exportData() {
  const data = {
    stats: JSON.parse(localStorage.getItem('dashboardStats')),
    users: JSON.parse(localStorage.getItem('adminUsers')) || [],
    communities: JSON.parse(localStorage.getItem('communities')) || [],
    events: JSON.parse(localStorage.getItem('events')) || [],
    activity: JSON.parse(localStorage.getItem('activityLogs')) || []
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `admin-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showAlert('Data exported successfully!', 'success');
}

// Utility function to update dashboard stats (called from other modules)
function updateDashboardStats() {
  const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
  const communities = JSON.parse(localStorage.getItem('communities')) || [];
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || [];

  const stats = {
    totalUsers: users.length,
    totalCommunities: communities.length,
    totalEvents: events.length,
    activeLogs: logs.length,
    userGrowth: 4.3, // Mock growth values
    communityGrowth: 2.1,
    eventGrowth: 0.0,
    logGrowth: 8.7
  };

  localStorage.setItem('dashboardStats', JSON.stringify(stats));
  renderStats();
}

// Make updateDashboardStats globally available
window.updateDashboardStats = updateDashboardStats;
