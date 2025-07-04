// All Input fields
let title = document.querySelector("#title");
let description = document.querySelector("#description");
let level = document.querySelector("#priority");
let category = document.querySelector("#category");
let duedate = document.querySelector("#calendra");
let duetime = document.querySelector("#task-time");
let additional_notes = document.querySelector("#task-notes");

// AddTask Button
let AddTaskbtn = document.querySelector(".submit-task-button");

// Only add event listener if we're on the AddTask page
if (AddTaskbtn) {
  AddTaskbtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Get input values
    const titledata = title.value.trim();
    const descriptiondata = description.value.trim();
    const leveldata = level.value;
    const categorydata = category.value;
    const duedatedata = duedate.value;
    const duetimedata = duetime.value;
    const additional_notesdata = additional_notes.value.trim();

    // Validate input
    if (!titledata || !descriptiondata) {
      alert("Please fill at least the Title and Description fields.");
      return;
    }

    // Check if we're editing an existing task
    const taskIndex = localStorage.getItem("editingTaskIndex");
    
    if (taskIndex !== null) {
      // Update existing task
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const index = parseInt(taskIndex);
      
      if (tasks[index]) {
        tasks[index] = {
          ...tasks[index],
          title: titledata,
          description: descriptiondata,
          priority: leveldata,
          category: categorydata,
          dueDate: duedatedata,
          dueTime: duetimedata,
          notes: additional_notesdata,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.removeItem("editingTaskIndex");
        
        alert("Task updated successfully!");
        window.location.href = "Alltask.html";
      }
    } else {
      // Create new task
      const task = {
        title: titledata,
        description: descriptiondata,
        priority: leveldata,
        category: categorydata,
        dueDate: duedatedata,
        dueTime: duetimedata,
        notes: additional_notesdata,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      // Get existing tasks from localStorage
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Clear input fields after adding
      title.value = "";
      description.value = "";
      level.value = "Normal";
      category.value = "Personal";
      duedate.value = "";
      duetime.value = "";
      additional_notes.value = "";

      alert("Task added successfully!");
    }
  });
}

// Character count functionality for AddTask page
function setupCharacterCount() {
  const titleInput = document.querySelector("#title");
  const descInput = document.querySelector("#description");
  const notesInput = document.querySelector("#task-notes");
  
  if (titleInput) {
    const titleCount = document.querySelector(".title-count");
    titleInput.addEventListener("input", () => {
      if (titleCount) titleCount.textContent = titleInput.value.length;
    });
  }
  
  if (descInput) {
    const descCount = document.querySelector(".desc-count");
    descInput.addEventListener("input", () => {
      if (descCount) descCount.textContent = descInput.value.length;
    });
  }
  
  if (notesInput) {
    const notesCount = document.querySelector(".notes-count");
    notesInput.addEventListener("input", () => {
      if (notesCount) notesCount.textContent = notesInput.value.length;
    });
  }
}

// Clear form function for AddTask page
function clearForm() {
  if (title) title.value = "";
  if (description) description.value = "";
  if (level) level.value = "Normal";
  if (category) category.value = "Personal";
  if (duedate) duedate.value = "";
  if (duetime) duetime.value = "";
  if (additional_notes) additional_notes.value = "";
  
  // Reset character counts
  const titleCount = document.querySelector(".title-count");
  const descCount = document.querySelector(".desc-count");
  const notesCount = document.querySelector(".notes-count");
  
  if (titleCount) titleCount.textContent = "0";
  if (descCount) descCount.textContent = "0";
  if (notesCount) notesCount.textContent = "0";
}

// Alltask.html: Display all tasks
function renderAllTasks() {
  const tasksContainer = document.getElementById("tasks-container");
  const emptyState = document.getElementById("empty-state");
  if (!tasksContainer) return;
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filtering (basic, can be extended)
  const statusFilter = document.getElementById("status-filter");
  const priorityFilter = document.getElementById("priority-filter");
  const categoryFilter = document.getElementById("category-filter");
  const sortBy = document.getElementById("sort-by");
  const searchInput = document.getElementById("search-input");

  let filtered = [...tasks];
  if (statusFilter && statusFilter.value !== "all") {
    filtered = filtered.filter(t => t.status === statusFilter.value);
  }
  if (priorityFilter && priorityFilter.value !== "all") {
    filtered = filtered.filter(t => t.priority === priorityFilter.value);
  }
  if (categoryFilter && categoryFilter.value !== "all") {
    filtered = filtered.filter(t => t.category === categoryFilter.value);
  }
  if (searchInput && searchInput.value.trim() !== "") {
    const q = searchInput.value.trim().toLowerCase();
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }
  if (sortBy) {
    if (sortBy.value === "created") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy.value === "due") filtered.sort((a, b) => (a.dueDate || "") > (b.dueDate || "") ? 1 : -1);
    if (sortBy.value === "priority") filtered.sort((a, b) => a.priority.localeCompare(b.priority));
    if (sortBy.value === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Render
  tasksContainer.innerHTML = "";
  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    tasksContainer.style.display = "none";
  } else {
    if (emptyState) emptyState.style.display = "none";
    tasksContainer.style.display = "flex";
    filtered.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "task-item" + (task.status === "completed" ? " completed" : "");
      div.innerHTML = `
        <div class="task-header">
          <span class="task-title">${task.title}</span>
          <div class="task-status">
            <span class="status-badge ${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
            <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
          </div>
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-meta">
          <span class="task-date"><i class="ri-calendar-line"></i> ${task.dueDate || "-"} ${task.dueTime || ""}</span>
          <span class="task-category"><i class="ri-folder-line"></i> ${task.category}</span>
        </div>
        <div class="task-actions">
          ${task.status === "pending" ? 
            `<button class="btn primary" onclick="completeTask(${index})">
              <i class="ri-check-line"></i> Complete
            </button>` : 
            `<button class="btn secondary" onclick="undoTask(${index})">
              <i class="ri-arrow-go-back-line"></i> Undo
            </button>`
          }
          <button class="btn secondary" onclick="viewTaskDetails(${index})">
            <i class="ri-eye-line"></i> View
          </button>
          <button class="btn warning" onclick="deleteTask(${index})">
            <i class="ri-delete-bin-line"></i> Delete
          </button>
        </div>
      `;
      tasksContainer.appendChild(div);
    });
  }
  // Stats
  const totalDisplayed = document.getElementById("total-displayed");
  const pendingDisplayed = document.getElementById("pending-displayed");
  const completedDisplayed = document.getElementById("completed-displayed");
  
  if (totalDisplayed) totalDisplayed.textContent = filtered.length;
  if (pendingDisplayed) pendingDisplayed.textContent = filtered.filter(t => t.status === "pending").length;
  if (completedDisplayed) completedDisplayed.textContent = filtered.filter(t => t.status === "completed").length;
}

// Complete task function
function completeTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[index]) {
    tasks[index].status = "completed";
    tasks[index].completedAt = new Date().toISOString();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTasks();
    showNotification("Task completed successfully!", "success");
  }
}

// Undo task completion
function undoTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[index]) {
    tasks[index].status = "pending";
    delete tasks[index].completedAt;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTasks();
    showNotification("Task marked as pending!", "info");
  }
}

// Delete task function
function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTasks();
    showNotification("Task deleted successfully!", "warning");
  }
}

// View task details
function viewTaskDetails(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];
  if (task) {
    const modal = document.getElementById("task-modal");
    const modalBody = modal.querySelector(".modal-body");
    modalBody.innerHTML = `
      <div class="task-detail">
        <h4>${task.title}</h4>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Due Date:</strong> ${task.dueDate || "Not set"} ${task.dueTime || ""}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p><strong>Created:</strong> ${new Date(task.createdAt).toLocaleDateString()}</p>
        ${task.notes ? `<p><strong>Notes:</strong> ${task.notes}</p>` : ""}
      </div>
    `;
    modal.style.display = "block";
  }
}

// Close task modal
function closeTaskModal() {
  const modal = document.getElementById("task-modal");
  if (modal) modal.style.display = "none";
}

// Clear filters function
function clearFilters() {
  const statusFilter = document.getElementById("status-filter");
  const priorityFilter = document.getElementById("priority-filter");
  const categoryFilter = document.getElementById("category-filter");
  const sortBy = document.getElementById("sort-by");
  const timeFilter = document.getElementById("time-filter");
  
  if (statusFilter) statusFilter.value = "all";
  if (priorityFilter) priorityFilter.value = "all";
  if (categoryFilter) categoryFilter.value = "all";
  if (sortBy) sortBy.value = "created";
  if (timeFilter) timeFilter.value = "all";
  
  renderAllTasks();
  renderCompletedTasks();
}

// Clear search function
function clearSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = "";
    renderAllTasks();
    renderCompletedTasks();
  }
}

// Alltask.html: Add event listeners for filters/search
if (document.getElementById("tasks-container")) {
  ["status-filter", "priority-filter", "category-filter", "sort-by", "search-input"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderAllTasks);
  });
  document.addEventListener("DOMContentLoaded", renderAllTasks);
}

// Dashboard.html: Show recent tasks and stats
function renderDashboard() {
  const recentList = document.getElementById("recent-tasks-list");
  const totalTask = document.querySelector(".navbar-total-task h2");
  const completedTask = document.querySelector(".navbar-completed-tasks h2");
  const successRate = document.querySelector(".navbar-success-rate h2");
  const normalCount = document.getElementById("normal-count");
  const intermediateCount = document.getElementById("intermediate-count");
  const importantCount = document.getElementById("important-count");
  const pendingCount = document.getElementById("pending-count");
  const todayCount = document.getElementById("today-count");
  const overdueCount = document.getElementById("overdue-count");

  if (!recentList) return;
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Sort by createdAt desc
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Show up to 5 recent tasks
  recentList.innerHTML = tasks.length === 0 ? "No tasks yet. Create your first task!" : "";
  tasks.slice(0, 5).forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item" + (task.status === "completed" ? " completed" : "");
    div.innerHTML = `<strong>${task.title}</strong> <span style='color:gray;font-size:0.9em;'>(${task.priority})</span>`;
    recentList.appendChild(div);
  });
  // Stats
  if (totalTask) totalTask.textContent = tasks.length;
  if (completedTask) completedTask.textContent = tasks.filter(t => t.status === "completed").length;
  if (successRate) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    successRate.textContent = total === 0 ? "0%" : Math.round((completed / total) * 100) + "%";
  }
  if (normalCount) normalCount.textContent = tasks.filter(t => t.priority === "Normal").length;
  if (intermediateCount) intermediateCount.textContent = tasks.filter(t => t.priority === "Intermediate").length;
  if (importantCount) importantCount.textContent = tasks.filter(t => t.priority === "Important").length;
  if (pendingCount) pendingCount.textContent = tasks.filter(t => t.status === "pending").length;
  if (todayCount) {
    const today = new Date().toISOString().slice(0, 10);
    todayCount.textContent = tasks.filter(t => t.dueDate === today).length;
  }
  if (overdueCount) {
    const now = new Date().toISOString().slice(0, 10);
    overdueCount.textContent = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== "completed").length;
  }
}

// CompleteTask.html: Render completed tasks
function renderCompletedTasks() {
  const completedContainer = document.getElementById("completed-tasks-container");
  const emptyState = document.getElementById("empty-state");
  if (!completedContainer) return;
  
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = tasks.filter(t => t.status === "completed");

  // Filtering for completed tasks
  const priorityFilter = document.getElementById("priority-filter");
  const categoryFilter = document.getElementById("category-filter");
  const timeFilter = document.getElementById("time-filter");
  const searchInput = document.getElementById("search-input");

  let filtered = [...completedTasks];
  
  if (priorityFilter && priorityFilter.value !== "all") {
    filtered = filtered.filter(t => t.priority === priorityFilter.value);
  }
  if (categoryFilter && categoryFilter.value !== "all") {
    filtered = filtered.filter(t => t.category === categoryFilter.value);
  }
  if (timeFilter && timeFilter.value !== "all") {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    if (timeFilter.value === "week") {
      filtered = filtered.filter(t => new Date(t.completedAt) >= weekAgo);
    } else if (timeFilter.value === "month") {
      filtered = filtered.filter(t => new Date(t.completedAt) >= monthAgo);
    } else if (timeFilter.value === "year") {
      filtered = filtered.filter(t => new Date(t.completedAt) >= yearAgo);
    }
  }
  if (searchInput && searchInput.value.trim() !== "") {
    const q = searchInput.value.trim().toLowerCase();
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }

  // Sort by completion date (newest first)
  filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Render
  completedContainer.innerHTML = "";
  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    completedContainer.style.display = "none";
  } else {
    if (emptyState) emptyState.style.display = "none";
    completedContainer.style.display = "flex";
    filtered.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "task-item completed";
      div.innerHTML = `
        <div class="task-header">
          <span class="task-title">${task.title}</span>
          <div class="task-status">
            <span class="status-badge completed">Completed</span>
            <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
          </div>
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-meta">
          <span class="task-date"><i class="ri-calendar-line"></i> Completed: ${new Date(task.completedAt).toLocaleDateString()}</span>
          <span class="task-category"><i class="ri-folder-line"></i> ${task.category}</span>
        </div>
        <div class="task-actions">
          <button class="btn secondary" onclick="viewCompletedTaskDetails(${index})">
            <i class="ri-eye-line"></i> View
          </button>
          <button class="btn warning" onclick="undoTaskCompletion(${index})">
            <i class="ri-arrow-go-back-line"></i> Mark as Pending
          </button>
        </div>
      `;
      completedContainer.appendChild(div);
    });
  }

  // Update completed tasks stats
  updateCompletedTasksStats();
}

// Update completed tasks statistics
function updateCompletedTasksStats() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = tasks.filter(t => t.status === "completed");
  
  const totalCompleted = document.getElementById("total-completed");
  const thisWeek = document.getElementById("this-week");
  const thisMonth = document.getElementById("this-month");
  const streakDays = document.getElementById("streak-days");
  
  if (totalCompleted) totalCompleted.textContent = completedTasks.length;
  
  if (thisWeek) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekCompleted = completedTasks.filter(t => new Date(t.completedAt) >= weekAgo).length;
    thisWeek.textContent = weekCompleted;
  }
  
  if (thisMonth) {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthCompleted = completedTasks.filter(t => new Date(t.completedAt) >= monthAgo).length;
    thisMonth.textContent = monthCompleted;
  }
  
  if (streakDays) {
    // Simple streak calculation (can be improved)
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    const completedToday = completedTasks.some(t => new Date(t.completedAt).toDateString() === today);
    const completedYesterday = completedTasks.some(t => new Date(t.completedAt).toDateString() === yesterday);
    
    if (completedToday) {
      streakDays.textContent = "1+";
    } else if (completedYesterday) {
      streakDays.textContent = "1";
    } else {
      streakDays.textContent = "0";
    }
  }
}

// View completed task details
function viewCompletedTaskDetails(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = tasks.filter(t => t.status === "completed");
  const task = completedTasks[index];
  if (task) {
    const modal = document.getElementById("task-modal");
    const modalBody = modal.querySelector(".modal-body");
    modalBody.innerHTML = `
      <div class="task-detail">
        <h4>${task.title}</h4>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Due Date:</strong> ${task.dueDate || "Not set"} ${task.dueTime || ""}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p><strong>Created:</strong> ${new Date(task.createdAt).toLocaleDateString()}</p>
        <p><strong>Completed:</strong> ${new Date(task.completedAt).toLocaleDateString()}</p>
        ${task.notes ? `<p><strong>Notes:</strong> ${task.notes}</p>` : ""}
      </div>
    `;
    modal.style.display = "block";
  }
}

// Undo task completion from completed tasks page
function undoTaskCompletion(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = tasks.filter(t => t.status === "completed");
  const taskToUndo = completedTasks[index];
  
  if (taskToUndo) {
    const taskIndex = tasks.findIndex(t => t.createdAt === taskToUndo.createdAt);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = "pending";
      delete tasks[taskIndex].completedAt;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderCompletedTasks();
      showNotification("Task marked as pending!", "info");
    }
  }
}

// Export completed tasks
function exportCompletedTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = tasks.filter(t => t.status === "completed");
  
  if (completedTasks.length === 0) {
    alert("No completed tasks to export!");
    return;
  }
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Title,Description,Priority,Category,Due Date,Completed Date,Notes\n"
    + completedTasks.map(task => 
        `"${task.title}","${task.description}","${task.priority}","${task.category}","${task.dueDate || ''}","${new Date(task.completedAt).toLocaleDateString()}","${task.notes || ''}"`
      ).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "completed_tasks.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Edit current task function (missing from original code)
function editCurrentTask() {
  const modal = document.getElementById("task-modal");
  const modalBody = modal.querySelector(".modal-body");
  
  // Get the current task from the modal
  const taskTitle = modalBody.querySelector("h4");
  if (taskTitle) {
    const title = taskTitle.textContent;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(t => t.title === title);
    
    if (taskIndex !== -1) {
      // Store the task index for editing
      localStorage.setItem("editingTaskIndex", taskIndex);
      // Redirect to AddTask page for editing
      window.location.href = "AddTask.html?edit=true";
    }
  }
  closeTaskModal();
}

// Load task for editing in AddTask page
function loadTaskForEditing() {
  const urlParams = new URLSearchParams(window.location.search);
  const isEditing = urlParams.get('edit');
  
  if (isEditing === 'true') {
    const taskIndex = localStorage.getItem("editingTaskIndex");
    if (taskIndex !== null) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks[parseInt(taskIndex)];
      
      if (task) {
        // Fill the form with task data
        if (title) title.value = task.title;
        if (description) description.value = task.description;
        if (level) level.value = task.priority;
        if (category) category.value = task.category;
        if (duedate) duedate.value = task.dueDate || "";
        if (duetime) duetime.value = task.dueTime || "";
        if (additional_notes) additional_notes.value = task.notes || "";
        
        // Update character counts
        setupCharacterCount();
        
        // Change button text
        const submitBtn = document.querySelector(".submit-task-button");
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="ri-edit-line"></i> Update Task';
        }
        
        // Update page title
        const pageTitle = document.querySelector(".page-title");
        if (pageTitle) {
          pageTitle.textContent = "Edit Task";
        }
        
        const heading = document.querySelector(".addtask-heading h2");
        if (heading) {
          heading.innerHTML = '<i class="ri-edit-line"></i> Edit Task';
        }
        
        const subheading = document.querySelector(".addtask-heading p");
        if (subheading) {
          subheading.textContent = "Update the task details below";
        }
      }
    }
  }
}

// Initialize page-specific functionality
function initializePage() {
  // Setup character count for AddTask page
  setupCharacterCount();
  
  // Load task for editing if on AddTask page
  if (document.querySelector(".addtask-container")) {
    loadTaskForEditing();
  }
  
  // Initialize dashboard if on dashboard page
  if (document.querySelector(".dashboard-main")) {
    renderDashboard();
  }
  
  // Initialize completed tasks page
  if (document.getElementById("completed-tasks-container")) {
    renderCompletedTasks();
    
    // Add event listeners for completed tasks filters
    ["priority-filter", "category-filter", "time-filter", "search-input"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", renderCompletedTasks);
    });
  }
  
  // Add motivational quotes rotation for completed tasks page
  if (document.getElementById("motivational-quote")) {
    rotateMotivationalQuotes();
  }
}

// Rotate motivational quotes
function rotateMotivationalQuotes() {
  const quotes = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Small progress is still progress.", author: "Unknown" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "Every completed task is a step toward your goals.", author: "Unknown" }
  ];
  
  const quoteElement = document.getElementById("motivational-quote");
  const authorElement = document.getElementById("quote-author");
  
  if (quoteElement && authorElement) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote.text;
    authorElement.textContent = `- ${randomQuote.author}`;
  }
}

// Add view switching functionality
function setupViewSwitching() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const tasksContainer = document.getElementById('tasks-container') || document.getElementById('completed-tasks-container');
  
  if (viewButtons.length > 0 && tasksContainer) {
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        viewButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update container class
        const viewType = button.getAttribute('data-view');
        tasksContainer.className = tasksContainer.className.replace(/list-view|grid-view/, viewType + '-view');
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  setupViewSwitching();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + N to add new task
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    window.location.href = 'AddTask.html';
  }
  
  // Ctrl/Cmd + L to view all tasks
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    window.location.href = 'Alltask.html';
  }
  
  // Ctrl/Cmd + H to go to dashboard
  if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
    e.preventDefault();
    window.location.href = 'Dashboard.html';
  }
  
  // Escape to close modals
  if (e.key === 'Escape') {
    closeTaskModal();
  }
});

// Enhanced notification system with better styling
function showNotification(message, type = 'info') {
  const notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}
  
  