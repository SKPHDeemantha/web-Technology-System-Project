const addBtn = document.getElementById("addCourseBtn");
  const popupForm = document.getElementById("popupForm");
  const closeBtn = document.getElementById("closeForm");
  const courseForm = document.getElementById("courseForm");
  const tableBody = document.querySelector("#courseTable tbody");
  const searchInput = document.getElementById("searchInput");
  let editRow = null;

  // Open popup
  addBtn.onclick = () => {
    popupForm.style.display = "flex";
    courseForm.reset();
    editRow = null;
  };

  // Close popup
  closeBtn.onclick = () => {
    popupForm.style.display = "none";
  };

  // Add or Edit Course
  courseForm.onsubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("courseCode").value;
    const name = document.getElementById("courseName").value;
    const instructor = document.getElementById("instructor").value;
    const students = document.getElementById("students").value;

    if (editRow) {
      editRow.children[0].textContent = code;
      editRow.children[1].textContent = name;
      editRow.children[2].textContent = instructor;
      editRow.children[3].textContent = students;
      editRow = null;
    } else {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td>${instructor}</td>
        <td>${students}</td>
        <td>
          <button class="edit-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </td>`;
      tableBody.appendChild(newRow);
    }

    popupForm.style.display = "none";
    attachEventListeners();
  };

  // Delete & Edit
  function attachEventListeners() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = () => btn.closest("tr").remove();
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = () => {
        editRow = btn.closest("tr");
        document.getElementById("courseCode").value = editRow.children[0].textContent;
        document.getElementById("courseName").value = editRow.children[1].textContent;
        document.getElementById("instructor").value = editRow.children[2].textContent;
        document.getElementById("students").value = editRow.children[3].textContent;
        popupForm.style.display = "flex";
      };
    });
  }

  attachEventListeners();

  // Search Filter
  searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll("#courseTable tbody tr").forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });