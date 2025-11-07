// Dark Mode Toggle with enhanced animation
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Add transition class for smooth mode change
    document.body.classList.add('mode-transition');
    setTimeout(() => {
        document.body.classList.remove('mode-transition');
    }, 500);
    
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

// Generate Activity Chart with enhanced animations
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

// Menu Item Selection with enhanced animations
const menuItems = document.querySelectorAll('.sidebar-menu li');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => {
            i.classList.remove('active');
            i.style.transform = 'translateX(0)';
        });
        item.classList.add('active');
        item.style.transform = 'translateX(10px)';
        
        // Get the page identifier from data attribute
        const page = item.getAttribute('data-page');
        
        // In a real application, you would load the corresponding page content here
        console.log(`Navigating to: ${page}`);
        
        // For demonstration, show an alert
        if (page !== 'dashboard') {
            // Add page transition animation
            document.querySelector('.main-content').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.main-content').style.opacity = '1';
                alert(`This would navigate to the ${page} page in a full application.`);
            }, 300);
        }
    });
});

// Quick Action Buttons with enhanced animations
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const action = button.getAttribute('data-action');
        
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
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
    // Add loaded class for fade-in effect
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Simulate loading data
    console.log('Dashboard loaded successfully');
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.stat-card, .activity-overview, .quick-actions');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .mode-transition {
        transition: background-color 0.5s ease, color 0.5s ease !important;
    }
    
    .action-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);