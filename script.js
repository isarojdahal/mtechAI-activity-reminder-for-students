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

// Save activitys to localStorage
const saveActivities = () => {
  localStorage.setItem("activities", JSON.stringify(activities));
};

// Toggle completion status
const toggleCompletion = (id) => {
  const activity = activitys.find((a) => a.id === id);
  if (activity) {
    activity.completed = !activity.completed;
    saveActivities();

    // Find the activity item in the DOM
    const activityItem = document.querySelector(`[data-id="${id}"]`);
    if (activityItem) {
      const title = activityItem.querySelector("h3");
      const dueDate = activityItem.querySelector(".text-gray-600");
      const remainingDays = activityItem.querySelector(".text-sm.font-medium");

      if (activity.completed) {
        activityItem.classList.add("bg-green-50");
        title.classList.add("line-through", "text-gray-500");
        dueDate.classList.add("text-gray-400");
        remainingDays.classList.add("text-gray-400");
      } else {
        activityItem.classList.remove("bg-green-50");
        title.classList.remove("line-through", "text-gray-500");
        dueDate.classList.remove("text-gray-400");
        remainingDays.classList.remove("text-gray-400");
      }
    }

    // Re-sort the list without reloading
    const activityList = document.getElementById("activity-list");
    const items = Array.from(activityList.children);

    // Sort the DOM elements based on the same criteria
    items.sort((a, b) => {
      const aId = a.dataset.id;
      const bId = b.dataset.id;
      const aAssignment = activitys.find((ass) => ass.id === aId);
      const bAssignment = activitys.find((ass) => ass.id === bId);

      if (aAssignment.completed === bAssignment.completed) {
        const daysA = getRemainingDays(aAssignment.due_date);
        const daysB = getRemainingDays(bAssignment.due_date);
        return daysA - daysB;
      }
      return aAssignment.completed ? 1 : -1;
    });

    // Re-append the sorted items
    items.forEach((item) => activityList.appendChild(item));
  }
};

const loadAssignments = () => {
  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  // Sort activitys by remaining days (fewer days first)
  const sortedAssignments = [...activitys].sort((a, b) => {
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

    const activityItem = document.createElement("div");
    activityItem.classList.add(
      "activity-item",
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow",
      "flex",
      "items-center",
      "justify-between"
    );
    activityItem.dataset.id = activity.id;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("flex-grow");

    const title = document.createElement("h3");
    title.classList.add("text-lg", "font-semibold", "text-gray-800");
    title.textContent = activity.name;

    const dueDateContainer = document.createElement("div");
    dueDateContainer.classList.add("flex", "gap-4", "items-center", "mt-1");

    const dueDate = document.createElement("p");
    dueDate.classList.add("text-sm", "text-gray-600");
    dueDate.textContent = `Due Date: ${activity.due_date}`;

    const remainingDaysElement = document.createElement("p");
    remainingDaysElement.classList.add("text-sm", "font-medium", statusColor);
    remainingDaysElement.textContent =
      remainingDays < 0
        ? `Overdue by ${Math.abs(remainingDays)} days`
        : `Due in ${remainingDays} days`;

    dueDateContainer.appendChild(dueDate);
    dueDateContainer.appendChild(remainingDaysElement);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activity.completed;
    checkbox.classList.add(
      "h-5",
      "w-5",
      "text-blue-600",
      "rounded",
      "cursor-pointer"
    );
    checkbox.dataset.id = activity.id;
    checkbox.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      toggleCompletion(id);
    });

    contentDiv.appendChild(title);
    contentDiv.appendChild(dueDateContainer);
    activityItem.appendChild(contentDiv);
    activityItem.appendChild(checkbox);

    if (activity.completed) {
      activityItem.classList.add("bg-green-50");
      title.classList.add("line-through", "text-gray-500");
      dueDate.classList.add("text-gray-400");
      remainingDaysElement.classList.add("text-gray-400");
    }

    activityList.appendChild(activityItem);
  });
};

// Initial load
loadAssignments();
