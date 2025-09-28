// Main.js - Упрощенная версия точки входа в приложение
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
            
            // Настройка аналитики
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
    
    setupPerformanceOptimizations() {
        console.log('⚡ Setting up performance optimizations...');
    }
    
    setupMobileOptimizations() {
        console.log('📱 Setting up mobile optimizations...');
    }
    
    setupGameAnalytics() {
        console.log('📊 Setting up game analytics...');
    }
    
    setupErrorHandling() {
        console.log('🛡️ Setting up error handling...');
        
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
    
    showWelcomeMessage() {
        console.log('👋 Welcome to Bat Cave Explorer!');
    }
    
    showErrorMessage(message) {
        console.error('Error:', message);
        alert(message);
    }
}

// Экспортируем класс для использования в других модулях
window.App = App;
