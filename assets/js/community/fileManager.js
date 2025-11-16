// File Management Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the file manager page
  if (document.getElementById("recentFilesTable")) {
    initializeFileManager();
  }
});

function initializeFileManager() {
  // Initialize files from localStorage or use sample data
  let files = JSON.parse(localStorage.getItem("communityFiles")) || [
    {
      id: 1,
      name: "Project Guidelines.pdf",
      size: "2.4 MB",
      type: "pdf",
      uploadedBy: "John Doe",
      uploadedAt: new Date().toISOString(),
      downloads: 15,
      community: "Computer Science Club",
    },
    {
      id: 2,
      name: "Study Materials.zip",
      size: "15.7 MB",
      type: "zip",
      uploadedBy: "Jane Smith",
      uploadedAt: new Date().toISOString(),
      downloads: 8,
      community: "Math Study Group",
    },
    {
      id: 3,
      name: "Meeting Notes.docx",
      size: "1.2 MB",
      type: "docx",
      uploadedBy: "Mike Johnson",
      uploadedAt: new Date().toISOString(),
      downloads: 23,
      community: "Business Leaders Forum",
    },
    {
      id: 4,
      name: "Presentation.pptx",
      size: "5.1 MB",
      type: "pptx",
      uploadedBy: "Alice Brown",
      uploadedAt: new Date().toISOString(),
      downloads: 12,
      community: "Business Leaders Forum",
    },
    {
      id: 5,
      name: "Logo.png",
      size: "1.8 MB",
      type: "png",
      uploadedBy: "Bob Wilson",
      uploadedAt: new Date().toISOString(),
      downloads: 7,
      community: "Design Club",
    },
  ];

  let currentFilter = "all";

  // DOM Elements
  const recentFilesTable = document.getElementById("recentFilesTable");
  const uploadFileForm = document.getElementById("uploadFileForm");

  // Initialize file manager
  function initFileManager() {
    renderFilesTable();
  }

  // Render files table
  function renderFilesTable() {
    if (!recentFilesTable) return;

    // Filter files based on current filter
    let filteredFiles = files;
    if (currentFilter !== "all") {
      if (currentFilter === "pdf") {
        filteredFiles = files.filter((file) => file.type === "pdf");
      } else if (currentFilter === "image") {
        filteredFiles = files.filter((file) =>
          ["jpg", "jpeg", "png", "gif"].includes(file.type)
        );
      } else if (currentFilter === "archive") {
        filteredFiles = files.filter((file) =>
          ["zip", "rar"].includes(file.type)
        );
      } else if (currentFilter === "other") {
        filteredFiles = files.filter(
          (file) =>
            !["pdf", "jpg", "jpeg", "png", "gif", "zip", "rar"].includes(
              file.type
            )
        );
      }
    }

    if (filteredFiles.length === 0) {
      recentFilesTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="fas fa-folder-open fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No files found in this category</p>
                        <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#uploadFileModal">
                            <i class="fas fa-upload me-1"></i> Upload First File
                        </button>
                    </td>
                </tr>
            `;
      return;
    }

    recentFilesTable.innerHTML = filteredFiles
      .map((file) => {
        const uploadedDate = new Date(file.uploadedAt);
        const formattedDate = uploadedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const fileIcon = getFileIcon(file.type);

        return `
                <thead class="file-item">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="file-icon me-3">
                                <i class="${fileIcon}"></i>
                            </div>
                            <div>
                                <div class="fw-bold">${file.name}</div>
                                <small class="text-muted">${file.community}</small>
                            </div>
                        </div>
                    </td>
                    <td>${file.size}</td>
                    <td>${file.uploadedBy}</td>
                    <td>${formattedDate}</td>
                    <td>${file.downloads}</td>
                    <td>
                        <div class="file-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="downloadFile(${file.id})">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="shareFile(${file.id})">
                                <i class="fas fa-share"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteFile(${file.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </thead>
            `;
      })
      .join("");
  }

  // Get file icon based on file type
  function getFileIcon(fileType) {
    const iconMap = {
      pdf: "fas fa-file-pdf text-danger",
      docx: "fas fa-file-word text-primary",
      doc: "fas fa-file-word text-primary",
      xlsx: "fas fa-file-excel text-success",
      xls: "fas fa-file-excel text-success",
      pptx: "fas fa-file-powerpoint text-warning",
      ppt: "fas fa-file-powerpoint text-warning",
      zip: "fas fa-file-archive text-secondary",
      rar: "fas fa-file-archive text-secondary",
      jpg: "fas fa-file-image text-info",
      jpeg: "fas fa-file-image text-info",
      png: "fas fa-file-image text-info",
      gif: "fas fa-file-image text-info",
      txt: "fas fa-file-alt text-muted",
      default: "fas fa-file text-muted",
    };

    return iconMap[fileType] || iconMap.default;
  }

  // Upload file
  if (uploadFileForm) {
    uploadFileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fileInput = document.getElementById("fileUpload");
      const fileTitle = document.getElementById("fileTitle").value;
      const fileDescription = document.getElementById("fileDescription").value;
      const fileCommunity = document.getElementById("fileCommunity").value;
      const fileTags = document
        .getElementById("fileTags")
        .value.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      const isPublic = document.getElementById("filePublic").checked;

      if (!fileInput.files[0]) {
        alert("Please select a file to upload");
        return;
      }

      const file = fileInput.files[0];
      const fileType = file.name.split(".").pop().toLowerCase();
      const fileName = fileTitle || file.name;

      const newFile = {
        id: files.length > 0 ? Math.max(...files.map((f) => f.id)) + 1 : 1,
        name: fileName,
        originalName: file.name,
        size: formatFileSize(file.size),
        type: fileType,
        description: fileDescription,
        tags: fileTags,
        community: fileCommunity || "General",
        isPublic: isPublic,
        uploadedBy: "Student User",
        uploadedAt: new Date().toISOString(),
        downloads: 0,
      };

      files.push(newFile);
      saveFiles();
      renderFilesTable();

      // Close modal and reset form
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("uploadFileModal")
      );
      modal.hide();
      uploadFileForm.reset();

      showToast("File uploaded successfully!", "success");
    });
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Save files to localStorage
  function saveFiles() {
    localStorage.setItem("communityFiles", JSON.stringify(files));
  }

  // Action functions
  window.downloadFile = function (fileId) {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      file.downloads++;
      saveFiles();
      renderFilesTable();
      showToast(`Downloading file: ${file.name}`, "success");

      // Simulate download
      setTimeout(() => {
        showToast(`${file.name} downloaded successfully!`, "info");
      }, 1000);
    }
  };

  window.shareFile = function (fileId) {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      const shareUrl = `${window.location.origin}/files/${file.id}`;
      if (navigator.share) {
        navigator.share({
          title: file.name,
          text: file.description,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        showToast("File link copied to clipboard!", "info");
      }
    }
  };

  window.deleteFile = function (fileId) {
    const file = files.find((f) => f.id === fileId);
    if (file && confirm(`Are you sure you want to delete "${file.name}"?`)) {
      files = files.filter((f) => f.id !== fileId);
      saveFiles();
      renderFilesTable();
      showToast("File deleted successfully", "success");
    }
  };

  // Filter files function
  window.filterFiles = function (category) {
    currentFilter = category;

    // Update active link in sidebar
    const navLinks = document.querySelectorAll("#sidebar .nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Find the link that matches the category and add active class
    const categoryLinks = document.querySelectorAll(
      '#sidebar .nav-link[onclick*="filterFiles"]'
    );
    categoryLinks.forEach((link) => {
      const onclickAttr = link.getAttribute("onclick");
      if (onclickAttr && onclickAttr.includes(`'${category}'`)) {
        link.classList.add("active");
      }
    });

    renderFilesTable();
  };

  // Initialize file manager functionality
  initFileManager();
}
