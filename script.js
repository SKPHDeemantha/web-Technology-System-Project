//chart

const ctx = document.getElementById('userGrowthChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Users',
      data: [1800, 2100, 2300, 2550, 2800, 2950, 3200, 3400, 3600, 3900,3456, 4000],
      borderColor: '#007bff',  // blue line
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.3,  // smooth curve
      pointBackgroundColor: '#007bff',
      pointRadius: 4,
      fill: false
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  }
});

// Event Activity Chart

const ctxx = document.getElementById("eventActivityChart").getContext("2d");

new Chart(ctxx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Events",
        data: [18, 21, 29, 33, 27, 35, 40, 38, 45, 50, 48, 55],
        backgroundColor: "#00c292",
        borderRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `events: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

