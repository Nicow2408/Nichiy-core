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

// Глобальные переменные
let transactionForm, transactionList, totalBalance, totalIncome, totalExpense;
let categorySelect, typeSelect, filterType, filterCategory, resetFilters, categoriesList, transactionsCount;

// Текущие фильтры
let currentTypeFilter = 'all';
let currentCategoryFilter = 'all';

// Инициализация приложения
function initApp() {
    console.log('🚀 Приложение инициализировано!');
    
    // Получаем элементы
    getDOMElements();
    
    // Инициализируем операции (загружаем из LocalStorage)
    initTransactions();
    
    // Инициализируем категории
    initCategories();
    
    // Обновляем интерфейс
    updateUI();
    
    // Добавляем обработчики событий
    setupEventListeners();
}

// Получение DOM элементов
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

// Инициализация категорий
function initCategories() {
    console.log('🎯 Инициализация категорий...');
    console.log('📋 Текущие опции в select:', categorySelect.innerHTML);
    
    // Заполняем категории для формы (по умолчанию расходы)
    populateCategorySelect(categorySelect, 'expense');
    
    console.log('📋 После заполнения расходов:', categorySelect.innerHTML);
    
    // Тестируем смену на доходы
    console.log('🧪 Тестируем смену на доходы:');
    populateCategorySelect(categorySelect, 'income');
    console.log('📋 После заполнения доходов:', categorySelect.innerHTML);
    
    // Возвращаем обратно на расходы
    populateCategorySelect(categorySelect, 'expense');
    
    // Заполняем категории для фильтра
    populateCategoryFilter(filterCategory);
    
    // Обновляем категории при изменении типа операции
    typeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        console.log('🔄 Изменен тип операции на:', selectedType);
        console.log('📋 До изменения:', categorySelect.innerHTML);
        populateCategorySelect(categorySelect, selectedType);
        console.log('📋 После изменения:', categorySelect.innerHTML);
    });
    
    console.log('✅ Категории инициализированы');
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Обработчик формы
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        
        // Валидация
        if (!description || !amount) {
            showMessage('Пожалуйста, заполните все поля!', 'error');
            return;
        }
        
        if (amount <= 0) {
            showMessage('Сумма должна быть больше нуля!', 'error');
            return;
        }
        
        // Добавляем операцию
        addTransaction(description, amount, type, category);
        
        // Обновляем интерфейс
        updateUI();
        
        // Очищаем форму (но сохраняем тип операции)
        clearForm(transactionForm, type);
        
        showMessage(`Операция "${description}" добавлена!`, 'success');
    });
    
    // Обработчик удаления
    transactionList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const transactionId = parseInt(event.target.dataset.id);
            
            // Удаляем операцию
            const isDeleted = deleteTransaction(transactionId);
            
            if (isDeleted) {
                updateUI();
                showMessage('Операция удалена!', 'success');
            } else {
                showMessage('Ошибка при удалении операции!', 'error');
            }
        }
    });
    
    // Обработчики фильтров
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

// Применение фильтров
function applyFilters() {
    const filteredTransactions = getFilteredTransactions(currentTypeFilter, currentCategoryFilter);
    renderTransactions(filteredTransactions, transactionList);
    updateTransactionsCount(filteredTransactions, transactionsCount);
}

// Обновление всего интерфейса
function updateUI() {
    const transactions = getAllTransactions();
    const balance = calculateBalance();
    const income = calculateIncome();
    const expenses = calculateExpenses();
    const stats = getCategoriesStats();
    
    // Отрисовываем операции
    const filteredTransactions = getFilteredTransactions(currentTypeFilter, currentCategoryFilter);
    renderTransactions(filteredTransactions, transactionList);
    
    // Обновляем баланс
    updateBalance(balance, totalBalance);
    
    // Обновляем доходы и расходы
    if (totalIncome && totalExpense) {
        totalIncome.textContent = `${income.toLocaleString('ru-RU')} ₽`;
        totalExpense.textContent = `${expenses.toLocaleString('ru-RU')} ₽`;
    }
    
    // Обновляем счетчик операций
    updateTransactionsCount(filteredTransactions, transactionsCount);
    
    // Обновляем статистику категорий
    renderCategoriesStats(stats, categoriesList);
    
    console.log('💰 Финансы - Доходы:', income, 'Расходы:', expenses, 'Баланс:', balance);
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);