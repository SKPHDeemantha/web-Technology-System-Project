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
  alert('Signup successful! Please login.');

  // Redirect to login
  window.location.href = 'index.html';
});

// Google OAuth placeholder
document.getElementById('googleLogin').addEventListener('click', () => {
  alert('Google OAuth login flow to be implemented.');
});
