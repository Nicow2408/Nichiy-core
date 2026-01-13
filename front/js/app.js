// js/app.js
import { renderTransactions, updateBalance, clearForm, showMessage, renderCategoriesStats, updateTransactionsCount } from './modules/ui.js';
import { 
    addTransaction, 
    deleteTransaction, 
    getAllTransactions, 
    getFilteredTransactions,
    calculateBalance,
    calculateIncome,
    calculateExpenses,
    initTransactions,
    getCategoriesStats 
} from './modules/transactions.js';
import { populateCategorySelect, populateCategoryFilter } from './modules/categories.js';

let transactionForm, transactionList, totalBalance, totalIncome, totalExpense;
let categorySelect, typeSelect, filterType, filterCategory, resetFilters, categoriesList, transactionsCount;

let currentTypeFilter = 'all';
let currentCategoryFilter = 'all';

function initApp() {
    
    getDOMElements();
    
    initTransactions();
    
    initCategories();
    
    updateUI();
    
    setupEventListeners();
}

function getDOMElements() {
    transactionForm = document.getElementById('transaction-form');
    transactionList = document.getElementById('transaction-list');
    totalBalance = document.getElementById('total-balance');
    totalIncome = document.getElementById('total-income');
    totalExpense = document.getElementById('total-expense');
    categorySelect = document.getElementById('category');
    typeSelect = document.getElementById('type');
    filterType = document.getElementById('filter-type');
    filterCategory = document.getElementById('filter-category');
    resetFilters = document.getElementById('reset-filters');
    categoriesList = document.getElementById('categories-list');
    transactionsCount = document.getElementById('transactions-count');
}

function initCategories() {
    populateCategorySelect(categorySelect, 'expense');
    
    populateCategorySelect(categorySelect, 'income');
    populateCategorySelect(categorySelect, 'expense');
    populateCategoryFilter(filterCategory);
    
    typeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        populateCategorySelect(categorySelect, selectedType);
    });
    
}

function setupEventListeners() {
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        
        if (!description || !amount) {
            showMessage('Пожалуйста, заполните все поля!', 'error');
            return;
        }
        
        if (amount <= 0) {
            showMessage('Сумма должна быть больше нуля!', 'error');
            return;
        }
        
        addTransaction(description, amount, type, category);
        
        updateUI();
        
        clearForm(transactionForm, type);
        
        showMessage(`Операция "${description}" добавлена!`, 'success');
    });
    
    transactionList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const transactionId = parseInt(event.target.dataset.id);
            
            const isDeleted = deleteTransaction(transactionId);
            
            if (isDeleted) {
                updateUI();
                showMessage('Операция удалена!', 'success');
            } else {
                showMessage('Ошибка при удалении операции!', 'error');
            }
        }
    });
    
    filterType.addEventListener('change', function() {
        currentTypeFilter = this.value;
        applyFilters();
    });
    
    filterCategory.addEventListener('change', function() {
        currentCategoryFilter = this.value;
        applyFilters();
    });
    
    resetFilters.addEventListener('click', function() {
        currentTypeFilter = 'all';
        currentCategoryFilter = 'all';
        filterType.value = 'all';
        filterCategory.value = 'all';
        applyFilters();
        showMessage('Фильтры сброшены', 'info');
    });
}

function applyFilters() {
    const filteredTransactions = getFilteredTransactions(currentTypeFilter, currentCategoryFilter);
    renderTransactions(filteredTransactions, transactionList);
    updateTransactionsCount(filteredTransactions, transactionsCount);
}

function updateUI() {
    const transactions = getAllTransactions();
    const balance = calculateBalance();
    const income = calculateIncome();
    const expenses = calculateExpenses();
    const stats = getCategoriesStats();
    
    const filteredTransactions = getFilteredTransactions(currentTypeFilter, currentCategoryFilter);
    renderTransactions(filteredTransactions, transactionList);
    
    updateBalance(balance, totalBalance);
    
    if (totalIncome && totalExpense) {
        totalIncome.textContent = `${income.toLocaleString('ru-RU')} ₽`;
        totalExpense.textContent = `${expenses.toLocaleString('ru-RU')} ₽`;
    }
    
    updateTransactionsCount(filteredTransactions, transactionsCount);
    
    renderCategoriesStats(stats, categoriesList);
    
    console.log('💰 Финансы - Доходы:', income, 'Расходы:', expenses, 'Баланс:', balance);
}

document.addEventListener('DOMContentLoaded', initApp);