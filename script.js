// Load activitys from localStorage or use default if none exist
let activitys = JSON.parse(localStorage.getItem("activities")) || [
  {
    id: "1",
    name: "AI 3rd Assignment (Matplotlib)",
    due_date: "2025-04-15",
    activityType: "ASSIGNMENT",
    completed: false,
  },
  {
    id: "2",
    name: "Korean prof. Project ",
    due_date: "2025-06-15",
    activityType: "ASSIGNMENT",
    completed: false,
  },
];

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

// Save activitys to localStorage
const saveActivities = () => {
  localStorage.setItem("activities", JSON.stringify(activitys));
  updateStats();
};

// Update statistics
const updateStats = () => {
  const total = activitys.length;
  const completed = activitys.filter((a) => a.completed).length;
  const upcoming = total - completed;

  document.getElementById("total-activities").textContent = total;
  document.getElementById("completed-activities").textContent = completed;
  document.getElementById("upcoming-activities").textContent = upcoming;
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

const loadAssignments = () => {
  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  // Filter activities based on current filter
  let filteredActivities = [...activitys];
  if (currentFilter === "active") {
    filteredActivities = activitys.filter((a) => !a.completed);
  } else if (currentFilter === "completed") {
    filteredActivities = activitys.filter((a) => a.completed);
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

    const activityItem = document.createElement("div");
    activityItem.classList.add(
      "activity-item",
      "bg-white",
      "p-4",
      "rounded-lg",
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
    contentDiv.classList.add("flex-grow", "flex", "items-center", "gap-4");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activity.completed;
    checkbox.classList.add(
      "h-5",
      "w-5",
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

    const title = document.createElement("h3");
    title.classList.add("text-lg", "font-semibold", "text-gray-800");
    title.textContent = activity.name;

    const dueDateContainer = document.createElement("div");
    dueDateContainer.classList.add("flex", "gap-4", "items-center", "mt-1");

    const dueDate = document.createElement("p");
    dueDate.classList.add(
      "text-sm",
      "text-gray-600",
      "flex",
      "items-center",
      "gap-2"
    );
    dueDate.innerHTML = `<i class="far fa-calendar"></i> Due: ${activity.due_date}`;

    const remainingDaysElement = document.createElement("p");
    remainingDaysElement.classList.add(
      "text-sm",
      "font-medium",
      statusColor,
      "flex",
      "items-center",
      "gap-2"
    );
    remainingDaysElement.innerHTML = `<i class="fas ${statusIcon}"></i> ${
      remainingDays < 0
        ? `Overdue by ${Math.abs(remainingDays)} days`
        : `Due in ${remainingDays} days`
    }`;

    dueDateContainer.appendChild(dueDate);
    dueDateContainer.appendChild(remainingDaysElement);

    infoDiv.appendChild(title);
    infoDiv.appendChild(dueDateContainer);

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(infoDiv);
    activityItem.appendChild(contentDiv);

    if (activity.completed) {
      activityItem.classList.add("bg-gray-50");
      title.classList.add("line-through", "text-gray-500");
      dueDate.classList.add("text-gray-400");
      remainingDaysElement.classList.add("text-gray-400");
    }

    activityList.appendChild(activityItem);
  });
};

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
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

  // Set initial filter
  setFilter("all");

  // Load initial data
  loadAssignments();
  updateStats();
});

// Clear all data functionality
document.getElementById("clear-data").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to clear all data? This action cannot be undone."
    )
  ) {
    localStorage.removeItem("activities");
    activitys = [
      {
        id: "1",
        name: "AI 3rd Assignment (Matplotlib)",
        due_date: "2025-04-15",
        activityType: "ASSIGNMENT",
        completed: false,
      },
      {
        id: "2",
        name: "Korean prof. Project ",
        due_date: "2025-06-15",
        activityType: "ASSIGNMENT",
        completed: false,
      },
    ];
    loadAssignments();
    updateStats();
  }
});
