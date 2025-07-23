// Quote Management System

class QuoteManager {
    constructor() {
        this.quotes = [];
        this.currentIndex = 0;
        this.autoRotateInterval = null;
        this.rotationSpeed = 8000; // 8 seconds
        this.isPlaying = true;
        
        this.init();
    }

    init() {
        this.loadQuotes();
        this.setupElements();
        this.setupEventListeners();
        this.displayCurrentQuote();
        this.startAutoRotation();
    }

    loadQuotes() {
        // Load quotes from global data
        if (typeof quotesData !== 'undefined') {
            this.quotes = quotesData;
        }
    }

    setupElements() {
        this.quoteDisplay = document.getElementById('quote-display');
        this.quoteText = this.quoteDisplay?.querySelector('.quote-text');
        this.quoteAuthor = this.quoteDisplay?.querySelector('.quote-author');
        this.prevBtn = document.getElementById('prev-quote');
        this.nextBtn = document.getElementById('next-quote');
        this.shareBtn = document.getElementById('share-quote');
        this.playPauseBtn = document.getElementById('play-pause-quote');
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousQuote();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextQuote();
            });
        }

        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', () => {
                this.shareCurrentQuote();
            });
        }

        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => {
                this.toggleAutoRotation();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.quotes-section')) {
                this.handleKeyboardNavigation(e);
            }
        });

        // Pause on hover
        if (this.quoteDisplay) {
            this.quoteDisplay.addEventListener('mouseenter', () => {
                this.pauseAutoRotation();
            });

            this.quoteDisplay.addEventListener('mouseleave', () => {
                if (this.isPlaying) {
                    this.resumeAutoRotation();
                }
            });
        }
    }

    displayCurrentQuote() {
        if (!this.quotes.length || !this.quoteText || !this.quoteAuthor) return;

        const currentQuote = this.quotes[this.currentIndex];
        
        // Fade out current quote
        this.quoteText.classList.remove('active');
        this.quoteAuthor.classList.remove('active');

        setTimeout(() => {
            // Update content
            this.quoteText.textContent = `"${currentQuote.text}"`;
            this.quoteAuthor.textContent = `— ${currentQuote.author}`;

            // Fade in new quote
            setTimeout(() => {
                this.quoteText.classList.add('active');
                this.quoteAuthor.classList.add('active');
            }, 100);
        }, 300);

        // Update navigation state
        this.updateNavigationState();

        // Play quote change sound
        if (window.audioSystem) {
            window.audioSystem.playNotificationSound();
        }

        // Update XP
        if (window.gamificationSystem) {
            window.gamificationSystem.addXP(2, 'Quote View');
        }
    }

    nextQuote() {
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
        this.displayCurrentQuote();
        this.resetAutoRotation();
    }

    previousQuote() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.quotes.length - 1;
        this.displayCurrentQuote();
        this.resetAutoRotation();
    }

    updateNavigationState() {
        // Update button states based on current position
        if (this.prevBtn) {
            this.prevBtn.disabled = false;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = false;
        }

        // Add progress indicator
        this.updateProgressIndicator();
    }

    updateProgressIndicator() {
        let progressIndicator = document.querySelector('.quote-progress');
        
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'quote-progress';
            
            const quotesContainer = document.querySelector('.quotes-container');
            if (quotesContainer) {
                quotesContainer.appendChild(progressIndicator);
            }
        }

        progressIndicator.innerHTML = `
            <div class="progress-dots">
                ${this.quotes.map((_, index) => 
                    `<span class="progress-dot ${index === this.currentIndex ? 'active' : ''}" 
                     data-index="${index}"></span>`
                ).join('')}
            </div>
            <div class="progress-counter">
                ${this.currentIndex + 1} / ${this.quotes.length}
            </div>
        `;

        // Add click handlers to dots
        const dots = progressIndicator.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToQuote(index);
            });
        });
    }

    goToQuote(index) {
        if (index >= 0 && index < this.quotes.length) {
            this.currentIndex = index;
            this.displayCurrentQuote();
            this.resetAutoRotation();
        }
    }

    startAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }

        this.autoRotateInterval = setInterval(() => {
            this.nextQuote();
        }, this.rotationSpeed);

        this.isPlaying = true;
        this.updatePlayPauseButton();
    }

    pauseAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    resumeAutoRotation() {
        if (!this.autoRotateInterval && this.isPlaying) {
            this.startAutoRotation();
        }
    }

    resetAutoRotation() {
        if (this.isPlaying) {
            this.startAutoRotation();
        }
    }

    toggleAutoRotation() {
        if (this.isPlaying) {
            this.pauseAutoRotation();
            this.isPlaying = false;
        } else {
            this.startAutoRotation();
        }
        
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        if (!this.playPauseBtn) return;

        const icon = this.playPauseBtn.querySelector('i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        this.playPauseBtn.title = this.isPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation';
    }

    shareCurrentQuote() {
        if (!this.quotes.length) return;

        const currentQuote = this.quotes[this.currentIndex];
        const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
        const shareUrl = window.location.href;

        // Try native Web Share API first
        if (navigator.share) {
            navigator.share({
                title: 'Inspirational Quote',
                text: shareText,
                url: shareUrl
            }).catch(console.error);
        } else {
            // Fallback to custom share modal
            this.showShareModal(shareText, shareUrl);
        }

        // Play share sound
        if (window.audioSystem) {
            window.audioSystem.playSuccessSound();
        }

        // Update XP
        if (window.gamificationSystem) {
            window.gamificationSystem.addXP(10, 'Quote Share');
        }
    }

    showShareModal(text, url) {
        const shareModal = document.createElement('div');
        shareModal.className = 'share-modal';
        shareModal.innerHTML = `
            <div class="share-modal-content">
                <button class="share-modal-close">&times;</button>
                <h3>Share This Quote</h3>
                <div class="share-quote-preview">
                    <p>${text}</p>
                </div>
                <div class="share-options">
                    <button class="share-option" data-platform="twitter">
                        <i class="fab fa-twitter"></i>
                        Twitter
                    </button>
                    <button class="share-option" data-platform="facebook">
                        <i class="fab fa-facebook"></i>
                        Facebook
                    </button>
                    <button class="share-option" data-platform="linkedin">
                        <i class="fab fa-linkedin"></i>
                        LinkedIn
                    </button>
                    <button class="share-option" data-platform="copy">
                        <i class="fas fa-copy"></i>
                        Copy Link
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(shareModal);
        
        setTimeout(() => {
            shareModal.classList.add('active');
        }, 10);

        // Event listeners
        const closeBtn = shareModal.querySelector('.share-modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeShareModal(shareModal);
        });

        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                this.closeShareModal(shareModal);
            }
        });

        // Share option handlers
        const shareOptions = shareModal.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.handleShareOption(option.dataset.platform, text, url);
                this.closeShareModal(shareModal);
            });
        });
    }

    closeShareModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    handleShareOption(platform, text, url) {
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(url);

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
                break;
            case 'copy':
                this.copyToClipboard(`${text}\n\n${url}`);
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopySuccess();
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopySuccess();
        }
    }

    showCopySuccess() {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Quote copied to clipboard!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    handleKeyboardNavigation(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousQuote();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextQuote();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoRotation();
                break;
            case 's':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.shareCurrentQuote();
                }
                break;
        }
    }

    // Category-based quote filtering
    filterQuotesByCategory(category) {
        const filteredQuotes = this.quotes.filter(quote => 
            quote.category === category || category === 'all'
        );
        
        if (filteredQuotes.length > 0) {
            const originalQuotes = this.quotes;
            this.quotes = filteredQuotes;
            this.currentIndex = 0;
            this.displayCurrentQuote();
            
            // Option to restore all quotes
            setTimeout(() => {
                this.quotes = originalQuotes;
            }, 30000); // Restore after 30 seconds
        }
    }

    // Add new quote (for admin functionality)
    addQuote(text, author, category = 'general') {
        const newQuote = {
            id: this.quotes.length + 1,
            text,
            author,
            category
        };
        
        this.quotes.push(newQuote);
        this.updateProgressIndicator();
        
        // Save to localStorage for persistence
        this.saveQuotesToStorage();
    }

    // Save quotes to localStorage
    saveQuotesToStorage() {
        try {
            localStorage.setItem('customQuotes', JSON.stringify(this.quotes));
        } catch (error) {
            console.warn('Failed to save quotes to localStorage:', error);
        }
    }

    // Load custom quotes from localStorage
    loadCustomQuotes() {
        try {
            const customQuotes = localStorage.getItem('customQuotes');
            if (customQuotes) {
                const parsed = JSON.parse(customQuotes);
                this.quotes = [...this.quotes, ...parsed];
            }
        } catch (error) {
            console.warn('Failed to load custom quotes:', error);
        }
    }

    // Get random quote
    getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }

    // Search quotes
    searchQuotes(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.quotes.filter(quote => 
            quote.text.toLowerCase().includes(term) ||
            quote.author.toLowerCase().includes(term)
        );
    }

    // Get favorite quotes (using localStorage)
    toggleFavorite(quoteId) {
        const favorites = this.getFavoriteQuotes();
        const index = favorites.indexOf(quoteId);
        
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(quoteId);
        }
        
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
        this.updateFavoriteButton(quoteId, index === -1);
    }

    getFavoriteQuotes() {
        try {
            return JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
        } catch {
            return [];
        }
    }

    updateFavoriteButton(quoteId, isFavorite) {
        const favoriteBtn = document.querySelector(`[data-quote-id="${quoteId}"] .favorite-btn`);
        if (favoriteBtn) {
            const icon = favoriteBtn.querySelector('i');
            icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
            favoriteBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
        }
    }

    // Generate quote image for sharing
    generateQuoteImage(quote) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 1200;
        canvas.height = 630; // Social media optimal size
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0a0a0f');
        gradient.addColorStop(1, '#1a1a2e');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Quote text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Word wrap
        const words = quote.text.split(' ');
        const maxWidth = canvas.width - 200;
        let line = '';
        const lines = [];
        
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        // Draw quote text
        const lineHeight = 60;
        const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(`"${line.trim()}"`, canvas.width / 2, startY + index * lineHeight);
        });
        
        // Author
        ctx.fillStyle = '#00f5ff';
        ctx.font = '32px Inter, sans-serif';
        ctx.fillText(`— ${quote.author}`, canvas.width / 2, startY + lines.length * lineHeight + 40);
        
        return canvas.toDataURL('image/png');
    }

    destroy() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
    }
}

// Initialize quote manager when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.quoteManager = new QuoteManager();
});

// Export for global access
window.QuoteManager = QuoteManager;
