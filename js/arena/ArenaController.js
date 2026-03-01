// ==============================
// Контроллер арены (связывает с основной игрой)
// ==============================
class ArenaController {
    constructor() {
        // Создаём менеджер спрайтов
        window.spriteManager = new SpriteManager();
        this.arena = null;
        this.initEventListeners();
    }
    
    initEventListeners() {
        document.getElementById('pauseBtn').addEventListener('click', () => {
            if (this.arena) {
                this.arena.togglePause();
            }
        });
        
        document.getElementById('resumeBtn').addEventListener('click', () => {
            if (this.arena) {
                this.arena.togglePause();
            }
        });
        
        document.getElementById('exitArenaBtn').addEventListener('click', () => {
            if (this.arena) {
                this.arena.exitArena();
            }
        });
    }
    
    /**
     * Начинает вылазку на арену
     * @param {string} location - Название локации
     * @param {Object} hero - Герой
     * @returns {boolean} - Успешно ли началась вылазка
     */
    startExpedition(location, hero) {
        if (!hero) {
            alert('Сначала выберите героя в меню "Герои"!');
            return false;
        }
        
        // Сохраняем текущее состояние героя
        hero.currentStats.hp = hero.baseStats.hp;
        
        // Создаём арену
        this.arena = new SurvivorsArena('gameCanvas');
        this.arena.init(hero);
        
        // Переключаем экран
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenArena').classList.add('active');
        
        // Скрываем навигацию
        document.querySelector('.game-nav').style.display = 'none';
        
        // Запускаем арену
        this.arena.start();
        
        return true;
    }
}

window.ArenaController = ArenaController;