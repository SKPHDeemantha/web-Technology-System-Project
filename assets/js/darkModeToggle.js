const toggle = document.getElementById('darkModeToggle');

function setMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    toggle.checked = false;
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

toggle.addEventListener('change', () => {
  setMode(toggle.checked);
});
