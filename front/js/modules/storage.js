// js/modules/storage.js

const STORAGE_KEY = 'budget-planner-transactions';

// Сохранение операций в LocalStorage
export function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        console.log('💾 Данные сохранены в LocalStorage');
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения в LocalStorage:', error);
        return false;
    }
}

// Загрузка операций из LocalStorage
export function loadTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const transactions = JSON.parse(data);
            console.log('📂 Данные загружены из LocalStorage:', transactions);
            return transactions;
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки из LocalStorage:', error);
    }
    return [];
}

// Очистка всех данных
export function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Все данные очищены');
}