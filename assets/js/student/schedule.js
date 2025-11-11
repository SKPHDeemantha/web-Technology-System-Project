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

        // Dark/Light mode toggle
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';

        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

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