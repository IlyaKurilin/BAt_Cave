// Achievements.js - Система достижений и прогресса
class Achievement {
    constructor(id, title, description, condition, icon, rarity = 'common') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.condition = condition; // Функция проверки условия
        this.icon = icon;
        this.rarity = rarity; // common, rare, epic, legendary
        this.unlocked = false;
        this.progress = 0;
        this.maxProgress = condition.target || 1;
        this.unlockedAt = null;
    }
    
    checkCondition(gameData) {
        if (this.unlocked) return false;
        
        const result = this.condition.check(gameData);
        
        if (typeof result === 'boolean') {
            if (result) {
                this.unlock();
                return true;
            }
        } else if (typeof result === 'number') {
            this.progress = Math.min(result, this.maxProgress);
            if (this.progress >= this.maxProgress) {
                this.unlock();
                return true;
            }
        }
        
        return false;
    }
    
    unlock() {
        this.unlocked = true;
        this.unlockedAt = new Date();
        this.progress = this.maxProgress;
    }
    
    getProgressPercent() {
        return Math.round((this.progress / this.maxProgress) * 100);
    }
}

class AchievementManager {
    constructor(game) {
        this.game = game;
        this.achievements = new Map();
        this.gameData = {
            totalScore: 0,
            highScore: 0,
            gamesPlayed: 0,
            totalPowerUpsCollected: 0,
            shieldUsed: 0,
            consecutiveGames: 0,
            pipesPassedInOneGame: 0,
            totalTimePlayed: 0,
            powerUpTypes: new Set(),
            difficultiesPlayed: new Set(),
            perfectRuns: 0,
            lastPlayDate: null
        };
        
        this.loadGameData();
        this.createAchievements();
        this.loadAchievements();
        
        // Уведомления
        this.notificationQueue = [];
        this.showingNotification = false;
    }
    
    createAchievements() {
        const achievements = [
            // Базовые достижения
            {
                id: 'first_flight',
                title: 'Первый полёт',
                description: 'Сыграйте в игру впервые',
                icon: '🚀',
                rarity: 'common',
                condition: {
                    check: (data) => data.gamesPlayed >= 1
                }
            },
            
            {
                id: 'score_10',
                title: 'Новичок',
                description: 'Наберите 10 очков',
                icon: '🎯',
                rarity: 'common',
                condition: {
                    check: (data) => data.highScore >= 10
                }
            },
            
            {
                id: 'score_50',
                title: 'Опытный пилот',
                description: 'Наберите 50 очков',
                icon: '✈️',
                rarity: 'common',
                condition: {
                    check: (data) => data.highScore >= 50
                }
            },
            
            {
                id: 'score_100',
                title: 'Мастер неба',
                description: 'Наберите 100 очков',
                icon: '🎖️',
                rarity: 'rare',
                condition: {
                    check: (data) => data.highScore >= 100
                }
            },
            
            {
                id: 'score_200',
                title: 'Легенда воздуха',
                description: 'Наберите 200 очков',
                icon: '👑',
                rarity: 'epic',
                condition: {
                    check: (data) => data.highScore >= 200
                }
            },
            
            // Достижения за игровую активность
            {
                id: 'games_10',
                title: 'Упорство',
                description: 'Сыграйте 10 игр',
                icon: '💪',
                rarity: 'common',
                condition: {
                    check: (data) => data.gamesPlayed,
                    target: 10
                }
            },
            
            {
                id: 'games_50',
                title: 'Преданность',
                description: 'Сыграйте 50 игр',
                icon: '🏆',
                rarity: 'rare',
                condition: {
                    check: (data) => data.gamesPlayed,
                    target: 50
                }
            },
            
            {
                id: 'games_100',
                title: 'Фанат Flappy Bird',
                description: 'Сыграйте 100 игр',
                icon: '🔥',
                rarity: 'epic',
                condition: {
                    check: (data) => data.gamesPlayed,
                    target: 100
                }
            },
            
            // Power-up достижения
            {
                id: 'first_powerup',
                title: 'Усиление',
                description: 'Соберите первый power-up',
                icon: '⭐',
                rarity: 'common',
                condition: {
                    check: (data) => data.totalPowerUpsCollected >= 1
                }
            },
            
            {
                id: 'powerup_collector',
                title: 'Коллекционер',
                description: 'Соберите 50 power-ups',
                icon: '🎁',
                rarity: 'rare',
                condition: {
                    check: (data) => data.totalPowerUpsCollected,
                    target: 50
                }
            },
            
            {
                id: 'shield_master',
                title: 'Мастер защиты',
                description: 'Используйте щит 10 раз',
                icon: '🛡️',
                rarity: 'rare',
                condition: {
                    check: (data) => data.shieldUsed,
                    target: 10
                }
            },
            
            {
                id: 'power_variety',
                title: 'Разнообразие силы',
                description: 'Испробуйте все типы power-ups',
                icon: '🌈',
                rarity: 'epic',
                condition: {
                    check: (data) => data.powerUpTypes.size >= 6
                }
            },
            
            // Специальные достижения
            {
                id: 'perfect_start',
                title: 'Идеальный старт',
                description: 'Пролетите первые 20 труб без столкновений',
                icon: '💎',
                rarity: 'rare',
                condition: {
                    check: (data) => data.pipesPassedInOneGame >= 20 && data.perfectRuns > 0
                }
            },
            
            {
                id: 'marathon_player',
                title: 'Марафонец',
                description: 'Играйте более 60 минут суммарно',
                icon: '⏱️',
                rarity: 'rare',
                condition: {
                    check: (data) => data.totalTimePlayed >= 3600000 // 60 минут в миллисекундах
                }
            },
            
            {
                id: 'difficulty_master',
                title: 'Мастер сложности',
                description: 'Сыграйте на всех уровнях сложности',
                icon: '🎮',
                rarity: 'epic',
                condition: {
                    check: (data) => data.difficultiesPlayed.size >= 4
                }
            },
            
            {
                id: 'daily_player',
                title: 'Ежедневный игрок',
                description: 'Играйте 5 дней подряд',
                icon: '📅',
                rarity: 'rare',
                condition: {
                    check: (data) => data.consecutiveGames >= 5
                }
            },
            
            // Легендарные достижения
            {
                id: 'flappy_legend',
                title: 'Легенда Flappy',
                description: 'Наберите 500 очков',
                icon: '🌟',
                rarity: 'legendary',
                condition: {
                    check: (data) => data.highScore >= 500
                }
            },
            
            {
                id: 'immortal_bird',
                title: 'Бессмертная птица',
                description: 'Пролетите 100 труб за одну игру',
                icon: '🔆',
                rarity: 'legendary',
                condition: {
                    check: (data) => data.pipesPassedInOneGame >= 100
                }
            }
        ];
        
        achievements.forEach(achData => {
            const achievement = new window.Achievement(
                achData.id,
                achData.title,
                achData.description,
                achData.condition,
                achData.icon,
                achData.rarity
            );
            this.achievements.set(achData.id, achievement);
        });
    }
    
    checkAchievements(currentScore, pipesPassedInGame = 0) {
        // Обновляем игровые данные
        this.updateGameData(currentScore, pipesPassedInGame);
        
        // Проверяем все достижения
        const newlyUnlocked = [];
        
        this.achievements.forEach(achievement => {
            if (achievement.checkCondition(this.gameData)) {
                newlyUnlocked.push(achievement);
            }
        });
        
        // Показываем уведомления о новых достижениях
        if (newlyUnlocked.length > 0) {
            this.showAchievementNotifications(newlyUnlocked);
            this.saveAchievements();
        }
        
        return newlyUnlocked;
    }
    
    updateGameData(currentScore, pipesPassedInGame) {
        this.gameData.gamesPlayed++;
        this.gameData.totalScore += currentScore;
        this.gameData.highScore = Math.max(this.gameData.highScore, currentScore);
        this.gameData.pipesPassedInOneGame = Math.max(this.gameData.pipesPassedInOneGame, pipesPassedInGame);
        
        // Обновляем сложности
        this.gameData.difficultiesPlayed.add(this.game.difficulty);
        
        // Проверяем consecutive games
        const today = new Date().toDateString();
        if (this.gameData.lastPlayDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.gameData.lastPlayDate === yesterday.toDateString()) {
                this.gameData.consecutiveGames++;
            } else {
                this.gameData.consecutiveGames = 1;
            }
            
            this.gameData.lastPlayDate = today;
        }
        
        this.saveGameData();
    }
    
    onPowerUpCollected(type) {
        this.gameData.totalPowerUpsCollected++;
        this.gameData.powerUpTypes.add(type);
        
        if (type === 'shield') {
            this.gameData.shieldUsed++;
        }
        
        this.saveGameData();
    }
    
    showAchievementNotifications(achievements) {
        achievements.forEach(achievement => {
            this.notificationQueue.push(achievement);
        });
        
        if (!this.showingNotification) {
            this.processNotificationQueue();
        }
    }
    
    processNotificationQueue() {
        if (this.notificationQueue.length === 0) {
            this.showingNotification = false;
            return;
        }
        
        this.showingNotification = true;
        const achievement = this.notificationQueue.shift();
        this.displayAchievementNotification(achievement);
        
        // Показываем следующее уведомление через 3 секунды
        setTimeout(() => {
            this.processNotificationQueue();
        }, 3000);
    }
    
    displayAchievementNotification(achievement) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-icon">${achievement.icon}</div>
            <div class="achievement-notification-content">
                <div class="achievement-notification-title">Достижение разблокировано!</div>
                <div class="achievement-notification-name">${achievement.title}</div>
                <div class="achievement-notification-desc">${achievement.description}</div>
            </div>
        `;
        
        // Добавляем стили для уведомления
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #333;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 1000;
                animation: slideIn 0.5s ease, slideOut 0.5s ease 2.5s forwards;
                max-width: 300px;
            }
            
            .achievement-notification-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .achievement-notification-title {
                font-weight: bold;
                font-size: 0.9rem;
                margin-bottom: 2px;
            }
            
            .achievement-notification-name {
                font-weight: bold;
                font-size: 1rem;
                margin-bottom: 2px;
            }
            
            .achievement-notification-desc {
                font-size: 0.8rem;
                opacity: 0.8;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 3000);
        
        // Звук достижения
        if (this.game.soundEnabled) {
            this.game.playSound('achievement');
        }
    }
    
    populateAchievementsList() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;
        
        achievementsList.innerHTML = '';
        
        // Сортируем достижения по редкости и статусу
        const sortedAchievements = Array.from(this.achievements.values()).sort((a, b) => {
            if (a.unlocked !== b.unlocked) {
                return b.unlocked - a.unlocked; // Разблокированные сначала
            }
            
            const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        });
        
        sortedAchievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            
            const progressPercent = achievement.getProgressPercent();
            const progressBar = achievement.maxProgress > 1 ? 
                `<div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${progressPercent}%"></div>
                    <span class="achievement-progress-text">${achievement.progress}/${achievement.maxProgress}</span>
                </div>` : '';
            
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                    <div class="achievement-rarity ${achievement.rarity}">${this.getRarityName(achievement.rarity)}</div>
                    ${progressBar}
                    ${achievement.unlocked ? `<div class="achievement-date">Получено: ${achievement.unlockedAt.toLocaleDateString()}</div>` : ''}
                </div>
            `;
            
            achievementsList.appendChild(achievementElement);
        });
        
        // Добавляем статистику
        const stats = document.createElement('div');
        stats.className = 'achievements-stats';
        const unlockedCount = Array.from(this.achievements.values()).filter(a => a.unlocked).length;
        const totalCount = this.achievements.size;
        
        stats.innerHTML = `
            <h3>Статистика</h3>
            <p>Разблокировано: ${unlockedCount}/${totalCount} (${Math.round(unlockedCount/totalCount*100)}%)</p>
            <p>Лучший результат: ${this.gameData.highScore}</p>
            <p>Всего игр: ${this.gameData.gamesPlayed}</p>
            <p>Power-ups собрано: ${this.gameData.totalPowerUpsCollected}</p>
        `;
        
        achievementsList.appendChild(stats);
    }
    
    getRarityName(rarity) {
        const names = {
            common: 'Обычное',
            rare: 'Редкое',
            epic: 'Эпическое',
            legendary: 'Легендарное'
        };
        return names[rarity] || 'Обычное';
    }
    
    saveAchievements() {
        const achievementsData = {};
        this.achievements.forEach((achievement, id) => {
            if (achievement.unlocked) {
                achievementsData[id] = {
                    unlocked: true,
                    unlockedAt: achievement.unlockedAt,
                    progress: achievement.progress
                };
            }
        });
        
        localStorage.setItem('flappyAchievements', JSON.stringify(achievementsData));
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('flappyAchievements');
        if (saved) {
            const achievementsData = JSON.parse(saved);
            
            Object.keys(achievementsData).forEach(id => {
                const achievement = this.achievements.get(id);
                if (achievement) {
                    const data = achievementsData[id];
                    achievement.unlocked = data.unlocked;
                    achievement.unlockedAt = new Date(data.unlockedAt);
                    achievement.progress = data.progress || achievement.maxProgress;
                }
            });
        }
    }
    
    saveGameData() {
        const dataToSave = {
            ...this.gameData,
            powerUpTypes: Array.from(this.gameData.powerUpTypes),
            difficultiesPlayed: Array.from(this.gameData.difficultiesPlayed)
        };
        
        localStorage.setItem('flappyGameData', JSON.stringify(dataToSave));
    }
    
    loadGameData() {
        const saved = localStorage.getItem('flappyGameData');
        if (saved) {
            const data = JSON.parse(saved);
            this.gameData = {
                ...this.gameData,
                ...data,
                powerUpTypes: new Set(data.powerUpTypes || []),
                difficultiesPlayed: new Set(data.difficultiesPlayed || [])
            };
        }
    }
    
    reset() {
        // Сброс только временных данных игры, достижения остаются
        this.gameData.pipesPassedInOneGame = 0;
    }
    
    // Метод для добавления времени игры
    addPlayTime(milliseconds) {
        this.gameData.totalTimePlayed += milliseconds;
        this.saveGameData();
    }
    
    // Методы для получения статистики
    getUnlockedCount() {
        return Array.from(this.achievements.values()).filter(a => a.unlocked).length;
    }
    
    getTotalCount() {
        return this.achievements.size;
    }
    
    getCompletionPercentage() {
        return Math.round((this.getUnlockedCount() / this.getTotalCount()) * 100);
    }
}

// Экспортируем классы для использования в других модулях
window.Achievement = Achievement;
window.AchievementManager = AchievementManager;
