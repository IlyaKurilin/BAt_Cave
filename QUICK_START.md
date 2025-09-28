# 🚀 Быстрый запуск Flappy Bird Enhanced

## 🎮 Запуск игры

### 🖥️ Windows
Дважды кликните на `start-server.bat` или выполните в командной строке:
```cmd
start-server.bat
```

### 🐧 Linux / 🍎 macOS
```bash
./start-server.sh
```

### 🔧 Ручной запуск

**Python (рекомендуется):**
```bash
python -m http.server 8000
# или
python3 -m http.server 8000
```

**Node.js:**
```bash
npx serve . -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

## 🌐 Открытие игры

После запуска сервера откройте в браузере:
```
http://localhost:8000
```

## 📱 Мобильное тестирование

1. Найдите IP адрес вашего компьютера
2. Откройте на мобильном устройстве: `http://[IP-АДРЕС]:8000`

### Пример для Windows:
```cmd
ipconfig
```
Найдите IPv4 адрес (например, 192.168.1.100)

### Пример для Linux/macOS:
```bash
ifconfig | grep inet
```

## 🛠️ Создание иконок для PWA

1. Откройте `assets/placeholder-icons.html` в браузере
2. Нажмите "Создать все иконки"
3. Иконки автоматически скачаются
4. Файлы `icon-*.png` уже готовы для PWA

## 🎯 Управление

- **SPACE** / **Клик** / **Тап** - прыжок птицы
- **ESC** - пауза/меню
- **ENTER** - старт/рестарт

## 🏆 Особенности

✨ **5 типов препятствий**: обычные, узкие, широкие, движущиеся, вращающиеся  
💫 **6 видов бонусов**: щит, замедление, двойные очки, мини-птица, жизнь, магнит  
🎖️ **15+ достижений** с системой редкости  
📱 **PWA**: установка как мобильное приложение  
🎮 **4 уровня сложности**: от легкого до экстремального  

## 🐛 Отладка

**Режим разработчика** (только на localhost):
- `Ctrl+Shift+D` - отладочная информация
- `Ctrl+Shift+T` - запуск тестов
- `Ctrl+Shift+F` - полноэкранный режим

**DevTools**: Откройте F12 для просмотра консоли

## 📦 Установка как PWA

1. Откройте игру в Chrome/Edge
2. Нажмите на значок "Установить" в адресной строке
3. Или: Меню → Установить Flappy Bird Enhanced

## 🚀 Для разработки

```bash
# Клонирование
git clone [ваш-репозиторий]
cd flappy-birds

# Запуск
python -m http.server 8000

# Открыть
http://localhost:8000
```

## 📱 Подготовка к мобильной разработке

### Android (Cordova):
```bash
npm install -g cordova
cordova create flappybird com.yourname.flappybird FlappyBird
# Скопировать файлы в www/
cordova platform add android
cordova build android
```

### Современный подход (Capacitor):
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npx cap sync
```

---

🎮 **Удачной игры!** Покорите небеса и установите новые рекорды! 🐦
