#!/bin/bash

echo "🐦 Flappy Bird Enhanced - Server Starter"
echo "========================================"
echo

# Проверяем доступные способы запуска
PYTHON_AVAILABLE=false
NODE_AVAILABLE=false
PHP_AVAILABLE=false

if command -v python3 &> /dev/null || command -v python &> /dev/null; then
    PYTHON_AVAILABLE=true
fi

if command -v npx &> /dev/null; then
    NODE_AVAILABLE=true
fi

if command -v php &> /dev/null; then
    PHP_AVAILABLE=true
fi

echo "Доступные способы запуска:"
echo

if [ "$PYTHON_AVAILABLE" = true ]; then
    echo "1. 🐍 Python HTTP Server (рекомендуется)"
fi

if [ "$NODE_AVAILABLE" = true ]; then
    echo "2. 📦 Node.js Serve"
fi

if [ "$PHP_AVAILABLE" = true ]; then
    echo "3. 🐘 PHP Built-in Server"
fi

echo "4. 📋 Показать инструкции для других серверов"
echo

read -p "Выберите способ запуска (1-4): " choice

case $choice in
    1)
        if [ "$PYTHON_AVAILABLE" = true ]; then
            echo "🚀 Запуск Python HTTP Server..."
            if command -v python3 &> /dev/null; then
                python3 -m http.server 8000
            else
                python -m http.server 8000
            fi
        else
            echo "❌ Python не найден!"
        fi
        ;;
    2)
        if [ "$NODE_AVAILABLE" = true ]; then
            echo "🚀 Запуск Node.js Server..."
            npx serve . -p 8000
        else
            echo "❌ Node.js/NPX не найден!"
        fi
        ;;
    3)
        if [ "$PHP_AVAILABLE" = true ]; then
            echo "🚀 Запуск PHP Server..."
            php -S localhost:8000
        else
            echo "❌ PHP не найден!"
        fi
        ;;
    4)
        echo
        echo "📋 Альтернативные способы запуска:"
        echo
        echo "🐍 Python:"
        echo "   python3 -m http.server 8000"
        echo "   python -m http.server 8000"
        echo
        echo "📦 Node.js:"
        echo "   npx serve . -p 8000"
        echo "   npm install -g http-server && http-server -p 8000"
        echo
        echo "🐘 PHP:"
        echo "   php -S localhost:8000"
        echo
        echo "🦀 Rust:"
        echo "   cargo install basic-http-server"
        echo "   basic-http-server ."
        echo
        echo "🔗 После запуска откройте: http://localhost:8000"
        echo
        ;;
    *)
        echo "❌ Неверный выбор!"
        ;;
esac

echo
echo "🎮 Игра будет доступна по адресу: http://localhost:8000"
echo "📱 Для тестирования на мобильном используйте IP адрес компьютера"
echo
echo "💡 Совет: Откройте Developer Tools (F12) для отладки"
echo
