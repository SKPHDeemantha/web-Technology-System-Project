// Header Functions
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        // In a real application, this would clear the session
        showAlert('You have been logged out successfully!', 'info');

        // Redirect to login page after a delay
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }
    });
  }
});
