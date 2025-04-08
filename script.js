// Load assignments from localStorage or use default if none exist
let assignments = JSON.parse(localStorage.getItem("assignments")) || [
  {
    id: "1",
    name: "AI 3rd Assignment (Matplotlib)",
    due_date: "2025-04-15",
    completed: false,
  },
  {
    id: "2",
    name: "Korean prof. Project assignment",
    due_date: "2025-06-15",
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

// Save assignments to localStorage
const saveAssignments = () => {
  localStorage.setItem("assignments", JSON.stringify(assignments));
};

// Toggle completion status
const toggleCompletion = (id) => {
  const assignment = assignments.find((a) => a.id === id);
  console.log("assignment", assignment);
  if (assignment) {
    assignment.completed = !assignment.completed;
    saveAssignments();

    // Find the assignment item in the DOM
    const assignmentItem = document.querySelector(`[data-id="${id}"]`);
    if (assignmentItem) {
      const title = assignmentItem.querySelector("h3");
      const dueDate = assignmentItem.querySelector(".text-gray-600");
      const remainingDays = assignmentItem.querySelector(
        ".text-sm.font-medium"
      );

      console.log("assignment", assignment);
      if (assignment.completed) {
        assignmentItem.classList.add("bg-green-50");
        title.classList.add("line-through", "text-gray-500");
        dueDate.classList.add("text-gray-400");
        remainingDays.classList.add("text-gray-400");
      } else {
        assignmentItem.classList.remove("bg-green-50");
        title.classList.remove("line-through", "text-gray-500");
        dueDate.classList.remove("text-gray-400");
        remainingDays.classList.remove("text-gray-400");
      }
    }

    // Re-sort the list without reloading
    const assignmentList = document.getElementById("assignment-list");
    const items = Array.from(assignmentList.children);

    // Sort the DOM elements based on the same criteria
    items.sort((a, b) => {
      const aId = a.dataset.id;
      const bId = b.dataset.id;
      const aAssignment = assignments.find((ass) => ass.id === aId);
      const bAssignment = assignments.find((ass) => ass.id === bId);

      if (aAssignment.completed === bAssignment.completed) {
        const daysA = getRemainingDays(aAssignment.due_date);
        const daysB = getRemainingDays(bAssignment.due_date);
        return daysA - daysB;
      }
      return aAssignment.completed ? 1 : -1;
    });

    // Re-append the sorted items
    items.forEach((item) => assignmentList.appendChild(item));
  }
};

const loadAssignments = () => {
  const assignmentList = document.getElementById("assignment-list");
  assignmentList.innerHTML = "";

  // Sort assignments by remaining days (fewer days first)
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.completed === b.completed) {
      const daysA = getRemainingDays(a.due_date);
      const daysB = getRemainingDays(b.due_date);
      return daysA - daysB;
    }
    return a.completed ? 1 : -1;
  });

  sortedAssignments.forEach((assignment) => {
    const remainingDays = getRemainingDays(assignment.due_date);
    const statusColor = getStatusColor(remainingDays);

    const assignmentItem = document.createElement("div");
    assignmentItem.classList.add(
      "assignment-item",
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow",
      "flex",
      "items-center",
      "justify-between"
    );
    assignmentItem.dataset.id = assignment.id;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("flex-grow");

    const title = document.createElement("h3");
    title.classList.add("text-lg", "font-semibold", "text-gray-800");
    title.textContent = assignment.name;

    const dueDateContainer = document.createElement("div");
    dueDateContainer.classList.add("flex", "gap-4", "items-center", "mt-1");

    const dueDate = document.createElement("p");
    dueDate.classList.add("text-sm", "text-gray-600");
    dueDate.textContent = `Due Date: ${assignment.due_date}`;

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
    checkbox.checked = assignment.completed;
    checkbox.classList.add(
      "h-5",
      "w-5",
      "text-blue-600",
      "rounded",
      "cursor-pointer"
    );
    checkbox.dataset.id = assignment.id;
    checkbox.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      toggleCompletion(id);
    });

    contentDiv.appendChild(title);
    contentDiv.appendChild(dueDateContainer);
    assignmentItem.appendChild(contentDiv);
    assignmentItem.appendChild(checkbox);

    if (assignment.completed) {
      assignmentItem.classList.add("bg-green-50");
      title.classList.add("line-through", "text-gray-500");
      dueDate.classList.add("text-gray-400");
      remainingDaysElement.classList.add("text-gray-400");
    }

    assignmentList.appendChild(assignmentItem);
  });
};

// Initial load
loadAssignments();
