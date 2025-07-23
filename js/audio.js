// Audio System for Interactive Sound Effects

class AudioSystem {
    constructor() {
        this.isEnabled = true;
        this.sfxEnabled = true;
        this.volume = 0.3;
        this.sounds = new Map();
        this.audioContext = null;
        this.backgroundMusic = null;
        this.musicEnabled = false;
        
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.loadSounds();
            this.setupEventListeners();
            this.initializeBackgroundMusic();
        } catch (error) {
            console.warn('Audio system initialization failed:', error);
            this.isEnabled = false;
        }
    }

    async loadSounds() {
        const soundFiles = {
            hover: this.generateTone(800, 0.1, 'sine'),
            click: this.generateTone(1000, 0.2, 'square'),
            success: this.generateChord([523, 659, 784], 0.5),
            error: this.generateTone(200, 0.3, 'sawtooth'),
            notification: this.generateTone(880, 0.4, 'triangle'),
            typing: this.generateTone(600, 0.05, 'square'),
            achievement: this.generateFanfare(),
            transition: this.generateSweep(400, 800, 0.3)
        };

        for (const [name, buffer] of Object.entries(soundFiles)) {
            this.sounds.set(name, buffer);
        }
    }

    generateTone(frequency, duration, type = 'sine') {
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            switch (type) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'sawtooth':
                    sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
                    break;
                case 'triangle':
                    sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
                    break;
            }
            
            // Apply envelope
            const envelope = Math.exp(-t * 3); // Exponential decay
            channelData[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    generateChord(frequencies, duration) {
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            frequencies.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
            });
            
            const envelope = Math.exp(-t * 2);
            channelData[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    generateFanfare() {
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            notes.forEach((freq, index) => {
                const noteStart = index * 0.2;
                const noteEnd = noteStart + 0.4;
                
                if (t >= noteStart && t <= noteEnd) {
                    const noteTime = t - noteStart;
                    sample += Math.sin(2 * Math.PI * freq * noteTime) * 0.25;
                }
            });
            
            const envelope = Math.max(0, 1 - t / duration);
            channelData[i] = sample * envelope;
        }

        return buffer;
    }

    generateSweep(startFreq, endFreq, duration) {
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const progress = t / duration;
            const frequency = startFreq + (endFreq - startFreq) * progress;
            
            const sample = Math.sin(2 * Math.PI * frequency * t);
            const envelope = Math.sin(Math.PI * progress); // Bell curve
            
            channelData[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    initializeBackgroundMusic() {
        // Create ambient background music using oscillators
        this.createAmbientMusic();
    }

    createAmbientMusic() {
        if (!this.audioContext) return;

        const baseFreq = 55; // Low A
        const harmonics = [1, 1.5, 2, 2.5, 3, 4];
        
        this.musicNodes = harmonics.map((harmonic, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(baseFreq * harmonic, this.audioContext.currentTime);
            
            // Add subtle frequency modulation
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.frequency.setValueAtTime(0.1 + index * 0.05, this.audioContext.currentTime);
            lfoGain.gain.setValueAtTime(harmonic * 0.5, this.audioContext.currentTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            
            // Filter and gain settings
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800 + harmonic * 200, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            
            // Connect the chain
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            return { oscillator, gainNode, filter, lfo };
        });
    }

    startBackgroundMusic() {
        if (!this.musicNodes || this.musicEnabled) return;
        
        this.musicNodes.forEach(({ oscillator, gainNode, lfo }, index) => {
            oscillator.start();
            lfo.start();
            
            // Fade in gradually
            const volume = (0.02 - index * 0.003) * this.volume;
            gainNode.gain.exponentialRampToValueAtTime(
                volume, 
                this.audioContext.currentTime + 2
            );
        });
        
        this.musicEnabled = true;
    }

    stopBackgroundMusic() {
        if (!this.musicNodes || !this.musicEnabled) return;
        
        this.musicNodes.forEach(({ oscillator, gainNode, lfo }) => {
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 1
            );
            
            setTimeout(() => {
                try {
                    oscillator.stop();
                    lfo.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
            }, 1000);
        });
        
        this.musicEnabled = false;
        setTimeout(() => {
            this.createAmbientMusic();
        }, 1500);
    }

    playSound(soundName, volume = 1) {
        if (!this.isEnabled || !this.sfxEnabled || !this.sounds.has(soundName)) {
            return;
        }

        try {
            const buffer = this.sounds.get(soundName);
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            gainNode.gain.setValueAtTime(this.volume * volume, this.audioContext.currentTime);
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start();
        } catch (error) {
            console.warn('Failed to play sound:', soundName, error);
        }
    }

    // Convenience methods for common sounds
    playHoverSound() {
        this.playSound('hover', 0.5);
    }

    playClickSound() {
        this.playSound('click', 0.7);
    }

    playSuccessSound() {
        this.playSound('success', 0.8);
    }

    playErrorSound() {
        this.playSound('error', 0.6);
    }

    playNotificationSound() {
        this.playSound('notification', 0.7);
    }

    playTypingSound() {
        this.playSound('typing', 0.3);
    }

    playAchievementSound() {
        this.playSound('achievement', 0.9);
    }

    playTransitionSound() {
        this.playSound('transition', 0.5);
    }

    // Voice synthesis for notifications
    speak(text, options = {}) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.rate || 0.8;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || this.volume;
            utterance.voice = speechSynthesis.getVoices().find(voice => 
                voice.lang.includes('en') && voice.name.includes('Google')
            ) || speechSynthesis.getVoices()[0];
            
            speechSynthesis.speak(utterance);
        }
    }

    // Audio visualization
    createAudioVisualizer(canvas) {
        if (!this.audioContext) return;

        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const draw = () => {
            analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height;
                
                const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, 'rgb(0, 245, 255)');
                gradient.addColorStop(1, 'rgb(255, 0, 110)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
            
            requestAnimationFrame(draw);
        };
        
        // Connect to analyser
        this.audioContext.destination.connect(analyser);
        draw();
        
        return analyser;
    }

    setupEventListeners() {
        // Audio toggle controls
        const audioToggle = document.getElementById('audio-toggle');
        const sfxToggle = document.getElementById('sfx-toggle');
        
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                this.toggleBackgroundMusic();
            });
        }
        
        if (sfxToggle) {
            sfxToggle.addEventListener('click', () => {
                this.toggleSFX();
            });
        }

        // Add hover sounds to interactive elements
        this.setupInteractiveSounds();
    }

    setupInteractiveSounds() {
        // Hover sounds
        const hoverElements = document.querySelectorAll(
            'a, button, .nav-link, .social-link, .cta-primary, .cta-secondary, .project-card'
        );
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });

        // Click sounds
        const clickElements = document.querySelectorAll('a, button');
        clickElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playClickSound();
            });
        });

        // Typing sounds for form inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        inputs.forEach(input => {
            input.addEventListener('keydown', () => {
                if (Math.random() > 0.7) { // Don't play on every keystroke
                    this.playTypingSound();
                }
            });
        });
    }

    toggleBackgroundMusic() {
        if (this.musicEnabled) {
            this.stopBackgroundMusic();
            document.getElementById('audio-toggle')?.classList.remove('active');
        } else {
            this.startBackgroundMusic();
            document.getElementById('audio-toggle')?.classList.add('active');
        }
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        const sfxToggle = document.getElementById('sfx-toggle');
        
        if (this.sfxEnabled) {
            sfxToggle?.classList.add('active');
            this.playSuccessSound();
        } else {
            sfxToggle?.classList.remove('active');
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.musicNodes) {
            this.musicNodes.forEach(({ gainNode }, index) => {
                const nodeVolume = (0.02 - index * 0.003) * this.volume;
                gainNode.gain.setValueAtTime(nodeVolume, this.audioContext.currentTime);
            });
        }
    }

    // Web Audio API requires user interaction to start
    resumeAudioContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    destroy() {
        if (this.musicNodes) {
            this.musicNodes.forEach(({ oscillator, lfo }) => {
                try {
                    oscillator.stop();
                    lfo.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
            });
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Auto-resume audio context on first user interaction
document.addEventListener('click', () => {
    if (window.audioSystem) {
        window.audioSystem.resumeAudioContext();
    }
}, { once: true });

// Export the AudioSystem
window.AudioSystem = AudioSystem;
