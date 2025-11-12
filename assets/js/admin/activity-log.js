// Sample activity log data (simulating database)
const activityLogs = [
  { user: "John Doe", role: "Student", action: "Registered for course CS101", time: "2023-10-15T09:30:00" },
  { user: "Admin User", role: "Admin", action: "Created new community 'Math Study Group'", time: "2023-10-14T14:22:00" },
  { user: "Jane Smith", role: "Lecturer", action: "Uploaded new lecture materials", time: "2023-10-14T11:05:00" },
  { user: "Chris Brown", role: "Student", action: "Joined community 'CS Project Team'", time: "2023-10-13T16:45:00" },
  { user: "Admin User", role: "Admin", action: "Updated system settings", time: "2023-10-12T10:15:00" }
];

const tableBody = document.querySelector("#activityTable tbody");
const filterUser = document.getElementById("filterUser");
const filterRole = document.getElementById("filterRole");
const filterAction = document.getElementById("filterAction");
const filterDate = document.getElementById("filterDate");
const exportBtn = document.getElementById("exportBtn");

// Load table data
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(log => {
    const row = `
      <tr>
        <td>${log.user}</td>
        <td>${log.role}</td>
        <td>${log.action}</td>
        <td>${formatDate(log.time)}</td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Filter Function
function filterLogs() {
  const selectedUser = filterUser.value;
  const selectedRole = filterRole.value;
  const selectedAction = filterAction.value;
  const selectedDate = filterDate.value;

  const filtered = activityLogs.filter(log => {
    const matchUser = selectedUser === "All" || log.user === selectedUser;
    const matchRole = selectedRole === "All" || log.role === selectedRole;
    const matchAction = selectedAction === "All" || log.action === selectedAction;
    const matchDate = !selectedDate || log.time.startsWith(selectedDate);
    return matchUser && matchRole && matchAction && matchDate;
  });

  renderTable(filtered);
  return filtered;
}

// Event Listeners
[filterUser, filterRole, filterAction, filterDate].forEach(el => el.addEventListener("change", filterLogs));

// Initial load
renderTable(activityLogs);

// ✅ Export Logs as CSV
exportBtn.addEventListener("click", () => {
  const filteredData = filterLogs(); // export only filtered logs
  if (filteredData.length === 0) {
    alert("No logs available to export!");
    return;
  }

  // Convert data to CSV format
  const headers = ["User", "Role", "Action", "Time"];
  const rows = filteredData.map(log => [
    `"${log.user}"`,
    `"${log.role}"`,
    `"${log.action}"`,
    `"${formatDate(log.time)}"`
  ]);

  const csvContent =
    [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Activity_Logs_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert("✅ Logs exported successfully as CSV!");
});
