// Pipes.js - Система труб с различными типами и коллизиями
window.Pipe = class Pipe {
    constructor(x, gap, gapY, type = 'normal') {
        this.x = x;
        this.width = 60;
        this.gap = gap;
        this.gapY = gapY;
        this.type = type;
        this.scored = false;
        
        // Высоты верхней и нижней трубы
        this.topHeight = gapY - gap / 2;
        this.bottomY = gapY + gap / 2;
        
        // Специальные свойства для разных типов труб
        this.setupType();
        
        // Анимация
        this.animationOffset = 0;
        this.animationSpeed = 0.05;
    }
    
    setupType() {
        switch (this.type) {
            case 'moving':
                this.moveSpeed = 1;
                this.moveDirection = 1;
                this.moveRange = 30;
                this.originalGapY = this.gapY;
                break;
            case 'narrow':
                this.gap *= 0.7;
                this.color = '#8B4513';
                break;
            case 'wide':
                this.gap *= 1.5;
                this.color = '#696969';
                break;
            case 'rotating':
                this.rotation = 0;
                this.rotationSpeed = 0.01; // Уменьшена скорость вращения
                this.color = '#4A4A4A';
                break;
            default:
                this.color = '#5A5A5A';
                break;
        }
        
        // Пересчитываем высоты после изменения gap
        this.topHeight = this.gapY - this.gap / 2;
        this.bottomY = this.gapY + this.gap / 2;
    }
    
    update(deltaTime, gameHeight) {
        this.animationOffset += this.animationSpeed * (deltaTime / 16);
        
        switch (this.type) {
            case 'moving':
                this.gapY += this.moveDirection * this.moveSpeed * (deltaTime / 16);
                
                // Изменяем направление при достижении границ
                if (this.gapY <= this.originalGapY - this.moveRange) {
                    this.moveDirection = 1;
                } else if (this.gapY >= this.originalGapY + this.moveRange) {
                    this.moveDirection = -1;
                }
                
                // Обновляем высоты
                this.topHeight = this.gapY - this.gap / 2;
                this.bottomY = this.gapY + this.gap / 2;
                break;
                
            case 'rotating':
                this.rotation += this.rotationSpeed * (deltaTime / 16);
                break;
        }
        
        // Убеждаемся, что труба не выходит за границы экрана
        if (this.topHeight < 0) {
            this.gapY = this.gap / 2;
            this.topHeight = 0;
            this.bottomY = this.gap;
        }
        
        if (this.bottomY > gameHeight - 20) {
            this.gapY = gameHeight - 20 - this.gap / 2;
            this.bottomY = gameHeight - 20;
            this.topHeight = this.gapY - this.gap / 2;
        }
    }
    
    render(ctx, gameHeight) {
        ctx.save();
        
        if (this.type === 'rotating') {
            // Поворот для вращающихся скал вокруг центра прохода
            ctx.translate(this.x + this.width / 2, this.gapY);
            ctx.rotate(this.rotation);
            ctx.translate(-(this.x + this.width / 2), -this.gapY);
        }
        
        // Цвет скалы
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#2F2F2F';
        ctx.lineWidth = 2;
        
        // Верхний сталактит
        this.renderRockSegment(ctx, this.x, 0, this.width, this.topHeight, true);
        
        // Нижний сталагмит
        this.renderRockSegment(ctx, this.x, this.bottomY, this.width, gameHeight - this.bottomY - 25, false);
        
        // Специальные эффекты для разных типов
        this.renderSpecialEffects(ctx, gameHeight);
        
        ctx.restore();
    }
    
    renderRockSegment(ctx, x, y, width, height, isTop) {
        if (height <= 0) return;
        
        ctx.save();
        
        // Основная скала с неровными краями
        ctx.beginPath();
        if (isTop) {
            // Сталактит (свисает сверху)
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + height - 15);
            
            // Неровный нижний край
            for (let i = 0; i < width; i += 8) {
                const pointHeight = y + height - 5 + Math.sin(i * 0.3) * 8;
                ctx.lineTo(x + width - i, pointHeight);
            }
            ctx.lineTo(x, y + height - 10);
        } else {
            // Сталагмит (растёт снизу)
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + width, y + 15);
            
            // Неровный верхний край
            for (let i = 0; i < width; i += 8) {
                const pointHeight = y + 5 + Math.sin(i * 0.3) * 8;
                ctx.lineTo(x + width - i, pointHeight);
            }
            ctx.lineTo(x, y + 10);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Текстура скалы
        this.renderRockTexture(ctx, x, y, width, height, isTop);
        
        ctx.restore();
    }
    
    renderRockTexture(ctx, x, y, width, height, isTop) {
        ctx.save();
        
        // Каменные трещины
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Вертикальные трещины
        for (let i = 0; i < 3; i++) {
            const crackX = x + 15 + i * 15 + Math.random() * 10;
            const startY = y + height * 0.2;
            const endY = y + height * 0.8;
            
            ctx.moveTo(crackX, startY);
            ctx.quadraticCurveTo(
                crackX + (Math.random() - 0.5) * 10, 
                startY + (endY - startY) * 0.5,
                crackX + (Math.random() - 0.5) * 5, 
                endY
            );
        }
        
        // Горизонтальные слои камня
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = y + 20; i < y + height - 20; i += 25) {
            const layerHeight = 2 + Math.random() * 3;
            ctx.fillRect(x + 5, i, width - 10, layerHeight);
        }
        
        ctx.stroke();
        
        // Блики на камне
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 5; i++) {
            const spotX = x + 10 + Math.random() * (width - 20);
            const spotY = y + 10 + Math.random() * (height - 20);
            const spotSize = 3 + Math.random() * 5;
            
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    renderSpecialEffects(ctx, gameHeight) {
        switch (this.type) {
            case 'moving':
                // Стрелки показывающие направление движения
                ctx.fillStyle = '#FFD700';
                const arrowX = this.x + this.width + 5;
                const arrowY = this.gapY;
                const arrowSize = 5;
                
                ctx.beginPath();
                if (this.moveDirection > 0) {
                    // Стрелка вниз
                    ctx.moveTo(arrowX, arrowY - arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY);
                    ctx.lineTo(arrowX - arrowSize, arrowY);
                } else {
                    // Стрелка вверх
                    ctx.moveTo(arrowX, arrowY + arrowSize);
                    ctx.lineTo(arrowX + arrowSize, arrowY);
                    ctx.lineTo(arrowX - arrowSize, arrowY);
                }
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'narrow':
                // Красные предупреждающие полосы
                ctx.fillStyle = '#FF0000';
                ctx.globalAlpha = 0.7 + Math.sin(this.animationOffset * 5) * 0.3;
                ctx.fillRect(this.x - 5, this.topHeight, this.width + 10, 5);
                ctx.fillRect(this.x - 5, this.bottomY - 5, this.width + 10, 5);
                ctx.globalAlpha = 1;
                break;
                
            case 'wide':
                // Зеленые успокаивающие полосы
                ctx.fillStyle = '#00FF00';
                ctx.globalAlpha = 0.5;
                ctx.fillRect(this.x - 5, this.topHeight, this.width + 10, 3);
                ctx.fillRect(this.x - 5, this.bottomY - 3, this.width + 10, 3);
                ctx.globalAlpha = 1;
                break;
                
            case 'rotating':
                // Эффект свечения для вращающихся труб
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - 5, 0, this.width + 10, gameHeight);
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
                break;
        }
    }
    
    checkCollision(bird) {
        const birdBox = bird.getCollisionBox();
        
        // Для вращающихся скал используем упрощенную коллизию без поворота
        if (this.type === 'rotating') {
            return this.checkRotatingCollision(birdBox, bird.game.gameHeight);
        }
        
        // Проверка столкновения с верхней трубой
        if (this.isColliding(birdBox, {
            x: this.x,
            y: 0,
            width: this.width,
            height: this.topHeight
        })) {
            return true;
        }
        
        // Проверка столкновения с нижней трубой
        if (this.isColliding(birdBox, {
            x: this.x,
            y: this.bottomY,
            width: this.width,
            height: bird.game.gameHeight - this.bottomY
        })) {
            return true;
        }
        
        return false;
    }
    
    checkRotatingCollision(birdBox, gameHeight) {
        // Для вращающихся скал проверяем коллизию без учета поворота
        // но с значительно уменьшенной зоной коллизии для компенсации поворота
        const margin = 20; // Больший отступ для вращающихся труб
        
        // Проверка столкновения с верхней частью
        if (this.isColliding(birdBox, {
            x: this.x + margin,
            y: 0,
            width: this.width - margin * 2,
            height: this.topHeight
        })) {
            return true;
        }
        
        // Проверка столкновения с нижней частью
        if (this.isColliding(birdBox, {
            x: this.x + margin,
            y: this.bottomY,
            width: this.width - margin * 2,
            height: gameHeight - this.bottomY
        })) {
            return true;
        }
        
        return false;
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    isOffScreen(gameWidth) {
        return this.x + this.width < 0;
    }
    
    canScore(bird) {
        return !this.scored && bird.x > this.x + this.width / 2;
    }
}

window.PipeManager = class PipeManager {
    constructor(game) {
        this.game = game;
        this.pipes = [];
        this.gap = 120;
        this.speed = 2;
        this.spawnDistance = 200;
        this.lastPipeX = game.gameWidth;
        
        // Типы труб и их вероятности
        this.pipeTypes = {
            normal: 0.65,
            narrow: 0.15,
            wide: 0.15,
            moving: 0.04,
            rotating: 0.01  // Сделали еще реже
        };
        
        // Генерация последовательностей
        this.sequences = {
            current: null,
            remaining: 0
        };
    }
    
    update(deltaTime) {
        // Обновляем существующие трубы
        this.pipes.forEach(pipe => {
            pipe.x -= this.speed * (deltaTime / 16);
            pipe.update(deltaTime, this.game.gameHeight);
        });
        
        // Удаляем трубы, которые вышли за экран
        this.pipes = this.pipes.filter(pipe => !pipe.isOffScreen(this.game.gameWidth));
        
        // Создаем новые трубы
        this.spawnPipes();
    }
    
    spawnPipes() {
        const lastPipe = this.pipes[this.pipes.length - 1];
        const shouldSpawn = !lastPipe || 
                           (this.game.gameWidth - (lastPipe.x + lastPipe.width)) >= this.spawnDistance;
        
        if (shouldSpawn) {
            const x = this.game.gameWidth;
            const gapY = this.generateGapY();
            const type = this.selectPipeType();
            
            this.pipes.push(new window.Pipe(x, this.gap, gapY, type));
        }
    }
    
    generateGapY() {
        const minY = this.gap / 2 + 50;
        const maxY = this.game.gameHeight - this.gap / 2 - 70;
        
        // Учитываем предыдущие трубы для плавности
        if (this.pipes.length > 0) {
            const lastPipe = this.pipes[this.pipes.length - 1];
            const maxChange = 80;
            const targetY = Math.max(minY, Math.min(maxY, 
                lastPipe.gapY + (Math.random() - 0.5) * maxChange * 2));
            return targetY;
        }
        
        return minY + Math.random() * (maxY - minY);
    }
    
    selectPipeType() {
        // Обработка последовательностей
        if (this.sequences.current && this.sequences.remaining > 0) {
            this.sequences.remaining--;
            return this.sequences.current;
        }
        
        // Иногда создаем последовательности одинаковых труб
        if (Math.random() < 0.2) {
            const sequenceTypes = ['narrow', 'wide', 'moving'];
            this.sequences.current = sequenceTypes[Math.floor(Math.random() * sequenceTypes.length)];
            this.sequences.remaining = 2 + Math.floor(Math.random() * 3);
            return this.sequences.current;
        }
        
        // Обычный выбор на основе вероятностей
        const random = Math.random();
        let cumulative = 0;
        
        for (const [type, probability] of Object.entries(this.pipeTypes)) {
            cumulative += probability;
            if (random <= cumulative) {
                return type;
            }
        }
        
        return 'normal';
    }
    
    checkCollision(bird) {
        // Простая проверка коллизий - логика щита обрабатывается в Game.checkCollisions()
        for (const pipe of this.pipes) {
            if (pipe.checkCollision(bird)) {
                return true; // Столкновение обнаружено
            }
        }
        return false; // Столкновений нет
    }
    
    checkScoring(bird, onScore) {
        this.pipes.forEach(pipe => {
            if (pipe.canScore(bird)) {
                pipe.scored = true;
                
                // Определяем количество очков в зависимости от типа трубы
                let points = 1;
                switch (pipe.type) {
                    case 'narrow':
                    case 'rotating':
                        points = 2;
                        break;
                    case 'moving':
                        points = 3;
                        break;
                }
                
                // Удваиваем очки если активен соответствующий power-up
                if (bird.powerUps.doublePoints.active) {
                    points *= 2;
                }
                
                // Вызываем callback для добавления очков
                onScore(points);
            }
        });
    }
    
    reset() {
        this.pipes = [];
        this.lastPipeX = this.game.gameWidth;
        this.sequences.current = null;
        this.sequences.remaining = 0;
    }
    
    render(ctx) {
        this.pipes.forEach(pipe => {
            pipe.render(ctx, this.game.gameHeight);
        });
        
        // Дебаг информация (можно включить для отладки)
        if (false) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '12px Arial';
            ctx.fillText(`Pipes: ${this.pipes.length}`, 10, 20);
            
            this.pipes.forEach((pipe, index) => {
                ctx.fillText(`${index}: ${pipe.type}`, 10, 40 + index * 15);
            });
        }
    }
    
    // Методы для настройки сложности
    adjustDifficulty(difficulty) {
        const settings = {
            easy: { gap: 140, speed: 1.5, spawnDistance: 250 },
            normal: { gap: 120, speed: 2, spawnDistance: 200 },
            hard: { gap: 100, speed: 2.5, spawnDistance: 180 },
            extreme: { gap: 80, speed: 3, spawnDistance: 160 }
        };
        
        const setting = settings[difficulty] || settings.normal;
        this.gap = setting.gap;
        this.speed = setting.speed;
        this.spawnDistance = setting.spawnDistance;
        
        // Обновляем вероятности для экстремального режима
        if (difficulty === 'extreme') {
            this.pipeTypes = {
                normal: 0.3,
                narrow: 0.25,
                wide: 0.2,
                moving: 0.15,
                rotating: 0.1
            };
        }
    }
}
