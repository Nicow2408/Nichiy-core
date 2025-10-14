// js/modules/ui.js
import { getCategoryById } from './categories.js';

// Функция для отрисовки одной операции
export function renderTransaction(transaction, listElement) {
    const category = getCategoryById(transaction.category);
    const li = document.createElement('li');
    li.className = `transaction-item transaction-${transaction.type}`;
    li.innerHTML = `
        <div class="transaction-main">
            <span class="transaction-category">${category ? category.icon : '📁'}</span>
            <span class="transaction-description">${transaction.description}</span>
        </div>
        <div class="transaction-details">
            <span class="transaction-amount">${transaction.amount} ₽</span>
            <span class="transaction-category-name">${category ? category.name : 'Другое'}</span>
            <button class="delete-btn" data-id="${transaction.id}">×</button>
        </div>
    `;
    listElement.appendChild(li);
}

// Функция для отрисовки всех операций
export function renderTransactions(transactions, listElement) {
    listElement.innerHTML = '';
    
    if (transactions.length === 0) {
        listElement.innerHTML = '<li class="no-transactions">Нет операций для отображения</li>';
        return;
    }
    
    transactions.forEach(transaction => {
        renderTransaction(transaction, listElement);
    });
}

// Функция для обновления баланса
export function updateBalance(balance, balanceElement) {
    balanceElement.textContent = `${balance.toLocaleString('ru-RU')} ₽`;
    
    if (balance > 0) {
        balanceElement.style.color = '#2ecc71';
    } else if (balance < 0) {
        balanceElement.style.color = '#e74c3c';
    } else {
        balanceElement.style.color = '#333';
    }
}

// Функция для отображения статистики категорий
export function renderCategoriesStats(stats, containerElement) {
    if (Object.keys(stats).length === 0) {
        containerElement.innerHTML = '<div class="no-stats">Нет данных для статистики</div>';
        return;
    }
    
    let html = '';
    
    Object.entries(stats).forEach(([categoryName, data]) => {
        const percentage = data.type === 'income' 
            ? (data.amount / calculateTotalIncome() * 100).toFixed(1)
            : (data.amount / calculateTotalExpenses() * 100).toFixed(1);
            
        html += `
            <div class="category-stat ${data.type}">
                <div class="category-header">
                    <span class="category-name">${categoryName}</span>
                    <span class="category-amount">${data.amount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div class="category-bar">
                    <div class="category-bar-fill" style="width: ${percentage}%; background-color: ${data.color}"></div>
                </div>
                <div class="category-info">
                    <span>${data.count} операций</span>
                    <span>${percentage}%</span>
                </div>
            </div>
        `;
    });
    
    containerElement.innerHTML = html;
}

// Функция для обновления счетчика операций
export function updateTransactionsCount(transactions, countElement) {
    countElement.textContent = `(${transactions.length})`;
}

// Функция для очистки формы (с сохранением типа операции)
export function clearForm(form, preserveType = null) {
    if (preserveType) {
        // Сохраняем текущий тип операции
        const typeSelect = form.querySelector('#type');
        const currentType = typeSelect.value;
        
        // Сбрасываем форму
        form.reset();
        
        // Восстанавливаем тип операции
        typeSelect.value = currentType;
        
        // Обновляем поле категории
        const categorySelect = form.querySelector('#category');
        if (window.updateCategoryField) {
            window.updateCategoryField(currentType, categorySelect);
        }
    } else {
        form.reset();
        // Обновляем поле категории для расхода по умолчанию
        const categorySelect = form.querySelector('#category');
        if (window.updateCategoryField) {
            window.updateCategoryField('expense', categorySelect);
        }
    }
}

// Функция для показа уведомления
export function showMessage(message, type = 'info') {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        opacity: 1;
    `;
    
    if (type === 'success') {
        messageEl.style.background = '#2ecc71';
    } else if (type === 'error') {
        messageEl.style.background = '#e74c3c';
    } else {
        messageEl.style.background = '#3498db';
    }
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// Вспомогательные функции для расчета процентов
function calculateTotalIncome() {
    // Эта функция будет заменена при интеграции с transactions.js
    return 1; // Заглушка
}

function calculateTotalExpenses() {
    // Эта функция будет заменена при интеграции с transactions.js
    return 1; // Заглушка
}