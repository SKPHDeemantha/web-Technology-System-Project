// Dark/Light mode toggle with dynamic icons
const themeToggle = document.getElementById('themeToggle');
const darkModeInput = document.getElementById('darkModeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme AND icon
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme); // This sets the correct icon on page load

// Sync the appearance toggle with the current theme
darkModeInput.checked = currentTheme === 'dark';

themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme); // This updates the icon when clicked
    darkModeInput.checked = newTheme === 'dark'; // Sync the checkbox
});

// Handle the appearance toggle checkbox change
darkModeInput.addEventListener('change', function() {
    const newTheme = this.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Function to update theme toggle icon - COMBINED VERSION
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (theme === 'dark') {
        // Elegant sun with perfect proportions (for dark mode - click to switch to light)
        themeToggle.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round">
                    <path d="M12 3v2m0 14v2M21 12h-2M5 12H3m14.14-5.14l-1.42 1.42M7.86 16.14l-1.42 1.42m10.7 0l-1.42-1.42M7.86 7.86l-1.42-1.42"/>
                </g>
            </svg>
        `;
    } else {
        // Beautiful crescent moon (for light mode - click to switch to dark)
        themeToggle.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.21 16.21A9 9 0 0 1 7.79 3.79 7 7 0 0 0 20.21 16.21z"
                      fill="currentColor" stroke="currentColor" stroke-width="0.3"/>
            </svg>
        `;
    }
}

// Navigation functionality
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Show the selected page
    document.getElementById(page + '-page').classList.add('active');

    // Update active navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');

    // Close mobile sidebar if open
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Mobile menu functionality
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

document.getElementById('overlay').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
    this.classList.remove('active');
});

// Settings specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    loadSettings();

    // Save Changes button
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener('click', function() {
        saveAccountSettings();
    });

    // Change Password button
    const changePasswordBtn = document.querySelector('.btn-secondary');
    changePasswordBtn.addEventListener('click', function() {
        openChangePasswordModal();
    });

    // Delete Account button
    const deleteBtn = document.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', function() {
        deleteAccount();
    });

    // Save settings on toggle changes
    const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            saveSettings();
        });
    });

    // Save language on change
    const languageSelect = document.getElementById('language');
    languageSelect.addEventListener('change', function() {
        saveSettings();
    });

    // Add click effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('studentSettings')) || {};

    // Account settings
    document.getElementById('email').value = settings.email || 'heshandeemantha@example.com';
    document.getElementById('phone').value = settings.phone || '+1 (555) 123-4567';

    // Privacy settings
    document.querySelector('input[name="profileVisibility"]').checked = settings.profileVisibility !== false;
    document.querySelector('input[name="showEmail"]').checked = settings.showEmail || false;
    document.querySelector('input[name="allowMessages"]').checked = settings.allowMessages || false;

    // Notification settings
    document.querySelector('input[name="emailNotifications"]').checked = settings.emailNotifications !== false;
    document.querySelector('input[name="pushNotifications"]').checked = settings.pushNotifications !== false;
    document.querySelector('input[name="assignmentReminders"]').checked = settings.assignmentReminders !== false;
    document.querySelector('input[name="announcementAlerts"]').checked = settings.announcementAlerts !== false;

    // Appearance settings
    document.getElementById('language').value = settings.language || 'en';
}

// Save account settings
function saveAccountSettings() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Basic validation
    if (!email || !phone) {
        alert('Please fill in all fields.');
        return;
    }

    const settings = JSON.parse(localStorage.getItem('studentSettings')) || {};
    settings.email = email;
    settings.phone = phone;
    localStorage.setItem('studentSettings', JSON.stringify(settings));

    alert('Account settings saved successfully!');
}

// Save all settings
function saveSettings() {
    const settings = {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        profileVisibility: document.querySelector('input[name="profileVisibility"]').checked,
        showEmail: document.querySelector('input[name="showEmail"]').checked,
        allowMessages: document.querySelector('input[name="allowMessages"]').checked,
        emailNotifications: document.querySelector('input[name="emailNotifications"]').checked,
        pushNotifications: document.querySelector('input[name="pushNotifications"]').checked,
        assignmentReminders: document.querySelector('input[name="assignmentReminders"]').checked,
        announcementAlerts: document.querySelector('input[name="announcementAlerts"]').checked,
        language: document.getElementById('language').value
    };

    localStorage.setItem('studentSettings', JSON.stringify(settings));
}

// Open change password modal (placeholder)
function openChangePasswordModal() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        // In a real app, this would send to server
        alert('Password changed successfully!');
    }
}

// Delete account (placeholder)
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // In a real app, this would send to server
        alert('Account deletion initiated. You will receive a confirmation email.');
    }
}

// Get current page name from URL
const currentPage = window.location.pathname.split("/").pop();

// Get all sidebar links
const menuItems = document.querySelectorAll(".sidebar a");

// Loop through and highlight the current page link
menuItems.forEach(item => {
    if (item.getAttribute("href").includes(currentPage)) {
        item.classList.add("active");
    } else {
        item.classList.remove("active");
    }
});
