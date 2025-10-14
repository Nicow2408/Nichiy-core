// js/modules/transactions.js
import { saveTransactions, loadTransactions } from './storage.js';
import { getCategoryById } from './categories.js';

// Массив для хранения всех операций
let transactions = [];

// Инициализация - загрузка данных из LocalStorage
export function initTransactions() {
    const savedTransactions = loadTransactions();
    transactions = savedTransactions || [];
    console.log('📊 Инициализированы операции:', transactions.length);
}

// Функция для добавления новой операции
export function addTransaction(description, amount, type, category) {
    const transaction = {
        id: Date.now(),
        description: description,
        amount: parseFloat(amount),
        type: type,
        category: category,
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    saveTransactions(transactions);
    return transaction;
}

// Функция для удаления операции по ID
export function deleteTransaction(id) {
    const initialLength = transactions.length;
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    if (initialLength !== transactions.length) {
        saveTransactions(transactions);
        return true;
    }
    return false;
}

// Функция для получения всех операций
export function getAllTransactions() {
    return transactions;
}

// Функция для получения отфильтрованных операций
export function getFilteredTransactions(typeFilter = 'all', categoryFilter = 'all') {
    return transactions.filter(transaction => {
        const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;
        const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
        return typeMatch && categoryMatch;
    });
}

// Функция для расчета общего баланса
export function calculateBalance() {
    return transactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
            return total + transaction.amount;
        } else {
            return total - transaction.amount;
        }
    }, 0);
}

// Функция для расчета суммы доходов
export function calculateIncome() {
    return transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0);
}

// Функция для расчета суммы расходов
export function calculateExpenses() {
    return transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0);
}

// Функция для получения статистики по категориям
export function getCategoriesStats() {
    const stats = {};
    
    transactions.forEach(transaction => {
        const category = getCategoryById(transaction.category);
        const categoryName = category ? category.name : 'Неизвестно';
        
        if (!stats[categoryName]) {
            stats[categoryName] = {
                amount: 0,
                type: transaction.type,
                count: 0,
                color: category ? category.color : '#999'
            };
        }
        
        stats[categoryName].amount += transaction.amount;
        stats[categoryName].count += 1;
    });
    
    return stats;
}