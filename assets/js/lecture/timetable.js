// Timetable Page JavaScript

// Sample timetable data
const timetableData = [
    {
        id: 1,
        name: "CS 101 - Programming",
        course: "CS 101",
        day: "monday",
        time: "9:00",
        duration: 2,
        room: "Room 101",
        type: "lecture",
        color: "#3498db"
    },
    {
        id: 2,
        name: "MATH 201 - Calculus",
        course: "MATH 201",
        day: "monday",
        time: "11:00",
        duration: 1,
        room: "Room 205",
        type: "lecture",
        color: "#2ecc71"
    },
    {
        id: 3,
        name: "CS 101 - Lab Session",
        course: "CS 101",
        day: "monday",
        time: "14:00",
        duration: 2,
        room: "Lab A",
        type: "lab",
        color: "#3498db"
    },
    {
        id: 4,
        name: "PHY 201 - Physics",
        course: "PHY 201",
        day: "tuesday",
        time: "10:00",
        duration: 2,
        room: "Room 302",
        type: "lecture",
        color: "#e74c3c"
    },
    {
        id: 5,
        name: "CS 201 - Data Structures",
        course: "CS 201",
        day: "tuesday",
        time: "13:00",
        duration: 2,
        room: "Room 101",
        type: "lecture",
        color: "#9b59b6"
    },
    {
        id: 6,
        name: "MATH 201 - Tutorial",
        course: "MATH 201",
        day: "wednesday",
        time: "9:00",
        duration: 1,
        room: "Room 205",
        type: "tutorial",
        color: "#2ecc71"
    },
    {
        id: 7,
        name: "CS 301 - Algorithms",
        course: "CS 301",
        day: "wednesday",
        time: "11:00",
        duration: 2,
        room: "Room 401",
        type: "lecture",
        color: "#f39c12"
    },
    {
        id: 8,
        name: "PHY 201 - Lab",
        course: "PHY 201",
        day: "thursday",
        time: "14:00",
        duration: 3,
        room: "Physics Lab",
        type: "lab",
        color: "#e74c3c"
    },
    {
        id: 9,
        name: "CS 201 - Seminar",
        course: "CS 201",
        day: "friday",
        time: "10:00",
        duration: 1,
        room: "Auditorium",
        type: "seminar",
        color: "#9b59b6"
    }
];

// Time slots for the timetable
const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
];

// DOM Elements
let timetableBody, classModal, classForm, currentWeekStart;

// Initialize the timetable
function initializeTimetable() {
    timetableBody = document.getElementById('timetableBody');
    classModal = document.getElementById('classModal');
    classForm = document.getElementById('classForm');
    
    if (timetableBody) {
        setupEventListeners();
        generateTimetable();
        loadUpcomingClasses();
        updateWeekDisplay();
    }
}

// Set up event listeners
function setupEventListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viewButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            switchView(e.target.dataset.view);
        });
    });
    
    // Navigation buttons
    document.getElementById('prevWeek')?.addEventListener('click', previousWeek);
    document.getElementById('nextWeek')?.addEventListener('click', nextWeek);
    
    // Action buttons
    document.getElementById('addClassBtn')?.addEventListener('click', openClassModal);
    document.getElementById('exportTimetable')?.addEventListener('click', exportTimetable);
    
    // Modal events
    document.querySelector('.close')?.addEventListener('click', closeClassModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeClassModal);
    document.getElementById('saveClassBtn')?.addEventListener('click', saveClass);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === classModal) {
            closeClassModal();
        }
    });
}

// Generate the timetable grid
function generateTimetable() {
    timetableBody.innerHTML = '';
    
    // Create time slots and day slots
    timeSlots.forEach(time => {
        // Time slot
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = formatTimeDisplay(time);
        timetableBody.appendChild(timeSlot);
        
        // Day slots for this time
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            const daySlot = document.createElement('div');
            daySlot.className = 'day-slot';
            daySlot.dataset.day = day;
            daySlot.dataset.time = time;
            
            // Find classes for this time and day
            const classesAtThisTime = getClassesAtTime(day, time);
            
            if (classesAtThisTime.length > 0) {
                classesAtThisTime.forEach(classItem => {
                    const classElement = createClassElement(classItem);
                    daySlot.appendChild(classElement);
                });
            } else {
                const emptySlot = document.createElement('div');
                emptySlot.className = 'empty-slot';
                emptySlot.innerHTML = '<i>+</i>';
                emptySlot.addEventListener('click', () => openClassModalAt(day, time));
                daySlot.appendChild(emptySlot);
            }
            
            timetableBody.appendChild(daySlot);
        });
    });
}

// Get classes at specific day and time
function getClassesAtTime(day, time) {
    return timetableData.filter(classItem => {
        return classItem.day === day && classItem.time === time;
    });
}

// Create class element for timetable
function createClassElement(classItem) {
    const classDiv = document.createElement('div');
    classDiv.className = `class-item ${classItem.type}`;
    classDiv.dataset.id = classItem.id;
    
    classDiv.innerHTML = `
        <div class="class-item-content">
            <div class="class-name">${classItem.course}</div>
            <div class="class-details">${classItem.room}</div>
            <div class="class-details">${classItem.type}</div>
        </div>
        <div class="class-time">${formatTimeDisplay(classItem.time)}</div>
    `;
    
    classDiv.addEventListener('click', () => editClass(classItem.id));
    
    return classDiv;
}

// Format time for display
function formatTimeDisplay(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Switch between different views
function switchView(view) {
    const timetableView = document.querySelector('.timetable-view');
    
    switch(view) {
        case 'week':
            timetableView.style.display = 'block';
            document.querySelector('.month-view')?.style.display = 'none';
            generateTimetable();
            break;
        case 'day':
            // Implement day view
            alert('Day view will be implemented in the next version');
            break;
        case 'month':
            // Implement month view
            alert('Month view will be implemented in the next version');
            break;
    }
}

// Week navigation
function updateWeekDisplay() {
    if (!currentWeekStart) {
        currentWeekStart = new Date();
        // Set to Monday of current week
        const day = currentWeekStart.getDay();
        const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
        currentWeekStart.setDate(diff);
    }
    
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 4); // Friday
    
    const weekDisplay = document.getElementById('currentWeek');
    if (weekDisplay) {
        weekDisplay.textContent = `Week of ${formatDate(currentWeekStart)}`;
    }
}

function previousWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateWeekDisplay();
    generateTimetable();
}

function nextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateWeekDisplay();
    generateTimetable();
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Load upcoming classes for today
function loadUpcomingClasses() {
    const upcomingClasses = document.getElementById('upcomingClasses');
    if (!upcomingClasses) return;
    
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const todayClasses = timetableData.filter(classItem => classItem.day === today);
    
    if (todayClasses.length === 0) {
        upcomingClasses.innerHTML = `
            <div class="empty-state">
                <i>📅</i>
                <h3>No classes today</h3>
                <p>Enjoy your free time!</p>
            </div>
        `;
        return;
    }
    
    upcomingClasses.innerHTML = '';
    todayClasses.forEach(classItem => {
        const classElement = document.createElement('div');
        classElement.className = 'upcoming-class-item';
        classElement.innerHTML = `
            <div class="upcoming-class-info">
                <div class="upcoming-class-name">${classItem.name}</div>
                <div class="upcoming-class-details">
                    <span>${classItem.room}</span>
                    <span>•</span>
                    <span>${classItem.type}</span>
                    <span>•</span>
                    <span>${classItem.duration} hour${classItem.duration > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="upcoming-class-time">${formatTimeDisplay(classItem.time)}</div>
        `;
        upcomingClasses.appendChild(classElement);
    });
}

// Class modal functions
function openClassModal() {
    if (classModal) {
        classModal.style.display = 'block';
        classForm.reset();
    }
}

function openClassModalAt(day, time) {
    openClassModal();
    document.getElementById('classDay').value = day;
    document.getElementById('classTime').value = time;
}

function closeClassModal() {
    if (classModal) {
        classModal.style.display = 'none';
    }
}

function saveClass() {
    const formData = {
        name: document.getElementById('className').value,
        course: document.getElementById('courseSelect').value,
        day: document.getElementById('classDay').value,
        time: document.getElementById('classTime').value,
        duration: parseInt(document.getElementById('classDuration').value),
        room: document.getElementById('classRoom').value,
        type: document.getElementById('classType').value,
        description: document.getElementById('classDescription').value
    };
    
    if (validateClassForm(formData)) {
        const newClass = {
            id: timetableData.length + 1,
            ...formData,
            color: getRandomColor()
        };
        
        timetableData.push(newClass);
        generateTimetable();
        loadUpcomingClasses();
        closeClassModal();
        
        alert('Class added successfully!');
    }
}

function validateClassForm(formData) {
    if (!formData.name.trim()) {
        alert('Please enter a class name');
        return false;
    }
    
    if (!formData.course) {
        alert('Please select a course');
        return false;
    }
    
    if (!formData.room.trim()) {
        alert('Please enter a room number');
        return false;
    }
    
    // Check for scheduling conflicts
    const conflict = timetableData.find(classItem => 
        classItem.day === formData.day && 
        classItem.time === formData.time
    );
    
    if (conflict) {
        alert('There is already a class scheduled at this time!');
        return false;
    }
    
    return true;
}

function editClass(classId) {
    const classItem = timetableData.find(c => c.id === classId);
    if (classItem) {
        if (confirm(`Edit ${classItem.name}?`)) {
            openClassModal();
            // Populate form with class data
            document.getElementById('className').value = classItem.name;
            document.getElementById('courseSelect').value = classItem.course;
            document.getElementById('classDay').value = classItem.day;
            document.getElementById('classTime').value = classItem.time;
            document.getElementById('classDuration').value = classItem.duration;
            document.getElementById('classRoom').value = classItem.room;
            document.getElementById('classType').value = classItem.type;
            document.getElementById('classDescription').value = classItem.description || '';
            
            // Change save button to update
            const saveBtn = document.getElementById('saveClassBtn');
            saveBtn.textContent = 'Update Class';
            saveBtn.onclick = () => updateClass(classId);
        }
    }
}

function updateClass(classId) {
    // Implementation for updating existing class
    alert('Update functionality will be implemented in the next version');
    closeClassModal();
}

function exportTimetable() {
    // Simple export functionality
    const timetableText = timetableData.map(classItem => 
        `${classItem.day.toUpperCase()}: ${classItem.time} - ${classItem.name} (${classItem.room})`
    ).join('\n');
    
    const blob = new Blob([timetableText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Timetable exported successfully!');
}

function getRandomColor() {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTimetable();
});

// For integration with main navigation
if (typeof initializeTimetable === 'function') {
    initializeTimetable();
}