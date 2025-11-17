// Chat functionality
class ChatManager {
  constructor() {
    this.currentChatType = "lecturer-lecturer";
    this.messages = this.loadMessages();
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderMessages();
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll(".chat-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.chatType);
      });
    });

    // Send message
    document.getElementById("sendMessageBtn").addEventListener("click", () => {
      this.sendMessage();
    });

    // Enter key to send
    document.getElementById("chatInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });
  }

  switchTab(chatType) {
    this.currentChatType = chatType;

    // Update active tab
    document.querySelectorAll(".chat-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document
      .querySelector(`[data-chat-type="${chatType}"]`)
      .classList.add("active");

    // Render messages for this chat type
    this.renderMessages();
  }

  sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();

    if (message) {
      const newMessage = {
        id: Date.now(),
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        type: "sent",
        user: this.getCurrentUser(),
      };

      if (!this.messages[this.currentChatType]) {
        this.messages[this.currentChatType] = [];
      }

      this.messages[this.currentChatType].push(newMessage);
      this.saveMessages();
      this.renderMessages();
      input.value = "";

      // Simulate received message after a delay
      setTimeout(() => {
        this.simulateReceivedMessage();
      }, 1000 + Math.random() * 2000);
    }
  }

  simulateReceivedMessage() {
    const responses = [
      "Hello! How can I help you?",
      "That's interesting!",
      "I understand.",
      "Let me check that for you.",
      "Great point!",
      "Thanks for sharing.",
      "I'll look into it.",
      "Good question!",
      "Absolutely!",
      "Let's discuss this further.",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const receivedMessage = {
      id: Date.now() + Math.random(),
      text: randomResponse,
      timestamp: new Date().toLocaleTimeString(),
      type: "received",
      user: this.getSimulatedUser(),
    };

    if (!this.messages[this.currentChatType]) {
      this.messages[this.currentChatType] = [];
    }

    this.messages[this.currentChatType].push(receivedMessage);
    this.saveMessages();
    this.renderMessages();
  }

  renderMessages() {
    const messagesContainer = document.getElementById("chatMessages");
    const chatMessages = this.messages[this.currentChatType] || [];

    messagesContainer.innerHTML = chatMessages
      .map(
        (msg) => `
      <div class="chat-message ${msg.type}">
        ${msg.text}
        <small>${msg.user} • ${msg.timestamp}</small>
      </div>
    `
      )
      .join("");

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  getCurrentUser() {
    // In a real app, this would come from authentication
    return window.location.pathname.includes("lecturer")
      ? "Lecturer"
      : "Student";
  }

  getSimulatedUser() {
    const users = {
      "lecturer-lecturer": ["Prof. Smith", "Dr. Johnson", "Prof. Davis"],
      "lecturer-student": ["Student A", "Student B", "Student C"],
      "student-student": ["Alice", "Bob", "Charlie"],
    };

    const chatUsers = users[this.currentChatType] || ["User"];
    return chatUsers[Math.floor(Math.random() * chatUsers.length)];
  }

  loadMessages() {
    const stored = localStorage.getItem("chatMessages");
    return stored ? JSON.parse(stored) : {};
  }

  saveMessages() {
    localStorage.setItem("chatMessages", JSON.stringify(this.messages));
  }
}

// Initialize chat when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".chat-container")) {
    new ChatManager();
  }
});
