@echo off
echo 🐦 Запуск Flappy Bird Enhanced...
echo.
echo Выберите способ запуска:
echo 1. Python 3 (рекомендуется)
echo 2. Node.js (если установлен npx)
echo 3. PHP (если установлен)
echo.
set /p choice="Введите номер (1-3): "

if "%choice%"=="1" goto python
if "%choice%"=="2" goto nodejs
if "%choice%"=="3" goto php
goto invalid

:python
echo Запуск с Python...
python -m http.server 8000
goto end

:nodejs
echo Запуск с Node.js...
npx serve . -p 8000
goto end

:php
echo Запуск с PHP...
php -S localhost:8000
goto end

:invalid
echo Неверный выбор!
pause
goto end

:end
echo.
echo 🎮 Игра доступна по адресу: http://localhost:8000
echo 📱 Для тестирования на мобильном используйте IP компьютера
echo.
pause
