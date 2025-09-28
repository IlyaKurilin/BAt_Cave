// Init.js - Инициализация приложения
console.log('🔧 Начинаем инициализацию приложения...');

// Проверяем, что все классы загружены
function checkClassesLoaded() {
    const requiredClasses = [
        'SoundManager',
        'Bird', 
        'Pipe',
        'PipeManager',
        'PowerUp',
        'PowerUpManager', 
        'Achievement',
        'AchievementManager',
        'UI',
        'Game',
        'App'
    ];
    
    const missing = requiredClasses.filter(className => !window[className]);
    
    if (missing.length > 0) {
        console.error('❌ Отсутствуют классы:', missing);
        return false;
    }
    
    console.log('✅ Все классы загружены успешно');
    return true;
}

// Функция инициализации UI фич
function initializeUIFeatures() {
    try {
        // Оптимизация для мобильных устройств
        if (window.ui.optimizeForMobile) {
            window.ui.optimizeForMobile();
        }
        
        // Добавляем дополнительные стили для лучшей производительности
        const style = document.createElement('style');
        style.textContent = `
            /* Оптимизация производительности */
            #gameCanvas {
                will-change: auto;
                transform: translateZ(0);
            }
            .screen {
                backface-visibility: hidden;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ UI фичи инициализированы');
    } catch (error) {
        console.error('❌ Ошибка инициализации UI фич:', error);
    }
}

// Функция инициализации
function initializeApp() {
    try {
        if (!checkClassesLoaded()) {
            console.error('❌ Не удалось инициализировать - отсутствуют классы');
            return;
        }
        
        // Дополнительная проверка UI класса
        if (typeof window.UI !== 'function') {
            console.error('❌ window.UI не является функцией:', typeof window.UI);
            return;
        }
        
        console.log('🔧 UI: Создание экземпляра UI...');
        window.ui = new window.UI();
        console.log('✅ UI: Экземпляр UI создан успешно:', window.ui);
        
        // Выполняем инициализацию UI сразу здесь
        console.log('⚙️ Инициализация UI...');
        initializeUIFeatures();
        
        console.log('🚀 Создаем приложение...');
        const app = new window.App();
        
        // Экспортируем для глобального доступа
        window.FlappyApp = app;
        
        console.log('🎉 Приложение успешно инициализировано!');
        
    } catch (error) {
        console.error('❌ Ошибка при инициализации:', error);
        
        // Показываем пользователю сообщение об ошибке
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff4444;
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                font-family: Arial, sans-serif;
                z-index: 10000;
            ">
                <h2>Ошибка загрузки игры</h2>
                <p>Не удалось инициализировать игру.</p>
                <p>Попробуйте обновить страницу (Ctrl+F5)</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #ff4444;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Обновить</button>
            </div>
        `;
    }
}

// Ждем загрузки DOM и даём время скриптам загрузиться
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Небольшая задержка для загрузки всех скриптов
        setTimeout(initializeApp, 100);
    });
} else {
    // DOM уже загружен, но всё равно дадим время скриптам
    setTimeout(initializeApp, 100);
}
