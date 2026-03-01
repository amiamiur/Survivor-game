// Хранилище состояния игры (глобальная переменная)
const GameState = {
    resources: {
        // ресурсы для миссий
        proviziya: 10,
        toplivo: 5,
        instrumenty: 3
    },
    heroes: [],
    currentHeroId: null,
    lastPassiveUpdate: Date.now(),
    
    inventory: {
        // ресурсы для крафта
        material_wood: 5,
        material_iron: 2,
        material_cloth: 3
    },
    shop: null,
    recipeManager: null,

    _listeners: [],

    subscribe(callback) {
        this._listeners.push(callback);
    },
    notify() {
        this._listeners.forEach(cb => cb(this));
    },
    updateResource(type, amount) {
        if (this.resources[type] !== undefined) {
            this.resources[type] = Math.max(0, this.resources[type] + amount);
            this.notify();
        }
    },
    passiveUpdate() {
        const now = Date.now();
        const diffSeconds = Math.floor((now - this.lastPassiveUpdate) / 1000);

        if (diffSeconds >= 1) {
            let resourcesGained = { proviziya: 0, toplivo: 0, instrumenty: 0 };

            // Каждый открытый герой генерирует ресурсы
            this.heroes.forEach(hero => {
                if (hero.isUnlocked) {
                    //resourcesGained.proviziya += 1 * diffSeconds;
                    resourcesGained.proviziya += 1;
                    resourcesGained.toplivo += 1;
                    resourcesGained.instrumenty += 1;
                }
            });

            // Применяем накопленное (с округлением)
            this.resources.proviziya += resourcesGained.proviziya;
            this.resources.toplivo += resourcesGained.toplivo;
            this.resources.instrumenty += resourcesGained.instrumenty;

            this.lastPassiveUpdate = now;

            if (this.shop) {
                const refreshed = this.shop.checkAndRefresh();
                if (refreshed) {
                    console.log('Ассортимент магазина обновлен!');
                }
            }
            this.notify();
            ui.updateResourcesUI();
        }
    },

    updateMaterial(type,amount){
        if (this.inventory[type] !== undefined){
            this.inventory[type] = Math.max(0, this.inventory[type] + amount);
            this.notify();
        }
    },

     /**
     * Получить все материалы для отображения в удобном формате
     * @returns {Object} - Объект с материалами
     */
    getMaterials() {
        return {
            wood: this.inventory.material_wood || 0,
            iron: this.inventory.material_iron || 0,
            cloth: this.inventory.material_cloth || 0
        };
    },
    
    selectHero(heroId) {
        this.currentHeroId = heroId;
        this.notify();

        // Обновляем отображение в шапке
        const heroNameSpan = document.getElementById('currentHeroName');
        const hero = this.heroes.find(h => h.id === heroId);
        heroNameSpan.textContent = `Герой: ${hero ? hero.name : 'Не выбран'}`;

    },

    initShop() {
        this.shop = new window.Shop();
        this.notify();
    },

    /**
     * Инициализация рецептов
     */
    initRecipes() {
        this.recipeManager = new window.RecipeManager();
        this.notify();
    },

    /**
     * Крафт предмета
     * @param {string} recipeId - ID рецепта
     * @param {string} heroId - ID героя
     * @returns {Object} - Результат крафта
     */
    craftItem(recipeId, heroId) {
        if (!this.recipeManager) {
            return { success: false, message: 'Система крафта не инициализирована' };
        }
        
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) {
            return { success: false, message: 'Герой не найден' };
        }
        
        // Крафтим предмет
        const result = this.recipeManager.craft(recipeId, hero, this.inventory);
        
        if (result.success) {
            this.notify(); // Обновляем UI
        }
        
        return result;
    },

    getCurrentHero() {
        return this.heroes.find(h => h.id === this.currentHeroId);
    },

    /**
     * Добавляет награды после боя (материалы и возможные рецепты)
     * @returns {Object} - Объект с наградами
     */
    addBattleRewards() {
        // Случайные материалы
        const materials = [
            { type: 'material_wood', amount: Math.floor(Math.random() * 3) + 1 },
            { type: 'material_iron', amount: Math.floor(Math.random() * 2) },
            { type: 'material_cloth', amount: Math.floor(Math.random() * 2) }
        ];
        
        materials.forEach(m => {
            if (m.amount > 0) {
                this.updateMaterial(m.type, m.amount);
            }
        });
        
        // Шанс открыть новый рецепт (30%)
        if (this.recipeManager && Math.random() < 0.3) {
            const newRecipe = this.recipeManager.tryUnlockRandomRecipe();
            if (newRecipe) {
                return {
                    materials: materials,
                    newRecipe: newRecipe
                };
            }
        }
        
        return { materials: materials };
    }

};

// Делаем глобальной
window.GameState = GameState;

setInterval(() => {
    window.GameState.passiveUpdate();
}, 10000);
