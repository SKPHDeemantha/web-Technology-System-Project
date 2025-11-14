// Timetable Management System
class TimetableManager {
    constructor() {
        this.timetableData = JSON.parse(localStorage.getItem('timetableData')) || [];
        this.settings = JSON.parse(localStorage.getItem('timetableSettings')) || {
            workStart: '08:00',
            workEnd: '18:00',
            timeSlotDuration: 60,
            showWeekends: true
        };
        this.currentView = 'week';
        this.initializeEventListeners();
        this.renderTimetable();
        this.updateStats();
        this.updateUpcomingClasses();
    }

    initializeEventListeners() {
        // Modal events
        document.getElementById('addTimetableModal').addEventListener('show.bs.modal', () => {
            this.resetForm();
        });

        // Form submission
        document.getElementById('saveTimetableEntry').addEventListener('click', () => {
            this.saveTimetableEntry();
        });

        // View toggle
        document.getElementById('weekView').addEventListener('click', () => {
            this.switchView('week');
        });

        document.getElementById('dayView').addEventListener('click', () => {
            this.switchView('day');
        });

        // Quick actions
        document.getElementById('exportTimetable').addEventListener('click', () => {
            this.exportTimetable();
        });

        document.getElementById('clearTimetable').addEventListener('click', () => {
            this.clearTimetable();
        });

        // Settings
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        new bootstrap.Modal(document.getElementById('addTimetableModal')).show();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportTimetable();
                        break;
                }
            }
        });
    }

    resetForm() {
        document.getElementById('timetableForm').reset();
        document.getElementById('editIndex').value = '-1';
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-calendar-plus me-2"></i>Add New Class';
    }

    saveTimetableEntry() {
        const form = document.getElementById('timetableForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const entry = {
            id: Date.now(),
            subject: document.getElementById('subject').value,
            courseCode: document.getElementById('courseCode').value,
            day: document.getElementById('day').value,
            room: document.getElementById('room').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            classType: document.getElementById('classType').value,
            notes: document.getElementById('notes').value
        };

        const editIndex = parseInt(document.getElementById('editIndex').value);
        if (editIndex >= 0) {
            entry.id = this.timetableData[editIndex].id;
            this.timetableData[editIndex] = entry;
        } else {
            this.timetableData.push(entry);
        }

        this.saveToStorage();
        this.renderTimetable();
        this.updateStats();
        this.updateUpcomingClasses();

        bootstrap.Modal.getInstance(document.getElementById('addTimetableModal')).hide();
        this.showToast(editIndex >= 0 ? 'Class updated successfully!' : 'Class added successfully!', 'success');
    }

    editTimetableEntry(index) {
        const entry = this.timetableData[index];
        document.getElementById('subject').value = entry.subject;
        document.getElementById('courseCode').value = entry.courseCode;
        document.getElementById('day').value = entry.day;
        document.getElementById('room').value = entry.room;
        document.getElementById('startTime').value = entry.startTime;
        document.getElementById('endTime').value = entry.endTime;
        document.getElementById('classType').value = entry.classType;
        document.getElementById('notes').value = entry.notes;
        document.getElementById('editIndex').value = index;
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Class';

        new bootstrap.Modal(document.getElementById('addTimetableModal')).show();
    }

    deleteTimetableEntry(index) {
        if (confirm('Are you sure you want to delete this class?')) {
            this.timetableData.splice(index, 1);
            this.saveToStorage();
            this.renderTimetable();
            this.updateStats();
            this.updateUpcomingClasses();
            this.showToast('Class deleted successfully!', 'danger');
        }
    }

    renderTimetable() {
        const grid = document.getElementById('timetableGrid');
        grid.innerHTML = '';

        // Create header
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const timeSlots = this.generateTimeSlots();

        // Time column header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'time-column day-column';
        timeHeader.textContent = 'Time';
        grid.appendChild(timeHeader);

        // Day headers
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-column';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        // Create time slots
        timeSlots.forEach(time => {
            // Time column
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-column time-slot';
            timeSlot.textContent = time;
            grid.appendChild(timeSlot);

            // Day slots
            days.forEach(day => {
                const daySlot = document.createElement('div');
                daySlot.className = 'day-slot';
                daySlot.dataset.day = day.toLowerCase();
                daySlot.dataset.time = time;
                grid.appendChild(daySlot);
            });
        });

        // Render classes
        this.timetableData.forEach((entry, index) => {
            this.renderClassCard(entry, index);
        });

        // Add current time indicator
        this.addCurrentTimeIndicator();
    }

    generateTimeSlots() {
        const slots = [];
        const start = this.parseTime(this.settings.workStart);
        const end = this.parseTime(this.settings.workEnd);
        const duration = this.settings.timeSlotDuration;

        for (let time = start; time < end; time += duration * 60 * 1000) {
            slots.push(this.formatTime(time));
        }

        return slots;
    }

    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    }

    formatTime(timeMs) {
        const hours = Math.floor(timeMs / (60 * 60 * 1000));
        const minutes = Math.floor((timeMs % (60 * 60 * 1000)) / (60 * 1000));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    renderClassCard(entry, index) {
        const daySlots = document.querySelectorAll(`[data-day="${entry.day}"]`);
        const startTime = this.parseTime(entry.startTime);
        const endTime = this.parseTime(entry.endTime);

        // Find the appropriate time slot
        const timeSlots = this.generateTimeSlots();
        const startIndex = timeSlots.findIndex(time => this.parseTime(time) >= startTime);
        const endIndex = timeSlots.findIndex(time => this.parseTime(time) >= endTime);

        if (startIndex >= 0 && startIndex < daySlots.length) {
            const slot = daySlots[startIndex];
            const duration = (endTime - startTime) / (60 * 1000); // minutes
            const slotHeight = 60; // pixels per hour
            const height = (duration / 60) * slotHeight;

            const classCard = document.createElement('div');
            classCard.className = `class-card ${entry.classType}`;
            classCard.style.height = `${height}px`;
            classCard.innerHTML = `
                <div class="class-actions">
                    <button class="class-action-btn edit" onclick="timetableManager.editTimetableEntry(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="class-action-btn delete" onclick="timetableManager.deleteTimetableEntry(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="class-subject">${entry.subject}</div>
                <div class="class-details">
                    <div class="class-time">${entry.startTime} - ${entry.endTime}</div>
                    <div class="class-room">${entry.room}</div>
                </div>
            `;

            slot.appendChild(classCard);
        }
    }

    addCurrentTimeIndicator() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDay = now.toLocaleLowerCase().split(',')[0];

        const daySlots = document.querySelectorAll(`[data-day="${currentDay}"]`);
        if (daySlots.length > 0) {
            const timeSlots = this.generateTimeSlots();
            const startTime = this.parseTime(this.settings.workStart);
            const slotDuration = this.settings.timeSlotDuration;

            const slotIndex = Math.floor((currentTime * 60 * 1000 - startTime) / (slotDuration * 60 * 1000));

            if (slotIndex >= 0 && slotIndex < daySlots.length) {
                const slot = daySlots[slotIndex];
                const indicator = document.createElement('div');
                indicator.className = 'current-time-indicator';
                const minutesIntoSlot = (currentTime - timeSlots[slotIndex].split(':').map(Number)[0] * 60 - timeSlots[slotIndex].split(':').map(Number)[1]) * 60 * 1000;
                const position = (minutesIntoSlot / (slotDuration * 60 * 1000)) * 60;
                indicator.style.top = `${position}px`;
                slot.appendChild(indicator);
            }
        }
    }

    updateStats() {
        const totalClasses = this.timetableData.length;
        const thisWeekClasses = this.getThisWeekClasses();
        const weeklyHours = this.calculateWeeklyHours();

        document.getElementById('totalClasses').textContent = totalClasses;
        document.getElementById('thisWeekClasses').textContent = thisWeekClasses;
        document.getElementById('weeklyHours').textContent = weeklyHours;

        // Update next class
        const nextClass = this.getNextClass();
        if (nextClass) {
            document.getElementById('nextClassTime').textContent = nextClass.startTime;
            document.getElementById('nextClassSubject').textContent = nextClass.subject;
        } else {
            document.getElementById('nextClassTime').textContent = '--:--';
            document.getElementById('nextClassSubject').textContent = 'No upcoming class';
        }
    }

    getThisWeekClasses() {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return this.timetableData.filter(entry => {
            // For simplicity, assuming classes repeat weekly
            return true;
        }).length;
    }

    calculateWeeklyHours() {
        let totalMinutes = 0;
        this.timetableData.forEach(entry => {
            const start = this.parseTime(entry.startTime);
            const end = this.parseTime(entry.endTime);
            totalMinutes += (end - start) / (60 * 1000);
        });
        return Math.round(totalMinutes / 60);
    }

    getNextClass() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const todayClasses = this.timetableData.filter(entry => {
            const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(entry.day);
            return dayIndex === currentDay;
        }).filter(entry => {
            const startMinutes = entry.startTime.split(':').map(Number)[0] * 60 + entry.startTime.split(':').map(Number)[1];
            return startMinutes > currentTime;
        }).sort((a, b) => {
            const aMinutes = a.startTime.split(':').map(Number)[0] * 60 + a.startTime.split(':').map(Number)[1];
            const bMinutes = b.startTime.split(':').map(Number)[0] * 60 + b.startTime.split(':').map(Number)[1];
            return aMinutes - bMinutes;
        });

        if (todayClasses.length > 0) {
            return todayClasses[0];
        }

        // If no classes today, find next week's first class
        const nextWeekClasses = this.timetableData.sort((a, b) => {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const aDayIndex = days.indexOf(a.day);
            const bDayIndex = days.indexOf(b.day);
            if (aDayIndex !== bDayIndex) {
                return aDayIndex - bDayIndex;
            }
            const aMinutes = a.startTime.split(':').map(Number)[0] * 60 + a.startTime.split(':').map(Number)[1];
            const bMinutes = b.startTime.split(':').map(Number)[0] * 60 + b.startTime.split(':').map(Number)[1];
            return aMinutes - bMinutes;
        });

        return nextWeekClasses[0];
    }

    updateUpcomingClasses() {
        const upcomingContainer = document.getElementById('upcomingClasses');
        upcomingContainer.innerHTML = '';

        const upcoming = this.getUpcomingClasses(5);
        if (upcoming.length === 0) {
            upcomingContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h5>No Upcoming Classes</h5>
                    <p>Add some classes to see them here.</p>
                </div>
            `;
            return;
        }

        upcoming.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'upcoming-class-item';
            item.innerHTML = `
                <div class="upcoming-class-icon">
                    <i class="fas fa-${this.getClassIcon(entry.classType)}"></i>
                </div>
                <div class="upcoming-class-info">
                    <h6>${entry.subject}</h6>
                    <small>${entry.courseCode} • ${entry.room}</small>
                </div>
                <div class="upcoming-class-time">
                    ${entry.startTime}<br>
                    <small>${entry.day}</small>
                </div>
            `;
            upcomingContainer.appendChild(item);
        });
    }

    getUpcomingClasses(limit = 5) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDay = now.getDay();

        return this.timetableData
            .map(entry => {
                const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(entry.day);
                let daysUntil = dayIndex - currentDay;
                if (daysUntil < 0) daysUntil += 7;
                if (daysUntil === 0) {
                    const startMinutes = entry.startTime.split(':').map(Number)[0] * 60 + entry.startTime.split(':').map(Number)[1];
                    if (startMinutes <= currentTime) daysUntil = 7;
                }
                return { ...entry, daysUntil };
            })
            .sort((a, b) => a.daysUntil - b.daysUntil)
            .slice(0, limit);
    }

    getClassIcon(type) {
        const icons = {
            lecture: 'chalkboard-teacher',
            tutorial: 'users',
            lab: 'flask',
            seminar: 'comments'
        };
        return icons[type] || 'calendar';
    }

    switchView(view) {
        this.currentView = view;
        document.getElementById('weekView').classList.toggle('active', view === 'week');
        document.getElementById('dayView').classList.toggle('active', view === 'day');
        // For now, both views show the same (week view). Day view can be implemented later
        this.renderTimetable();
    }

    exportTimetable() {
        const dataStr = JSON.stringify(this.timetableData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'timetable.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.showToast('Timetable exported successfully!', 'success');
    }

    clearTimetable() {
        if (confirm('Are you sure you want to clear all classes? This action cannot be undone.')) {
            this.timetableData = [];
            this.saveToStorage();
            this.renderTimetable();
            this.updateStats();
            this.updateUpcomingClasses();
            this.showToast('All classes cleared!', 'warning');
        }
    }

    saveSettings() {
        this.settings.workStart = document.getElementById('workStart').value;
        this.settings.workEnd = document.getElementById('workEnd').value;
        this.settings.timeSlotDuration = parseInt(document.getElementById('timeSlotDuration').value);
        this.settings.showWeekends = document.getElementById('showWeekends').checked;

        localStorage.setItem('timetableSettings', JSON.stringify(this.settings));
        this.renderTimetable();
        this.showToast('Settings saved successfully!', 'success');

        bootstrap.Modal.getInstance(document.getElementById('settingsModal')).hide();
    }

    saveToStorage() {
        localStorage.setItem('timetableData', JSON.stringify(this.timetableData));
    }

    showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize the timetable manager when the page loads
let timetableManager;
document.addEventListener('DOMContentLoaded', () => {
    timetableManager = new TimetableManager();
});
