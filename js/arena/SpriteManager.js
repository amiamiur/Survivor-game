// ==============================
// Менеджер спрайтов для загрузки и отображения изображений
// ==============================
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadSprites();
    }
    
    loadSprites() {
        // Создаём спрайты через canvas для простоты
        this.createHeroSprites();
        this.createEnemySprites();
        this.createEffectSprites();
        this.loaded = true;
        console.log('Спрайты загружены');
    }
    
    createHeroSprites() {
        // Создаём спрайт героя (меч)
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        // Тело героя
        ctx.fillStyle = '#4aff4a';
        ctx.beginPath();
        ctx.arc(20, 20, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(14, 15, 4, 0, Math.PI * 2);
        ctx.arc(26, 15, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Зрачки
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(14, 15, 2, 0, Math.PI * 2);
        ctx.arc(26, 15, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Меч
        ctx.fillStyle = '#aaa';
        ctx.fillRect(32, 10, 15, 5);
        ctx.fillRect(44, 5, 5, 15);
        
        this.sprites.hero = canvas;
        
        // Герой с луком
        const canvasBow = document.createElement('canvas');
        canvasBow.width = 40;
        canvasBow.height = 40;
        const ctxBow = canvasBow.getContext('2d');
        
        // Тело
        ctxBow.fillStyle = '#4aff4a';
        ctxBow.beginPath();
        ctxBow.arc(20, 20, 18, 0, Math.PI * 2);
        ctxBow.fill();
        
        // Глаза
        ctxBow.fillStyle = '#fff';
        ctxBow.beginPath();
        ctxBow.arc(14, 15, 4, 0, Math.PI * 2);
        ctxBow.arc(26, 15, 4, 0, Math.PI * 2);
        ctxBow.fill();
        ctxBow.fillStyle = '#000';
        ctxBow.beginPath();
        ctxBow.arc(14, 15, 2, 0, Math.PI * 2);
        ctxBow.arc(26, 15, 2, 0, Math.PI * 2);
        ctxBow.fill();
        
        // Лук
        ctxBow.strokeStyle = '#8B4513';
        ctxBow.lineWidth = 3;
        ctxBow.beginPath();
        ctxBow.arc(30, 15, 10, 0, Math.PI);
        ctxBow.stroke();
        
        this.sprites.heroBow = canvasBow;
    }
    
    createEnemySprites() {
        // Гоблин
        const canvasGoblin = document.createElement('canvas');
        canvasGoblin.width = 40;
        canvasGoblin.height = 40;
        const ctxGoblin = canvasGoblin.getContext('2d');
        
        ctxGoblin.fillStyle = '#0f8a0f';
        ctxGoblin.beginPath();
        ctxGoblin.arc(20, 20, 15, 0, Math.PI * 2);
        ctxGoblin.fill();
        
        // Уши
        ctxGoblin.fillStyle = '#0f8a0f';
        ctxGoblin.beginPath();
        ctxGoblin.arc(10, 10, 8, 0, Math.PI * 2);
        ctxGoblin.arc(30, 10, 8, 0, Math.PI * 2);
        ctxGoblin.fill();
        
        // Глаза
        ctxGoblin.fillStyle = '#ff0';
        ctxGoblin.beginPath();
        ctxGoblin.arc(15, 18, 3, 0, Math.PI * 2);
        ctxGoblin.arc(25, 18, 3, 0, Math.PI * 2);
        ctxGoblin.fill();
        ctxGoblin.fillStyle = '#000';
        ctxGoblin.beginPath();
        ctxGoblin.arc(15, 18, 1, 0, Math.PI * 2);
        ctxGoblin.arc(25, 18, 1, 0, Math.PI * 2);
        ctxGoblin.fill();
        
        this.sprites.goblin = canvasGoblin;
        
        // Скелет
        const canvasSkeleton = document.createElement('canvas');
        canvasSkeleton.width = 40;
        canvasSkeleton.height = 40;
        const ctxSkeleton = canvasSkeleton.getContext('2d');
        
        ctxSkeleton.fillStyle = '#ddd';
        ctxSkeleton.beginPath();
        ctxSkeleton.arc(20, 20, 15, 0, Math.PI * 2);
        ctxSkeleton.fill();
        
        // Глазницы
        ctxSkeleton.fillStyle = '#000';
        ctxSkeleton.beginPath();
        ctxSkeleton.arc(15, 15, 3, 0, Math.PI * 2);
        ctxSkeleton.arc(25, 15, 3, 0, Math.PI * 2);
        ctxSkeleton.fill();
        
        this.sprites.skeleton = canvasSkeleton;
        
        // Призрак
        const canvasGhost = document.createElement('canvas');
        canvasGhost.width = 40;
        canvasGhost.height = 40;
        const ctxGhost = canvasGhost.getContext('2d');
        
        ctxGhost.fillStyle = '#aa4aff';
        ctxGhost.globalAlpha = 0.7;
        ctxGhost.beginPath();
        ctxGhost.arc(20, 20, 15, 0, Math.PI * 2);
        ctxGhost.fill();
        
        ctxGhost.globalAlpha = 1;
        ctxGhost.fillStyle = '#fff';
        ctxGhost.beginPath();
        ctxGhost.arc(15, 15, 3, 0, Math.PI * 2);
        ctxGhost.arc(25, 15, 3, 0, Math.PI * 2);
        ctxGhost.fill();
        
        this.sprites.ghost = canvasGhost;
    }
    
    createEffectSprites() {
        // Кристалл опыта
        const canvasExp = document.createElement('canvas');
        canvasExp.width = 20;
        canvasExp.height = 20;
        const ctxExp = canvasExp.getContext('2d');
        
        ctxExp.fillStyle = '#ffd700';
        ctxExp.beginPath();
        ctxExp.moveTo(10, 2);
        ctxExp.lineTo(18, 10);
        ctxExp.lineTo(10, 18);
        ctxExp.lineTo(2, 10);
        ctxExp.closePath();
        ctxExp.fill();
        
        // Блик
        ctxExp.fillStyle = '#fff';
        ctxExp.beginPath();
        ctxExp.arc(8, 8, 2, 0, Math.PI * 2);
        ctxExp.fill();
        
        this.sprites.expGem = canvasExp;
    }
    
    getSprite(type, variant = 'default') {
        if (type === 'hero') {
            return variant === 'bow' ? this.sprites.heroBow : this.sprites.hero;
        }
        return this.sprites[type] || this.sprites.goblin;
    }
}

// Делаем глобальным
window.SpriteManager = SpriteManager;