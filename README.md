[![Итерация 1 - Готова](https://img.shields.io/badge/Итерация_3-Магазин_и_Предметы-0081d1?style=for-the-badge)](##-итерация-1-скелет-и-навигация)

> [!NOTE]
> Обновлено 19.02.2026

<br>

> [!IMPORTANT]
> Внимательно реализуем каждый класс и метод из руководства, важно ошибки фиксить сразу, что бы потом не запутаться.

<br>

> [!CAUTION]
> Не выполненые самостоятельные задания, которые находятся в конце документа - это снижение бала за домашнее задание и возможное снижение итогового бала за зачет.


# 🛡️ Arena Survivors v0.0.3: Добавляем систему предметов и магазин

Привет, команда! Во второй версии у нас появились настоящие герои с инвентарём. Теперь мы добавим **предметы и магазин**:

**Что нового:**
- Система классов предметов (оружие, броня, расходники, материалы)
- Магазин с ежедневным ассортиментом
- Возможность покупать предметы за провизию
- Использование расходников в инвентаре

**Важно:** Мы не переписываем игру, а **добавляем новые файлы и методы** в существующий код. Каждый шаг — это конкретное место, куда нужно вставить код.

---

## 📁 Создаём новый файл `js/core/Item.js`

Это полностью новый файл. Создайте его в папке `core/`. Здесь будут жить все классы предметов.

### Шаг 1.1. Базовый класс Item (вставьте целиком)

```javascript
// ==============================
// Базовый класс предмета
// ==============================
class Item {
    /**
     * Создаёт новый предмет
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название предмета
     * @param {string} type - Тип ('weapon', 'armor', 'consumable', 'material')
     * @param {string} rarity - Редкость ('common', 'rare', 'epic', 'legendary')
     * @param {number} basePrice - Базовая цена в провизии
     * @param {string} icon - Иконка предмета (эмодзи)
     */
    constructor(id, name, type, rarity, basePrice, icon = '📦') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.rarity = rarity;
        this.basePrice = basePrice;
        this.icon = icon;
        this.description = ''; // Будет заполняться в дочерних классах
    }
    
    /**
     * Получить цену предмета (может быть переопределена)
     * @returns {number} - Цена в провизии
     */
    getPrice() {
        return this.basePrice;
    }
}

// Делаем класс глобальным
window.Item = Item;
```

**Почему так:** Базовый класс содержит общие для всех предметов поля: `id`, `name`, `type`, `rarity`, `price`. Метод `getPrice()` пока просто возвращает цену, но в будущем здесь можно добавить скидки или наценки.

### Шаг 1.2. Класс Weapon (оружие)

После базового класса (но до `window.Item`) добавьте:

```javascript
// ==============================
// Класс оружия
// ==============================
class Weapon extends Item {
    /**
     * Создаёт новое оружие
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название
     * @param {string} rarity - Редкость
     * @param {number} basePrice - Цена
     * @param {Object} stats - Характеристики {damage, range, attackSpeed}
     * @param {string} icon - Иконка
     */
    constructor(id, name, rarity, basePrice, stats, icon = '⚔️') {
        super(id, name, 'weapon', rarity, basePrice, icon);
        this.damage = stats.damage || 0;
        this.range = stats.range || 1; // 1 - ближний бой, 2+ - дальний
        this.attackSpeed = stats.attackSpeed || 1.0;
        this.description = `Урон: ${this.damage}, Дальность: ${this.range}`;
    }
}
```

### Шаг 1.3. Класс Armor (броня)

Добавьте после класса `Weapon`:

```javascript
// ==============================
// Класс брони
// ==============================
class Armor extends Item {
    /**
     * Создаёт новую броню
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название
     * @param {string} rarity - Редкость
     * @param {number} basePrice - Цена
     * @param {Object} stats - Характеристики {defense, bonusHp}
     * @param {string} icon - Иконка
     */
    constructor(id, name, rarity, basePrice, stats, icon = '🛡️') {
        super(id, name, 'armor', rarity, basePrice, icon);
        this.defense = stats.defense || 0;
        this.bonusHp = stats.bonusHp || 0;
        this.description = `Защита: ${this.defense}, HP: +${this.bonusHp}`;
    }
}
```

### Шаг 1.4. Класс Consumable (расходники)

Добавьте после класса `Armor`:

```javascript
// ==============================
// Класс расходника
// ==============================
class Consumable extends Item {
    /**
     * Создаёт новый расходник
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название
     * @param {string} rarity - Редкость
     * @param {number} basePrice - Цена
     * @param {string} effect - Эффект ('heal', 'buff', 'resource')
     * @param {number} value - Сила эффекта
     * @param {string} icon - Иконка
     */
    constructor(id, name, rarity, basePrice, effect, value, icon = '💗') {
        super(id, name, 'consumable', rarity, basePrice, icon);
        this.effect = effect;
        this.value = value;
        this.usableInBattle = true;
        this.description = `${effect === 'heal' ? 'Восстанавливает' : 'Дает'} ${value}`;
    }
}
```

### Шаг 1.5. Класс Material (материалы для крафта)

Добавьте в конце файла:

```javascript
// ==============================
// Класс материала для крафта
// ==============================
class Material extends Item {
    constructor(id, name, rarity, basePrice, icon = '🔨') {
        super(id, name, 'material', rarity, basePrice, icon);
        this.description = 'Используется для крафта';
    }
}

// Делаем все классы глобальными
window.Weapon = Weapon;
window.Armor = Armor;
window.Consumable = Consumable;
window.Material = Material;
```

---

## 📁 Создаём новый файл `js/core/Shop.js`

Это тоже новый файл. Создайте его в папке `core/`. Здесь будет класс магазина.

### Шаг 2.1. Конструктор и инициализация

Вставьте этот код в новый файл:

```javascript
// ==============================
// Класс магазина
// ==============================
class Shop {
    constructor() {
        this.items = []; // Все доступные предметы
        this.dailyItems = []; // Предметы в продаже сегодня
        this.lastUpdate = Date.now();
        
        // Инициализируем базовый ассортимент
        this.initializeShop();
    }
    
    /**
     * Инициализация всех предметов в магазине
     */
    initializeShop() {
        // Создаём предметы
        const items = [
            // Оружие
            new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'),
            new window.Weapon('weapon_sword_2', 'Железный меч', 'rare', 50, { damage: 12, range: 1 }, '⚔️'),
            new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3, attackSpeed: 0.8 }, '🏹'),
            new window.Weapon('weapon_bow_2', 'Длинный лук', 'rare', 60, { damage: 15, range: 5, attackSpeed: 0.7 }, '🏹'),
            
            // Броня
            new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, bonusHp: 5 }, '👕'),
            new window.Armor('armor_leather_1', 'Кожаная броня', 'common', 15, { defense: 5, bonusHp: 10 }, '👕'),
            new window.Armor('armor_iron_1', 'Железный нагрудник', 'rare', 40, { defense: 10, bonusHp: 20 }, '👕'),
            
            // Расходники
            new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '💗'),
            new window.Consumable('consumable_hp_medium', 'Среднее зелье здоровья', 'rare', 15, 'heal', 60, '💗'),
            new window.Consumable('consumable_buff_attack', 'Зелье силы', 'rare', 20, 'buff', 20, '⚗️'),
            
            // Материалы
            new window.Material('material_wood', 'Древесина', 'common', 2, '🏠'),
            new window.Material('material_iron', 'Железо', 'common', 5, '⛓️'),
            new window.Material('material_cloth', 'Ткань', 'common', 3, '🛡️')
        ];
        
        this.items = items;
        this.refreshDailyItems();
    }
```

### Шаг 2.2. Метод обновления ассортимента

Добавьте после `initializeShop()`:

```javascript
    /**
     * Обновить ежедневный ассортимент (случайные 6 предметов)
     */
    refreshDailyItems() {
        // Перемешиваем и берем 6 случайных предметов
        const shuffled = [...this.items].sort(() => 0.5 - Math.random());
        this.dailyItems = shuffled.slice(0, 6);
        this.lastUpdate = Date.now();
    }
```

### Шаг 2.3. Метод покупки предметов

Добавьте после `refreshDailyItems()`:

```javascript
    /**
     * Купить предмет
     * @param {string} itemId - ID предмета
     * @param {string} heroId - ID героя, которому покупаем
     * @returns {Object} - Результат операции {success, message, item}
     */
    buyItem(itemId, heroId) {
        const item = this.dailyItems.find(i => i.id === itemId);
        if (!item) return { success: false, message: 'Предмет не найден' };
        
        const price = item.getPrice();
        const hero = window.GameState.heroes.find(h => h.id === heroId);
        
        // Проверяем, хватает ли провизии
        if (window.GameState.resources.proviziya < price) {
            return { success: false, message: 'Недостаточно провизии' };
        }
        
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        // Пытаемся добавить предмет в инвентарь героя
        // Создаём копию предмета, чтобы не изменять оригинал в магазине
        const itemCopy = { ...item };
        const added = hero.addToInventory(itemCopy);
        
        if (!added) {
            return { success: false, message: 'Инвентарь героя полон' };
        }
        
        // Списываем ресурсы
        window.GameState.updateResource('proviziya', -price);
        
        return { 
            success: true, 
            message: `Куплен ${item.name} за ${price} провизии`,
            item: item
        };
    }
```

### Шаг 2.4. Метод проверки обновления магазина

Добавьте в конце файла:

```javascript
    /**
     * Проверить, нужно ли обновить ассортимент
     * @returns {boolean} - true если ассортимент обновлён
     */
    checkAndRefresh() {
        // Для теста делаем обновление каждые 30 секунд
        const testInterval = 30 * 1000;
        
        if (Date.now() - this.lastUpdate > testInterval) {
            this.refreshDailyItems();
            return true;
        }
        return false;
    }
}

// Делаем класс глобальным
window.Shop = Shop;
```

---

## 🔄 Обновляем `js/core/GameState.js`

Теперь добавим в хранилище поддержку магазина. Откройте `GameState.js`.

### Шаг 3.1. Добавляем поле shop

Найдите в начале объекта `GameState` и добавьте новое поле:

```javascript
const GameState = {
    resources: {
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    inventory: {
        wood: 0,
        metal: 0,
        cloth: 0
    },
    // +++ НОВОЕ: магазин (пока null, будет инициализирован позже)
    shop: null,
    
    _listeners: [],
    // ... остальные методы
```

### Шаг 3.2. Добавляем метод initShop

Найдите место после метода `getCurrentHero()` и добавьте:

```javascript
    /**
     * Инициализирует магазин
     */
    initShop() {
        this.shop = new window.Shop();
        this.notify();
    }
```

### Шаг 3.3. Добавляем проверку обновления магазина в passiveUpdate

Найдите метод `passiveUpdate()` и в конце, перед `this.notify()`, добавьте:

```javascript
    passiveUpdate() {
        const now = Date.now();
        const diffSeconds = Math.floor((now - this.lastPassiveUpdate) / 1000);
        
        if (diffSeconds >= 1) {
            const resourcesGained = {
                proviziya: 0,
                toplivo: 0,
                instrumenty: 0
            };
            
            this.heroes.forEach(hero => {
                if (hero.isUnlocked) {
                    resourcesGained.proviziya += 0.05 * diffSeconds;
                    resourcesGained.toplivo += 0.03 * diffSeconds;
                    resourcesGained.instrumenty += 0.02 * diffSeconds;
                }
            });
            
            this.resources.proviziya = Math.round((this.resources.proviziya + resourcesGained.proviziya) * 10) / 10;
            this.resources.toplivo = Math.round((this.resources.toplivo + resourcesGained.toplivo) * 10) / 10;
            this.resources.instrumenty = Math.round((this.resources.instrumenty + resourcesGained.instrumenty) * 10) / 10;
            
            this.lastPassiveUpdate = now;
            
            // +++ НОВОЕ: проверяем обновление магазина
            if (this.shop) {
                const refreshed = this.shop.checkAndRefresh();
                if (refreshed) {
                    console.log('Ассортимент магазина обновлен!');
                }
            }
            
            this.notify();
        }
    }
```

---

## 🎨 Обновляем `js/ui/UIManager.js`

Теперь добавим отрисовку магазина и улучшим отображение инвентаря.

### Шаг 4.1. Добавляем вызов renderShop в конструктор

Найдите конструктор и добавьте в конец:

```javascript
    constructor() {
        this.screens = { ... };
        this.navButtons = ...;
        this.resourceElements = { ... };
        
        this.initEventListeners();
        this.subscribeToState();
        this.updateResourcesUI();
        this.renderHeroes();
        
        // +++ НОВОЕ: если магазин уже инициализирован, отображаем товары
        if (window.GameState.shop) {
            this.renderShop();
        }
    }
```

### Шаг 4.2. Добавляем переключение на магазин в initEventListeners

Найдите в `initEventListeners` обработчик клика и добавьте условие для магазина:

```javascript
    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);
                
                // +++ НОВОЕ: добавили проверку на магазин
                if (screenId === 'heroes') {
                    this.renderHeroes();
                } else if (screenId === 'shop') {
                    this.renderShop();
                }
            });
        });
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    }
```

### Шаг 4.3. Добавляем обновление магазина в subscribeToState

Найдите метод `subscribeToState` и дополните:

```javascript
    subscribeToState() {
        window.GameState.subscribe(() => {
            this.updateResourcesUI();
            
            if (this.screens.heroes.classList.contains('active')) {
                this.renderHeroes();
            } 
            // +++ НОВОЕ: обновляем магазин если он активен
            else if (this.screens.shop.classList.contains('active')) {
                this.renderShop();
            }
        });
    }
```

### Шаг 4.4. Добавляем метод renderShop

Это самый большой новый метод. Добавьте его после `renderHeroes()`:

```javascript
    /**
     * Отрисовывает магазин
     */
    renderShop() {
        const container = document.getElementById('shopItems');
        container.innerHTML = '';
        
        if (!window.GameState.shop) {
            container.innerHTML = '<p>Магазин не инициализирован</p>';
            return;
        }
        
        const currentHero = window.GameState.getCurrentHero();
        if (!currentHero) {
            container.innerHTML = '<p>Сначала выберите героя</p>';
            return;
        }
        
        window.GameState.shop.dailyItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'shop-item';
            
            // Определяем цвет редкости
            let rarityColor = '#ffffff';
            if (item.rarity === 'rare') rarityColor = '#4caaff';
            if (item.rarity === 'epic') rarityColor = '#aa4cff';
            if (item.rarity === 'legendary') rarityColor = '#ffaa4c';
            
            itemCard.innerHTML = `
                <div style="font-size: 3rem;">${item.icon}</div>
                <h3 style="color: ${rarityColor};">${item.name}</h3>
                <p class="item-type">${item.type}</p>
                <p class="item-description">${item.description}</p>
                <p class="item-price">💰 ${item.getPrice()} провизии</p>
                <p class="item-rarity" style="color: ${rarityColor};">${item.rarity}</p>
                <button class="buy-item-btn" data-item-id="${item.id}">Купить</button>
            `;
            
            container.appendChild(itemCard);
        });
        
        // Добавляем обработчики покупки
        document.querySelectorAll('.buy-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const currentHero = window.GameState.getCurrentHero();
                
                if (!currentHero) {
                    alert('Сначала выберите героя!');
                    return;
                }
                
                const result = window.GameState.shop.buyItem(itemId, currentHero.id);
                
                if (result.success) {
                    alert(result.message);
                    this.renderShop(); // Обновляем магазин
                } else {
                    alert(result.message);
                }
            });
        });
        
        // Добавляем информацию о времени обновления
        const lastUpdate = new Date(window.GameState.shop.lastUpdate);
        const nextUpdate = new Date(lastUpdate.getTime() + 30000); // +30 секунд для теста
        
        const shopInfo = document.createElement('div');
        shopInfo.className = 'shop-info';
        shopInfo.style.marginTop = '20px';
        shopInfo.style.textAlign = 'center';
        shopInfo.innerHTML = `
            <p>🔄 Ассортимент обновится через: <span id="shopTimer"></span>с</p>
        `;
        container.appendChild(shopInfo);
        
        // Запускаем таймер обновления
        this.startShopTimer();
    }
```

### Шаг 4.5. Добавляем таймер для магазина

Добавьте после `renderShop`:

```javascript
    /**
     * Запускает таймер обновления магазина
     */
    startShopTimer() {
        if (this.shopTimer) clearInterval(this.shopTimer);
        
        this.shopTimer = setInterval(() => {
            const timerElement = document.querySelector('#shopTimer');
            if (timerElement) {
                const lastUpdate = window.GameState.shop.lastUpdate;
                const timeLeft = Math.max(0, 30 - Math.floor((Date.now() - lastUpdate) / 1000));
                timerElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    this.renderShop(); // Перерисовываем при обновлении
                }
            }
        }, 1000);
    }
```

### Шаг 4.6. Улучшаем отображение инвентаря

Найдите метод `showHeroInventory` и замените его на этот (добавляются иконки и кнопки использования):

```javascript
    /**
     * Показывает инвентарь героя в модальном окне
     * @param {string} heroId - ID героя
     */
    showHeroInventory(heroId) {
        const hero = window.GameState.heroes.find(h => h.id === heroId);
        if (!hero) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Инвентарь ${hero.name}</h2>
            <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                ${hero.inventory.map((item, index) => {
                    if (item) {
                        return `<div class="inventory-slot" data-slot="${index}" style="background: #0f3460; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 2rem;">${item.icon}</div>
                            <div>${item.name}</div>
                            ${item.type === 'consumable' ? '<button class="use-item-btn" data-hero-id="' + heroId + '" data-slot="' + index + '">Использовать</button>' : ''}
                        </div>`;
                    } else {
                        return `<div class="inventory-slot empty" data-slot="${index}" style="background: #1a1a2e; padding: 15px; border-radius: 5px; border: 1px dashed #0f3460; text-align: center;">
                            Пусто
                        </div>`;
                    }
                }).join('')}
            </div>
            <h3>Экипировка</h3>
            <div class="equipment-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Оружие:</strong><br>
                    ${hero.equipment.weapon ? hero.equipment.weapon.name : 'Пусто'}
                </div>
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Броня:</strong><br>
                    ${hero.equipment.armor ? hero.equipment.armor.name : 'Пусто'}
                </div>
                <div class="equipment-slot" style="background: #0f3460; padding: 10px; border-radius: 5px;">
                    <strong>Аксессуар:</strong><br>
                    ${hero.equipment.accessory ? hero.equipment.accessory.name : 'Пусто'}
                </div>
            </div>
        `;
        
        // Добавляем обработчики для использования расходников
        document.querySelectorAll('.use-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                const slot = parseInt(e.target.dataset.slot);
                const hero = window.GameState.heroes.find(h => h.id === heroId);
                
                if (hero && hero.useConsumable(slot)) {
                    alert('Предмет использован!');
                    this.showHeroInventory(heroId); // Обновляем отображение
                } else {
                    alert('Нельзя использовать этот предмет сейчас');
                }
            });
        });
        
        document.getElementById('heroModal').style.display = 'block';
    }
```

---

## 🚀 Обновляем `js/game.js`

В файле запуска нужно заменить создание предметов на использование новых классов.

### Шаг 5.1. Заменяем создание предметов

Найдите место, где добавляются предметы в инвентарь воина, и замените на:

```javascript
// Добавляем тестовые предметы в инвентарь
warrior.addToInventory(new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '🧪'));
warrior.addToInventory(new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'));
```

### Шаг 5.2. Добавляем инициализацию магазина

После выбора героя добавьте:

```javascript
// Автоматически выбираем первого героя
window.GameState.selectHero('1');

// +++ НОВОЕ: инициализируем магазин
window.GameState.initShop();
```

### Шаг 5.3. Улучшаем обработчик начала боя (добавляем опыт)

Найдите обработчик `start-match-btn` и замените на этот (добавлена выдача опыта):

```javascript
// Обработчики кнопок локаций
document.querySelectorAll('.start-match-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const costType = e.target.dataset.costType;
        
        if (!window.GameState.getCurrentHero()) {
            alert('Сначала выберите героя в меню "Герои"!');
            return;
        }
        
        if (window.GameState.resources[costType] < 1) {
            alert(`Не хватает ${costType}!`);
            return;
        }
        
        window.GameState.updateResource(costType, -1);
        
        // +++ НОВОЕ: даем немного опыта за матч
        const currentHero = window.GameState.getCurrentHero();
        currentHero.addExp(10);
        
        alert(`Матч начат с героем ${currentHero.name}! Потрачен 1 ${costType}. Получено 10 опыта.`);
    });
});
```

### Шаг 5.4. Обновляем сообщение в консоли

В конце файла замените `console.log`:

```javascript
console.log('Игра запущена! Магазин инициализирован.');
```

---

## 📝 Обновляем `index.html`

В самом конце файла, в блоке подключения скриптов, добавьте новые строки для `Item.js` и `Shop.js`. **Важен порядок:**

```html
<script src="js/core/GameState.js"></script> 
<script src="js/core/Item.js"></script>      <!-- НОВОЕ: сначала Item (базовый класс) -->
<script src="js/core/Hero.js"></script>
<script src="js/core/Shop.js"></script>      <!-- НОВОЕ: потом Shop (использует Item) -->
<script src="js/ui/UIManager.js"></script> 
<script src="js/game.js"></script>
```

**Почему такой порядок:**
1. `GameState` — должен быть самым первым
2. `Item.js` — базовые классы предметов
3. `Hero.js` — герои используют предметы
4. `Shop.js` — магазин создаёт предметы
5. `UIManager.js` — отрисовывает интерфейс
6. `game.js` — запускает всё

---

## ✅ Что мы добавили

| Файл | Что нового |
|------|------------|
| `Item.js` (новый) | Система классов предметов (Item, Weapon, Armor, Consumable, Material) |
| `Shop.js` (новый) | Магазин с ассортиментом и покупками |
| `GameState.js` | Поле `shop`, метод `initShop()`, проверка обновления магазина |
| `UIManager.js` | Метод `renderShop()`, таймер обновления, кнопки использования расходников |
| `game.js` | Создание предметов через классы, инициализация магазина, выдача опыта |
| `index.html` | Подключение двух новых файлов |

---

## 🧪 Как проверить, что всё работает

1. **Откройте экран Магазин** — должны увидеть 6 случайных предметов
2. **Цвета редкости** — обычные (белые), редкие (синие), эпические (фиолетовые)
3. **Купите предмет** — если хватает провизии, предмет появится в инвентаре героя
4. **Подождите 30 секунд** — ассортимент должен обновиться, таймер покажет обратный отсчёт
5. **Откройте инвентарь героя** — у зелий появилась кнопка "Использовать"
6. **Используйте зелье** — HP героя должно увеличиться
7. **Проведите бой** — герой получит 10 опыта (проверьте полоску опыта)

---

## ⁉️ Задания для самостоятельной работы

Выберите **одно** задание, которое улучшит код без добавления новых механик:

### 🔹 Задание 1. Добавить проверку цены в getPrice()
Сейчас метод `getPrice()` просто возвращает `basePrice`. Добавьте модификатор редкости: 
- common = x1
- rare = x1.5
- epic = x2
- legendary = x3

**Где:** `Item.js`, метод `getPrice()`

---

### 🔹 Задание 2. Добавить иконки для пустых слотов
В инвентаре пустые слоты показывают только текст "Пусто". Сделайте, чтобы они показывали иконку 📭 и были чуть прозрачнее.

**Где:** `UIManager.js`, метод `showHeroInventory()`, строка с `'Пусто'`

---

### 🔹 Задание 3. Добавить проверку на наличие денег в UI
Сейчас кнопка "Купить" активна всегда, даже если не хватает провизии. Добавьте проверку: если у игрока меньше денег, чем цена предмета, кнопка должна становиться серой и неактивной (`disabled`).

**Где:** `UIManager.js`, метод `renderShop()`, при создании кнопки

---

### 🔹 Задание 4. Добавить счетчик свободных слотов в инвентаре
В модальном окне инвентаря добавьте строку: "Свободно: X/9 слотов". Это поможет игроку понять, может ли он купить новый предмет.

**Где:** `UIManager.js`, метод `showHeroInventory()`, в начало `modalBody.innerHTML`

---

### 🔹 Задание 5. Индикатор выбора героя
Добавить индикатор выбранного героя или аватар в шапке с рессурсами.

**Где:** В `header` добавить `div` с иконкой, в методе выбора героя меняйте аватар на соответствующий герою.

---

### 🔹 Задание 6. Улучшить описание предметов
Сейчас у оружия и брони нет описания бонусных статов. Добавьте в конструктор `Weapon` и `Armor` параметр `bonusStats` и выводите его в `description`.

**Где:** `Item.js`, классы `Weapon` и `Armor`

---

### 🎯 Как выполнять

1. Выберите одно задание
2. Внесенные изменения пометьте коментариями.
3. Внесите изменения (буквально 3-10 строк кода)
4. Сделайте commit и push
5. В комментариях к домашнему заданию укажите улучшение.

<br>

> [!TIP]
> Тестируем - должен работать магазин при переходе по вкладке, там должны отображаться товары, таймер в магазине должен работать корректно, инвентарь должен отображать купленные предметы.  **Переходим к версии 0.0.4 в следующую ветку**
#   S u r v i v o r - g a m e  
 