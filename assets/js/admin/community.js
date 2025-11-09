//search and filter
function searchUser() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#userTable tbody tr");
  rows.forEach(row => {
    let user = row.cells[0].innerText.toLowerCase();
    row.style.display = user.includes(input) ? "" : "none";
  });
}

function filterRole() {
  let filter = document.getElementById("roleFilter").value;
  let rows = document.querySelectorAll("#userTable tbody tr");
  rows.forEach(row => {
    let role = row.cells[1].innerText;
    if (filter === "All" || role === filter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

//popup form
const addUserBtn = document.getElementById('addUserBtn');
const popupForm = document.getElementById('popupForm');
const closeBtn = document.getElementById('closeBtn');
const userForm = document.getElementById('userForm');

// Show popup
function showForm() {
  document.getElementById('popupForm').style.display = 'flex';

}

// Close popup
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
}

//notification
function notification() {
  document.getElementById('userForm').reset(); 
  document.getElementById('popupForm').style.display = 'none';
  alert("User created successfully!");

}

// Example: click handler for manage buttons
const buttons = document.querySelectorAll('.manage-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Manage Community clicked!');
  });
});

