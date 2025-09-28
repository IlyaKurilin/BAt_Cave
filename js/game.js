// Game.js - Основной игровой движок
window.Game = class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Настройка размеров canvas
        this.setupCanvas();
        
        // Игровые переменности
        this.gameState = 'menu'; // menu, playing, gameOver, paused
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
        this.frameCount = 0;
        this.lastTime = 0;
        
        // Настройки сложности
        this.difficulty = localStorage.getItem('flappyDifficulty') || 'normal';
        this.powerUpsEnabled = localStorage.getItem('flappyPowerUps') !== 'false';
        this.soundEnabled = localStorage.getItem('flappySound') !== 'false';
        this.godMode = localStorage.getItem('flappyGodMode') === 'true';
        
        // Игровые объекты
        this.bird = new window.Bird(this);
        this.pipes = new window.PipeManager(this);
        this.powerUps = new window.PowerUpManager(this);
        this.achievements = new window.AchievementManager(this);
        this.soundManager = new window.SoundManager();
        
        // Инициализируем состояние звука из настроек
        this.soundManager.setEnabled(this.soundEnabled);
        
        // Фон и эффекты
        this.background = {
            clouds: this.generateClouds(),
            ground: 0,
            themeIndex: 0 // Текущая тема фона
        };
        
        // Система феерверков
        this.fireworks = {
            particles: [],
            active: false,
            lastCelebration: 0
        };
        
        // Темы фонов
        this.backgroundThemes = [
            {
                name: 'Deep Cave',
                colors: ['#1a1a2e', '#16213e', '#0f3460', '#0a1f3b'],
                batColor: 'rgba(80, 80, 80, 0.4)'
            },
            {
                name: 'Crystal Cave',
                colors: ['#2d1b69', '#11998e', '#38ef7d', '#0f4c75'],
                batColor: 'rgba(100, 200, 255, 0.3)'
            },
            {
                name: 'Fire Cave',
                colors: ['#3c1053', '#ad5389', '#ff6b6b', '#ee5a24'],
                batColor: 'rgba(255, 100, 100, 0.4)'
            },
            {
                name: 'Ice Cave',
                colors: ['#667eea', '#764ba2', '#a8edea', '#fed6e3'],
                batColor: 'rgba(150, 200, 255, 0.5)'
            },
            {
                name: 'Mystic Cave',
                colors: ['#2c3e50', '#4a00e0', '#8e2de2', '#74b9ff'],
                batColor: 'rgba(180, 120, 255, 0.4)'
            }
        ];
        
        // Настройки сложности
        this.difficultySettings = {
            easy: {
                pipeGap: 140,
                pipeSpeed: 1.5,
                powerUpChance: 0.3
            },
            normal: {
                pipeGap: 120,
                pipeSpeed: 2,
                powerUpChance: 0.2
            },
            hard: {
                pipeGap: 100,
                pipeSpeed: 2.5,
                powerUpChance: 0.15
            },
            extreme: {
                pipeGap: 80,
                pipeSpeed: 3,
                powerUpChance: 0.1
            }
        };
        
        // Привязка методов
        this.gameLoop = this.gameLoop.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Слушатели событий
        this.setupEventListeners();
        
        // Запуск игрового цикла
        this.gameLoop();
    }
    
    setupCanvas() {
        // Полноэкранный режим
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Сохраняем размеры для расчетов
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        
        // Настройка контекста для лучшего качества
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    setupEventListeners() {
        // Изменение размера окна
        window.addEventListener('resize', this.handleResize);
        
        // Управление игрой
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            }
        });
        
        // Тач-управление
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                this.handleInput();
            }
        });
        
        // Пауза при потере фокуса
        window.addEventListener('blur', () => {
            if (this.gameState === 'playing') {
                this.pause();
            }
        });
    }
    
    handleResize() {
        this.setupCanvas();
    }
    
    handleInput() {
        switch (this.gameState) {
            case 'playing':
                this.bird.flap();
                break;
            case 'gameOver':
                // Обработается в UI
                break;
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.frameCount = 0;
        
        // Сброс темы фона
        this.background.themeIndex = 0;
        
        // Сброс феерверков
        this.fireworks.particles = [];
        this.fireworks.active = false;
        this.fireworks.lastCelebration = 0;
        
        // Обновляем UI счёта
        if (window.UI) {
            window.UI.updateScore(this.score);
        }
        
        // Сброс игровых объектов
        this.bird.reset();
        this.pipes.reset();
        this.powerUps.reset();
        
        // Применяем настройки сложности
        const settings = this.difficultySettings[this.difficulty];
        this.pipes.gap = settings.pipeGap;
        this.pipes.speed = settings.pipeSpeed;
        this.powerUps.spawnChance = settings.powerUpChance;
        
        // В режиме бога ускоряем игру в 4 раза
        if (this.godMode) {
            this.pipes.speed *= 4;
            console.log(`🚀 Режим бога: скорость x4! (${this.pipes.speed})`);
        }
        
        // Генерируем новые облака
        this.background.clouds = this.generateClouds();
    }
    
    pause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Сбрасываем все power-ups при смерти
        this.bird.resetPowerUps();
        
        // Обновляем рекорд (не в режиме бога)
        if (this.score > this.highScore && !this.godMode) {
            this.highScore = this.score;
            localStorage.setItem('flappyHighScore', this.highScore.toString());
        }
        
        // Проверяем достижения
        this.achievements.checkAchievements(this.score);
        
        // Показываем экран окончания игры
        if (window.UI) {
            window.UI.showGameOver(this.score, this.highScore);
        }
        
        // Воспроизводим звук окончания игры
        if (this.soundEnabled) {
            this.playSound('gameOver');
        }
    }
    
    addScore(points = 1) {
        const oldScore = this.score;
        this.score += points;
        
        // Немедленное обновление UI счёта
        if (window.UI) {
            window.UI.updateScore(this.score);
        }
        
        // Проверяем, нужно ли изменить фон каждые 10 очков
        if (this.score % 10 === 0 && this.score > 0) {
            this.changeBackgroundTheme();
        }
        
        // Запускаем феерверк каждые 100 очков
        // Проверяем, прошли ли мы через какую-то сотню
        const oldHundreds = Math.floor(oldScore / 100);
        const newHundreds = Math.floor(this.score / 100);
        console.log(`🔍 Проверка феерверка: oldScore=${oldScore} (${oldHundreds}*100), newScore=${this.score} (${newHundreds}*100), lastCelebration=${this.fireworks.lastCelebration}`);
        
        if (newHundreds > oldHundreds && this.score > 0) {
            const celebrationScore = newHundreds * 100;
            if (celebrationScore !== this.fireworks.lastCelebration) {
                console.log(`🎆 УСЛОВИЕ ВЫПОЛНЕНО! Запускаем феерверк на ${celebrationScore} очках!`);
                this.launchFireworks();
                this.fireworks.lastCelebration = celebrationScore;
            }
        }
        
        // Специальный финал в режиме бога при 1000 очков
        if (this.godMode && this.score >= 1000) {
            this.triggerGodModeFinale();
            return;
        }
        
        // Звук при наборе очков
        if (this.soundEnabled) {
            this.playSound('score');
        }
    }
    
    playSound(type) {
        if (this.soundEnabled && this.soundManager) {
            this.soundManager.play(type);
        }
    }
    
    saveSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.soundManager.setEnabled(enabled);
        localStorage.setItem('flappySound', enabled.toString());
    }
    
    saveGodMode(enabled) {
        this.godMode = enabled;
        localStorage.setItem('flappyGodMode', enabled.toString());
        console.log(`🎮 Режим бога: ${enabled ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}`);
    }
    
    triggerGodModeFinale() {
        console.log("🎆💥 ФИНАЛ РЕЖИМА БОГА! 1000+ ОЧКОВ!");
        
        // Останавливаем игру
        this.gameState = 'godModeFinale';
        
        // Запускаем мега-феерверк
        this.launchMegaFireworks();
        
        // Через 2 секунды показываем специальное сообщение
        setTimeout(() => {
            if (window.UI) {
                window.UI.showGodModeFinale(this.score);
            }
        }, 2000);
        
        // Звук победы
        if (this.soundEnabled) {
            this.playSound('themeChange');
        }
    }
    
    launchMegaFireworks() {
        // Создаем массивный феерверк для финала
        this.fireworks.active = true;
        
        // Запускаем много феерверков одновременно
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createMegaFireworkBurst();
            }, i * 100);
        }
        
        // Продолжаем 5 секунд
        setTimeout(() => {
            this.fireworks.active = false;
        }, 5000);
    }
    
    createMegaFireworkBurst() {
        // Создаем несколько взрывов одновременно
        for (let burst = 0; burst < 3; burst++) {
            const x = Math.random() * this.gameWidth;
            const y = Math.random() * this.gameHeight * 0.8 + this.gameHeight * 0.1;
            
            // Более яркие цвета для финала
            const colors = [
                '#FF0000', '#FF4500', '#FFD700', '#ADFF2F', 
                '#00FFFF', '#0080FF', '#8A2BE2', '#FF1493',
                '#FFFFFF', '#FFA500'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Больше частиц для мега-эффекта
            const particleCount = 25;
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const speed = 3 + Math.random() * 6;
                
                this.fireworks.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: color,
                    life: 120, // Дольше живут
                    maxLife: 120,
                    size: 3 + Math.random() * 5,
                    gravity: 0.03
                });
            }
        }
    }
    
    changeBackgroundTheme() {
        // Переходим к следующей теме
        this.background.themeIndex = (this.background.themeIndex + 1) % this.backgroundThemes.length;
        const theme = this.backgroundThemes[this.background.themeIndex];
        
        console.log(`🎨 Смена фона на: ${theme.name}`);
        
        // Можно добавить звуковой эффект смены темы
        if (this.soundEnabled) {
            this.playSound('themeChange');
        }
    }
    
    launchFireworks() {
        console.log(`🎆 БОЛЬШОЙ ФЕЕРВЕРК! Поздравляем с ${this.score} очками!`);
        
        // Активируем систему феерверков
        this.fireworks.active = true;
        
        // Создаем больше залпов для масштабного эффекта
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createFireworkBurst();
            }, i * 150);
        }
        
        // Дополнительные залпы для большего эффекта
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createBigFireworkBurst();
            }, i * 300 + 500);
        }
        
        // Выключаем через 4 секунды (дольше для большего эффекта)
        setTimeout(() => {
            this.fireworks.active = false;
        }, 4000);
        
        // Звук феерверка
        if (this.soundEnabled) {
            this.playSound('themeChange'); // Используем существующий звук
        }
    }
    
    createFireworkBurst() {
        console.log(`💥 Создаем обычный феерверк! Частиц: ${this.fireworks.particles.length}`);
        // Случайная позиция для взрыва
        const x = Math.random() * this.gameWidth;
        const y = Math.random() * this.gameHeight * 0.6 + this.gameHeight * 0.1;
        
        // Более яркие цвета для праздничного эффекта
        const colors = [
            '#FF6B35', '#FFD700', '#FF1493', '#00CED1', 
            '#32CD32', '#FF69B4', '#FFA500', '#9370DB',
            '#FF0000', '#00FF00', '#0080FF', '#FFFFFF'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Больше частиц для более пышного эффекта
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            
            this.fireworks.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 80, // Дольше живут
                maxLife: 80,
                size: 3 + Math.random() * 4, // Больше размер
                gravity: 0.04
            });
        }
    }
    
    createBigFireworkBurst() {
        // Случайная позиция для большого взрыва
        const x = Math.random() * this.gameWidth;
        const y = Math.random() * this.gameHeight * 0.5 + this.gameHeight * 0.2;
        
        // Очень яркие праздничные цвета
        const colors = [
            '#FFD700', '#FF0000', '#00FF00', '#0080FF', 
            '#FF1493', '#00FFFF', '#FFFFFF', '#FFA500',
            '#9370DB', '#FF69B4', '#32CD32', '#FF4500'
        ];
        
        // Создаем несколько концентрических кругов частиц
        for (let ring = 0; ring < 3; ring++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particleCount = 25 + ring * 5; // Больше частиц в каждом кольце
            const baseSpeed = 2 + ring * 1.5;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const speed = baseSpeed + Math.random() * 3;
                
                this.fireworks.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: color,
                    life: 100 + ring * 20, // Внешние кольца живут дольше
                    maxLife: 100 + ring * 20,
                    size: 4 + Math.random() * 6, // Крупные частицы
                    gravity: 0.03
                });
            }
        }
    }
    
    updateFireworks() {
        if (!this.fireworks.active && this.fireworks.particles.length === 0) return;
        
        // Обновляем частицы
        this.fireworks.particles = this.fireworks.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity; // Гравитация
            particle.life--;
            
            return particle.life > 0;
        });
    }
    
    renderFireworks() {
        if (this.fireworks.particles.length === 0) {
            // console.log(`🚫 Нет частиц для рендера`);
            return;
        }
        // console.log(`🎨 Рендерим ${this.fireworks.particles.length} частиц феерверка`);
        
        this.ctx.save();
        
        this.fireworks.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            const glowStrength = alpha * 0.8 + 0.2;
            
            // Основная частица с усиленным свечением
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 20 * glowStrength;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = alpha;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Дополнительное внутреннее свечение
            this.ctx.shadowBlur = 15 * glowStrength;
            this.ctx.globalAlpha = alpha * 0.8;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Яркое центральное ядро
            this.ctx.shadowBlur = 25 * glowStrength;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.globalAlpha = alpha * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Сброс эффектов
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
        
        this.ctx.restore();
    }
    
    generateClouds() {
        const clouds = [];
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * this.gameWidth,
                y: Math.random() * this.gameHeight * 0.3,
                size: 20 + Math.random() * 30,
                speed: 0.2 + Math.random() * 0.3
            });
        }
        return clouds;
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.frameCount++;
        
        // Обновляем игровые объекты
        this.bird.update(deltaTime);
        this.pipes.update(deltaTime);
        
        if (this.powerUpsEnabled) {
            this.powerUps.update(deltaTime);
        }
        
        // Обновляем фон
        this.updateBackground(deltaTime);
        
        // Обновляем эффект щита
        this.updateShieldEffect();
        
        // Обновляем феерверки
        this.updateFireworks();
        
        // Проверяем коллизии
        this.checkCollisions();
    }
    
    updateBackground(deltaTime) {
        // Движение облаков
        this.background.clouds.forEach(cloud => {
            cloud.x -= cloud.speed * deltaTime / 16;
            if (cloud.x + cloud.size < 0) {
                cloud.x = this.gameWidth + cloud.size;
                cloud.y = Math.random() * this.gameHeight * 0.3;
            }
        });
        
        // Движение земли
        this.background.ground -= this.pipes.speed * deltaTime / 16;
        if (this.background.ground <= -50) {
            this.background.ground = 0;
        }
    }
    
    checkCollisions() {
        // Проверка столкновения с трубами
        if (this.pipes.checkCollision(this.bird)) {
            // Проверяем режим бога (разработчика)
            if (this.godMode) {
                // Режим бога - игнорируем все столкновения
                return;
            }
            // Проверяем бессмертие (игнорируем урон полностью)
            if (this.bird.isImmortal()) {
                // Бессмертие - просто игнорируем столкновение
                return;
            }
            // Проверяем, есть ли щит для поглощения урона
            if (this.bird.consumeShield()) {
                // Щит поглотил урон, игра продолжается
                this.createShieldEffect();
                return;
            }
            this.gameOver();
            return;
        }
        
        // Проверка столкновения с границами
        if (this.bird.y <= 0 || this.bird.y >= this.gameHeight - 20) {
            // Проверяем режим бога для границ
            if (this.godMode) {
                // В режиме бога отталкиваем от границ
                if (this.bird.y <= 0) {
                    this.bird.y = 1;
                    this.bird.velocity = 0;
                } else {
                    this.bird.y = this.gameHeight - 21;
                    this.bird.velocity = 0;
                }
                return;
            }
            // Проверяем бессмертие для границ
            if (this.bird.isImmortal()) {
                // Бессмертие - отталкиваем от границ, но не убиваем
                if (this.bird.y <= 0) {
                    this.bird.y = 1;
                    this.bird.velocity = 0;
                } else {
                    this.bird.y = this.gameHeight - 21;
                    this.bird.velocity = 0;
                }
                return;
            }
            // Границы игрового поля также поглощаются щитом
            if (this.bird.consumeShield()) {
                // Щит поглотил урон, отталкиваем птицу от границы
                this.createShieldEffect();
                if (this.bird.y <= 0) {
                    this.bird.y = 1;
                    this.bird.velocity = 0;
                } else {
                    this.bird.y = this.gameHeight - 21;
                    this.bird.velocity = 0;
                }
                return;
            }
            this.gameOver();
            return;
        }
        
        // Проверка сбора power-ups
        if (this.powerUpsEnabled) {
            this.powerUps.checkCollision(this.bird);
        }
        
        // Проверка прохождения труб для начисления очков
        this.pipes.checkScoring(this.bird, (points) => this.addScore(points));
    }
    
    render() {
        // Рендер игрового фона
        this.renderBackground();
        
        if (this.gameState === 'playing' || this.gameState === 'gameOver' || this.gameState === 'paused') {
            // Рендер игровых объектов
            this.pipes.render(this.ctx);
            
            if (this.powerUpsEnabled) {
                this.powerUps.render(this.ctx);
            }
            
            this.bird.render(this.ctx);
            
            // Рендер эффекта щита
            this.renderShieldEffect();
            
            // Рендер феерверка
            this.renderFireworks();
        }
        
        // Рендер паузы
        if (this.gameState === 'paused') {
            this.renderPause();
        }
    }
    
    renderBackground() {
        // Получаем текущую тему
        const theme = this.backgroundThemes[this.background.themeIndex];
        
        // Градиент пещеры с цветами текущей темы
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.gameHeight);
        gradient.addColorStop(0, theme.colors[0]);
        gradient.addColorStop(0.3, theme.colors[1]);
        gradient.addColorStop(0.7, theme.colors[2]);
        gradient.addColorStop(1, theme.colors[3]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Летучие мыши в дали (с цветом темы)
        this.ctx.fillStyle = theme.batColor;
        this.background.clouds.forEach(cloud => {
            this.ctx.save();
            this.ctx.translate(cloud.x, cloud.y);
            // Рисуем силуэт летучей мыши
            this.ctx.beginPath();
            this.ctx.moveTo(-cloud.size/4, 0);
            this.ctx.quadraticCurveTo(-cloud.size/2, -cloud.size/3, -cloud.size/3, cloud.size/4);
            this.ctx.quadraticCurveTo(-cloud.size/6, cloud.size/3, 0, 0);
            this.ctx.quadraticCurveTo(cloud.size/6, cloud.size/3, cloud.size/3, cloud.size/4);
            this.ctx.quadraticCurveTo(cloud.size/2, -cloud.size/3, cloud.size/4, 0);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Пол пещеры
        this.ctx.fillStyle = '#2D1B1B';
        this.ctx.fillRect(0, this.gameHeight - 25, this.gameWidth, 25);
        
        // Текстура пола пещеры (камни)
        this.ctx.fillStyle = '#3D2B2B';
        for (let x = this.background.ground; x < this.gameWidth; x += 30) {
            // Камни разных размеров
            const stoneSize = 8 + Math.sin(x * 0.1) * 4;
            this.ctx.fillRect(x, this.gameHeight - 20, stoneSize, 10);
            this.ctx.fillRect(x + 15, this.gameHeight - 15, stoneSize * 0.7, 8);
        }
        
        // Сталактиты на потолке
        this.ctx.fillStyle = '#4A4A4A';
        for (let x = 50; x < this.gameWidth; x += 80) {
            const height = 15 + Math.sin(x * 0.05) * 10;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x - 8, height);
            this.ctx.lineTo(x + 8, height);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        // Сталагмиты на полу
        for (let x = 80; x < this.gameWidth; x += 90) {
            const height = 12 + Math.sin(x * 0.07) * 8;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.gameHeight - 25);
            this.ctx.lineTo(x - 6, this.gameHeight - 25 - height);
            this.ctx.lineTo(x + 6, this.gameHeight - 25 - height);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        // Слабое освещение (эффект факелов)
        const time = Date.now() * 0.003;
        this.ctx.save();
        this.ctx.globalAlpha = 0.3 + Math.sin(time) * 0.1;
        const lightGradient = this.ctx.createRadialGradient(
            this.gameWidth * 0.8, this.gameHeight * 0.3, 0,
            this.gameWidth * 0.8, this.gameHeight * 0.3, 150
        );
        lightGradient.addColorStop(0, '#FF6B35');
        lightGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = lightGradient;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.restore();
    }
    
    renderPause() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ПАУЗА', this.gameWidth / 2, this.gameHeight / 2);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Нажмите SPACE для продолжения', this.gameWidth / 2, this.gameHeight / 2 + 40);
    }
    
    createShieldEffect() {
        // Создаем визуальный эффект поглощения щита
        if (!this.shieldEffect) {
            this.shieldEffect = {
                active: false,
                particles: []
            };
        }
        
        // Создаем эффектные частицы при разрушении щита (из старого кода)
        for (let i = 0; i < 15; i++) {
            this.bird.trailParticles.push({
                x: this.bird.x + this.bird.width / 2,
                y: this.bird.y + this.bird.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                maxLife: 20,
                color: '#00BFFF'
            });
        }
        
        // Также создаем дополнительные частицы вокруг птицы
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 30;
            this.shieldEffect.particles.push({
                x: this.bird.x + Math.cos(angle) * distance,
                y: this.bird.y + Math.sin(angle) * distance,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                life: 30,
                maxLife: 30,
                size: 3
            });
        }
        
        this.shieldEffect.active = true;
    }
    
    updateShieldEffect() {
        if (!this.shieldEffect || !this.shieldEffect.active) return;
        
        // Обновляем частицы
        this.shieldEffect.particles = this.shieldEffect.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
        
        // Если нет частиц, отключаем эффект
        if (this.shieldEffect.particles.length === 0) {
            this.shieldEffect.active = false;
        }
    }
    
    renderShieldEffect() {
        if (!this.shieldEffect || !this.shieldEffect.active) return;
        
        this.ctx.save();
        this.shieldEffect.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = `rgba(0, 191, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Обновление и рендер
        this.update(deltaTime);
        this.render();
        
        // Обновление UI в реальном времени
        if (window.UI && this.gameState === 'playing') {
            window.UI.updateGameUI();
        }
        
        // Следующий кадр
        requestAnimationFrame(this.gameLoop);
    }
    
    // Методы для сохранения настроек
    saveDifficulty(difficulty) {
        this.difficulty = difficulty;
        localStorage.setItem('flappyDifficulty', difficulty);
    }
    
    savePowerUpsEnabled(enabled) {
        this.powerUpsEnabled = enabled;
        localStorage.setItem('flappyPowerUps', enabled.toString());
    }
    
    saveSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('flappySound', enabled.toString());
    }
}
