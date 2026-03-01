class Shop {
    constructor() {
        this.items = []; // Все доступные предметы
        this.dailyItems = []; // Предметы в продаже сегодня
        this.lastUpdate = Date.now();
        this.initializeShop();
    }

    initializeShop() {
        // Создаем каталог предметов
        this.items = [
            new Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5 }),
            new Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3 }),
            new Armor('armor_leather_1', 'Кожаная броня', 'common', 15, { defense: 5 }),
            new Consumable('consumable_hp_small', 'Зелье здоровья', 'common', 5, 'heal', 30)
            // ... и так далее
        ];
        this.refreshDailyItems();
    }

    buyItem(itemId, heroId) {
        const item = this.dailyItems.find(i => i.id === itemId);
        if (!item) return { success: false, message: 'Предмет не найден' };

        const price = item.getPrice();
        const hero = window.GameState.heroes.find(h => h.id === heroId);

        // Проверка ресурсов
        if (window.GameState.resources.proviziya < price) {
            return { success: false, message: 'Недостаточно провизии' };
        }

        // Проверка инвентаря
        const added = hero.addToInventory({ ...item }); // Копия предмета!

        if (!added) {
            return { success: false, message: 'Инвентарь героя полон' };
        }

        // Списываем ресурсы
        window.GameState.updateResource('proviziya', -price);

        return { success: true, message: `Куплен ${item.name}` };
    }

    refreshDailyItems() {
        // Перемешиваем и берем 6 случайных предметов
        const shuffled = [...this.items].sort(() => 0.5 - Math.random());
        this.dailyItems = shuffled.slice(0, 6);
        this.lastUpdate = Date.now();
    }

    checkAndRefresh() {
        // Для теста обновляем каждые 30 секунд
        const testInterval = 30 * 1000;

        if (Date.now() - this.lastUpdate > testInterval) {
            this.refreshDailyItems();
            return true;
        }
        return false;
    }
}

window.Shop = Shop;
