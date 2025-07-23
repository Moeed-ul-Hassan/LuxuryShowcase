// Particle System for Background Effects

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connectionDistance = 150;
        this.maxParticles = this.getMaxParticles();
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.resizeCanvas();
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    getMaxParticles() {
        const width = window.innerWidth;
        if (width < 768) return 30;
        if (width < 1200) return 60;
        return 100;
    }

    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    updateParticleCount(count) {
        this.maxParticles = count;
        
        if (this.particles.length > count) {
            this.particles = this.particles.slice(0, count);
        } else {
            while (this.particles.length < count) {
                this.particles.push(new Particle(this.canvas.width, this.canvas.height));
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
        
        // Add some floating code snippets
        this.drawFloatingCode();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) + 
                    Math.pow(particle1.y - particle2.y, 2)
                );
                
                if (distance < this.connectionDistance) {
                    const opacity = (this.connectionDistance - distance) / this.connectionDistance;
                    
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawFloatingCode() {
        const codeSnippets = ['<html>', 'def', 'async', 'await', '{...}', 'AI', 'ML', 'API'];
        const time = Date.now() * 0.001;
        
        this.ctx.font = '12px JetBrains Mono, monospace';
        this.ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
        
        codeSnippets.forEach((snippet, index) => {
            const x = 100 + (index * 200) + Math.sin(time + index) * 50;
            const y = 100 + Math.cos(time * 0.5 + index) * 100;
            
            this.ctx.fillText(snippet, x % this.canvas.width, y % this.canvas.height);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Add mouse interaction
        let mouse = { x: 0, y: 0 };
        
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            // Attract particles to mouse
            this.particles.forEach(particle => {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    particle.vx += dx * 0.0001;
                    particle.vy += dy * 0.0001;
                }
            });
        });
    }

    handleResize() {
        this.resizeCanvas();
        this.maxParticles = this.getMaxParticles();
        this.createParticles();
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
        this.originalVx = this.vx;
        this.originalVy = this.vy;
    }

    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Slowly return to original velocity
        this.vx += (this.originalVx - this.vx) * 0.01;
        this.vy += (this.originalVy - this.vy) * 0.01;
        
        // Wrap around edges
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.x > this.canvasWidth) this.x = 0;
        if (this.y < 0) this.y = this.canvasHeight;
        if (this.y > this.canvasHeight) this.y = 0;
        
        // Subtle size pulsing
        this.size += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.02;
    }

    draw(ctx) {
        ctx.save();
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(0, 245, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 0, 110, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a small glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Neural Network Visualization
class NeuralNetworkParticles {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 20;
        this.layers = [5, 8, 6, 3];
        this.createNetwork();
    }

    createNetwork() {
        let nodeIndex = 0;
        const layerSpacing = window.innerWidth / (this.layers.length + 1);
        
        this.layers.forEach((layerSize, layerIndex) => {
            const nodeSpacing = window.innerHeight / (layerSize + 1);
            
            for (let i = 0; i < layerSize; i++) {
                this.nodes.push({
                    id: nodeIndex++,
                    x: layerSpacing * (layerIndex + 1),
                    y: nodeSpacing * (i + 1),
                    layer: layerIndex,
                    activation: Math.random(),
                    size: 8 + Math.random() * 4
                });
            }
        });

        // Create connections between layers
        for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
            const currentLayer = this.nodes.filter(node => node.layer === layerIndex);
            const nextLayer = this.nodes.filter(node => node.layer === layerIndex + 1);
            
            currentLayer.forEach(node1 => {
                nextLayer.forEach(node2 => {
                    this.connections.push({
                        from: node1,
                        to: node2,
                        weight: Math.random() * 2 - 1,
                        active: Math.random() > 0.3
                    });
                });
            });
        }
    }

    update() {
        // Update node activations
        this.nodes.forEach(node => {
            node.activation += (Math.random() - 0.5) * 0.1;
            node.activation = Math.max(0, Math.min(1, node.activation));
        });
    }

    draw(ctx) {
        // Draw connections
        this.connections.forEach(connection => {
            if (!connection.active) return;
            
            const opacity = Math.abs(connection.weight) * connection.from.activation;
            const color = connection.weight > 0 ? '0, 245, 255' : '255, 0, 110';
            
            ctx.strokeStyle = `rgba(${color}, ${opacity * 0.3})`;
            ctx.lineWidth = Math.abs(connection.weight) * 2;
            ctx.beginPath();
            ctx.moveTo(connection.from.x, connection.from.y);
            ctx.lineTo(connection.to.x, connection.to.y);
            ctx.stroke();
        });

        // Draw nodes
        this.nodes.forEach(node => {
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.size
            );
            
            const intensity = node.activation;
            gradient.addColorStop(0, `rgba(0, 245, 255, ${intensity})`);
            gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw activation pulse
            if (node.activation > 0.7) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${node.activation})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size + 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.columns = Math.floor(canvas.width / 20);
        this.drops = new Array(this.columns).fill(0);
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    }

    update() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'rgba(0, 245, 255, 0.8)';
        this.ctx.font = '15px JetBrains Mono';
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            const x = i * 20;
            const y = this.drops[i] * 20;
            
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
}

// Circuit Board Animation
class CircuitBoard {
    constructor() {
        this.paths = [];
        this.nodes = [];
        this.createCircuitPaths();
    }

    createCircuitPaths() {
        const pathCount = 15;
        
        for (let i = 0; i < pathCount; i++) {
            const path = {
                points: this.generatePath(),
                progress: 0,
                speed: 0.005 + Math.random() * 0.01,
                color: Math.random() > 0.5 ? '0, 245, 255' : '255, 0, 110'
            };
            
            this.paths.push(path);
        }
    }

    generatePath() {
        const points = [];
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        let currentX = startX;
        let currentY = startY;
        
        points.push({ x: currentX, y: currentY });
        
        for (let i = 0; i < 5 + Math.random() * 10; i++) {
            const direction = Math.floor(Math.random() * 4);
            const distance = 50 + Math.random() * 100;
            
            switch (direction) {
                case 0: currentY -= distance; break; // Up
                case 1: currentX += distance; break; // Right
                case 2: currentY += distance; break; // Down
                case 3: currentX -= distance; break; // Left
            }
            
            points.push({ x: currentX, y: currentY });
        }
        
        return points;
    }

    update() {
        this.paths.forEach(path => {
            path.progress += path.speed;
            if (path.progress > 1) {
                path.progress = 0;
                path.points = this.generatePath();
            }
        });
    }

    draw(ctx) {
        this.paths.forEach(path => {
            const totalPoints = path.points.length;
            const currentIndex = Math.floor(path.progress * (totalPoints - 1));
            
            ctx.strokeStyle = `rgba(${path.color}, 0.6)`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgb(${path.color})`;
            
            for (let i = 0; i < currentIndex; i++) {
                if (i + 1 < path.points.length) {
                    ctx.beginPath();
                    ctx.moveTo(path.points[i].x, path.points[i].y);
                    ctx.lineTo(path.points[i + 1].x, path.points[i + 1].y);
                    ctx.stroke();
                }
            }
            
            // Draw current position with glow
            if (currentIndex < path.points.length) {
                const currentPoint = path.points[currentIndex];
                ctx.fillStyle = `rgba(${path.color}, 1)`;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(currentPoint.x, currentPoint.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.shadowBlur = 0;
        });
    }
}

// Export the ParticleSystem class
window.ParticleSystem = ParticleSystem;
window.NeuralNetworkParticles = NeuralNetworkParticles;
window.MatrixRain = MatrixRain;
window.CircuitBoard = CircuitBoard;
