// Component Loader for Admin Panel
document.addEventListener('DOMContentLoaded', function() {
  loadComponents();
});

async function loadComponents() {
  try {
    // Load header
    const headerResponse = await fetch('../components/admin/header.html');
    if (!headerResponse.ok) throw new Error('Failed to load header');
    const headerHtml = await headerResponse.text();
    document.getElementById('header-placeholder').innerHTML = headerHtml;

    // Initialize dark mode toggle after header is loaded
    initializeDarkMode();

    // Load sidebar
    const sidebarResponse = await fetch('../components/admin/sidebar.html');
    if (!sidebarResponse.ok) throw new Error('Failed to load sidebar');
    const sidebarHtml = await sidebarResponse.text();
    document.getElementById('sidebar-placeholder').innerHTML = sidebarHtml;

    // Load modals
    const modalsResponse = await fetch('../components/admin/modals.html');
    if (!modalsResponse.ok) throw new Error('Failed to load modals');
    const modalsHtml = await modalsResponse.text();
    document.getElementById('modals-placeholder').innerHTML = modalsHtml;

    // Wait a bit for DOM to be fully updated
    setTimeout(() => {
      // Determine initial section from URL hash or default to dashboard
      const initialSection = getActiveSectionFromHash();

      // Initialize navigation after components are loaded
      initializeNavigation();

      // Initialize sidebar toggle for mobile
      initializeSidebarToggle();

      // Set initial active section
      setInitialActiveSection(initialSection);
    }, 100);

  } catch (error) {
    console.error('Error loading components:', error);
    showAlert('Error loading page components. Please refresh the page.', 'error');
  }
}

function initializeDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    const icon = toggle.querySelector('i');

    function setMode(isDark) {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        if (icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        if (icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', 'light');
      }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setMode(true);
    } else {
      setMode(false);
    }

    toggle.addEventListener('click', () => {
      setMode(!document.body.classList.contains('dark-mode'));
    });
  }
}

function getActiveSectionFromHash() {
  const hash = window.location.hash.substring(1);
  const validSections = ['dashboard', 'analytics', 'users', 'courses', 'activity', 'settings'];
  return validSections.includes(hash) ? hash : 'dashboard';
}

async function setInitialActiveSection(sectionId) {
  try {
    // Load section content first
    await loadSectionContent(sectionId);
    
    // Update navigation
    const navLinks = document.querySelectorAll('#sidebar .nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    // Remove active class from all links and sections
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Add active class to the initial link
    const activeLink = document.querySelector(`#sidebar .nav-link[data-section="${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Show initial section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Update page title
    const linkText = activeLink ? activeLink.textContent.trim() : 'Dashboard';
    document.title = `${linkText} - University Admin Panel`;

    // Initialize section-specific functionality
    initializeSection(sectionId);

  } catch (error) {
    console.error('Error setting initial active section:', error);
  }
}

async function loadSectionContent(sectionName) {
  const contentId = `${sectionName}-content`;
  const contentElement = document.getElementById(contentId);
  
  if (!contentElement) {
    console.error(`Content element with id ${contentId} not found`);
    return;
  }

  // Check if content is already loaded
  if (contentElement.innerHTML.trim() !== '') {
    return; // Content already loaded
  }

  const fileName = sectionName === 'activity' ? 'activity-log.html' : `${sectionName}.php`;

  try {
    const response = await fetch(`../components/admin/${fileName}`);
    if (!response.ok) throw new Error(`Failed to load ${fileName}`);
    const html = await response.text();
    contentElement.innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${sectionName} content:`, error);
    contentElement.innerHTML = `<div class="alert alert-danger">Error loading ${sectionName} content. Please try refreshing the page.</div>`;
  }
}

function initializeNavigation() {
  const navLinks = document.querySelectorAll('#sidebar .nav-link');
  const sections = document.querySelectorAll('.dashboard-section');

  navLinks.forEach(link => {
    link.addEventListener('click', async function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');

      // Special case for communities: navigate to community page
      if (sectionId === 'communities') {
        window.location.href = '../community/communities.php';
        return;
      }

      // Update URL hash
      window.location.hash = sectionId;

      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');

      // Hide all sections
      sections.forEach(s => s.classList.remove('active'));
      // Show selected section
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      // Load content for the section
      await loadSectionContent(sectionId);

      // Update page title
      document.title = `${this.textContent.trim()} - University Admin Panel`;

      // Initialize section-specific functionality
      initializeSection(sectionId);
    });
  });

  // Handle hash changes
  window.addEventListener('hashchange', function() {
    const sectionId = getActiveSectionFromHash();
    const link = document.querySelector(`#sidebar .nav-link[data-section="${sectionId}"]`);
    if (link) {
      link.click();
    }
  });
}

function initializeSection(sectionId) {
  // Small delay to ensure DOM is fully rendered
  setTimeout(() => {
    switch(sectionId) {
      case 'dashboard':
        initDashboard();
        break;
      case 'analytics':
        updateAnalyticsCharts();
        break;
      case 'activity':
        initActivityLogs();
        break;
      case 'users':
        initUsersTable();
        break;
      default:
        // No specific initialization needed for other sections
        break;
    }
  }, 150);
}

// Initialize sidebar toggle for mobile
function initializeSidebarToggle() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
  // Remove any existing alerts
  const existingAlert = document.querySelector('.global-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertClass = {
    'success': 'alert-success',
    'error': 'alert-danger',
    'warning': 'alert-warning',
    'info': 'alert-info'
  }[type] || 'alert-info';

  const alertHtml = `
    <div class="global-alert alert ${alertClass} alert-dismissible fade show position-fixed" style="top: 20px; right: 20px; z-index: 9999;">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', alertHtml);

  // Auto remove after 5 seconds
  setTimeout(() => {
    const alert = document.querySelector('.global-alert');
    if (alert) {
      alert.remove();
    }
  }, 5000);
}
