class UIManager {
    constructor() {
        this.screens = {
            lobby: document.getElementById('screenLobby'),
            heroes: document.getElementById('screenHeroes'),
            shop: document.getElementById('screenShop'),
            craft: document.getElementById('screenCraft')

        };
        
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.resourceElements = {
            proviziya: document.querySelector('#proviziya span'),
            toplivo: document.querySelector('#toplivo span'),
            instrumenty: document.querySelector('#instrumenty span')
            
        };

        this.renderHeroes();
        this.initEventListeners();
        this.subscribeToState();
        this.updateResourcesUI();

        if (window.GameState.shop) {
            this.renderShop();
        }
        else {
            console.log("Shop is Null")
        }
        if (window.GameState.recipeManager) {
            this.renderCraft();
        }
    }
    
    // инициализация слушателей
    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.setActiveNavButton(e.target);

                if (screenId === 'heroes') {
                    this.renderHeroes();
                } else if (screenId === 'shop') {
                    this.renderShop();
                } else if (screenId === 'craft') { // +++ НОВОЕ
                    this.renderCraft();
                }
            });
        });
        
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('heroModal').style.display = 'none';
        });
    }
    
    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenId].classList.add('active');
    }
    
    setActiveNavButton(activeBtn) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    subscribeToState() {
        window.GameState.subscribe(() => {
            this.updateResourcesUI();
            
            if (this.screens.heroes.classList.contains('active')) {
                this.renderHeroes();
            } else if (this.screens.shop.classList.contains('active')) {
                this.renderShop();
            } else if (this.screens.craft.classList.contains('active')) { // +++ НОВОЕ
                this.renderCraft();
            }
        });
    }
    
    updateResourcesUI() {
        this.resourceElements.proviziya.textContent = window.GameState.resources.proviziya;
        this.resourceElements.toplivo.textContent = window.GameState.resources.toplivo;
        this.resourceElements.instrumenty.textContent = window.GameState.resources.instrumenty;
    }

    renderHeroes() {
        const container = document.getElementById('heroesList');
        container.innerHTML = '';

        window.GameState.heroes.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';

            // Подсвечиваем выбранного героя
            if (hero.id === window.GameState.currentHeroId) {
                heroCard.style.border = '2px solid #e94560';
            }

            heroCard.innerHTML = `
            <h3>${hero.name} (Ур. ${hero.level})</h3>
            <div class="hero-stats">
                <p>❤️ HP: ${hero.currentStats.hp}</p>
                <p>⚔️ Атака: ${hero.currentStats.attack}</p>
                <p>🛡️ Защита: ${hero.currentStats.defense}</p>
            </div>
            <div class="hero-exp">
                <progress value="${hero.exp}" max="${hero.expToNextLevel}"></progress>
                <p>${hero.exp}/${hero.expToNextLevel} опыта</p>
            </div>
            <div class="hero-skills">
                <p>🎯 Очки навыков: ${hero.skillPoints}</p>
            </div>
            <button class="select-hero-btn" data-hero-id="${hero.id}">Выбрать для боя</button>
            <button class="inventory-hero-btn" data-hero-id="${hero.id}">Инвентарь</button>
        `;

            container.appendChild(heroCard);
        });

        // Добавляем обработчики
        this.attachHeroButtonListeners();
    }

    attachHeroButtonListeners() {
        // Добавляем обработчики для кнопок выбора героя
        document.querySelectorAll('.select-hero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                window.GameState.selectHero(heroId);
                this.renderHeroes(); // Перерисовываем для обновления выделения
            });
        });

        // Обработчики для просмотра инвентаря
        document.querySelectorAll('.inventory-hero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const heroId = e.target.dataset.heroId;
                this.showHeroInventory(heroId);
            });
        });
    }

    showHeroInventory(heroId) {
    const hero = window.GameState.heroes.find(h => h.id === heroId);

    modalBody.innerHTML = `
    <h2>Инвентарь ${hero.name}</h2>
    <div class="inventory-grid">
        ${hero.inventory.map((item, index) => {
        if (item) {
            return `<div class="inventory-slot">
                    ${item.icon || '📦'} ${item.name}
                </div>`;
        } else {
            return `<div class="inventory-slot empty-slot">
                    📭 Пусто
                </div>`;
        }
    }).join('')}
    </div>
    <h3>Экипировка</h3>
    <div class="equipment-grid">
        <div>Оружие: ${hero.equipment.weapon?.name || 'Пусто'}</div>
        <div>Броня: ${hero.equipment.armor?.name || 'Пусто'}</div>
        <div>Аксессуар: ${hero.equipment.accessory?.name || 'Пусто'}</div>
    </div>
`;

    document.getElementById('heroModal').style.display = 'block';

    document.querySelectorAll('.equip-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const heroId = e.target.dataset.heroId;
            const slot = parseInt(e.target.dataset.slot);
            const hero = window.GameState.heroes.find(h => h.id === heroId);
            const item = hero.inventory[slot];
            
            if (item) {
                let equipSlot = 'weapon';
                if (item.type === 'armor') equipSlot = 'armor';
                if (item.type === 'accessory') equipSlot = 'accessory';
                
                hero.equip(item, equipSlot);
                hero.inventory[slot] = null; // Убираем из инвентаря
                
                alert(`Экипировано: ${item.name}`);
                this.showHeroInventory(heroId);
            }
        });
    });
    
    document.getElementById('heroModal').style.display = 'block';
}

    renderShop() {
        const container = document.getElementById('shopItems');
        container.innerHTML = '';

        // Проверяем, выбран ли герой
        const currentHero = window.GameState.getCurrentHero();
        if (!currentHero) {
            container.innerHTML = '<p>Сначала выберите героя</p>';
            return;
        }

        window.GameState.shop.dailyItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'shop-item';

            // Цветовая дифференциация редкости
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

        // Добавляем таймер обновления
        this.addShopTimer();

        document.querySelectorAll('.buy-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const currentHero = window.GameState.getCurrentHero();

                const result = window.GameState.shop.buyItem(itemId, currentHero.id);

                if (result.success) {
                    alert(result.message);
                    this.renderShop(); // Обновляем отображение
                } else {
                    alert(result.message);
                }
            });
        });
    }

    /**
     * Отрисовывает экран крафта
     */
    renderCraft() {
        const container = document.getElementById('craftRecipes');
        container.innerHTML = '';
        
        if (!window.GameState.recipeManager) {
            container.innerHTML = '<p>Система крафта не инициализирована</p>';
            return;
        }
        
        const currentHero = window.GameState.getCurrentHero();
        if (!currentHero) {
            container.innerHTML = '<p>Сначала выберите героя</p>';
            return;
        }
        
        // Отображаем доступные материалы
        const materials = window.GameState.getMaterials();
        const materialsDiv = document.createElement('div');
        materialsDiv.className = 'materials-display';
        materialsDiv.style.cssText = `
            background: #16213e;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            gap: 20px;
            justify-content: center;
        `;
        materialsDiv.innerHTML = `
            <div> 🌲 <span id="materialWood">${materials.wood}</span></div>
            <div> ⛓️ <span id="materialIron">${materials.iron}</span></div>
            <div> 🌯 <span id="materialCloth">${materials.cloth}</span></div>
        `;
        container.appendChild(materialsDiv);
        
        // Заголовок с открытыми рецептами
        const title = document.createElement('h3');
        title.textContent = 'Доступные рецепты:';
        container.appendChild(title);
        
        // Отображаем открытые рецепты
        const unlockedRecipes = window.GameState.recipeManager.getUnlockedRecipes();
        
        if (unlockedRecipes.length === 0) {
            container.innerHTML += '<p>Нет доступных рецептов</p>';
            return;
        }
        
        unlockedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'craft-item';
            
            // Проверяем, можно ли скрафтить
            const canCraft = recipe.canCraft(currentHero, window.GameState.inventory);
            
            // Собираем строку с материалами
            const materialsList = recipe.materials.map(m => 
                `${m.itemId === 'material_wood' ? '🌲' : m.itemId === 'material_iron' ? '⛓️' : '🌯'} ${m.quantity}`
            ).join(' + ');
            
            recipeCard.innerHTML = `
                <div style="font-size: 2rem;">${recipe.resultItem.icon}</div>
                <h4>${recipe.name}</h4>
                <p>${recipe.resultItem.description}</p>
                <p class="craft-materials">Требуется: ${materialsList}</p>
                <p class="craft-level">Требуемый уровень: ${recipe.requiredLevel}</p>
                <button class="craft-item-btn" data-recipe-id="${recipe.id}" ${!canCraft.success ? 'disabled' : ''}>
                    ${canCraft.success ? 'Скрафтить' : canCraft.message}
                </button>
            `;
            
            // Если нельзя скрафтить, делаем кнопку серой
            if (!canCraft.success) {
                recipeCard.querySelector('button').style.background = '#666';
                recipeCard.querySelector('button').style.cursor = 'not-allowed';
            }
            
            container.appendChild(recipeCard);
        });
        
        // Добавляем обработчики крафта
        document.querySelectorAll('.craft-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                
                const recipeId = e.target.dataset.recipeId;
                const currentHero = window.GameState.getCurrentHero();
                
                if (!currentHero) {
                    alert('Сначала выберите героя!');
                    return;
                }
                
                const result = window.GameState.craftItem(recipeId, currentHero.id);
                
                if (result.success) {
                    alert(result.message);
                    this.renderCraft(); // Обновляем экран крафта
                    
                    // Если открылся новый рецепт, показываем уведомление
                    if (result.newRecipe) {
                        setTimeout(() => {
                            alert(`🔓 Открыт новый рецепт: ${result.newRecipe.name}!`);
                        }, 100);
                    }
                } else {
                    alert(result.message);
                }
            });
        });
    }

    addShopTimer() {
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

}

// Делаем глобальной
window.UIManager = UIManager;
