// ==============================
// Основной класс арены в стиле Survivors
// ==============================
class SurvivorsArena {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Размеры канваса (экрана)
        this.screenWidth = 800;
        this.screenHeight = 600;
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;
        
        // Размеры мира (гораздо больше экрана)
        this.worldWidth = 2400;
        this.worldHeight = 1800;
        
        // Камера (следит за героем)
        this.cameraX = 0;
        this.cameraY = 0;
        
        // Состояние игры
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.difficulty = 1;
        
        // Сущности
        this.hero = null;
        this.enemies = [];
        this.expGems = [];
        
        // Параметры спавна
        this.spawnTimer = 0;
        this.spawnInterval = 1.5;
        this.maxEnemies = 30;
        
        // Управление
        this.keys = {};
        this.joystick = { active: false, dirX: 0, dirY: 0 };
        
        // Декорации (камни, деревья)
        this.decorations = [];
        this.generateDecorations();
        
        // Время последнего кадра
        this.lastTimestamp = 0;
        
        // Для глобального доступа
        window.currentArena = this;
        
        this.initControls();
    }
    
    generateDecorations() {
        // Создаём декорации по всему миру
        for (let i = 0; i < 50; i++) {
            this.decorations.push({
                x: Math.random() * this.worldWidth,
                y: Math.random() * this.worldHeight,
                type: Math.floor(Math.random() * 3), // 0-дерево, 1-камень, 2-куст
                size: 20 + Math.random() * 30
            });
        }
    }

        // Обновление камеры (следит за героем)
    updateCamera() {
        if (!this.hero) return;
        
        // Камера следует за героем, но не выходит за границы мира
        this.cameraX = this.hero.worldX - this.screenWidth / 2;
        this.cameraY = this.hero.worldY - this.screenHeight / 2;
        
        // Ограничиваем камеру границами мира
        this.cameraX = Math.max(0, Math.min(this.worldWidth - this.screenWidth, this.cameraX));
        this.cameraY = Math.max(0, Math.min(this.worldHeight - this.screenHeight, this.cameraY));
    }
    
    init(heroData) {
        console.log('Инициализация арены с героем:', heroData);
        
        // Размещаем героя в центре мира
        this.hero = new ArenaHero(this.worldWidth / 2, this.worldHeight / 2, heroData);
        this.enemies = [];
        this.expGems = [];
        this.gameTime = 0;
        this.difficulty = 1;
        this.spawnTimer = 0;
        
        // Обновляем камеру
        this.updateCamera();
        
        // Создаем начальных врагов
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
        
        console.log('Арена инициализирована, врагов:', this.enemies.length);
    }
    
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    stop() {
        this.isRunning = false;
        window.currentArena = null;
    }

        gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        const deltaTime = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.lastTimestamp = timestamp;
        
        if (!this.isPaused && this.hero) {
            this.update(deltaTime);
        }
        
        this.draw();
        
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
    
    update(deltaTime) {
        // Обновляем игровое время
        this.gameTime += deltaTime;
        this.difficulty = 1 + Math.floor(this.gameTime / 60) * 0.5;
        
        // Обновляем UI
        this.updateUI();
        
        // Управление героем
        this.handleHeroMovement(deltaTime);
        
        // Обновляем героя
        this.hero.update(deltaTime, this.worldWidth, this.worldHeight);
        
        // Обновляем камеру
        this.updateCamera();
        
        // Проверяем смерть героя
        if (this.hero.hp <= 0) {
            this.gameOver();
            return;
        }
        
        // Спавн врагов
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0 && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.spawnTimer = this.spawnInterval / this.difficulty;
        }
        
        // Обновляем врагов
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, this.hero, this.worldWidth, this.worldHeight);
            
            // Проверяем попадания от оружия
            this.hero.weapons.forEach(weapon => {
                weapon.projectiles.forEach(projectile => {
                    if (projectile instanceof MeleeProjectile && !projectile.hitEnemies.has(enemy)) {
                        if (this.checkMeleeHit(this.hero, enemy, projectile.data.range || 60)) {
                            enemy.takeDamage(projectile.data.damage || 5);
                            projectile.hitEnemies.add(enemy);
                            
                            if (enemy.hp <= 0) {
                                this.spawnExpGem(enemy.worldX, enemy.worldY, enemy.expValue);
                            }
                        }
                    }
                });
            });
            
            return enemy.hp > 0;
        });
        
        // Обновляем кристаллы опыта
        this.expGems = this.expGems.filter(gem => {
            gem.update(deltaTime, this.worldWidth, this.worldHeight);
            
            const distance = Math.hypot(gem.worldX - this.hero.worldX, gem.worldY - this.hero.worldY);
            if (distance < this.hero.radius + gem.radius + this.hero.expMagnet) {
                this.hero.addExp(gem.value);
                return false;
            }
            return true;
        });
    }

        handleHeroMovement(deltaTime) {
        let moveX = 0, moveY = 0;
        
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) moveY -= 1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) moveY += 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) moveX -= 1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) moveX += 1;
        
        if (this.joystick.active) {
            moveX = this.joystick.dirX;
            moveY = this.joystick.dirY;
        }
        
        if (moveX !== 0 || moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            this.hero.vx = moveX / length;
            this.hero.vy = moveY / length;
        } else {
            this.hero.vx = 0;
            this.hero.vy = 0;
        }
    }
    
    checkMeleeHit(hero, enemy, range) {
        const distance = Math.hypot(hero.worldX - enemy.worldX, hero.worldY - enemy.worldY);
        return distance < hero.radius + enemy.radius + range;
    }
    
    spawnEnemy() {
        // Спавним врага за пределами видимости камеры
        let x, y;
        const viewMargin = 200;
        
        do {
            x = Math.random() * this.worldWidth;
            y = Math.random() * this.worldHeight;
        } while (
            x > this.cameraX - viewMargin && 
            x < this.cameraX + this.screenWidth + viewMargin &&
            y > this.cameraY - viewMargin && 
            y < this.cameraY + this.screenHeight + viewMargin
        );
        
        const enemy = new ArenaEnemy(x, y, this.difficulty);
        this.enemies.push(enemy);
    }
    
    spawnExpGem(x, y, value) {
        this.expGems.push(new ExpGem(x, y, value));
    }
    
    updateUI() {
        document.getElementById('arenaHp').textContent = Math.floor(this.hero.hp);
        document.getElementById('arenaMaxHp').textContent = this.hero.maxHp;
        document.getElementById('arenaAttack').textContent = this.hero.attack;
        document.getElementById('arenaLevel').textContent = this.hero.level;
        
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('arenaTimer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

        draw() {
        // Очищаем канвас
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        
        // Рисуем фон
        this.drawBackground();
        this.drawDecorations();
        this.drawGrid();
        
        // Рисуем сущности
        this.expGems.forEach(gem => gem.draw(this.ctx, this.cameraX, this.cameraY));
        this.enemies.forEach(enemy => enemy.draw(this.ctx, this.cameraX, this.cameraY));
        
        if (this.hero) {
            this.hero.draw(this.ctx, this.cameraX, this.cameraY);
        }
        
        // Рисуем информацию
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Сложность: ${this.difficulty.toFixed(1)}x`, 10, 30);
        this.ctx.fillText(`Врагов: ${this.enemies.length}`, 10, 50);
    }
    
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
        gradient.addColorStop(0, '#1a4a1a');
        gradient.addColorStop(1, '#2a5a2a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }
    
    drawDecorations() {
        this.decorations.forEach(dec => {
            const screenX = dec.x - this.cameraX;
            const screenY = dec.y - this.cameraY;
            
            if (screenX + dec.size < 0 || screenX - dec.size > this.screenWidth ||
                screenY + dec.size < 0 || screenY - dec.size > this.screenHeight) {
                return;
            }
            
            if (dec.type === 0) { // Дерево
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(screenX - 5, screenY - dec.size/2, 10, dec.size);
                this.ctx.fillStyle = '#0a8a0a';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - dec.size/2 - 10, dec.size/2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (dec.type === 1) { // Камень
                this.ctx.fillStyle = '#888';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY, dec.size/2, dec.size/3, 0, 0, Math.PI * 2);
                this.ctx.fill();
            } else { // Куст
                this.ctx.fillStyle = '#2a8a2a';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, dec.size/2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawGrid() {
        const cellSize = 80;
        const startX = Math.floor(this.cameraX / cellSize) * cellSize;
        const startY = Math.floor(this.cameraY / cellSize) * cellSize;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = startX; x < this.cameraX + this.screenWidth; x += cellSize) {
            const screenX = x - this.cameraX;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.screenHeight);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < this.cameraY + this.screenHeight; y += cellSize) {
            const screenY = y - this.cameraY;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.screenWidth, screenY);
            this.ctx.stroke();
        }
    }

        togglePause() {
        if (this.isPaused) {
            this.resume();
            document.getElementById('pauseMenu').style.display = 'none';
        } else {
            this.pause();
            document.getElementById('pauseMenu').style.display = 'block';
        }
    }
    
    gameOver() {
        this.isRunning = false;
        alert('💀 Игра окончена! Вы продержались ' + Math.floor(this.gameTime) + ' секунд');
        this.exitArena();
    }
    
    exitArena() {
        this.stop();
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screenLobby').classList.add('active');
        document.querySelector('.game-nav').style.display = 'flex';
        
        if (this.hero && this.hero.heroData) {
            this.hero.heroData.currentStats.hp = this.hero.hp;
            this.hero.heroData.level = this.hero.level;
            this.hero.heroData.exp = this.hero.exp;
            window.GameState.notify();
        }
        
        window.currentArena = null;
    }
    
    initControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                e.preventDefault();
                this.keys[e.key] = true;
            }
            
            if (e.key === 'Escape' && this.isRunning) {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                e.preventDefault();
                this.keys[e.key] = false;
            }
        });
        
        const joystickBase = document.querySelector('.joystick-base');
        const joystickThumb = document.getElementById('joystickThumb');
        
        if (joystickBase && joystickThumb) {
            let joystickActive = false;
            
            joystickBase.addEventListener('touchstart', (e) => {
                e.preventDefault();
                joystickActive = true;
                this.joystick.active = true;
            });
            
            joystickBase.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!joystickActive) return;
                
                const touch = e.touches[0];
                const rect = joystickBase.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                let dx = touch.clientX - centerX;
                let dy = touch.clientY - centerY;
                
                const maxRadius = rect.width / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > maxRadius) {
                    dx = (dx / distance) * maxRadius;
                    dy = (dy / distance) * maxRadius;
                }
                
                joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;
                
                this.joystick.dirX = dx / maxRadius;
                this.joystick.dirY = dy / maxRadius;
            });
            
            joystickBase.addEventListener('touchend', (e) => {
                e.preventDefault();
                joystickActive = false;
                this.joystick.active = false;
                joystickThumb.style.transform = 'translate(0, 0)';
            });
        }
    }
}

// Делаем глобальным
window.SurvivorsArena = SurvivorsArena;