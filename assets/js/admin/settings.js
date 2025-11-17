document.addEventListener('DOMContentLoaded', function () {
    // Load settings from localStorage on page load
    loadSettings();

    // Form submission handler
    const settingsForm = document.getElementById('settingsForm');
    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        saveSettings();
    });

    // Toggle handlers
    const darkModeToggle = document.getElementById('darkMode');
    darkModeToggle.addEventListener('change', function () {
        toggleDarkMode(this.checked);
        saveSettings(); // Save immediately on toggle
    });

    // Notification toggles (save on change)
    const notificationToggles = ['enableNotifications', 'newUserNotifications', 'eventNotifications', 'systemNotifications'];
    notificationToggles.forEach(id => {
        const toggle = document.getElementById(id);
        toggle.addEventListener('change', saveSettings);
    });

    // Select change handlers
    const selects = ['timezone', 'dateFormat', 'themeColor', 'sidebarStyle'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.addEventListener('change', saveSettings);
    });

    // Button handlers
    const checkUpdatesBtn = document.querySelector('.btn-outline-purple');
    checkUpdatesBtn.addEventListener('click', function () {
        alert('Checking for updates... No updates available at this time.');
    });

    const clearCacheBtn = document.querySelector('.btn-outline-danger');
    clearCacheBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear the cache? This will reset all settings.')) {
            localStorage.clear();
            loadSettings(); // Reload defaults
            alert('Cache cleared successfully.');
        }
    });
});

function loadSettings() {
    // Load general settings
    const systemName = localStorage.getItem('systemName') || 'University Management System';
    document.getElementById('systemName').value = systemName;

    const adminEmail = localStorage.getItem('adminEmail') || 'admin@university.edu';
    document.getElementById('adminEmail').value = adminEmail;

    const timezone = localStorage.getItem('timezone') || 'UTC-5 (Eastern Time)';
    document.getElementById('timezone').value = timezone;

    const dateFormat = localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
    document.getElementById('dateFormat').value = dateFormat;

    const systemDescription = localStorage.getItem('systemDescription') || 'University Management System for students, faculty, and administration.';
    document.getElementById('systemDescription').value = systemDescription;

    // Load toggles
    const toggles = ['enableNotifications', 'newUserNotifications', 'eventNotifications', 'systemNotifications', 'darkMode'];
    toggles.forEach(id => {
        const value = localStorage.getItem(id) === 'true';
        document.getElementById(id).checked = value;
        if (id === 'darkMode') {
            toggleDarkMode(value);
        }
    });

    // Load selects
    const themeColor = localStorage.getItem('themeColor') || 'Purple (Default)';
    document.getElementById('themeColor').value = themeColor;

    const sidebarStyle = localStorage.getItem('sidebarStyle') || 'Expanded';
    document.getElementById('sidebarStyle').value = sidebarStyle;
}

function saveSettings() {
    // Save general settings
    localStorage.setItem('systemName', document.getElementById('systemName').value);
    localStorage.setItem('adminEmail', document.getElementById('adminEmail').value);
    localStorage.setItem('timezone', document.getElementById('timezone').value);
    localStorage.setItem('dateFormat', document.getElementById('dateFormat').value);
    localStorage.setItem('systemDescription', document.getElementById('systemDescription').value);

    // Save toggles
    const toggles = ['enableNotifications', 'newUserNotifications', 'eventNotifications', 'systemNotifications', 'darkMode'];
    toggles.forEach(id => {
        localStorage.setItem(id, document.getElementById(id).checked);
    });

    // Save selects
    localStorage.setItem('themeColor', document.getElementById('themeColor').value);
    localStorage.setItem('sidebarStyle', document.getElementById('sidebarStyle').value);

    // Show success message
    showMessage('Settings saved successfully!', 'success');
}

function toggleDarkMode(enabled) {
    const body = document.body;
    if (enabled) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

function showMessage(message, type) {
    // Simple alert for demo; in a real app, use a toast notification
    alert(message);
}
