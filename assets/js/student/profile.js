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

        // Profile page interactions
        document.addEventListener('DOMContentLoaded', function() {
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

            // Add animation to stat boxes on page load
            const statBoxes = document.querySelectorAll('.stat-box');
            statBoxes.forEach((box, index) => {
                box.style.opacity = '0';
                box.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    box.style.transition = 'all 0.5s ease';
                    box.style.opacity = '1';
                    box.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });

        // Modal functionality
        function openProfileModal() {
            const modal = document.getElementById('profileModal');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Populate form with current values
            populateForm();
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function populateForm() {
            // Get current profile data from the page
            const fullName = document.querySelector('.info-grid p').textContent;
            const email = document.querySelector('.info-grid p:nth-child(2)').textContent;
            const dateOfBirth = document.querySelector('.info-grid p:nth-child(3)').textContent;
            const phone = document.querySelector('.info-grid p:nth-child(4)').textContent;
            const gender = document.querySelector('.info-grid p:nth-child(5)').textContent;
            const address = document.querySelector('.info-grid p:nth-child(6)').textContent.replace('<br>', '\n');
            const nationality = document.querySelector('.info-grid p:nth-child(7)').textContent;
            const emergencyContact = document.querySelector('.info-grid p:nth-child(8)').textContent;

            // Populate form fields
            document.getElementById('fullName').value = fullName;
            document.getElementById('email').value = email;
            document.getElementById('phone').value = phone;
            document.getElementById('nationality').value = nationality;
            document.getElementById('emergencyContact').value = emergencyContact;
            document.getElementById('address').value = address;

            // Handle date conversion (assuming format is "Month DD, YYYY")
            const dateParts = dateOfBirth.split(' ');
            if (dateParts.length === 3) {
                const monthNames = {
                    'January': '01', 'February': '02', 'March': '03', 'April': '04',
                    'May': '05', 'June': '06', 'July': '07', 'August': '08',
                    'September': '09', 'October': '10', 'November': '11', 'December': '12'
                };
                const month = monthNames[dateParts[0]];
                const day = dateParts[1].replace(',', '').padStart(2, '0');
                const year = dateParts[2];
                document.getElementById('dateOfBirth').value = `${year}-${month}-${day}`;
            }

            // Set gender
            document.getElementById('gender').value = gender;
        }

        function saveProfile() {
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                phone: document.getElementById('phone').value,
                gender: document.getElementById('gender').value,
                address: document.getElementById('address').value,
                nationality: document.getElementById('nationality').value,
                emergencyContact: document.getElementById('emergencyContact').value
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Update profile display
            updateProfileDisplay(formData);

            // Close modal
            closeModal('profileModal');

            // Show success message
            showNotification('Profile updated successfully!', 'success');
        }

        function validateForm(data) {
            const requiredFields = ['fullName', 'email', 'dateOfBirth', 'phone', 'gender', 'address', 'nationality', 'emergencyContact'];

            for (const field of requiredFields) {
                if (!data[field] || data[field].trim() === '') {
                    showNotification(`Please fill in all required fields.`, 'error');
                    return false;
                }
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return false;
            }

            // Phone validation (basic)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
                showNotification('Please enter a valid phone number.', 'error');
                return false;
            }

            return true;
        }

        function updateProfileDisplay(data) {
            // Update the profile information display
            const infoGrid = document.querySelector('.info-grid');

            // Format date for display
            const dateObj = new Date(data.dateOfBirth);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Format address for display
            const formattedAddress = data.address.replace(/\n/g, '<br>');

            infoGrid.innerHTML = `
                <div>
                    <h4>Full Name</h4>
                    <p>${data.fullName}</p>
                </div>
                <div>
                    <h4>Email</h4>
                    <p>${data.email}</p>
                </div>
                <div>
                    <h4>Date of Birth</h4>
                    <p>${formattedDate}</p>
                </div>
                <div>
                    <h4>Phone</h4>
                    <p>${data.phone}</p>
                </div>
                <div>
                    <h4>Gender</h4>
                    <p>${data.gender}</p>
                </div>
                <div>
                    <h4>Address</h4>
                    <p>${formattedAddress}</p>
                </div>
                <div>
                    <h4>Nationality</h4>
                    <p>${data.nationality}</p>
                </div>
                <div>
                    <h4>Emergency Contact</h4>
                    <p>${data.emergencyContact}</p>
                </div>
            `;
        }

        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;

            // Style the notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            if (type === 'success') {
                notification.style.backgroundColor = '#10b981';
            } else {
                notification.style.backgroundColor = '#ef4444';
            }

            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            // Add to page
            document.body.appendChild(notification);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);

            // Add slideOut animation
            style.textContent += `
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('profileModal');
            if (event.target === modal) {
                closeModal('profileModal');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal('profileModal');
            }
        });

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