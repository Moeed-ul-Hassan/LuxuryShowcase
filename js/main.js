// Main JavaScript File - Portfolio Functionality

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeModules();
        this.handlePageLoad();
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMReady();
        });

        // Window Load
        window.addEventListener('load', () => {
            this.handleWindowLoad();
        });

        // Scroll Events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Resize Events
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Navigation Events
        this.setupNavigation();

        // Form Events
        this.setupForms();

        // Interactive Elements
        this.setupInteractiveElements();
    }

    initializeModules() {
        // Initialize particle system
        if (typeof ParticleSystem !== 'undefined') {
            this.particles = new ParticleSystem();
        }

        // Initialize animations
        if (typeof AnimationController !== 'undefined') {
            this.animations = new AnimationController();
        }

        // Initialize audio system
        if (typeof AudioSystem !== 'undefined') {
            this.audio = new AudioSystem();
        }

        // Initialize gallery
        if (typeof GalleryManager !== 'undefined') {
            this.gallery = new GalleryManager();
        }

        // Initialize quotes
        if (typeof QuoteManager !== 'undefined') {
            this.quotes = new QuoteManager();
        }

        // Initialize contact form
        if (typeof ContactForm !== 'undefined') {
            this.contact = new ContactForm();
        }

        // Initialize gamification
        if (typeof GamificationSystem !== 'undefined') {
            this.gamification = new GamificationSystem();
        }
    }

    handlePageLoad() {
        this.showLoadingScreen();
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startIntroAnimations();
        }, 3000);
    }

    handleDOMReady() {
        // Initialize all components that need DOM to be ready
        this.setupCustomCursor();
        this.setupScrollProgress();
        this.setupSectionNavigation();
        this.setupBackToTop();
        this.populateProjects();
        this.populateGallery();
        this.populateAchievements();
        this.startTypingAnimation();
        this.setupSkillBars();
        this.setupTestimonialSlider();
        this.updateAvailabilityStatus();
    }

    handleWindowLoad() {
        // Handle window load events
        this.initializeScrollReveal();
        this.setupStatsCounter();
    }

    handleScroll() {
        this.updateScrollProgress();
        this.updateActiveSection();
        this.handleScrollReveal();
        this.updateBackToTopVisibility();
        this.handleParallaxEffects();
    }

    handleResize() {
        // Handle responsive adjustments
        if (this.particles) {
            this.particles.handleResize();
        }
        
        this.adjustLayoutForScreenSize();
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Hamburger menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Close mobile menu
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Section navigation dots
        const navDots = document.querySelectorAll('.nav-dot');
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.getAttribute('data-section');
                this.scrollToSection(sectionId);
            });
        });
    }

    setupForms() {
        // Contact form setup is handled by ContactForm class
        // Newsletter signup
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(form);
            });
        });
    }

    setupInteractiveElements() {
        // CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCTAClick(e);
            });
        });

        // Project filters
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterProjects(button.getAttribute('data-filter'));
            });
        });

        // Gallery filters
        const galleryFilters = document.querySelectorAll('.gallery-filter');
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.filterGallery(filter.getAttribute('data-category'));
            });
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            
            // Animate loading progress
            const progressBar = document.querySelector('.loader-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    startIntroAnimations() {
        // Trigger intro animations
        const nameText = document.getElementById('name-text');
        const legendText = document.getElementById('legend-text');
        
        if (nameText) {
            nameText.classList.add('animate-fade-in');
        }
        
        if (legendText) {
            setTimeout(() => {
                legendText.classList.add('animate-fade-in-right');
            }, 500);
        }

        // Start typing animation
        this.startTypingAnimation();
    }

    setupCustomCursor() {
        const cursor = document.getElementById('custom-cursor');
        const cursorDot = cursor?.querySelector('.cursor-dot');
        const cursorOutline = cursor?.querySelector('.cursor-outline');

        if (!cursor || !cursorDot || !cursorOutline) return;

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth follow animation for outline
        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateOutline);
        };
        animateOutline();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .hover-cursor');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    setupScrollProgress() {
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }

    setupSectionNavigation() {
        this.updateActiveSection();
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const navDots = document.querySelectorAll('.nav-dot');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        // Update navigation dots
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === currentSection) {
                dot.classList.add('active');
            }
        });
    }

    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateBackToTopVisibility() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Update XP for navigation
            if (this.gamification) {
                this.gamification.addXP(5, 'Navigation');
            }
        }
    }

    startTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const texts = [
            'Python Backend Developer',
            'AI Integration Specialist', 
            'Full-Stack Engineer',
            'Automation Expert',
            'The Legend'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeText = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        };

        typeText();
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-fill');
        
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const skillValue = bar.getAttribute('data-skill');
                bar.style.width = skillValue + '%';
            });
        };

        // Trigger animation when skills section is visible
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateSkillBars, 500);
                        observer.unobserve(skillsSection);
                    }
                });
            });
            
            observer.observe(skillsSection);
        }
    }

    setupStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                element.textContent = Math.ceil(current);
                
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, 20);
        };

        // Animate counters when home section is visible
        const homeSection = document.getElementById('home');
        if (homeSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statNumbers.forEach(stat => {
                            setTimeout(() => animateCounter(stat), 1000);
                        });
                        observer.unobserve(homeSection);
                    }
                });
            });
            
            observer.observe(homeSection);
        }
    }

    setupTestimonialSlider() {
        const slider = document.getElementById('testimonials-slider');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        
        if (!slider || !prevBtn || !nextBtn) return;

        const testimonials = slider.querySelectorAll('.testimonial-item');
        let currentIndex = 0;

        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
            showTestimonial(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        });

        // Auto-play testimonials
        setInterval(() => {
            currentIndex = currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        }, 5000);

        // Initialize
        showTestimonial(0);
    }

    populateProjects() {
        if (typeof projectsData === 'undefined') return;

        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        projectsData.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = `project-card ${project.category}`;
        card.innerHTML = `
            <div class="project-image">
                <i class="${project.icon}"></i>
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-stack-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <span><i class="fas fa-calendar"></i> ${project.year}</span>
                    <span><i class="fas fa-code"></i> ${project.linesOfCode}+ LOC</span>
                </div>
            </div>
        `;

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (this.audio) {
                this.audio.playHoverSound();
            }
        });

        return card;
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Update active filter button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });

        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
                card.classList.add('animate-fade-in');
            } else {
                card.style.display = 'none';
            }
        });

        // Update XP for filtering
        if (this.gamification) {
            this.gamification.addXP(2, 'Interaction');
        }
    }

    populateGallery() {
        if (typeof galleryData === 'undefined') return;

        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        galleryData.forEach(item => {
            const galleryItem = this.createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });
    }

    createGalleryItem(item) {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.category}`;
        galleryItem.innerHTML = `
            <div class="gallery-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="gallery-info">
                <h3 class="gallery-title">${item.title}</h3>
                <p class="gallery-description">${item.description}</p>
                <div class="gallery-tags">
                    ${item.tags.map(tag => `<span class="gallery-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Add click event for lightbox
        galleryItem.addEventListener('click', () => {
            if (this.gallery) {
                this.gallery.openLightbox(item);
            }
        });

        return galleryItem;
    }

    filterGallery(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const filterButtons = document.querySelectorAll('.gallery-filter');

        // Update active filter button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });

        // Filter gallery items
        galleryItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
                item.classList.add('animate-fade-in');
            } else {
                item.style.display = 'none';
            }
        });
    }

    populateAchievements() {
        if (typeof achievementsData === 'undefined') return;

        const achievementsGrid = document.getElementById('achievements-grid');
        if (!achievementsGrid) return;

        achievementsGrid.innerHTML = '';

        achievementsData.forEach(achievement => {
            const achievementBadge = this.createAchievementBadge(achievement);
            achievementsGrid.appendChild(achievementBadge);
        });
    }

    createAchievementBadge(achievement) {
        const badge = document.createElement('div');
        badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        badge.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h4 class="achievement-title">${achievement.title}</h4>
            <p class="achievement-description">${achievement.description}</p>
        `;

        if (achievement.unlocked) {
            badge.addEventListener('click', () => {
                this.showAchievementDetails(achievement);
            });
        }

        return badge;
    }

    showAchievementDetails(achievement) {
        // Show achievement notification
        const notification = document.getElementById('achievement-notification');
        if (notification) {
            notification.querySelector('.achievement-icon').textContent = achievement.icon;
            notification.querySelector('.achievement-title').textContent = achievement.title;
            notification.querySelector('.achievement-description').textContent = achievement.description;
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    updateAvailabilityStatus() {
        const statusElement = document.getElementById('availability-status');
        const timeElement = document.getElementById('current-time');
        
        if (statusElement) {
            // You can implement real availability logic here
            statusElement.textContent = 'Available';
            statusElement.className = 'online';
        }
        
        if (timeElement) {
            const updateTime = () => {
                const now = new Date();
                const timeString = now.toLocaleString('en-US', {
                    timeZone: 'Asia/Karachi',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                timeElement.textContent = `PKT ${timeString}`;
            };
            
            updateTime();
            setInterval(updateTime, 60000); // Update every minute
        }
    }

    initializeScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    handleScrollReveal() {
        // Additional scroll reveal logic can be added here
    }

    handleParallaxEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleCTAClick(e) {
        const button = e.target.closest('.cta-primary, .cta-secondary');
        if (!button) return;

        // Add click effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // Play click sound
        if (this.audio) {
            this.audio.playClickSound();
        }

        // Update XP
        if (this.gamification) {
            this.gamification.addXP(10, 'CTA Click');
        }
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email) return;

        // Simulate newsletter signup
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Subscribed!';
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1000);

        // Update XP
        if (this.gamification) {
            this.gamification.addXP(20, 'Newsletter Signup');
        }
    }

    adjustLayoutForScreenSize() {
        const width = window.innerWidth;
        
        // Adjust particle count based on screen size
        if (this.particles) {
            const particleCount = width < 768 ? 30 : width < 1200 ? 50 : 100;
            this.particles.updateParticleCount(particleCount);
        }

        // Adjust animation complexity
        if (width < 768) {
            document.body.classList.add('reduced-animations');
        } else {
            document.body.classList.remove('reduced-animations');
        }
    }
}

// Global utility functions
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Initialize the application
const portfolioApp = new PortfolioApp();

// Export for other modules
window.PortfolioApp = PortfolioApp;
