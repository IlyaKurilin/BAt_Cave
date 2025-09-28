// UI.js - Управление интерфейсом пользователя
class UI {
    constructor() {
        this.currentScreen = 'mainMenu';
        this.game = null;
        
        this.setupEventListeners();
        this.updateHighScore();
    }
    
    setGame(game) {
        this.game = game;
    }
    
    setupEventListeners() {
        // Кнопки главного меню
        document.getElementById('playBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('achievementsBtn').addEventListener('click', () => {
            this.showAchievements();
        });
        
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelp();
        });
        
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Кнопки экрана окончания игры
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('finaleMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Кнопки настроек
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('achievementsBackBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('helpBackBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Настройки
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            if (this.game) {
                this.game.saveSoundEnabled(e.target.checked);
            }
        });
        
        document.getElementById('godModeToggle').addEventListener('change', (e) => {
            if (this.game) {
                this.game.saveGodMode(e.target.checked);
            }
        });
        
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            if (this.game) {
                this.game.saveDifficulty(e.target.value);
            }
        });
        
        document.getElementById('powerUpsToggle').addEventListener('change', (e) => {
            if (this.game) {
                this.game.savePowerUpsEnabled(e.target.checked);
            }
        });
        
        // Управление с клавиатуры
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Предотвращение скролла на мобильных устройствах
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Обработка изменения видимости страницы
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.game && this.game.gameState === 'playing') {
                this.game.pause();
            }
        });
    }
    
    handleKeyPress(e) {
        switch (e.code) {
            case 'Escape':
                if (this.currentScreen === 'playing') {
                    this.game.pause();
                } else if (this.currentScreen !== 'mainMenu') {
                    this.showMainMenu();
                }
                break;
                
            case 'Enter':
                if (this.currentScreen === 'mainMenu') {
                    this.startGame();
                } else if (this.currentScreen === 'gameOver') {
                    this.startGame();
                }
                break;
                
            case 'Space':
                if (this.game && this.game.gameState === 'paused') {
                    this.game.pause(); // Возобновить игру
                }
                break;
        }
    }
    
    startGame() {
        this.hideAllScreens();
        this.showScreen('gameHUD');
        this.currentScreen = 'playing';
        
        if (this.game) {
            this.game.startGame();
        }
        
        // Скрываем курсор во время игры
        document.body.style.cursor = 'none';
    }
    
    showMainMenu() {
        this.hideAllScreens();
        this.showScreen('mainMenu');
        this.currentScreen = 'mainMenu';
        this.updateHighScore();
        
        // Показываем курсор
        document.body.style.cursor = 'auto';
    }
    
    showGameOver(score, highScore) {
        // Обновляем счет
        document.getElementById('finalScore').textContent = score;
        document.getElementById('bestScore').textContent = highScore;
        
        // Проверяем, есть ли новые достижения
        if (this.game && this.game.achievements) {
            const newAchievements = this.game.achievements.checkAchievements(score);
            this.displayNewAchievements(newAchievements);
        }
        
        // Показываем экран
        this.hideAllScreens();
        this.showScreen('gameOverScreen');
        this.currentScreen = 'gameOver';
        
        // Показываем курсор
        document.body.style.cursor = 'auto';
        
        // Анимация появления
        setTimeout(() => {
            document.getElementById('gameOverScreen').style.animation = 'fadeIn 0.5s ease';
        }, 100);
    }
    
    showSettings() {
        this.hideAllScreens();
        this.showScreen('settingsScreen');
        this.currentScreen = 'settings';
        
        // Обновляем значения настроек
        if (this.game) {
            document.getElementById('soundToggle').checked = this.game.soundEnabled;
            document.getElementById('difficultySelect').value = this.game.difficulty;
            document.getElementById('powerUpsToggle').checked = this.game.powerUpsEnabled;
            document.getElementById('godModeToggle').checked = this.game.godMode;
        }
    }
    
    showAchievements() {
        this.hideAllScreens();
        this.showScreen('achievementsScreen');
        this.currentScreen = 'achievements';
        
        // Обновляем список достижений
        if (this.game && this.game.achievements) {
            this.game.achievements.populateAchievementsList();
        }
    }
    
    showHelp() {
        this.hideAllScreens();
        this.showScreen('helpScreen');
        this.currentScreen = 'help';
    }
    
    showGodModeFinale(score) {
        this.hideAllScreens();
        this.showScreen('godModeFinaleScreen');
        this.currentScreen = 'godModeFinale';
        
        // Обновляем финальный счёт
        document.getElementById('finaleScore').textContent = score;
        
        console.log(`🎆 Показываем финал режима бога с результатом: ${score}`);
    }
    
    hideAllScreens() {
        const screens = ['mainMenu', 'gameHUD', 'gameOverScreen', 'settingsScreen', 'achievementsScreen', 'helpScreen', 'godModeFinaleScreen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }
    
    showScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    }
    
    updateScore(score) {
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = score;
            
            // Анимация при увеличении счета
            scoreElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreElement.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    updateHighScore() {
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement && this.game) {
            highScoreElement.textContent = this.game.highScore;
        }
    }
    
    displayNewAchievements(achievements) {
        const container = document.getElementById('achievementsEarned');
        if (!container || achievements.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        container.innerHTML = '<h3>🏆 Новые достижения:</h3>';
        
        achievements.forEach(achievement => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = 'new-achievement';
            achievementDiv.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <span class="achievement-title">${achievement.title}</span>
            `;
            container.appendChild(achievementDiv);
        });
    }
    
    showPauseMenu() {
        // Создаем overlay для паузы если его нет
        let pauseOverlay = document.getElementById('pauseOverlay');
        if (!pauseOverlay) {
            pauseOverlay = document.createElement('div');
            pauseOverlay.id = 'pauseOverlay';
            pauseOverlay.className = 'pause-overlay';
            pauseOverlay.innerHTML = `
                <div class="pause-menu">
                    <h2>Пауза</h2>
                    <button id="resumeBtn" class="btn btn-primary">Продолжить</button>
                    <button id="pauseMenuBtn" class="btn btn-secondary">Главное меню</button>
                </div>
            `;
            document.body.appendChild(pauseOverlay);
            
            // Добавляем обработчики событий
            document.getElementById('resumeBtn').addEventListener('click', () => {
                this.game.pause(); // Возобновить
                this.hidePauseMenu();
            });
            
            document.getElementById('pauseMenuBtn').addEventListener('click', () => {
                this.hidePauseMenu();
                this.showMainMenu();
            });
        }
        
        pauseOverlay.style.display = 'flex';
    }
    
    hidePauseMenu() {
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none';
        }
    }
    
    // Утилитарные методы для работы с UI
    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading';
        return spinner;
    }
    
    showToast(message, type = 'info', duration = 3000) {
        // Создаем toast уведомление
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Стили для toast
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 1000;
                animation: toastSlideIn 0.3s ease, toastSlideOut 0.3s ease ${duration - 300}ms forwards;
            }
            
            .toast-success { background: rgba(76, 175, 80, 0.9); }
            .toast-error { background: rgba(244, 67, 54, 0.9); }
            .toast-warning { background: rgba(255, 152, 0, 0.9); }
            
            @keyframes toastSlideIn {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            
            @keyframes toastSlideOut {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        // Удаляем toast после анимации
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, duration);
    }
    
    // Методы для мобильной оптимизации
    optimizeForMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
            
            // Скрываем адресную строку на мобильных устройствах
            window.addEventListener('load', () => {
                setTimeout(() => {
                    window.scrollTo(0, 1);
                }, 100);
            });
            
            // Предотвращаем масштабирование
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            }
        }
    }
    
    // Методы для управления полным экраном
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Обновление UI в реальном времени
    updateGameUI() {
        if (this.game && this.currentScreen === 'playing') {
            // Ограничиваем частоту обновления UI чтобы избежать дёрганья
            const now = Date.now();
            if (!this.lastUIUpdate || now - this.lastUIUpdate >= 50) { // Максимум 20 обновлений в секунду
                this.updateScore(this.game.score);
                this.lastUIUpdate = now;
            }
            
            // Обновление индикаторов power-ups выполняется в powerups.js
        }
    }
    
    // Анимации переходов между экранами
    animateScreenTransition(fromScreen, toScreen) {
        const from = document.getElementById(fromScreen);
        const to = document.getElementById(toScreen);
        
        if (from && to) {
            from.style.animation = 'fadeOut 0.3s ease forwards';
            
            setTimeout(() => {
                from.classList.add('hidden');
                to.classList.remove('hidden');
                to.style.animation = 'fadeIn 0.3s ease';
            }, 300);
        }
    }
    
    // Метод для отображения статистики в реальном времени
    showDebugInfo(visible = true) {
        let debugPanel = document.getElementById('debugPanel');
        
        if (visible && !debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'debugPanel';
            debugPanel.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 999;
                pointer-events: none;
            `;
            document.body.appendChild(debugPanel);
        } else if (!visible && debugPanel) {
            debugPanel.remove();
        }
    }
    
    updateDebugInfo() {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel && this.game) {
            debugPanel.innerHTML = `
                FPS: ${Math.round(1000 / (performance.now() - this.game.lastTime))}
                <br>Score: ${this.game.score}
                <br>Bird Y: ${Math.round(this.game.bird.y)}
                <br>Velocity: ${Math.round(this.game.bird.velocity * 10) / 10}
                <br>Pipes: ${this.game.pipes.pipes.length}
                <br>PowerUps: ${this.game.powerUps.powerUps.length}
                <br>State: ${this.game.gameState}
            `;
        }
    }
}

// Создаем глобальный экземпляр UI
window.UI = new UI();
