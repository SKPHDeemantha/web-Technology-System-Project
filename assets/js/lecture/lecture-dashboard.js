// Dark Mode Toggle with community hub style
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeAnimations();
    initializeNavigation();
    initializeQuickActions();
    initializeActivityChart();
    initializeStatsCards();
});

// Dark Mode Functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleSidebar = document.getElementById('darkModeToggleSidebar');
    
    // Check for saved theme preference or prefer-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the current theme
    document.body.setAttribute('data-theme', currentTheme);
    updateDarkModeIcons(currentTheme);
    
    // Toggle dark mode from header button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Toggle dark mode from sidebar button
    if (darkModeToggleSidebar) {
        darkModeToggleSidebar.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth mode change
    document.body.classList.add('theme-transition');
    
    // Set the new theme
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icons
    updateDarkModeIcons(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
    
    // Show toast notification
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'info');
}

function updateDarkModeIcons(theme) {
    const darkModeIcons = document.querySelectorAll('#darkModeToggle i, #darkModeToggleSidebar i');
    const buttonText = document.querySelector('#darkModeToggleSidebar');
    
    darkModeIcons.forEach(icon => {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun fa-lg';
            if (buttonText) {
                buttonText.innerHTML = '<i class="fas fa-sun me-2"></i> Switch to Light Mode';
            }
        } else {
            icon.className = 'fas fa-moon fa-lg';
            if (buttonText) {
                buttonText.innerHTML = '<i class="fas fa-moon me-2"></i> Switch to Dark Mode';
            }
        }
    });
}

// Animation Functions
function initializeAnimations() {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Animate stats cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('bounce-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.stat-card, .card, .class-item, .task-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add hover animations to interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .action-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Navigation Functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            dashboardSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section with animation
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.classList.add('fade-in');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    targetSection.classList.remove('fade-in');
                }, 500);
            }
            
            // Show toast for navigation
            if (sectionId !== 'dashboard') {
                showToast(`Navigated to ${this.textContent.trim()}`, 'info');
            }
        });
    });
}

// Quick Actions Functionality
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const action = this.getAttribute('data-action');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle different actions
            switch(action) {
                case 'announcement':
                    showToast('Opening New Announcement form...', 'info');
                    break;
                case 'assignment':
                    showToast('Opening Create Assignment form...', 'info');
                    break;
                case 'material':
                    showToast('Opening Upload Material dialog...', 'info');
                    break;
                case 'reports':
                    showToast('Loading Reports...', 'info');
                    break;
                default:
                    showToast(`Action: ${action}`, 'info');
            }
            
            // Add ripple effect
            createRippleEffect(e, this);
        });
    });
}

// Activity Chart Functionality
function initializeActivityChart() {
    const activityChart = document.getElementById('activityChart');
    if (!activityChart) return;
    
    const activityData = [45, 52, 38, 65, 72, 58, 49];
    
    activityData.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'activity-bar animated';
        bar.style.height = `${value}%`;
        bar.style.animationDelay = `${index * 0.1}s`;
        
        const label = document.createElement('div');
        label.className = 'activity-bar-label';
        label.textContent = value;
        label.style.cssText = `
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            font-weight: 600;
            color: var(--text-dark);
        `;
        
        const dayLabel = document.createElement('div');
        dayLabel.className = 'activity-day-label';
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayLabel.textContent = days[index];
        dayLabel.style.cssText = `
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: var(--text-light);
        `;
        
        bar.appendChild(label);
        bar.appendChild(dayLabel);
        activityChart.appendChild(bar);
        
        // Add hover effect
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleY(1.15)';
            label.style.fontWeight = '700';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleY(1)';
            label.style.fontWeight = '600';
        });
    });
}

// Stats Cards Animation
function initializeStatsCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility Functions
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${getToastIcon(type)} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000,
    });
    
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

function getToastIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Refresh Button Functionality
document.getElementById('refreshBtn')?.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
    this.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Refresh Data';
        this.disabled = false;
        showToast('Data refreshed successfully!', 'success');
        
        // Re-animate stats cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.classList.remove('bounce-in');
            void card.offsetWidth; // Trigger reflow
            card.classList.add('bounce-in');
        });
    }, 1500);
});

// Add CSS for ripple effect and transitions
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
    
    .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .loaded .dashboard-section.active {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .action-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);