// Event Management Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the events page
  if (document.getElementById("eventsTableBody")) {
    initializeEventsPage();
  }

  // Check if we're on the create event page (standalone form)
  if (
    document.getElementById("createEventForm") &&
    !document.getElementById("eventsTableBody")
  ) {
    initializeCreateEventPage();
  }

  // Check if we're on the event detail page
  if (document.getElementById("eventDetail")) {
    initializeEventDetailPage();
  }

  // Check if we're on the edit event page
  if (document.getElementById("editEventForm")) {
    initializeEditEventPage();
  }
});

function initializeEventsPage() {
  // Initialize events from localStorage or use sample data
  let events = [];
  try {
    const storedEvents = localStorage.getItem("communityEvents");
    events = storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    events = [];
    showToast("Error loading saved events, using default data", "warning");
  }

  // If no events in localStorage, use sample data
  if (events.length === 0) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    events = [
      {
        id: 1,
        title: "Web Development Workshop",
        date: nextWeek.toISOString().split("T")[0],
        time: "14:00",
        location: "Tech Lab A",
        description:
          "Learn modern web development techniques including React, Node.js, and database integration",
        type: "workshop",
        attendees: 15,
        createdBy: "Student User",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Monthly Community Meeting",
        date: nextMonth.toISOString().split("T")[0],
        time: "18:00",
        location: "Community Hall",
        description:
          "Monthly community gathering and planning session to discuss upcoming projects and initiatives",
        type: "meeting",
        attendees: 25,
        createdBy: "Student User",
        createdAt: new Date().toISOString(),
      },
    ];
    // Save sample data to localStorage
    localStorage.setItem("communityEvents", JSON.stringify(events));
  }

  // DOM Elements
  const eventsTableBody = document.getElementById("eventsTableBody");
  const createEventForm = document.getElementById("createEventForm");
  const eventFilter = document.getElementById("eventFilter");
  const totalEventsCount = document.getElementById("totalEventsCount");
  const upcomingEventsCount = document.getElementById("upcomingEventsCount");
  const thisMonthEventsCount = document.getElementById("thisMonthEventsCount");
  const totalAttendeesCount = document.getElementById("totalAttendeesCount");

  // Initialize the events display
  function initEvents() {
    renderEventsTable();
    updateEventStats();

    // Set minimum date to today for event creation
    const today = new Date().toISOString().split("T")[0];
    if (document.getElementById("eventDate")) {
      document.getElementById("eventDate").min = today;
    }
  }

  // Render events table
  function renderEventsTable(filterType = "all") {
    if (!eventsTableBody) return;

    eventsTableBody.innerHTML = "";

    const filteredEvents =
      filterType === "all"
        ? events
        : events.filter((event) => event.type === filterType);

    if (filteredEvents.length === 0) {
      eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="fas fa-calendar-times fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No events found</p>
                    </td>
                </tr>
            `;
      return;
    }

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <div class="bg-primary text-white rounded p-2 text-center" style="width: 50px;">
                                <div class="fw-bold">${eventDate.getDate()}</div>
                                <small>${eventDate.toLocaleDateString("en-US", {
                                  month: "short",
                                })}</small>
                            </div>
                        </div>
                        <div>
                            <h6 class="mb-0">${event.title}</h6>
                            <small class="text-muted">${
                              event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)
                            }</small>
                        </div>
                    </div>
                </td>
                <td>${formattedDate} at ${event.time}</td>
                <td>${event.location}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-users text-muted me-1"></i>
                        <span>${event.attendees}</span>
                    </div>
                </td>
                <td>
                    <div class="event-actions">
                        <button class="btn btn-sm btn-outline-primary view-event" data-id="${
                          event.id
                        }">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary edit-event" data-id="${
                          event.id
                        }">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-event" data-id="${
                          event.id
                        }">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      eventsTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll(".view-event").forEach((btn) => {
      btn.addEventListener("click", function () {
        const eventId = parseInt(this.getAttribute("data-id"));
        viewEvent(eventId);
      });
    });

    document.querySelectorAll(".edit-event").forEach((btn) => {
      btn.addEventListener("click", function () {
        const eventId = parseInt(this.getAttribute("data-id"));
        editEvent(eventId);
      });
    });

    document.querySelectorAll(".delete-event").forEach((btn) => {
      btn.addEventListener("click", function () {
        const eventId = parseInt(this.getAttribute("data-id"));
        deleteEvent(eventId);
      });
    });
  }

  // Update event statistics
  function updateEventStats() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Total events
    if (totalEventsCount) totalEventsCount.textContent = events.length;

    // Upcoming events (from today onward)
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
    if (upcomingEventsCount)
      upcomingEventsCount.textContent = upcomingEvents.length;

    // Events this month
    const thisMonthEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
    if (thisMonthEventsCount)
      thisMonthEventsCount.textContent = thisMonthEvents.length;

    // Total attendees
    const totalAttendees = events.reduce(
      (sum, event) => sum + event.attendees,
      0
    );
    if (totalAttendeesCount) totalAttendeesCount.textContent = totalAttendees;
  }

  // View event details
  function viewEvent(eventId) {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      // Navigate to event detail page
      window.location.href = `event-detail.html?id=${eventId}`;
    }
  }

  // Edit event
  function editEvent(eventId) {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      // Navigate to edit event page with the event ID
      window.location.href = `edit-event.html?id=${eventId}`;
    }
  }

  // Delete event
  function deleteEvent(eventId) {
    const event = events.find((e) => e.id === eventId);
    if (event && confirm(`Are you sure you want to delete "${event.title}"?`)) {
      events = events.filter((e) => e.id !== eventId);
      saveEvents();
      renderEventsTable(eventFilter ? eventFilter.value : "all");
      updateEventStats();
      showToast("Event deleted successfully", "success");
    }
  }

  // Create new event
  if (createEventForm) {
    createEventForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("eventTitle").value;
      const date = document.getElementById("eventDate").value;
      const time = document.getElementById("eventTime").value;
      const location = document.getElementById("eventLocation").value;
      const description = document.getElementById("eventDescription").value;
      const type = document.getElementById("eventType").value;

      // Validate date is not in the past
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        alert("Event date cannot be in the past");
        return;
      }

      const newEvent = {
        id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1,
        title,
        date,
        time,
        location,
        description,
        type,
        attendees: 0,
        createdBy: "Student User",
        createdAt: new Date().toISOString(),
      };

      events.push(newEvent);
      saveEvents();
      renderEventsTable(eventFilter ? eventFilter.value : "all");
      updateEventStats();

      // Close modal and reset form
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("createEventModal")
      );
      modal.hide();
      createEventForm.reset();

      showToast("Event created successfully", "success");
    });
  }

  // Filter events by type
  if (eventFilter) {
    eventFilter.addEventListener("change", function () {
      renderEventsTable(this.value);
    });
  }

  // Search events
  const eventSearch = document.getElementById("eventSearch");
  const searchBtn = document.getElementById("searchBtn");

  if (eventSearch && searchBtn) {
    // Search on button click
    searchBtn.addEventListener("click", function () {
      performSearch();
    });

    // Search on Enter key press
    eventSearch.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });

    // Real-time search with debounce
    let searchTimeout;
    eventSearch.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(performSearch, 300);
    });
  }

  function performSearch() {
    const searchTerm = eventSearch.value.toLowerCase().trim();
    const filterType = eventFilter ? eventFilter.value : "all";

    if (!searchTerm) {
      // If no search term, just filter by type
      renderEventsTable(filterType);
      return;
    }

    // Filter events by search term and type
    const filteredEvents = events.filter((event) => {
      const matchesType = filterType === "all" || event.type === filterType;
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.type.toLowerCase().includes(searchTerm);

      return matchesType && matchesSearch;
    });

    // Render filtered results
    renderEventsTableWithData(filteredEvents);

    // Show search results message
    if (filteredEvents.length === 0) {
      showToast(`No events found matching "${searchTerm}"`, "info");
    } else {
      showToast(
        `Found ${filteredEvents.length} event(s) matching "${searchTerm}"`,
        "success"
      );
    }
  }

  // Modified render function to accept custom data
  function renderEventsTableWithData(eventData) {
    if (!eventsTableBody) return;

    eventsTableBody.innerHTML = "";

    if (eventData.length === 0) {
      eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="fas fa-calendar-times fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No events found</p>
                    </td>
                </tr>
            `;
      return;
    }

    eventData.forEach((event) => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <div class="bg-primary text-white rounded p-2 text-center" style="width: 50px;">
                                <div class="fw-bold">${eventDate.getDate()}</div>
                                <small>${eventDate.toLocaleDateString("en-US", {
                                  month: "short",
                                })}</small>
                            </div>
                        </div>
                        <div>
                            <h6 class="mb-0">${event.title}</h6>
                            <small class="text-muted">${
                              event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)
                            }</small>
                        </div>
                    </div>
                </td>
                <td>${formattedDate} at ${event.time}</td>
                <td>${event.location}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-users text-muted me-1"></i>
                        <span>${event.attendees}</span>
                    </div>
                </td>
                <td>
                    <div class="event-actions">
                        <button class="btn btn-sm btn-outline-primary view-event" data-id="${
                          event.id
                        }">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary edit-event" data-id="${
                          event.id
                        }">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-event" data-id="${
                          event.id
                        }">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      eventsTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll(".view-event").forEach((btn) => {
      btn.addEventListener("click", function () {
        const eventId = parseInt(this.getAttribute("data-id"));
        viewEvent(eventId);
      });
    });

    document.querySelectorAll(".edit-event").forEach((btn) => {
      btn.addEventListener("click", function () {
        const eventId = parseInt(this.getAttribute("data-id"));
        editEvent(eventId);
      });
    });

    document.querySelectorAll(".delete-event").forEach((btn) => {
      btn.addEventListener("click", function () {
        const eventId = parseInt(this.getAttribute("data-id"));
        deleteEvent(eventId);
      });
    });
  }

  // Save events to localStorage
  function saveEvents() {
    try {
      localStorage.setItem("communityEvents", JSON.stringify(events));
    } catch (error) {
      console.error("Error saving events to localStorage:", error);
      showToast("Error saving event data", "error");
    }
  }

  // Initialize events functionality
  initEvents();
}

function initializeEventDetailPage() {
  // Get event ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = parseInt(urlParams.get("id"));

  if (!eventId) {
    showErrorState("Invalid event ID");
    return;
  }

  // Load events from localStorage
  let events = [];
  try {
    const storedEvents = localStorage.getItem("communityEvents");
    events = storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    showErrorState("Error loading event data");
    return;
  }

  // Find the event
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    showErrorState("Event not found");
    return;
  }

  // Render event details
  renderEventDetails(event);

  // Initialize event actions
  initializeEventActions(event, events);
}

function showErrorState(message) {
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("eventContent").style.display = "none";
  document.getElementById("errorState").style.display = "block";

  // Update error message if provided
  if (message) {
    const errorAlert = document.querySelector("#errorState .alert");
    errorAlert.innerHTML = `
            <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
            <h5>Event Not Found</h5>
            <p>${message}</p>
            <a href="events.html" class="btn btn-primary">Back to Events</a>
        `;
  }
}

function renderEventDetails(event) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventContent = document.getElementById("eventContent");
  eventContent.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <div class="d-flex align-items-start mb-3">
                            <div class="me-4">
                                <div class="bg-primary text-white rounded p-3 text-center" style="width: 80px; height: 80px;">
                                    <div class="fw-bold fs-4">${eventDate.getDate()}</div>
                                    <small>${eventDate.toLocaleDateString(
                                      "en-US",
                                      { month: "short" }
                                    )}</small>
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <h3 class="card-title mb-2">${event.title}</h3>
                                <div class="mb-3">
                                    <span class="badge bg-secondary me-2">${
                                      event.type.charAt(0).toUpperCase() +
                                      event.type.slice(1)
                                    }</span>
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>${formattedDate} at ${
    event.time
  }
                                    </small>
                                </div>
                                <div class="mb-3">
                                    <i class="fas fa-map-marker-alt text-muted me-2"></i>
                                    <strong>Location:</strong> ${event.location}
                                </div>
                                <div class="mb-3">
                                    <i class="fas fa-users text-muted me-2"></i>
                                    <strong>Attendees:</strong> ${
                                      event.attendees
                                    }
                                </div>
                                <div class="mb-3">
                                    <i class="fas fa-user text-muted me-2"></i>
                                    <strong>Created by:</strong> ${
                                      event.createdBy
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h5>Description</h5>
                            <p class="text-muted">${
                              event.description || "No description provided."
                            }</p>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h5>Event Actions</h5>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" id="joinEventBtn">
                                        <i class="fas fa-calendar-plus"></i> Join Event
                                    </button>
                                    <button class="btn btn-outline-secondary" id="editEventBtn">
                                        <i class="fas fa-edit"></i> Edit Event
                                    </button>
                                    <button class="btn btn-outline-danger" id="deleteEventBtn">
                                        <i class="fas fa-trash"></i> Delete Event
                                    </button>
                                    <button class="btn btn-outline-secondary">
                                        <i class="fas fa-share"></i> Share Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Hide loading and show content
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("eventContent").style.display = "block";
}

function initializeEventActions(event, allEvents) {
  // Back Button
  const backBtn = document.getElementById("backButton");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "events.html";
    });
  }

  // Join Event Button
  const joinBtn = document.getElementById("joinEventBtn");
  if (joinBtn) {
    joinBtn.addEventListener("click", function () {
      // Toggle join/leave
      const isJoined = this.textContent.includes("Leave");
      if (isJoined) {
        event.attendees = Math.max(0, event.attendees - 1);
        this.innerHTML = '<i class="fas fa-calendar-plus"></i> Join Event';
        showToast("You have left the event", "info");
      } else {
        event.attendees += 1;
        this.innerHTML = '<i class="fas fa-calendar-minus"></i> Leave Event';
        showToast("You have joined the event!", "success");
      }

      // Save changes
      saveEventsToStorage(allEvents);

      // Update display
      document.querySelector(".fa-users").nextElementSibling.textContent =
        event.attendees;
    });
  }

  // Edit Event Button
  const editBtn = document.getElementById("editEventBtn");
  if (editBtn) {
    editBtn.addEventListener("click", function () {
      window.location.href = `edit-event.html?id=${event.id}`;
    });
  }

  // Delete Event Button
  const deleteBtn = document.getElementById("deleteEventBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
        const updatedEvents = allEvents.filter((e) => e.id !== event.id);
        saveEventsToStorage(updatedEvents);
        showToast("Event deleted successfully", "success");
        setTimeout(() => {
          window.location.href = "events.html";
        }, 1500);
      }
    });
  }
}

function saveEventsToStorage(events) {
  try {
    localStorage.setItem("communityEvents", JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events to localStorage:", error);
    showToast("Error saving event data", "error");
  }
}

function initializeEditEventPage() {
  // Get event ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = parseInt(urlParams.get("id"));

  if (!eventId) {
    showToast("Invalid event ID", "error");
    setTimeout(() => {
      window.location.href = "events.html";
    }, 2000);
    return;
  }

  // Load events from localStorage
  let events = [];
  try {
    const storedEvents = localStorage.getItem("communityEvents");
    events = storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    showToast("Error loading event data", "error");
    return;
  }

  // Find the event
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    showToast("Event not found", "error");
    setTimeout(() => {
      window.location.href = "events.html";
    }, 2000);
    return;
  }

  // Populate form with event data
  populateEditForm(event);

  // Initialize form submission
  initializeEditFormSubmission(event, events);
}

function populateEditForm(event) {
  // Populate form fields with event data
  document.getElementById("eventTitle").value = event.title || "";
  document.getElementById("eventType").value = event.type || "";
  document.getElementById("eventDescription").value = event.description || "";
  document.getElementById("eventDate").value = event.date || "";
  document.getElementById("eventTime").value = event.time || "";
  document.getElementById("eventLocation").value = event.location || "";

  // Set minimum date to today for editing
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("eventDate").min = today;

  // Update preview
  updatePreview();
}

function initializeEditFormSubmission(event, allEvents) {
  const editForm = document.getElementById("editEventForm");

  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const title = document.getElementById("eventTitle").value.trim();
      const type = document.getElementById("eventType").value;
      const description = document
        .getElementById("eventDescription")
        .value.trim();
      const date = document.getElementById("eventDate").value;
      const time = document.getElementById("eventTime").value;
      const location = document.getElementById("eventLocation").value.trim();

      // Validate required fields
      if (!title || !type || !description || !date || !time || !location) {
        showToast("Please fill in all required fields", "warning");
        return;
      }

      // Validate date is not in the past
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        showToast("Event date cannot be in the past", "warning");
        return;
      }

      // Update event object
      event.title = title;
      event.type = type;
      event.description = description;
      event.date = date;
      event.time = time;
      event.location = location;

      // Save updated events
      saveEventsToStorage(allEvents);

      // Show success message and redirect
      showToast("Event updated successfully!", "success");
      setTimeout(() => {
        window.location.href = `event-detail.html?id=${event.id}`;
      }, 1500);
    });
  }
}

function updatePreview() {
  const title = document.getElementById("eventTitle").value || "Event Title";
  const description =
    document.getElementById("eventDescription").value || "Event description...";
  const date = document.getElementById("eventDate").value || "2025-10-20";
  const time = document.getElementById("eventTime").value || "14:00";

  const previewElement = document.getElementById("eventPreview");
  if (previewElement) {
    previewElement.innerHTML = `
            <strong>${title}</strong><br>
            <p>${description}</p>
            <small>Date: ${new Date(
              date
            ).toLocaleDateString()} at ${time}</small>
        `;
  }
}

function initializeCreateEventPage() {
  // Set minimum date to today for event creation
  const today = new Date().toISOString().split("T")[0];
  if (document.getElementById("eventDate")) {
    document.getElementById("eventDate").min = today;
  }

  // Initialize real-time preview
  const titleInput = document.getElementById("eventTitle");
  const descriptionInput = document.getElementById("eventDescription");
  const dateInput = document.getElementById("eventDate");
  const timeInput = document.getElementById("eventTime");

  if (titleInput && descriptionInput && dateInput && timeInput) {
    // Add event listeners for real-time preview
    titleInput.addEventListener("input", updatePreview);
    descriptionInput.addEventListener("input", updatePreview);
    dateInput.addEventListener("input", updatePreview);
    timeInput.addEventListener("input", updatePreview);

    // Initial preview update
    updatePreview();
  }

  // Handle form submission for standalone create event page
  const createEventForm = document.getElementById("createEventForm");
  if (createEventForm) {
    createEventForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const title = document.getElementById("eventTitle").value.trim();
      const type = document.getElementById("eventType").value;
      const description = document
        .getElementById("eventDescription")
        .value.trim();
      const date = document.getElementById("eventDate").value;
      const time = document.getElementById("eventTime").value;
      const duration = document.getElementById("eventDuration").value;
      const maxParticipants = document.getElementById("maxParticipants").value;
      const location = document.getElementById("eventLocation").value.trim();
      const communityId = document.getElementById("eventCommunity").value;
      const tags = document.getElementById("eventTags").value.trim();

      // Validate required fields
      if (!title || !type || !description || !date || !time || !location) {
        showToast("Please fill in all required fields", "warning");
        return;
      }

      // Validate date is not in the past
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        showToast("Event date cannot be in the past", "warning");
        return;
      }

      // Load existing events from localStorage
      let events = [];
      try {
        const storedEvents = localStorage.getItem("communityEvents");
        events = storedEvents ? JSON.parse(storedEvents) : [];
      } catch (error) {
        console.error("Error loading events from localStorage:", error);
        events = [];
      }

      // Create new event object with all fields
      const newEvent = {
        id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1,
        title,
        type,
        description,
        date,
        time,
        duration,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : 50,
        location,
        communityId: communityId || null,
        tags: tags
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        attendees: 0,
        createdBy: "Student User",
        createdAt: new Date().toISOString(),
      };

      // Add to events array
      events.push(newEvent);

      // Save to localStorage
      try {
        localStorage.setItem("communityEvents", JSON.stringify(events));
      } catch (error) {
        console.error("Error saving events to localStorage:", error);
        showToast("Error saving event data", "error");
        return;
      }

      // Show success message and redirect
      showToast("Event created successfully!", "success");
      setTimeout(() => {
        window.location.href = "events.html";
      }, 1500);
    });
  }
}

// Toast notification system
function showToast(message, type = "info") {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${
    type === "error" ? "danger" : type
  } border-0`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Toast content
  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-triangle"
                    : type === "warning"
                    ? "exclamation-circle"
                    : "info-circle"
                } me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

  // Add toast to container
  toastContainer.appendChild(toast);

  // Initialize Bootstrap toast
  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 3000,
  });

  // Show toast
  bsToast.show();

  // Remove toast from DOM after it's hidden
  toast.addEventListener("hidden.bs.toast", function () {
    toast.remove();
  });
}
