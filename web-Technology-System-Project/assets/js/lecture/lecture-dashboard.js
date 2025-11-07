// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update toggle text based on current mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDarkMode ? 
        '<i>☀️</i> Light Mode' : 
        '<i>🌙</i> Dark Mode';
        
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i>☀️</i> Light Mode';
}

// Generate Activity Chart
const activityData = [20, 16, 10, 14, 12];
const activityChart = document.getElementById('activityChart');

activityData.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'activity-bar';
    bar.style.height = `${value * 8}px`; // Scale for visualization
    
    const label = document.createElement('div');
    label.className = 'activity-bar-label';
    label.textContent = value;
    
    bar.appendChild(label);
    activityChart.appendChild(bar);
});

// Menu Item Selection
const menuItems = document.querySelectorAll('.sidebar-menu li');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Get the page identifier from data attribute
        const page = item.getAttribute('data-page');
        
        // In a real application, you would load the corresponding page content here
        console.log(`Navigating to: ${page}`);
        
        // For demonstration, show an alert
        if (page !== 'dashboard') {
            alert(`This would navigate to the ${page} page in a full application.`);
        }
    });
});

// Quick Action Buttons
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        
        // Show appropriate message based on action
        switch(action) {
            case 'announcement':
                alert('Opening New Announcement form...');
                break;
            case 'assignment':
                alert('Opening Create Assignment form...');
                break;
            case 'material':
                alert('Opening Upload Material dialog...');
                break;
            case 'reports':
                alert('Loading Reports...');
                break;
            default:
                alert(`Action: ${action}`);
        }
    });
});

// Add some sample functionality for demonstration
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading data
    console.log('Dashboard loaded successfully');
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});