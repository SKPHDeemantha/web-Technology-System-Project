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

        // Compose Modal functionality
        const composeModal = document.getElementById('composeModal');
        const composeBtn = document.getElementById('composeBtn');
        const closeComposeModal = document.getElementById('closeComposeModal');
        const composeForm = document.getElementById('composeForm');
        const sendMessageBtn = document.getElementById('sendMessage');
        const saveDraftBtn = document.getElementById('saveDraft');
        const attachFileBtn = document.getElementById('attachFile');
        const recipientInput = document.getElementById('recipientInput');
        const recipientTags = document.getElementById('recipientTags');
        const messageSubject = document.getElementById('messageSubject');
        const messageBody = document.getElementById('messageBody');

        let recipients = [];

        // Open compose modal
        composeBtn.addEventListener('click', function() {
            composeModal.classList.add('active');
            recipientInput.focus();
        });

        // Close compose modal
        function closeCompose() {
            composeModal.classList.remove('active');
            // Clear form
            composeForm.reset();
            recipients = [];
            updateRecipientTags();
        }

        closeComposeModal.addEventListener('click', closeCompose);

        // Close modal when clicking outside
        composeModal.addEventListener('click', function(e) {
            if (e.target === composeModal) {
                closeCompose();
            }
        });

        // Add recipient
        recipientInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const email = this.value.trim();
                if (email && isValidEmail(email)) {
                    if (!recipients.includes(email)) {
                        recipients.push(email);
                        updateRecipientTags();
                    }
                    this.value = '';
                }
            }
        });

        // Remove recipient
        function removeRecipient(email) {
            recipients = recipients.filter(recipient => recipient !== email);
            updateRecipientTags();
        }

        // Update recipient tags display
        function updateRecipientTags() {
            recipientTags.innerHTML = '';
            recipients.forEach(email => {
                const tag = document.createElement('div');
                tag.className = 'recipient-tag';
                tag.innerHTML = `
                    ${email}
                    <button type="button" class="remove-recipient" onclick="removeRecipient('${email}')">&times;</button>
                `;
                recipientTags.appendChild(tag);
            });
            recipientTags.style.display = recipients.length > 0 ? 'flex' : 'none';
        }

        // Email validation
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Send message
        sendMessageBtn.addEventListener('click', function() {
            const subject = messageSubject.value.trim();
            const body = messageBody.value.trim();

            if (recipients.length === 0) {
                alert('Please add at least one recipient');
                return;
            }

            if (!subject) {
                alert('Please enter a subject');
                return;
            }

            if (!body) {
                alert('Please enter a message');
                return;
            }

            // Simulate sending message
            const messageData = {
                recipients: recipients,
                subject: subject,
                body: body,
                priority: document.getElementById('messagePriority').value,
                timestamp: new Date().toISOString()
            };

            console.log('Sending message:', messageData);
            alert(`Message sent to ${recipients.length} recipient(s)!`);
            closeCompose();
        });

        // Save draft
        saveDraftBtn.addEventListener('click', function() {
            const subject = messageSubject.value.trim();
            const body = messageBody.value.trim();

            if (!subject && !body && recipients.length === 0) {
                alert('No content to save');
                return;
            }

            // Simulate saving draft
            const draftData = {
                recipients: recipients,
                subject: subject,
                body: body,
                priority: document.getElementById('messagePriority').value,
                savedAt: new Date().toISOString()
            };

            console.log('Saving draft:', draftData);
            alert('Draft saved successfully!');
        });

        // Attach file
        attachFileBtn.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.onchange = function(e) {
                const files = e.target.files;
                if (files.length > 0) {
                    alert(`Attached ${files.length} file(s)`);
                    // Here you would typically handle file upload
                }
            };
            fileInput.click();
        });

        // Message functionality
        document.querySelectorAll('.message-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Handle checkbox selection
            });
        });

        document.getElementById('markAllRead').addEventListener('click', function() {
            alert('All messages marked as read');
        });

        document.getElementById('deleteSelected').addEventListener('click', function() {
            const selected = document.querySelectorAll('.message-checkbox:checked');
            if (selected.length > 0) {
                if (confirm(`Delete ${selected.length} selected message(s)?`)) {
                    selected.forEach(checkbox => {
                        checkbox.closest('.message-item').remove();
                    });
                }
            } else {
                alert('Please select messages to delete');
            }
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const messages = document.querySelectorAll('.message-item');
            
            messages.forEach(message => {
                const text = message.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    message.style.display = 'flex';
                } else {
                    message.style.display = 'none';
                }
            });
        });

        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Messages page is active by default
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