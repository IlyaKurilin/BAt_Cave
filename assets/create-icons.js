// Скрипт для создания иконок разных размеров
// Этот файл поможет создать иконки для PWA из SVG

const fs = require('fs');
const path = require('path');

// Размеры иконок, необходимые для PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// HTML для создания canvas с иконкой
const createIconHTML = (size) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Icon Creator</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; }
        canvas { border: 1px solid #ccc; margin: 10px; }
    </style>
</head>
<body>
    <h1>Flappy Bird Icon Creator</h1>
    <canvas id="canvas" width="${size}" height="${size}"></canvas>
    
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Функция для рисования иконки
        function drawIcon() {
            const size = ${size};
            const scale = size / 512; // Масштабируем относительно оригинального размера 512px
            
            // Фон с градиентом
            const gradient = ctx.createLinearGradient(0, 0, 0, size);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.7, '#98FB98');
            gradient.addColorStop(1, '#228B22');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Облака (упрощенные для маленьких размеров)
            if (size >= 128) {
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.beginPath();
                ctx.arc(120 * scale, 80 * scale, 25 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Трубы (упрощенные)
            ctx.fillStyle = '#228B22';
            ctx.strokeStyle = '#1a5f1a';
            ctx.lineWidth = 2 * scale;
            
            // Левая труба
            ctx.fillRect(80 * scale, 0, 40 * scale, 180 * scale);
            ctx.strokeRect(80 * scale, 0, 40 * scale, 180 * scale);
            
            ctx.fillRect(80 * scale, 320 * scale, 40 * scale, (512-320) * scale);
            ctx.strokeRect(80 * scale, 320 * scale, 40 * scale, (512-320) * scale);
            
            // Правая труба
            ctx.fillRect(400 * scale, 0, 40 * scale, 150 * scale);
            ctx.strokeRect(400 * scale, 0, 40 * scale, 150 * scale);
            
            ctx.fillRect(400 * scale, 280 * scale, 40 * scale, (512-280) * scale);
            ctx.strokeRect(400 * scale, 280 * scale, 40 * scale, (512-280) * scale);
            
            // Земля
            ctx.fillStyle = '#228B22';
            ctx.fillRect(0, 480 * scale, size, 32 * scale);
            
            // Птица - основное тело
            const birdX = 256 * scale;
            const birdY = 230 * scale;
            const birdW = 35 * scale;
            const birdH = 28 * scale;
            
            // Градиент для птицы
            const birdGradient = ctx.createLinearGradient(
                birdX - birdW, birdY - birdH, 
                birdX + birdW, birdY + birdH
            );
            birdGradient.addColorStop(0, '#FFD700');
            birdGradient.addColorStop(1, '#FFA500');
            
            ctx.fillStyle = birdGradient;
            ctx.beginPath();
            ctx.ellipse(birdX, birdY, birdW, birdH, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#CC8400';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
            
            // Крыло птицы
            const wingGradient = ctx.createLinearGradient(
                birdX - 22 * scale, birdY - 18 * scale,
                birdX + 22 * scale, birdY + 18 * scale
            );
            wingGradient.addColorStop(0, '#FFA500');
            wingGradient.addColorStop(1, '#FF8C00');
            
            ctx.fillStyle = wingGradient;
            ctx.beginPath();
            ctx.ellipse(birdX - 11 * scale, birdY - 5 * scale, 22 * scale, 18 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Клюв птицы
            ctx.fillStyle = '#FF6B47';
            ctx.beginPath();
            ctx.moveTo((birdX + birdW - 6) * scale, (birdY - 2) * scale);
            ctx.lineTo((birdX + birdW + 14) * scale, (birdY - 8) * scale);
            ctx.lineTo((birdX + birdW + 14) * scale, (birdY + 4) * scale);
            ctx.closePath();
            ctx.fill();
            
            // Глаз птицы
            if (size >= 64) {
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc((birdX + 14) * scale, (birdY - 10) * scale, 6 * scale, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc((birdX + 16) * scale, (birdY - 12) * scale, 2 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Эффект свечения (только для больших размеров)
            if (size >= 192) {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3 * scale;
                ctx.setLineDash([5 * scale, 5 * scale]);
                ctx.beginPath();
                ctx.arc(birdX, birdY, 50 * scale, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
        
        // Рисуем иконку
        drawIcon();
        
        // Функция для скачивания иконки
        function downloadIcon() {
            const link = document.createElement('a');
            link.download = 'icon-${size}.png';
            link.href = canvas.toDataURL();
            link.click();
        }
        
        // Автоматически скачиваем через 1 секунду
        setTimeout(downloadIcon, 1000);
    </script>
    
    <button onclick="downloadIcon()">Скачать иконку ${size}x${size}</button>
    
    <h3>Инструкция:</h3>
    <ol>
        <li>Откройте этот файл в браузере</li>
        <li>Иконка автоматически скачается</li>
        <li>Повторите для всех размеров</li>
    </ol>
</body>
</html>
`;

// Создаем HTML файлы для каждого размера иконки
iconSizes.forEach(size => {
    const filename = `icon-creator-${size}.html`;
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, createIconHTML(size));
    console.log(`Created ${filename}`);
});

console.log('\\n📱 Icon creator files generated!');
console.log('\\nИнструкция по созданию иконок:');
console.log('1. Откройте каждый icon-creator-*.html файл в браузере');
console.log('2. Иконки автоматически скачаются');
console.log('3. Переместите скачанные PNG файлы в папку assets/');
console.log('4. Удалите HTML файлы после использования');

// Создаем также bash скрипт для автоматизации (если доступен)
const bashScript = \`#!/bin/bash
# Автоматическое создание иконок с помощью ImageMagick (если установлен)

if command -v convert &> /dev/null; then
    echo "Creating icons using ImageMagick..."
    
    # Создаем иконки из SVG
    for size in 72 96 128 144 152 192 384 512; do
        convert -background none -size \${size}x\${size} icon.svg icon-\${size}.png
        echo "Created icon-\${size}.png"
    done
    
    echo "✅ All icons created successfully!"
else
    echo "❌ ImageMagick not found. Please install it or use the HTML files."
    echo "Install ImageMagick:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php"
fi
\`;

fs.writeFileSync(path.join(__dirname, 'create-icons.sh'), bashScript);
console.log('\\n🔧 Also created create-icons.sh for ImageMagick users');
