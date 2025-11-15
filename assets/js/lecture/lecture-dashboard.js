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
    const sidebarToggle = document.getElementById('sidebarToggle');

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

            // Hide sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('show');
                }
            }

            // Show toast for navigation
            if (sectionId !== 'dashboard') {
                showToast(`Navigated to ${this.textContent.trim()}`, 'info');
            }
        });
    });

    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('show');
            }
        });
    }
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

// Line Chart Functionality
function initializeActivityChart() {
    const activityChart = document.getElementById('activityChart');
    if (!activityChart) return;

    // Clear any existing content
    activityChart.innerHTML = '';
    activityChart.className = 'line-chart';

    // Sample data - using the numbers from your second image
    const activityData = [40, 30, 30, 37, 36, 35, 34, 32, 31];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];

    // Create SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute('class', 'line-chart-container');
    svg.setAttribute('viewBox', '0 0 400 200');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Create gradient for area fill
    const defs = document.createElementNS(svgNS, "defs");
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute('id', 'lineChartGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'var(--primary-purple)');
    stop1.setAttribute('stop-opacity', '0.4');
    
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'var(--primary-purple)');
    stop2.setAttribute('stop-opacity', '0.1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Create grid lines
    for (let i = 0; i <= 4; i++) {
        const y = 40 + (i * 40);
        const gridLine = document.createElementNS(svgNS, "line");
        gridLine.setAttribute('class', 'line-chart-grid');
        gridLine.setAttribute('x1', '20');
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', '380');
        gridLine.setAttribute('y2', y);
        svg.appendChild(gridLine);
    }

    // Calculate points for the line
    const points = activityData.map((value, index) => {
        const x = 20 + (index * 40);
        const y = 200 - ((value / 50) * 160); // Scale to fit 0-50 range
        return { x, y, value };
    });

    // Create area path
    let areaPath = `M ${points[0].x} 200 `;
    points.forEach(point => {
        areaPath += `L ${point.x} ${point.y} `;
    });
    areaPath += `L ${points[points.length - 1].x} 200 Z`;

    const area = document.createElementNS(svgNS, "path");
    area.setAttribute('class', 'line-chart-area');
    area.setAttribute('d', areaPath);
    svg.appendChild(area);

    // Create line path
    let linePath = `M ${points[0].x} ${points[0].y} `;
    points.slice(1).forEach(point => {
        linePath += `L ${point.x} ${point.y} `;
    });

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute('class', 'line-chart-path');
    path.setAttribute('d', linePath);
    svg.appendChild(path);

    // Create points and value labels
    points.forEach((point, index) => {
        // Create data point
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute('class', 'line-chart-point');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('data-value', point.value);
        circle.style.animationDelay = `${index * 0.2}s`;

        // Create value label
        const valueLabel = document.createElement('div');
        valueLabel.className = 'line-chart-value';
        valueLabel.textContent = point.value;
        valueLabel.style.left = `${(point.x / 400) * 100}%`;
        valueLabel.style.top = `${(point.y / 200) * 100}%`;

        // Add hover event
        circle.addEventListener('mouseenter', function() {
            this.setAttribute('r', '6');
            valueLabel.style.opacity = '1';
            valueLabel.style.transform = 'translate(-50%, -120%)';
        });

        circle.addEventListener('mouseleave', function() {
            this.setAttribute('r', '4');
            valueLabel.style.opacity = '0';
            valueLabel.style.transform = 'translate(-50%, -100%)';
        });

        svg.appendChild(circle);
        activityChart.appendChild(valueLabel);
    });

    // Create day labels
    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'line-chart-labels';

    days.forEach((day, index) => {
        const label = document.createElement('div');
        label.className = 'line-chart-label';
        label.textContent = day;
        label.style.flex = '1';
        label.style.textAlign = 'center';
        labelsContainer.appendChild(label);
    });

    activityChart.appendChild(svg);
    activityChart.appendChild(labelsContainer);

    // Add resize handler for responsiveness
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-initialize chart on resize for better responsiveness
            initializeActivityChart();
        }, 250);
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