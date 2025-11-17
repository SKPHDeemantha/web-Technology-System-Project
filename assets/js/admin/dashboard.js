// ==============================
// DASHBOARD INITIALIZER
// ==============================
function initDashboard() {
  loadDashboardData();
  renderStats();
  renderActivityChart();
  renderRecentUsers();
  renderRecentActivity();

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshData);

  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportData);
}

window.loadDashboardData = loadDashboardData;


// ==============================
// LOAD ALL DATA FROM DATABASE
// ==============================
function loadDashboardData() {

  // Helper to perform XML AJAX
  function fetchXML(url) {
    return $.ajax({ url, async: false }).responseXML;
  }

  // ----- GET COUNTS -----
  const userXML = fetchXML('adminxml.php?request=getUserCount');
  const communityXML = fetchXML('adminxml.php?request=getCommunityCount');
  const eventXML = fetchXML('adminxml.php?request=getEventCount');
  const logXML = fetchXML('adminxml.php?request=getLogCount');

  const usersCount =
    userXML.getElementsByTagName("userCount")[0]?.textContent || 0;

  const communitiesCount =
    communityXML.getElementsByTagName("communityCount")[0]?.textContent || 0;

  const eventsCount =
    eventXML.getElementsByTagName("eventCount")[0]?.textContent || 0;

  const logsCount =
    logXML.getElementsByTagName("logCount")[0]?.textContent || 0;

  // ----- ALWAYS UPDATE DASHBOARD STATS -----
  const updatedStats = {
    totalUsers: parseInt(usersCount),
    totalCommunities: parseInt(communitiesCount),
    totalEvents: parseInt(eventsCount),
    activeLogs: parseInt(logsCount),
    userGrowth: 4.3,
    communityGrowth: 2.1,
    eventGrowth: 0.0,
    logGrowth: 8.7
  };

  localStorage.setItem('dashboardStats', JSON.stringify(updatedStats));


  // =============================
  // LOAD USER LIST FROM DATABASE
  // =============================
  const userDataXML = fetchXML('adminxml.php?request=getUserData');

  const rowNos = userDataXML.getElementsByTagName("rowNo");
  const userIds = userDataXML.getElementsByTagName("userId");
  const fullNames = userDataXML.getElementsByTagName("fullName");
  const roles = userDataXML.getElementsByTagName("role");
  const statuses = userDataXML.getElementsByTagName("status");

  function mapRole(num) {
    switch (num) {
      case "1": return "Student";
      case "2": return "Lecturer";
      case "3": return "Admin";
      default: return "Unknown";
    }
  }

  const recentUsers = [];
  for (let i = 0; i < rowNos.length; i++) {
    recentUsers.push({
      id: userIds[i].textContent,
      name: fullNames[i].textContent,
      role: mapRole(roles[i].textContent),
      status: statuses[i].textContent === "1" ? "Active" : "Inactive"
    });
  }

  localStorage.setItem('recentUsers', JSON.stringify(recentUsers));


  // =============================
  // SET DEFAULT ACTIVITY & CHART
  // =============================
  const defaultActivity = [
    { type: 'user', title: 'New User Registration', description: 'System activity example', time: '2 hours ago', marker: 'bg-success' },
    { type: 'community', title: 'Community Created', description: 'Example timeline', time: '4 hours ago', marker: 'bg-primary' }
  ];

  if (!localStorage.getItem('recentActivity')) {
    localStorage.setItem('recentActivity', JSON.stringify(defaultActivity));
  }

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
      }
    ]
  };

  if (!localStorage.getItem('activityChartData')) {
    localStorage.setItem('activityChartData', JSON.stringify(defaultChartData));
  }
}



// ==============================
// RENDER STATS
// ==============================
function renderStats() {
  const stats = JSON.parse(localStorage.getItem('dashboardStats'));

  document.getElementById('totalUsers').textContent = stats.totalUsers;
  document.getElementById('totalCommunities').textContent = stats.totalCommunities;
  document.getElementById('totalEvents').textContent = stats.totalEvents;
  document.getElementById('activeLogs').textContent = stats.activeLogs;

  updateGrowthIndicator('totalUsers', stats.userGrowth, 'success');
  updateGrowthIndicator('totalCommunities', stats.communityGrowth, 'success');
  updateGrowthIndicator('totalEvents', stats.eventGrowth, 'warning');
  updateGrowthIndicator('activeLogs', stats.logGrowth, 'danger');
}

function updateGrowthIndicator(id, growth, type) {
  const container = document.getElementById(id)
    .closest('.card-body')
    .querySelector('.mt-3');

  const icon = growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';

  container.className = `mt-3 mb-0 text-${type}`;
  container.innerHTML = `
    <span class="me-2"><i class="fas ${icon}"></i> ${Math.abs(growth)}%</span>
    <span>Since last month</span>
  `;
}



// ==============================
// ACTIVITY CHART
// ==============================
function renderActivityChart() {
  const canvas = document.getElementById('activityChart');
  if (!canvas) return;

  if (canvas.chart) canvas.chart.destroy();

  const chartData = JSON.parse(localStorage.getItem('activityChartData'));
  const ctx = canvas.getContext('2d');

  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}



// ==============================
// RECENT USERS TABLE
// ==============================
function renderRecentUsers() {
  const users = JSON.parse(localStorage.getItem('recentUsers'));
  const tbody = document.querySelector('#dashboard-content .table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  users.forEach(user => {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const statusClass = user.status === "Active" ? "bg-success" : "bg-warning";

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



// ==============================
// RECENT ACTIVITY
// ==============================
function renderRecentActivity() {
  const activities = JSON.parse(localStorage.getItem('recentActivity'));
  const timeline = document.querySelector('.activity-timeline');
  if (!timeline) return;

  timeline.innerHTML = '';

  activities.forEach(act => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-marker ${act.marker}"></div>
      <div class="activity-content">
        <h6>${act.title}</h6>
        <p>${act.description}</p>
        <small class="text-muted">${act.time}</small>
      </div>
    `;
    timeline.appendChild(item);
  });
}



// ==============================
// REFRESH DATA (REAL DATABASE)
// ==============================
function refreshData() {

  const btn = document.getElementById('refreshBtn');
  const original = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Refreshing...';
  btn.disabled = true;

  setTimeout(() => {

    loadDashboardData();     // <-- REAL DB REFRESH
    renderStats();
    renderRecentUsers();
    renderActivityChart();

    btn.innerHTML = original;
    btn.disabled = false;

    showAlert('Dashboard refreshed successfully!', 'success');

  }, 1000);
}



// ==============================
// EXPORT DATA
// ==============================
function exportData() {
  const data = {
    stats: JSON.parse(localStorage.getItem('dashboardStats')),
    users: JSON.parse(localStorage.getItem('recentUsers')),
    activity: JSON.parse(localStorage.getItem('recentActivity'))
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showAlert('Export successful!', 'success');
}



// ==============================
// UPDATE DASHBOARD (optional use)
// ==============================
function updateDashboardStats() {
  loadDashboardData();
  renderStats();
}
window.updateDashboardStats = updateDashboardStats;
