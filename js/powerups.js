// PowerUps.js - Система бонусов и улучшений
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 25;
        this.height = 25;
        this.collected = false;
        
        // Анимация
        this.floatOffset = 0;
        this.floatSpeed = 0.1;
        this.rotationSpeed = 0.05;
        this.rotation = 0;
        this.scale = 1;
        this.scaleDirection = 1;
        
        // Эффекты
        this.particles = [];
        this.glowIntensity = 0;
        
        // Настройки для разных типов
        this.setupType();
    }
    
    setupType() {
        switch (this.type) {
            case 'shield':
                this.color = '#00BFFF';
                this.icon = '🛡️';
                this.description = 'Защита от одного столкновения';
                this.duration = 8000;
                break;
                
            case 'immortal':
                this.color = '#9370DB';
                this.icon = '⏰';
                this.description = 'Замедление времени';
                this.duration = 5000;
                break;
                
            case 'doublePoints':
                this.color = '#32CD32';
                this.icon = '💰';
                this.description = 'Двойные очки';
                this.duration = 10000;
                break;
                
            case 'smallBird':
                this.color = '#FF69B4';
                this.icon = '🐣';
                this.description = 'Уменьшенная птица';
                this.duration = 8000;
                break;
                
            case 'extraLife':
                this.color = '#FFD700';
                this.icon = '❤️';
                this.description = 'Дополнительная жизнь';
                this.duration = 0; // Мгновенное действие
                break;
                
            case 'magnetCoin':
                this.color = '#FFA500';
                this.icon = '🧲';
                this.description = 'Притягивает монеты';
                this.duration = 12000;
                break;
        }
    }
    
    update(deltaTime) {
        // Анимации
        this.floatOffset += this.floatSpeed * (deltaTime / 16);
        this.rotation += this.rotationSpeed * (deltaTime / 16);
        
        // Пульсация
        this.scale += this.scaleDirection * 0.01 * (deltaTime / 16);
        if (this.scale > 1.2) {
            this.scaleDirection = -1;
        } else if (this.scale < 0.8) {
            this.scaleDirection = 1;
        }
        
        // Эффект свечения
        this.glowIntensity = 0.5 + Math.sin(this.floatOffset * 2) * 0.5;
        
        // Обновляем частицы
        this.updateParticles(deltaTime);
        
        // Движение влево
        this.x -= 2 * (deltaTime / 16);
    }
    
    updateParticles(deltaTime) {
        // Добавляем новые частицы
        if (Math.random() < 0.1) {
            this.particles.push({
                x: this.x + this.width / 2 + (Math.random() - 0.5) * this.width,
                y: this.y + this.height / 2 + (Math.random() - 0.5) * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: -0.5 - Math.random() * 1,
                life: 30 + Math.random() * 30,
                maxLife: 30 + Math.random() * 30,
                color: this.color
            });
        }
        
        // Обновляем существующие частицы
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            particle.life -= deltaTime / 16;
            return particle.life > 0;
        });
    }
    
    render(ctx) {
        // Рендер частиц
        this.renderParticles(ctx);
        
        ctx.save();
        
        // Позиция с плавающим эффектом
        const renderY = this.y + Math.sin(this.floatOffset) * 5;
        
        ctx.translate(this.x + this.width / 2, renderY + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        // Эффект свечения
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10 * this.glowIntensity;
        
        // Основа power-up
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Внутренний круг
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Иконка (упрощенная версия без эмодзи для совместимости)
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        this.renderIcon(ctx);
        
        ctx.restore();
    }
    
    renderIcon(ctx) {
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        
        switch (this.type) {
            case 'shield':
                // Щит
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(-6, -4);
                ctx.lineTo(-6, 4);
                ctx.lineTo(0, 8);
                ctx.lineTo(6, 4);
                ctx.lineTo(6, -4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'immortal':
                // Часы
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -4);
                ctx.moveTo(0, 0);
                ctx.lineTo(3, 0);
                ctx.stroke();
                break;
                
            case 'doublePoints':
                // Монета
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#000';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('2x', 0, 2);
                break;
                
            case 'smallBird':
                // Маленькая птичка
                ctx.beginPath();
                ctx.ellipse(0, 0, 4, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(2, -1, 1, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'extraLife':
                // Сердце
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.moveTo(0, 2);
                ctx.lineTo(-3, -2);
                ctx.lineTo(-1, -4);
                ctx.lineTo(0, -3);
                ctx.lineTo(1, -4);
                ctx.lineTo(3, -2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'magnetCoin':
                // Магнит
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(-4, -6, 3, 8);
                ctx.fillStyle = '#0000FF';
                ctx.fillRect(1, -6, 3, 8);
                ctx.fillStyle = '#FFF';
                ctx.fillRect(-1, -6, 2, 8);
                break;
        }
    }
    
    renderParticles(ctx) {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2 * alpha, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    checkCollision(bird) {
        const birdBox = bird.getCollisionBox();
        const powerUpBox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        
        return birdBox.x < powerUpBox.x + powerUpBox.width &&
               birdBox.x + birdBox.width > powerUpBox.x &&
               birdBox.y < powerUpBox.y + powerUpBox.height &&
               birdBox.y + birdBox.height > powerUpBox.y;
    }
    
    isOffScreen(gameWidth) {
        return this.x + this.width < 0;
    }
}

class PowerUpManager {
    constructor(game) {
        this.game = game;
        this.powerUps = [];
        this.spawnChance = 0.2;
        this.lastSpawnDistance = 0;
        this.minSpawnDistance = 300;
        
        // Вероятности появления разных power-ups
        this.spawnProbabilities = {
            shield: 0.25,
            immortal: 0.2,
            doublePoints: 0.25,
            smallBird: 0.15,
            extraLife: 0.05,
            magnetCoin: 0.1
        };
        
        // Активные эффекты магнита
        this.magnetActive = false;
        this.magnetRange = 100;
    }
    
    update(deltaTime) {
        // Обновляем существующие power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.update(deltaTime);
            
            // Эффект магнита
            if (this.magnetActive && powerUp.type !== 'extraLife') {
                this.applyMagnetEffect(powerUp);
            }
        });
        
        // Удаляем power-ups, которые вышли за экран
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.isOffScreen(this.game.gameWidth));
        
        // Спавним новые power-ups
        this.spawnPowerUps();
        
        // Обновляем состояние магнита
        this.updateMagnetState();
    }
    
    applyMagnetEffect(powerUp) {
        const bird = this.game.bird;
        const dx = (bird.x + bird.width / 2) - (powerUp.x + powerUp.width / 2);
        const dy = (bird.y + bird.height / 2) - (powerUp.y + powerUp.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.magnetRange && distance > 0) {
            const force = Math.min(3, 50 / distance);
            powerUp.x += (dx / distance) * force;
            powerUp.y += (dy / distance) * force;
        }
    }
    
    updateMagnetState() {
        this.magnetActive = this.game.bird.powerUps.magnetCoin?.active || false;
    }
    
    spawnPowerUps() {
        this.lastSpawnDistance += 2; // Скорость движения экрана
        
        if (this.lastSpawnDistance >= this.minSpawnDistance && Math.random() < this.spawnChance) {
            const x = this.game.gameWidth;
            const y = 50 + Math.random() * (this.game.gameHeight - 150);
            const type = this.selectPowerUpType();
            
            this.powerUps.push(new window.PowerUp(x, y, type));
            this.lastSpawnDistance = 0;
        }
    }
    
    selectPowerUpType() {
        const random = Math.random();
        let cumulative = 0;
        
        for (const [type, probability] of Object.entries(this.spawnProbabilities)) {
            cumulative += probability;
            if (random <= cumulative) {
                return type;
            }
        }
        
        return 'doublePoints'; // Fallback
    }
    
    checkCollision(bird) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (powerUp.checkCollision(bird)) {
                this.collectPowerUp(powerUp, bird);
                this.powerUps.splice(i, 1);
                break;
            }
        }
    }
    
    collectPowerUp(powerUp, bird) {
        // Звук сбора
        if (this.game.soundEnabled) {
            this.game.playSound('powerUp');
        }
        
        // Применяем эффект power-up
        switch (powerUp.type) {
            case 'shield':
            case 'immortal':
            case 'doublePoints':
            case 'smallBird':
                bird.activatePowerUp(powerUp.type, powerUp.duration);
                break;
                
            case 'extraLife':
                // Специальная логика для дополнительной жизни
                this.giveExtraLife();
                break;
                
            case 'magnetCoin':
                bird.activatePowerUp('magnetCoin', powerUp.duration);
                break;
        }
        
        // Эффектные частицы при сборе
        this.createCollectionEffect(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.color);
        
        // Обновляем UI
        this.updatePowerUpUI(powerUp.type, powerUp.duration);
    }
    
    giveExtraLife() {
        // В будущем можно добавить систему жизней
        // Пока просто добавляем очки
        this.game.addScore(5);
        console.log('Extra life collected! (+5 points)');
    }
    
    createCollectionEffect(x, y, color) {
        const bird = this.game.bird;
        
        // Добавляем частицы в систему птицы для эффекта
        for (let i = 0; i < 10; i++) {
            bird.trailParticles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 20 + Math.random() * 20,
                maxLife: 20 + Math.random() * 20,
                color: color
            });
        }
    }
    
    updatePowerUpUI(type, duration) {
        const powerUpIcon = document.getElementById('powerUpIcon');
        const powerUpTimer = document.getElementById('powerUpTimer');
        
        if (duration > 0) {
            powerUpIcon.className = 'power-up-icon';
            powerUpIcon.innerHTML = this.getPowerUpSymbol(type);
            powerUpIcon.style.backgroundColor = this.getPowerUpColor(type);
            
            powerUpTimer.className = 'power-up-timer';
            powerUpTimer.textContent = Math.ceil(duration / 1000) + 's';
            
            // Обновляем таймер
            this.startPowerUpTimer(duration);
        }
    }
    
    startPowerUpTimer(duration) {
        const powerUpTimer = document.getElementById('powerUpTimer');
        let remaining = duration;
        
        const timer = setInterval(() => {
            remaining -= 100;
            if (remaining <= 0) {
                clearInterval(timer);
                document.getElementById('powerUpIcon').className = 'power-up-icon hidden';
                document.getElementById('powerUpTimer').className = 'power-up-timer hidden';
            } else {
                powerUpTimer.textContent = Math.ceil(remaining / 1000) + 's';
            }
        }, 100);
    }
    
    getPowerUpSymbol(type) {
        const symbols = {
            shield: '🛡',
            immortal: '✨',
            doublePoints: '💰',
            smallBird: '🐣',
            extraLife: '❤',
            magnetCoin: '🧲'
        };
        return symbols[type] || '⭐';
    }
    
    getPowerUpColor(type) {
        const colors = {
            shield: '#00BFFF',
            immortal: '#FFD700',
            doublePoints: '#32CD32',
            smallBird: '#FF69B4',
            extraLife: '#FFD700',
            magnetCoin: '#FFA500'
        };
        return colors[type] || '#FFF';
    }
    
    reset() {
        this.powerUps = [];
        this.lastSpawnDistance = 0;
        this.magnetActive = false;
        
        // Скрываем UI элементы
        document.getElementById('powerUpIcon').className = 'power-up-icon hidden';
        document.getElementById('powerUpTimer').className = 'power-up-timer hidden';
    }
    
    render(ctx) {
        // Рендер магнитного поля если активно
        if (this.magnetActive) {
            this.renderMagnetField(ctx);
        }
        
        // Рендер всех power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.render(ctx);
        });
        
        // Дебаг информация
        if (false) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '12px Arial';
            ctx.fillText(`PowerUps: ${this.powerUps.length}`, 10, 60);
            ctx.fillText(`Magnet: ${this.magnetActive}`, 10, 75);
        }
    }
    
    renderMagnetField(ctx) {
        const bird = this.game.bird;
        ctx.save();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, this.magnetRange, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Методы для настройки сложности
    adjustDifficulty(difficulty) {
        const settings = {
            easy: { spawnChance: 0.3, minSpawnDistance: 250 },
            normal: { spawnChance: 0.2, minSpawnDistance: 300 },
            hard: { spawnChance: 0.15, minSpawnDistance: 350 },
            extreme: { spawnChance: 0.1, minSpawnDistance: 400 }
        };
        
        const setting = settings[difficulty] || settings.normal;
        this.spawnChance = setting.spawnChance;
        this.minSpawnDistance = setting.minSpawnDistance;
    }
}

// Экспортируем классы для использования в других модулях
window.PowerUp = PowerUp;
window.PowerUpManager = PowerUpManager;
