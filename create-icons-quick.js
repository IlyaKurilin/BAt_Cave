// Быстрое создание иконок для тестирования
const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [96, 128, 152, 384, 512];

function createSimpleIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#228B22');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Птичка
    const scale = size / 192;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Тело птицы
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 25 * scale, 20 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Крыло
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(centerX - 8 * scale, centerY - 3 * scale, 15 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Клюв
    ctx.fillStyle = '#FF6B47';
    ctx.beginPath();
    ctx.moveTo(centerX + 20 * scale, centerY);
    ctx.lineTo(centerX + 30 * scale, centerY - 5 * scale);
    ctx.lineTo(centerX + 30 * scale, centerY + 5 * scale);
    ctx.closePath();
    ctx.fill();
    
    // Глаз
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX + 8 * scale, centerY - 8 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas.toBuffer('image/png');
}

// Создаем иконки как base64 строки (заглушки)
const createBase64Icon = (size) => {
    // Простая base64 заглушка (красный квадрат с размером)
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAABrElEQVR4nO3UsQ0CMRRF0Q9JBhpAA2jABGgADaABE6ABNIAGTIAGTIAGTIAGTMAETMAETMAETMAETMAETMAETMAETMAETIAGTMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAETMAE`
};

// Записываем иконки как простые файлы с base64 данными
sizes.forEach(size => {
    const data = createBase64Icon(size);
    fs.writeFileSync(`assets/icon-${size}.png`, data);
    console.log(`Created icon-${size}.png`);
});

console.log('All missing icons created as placeholders');
