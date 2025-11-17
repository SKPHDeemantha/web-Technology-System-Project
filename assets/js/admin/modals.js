// Form Submissions for Modals
document.addEventListener('DOMContentLoaded', function() {
  const addUserForm = document.getElementById('addUserForm');
  if (addUserForm) {
    addUserForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('userName').value;
      const role = document.getElementById('userRole').value;
      const email = document.getElementById('userEmail').value;

      const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
      const newUser = {
        id: Date.now(),
        name,
        role,
        email,
        status: 'Active'
      };

      users.push(newUser);
      localStorage.setItem('adminUsers', JSON.stringify(users));

      // Add to activity log
      addToActivityLog(`Added new user: ${name} (${role})`);

      // Update UI
      renderUsersTable(document.getElementById('userFilter').value);
      updateDashboardStats();

      // Close modal and reset form
      bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
      this.reset();

      // Show success message
      showAlert('User added successfully!', 'success');
    });
  }

  const addCommunityForm = document.getElementById('addCommunityForm');
  if (addCommunityForm) {
    addCommunityForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('communityName').value;
      const description = document.getElementById('communityDesc').value;
      const category = document.getElementById('communityCategory').value;

      const communities = JSON.parse(localStorage.getItem('adminCommunities')) || [];
      const newCommunity = {
        id: Date.now(),
        name,
        description,
        category,
        members: 0
      };

      communities.push(newCommunity);
      localStorage.setItem('adminCommunities', JSON.stringify(communities));

      // Add to activity log
      addToActivityLog(`Created new community: ${name}`);

      // Update UI
      renderCommunitiesTable();
      updateDashboardStats();

      // Close modal and reset form
      bootstrap.Modal.getInstance(document.getElementById('addCommunityModal')).hide();
      this.reset();

      // Show success message
      showAlert('Community created successfully!', 'success');
    });
  }

  const addEventForm = document.getElementById('addEventForm');
  if (addEventForm) {
    addEventForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('eventName').value;
      const date = document.getElementById('eventDate').value;
      const time = document.getElementById('eventTime').value;
      const location = document.getElementById('eventLocation').value;
      const description = document.getElementById('eventDescription').value;

      const events = JSON.parse(localStorage.getItem('adminEvents')) || [];
      const newEvent = {
        id: Date.now(),
        name,
        date,
        time,
        location,
        description,
        status: 'Upcoming'
      };

      events.push(newEvent);
      localStorage.setItem('adminEvents', JSON.stringify(events));

      // Add to activity log
      addToActivityLog(`Scheduled new event: ${name}`);

      // Update UI
      renderEventsTable(document.getElementById('eventMonthFilter').value);
      updateDashboardStats();

      // Close modal and reset form
      bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
      this.reset();

      // Show success message
      showAlert('Event scheduled successfully!', 'success');
    });
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // In a real application, this would save to a backend
      showAlert('Settings saved successfully!', 'success');

      // Add to activity log
      addToActivityLog('Updated system settings');
    });
  }
});
