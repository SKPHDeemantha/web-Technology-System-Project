const roleSelect = document.getElementById('role');
const yearSelect = document.getElementById('year');
const yearLabel = document.getElementById('yearLabel');

roleSelect.addEventListener('change', () => {
  if (roleSelect.value === 'student') {
    yearSelect.style.display = 'block';
    yearLabel.style.display = 'block';
    yearSelect.setAttribute('required', 'required');
  } else {
    yearSelect.style.display = 'none';
    yearLabel.style.display = 'none';
    yearSelect.removeAttribute('required');
  }
});

document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();

  // Collect form data
  const name = e.target[0].value.trim(); // Full Name
  const email = e.target[1].value.trim(); // Email
  const password = e.target[2].value; // Password
  const retypePassword = e.target[3].value; // Re-type Password
  const role = roleSelect.value;
  const year = yearSelect.value;

  // Basic validation
  if (!name || !email || !password || !retypePassword) {
    alert('Please fill in all fields.');
    return;
  }
  if (password !== retypePassword) {
    alert('Passwords do not match.');
    return;
  }
  if (!role) {
    alert('Please select a role.');
    return;
  }
  if (role === 'student' && !year) {
    alert('Please select your year.');
    return;
  }

  // Mock signup logic (store user data)
  const userData = { name, email, role, year: role === 'student' ? year : null };

  // For demo, store in localStorage (in real app, send to server)
  localStorage.setItem('signedUpUser', JSON.stringify(userData));
  localStorage.setItem('auth.user', JSON.stringify(userData)); // Also store as auth.user for consistency
  alert('Signup successful! Please login.');

  // Redirect to login
  window.location.href = 'index.html';
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();

  const role = document.getElementById('role').value;
  const year = document.getElementById('year').value;
  const email = e.target[2].value.trim(); // Email input
  const password = e.target[3].value; // Password input

  // Basic validation
  if (!role || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }
  if (role === 'student' && !year) {
    alert('Please select your year.');
    return;
  }

  // Mock login logic - check against signed up user
  const signedUpUser = JSON.parse(localStorage.getItem('signedUpUser'));
  if (signedUpUser && signedUpUser.email === email) {
    // Store authenticated user
    localStorage.setItem('auth.user', JSON.stringify(signedUpUser));
    alert('Login successful!');

    // Redirect based on role
    if (role === 'admin') {
      window.location.href = 'admin/admin-panel.html';
    } else {
      window.location.href = 'community/communities.html';
    }
  } else {
    alert('Invalid credentials or user not found.');
  }
});

// Role change handler for login
document.getElementById('role').addEventListener('change', () => {
  const role = document.getElementById('role').value;
  const yearGroup = document.getElementById('yearGroup');
  if (role === 'student') {
    yearGroup.style.display = 'block';
  } else {
    yearGroup.style.display = 'none';
  }
});

// Password toggle
document.querySelector('.toggle-password').addEventListener('click', function() {
  const passwordInput = document.getElementById('signupPassword');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

// Google OAuth placeholder
document.getElementById('googleLogin').addEventListener('click', () => {
  alert('Google OAuth login flow to be implemented.');
});
