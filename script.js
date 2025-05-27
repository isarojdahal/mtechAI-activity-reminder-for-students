// Load activities from JSON file or localStorage
let activitys = [];

// Function to load activities from JSON file
const loadActivitiesFromJSON = async () => {
  try {
    const response = await fetch("activities.json");
    if (!response.ok) {
      throw new Error("Failed to load activities");
    }
    const data = await response.json();
    activitys = data.activities;
    saveActivities(); // Save to localStorage for persistence
    console.log("Activities loaded successfully:", activitys);
  } catch (error) {
    console.error("Error loading activities:", error);
    // Fallback to localStorage if JSON loading fails
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      activitys = JSON.parse(storedActivities);
      console.log("Loaded activities from localStorage:", activitys);
    } else {
      activitys = [];
      console.log("No activities found in localStorage");
    }
  }
};

// Calculate remaining days
const getRemainingDays = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get status color based on remaining days
const getStatusColor = (days) => {
  if (days < 0) return "text-red-600";
  if (days <= 7) return "text-orange-600";
  return "text-green-600";
};

// Get status icon based on remaining days
const getStatusIcon = (days) => {
  if (days < 0) return "fa-exclamation-circle";
  if (days <= 7) return "fa-clock";
  return "fa-calendar-check";
};

// Get activity type icon
const getActivityTypeIcon = (type) => {
  switch (type) {
    case "ASSIGNMENT":
      return "fa-book";
    case "PROJECT":
      return "fa-project-diagram";
    case "EXAM":
      return "fa-file-alt";
    case "QUIZ":
      return "fa-question-circle";
    default:
      return "fa-tasks";
  }
};

// Get activity type color
const getActivityTypeColor = (type) => {
  switch (type) {
    case "ASSIGNMENT":
      return "text-blue-600";
    case "PROJECT":
      return "text-purple-600";
    case "EXAM":
      return "text-red-600";
    case "QUIZ":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

// Save activitys to localStorage
const saveActivities = () => {
  try {
    localStorage.setItem("activities", JSON.stringify(activitys));
    console.log("Activities saved to localStorage");
    updateStats();
  } catch (error) {
    console.error("Error saving activities:", error);
  }
};

// Update statistics
const updateStats = () => {
  try {
    const total = activitys.length;
    const completed = activitys.filter((a) => a.completed).length;
    const upcoming = total - completed;

    document.getElementById("total-activities").textContent = total;
    document.getElementById("completed-activities").textContent = completed;
    document.getElementById("upcoming-activities").textContent = upcoming;
    console.log("Stats updated:", { total, completed, upcoming });
  } catch (error) {
    console.error("Error updating stats:", error);
  }
};

// Toggle completion status
const toggleCompletion = (id) => {
  const activity = activitys.find((a) => a.id === id);
  if (activity) {
    activity.completed = !activity.completed;
    saveActivities();
    loadAssignments();
  }
};

// Filter activities
let currentFilter = "all";
let currentTypeFilter = "all";

const setFilter = (filter) => {
  currentFilter = filter;
  document.querySelectorAll('[id^="filter-"]').forEach((btn) => {
    btn.classList.remove("bg-blue-100", "text-blue-600");
    btn.classList.add("bg-gray-100", "text-gray-600");
  });
  document
    .getElementById(`filter-${filter}`)
    .classList.remove("bg-gray-100", "text-gray-600");
  document
    .getElementById(`filter-${filter}`)
    .classList.add("bg-blue-100", "text-blue-600");
  loadAssignments();
};

const setTypeFilter = (type) => {
  currentTypeFilter = type;
  document.querySelectorAll('[id^="type-"]').forEach((btn) => {
    btn.classList.remove("bg-blue-100", "text-blue-600");
    btn.classList.add("bg-gray-100", "text-gray-600");
  });
  document
    .getElementById(`type-${type}`)
    .classList.remove("bg-gray-100", "text-gray-600");
  document
    .getElementById(`type-${type}`)
    .classList.add("bg-blue-100", "text-blue-600");
  loadAssignments();
};

const loadAssignments = () => {
  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  // Filter activities based on current filter and type filter
  let filteredActivities = [...activitys];

  // Apply completion status filter
  if (currentFilter === "active") {
    filteredActivities = filteredActivities.filter((a) => !a.completed);
  } else if (currentFilter === "completed") {
    filteredActivities = filteredActivities.filter((a) => a.completed);
  }

  // Apply activity type filter
  if (currentTypeFilter !== "all") {
    filteredActivities = filteredActivities.filter(
      (a) => a.activityType.toLowerCase() === currentTypeFilter.toUpperCase()
    );
  }

  // Sort activities
  const sortedAssignments = filteredActivities.sort((a, b) => {
    if (a.completed === b.completed) {
      const daysA = getRemainingDays(a.due_date);
      const daysB = getRemainingDays(b.due_date);
      return daysA - daysB;
    }
    return a.completed ? 1 : -1;
  });

  sortedAssignments.forEach((activity) => {
    const remainingDays = getRemainingDays(activity.due_date);
    const statusColor = getStatusColor(remainingDays);
    const statusIcon = getStatusIcon(remainingDays);
    const activityTypeIcon = getActivityTypeIcon(activity.activityType);
    const activityTypeColor = getActivityTypeColor(activity.activityType);

    const activityItem = document.createElement("div");
    activityItem.classList.add(
      "activity-item",
      "bg-white",
      "p-3",
      "rounded",
      "border",
      "border-gray-100",
      "hover:border-gray-200",
      "transition-colors",
      "flex",
      "items-center",
      "justify-between"
    );
    activityItem.dataset.id = activity.id;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("flex-grow", "flex", "items-center", "gap-3");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activity.completed;
    checkbox.classList.add(
      "h-4",
      "w-4",
      "text-blue-600",
      "rounded",
      "cursor-pointer",
      "border-gray-300"
    );
    checkbox.dataset.id = activity.id;
    checkbox.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      toggleCompletion(id);
    });

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("flex-grow");

    const titleRow = document.createElement("div");
    titleRow.classList.add("flex", "items-center", "gap-2", "flex-wrap");

    const activityTypeBadge = document.createElement("span");
    activityTypeBadge.classList.add(
      "inline-flex",
      "items-center",
      "gap-1",
      "px-2",
      "py-0.5",
      "rounded",
      "text-xs",
      "font-medium",
      "bg-gray-100",
      activityTypeColor
    );
    activityTypeBadge.innerHTML = `<i class="fas ${activityTypeIcon}"></i> ${activity.activityType}`;

    const title = document.createElement("h3");
    title.classList.add("text-base", "font-medium", "text-gray-800");
    title.textContent = activity.name;

    titleRow.appendChild(activityTypeBadge);
    titleRow.appendChild(title);

    const detailsRow = document.createElement("div");
    detailsRow.classList.add(
      "flex",
      "flex-wrap",
      "gap-3",
      "items-center",
      "mt-1"
    );

    if (activity.subject) {
      const subject = document.createElement("p");
      subject.classList.add("text-sm", "text-gray-600");
      subject.innerHTML = `<i class="fas fa-bookmark"></i> ${activity.subject}`;
      detailsRow.appendChild(subject);
    }

    const dueDate = document.createElement("p");
    dueDate.classList.add("text-sm", "text-gray-600");
    dueDate.innerHTML = `<i class="far fa-calendar"></i> ${activity.due_date}`;

    const remainingDaysElement = document.createElement("p");
    remainingDaysElement.classList.add("text-sm", "font-medium", statusColor);
    remainingDaysElement.innerHTML = `<i class="fas ${statusIcon}"></i> ${
      remainingDays < 0
        ? `Overdue by ${Math.abs(remainingDays)} days`
        : `Due in ${remainingDays} days`
    }`;

    detailsRow.appendChild(dueDate);
    detailsRow.appendChild(remainingDaysElement);

    infoDiv.appendChild(titleRow);
    infoDiv.appendChild(detailsRow);

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(infoDiv);
    activityItem.appendChild(contentDiv);

    if (activity.completed) {
      activityItem.classList.add("bg-gray-50");
      title.classList.add("line-through", "text-gray-500");
      dueDate.classList.add("text-gray-400");
      remainingDaysElement.classList.add("text-gray-400");
      activityTypeBadge.classList.add("opacity-50");
    }

    activityList.appendChild(activityItem);
  });
};

// Notification system
let notificationPermission = false;

// Request notification permission
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    notificationPermission = permission === "granted";
    if (notificationPermission) {
      console.log("Notification permission granted");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

// Check for upcoming activities and send notifications
const checkUpcomingActivities = () => {
  if (!notificationPermission) return;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  activitys.forEach((activity) => {
    if (activity.completed) return;

    const dueDate = new Date(activity.due_date);
    const timeDiff = dueDate - now;
    const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Notify for activities due in the next 24 hours
    if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
      new Notification("Activity Due Soon!", {
        body: `${activity.name} is due in ${daysUntilDue} day${
          daysUntilDue === 1 ? "" : "s"
        }`,
        icon: "/favicon.ico", // You can add your own icon
        tag: `activity-${activity.id}`, // Prevent duplicate notifications
      });
    }
  });
};

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  // Load activities from JSON file
  await loadActivitiesFromJSON();

  // Request notification permission
  await requestNotificationPermission();

  // Check for upcoming activities every hour
  setInterval(checkUpcomingActivities, 60 * 60 * 1000);

  // Initial check
  checkUpcomingActivities();

  // Set up notification settings button
  document
    .getElementById("notification-settings")
    .addEventListener("click", async () => {
      if (Notification.permission === "denied") {
        alert(
          "Please enable notifications in your browser settings to receive activity reminders."
        );
        return;
      }

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        notificationPermission = permission === "granted";
        if (notificationPermission) {
          alert(
            "Notifications enabled! You will receive reminders for upcoming activities."
          );
        }
      } else {
        alert(
          "Notifications are already enabled. You will receive reminders for upcoming activities."
        );
      }
    });

  // Set up filter buttons
  document
    .getElementById("filter-all")
    .addEventListener("click", () => setFilter("all"));
  document
    .getElementById("filter-active")
    .addEventListener("click", () => setFilter("active"));
  document
    .getElementById("filter-completed")
    .addEventListener("click", () => setFilter("completed"));

  // Set up type filter buttons
  document
    .getElementById("type-all")
    .addEventListener("click", () => setTypeFilter("all"));
  document
    .getElementById("type-assignment")
    .addEventListener("click", () => setTypeFilter("assignment"));
  document
    .getElementById("type-project")
    .addEventListener("click", () => setTypeFilter("project"));
  document
    .getElementById("type-exam")
    .addEventListener("click", () => setTypeFilter("exam"));
  document
    .getElementById("type-quiz")
    .addEventListener("click", () => setTypeFilter("quiz"));

  // Set initial filters
  setFilter("all");
  setTypeFilter("all");

  // Load initial data
  loadAssignments();
  updateStats();
});

// Clear all data functionality
document.getElementById("clear-data").addEventListener("click", async () => {
  if (
    confirm(
      "Are you sure you want to clear all data? This action cannot be undone."
    )
  ) {
    localStorage.removeItem("activities");
    await loadActivitiesFromJSON(); // Reload from JSON file
    loadAssignments();
    updateStats();
  }
});
