/* -------------------------------
   ROLE BASED YEAR SHOW/HIDE
---------------------------------*/
const roleSelect = document.getElementById('role');
const yearSelect = document.getElementById('year');
const yearLabel = document.getElementById('yearLabel');

if (roleSelect) {
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
}


/* -------------------------------
   SIGNUP FORM HANDLER
---------------------------------*/
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('signupPassword').value;
    const rePassword = document.getElementById('rePassword').value;
    const role = roleSelect.value;
    let year = "";

    if (!fullName || !email || !password || !rePassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== rePassword) {
      alert("Passwords do not match.");
      return;
    }

    if (role === "student") {
      year = yearSelect.value;
      if (!year) {
        alert("Please select your year.");
        return;
      }
    }

    signupHandler(fullName, email, password, role, year);
  });
}


/* -------------------------------
   LOGIN FORM HANDLER
---------------------------------*/
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let year = "";

    if (!role || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (role === 'student') {
      year = document.getElementById('year').value;
      if (!year) {
        alert("Please select your year.");
        return;
      }
    }

    loginHandler(email, password, role, year);
  });
}


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


/* -------------------------------
   SIGNUP AJAX
---------------------------------*/
function signupHandler(fullname, email, password, role, year) {
  $.ajax({
    url: "fileHandling/signuphandling.php?id=save",
    type: "POST",
    data: { fullname, email, password, role, year },
    success: function (response) {
      if (response == 1) {
        alert("Account created successfully!");
        window.location.href = "index.php";
      } else {
        alert("Saving Error!");
      }
    },
    error: function () {
      alert("AJAX Error!");
    }
  });
}


/* -------------------------------
   LOGIN AJAX
---------------------------------*/
function loginHandler(email, password, role, year) {
  $.ajax({
    url: "fileHandling/signuphandling.php?id=check",
    type: "POST",
    data: { email, password, role, year },
    success: function (response) {
      if (response == 1) {
        alert("Login Successful!");

        if (role === 'admin') {
          window.location.href = 'admin/admin-panel.html';
        } else {
          window.location.href = 'community/communities.html';
        }
      } else {
        alert("Invalid credentials or user not found!");
      }
    },
    error: function () {
      alert("AJAX Error!");
    }
  });
}
