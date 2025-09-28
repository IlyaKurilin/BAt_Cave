// Bird.js - Класс птицы с физикой и анимацией
class Bird {
    constructor(game) {
        this.game = game;
        
        // Позиция и размеры
        // Позиционируем строго по центру экрана
        this.x = game.gameWidth * 0.5;
        this.y = game.gameHeight * 0.5;
        this.width = 30;
        this.height = 25;
        
        // Физика
        this.velocity = 0;
        this.gravity = 0.35;
        this.jumpPower = -6;
        this.maxVelocity = 10;
        this.terminalVelocity = 12;
        
        // Анимация
        this.rotation = 0;
        this.maxRotation = Math.PI / 6; // 30 градусов
        this.rotationSpeed = 0.1;
        
        // Визуальные эффекты
        this.flapAnimation = 0;
        this.flapSpeed = 0.3;
        this.trailParticles = [];
        
        // Power-ups эффекты
        this.powerUps = {
            shield: { active: false, duration: 0 },
            immortal: { active: false, duration: 0 },
            doublePoints: { active: false, duration: 0 },
            smallBird: { active: false, duration: 0 },
            magnetCoin: { active: false, duration: 0 }
        };
        
        // Цвета летучей мыши для разных состояний
        this.colors = {
            normal: { body: '#2C1810', wing: '#1A0F08', beak: '#8B4513' },
            shield: { body: '#1E3A8A', wing: '#1E40AF', beak: '#3B82F6' },
            immortal: { body: '#FFD700', wing: '#FFA500', beak: '#FF8C00' }, // Золотой цвет для бессмертия
            doublePoints: { body: '#166534', wing: '#15803D', beak: '#22C55E' },
            smallBird: { body: '#BE185D', wing: '#E11D48', beak: '#F472B6' },
            magnetCoin: { body: '#C2410C', wing: '#EA580C', beak: '#FB923C' }
        };
        
        this.currentColors = this.colors.normal;
    }
    
    update(deltaTime) {
        // Обновляем power-ups
        this.updatePowerUps(deltaTime);
        
        // Применяем гравитацию
        this.velocity += this.gravity * (deltaTime / 16);
        
        // Ограничиваем скорость падения
        if (this.velocity > this.terminalVelocity) {
            this.velocity = this.terminalVelocity;
        }
        
        // Обновляем позицию
        this.y += this.velocity * (deltaTime / 16);
        
        // Обновляем поворот птицы
        this.updateRotation();
        
        // Обновляем анимацию крыльев
        this.flapAnimation += this.flapSpeed * (deltaTime / 16);
        if (this.flapAnimation > Math.PI * 2) {
            this.flapAnimation = 0;
        }
        
        // Обновляем частицы следа
        this.updateTrailParticles(deltaTime);
        
        // Обновляем цвета в зависимости от активных power-ups
        this.updateColors();
    }
    
    updatePowerUps(deltaTime) {
        Object.keys(this.powerUps).forEach(key => {
            const powerUp = this.powerUps[key];
            if (powerUp.active) {
                powerUp.duration -= deltaTime;
                if (powerUp.duration <= 0) {
                    powerUp.active = false;
                    powerUp.duration = 0;
                    
                    // Сброс эффектов при окончании power-up
                    if (key === 'smallBird') {
                        this.width = 30;
                        this.height = 25;
                    }
                }
            }
        });
    }
    
    updateRotation() {
        // Поворот в зависимости от скорости
        if (this.velocity < 0) {
            // Поднимается - поворот вверх
            this.rotation = Math.max(-this.maxRotation, this.rotation - this.rotationSpeed);
        } else {
            // Падает - поворот вниз
            this.rotation = Math.min(this.maxRotation, this.rotation + this.rotationSpeed);
        }
    }
    
    updateTrailParticles(deltaTime) {
        // Добавляем новые частицы при активном щите
        if (this.powerUps.shield.active && Math.random() < 0.3) {
            this.trailParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: -2 - Math.random() * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                maxLife: 30 + Math.random() * 20,
                color: '#00BFFF'
            });
        }
        
        // Обновляем существующие частицы
        this.trailParticles = this.trailParticles.filter(particle => {
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            particle.life -= deltaTime / 16;
            return particle.life > 0;
        });
    }
    
    updateColors() {
        if (this.powerUps.shield.active) {
            this.currentColors = this.colors.shield;
        } else if (this.powerUps.immortal.active) {
            this.currentColors = this.colors.immortal;
        } else if (this.powerUps.doublePoints.active) {
            this.currentColors = this.colors.doublePoints;
        } else if (this.powerUps.smallBird.active) {
            this.currentColors = this.colors.smallBird;
        } else if (this.powerUps.magnetCoin.active) {
            this.currentColors = this.colors.magnetCoin;
        } else {
            this.currentColors = this.colors.normal;
        }
    }
    
    flap() {
        // Звук взмаха
        if (this.game.soundEnabled) {
            this.game.playSound('flap');
        }
        
        // Применяем силу прыжка
        this.velocity = this.jumpPower;
        
        // Добавляем частицы при взмахе
        for (let i = 0; i < 3; i++) {
            this.trailParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                vx: -1 - Math.random() * 2,
                vy: 2 + Math.random() * 2,
                life: 20 + Math.random() * 10,
                maxLife: 20 + Math.random() * 10,
                color: '#FFF'
            });
        }
    }
    
    activatePowerUp(type, duration = 5000) {
        this.powerUps[type].active = true;
        this.powerUps[type].duration = duration;
        
        // Звук активации power-up
        if (this.game && this.game.soundEnabled) {
            this.game.playSound('powerup');
        }
        
        // Специальные эффекты для определенных power-ups
        switch (type) {
            case 'smallBird':
                this.width = 20;
                this.height = 15;
                break;
            case 'shield':
                // Добавляем эффектные частицы при активации щита
                for (let i = 0; i < 10; i++) {
                    this.trailParticles.push({
                        x: this.x + this.width / 2,
                        y: this.y + this.height / 2,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        life: 30,
                        maxLife: 30,
                        color: '#00BFFF'
                    });
                }
                break;
        }
    }
    
    hasShield() {
        return this.powerUps.shield.active;
    }
    
    isImmortal() {
        return this.powerUps.immortal.active;
    }
    
    consumeShield() {
        // Поглощение щита при столкновении
        if (this.powerUps.shield.active) {
            this.powerUps.shield.active = false;
            this.powerUps.shield.duration = 0;
            this.updateColors();
            
            // Визуальный эффект при поглощении щита
            if (this.game && this.game.soundEnabled) {
                this.game.playSound('powerup'); // Звук поглощения щита
            }
            
            return true; // Щит поглотил урон
        }
        return false; // Щита не было
    }
    
    getCollisionBox() {
        // Возвращаем коробку коллизии с учетом размера при smallBird
        return {
            x: this.x + 2,
            y: this.y + 2,
            width: this.width - 4,
            height: this.height - 4
        };
    }
    
    reset() {
        // Позиционируем строго по центру экрана
        this.x = this.game.gameWidth * 0.5;
        this.y = this.game.gameHeight * 0.5;
        this.velocity = 0;
        this.rotation = 0;
        this.flapAnimation = 0;
        this.trailParticles = [];
        
        // НЕ сбрасываем power-ups при перезапуске - они должны продолжать работать
        // Только обновляем внешний вид птицы в соответствии с активными power-ups
        this.updateColors();
        
        // Сброс размеров только если не активен smallBird
        if (!this.powerUps.smallBird.active) {
            this.width = 30;
            this.height = 25;
        }
    }
    
    resetPowerUps() {
        // Сброс всех power-ups (используется при смерти)
        Object.keys(this.powerUps).forEach(key => {
            this.powerUps[key].active = false;
            this.powerUps[key].duration = 0;
        });
        
        // Сброс размеров и цветов
        this.width = 30;
        this.height = 25;
        this.currentColors = this.colors.normal;
    }
    
    render(ctx) {
        // Рендер частиц следа
        this.renderTrailParticles(ctx);
        
        // Сохраняем контекст для трансформаций
        ctx.save();
        
        // Перемещаем и поворачиваем
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Рендер щита
        if (this.powerUps.shield.active) {
            this.renderShield(ctx);
        }
        
        // Рендер тела птицы
        this.renderBird(ctx);
        
        // Восстанавливаем контекст
        ctx.restore();
        
        // Рендер индикатора power-up
        this.renderPowerUpIndicator(ctx);
    }
    
    renderTrailParticles(ctx) {
        this.trailParticles.forEach(particle => {
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
    
    renderShield(ctx) {
        const time = Date.now() * 0.01;
        const shieldRadius = Math.max(this.width, this.height) / 2 + 8;
        
        ctx.save();
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7 + Math.sin(time) * 0.3;
        
        // Основной круг щита
        ctx.beginPath();
        ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Дополнительные эффекты
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, shieldRadius + 2, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    renderBird(ctx) {
        const wingFlap = Math.sin(this.flapAnimation * 4) * 0.5 + 0.5; // 0 to 1
        const wingSpread = Math.sin(this.flapAnimation * 4) * 8; // Wing spread animation
        
        // Тело летучей мыши (более вытянутое)
        ctx.fillStyle = this.currentColors.body;
        ctx.beginPath();
        ctx.ellipse(0, 2, this.width / 2.5, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Левое крыло
        ctx.fillStyle = this.currentColors.wing;
        ctx.beginPath();
        ctx.moveTo(-this.width / 4, 0);
        ctx.quadraticCurveTo(-this.width / 2 - wingSpread, -this.height / 3 - wingFlap * 5, 
                           -this.width / 3 - wingSpread, this.height / 4 + wingFlap * 3);
        ctx.quadraticCurveTo(-this.width / 4, this.height / 3, -this.width / 6, 0);
        ctx.closePath();
        ctx.fill();
        
        // Правое крыло
        ctx.beginPath();
        ctx.moveTo(this.width / 4, 0);
        ctx.quadraticCurveTo(this.width / 2 + wingSpread, -this.height / 3 - wingFlap * 5, 
                           this.width / 3 + wingSpread, this.height / 4 + wingFlap * 3);
        ctx.quadraticCurveTo(this.width / 4, this.height / 3, this.width / 6, 0);
        ctx.closePath();
        ctx.fill();
        
        // Мембраны крыльев (детали)
        ctx.strokeStyle = this.currentColors.beak;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Левое крыло - жилки
        ctx.moveTo(-this.width / 5, -2);
        ctx.lineTo(-this.width / 2.5 - wingSpread * 0.7, -this.height / 4 - wingFlap * 3);
        ctx.moveTo(-this.width / 6, 2);
        ctx.lineTo(-this.width / 3 - wingSpread * 0.7, this.height / 6 + wingFlap * 2);
        // Правое крыло - жилки  
        ctx.moveTo(this.width / 5, -2);
        ctx.lineTo(this.width / 2.5 + wingSpread * 0.7, -this.height / 4 - wingFlap * 3);
        ctx.moveTo(this.width / 6, 2);
        ctx.lineTo(this.width / 3 + wingSpread * 0.7, this.height / 6 + wingFlap * 2);
        ctx.stroke();
        
        // Голова (меньше тела)
        ctx.fillStyle = this.currentColors.body;
        ctx.beginPath();
        ctx.ellipse(0, -this.height / 4, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Уши
        ctx.fillStyle = this.currentColors.wing;
        ctx.beginPath();
        // Левое ухо
        ctx.moveTo(-this.width / 6, -this.height / 3);
        ctx.lineTo(-this.width / 4, -this.height / 2);
        ctx.lineTo(-this.width / 8, -this.height / 2.5);
        ctx.closePath();
        ctx.fill();
        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(this.width / 6, -this.height / 3);
        ctx.lineTo(this.width / 4, -this.height / 2);
        ctx.lineTo(this.width / 8, -this.height / 2.5);
        ctx.closePath();
        ctx.fill();
        
        // Глаза (красные для летучей мыши)
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(-4, -this.height / 3.5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -this.height / 3.5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Белые блики в глазах
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-3, -this.height / 3.2, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, -this.height / 3.2, 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Эффект свечения для power-ups
        if (this.powerUps.doublePoints.active || this.powerUps.immortal.active) {
            ctx.save();
            ctx.shadowColor = this.currentColors.body;
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = this.currentColors.body;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width / 2 + 8, this.height / 2 + 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    renderPowerUpIndicator(ctx) {
        const activePowerUps = Object.keys(this.powerUps).filter(key => this.powerUps[key].active);
        
        activePowerUps.forEach((powerUp, index) => {
            const x = this.x + this.width + 10;
            const y = this.y + index * 15;
            const duration = this.powerUps[powerUp].duration;
            
            // Индикатор времени
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x, y, 30, 6);
            
            const timePercent = Math.max(0, duration / 5000); // 5 секунд по умолчанию
            ctx.fillStyle = this.getPowerUpColor(powerUp);
            ctx.fillRect(x, y, 30 * timePercent, 6);
        });
    }
    
    getPowerUpColor(powerUp) {
        const colors = {
            shield: '#00BFFF',
            immortal: '#FFD700',
            doublePoints: '#32CD32',
            smallBird: '#FF69B4'
        };
        return colors[powerUp] || '#FFF';
    }
}

// Экспортируем класс для использования в других модулях
window.Bird = Bird;
