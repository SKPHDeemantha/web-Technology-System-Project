// Analytics Charts Functions
function updateAnalyticsCharts() {
  // Check if charts already exist and destroy them to avoid duplicates
  const charts = ['userRoleChart', 'platformUsageChart', 'activityTrendsChart'];
  charts.forEach(chartId => {
    const chartCanvas = document.getElementById(chartId);
    if (chartCanvas && chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }
  });

  // Ensure Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  // User Role Chart
  const roleCanvas = document.getElementById('userRoleChart');
  if (roleCanvas) {
    const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
    const roleCounts = {
      Student: users.filter(u => u.role === 'Student').length,
      Lecturer: users.filter(u => u.role === 'Lecturer').length,
      Admin: users.filter(u => u.role === 'Admin').length
    };

    const roleCtx = roleCanvas.getContext('2d');
    roleCanvas.chart = new Chart(roleCtx, {
      type: 'doughnut',
      data: {
        labels: ['Students', 'Lecturers', 'Admins'],
        datasets: [{
          data: [roleCounts.Student, roleCounts.Lecturer, roleCounts.Admin],
          backgroundColor: [
            '#6a11cb',
            '#a855f7',
            '#c084fc'
          ],
          borderWidth: 0
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

  // Platform Usage Chart
  const platformCanvas = document.getElementById('platformUsageChart');
  if (platformCanvas) {
    const platformCtx = platformCanvas.getContext('2d');
    platformCanvas.chart = new Chart(platformCtx, {
      type: 'bar',
      data: {
        labels: ['Web', 'Mobile', 'Tablet'],
        datasets: [{
          label: 'Usage (%)',
          data: [72, 23, 5],
          backgroundColor: [
            'rgba(106, 17, 203, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(192, 132, 252, 0.7)'
          ],
          borderColor: [
            '#6a11cb',
            '#a855f7',
            '#c084fc'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  // Activity Trends Chart
  const trendsCanvas = document.getElementById('activityTrendsChart');
  if (trendsCanvas) {
    const trendsCtx = trendsCanvas.getContext('2d');
    trendsCanvas.chart = new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'User Registrations',
            data: [65, 78, 66, 74, 58, 80, 67, 85, 92, 105],
            borderColor: '#6a11cb',
            backgroundColor: 'transparent',
            tension: 0.4
          },
          {
            label: 'Community Activity',
            data: [28, 40, 35, 50, 46, 55, 60, 70, 65, 80],
            borderColor: '#a855f7',
            backgroundColor: 'transparent',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
