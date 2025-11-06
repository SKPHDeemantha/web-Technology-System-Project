const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        // Toggle sidebar on mobile
        function toggleSidebar() {
            sidebar.classList.toggle('mobile-hidden');
            sidebarOverlay.classList.toggle('active');
        }

        // Open sidebar
        menuToggle.addEventListener('click', toggleSidebar);

        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener('click', toggleSidebar);

        // Close sidebar when clicking nav items on mobile
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            });
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove('mobile-hidden');
                    sidebarOverlay.classList.remove('active');
                } else {
                    sidebar.classList.add('mobile-hidden');
                }
            }, 250);
        });

        // Initialize sidebar state on load
        window.addEventListener('load', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.add('mobile-hidden');
            }
        });