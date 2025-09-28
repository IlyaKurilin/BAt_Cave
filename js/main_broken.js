// Main.js - Точка входа в приложение
class App {
    constructor() {
        this.game = null;
        this.isInitialized = false;
        
        // Запускаем инициализацию
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Flappy Bird Enhanced...');
            
            // UI уже инициализирован в init.js
            
            // Создание игрового движка
            this.game = new window.Game();
            
            // Связываем UI с игрой
            window.ui.setGame(this.game);
            
            // Настройка производительности
            this.setupPerformanceOptimizations();
            
            // Настройка для мобильных устройств
            this.setupMobileOptimizations();
            
            // Настройка аналитики игры
            this.setupGameAnalytics();
            
            // Настройка обработки ошибок
            this.setupErrorHandling();
            
            // Показать главное меню
            window.ui.showMainMenu();
            
            this.isInitialized = true;
            console.log('✅ Flappy Bird Enhanced initialized successfully!');
            
            // Показать приветственное сообщение
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Failed to initialize Flappy Bird:', error);
            this.showErrorMessage('Не удалось загрузить игру. Попробуйте обновить страницу.');
        }
    }
    
    // Метод initializeUI полностью удален - теперь в init.js
    
    setupPerformanceOptimizations() {
        // Предзагрузка важных элементов
        this.preloadAssets();
        
        // Оптимизация частоты кадров
        this.setupFrameRateOptimization();
        
        // Оптимизация памяти
        this.setupMemoryOptimization();
    }
    
    preloadAssets() {
        // В будущем здесь можно добавить предзагрузку изображений и звуков
        console.log('📦 Preloading assets...');
    }
    
    setupFrameRateOptimization() {
        // Адаптивная частота кадров на основе производительности
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measurePerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${fps}`);
                    // Можно добавить логику для снижения качества
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    }
    
    setupMemoryOptimization() {
        // Очистка памяти каждые 5 минут
        setInterval(() => {
            if (window.gc) {
                window.gc();
                console.log('🧹 Manual garbage collection triggered');
            }
        }, 300000);
    }
    
    // Старые стили удалены - теперь в init.js
    
    optimizeForMobile() {
        style.textContent = `
            /* Оптимизация производительности */
            #gameCanvas {
                will-change: transform;
                transform: translateZ(0);
            }
            
            .ui-overlay {
                will-change: opacity;
            }
            
            /* Дополнительные стили для достижений */
            .achievement-progress {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                height: 8px;
                margin: 5px 0;
                overflow: hidden;
                position: relative;
            }
            
            .achievement-progress-bar {
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                height: 100%;
                transition: width 0.3s ease;
            }
            
            .achievement-progress-text {
                position: absolute;
                top: -20px;
                right: 0;
                font-size: 10px;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .achievement-rarity {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                margin-top: 5px;
            }
            
            .achievement-rarity.common { background: #95a5a6; color: #2c3e50; }
            .achievement-rarity.rare { background: #3498db; color: white; }
            .achievement-rarity.epic { background: #9b59b6; color: white; }
            .achievement-rarity.legendary { background: #f39c12; color: white; }
            
            .achievements-stats {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin-top: 20px;
                text-align: center;
            }
            
            .achievements-stats h3 {
                margin-bottom: 10px;
                color: #FFD700;
            }
            
            .achievements-stats p {
                margin: 5px 0;
                font-size: 14px;
            }
            
            /* Стили для паузы */
            .pause-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .pause-menu {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            
            .pause-menu h2 {
                color: white;
                margin-bottom: 20px;
                font-size: 2rem;
            }
            
            .pause-menu .btn {
                margin: 10px;
            }
            
            /* Анимации загрузки */
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #70c5ce 0%, #4a9eff 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loading-bird {
                width: 60px;
                height: 45px;
                background: #FFD700;
                border-radius: 50%;
                position: relative;
                animation: loadingFly 1s ease-in-out infinite alternate;
            }
            
            .loading-bird::before {
                content: '';
                position: absolute;
                width: 20px;
                height: 15px;
                background: #FFA500;
                border-radius: 50%;
                top: 10px;
                left: -10px;
                animation: wingFlap 0.3s ease-in-out infinite alternate;
            }
            
            @keyframes loadingFly {
                from { transform: translateY(0px); }
                to { transform: translateY(-20px); }
            }
            
            @keyframes wingFlap {
                from { transform: rotate(-30deg); }
                to { transform: rotate(30deg); }
            }
            
            .loading-text {
                color: white;
                font-size: 1.2rem;
                margin-top: 20px;
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            /* Эффекты для новых достижений */
            .new-achievement {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px 10px;
                background: rgba(255, 215, 0, 0.2);
                border-radius: 8px;
                margin: 5px 0;
                border-left: 3px solid #FFD700;
            }
            
            .new-achievement .achievement-icon {
                font-size: 1.2rem;
            }
            
            .new-achievement .achievement-title {
                font-weight: bold;
                color: #FFD700;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupPerformanceOptimizations() {
        // Предзагрузка важных элементов
        this.preloadAssets();
        
        // Оптимизация частоты кадров
        this.setupFrameRateOptimization();
        
        // Управление памятью
        this.setupMemoryManagement();
    }
    
    preloadAssets() {
        // В будущем здесь можно добавить предзагрузку изображений и звуков
        console.log('📦 Preloading assets...');
    }
    
    setupFrameRateOptimization() {
        // Адаптивная частота кадров на основе производительности
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const now = performance.now();
            
            if (now - lastTime > 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = now;
                
                // Адаптация качества на основе FPS
                if (fps < 30 && this.game) {
                    console.log('⚡ Low FPS detected, optimizing...');
                    this.enablePerformanceMode();
                } else if (fps > 55 && this.game) {
                    this.disablePerformanceMode();
                }
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        requestAnimationFrame(checkPerformance);
    }
    
    enablePerformanceMode() {
        // Уменьшаем количество частиц и эффектов
        if (this.game && this.game.bird) {
            this.game.bird.trailParticles = this.game.bird.trailParticles.slice(0, 5);
        }
        
        if (this.game && this.game.powerUps) {
            this.game.powerUps.powerUps.forEach(powerUp => {
                powerUp.particles = powerUp.particles.slice(0, 2);
            });
        }
    }
    
    disablePerformanceMode() {
        // Возвращаем нормальное качество
        // Здесь можно добавить логику восстановления эффектов
    }
    
    setupMemoryManagement() {
        // Очистка памяти каждые 30 секунд
        setInterval(() => {
            if (this.game && this.game.gameState !== 'playing') {
                this.cleanupMemory();
            }
        }, 30000);
    }
    
    cleanupMemory() {
        // Очистка неиспользуемых объектов
        if (this.game) {
            // Ограничиваем количество частиц
            if (this.game.bird && this.game.bird.trailParticles.length > 20) {
                this.game.bird.trailParticles = this.game.bird.trailParticles.slice(-10);
            }
            
            // Очистка старых труб
            if (this.game.pipes && this.game.pipes.pipes.length > 5) {
                this.game.pipes.pipes = this.game.pipes.pipes.slice(-3);
            }
        }
    }
    
    setupMobileOptimizations() {
        // Проверяем, мобильное ли устройство
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            console.log('📱 Mobile device detected, applying optimizations...');
            
            // Отключаем некоторые эффекты на мобильных
            document.body.classList.add('mobile-optimized');
            
            // Добавляем мета-тег для viewport если его нет
            if (!document.querySelector('meta[name="viewport"]')) {
                const viewport = document.createElement('meta');
                viewport.name = 'viewport';
                viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
                document.head.appendChild(viewport);
            }
            
            // Скрываем курсор на тач-устройствах
            document.body.style.cursor = 'none';
            
            // Оптимизация тач-событий
            this.setupTouchOptimizations();
        }
    }
    
    setupTouchOptimizations() {
        let touchStartTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Игнорируем очень короткие или длинные касания
            if (touchDuration > 50 && touchDuration < 500) {
                if (this.game && this.game.gameState === 'playing') {
                    this.game.handleInput();
                }
            }
            
            e.preventDefault();
        }, { passive: false });
    }
    
    setupGameAnalytics() {
        // Простая аналитика игры
        this.analytics = {
            sessionStart: Date.now(),
            gamesPlayed: 0,
            totalScore: 0,
            maxScore: 0,
            powerUpsCollected: 0,
            achievements: 0
        };
        
        // Отправляем статистику каждые 5 минут
        setInterval(() => {
            this.sendAnalytics();
        }, 300000);
        
        // Отправляем статистику при закрытии страницы
        window.addEventListener('beforeunload', () => {
            this.sendAnalytics();
        });
    }
    
    sendAnalytics() {
        // В реальном приложении здесь была бы отправка данных на сервер
        console.log('📊 Analytics data:', this.analytics);
        
        // Сохраняем в localStorage для демонстрации
        localStorage.setItem('flappyAnalytics', JSON.stringify(this.analytics));
    }
    
    setupErrorHandling() {
        // Глобальная обработка ошибок
        window.addEventListener('error', (event) => {
            console.error('🚨 Global error:', event.error);
            this.handleError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }
    
    handleError(error) {
        // Логируем ошибку
        const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            gameState: this.game ? this.game.gameState : 'unknown'
        };
        
        console.error('Error details:', errorInfo);
        
        // Показываем пользователю дружелюбное сообщение
        if (this.isInitialized && window.ui) {
            window.ui.showToast('Произошла ошибка. Игра продолжает работать.', 'error');
        }
        
        // В продакшене здесь была бы отправка ошибки на сервер
    }
    
    showWelcomeMessage() {
        // Проверяем, первый ли это визит
        const isFirstVisit = !localStorage.getItem('flappyFirstVisit');
        
        if (isFirstVisit) {
            localStorage.setItem('flappyFirstVisit', 'true');
            
            setTimeout(() => {
                if (window.ui) window.ui.showToast('Добро пожаловать в Flappy Bird Enhanced! 🐦', 'success', 4000);
            }, 1000);
            
            // Показываем краткую инструкцию
            setTimeout(() => {
                if (window.ui) window.ui.showToast('Нажмите SPACE или коснитесь экрана для прыжка', 'info', 4000);
            }, 3000);
        } else {
            // Показываем сообщение о возвращении
            const lastScore = localStorage.getItem('flappyHighScore') || 0;
            if (lastScore > 0) {
                setTimeout(() => {
                    if (window.ui) window.ui.showToast(`С возвращением! Ваш рекорд: ${lastScore}`, 'info', 3000);
                }, 500);
            }
        }
    }
    
    showErrorMessage(message) {
        // Создаем экран ошибки
        const errorScreen = document.createElement('div');
        errorScreen.className = 'error-screen';
        errorScreen.innerHTML = `
            <div class="error-content">
                <h2>😕 Упс!</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">Перезагрузить</button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .error-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .error-content {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                color: white;
                backdrop-filter: blur(10px);
            }
            
            .error-content h2 {
                font-size: 2rem;
                margin-bottom: 20px;
            }
            
            .error-content p {
                font-size: 1.1rem;
                margin-bottom: 30px;
                opacity: 0.9;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorScreen);
    }
    
    // Методы для отладки
    enableDebugMode() {
        if (this.game && window.ui) {
            window.ui.showDebugInfo(true);
            
            // Обновляем отладочную информацию каждый кадр
            const updateDebug = () => {
                if (window.ui) window.ui.updateDebugInfo();
                requestAnimationFrame(updateDebug);
            };
            updateDebug();
            
            console.log('🐛 Debug mode enabled');
        }
    }
    
    disableDebugMode() {
        if (window.ui) window.ui.showDebugInfo(false);
        console.log('🐛 Debug mode disabled');
    }
    
    // Методы для тестирования
    runTests() {
        console.log('🧪 Running tests...');
        
        const tests = [
            () => this.testGameInitialization(),
            () => this.testUIResponsiveness(),
            () => this.testLocalStorage(),
            () => this.testPerformance()
        ];
        
        tests.forEach((test, index) => {
            try {
                test();
                console.log(`✅ Test ${index + 1} passed`);
            } catch (error) {
                console.error(`❌ Test ${index + 1} failed:`, error);
            }
        });
    }
    
    testGameInitialization() {
        if (!this.game) throw new Error('Game not initialized');
        if (!this.game.bird) throw new Error('Bird not initialized');
        if (!this.game.pipes) throw new Error('Pipes not initialized');
        if (!this.game.powerUps) throw new Error('PowerUps not initialized');
        if (!this.game.achievements) throw new Error('Achievements not initialized');
    }
    
    testUIResponsiveness() {
        const screens = ['mainMenu', 'gameHUD', 'gameOverScreen', 'settingsScreen', 'achievementsScreen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (!screen) throw new Error(`Screen ${screenId} not found`);
        });
    }
    
    testLocalStorage() {
        try {
            localStorage.setItem('test', 'value');
            if (localStorage.getItem('test') !== 'value') {
                throw new Error('localStorage write/read failed');
            }
            localStorage.removeItem('test');
        } catch (error) {
            throw new Error('localStorage not available');
        }
    }
    
    testPerformance() {
        const start = performance.now();
        
        // Тестируем производительность создания объектов
        for (let i = 0; i < 1000; i++) {
            const testBird = { x: i, y: i, velocity: 0 };
        }
        
        const end = performance.now();
        if (end - start > 100) {
            throw new Error('Performance test failed - too slow');
        }
    }
}

// Инициализация приложения
// Старый код удален - теперь экземпляр создается в конце файла

// Горячие клавиши для отладки (только в development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + D - отладочный режим
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
            window.FlappyApp.enableDebugMode();
        }
        
        // Ctrl + Shift + T - запуск тестов
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
            window.FlappyApp.runTests();
        }
        
        // Ctrl + Shift + F - полный экран
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            if (window.ui) window.ui.toggleFullscreen();
        }
    });
}

// Экспортируем класс для использования в других модулях
window.App = App;
