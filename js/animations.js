// Advanced Animation Controller

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupMorphingShapes();
        this.setupHolographicEffects();
        this.setupGlitchEffects();
        this.isInitialized = true;
    }

    setupIntersectionObservers() {
        // Scroll-triggered animations
        const revealOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerRevealAnimation(entry.target);
                }
            });
        }, revealOptions);

        // Observe elements with reveal classes
        document.querySelectorAll('.scroll-reveal, .animate-on-scroll').forEach(el => {
            revealObserver.observe(el);
        });

        this.observers.set('reveal', revealObserver);
    }

    triggerRevealAnimation(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animate-' + animationType);
            element.classList.add('revealed');
        }, delay);
    }

    // Morphing Shapes Animation
    setupMorphingShapes() {
        const morphingElements = document.querySelectorAll('.morphing-shape');
        
        morphingElements.forEach(element => {
            this.startMorphingAnimation(element);
        });
    }

    startMorphingAnimation(element) {
        const shapes = [
            '50% 50% 50% 50%',
            '30% 70% 70% 30%',
            '50% 20% 80% 50%',
            '80% 50% 20% 50%',
            '50% 50% 50% 50%'
        ];
        
        let currentShape = 0;
        
        const morph = () => {
            element.style.borderRadius = shapes[currentShape];
            currentShape = (currentShape + 1) % shapes.length;
        };
        
        setInterval(morph, 2000);
    }

    // Holographic Text Effect
    setupHolographicEffects() {
        const holoElements = document.querySelectorAll('.holographic-text');
        
        holoElements.forEach(element => {
            this.createHolographicEffect(element);
        });
    }

    createHolographicEffect(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        // Create multiple layers for holographic effect
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('span');
            layer.textContent = text;
            layer.style.position = 'absolute';
            layer.style.top = '0';
            layer.style.left = '0';
            layer.style.width = '100%';
            layer.style.height = '100%';
            
            switch (i) {
                case 0:
                    layer.style.color = '#ff006e';
                    layer.style.animation = 'holoShift1 2s ease-in-out infinite';
                    break;
                case 1:
                    layer.style.color = '#00f5ff';
                    layer.style.animation = 'holoShift2 2s ease-in-out infinite';
                    break;
                case 2:
                    layer.style.color = '#ffd700';
                    layer.style.animation = 'holoShift3 2s ease-in-out infinite';
                    break;
            }
            
            element.appendChild(layer);
        }
        
        element.style.position = 'relative';
    }

    // Glitch Effect
    setupGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            this.createGlitchEffect(element);
        });
    }

    createGlitchEffect(element) {
        const text = element.textContent;
        const glitchChars = '!@#$%^&*()_+-={}[]|\\:";\'<>?,.~`';
        
        const glitch = () => {
            const glitchedText = text.split('').map(char => {
                if (Math.random() < 0.05) {
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
                return char;
            }).join('');
            
            element.textContent = glitchedText;
            
            setTimeout(() => {
                element.textContent = text;
            }, 50);
        };
        
        setInterval(glitch, 3000 + Math.random() * 2000);
    }

    // Magnetic Cursor Effect
    setupMagneticCursor() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // Liquid Button Effect
    createLiquidButton(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('liquid-ripple');
        
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '1';
            
            button.appendChild(ripple);
            
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(4)';
                ripple.style.opacity = '0';
            });
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }

    // Floating Elements Animation
    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
            const amplitude = 10 + Math.random() * 20;
            const speed = 0.5 + Math.random() * 1;
            const delay = index * 0.5;
            
            const animate = () => {
                const time = (Date.now() * 0.001 * speed) + delay;
                const y = Math.sin(time) * amplitude;
                const x = Math.cos(time * 0.5) * (amplitude * 0.5);
                
                element.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(animate);
            };
            
            animate();
        });
    }

    // Text Reveal Animation
    createTextRevealAnimation(element) {
        const text = element.textContent;
        const letters = text.split('');
        element.innerHTML = '';
        
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.opacity = '0';
            span.style.transform = 'translateY(50px)';
            span.style.transition = `all 0.5s ease ${index * 0.05}s`;
            element.appendChild(span);
        });
        
        // Trigger animation
        setTimeout(() => {
            element.querySelectorAll('span').forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    // Staggered Grid Animation
    animateGrid(container) {
        const items = container.querySelectorAll('.grid-item');
        
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'scale(1) translateY(0)';
            }, index * 100);
        });
    }

    // Counter Animation
    animateCounter(element, start = 0, end, duration = 2000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Progress Bar Animation
    animateProgressBar(bar, percentage, duration = 1000) {
        bar.style.width = '0%';
        bar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 100);
    }

    // Card Flip Animation
    createCardFlip(card) {
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        
        card.addEventListener('click', () => {
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
            } else {
                card.classList.add('flipped');
            }
        });
    }

    // Parallax Scroll Effect
    setupParallaxScroll() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', updateParallax);
        updateParallax();
    }

    // Tilt Effect
    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt-effect');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    // Shake Animation
    shakeElement(element, duration = 500) {
        element.classList.add('animate-shake');
        
        setTimeout(() => {
            element.classList.remove('animate-shake');
        }, duration);
    }

    // Success Animation
    successAnimation(element) {
        element.classList.add('success-bounce');
        
        setTimeout(() => {
            element.classList.remove('success-bounce');
        }, 600);
    }

    // Loading Dots Animation
    createLoadingDots(container) {
        container.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('loading-dot');
            dot.style.animationDelay = `${i * 0.2}s`;
            container.appendChild(dot);
        }
    }

    // Typewriter Effect
    typewriterEffect(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Wave Effect
    createWaveEffect(element) {
        const wave = document.createElement('div');
        wave.classList.add('wave-effect');
        element.appendChild(wave);
        
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            wave.style.left = x + 'px';
            wave.style.top = y + 'px';
            wave.style.transform = 'scale(0)';
            
            requestAnimationFrame(() => {
                wave.style.transform = 'scale(1)';
            });
            
            setTimeout(() => {
                wave.style.transform = 'scale(0)';
            }, 400);
        });
    }

    // Queue animation for performance
    queueAnimation(callback, delay = 0) {
        this.animationQueue.push({
            callback,
            delay,
            timestamp: Date.now()
        });
        
        this.processAnimationQueue();
    }

    processAnimationQueue() {
        if (this.animationQueue.length === 0) return;
        
        const animation = this.animationQueue.shift();
        const now = Date.now();
        
        if (now - animation.timestamp >= animation.delay) {
            animation.callback();
        } else {
            // Put it back in the queue
            this.animationQueue.unshift(animation);
        }
        
        if (this.animationQueue.length > 0) {
            requestAnimationFrame(() => this.processAnimationQueue());
        }
    }

    // Clean up observers
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animationQueue = [];
    }
}

// CSS Animations (to be added to the DOM)
const animationStyles = `
@keyframes holoShift1 {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(-1px, 0); }
    66% { transform: translate(1px, 0); }
}

@keyframes holoShift2 {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(1px, -1px); }
    66% { transform: translate(-1px, 1px); }
}

@keyframes holoShift3 {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(0, 1px); }
    66% { transform: translate(0, -1px); }
}

.liquid-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-primary);
    display: inline-block;
    margin: 0 2px;
    animation: dotPulse 1.4s ease-in-out infinite both;
}

@keyframes dotPulse {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.wave-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 245, 255, 0.3);
    width: 20px;
    height: 20px;
    pointer-events: none;
    transform: scale(0);
    transition: transform 0.4s ease-out;
}

.card-front, .card-back {
    backface-visibility: hidden;
    transition: transform 0.6s;
}

.card-back {
    transform: rotateY(180deg);
}

.flipped .card-front {
    transform: rotateY(180deg);
}

.flipped .card-back {
    transform: rotateY(0);
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Export the AnimationController
window.AnimationController = AnimationController;
