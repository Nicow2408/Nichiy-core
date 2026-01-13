// js/modules/categories.js

export const categoriesConfig = {
    income: [
        { id: 'salary', name: 'Зарплата', color: '#2ecc71', icon: '💼' },
        { id: 'freelance', name: 'Фриланс', color: '#27ae60', icon: '💻' },
        { id: 'investment', name: 'Инвестиции', color: '#3498db', icon: '📈' },
        { id: 'gift', name: 'Подарки', color: '#9b59b6', icon: '🎁' },
        { id: 'other_income', name: 'Другие доходы', color: '#34495e', icon: '💰' }
    ],
    expense: [
        { id: 'food', name: 'Еда', color: '#e74c3c', icon: '🍕' },
        { id: 'transport', name: 'Транспорт', color: '#e67e22', icon: '🚗' },
        { id: 'entertainment', name: 'Развлечения', color: '#f39c12', icon: '🎬' },
        { id: 'shopping', name: 'Шоппинг', color: '#d35400', icon: '🛍️' },
        { id: 'health', name: 'Здоровье', color: '#c0392b', icon: '🏥' },
        { id: 'bills', name: 'Коммуналка', color: '#16a085', icon: '🏠' },
        { id: 'education', name: 'Образование', color: '#2980b9', icon: '📚' },
        { id: 'other_expense', name: 'Другие расходы', color: '#7f8c8d', icon: '📦' }
    ]
};

export function getCategoriesByType(type) {
    const categories = categoriesConfig[type] || [];
    return categories;
}
export function getCategoryById(id) {
    for (const type in categoriesConfig) {
        const category = categoriesConfig[type].find(cat => cat.id === id);
        if (category) return category;
    }
    return null;
}

export function getAllCategories() {
    return [...categoriesConfig.income, ...categoriesConfig.expense];
}

export function populateCategorySelect(selectElement, type = 'expense') {
    
    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Выберите категорию';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    
    const categories = getCategoriesByType(type);
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        selectElement.appendChild(option);
    });
    
    updateCategoryStyles(selectElement, type);
}

export function populateCategoryFilter(selectElement) {

    
    selectElement.innerHTML = '<option value="all">Все категории</option>';
    
    const allCategories = getAllCategories();
    
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        selectElement.appendChild(option);
    });
}

export function updateCategoryStyles(selectElement, type) {
    selectElement.classList.remove('income-category', 'expense-category');
    
    if (type === 'income') {
        selectElement.classList.add('income-category');
        selectElement.title = 'Категории доходов';
    } else {
        selectElement.classList.add('expense-category');
        selectElement.title = 'Категории расходов';
    }
    
}

export function handleTypeChange(type, categorySelect) {
    populateCategorySelect(categorySelect, type);
}