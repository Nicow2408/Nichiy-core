// js/modules/storage.js

const STORAGE_KEY = 'budget-planner-transactions';

export function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        return false;
    }
}

export function loadTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const transactions = JSON.parse(data);
            return transactions;
        }
    } catch (error) {
    }
    return [];
}

export function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}