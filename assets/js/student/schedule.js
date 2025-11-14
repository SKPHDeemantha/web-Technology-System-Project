    // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Close sidebar when clicking a nav item on mobile
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

       // Dark/Light mode toggle with dynamic icons
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme AND icon
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme); // This sets the correct icon on page load

themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme); // This updates the icon when clicked
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

        // Week Navigation
        const prevWeekBtn = document.getElementById('prevWeek');
        const nextWeekBtn = document.getElementById('nextWeek');
        const currentWeekEl = document.getElementById('currentWeek');

        let currentWeek = 0; // 0 represents the current week

        const weekRanges = [
            'January 15 - 19, 2024',
            'January 22 - 26, 2024',
            'January 29 - February 2, 2024',
            'February 5 - 9, 2024'
        ];

        function updateWeekNavigation() {
            currentWeekEl.textContent = weekRanges[currentWeek];
            prevWeekBtn.disabled = currentWeek === 0;
            nextWeekBtn.disabled = currentWeek === weekRanges.length - 1;
        }

        prevWeekBtn.addEventListener('click', function() {
            if (currentWeek > 0) {
                currentWeek--;
                updateWeekNavigation();
            }
        });

        nextWeekBtn.addEventListener('click', function() {
            if (currentWeek < weekRanges.length - 1) {
                currentWeek++;
                updateWeekNavigation();
            }
        });

        // Initialize week navigation
        updateWeekNavigation();

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