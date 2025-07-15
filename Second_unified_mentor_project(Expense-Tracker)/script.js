// Modernized Expense Tracker JS with extra features
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const filterCategory = document.getElementById("filter-category");
const searchDescription = document.getElementById("search-description");
const clearAllBtn = document.getElementById("clear-all");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const modalConfirm = document.getElementById("modal-confirm");
const modalCancel = document.getElementById("modal-cancel");
const closeModalBtn = document.getElementById("close-modal");
const expenseChart = document.getElementById("expense-chart");

let editId = null;
let chart = null;

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function showModal(message, onConfirm) {
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
  function cleanup() {
    modal.classList.add("hidden");
    modalConfirm.removeEventListener("click", confirmHandler);
    modalCancel.removeEventListener("click", cancelHandler);
    closeModalBtn.removeEventListener("click", cancelHandler);
  }
  function confirmHandler() {
    cleanup();
    onConfirm();
  }
  function cancelHandler() {
    cleanup();
  }
  modalConfirm.addEventListener("click", confirmHandler);
  modalCancel.addEventListener("click", cancelHandler);
  closeModalBtn.addEventListener("click", cancelHandler);
}

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  if (!date || !description || !category || isNaN(amount)) {
    showToast("Please fill in all fields correctly.");
    return;
  }
  if (editId) {
    // Edit mode
    const idx = transactions.findIndex(tx => tx.id === editId);
    if (idx !== -1) {
      transactions[idx] = { id: editId, date, description, category, amount };
      showToast("Transaction updated!");
    }
    editId = null;
  } else {
    const transaction = { id: Date.now(), date, description, category, amount };
    transactions.push(transaction);
    showToast("Transaction added!");
  }
  saveTransactions();
  renderTransactions();
  transactionForm.reset();
});

function renderTransactions() {
  transactionList.innerHTML = "";
  let filtered = transactions;
  // Filter by category
  if (filterCategory.value !== "All") {
    filtered = filtered.filter(t => t.category === filterCategory.value);
  }
  // Filter by search
  const search = searchDescription.value.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter(t => t.description.toLowerCase().includes(search));
  }
  let income = 0, expense = 0;
  filtered.forEach(tx => {
    const li = document.createElement("li");
    li.classList.add("transaction-item");
    if (tx.category !== "Income") li.classList.add("expense");
    li.innerHTML = `
      <span>${tx.date} - ${tx.description} [${tx.category}] ₹${tx.amount}</span>
      <div>
        <button class="edit-btn" data-id="${tx.id}">Edit</button>
        <button class="delete-btn" data-id="${tx.id}">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
    if (tx.category === "Income") income += tx.amount;
    else expense += tx.amount;
  });
  totalIncomeEl.textContent = income.toFixed(2);
  totalExpenseEl.textContent = expense.toFixed(2);
  netBalanceEl.textContent = (income - expense).toFixed(2);
  netBalanceEl.style.color = (income - expense) >= 0 ? '#10b981' : '#ef4444';
  renderChart();
  // Attach event listeners for edit/delete
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => startEditTransaction(Number(btn.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => confirmDeleteTransaction(Number(btn.dataset.id));
  });
}

function startEditTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;
  document.getElementById("date").value = tx.date;
  document.getElementById("description").value = tx.description;
  document.getElementById("category").value = tx.category;
  document.getElementById("amount").value = tx.amount;
  editId = id;
  showToast("Edit mode: Update and submit");
}

function confirmDeleteTransaction(id) {
  showModal("Are you sure you want to delete this transaction?", () => {
    transactions = transactions.filter(tx => tx.id !== id);
    saveTransactions();
    renderTransactions();
    showToast("Transaction deleted!");
  });
}

clearAllBtn.addEventListener("click", () => {
  if (transactions.length === 0) return showToast("No transactions to clear.");
  showModal("Clear ALL transactions? This cannot be undone.", () => {
    transactions = [];
    saveTransactions();
    renderTransactions();
    showToast("All transactions cleared!");
  });
});

filterCategory.addEventListener("change", renderTransactions);
searchDescription.addEventListener("input", renderTransactions);

function renderChart() {
  if (!expenseChart) return;
  // Prepare data
  const categoryTotals = {};
  transactions.forEach(tx => {
    if (tx.category !== "Income") {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);
  if (chart) chart.destroy();
  if (labels.length === 0) {
    expenseChart.style.display = 'none';
    return;
  }
  expenseChart.style.display = 'block';
  chart = new Chart(expenseChart, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#f59e42', '#ef4444', '#6366f1', '#10b981', '#fbbf24', '#a78bfa', '#f472b6'
        ],
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Initialize
renderTransactions();
