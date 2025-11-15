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

        // Courses page functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Tab functionality
            const tabButtons = document.querySelectorAll('.tab-btn');
            const panels = document.querySelectorAll('.panel');

            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');

                    // Hide all panels
                    panels.forEach(panel => panel.classList.add('hidden'));
                    // Show target panel
                    const targetPanel = document.getElementById(this.dataset.target);
                    targetPanel.classList.remove('hidden');
                });
            });

            // Button actions
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const action = this.dataset.action;
                    const courseTitle = this.closest('.card').querySelector('.course-title').textContent;

                    switch(action) {
                        case 'view':
                            openCourseModal(courseTitle);
                            break;
                        case 'drop':
                            if(confirm(`Are you sure you want to drop ${courseTitle}?`)) {
                                alert(`Successfully dropped ${courseTitle}`);
                            }
                            break;
                        case 'enroll':
                            if(confirm(`Enroll in ${courseTitle}?`)) {
                                alert(`Successfully enrolled in ${courseTitle}`);
                            }
                            break;
                    }
                });
            });

            // Add animation to cards
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Modal event listeners
            document.getElementById('closeModal').addEventListener('click', closeCourseModal);

            document.getElementById('courseModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeCourseModal();
                }
            });

            // Modal button actions
            document.getElementById('modalDropBtn').addEventListener('click', function() {
                const courseTitle = document.getElementById('modalCourseTitle').textContent;
                if(confirm(`Are you sure you want to drop ${courseTitle}?`)) {
                    alert(`Successfully dropped ${courseTitle}`);
                    closeCourseModal();
                    // Here you could add logic to update the UI
                }
            });

            document.getElementById('modalEnrollBtn').addEventListener('click', function() {
                const courseTitle = document.getElementById('modalCourseTitle').textContent;
                if(confirm(`Enroll in ${courseTitle}?`)) {
                    alert(`Successfully enrolled in ${courseTitle}`);
                    closeCourseModal();
                    // Here you could add logic to update the UI
                }
            });

            document.getElementById('modalSyllabusBtn').addEventListener('click', function() {
                const courseTitle = document.getElementById('modalCourseTitle').textContent;
                alert(`Opening syllabus for ${courseTitle}`);
                // Here you could open a PDF or navigate to syllabus page
            });
        });

        // Course data for modal
        const courseData = {
            "Software Engineering": {
                instructor: "Dr. Smith",
                schedule: "Mon/Wed 10:00 AM",
                room: "MATH-101",
                credits: 3,
                status: "enrolled",
                progress: 65,
                assignments: "13/20",
                attendance: "85%",
                grade: "B+",
                description: "This course provides a comprehensive introduction to software engineering principles and practices. Students will learn about software development methodologies, project management, quality assurance, and team collaboration techniques.",
                prerequisites: "Basic programming knowledge, Data Structures",
                objectives: [
                    "Understand software development lifecycle",
                    "Apply agile methodologies",
                    "Implement quality assurance practices",
                    "Work effectively in development teams"
                ],
                materials: [
                    "Textbook: Software Engineering by Ian Sommerville",
                    "Online resources and tutorials",
                    "Development tools and IDEs"
                ]
            },
            "C Programming": {
                instructor: "Prof. Johnson",
                schedule: "Tue/Thu 2:00 PM",
                room: "PHYS-205",
                credits: 4,
                status: "enrolled",
                progress: 40,
                assignments: "8/20",
                attendance: "78%",
                grade: "B",
                description: "This course covers the fundamentals of C programming language, including data types, control structures, functions, pointers, memory management, and file I/O operations.",
                prerequisites: "Introduction to Programming",
                objectives: [
                    "Master C programming fundamentals",
                    "Understand memory management concepts",
                    "Implement data structures in C",
                    "Develop efficient algorithms"
                ],
                materials: [
                    "Textbook: C Programming Language by Kernighan & Ritchie",
                    "C compiler (GCC/Clang)",
                    "Development environment setup"
                ]
            },
            "Python": {
                instructor: "Dr. Lee",
                schedule: "Wed/Fri 11:00 AM",
                room: "CHEM-103",
                credits: 3,
                status: "enrolled",
                progress: 80,
                assignments: "16/20",
                attendance: "92%",
                grade: "A-",
                description: "An introductory course to Python programming covering basic syntax, data structures, object-oriented programming, and practical applications in data analysis and automation.",
                prerequisites: "None",
                objectives: [
                    "Learn Python syntax and basic constructs",
                    "Understand data structures and algorithms",
                    "Apply Python in real-world scenarios",
                    "Develop problem-solving skills"
                ],
                materials: [
                    "Textbook: Python Crash Course by Eric Matthes",
                    "Python interpreter and IDE",
                    "Online coding platforms"
                ]
            },
            "JavaScript": {
                instructor: "Prof. Davis",
                schedule: "Mon/Fri 1:00 PM",
                room: "HIST-202",
                credits: 3,
                status: "enrolled",
                progress: 25,
                assignments: "5/20",
                attendance: "88%",
                grade: "B",
                description: "This course explores JavaScript programming for web development, covering client-side scripting, DOM manipulation, asynchronous programming, and modern frameworks.",
                prerequisites: "HTML/CSS basics",
                objectives: [
                    "Master JavaScript fundamentals",
                    "Understand DOM manipulation",
                    "Learn asynchronous programming",
                    "Build interactive web applications"
                ],
                materials: [
                    "Textbook: Eloquent JavaScript by Marijn Haverbeke",
                    "Web browser developer tools",
                    "Code editor with JavaScript support"
                ]
            },
            "Academic English": {
                instructor: "Ms. Wilson",
                schedule: "Tue/Thu 9:00 AM",
                room: "ENG-105",
                credits: 2,
                status: "enrolled",
                progress: 95,
                assignments: "19/20",
                attendance: "96%",
                grade: "A",
                description: "This course focuses on developing academic writing and communication skills essential for university studies, including essay writing, research papers, and presentations.",
                prerequisites: "English proficiency",
                objectives: [
                    "Improve academic writing skills",
                    "Learn research paper structure",
                    "Enhance presentation abilities",
                    "Develop critical thinking in writing"
                ],
                materials: [
                    "Academic writing handbook",
                    "Research databases access",
                    "Presentation software"
                ]
            },
            "Formal Methods": {
                instructor: "Advanced Mathematics",
                schedule: "Wed 3:00 PM",
                room: "ART-11",
                credits: 4,
                status: "available",
                description: "This advanced course covers formal methods in computer science, including mathematical modeling, specification languages, verification techniques, and formal proof methods.",
                prerequisites: "Discrete Mathematics, Logic",
                objectives: [
                    "Understand formal specification techniques",
                    "Learn verification methods",
                    "Apply mathematical modeling",
                    "Master formal proof techniques"
                ],
                materials: [
                    "Textbook: Formal Methods by Jonathan Bowen",
                    "Theorem prover software",
                    "Mathematical notation tools"
                ]
            },
            "Computer Science": {
                instructor: "Dr. Rivera",
                schedule: "Mon 4:00 PM",
                room: "CS-220",
                credits: 3,
                status: "available",
                description: "An introduction to computer science fundamentals including algorithms, data structures, computational theory, and problem-solving methodologies.",
                prerequisites: "Programming experience",
                objectives: [
                    "Understand algorithmic thinking",
                    "Learn fundamental data structures",
                    "Explore computational complexity",
                    "Develop systematic problem-solving"
                ],
                materials: [
                    "Textbook: Introduction to Algorithms by CLRS",
                    "Programming environment",
                    "Algorithm visualization tools"
                ]
            },
            "Java Language": {
                instructor: "Prof. Khan",
                schedule: "Thu 5:00 PM",
                room: "PHIL-01",
                credits: 3,
                status: "available",
                description: "Comprehensive coverage of Java programming language including object-oriented concepts, collections framework, exception handling, and enterprise application development.",
                prerequisites: "Object-oriented programming basics",
                objectives: [
                    "Master Java OOP concepts",
                    "Understand Java collections",
                    "Learn exception handling",
                    "Develop enterprise applications"
                ],
                materials: [
                    "Textbook: Effective Java by Joshua Bloch",
                    "Java Development Kit (JDK)",
                    "Integrated Development Environment (IDE)"
                ]
            }
        };

        // Modal functionality
        function openCourseModal(courseTitle) {
            const modal = document.getElementById('courseModal');
            const data = courseData[courseTitle];

            if (!data) return;

            // Populate modal with course data
            document.getElementById('modalCourseTitle').textContent = courseTitle;
            document.getElementById('modalInstructor').textContent = data.instructor;
            document.getElementById('modalSchedule').textContent = data.schedule;
            document.getElementById('modalRoom').textContent = data.room;
            document.getElementById('modalCredits').textContent = data.credits;
            document.getElementById('modalStatus').textContent = data.status === 'enrolled' ? 'Enrolled' : 'Available';
            document.getElementById('modalStatus').className = `status-badge ${data.status}`;

            // Progress information (only for enrolled courses)
            if (data.status === 'enrolled') {
                document.getElementById('modalProgressText').textContent = `${data.progress}% Complete`;
                document.querySelector('.progress-bar-modal').style.setProperty('--progress-width', `${data.progress}%`);
                document.querySelector('.progress-bar-modal::before').style.width = `${data.progress}%`;
                document.getElementById('modalAssignments').textContent = data.assignments;
                document.getElementById('modalAttendance').textContent = data.attendance;
                document.getElementById('modalGrade').textContent = data.grade;

                // Show progress section
                document.querySelector('.info-section:nth-child(2)').style.display = 'block';
            } else {
                // Hide progress section for available courses
                document.querySelector('.info-section:nth-child(2)').style.display = 'none';
            }

            document.getElementById('modalDescription').textContent = data.description;
            document.getElementById('modalPrerequisites').textContent = data.prerequisites;

            // Populate objectives
            const objectivesList = document.getElementById('modalObjectives');
            objectivesList.innerHTML = '';
            data.objectives.forEach(objective => {
                const li = document.createElement('li');
                li.textContent = objective;
                objectivesList.appendChild(li);
            });

            // Populate materials
            const materialsList = document.getElementById('modalMaterials');
            materialsList.innerHTML = '';
            data.materials.forEach(material => {
                const li = document.createElement('li');
                li.textContent = material;
                materialsList.appendChild(li);
            });

            // Show/hide appropriate buttons
            const dropBtn = document.getElementById('modalDropBtn');
            const enrollBtn = document.getElementById('modalEnrollBtn');

            if (data.status === 'enrolled') {
                dropBtn.style.display = 'flex';
                enrollBtn.style.display = 'none';
            } else {
                dropBtn.style.display = 'none';
                enrollBtn.style.display = 'flex';
            }

            // Show modal
            modal.classList.add('active');
        }

        function closeCourseModal() {
            const modal = document.getElementById('courseModal');
            modal.classList.remove('active');
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
