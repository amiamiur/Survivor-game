// ==============================
// Класс рецепта крафта
// ==============================
class Recipe {
    /**
     * Создаёт новый рецепт
     * @param {string} id - Уникальный идентификатор
     * @param {string} name - Название рецепта
     * @param {Object} resultItem - Предмет, который получается
     * @param {Array} materials - Материалы [{ itemId, quantity }]
     * @param {number} requiredLevel - Требуемый уровень героя
     * @param {string} requiredSkill - Требуемый навык (если есть)
     */
    constructor(id, name, resultItem, materials, requiredLevel = 1, requiredSkill = null) {
        this.id = id;
        this.name = name;
        this.resultItem = resultItem;
        this.materials = materials;
        this.requiredLevel = requiredLevel;
        this.requiredSkill = requiredSkill;
        this.isUnlocked = false; // По умолчанию закрыт
        this.unlockChance = 0.05; // 5% шанс открыть при крафте
        this.description = `Создает ${resultItem.name}`;
    }

    /**
     * Проверяет, может ли герой скрафтить этот предмет
     * @param {Object} hero - Герой
     * @param {Object} availableMaterials - Доступные материалы
     * @returns {Object} - { success, message }
     */
    canCraft(hero, availableMaterials) {
        // Проверяем уровень
        if (hero.level < this.requiredLevel) {
            return { success: false, message: `Требуется уровень ${this.requiredLevel}` };
        }
        
        // Проверяем материалы
        for (const material of this.materials) {
            if (!availableMaterials[material.itemId] || availableMaterials[material.itemId] < material.quantity) {
                return { success: false, message: `Не хватает ${material.itemId}` };
            }
        }
        
        return { success: true, message: 'Можно скрафтить' };
    }

    /**
     * Пытается открыть новый рецепт при крафте
     * @param {Array} allRecipes - Все рецепты
     * @returns {Object|null} - Открытый рецепт или null
     */
    tryUnlockNewRecipe(allRecipes) {
        // Ищем закрытые рецепты
        const lockedRecipes = allRecipes.filter(r => !r.isUnlocked && r.id !== this.id);
        
        if (lockedRecipes.length > 0 && Math.random() < this.unlockChance) {
            const randomRecipe = lockedRecipes[Math.floor(Math.random() * lockedRecipes.length)];
            randomRecipe.isUnlocked = true;
            return randomRecipe;
        }
        return null;
    }
}

// ==============================
// Класс для управления всеми рецептами
// ==============================
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.initializeRecipes();
    }

    /**
     * Инициализация всех рецептов
     */
    initializeRecipes() {
        // Создаём базовые рецепты
        const recipes = [
            // Оружие
            new Recipe(
                'recipe_wooden_sword',
                'Деревянный меч',
                new window.Weapon('weapon_sword_1', 'Деревянный меч', 'common', 10, { damage: 5, range: 1 }, '⚔️'),
                [
                    { itemId: 'material_wood', quantity: 2 }
                ],
                1
            ),
            new Recipe(
                'recipe_iron_sword',
                'Железный меч',
                new window.Weapon('weapon_sword_2', 'Железный меч', 'rare', 50, { damage: 12, range: 1 }, '⚔️'),
                [
                    { itemId: 'material_wood', quantity: 1 },
                    { itemId: 'material_iron', quantity: 3 }
                ],
                3
            ),
            new Recipe(
                'recipe_short_bow',
                'Короткий лук',
                new window.Weapon('weapon_bow_1', 'Короткий лук', 'common', 15, { damage: 7, range: 3, attackSpeed: 0.8 }, '🏹'),
                [
                    { itemId: 'material_wood', quantity: 3 },
                    { itemId: 'material_cloth', quantity: 1 }
                ],
                2
            ),
            
            // Броня
            new Recipe(
                'recipe_cloth_armor',
                'Тканевая броня',
                new window.Armor('armor_cloth_1', 'Тканевая броня', 'common', 8, { defense: 3, bonusHp: 5 }, '👕'),
                [
                    { itemId: 'material_cloth', quantity: 3 }
                ],
                1
            ),
            new Recipe(
                'recipe_leather_armor',
                'Кожаная броня',
                new window.Armor('armor_leather_1', 'Кожаная броня', 'common', 15, { defense: 5, bonusHp: 10 }, '👕'),
                [
                    { itemId: 'material_cloth', quantity: 2 },
                    { itemId: 'material_wood', quantity: 1 }
                ],
                2
            ),
            
            // Расходники
            new Recipe(
                'recipe_hp_potion_small',
                'Малое зелье здоровья',
                new window.Consumable('consumable_hp_small', 'Малое зелье здоровья', 'common', 5, 'heal', 30, '🍎'),
                [
                    { itemId: 'material_cloth', quantity: 1 },
                    { itemId: 'material_wood', quantity: 1 }
                ],
                1
            ),
            
            // Рецепты, которые изначально закрыты
            new Recipe(
                'recipe_long_bow',
                'Длинный лук',
                new window.Weapon('weapon_bow_2', 'Длинный лук', 'rare', 60, { damage: 15, range: 5, attackSpeed: 0.7 }, '🏹'),
                [
                    { itemId: 'material_wood', quantity: 4 },
                    { itemId: 'material_iron', quantity: 2 },
                    { itemId: 'material_cloth', quantity: 2 }
                ],
                5
            ),
            new Recipe(
                'recipe_iron_armor',
                'Железный нагрудник',
                new window.Armor('armor_iron_1', 'Железный нагрудник', 'rare', 40, { defense: 10, bonusHp: 20 }, '👕'),
                [
                    { itemId: 'material_iron', quantity: 5 },
                    { itemId: 'material_cloth', quantity: 2 }
                ],
                4
            )
        ];
        
        // Первые 5 рецептов открыты по умолчанию
        recipes.forEach((recipe, index) => {
            if (index < 5) {
                recipe.isUnlocked = true;
            }
        });
        
        this.recipes = recipes;
    }

    /**
     * Получить открытые рецепты
     * @returns {Array} - Массив открытых рецептов
     */
    getUnlockedRecipes() {
        return this.recipes.filter(r => r.isUnlocked);
    }

    /**
     * Получить рецепт по ID
     * @param {string} id - ID рецепта
     * @returns {Object|null} - Рецепт или null
     */
    getRecipe(id) {
        return this.recipes.find(r => r.id === id);
    }

    /**
     * Крафт предмета
     * @param {string} recipeId - ID рецепта
     * @param {Object} hero - Герой
     * @param {Object} materials - Доступные материалы
     * @returns {Object} - Результат крафта
     */
    craft(recipeId, hero, materials) {
        const recipe = this.getRecipe(recipeId);
        if (!recipe) {
            return { success: false, message: 'Рецепт не найден' };
        }
        
        // Проверяем, открыт ли рецепт
        if (!recipe.isUnlocked) {
            return { success: false, message: 'Рецепт еще не открыт' };
        }
        
        // Проверяем возможность крафта
        const canCraft = recipe.canCraft(hero, materials);
        if (!canCraft.success) {
            return canCraft;
        }
        
        // Проверяем, есть ли место в инвентаре
        const added = hero.addToInventory({ ...recipe.resultItem });
        if (!added) {
            return { success: false, message: 'Инвентарь героя полон' };
        }
        
        // Списываем материалы
        for (const material of recipe.materials) {
            materials[material.itemId] -= material.quantity;
        }
        
        // Пытаемся открыть новый рецепт
        const newRecipe = recipe.tryUnlockNewRecipe(this.recipes);
        
        let message = `Создан ${recipe.resultItem.name}`;
        if (newRecipe) {
            message += `\n🔓 Открыт новый рецепт: ${newRecipe.name}!`;
        }
        
        return {
            success: true,
            message: message,
            item: recipe.resultItem,
            newRecipe: newRecipe
        };
    }

    /**
     * Открыть рецепт случайно после боя
     * @returns {Object|null} - Открытый рецепт или null
     */
    tryUnlockRandomRecipe() {
        const lockedRecipes = this.recipes.filter(r => !r.isUnlocked);
        if (lockedRecipes.length > 0 && Math.random() < 0.1) { // 10% шанс
            const randomRecipe = lockedRecipes[Math.floor(Math.random() * lockedRecipes.length)];
            randomRecipe.isUnlocked = true;
            return randomRecipe;
        }
        return null;
    }
}

// Делаем классы глобальными
window.Recipe = Recipe;
window.RecipeManager = RecipeManager;