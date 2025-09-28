// Sound.js - Система управления звуками
window.SoundManager = class SoundManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.sounds = {};
        this.audioContext = null;
        
        // Инициализируем аудио контекст
        this.initAudioContext();
        
        // Создаем звуки программно
        this.createSounds();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API не поддерживается:', e);
        }
    }
    
    createSounds() {
        // Создаем звуки используя Web Audio API
        this.sounds = {
            flap: this.createFlapSound,
            score: this.createScoreSound,
            powerup: this.createPowerUpSound,
            gameOver: this.createGameOverSound,
            themeChange: this.createThemeChangeSound
        };
    }
    
    createTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return null;
        
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createFlapSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Настройки для звука взмаха крыла
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2 * this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    createScoreSound() {
        if (!this.audioContext) return;
        
        // Восходящая мелодия для очков
        const frequencies = [523, 659, 784]; // C5, E5, G5
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            const startTime = this.audioContext.currentTime + index * 0.1;
            const duration = 0.15;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3 * this.volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }
    
    createPowerUpSound() {
        if (!this.audioContext) return;
        
        // Волшебный звук для power-up
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.3);
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filterNode.Q.setValueAtTime(5, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4 * this.volume, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    createGameOverSound() {
        if (!this.audioContext) return;
        
        // Нисходящая печальная мелодия
        const frequencies = [440, 349, 294, 220]; // A4, F4, D4, A3
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            const startTime = this.audioContext.currentTime + index * 0.2;
            const duration = 0.4;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3 * this.volume, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }
    
    createThemeChangeSound() {
        if (!this.audioContext) return;
        
        // Звук смены темы - арпеджио
        const frequencies = [261, 329, 392, 523]; // C4, E4, G4, C5
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            const startTime = this.audioContext.currentTime + index * 0.05;
            const duration = 0.2;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2 * this.volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }
    
    play(soundType) {
        if (!this.enabled || !this.audioContext) return;
        
        // Возобновляем аудио контекст если он приостановлен
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const soundFunction = this.sounds[soundType];
        if (soundFunction) {
            if (typeof soundFunction === 'function') {
                soundFunction.call(this);
            }
        } else {
            console.warn(`Звук "${soundType}" не найден`);
        }
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    getEnabled() {
        return this.enabled;
    }
    
    getVolume() {
        return this.volume;
    }
}
