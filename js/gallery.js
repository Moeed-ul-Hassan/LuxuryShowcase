// Gallery Manager for Project Showcase

class GalleryManager {
    constructor() {
        this.currentIndex = 0;
        this.galleryItems = [];
        this.filteredItems = [];
        this.lightboxModal = null;
        this.searchTerm = '';
        this.activeFilter = 'all';
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadGalleryData();
        this.setupLightbox();
        this.setupSearch();
    }

    setupElements() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.searchInput = document.getElementById('gallery-search');
        this.lightboxModal = document.getElementById('lightbox-modal');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxDescription = document.getElementById('lightbox-description');
        this.lightboxTech = document.getElementById('lightbox-tech');
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.gallery-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setActiveFilter(button.getAttribute('data-category'));
            });
        });

        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Lightbox controls
        this.setupLightboxControls();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightboxModal && this.lightboxModal.classList.contains('active')) {
                this.handleKeyboardNavigation(e);
            }
        });
    }

    loadGalleryData() {
        // Load gallery data from the global galleryData array
        if (typeof galleryData !== 'undefined') {
            this.galleryItems = galleryData;
        } else {
            console.error('galleryData is not defined. Make sure galleryData.js is loaded before gallery.js');
            this.galleryItems = [];
        }

        this.filteredItems = [...this.galleryItems];
        this.renderGallery();
    }

    renderGallery() {
        if (!this.galleryGrid) return;

        this.galleryGrid.innerHTML = '';

        if (this.filteredItems.length === 0) {
            this.showEmptyState();
            return;
        }

        this.filteredItems.forEach((item, index) => {
            const galleryItem = this.createGalleryItem(item, index);
            this.galleryGrid.appendChild(galleryItem);
        });

        // Trigger staggered animation
        this.animateGalleryItems();
    }

    createGalleryItem(item, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.category}`;
        galleryItem.dataset.index = index;

        galleryItem.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${item.title}">
                <div class="gallery-overlay">
                    <div class="overlay-content">
                        <button class="view-btn" data-action="view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="info-btn" data-action="info">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="gallery-info">
                <h3 class="gallery-title">${item.title}</h3>
                <p class="gallery-description">${item.description}</p>
                <div class="gallery-meta">
                    <span class="gallery-year">
                        <i class="fas fa-calendar"></i>
                        ${item.year}
                    </span>
                    <span class="gallery-status status-${item.status.toLowerCase().replace(' ', '-')}">
                        <i class="fas fa-circle"></i>
                        ${item.status}
                    </span>
                </div>
                <div class="gallery-tags">
                    ${(item.tags || []).map(tag => `<span class="gallery-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        const viewBtn = galleryItem.querySelector('[data-action="view"]');
        const infoBtn = galleryItem.querySelector('[data-action="info"]');

        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openLightbox(item, index);
        });

        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showItemDetails(item);
        });

        galleryItem.addEventListener('click', () => {
            this.openLightbox(item, index);
        });

        // Add hover effects
        galleryItem.addEventListener('mouseenter', () => {
            if (window.audioSystem) {
                window.audioSystem.playHoverSound();
            }
        });

        return galleryItem;
    }

    animateGalleryItems() {
        const items = this.galleryGrid.querySelectorAll('.gallery-item');
        
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    showEmptyState() {
        this.galleryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Projects Found</h3>
                <p>Try adjusting your search criteria or filters.</p>
                <button class="reset-filters-btn" onclick="galleryManager.resetFilters()">
                    Reset Filters
                </button>
            </div>
        `;
    }

    setActiveFilter(category) {
        this.activeFilter = category;
        
        // Update filter button states
        const filterButtons = document.querySelectorAll('.gallery-filter');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });

        this.applyFilters();
        
        // Play filter sound
        if (window.audioSystem) {
            window.audioSystem.playClickSound();
        }

        // Update XP
        if (window.gamificationSystem) {
            window.gamificationSystem.addXP(5, 'Gallery Filter');
        }
    }

    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredItems = this.galleryItems.filter(item => {
            const matchesCategory = this.activeFilter === 'all' || item.category === this.activeFilter;
            const matchesSearch = this.searchTerm === '' || 
                item.title.toLowerCase().includes(this.searchTerm) ||
                item.description.toLowerCase().includes(this.searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });

        this.renderGallery();
    }

    resetFilters() {
        this.activeFilter = 'all';
        this.searchTerm = '';
        
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        const filterButtons = document.querySelectorAll('.gallery-filter');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });

        this.applyFilters();
    }

    setupLightbox() {
        if (!this.lightboxModal) return;

        const closeBtn = this.lightboxModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeLightbox();
            });
        }

        // Close on backdrop click
        this.lightboxModal.addEventListener('click', (e) => {
            if (e.target === this.lightboxModal) {
                this.closeLightbox();
            }
        });
    }

    setupLightboxControls() {
        const prevBtn = this.lightboxModal?.querySelector('.lightbox-prev');
        const nextBtn = this.lightboxModal?.querySelector('.lightbox-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateLightbox(-1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateLightbox(1);
            });
        }
    }

    openLightbox(item, index) {
        if (!this.lightboxModal) return;

        this.currentIndex = index;
        this.updateLightboxContent(item);
        
        this.lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Play transition sound
        if (window.audioSystem) {
            window.audioSystem.playTransitionSound();
        }

        // Update XP
        if (window.gamificationSystem) {
            window.gamificationSystem.addXP(10, 'Gallery View');
        }
    }

    updateLightboxContent(item) {
        if (this.lightboxImage) {
            this.lightboxImage.innerHTML = `
                <img src="${item.src}" alt="${item.title}" class="lightbox-actual-image">
            `;
        }

        if (this.lightboxTitle) {
            this.lightboxTitle.textContent = item.title;
        }

        if (this.lightboxDescription) {
            this.lightboxDescription.innerHTML = `
                <p>${item.description}</p>
                <div class="lightbox-meta">
                    <div class="meta-item">
                        <strong>Year:</strong> ${item.year}
                    </div>
                    <div class="meta-item">
                        <strong>Status:</strong> ${item.status}
                    </div>
                    <div class="meta-item">
                        <strong>Category:</strong> ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </div>
                </div>
            `;
        }

        if (this.lightboxTech) {
            this.lightboxTech.innerHTML = `<strong>Technologies:</strong> ${item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}`;
        }
    }

    closeLightbox() {
        if (!this.lightboxModal) return;

        this.lightboxModal.classList.remove('active');
        document.body.style.overflow = '';

        // Play close sound
        if (window.audioSystem) {
            window.audioSystem.playClickSound();
        }
    }

    navigateLightbox(direction) {
        const newIndex = this.currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.filteredItems.length) {
            this.currentIndex = newIndex;
            this.updateLightboxContent(this.filteredItems[this.currentIndex]);
            
            // Play navigation sound
            if (window.audioSystem) {
                window.audioSystem.playHoverSound();
            }
        }
    }

    handleKeyboardNavigation(e) {
        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.navigateLightbox(-1);
                break;
            case 'ArrowRight':
                this.navigateLightbox(1);
                break;
        }
    }

    showItemDetails(item) {
        // Create a detailed info modal
        const infoModal = document.createElement('div');
        infoModal.className = 'item-info-modal';
        infoModal.innerHTML = `
            <div class="info-modal-content">
                <button class="info-modal-close">&times;</button>
                <div class="info-header">
                    <i class="${item.image}"></i>
                    <h2>${item.title}</h2>
                </div>
                <div class="info-body">
                    <p>${item.description}</p>
                    <div class="info-details">
                        <div class="detail-row">
                            <span class="label">Technologies:</span>
                            <div class="tech-list">
                                ${item.technologies.map(tech => `<span class="tech-chip">${tech}</span>`).join('')}
                            </div>
                        </div>
                        <div class="detail-row">
                            <span class="label">Year:</span>
                            <span class="value">${item.year}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Category:</span>
                            <span class="value">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(infoModal);
        
        // Show modal with animation
        setTimeout(() => {
            infoModal.classList.add('active');
        }, 10);

        // Close button
        const closeBtn = infoModal.querySelector('.info-modal-close');
        closeBtn.addEventListener('click', () => {
            infoModal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(infoModal);
            }, 300);
        });

        // Close on backdrop click
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                closeBtn.click();
            }
        });
    }

    // Method to add new gallery item (for future use)
    addGalleryItem(item) {
        item.id = this.galleryItems.length + 1;
        this.galleryItems.push(item);
        this.applyFilters();
    }

    // Method to update gallery item
    updateGalleryItem(id, updates) {
        const itemIndex = this.galleryItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            this.galleryItems[itemIndex] = { ...this.galleryItems[itemIndex], ...updates };
            this.applyFilters();
        }
    }

    // Export gallery data
    exportGalleryData() {
        const dataStr = JSON.stringify(this.galleryItems, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'gallery-data.json';
        link.click();
    }

    setupSearch() {
        if (!this.searchInput) return;

        // Debounce search
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Search suggestions
        this.setupSearchSuggestions();
    }

    setupSearchSuggestions() {
        const searchContainer = this.searchInput?.parentElement;
        if (!searchContainer) return;

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchContainer.appendChild(suggestionsContainer);

        this.searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions(suggestionsContainer);
        });

        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsContainer.style.display = 'none';
            }, 200);
        });
    }

    showSearchSuggestions(container) {
        const allTags = [...new Set(this.galleryItems.flatMap(item => item.tags))];
        const recentSearches = JSON.parse(localStorage.getItem('gallerySearchHistory') || '[]');
        
        container.innerHTML = `
            <div class="suggestions-section">
                <h4>Popular Tags</h4>
                <div class="tag-suggestions">
                    ${allTags.slice(0, 6).map(tag => 
                        `<span class="suggestion-tag" onclick="galleryManager.searchByTag('${tag}')">${tag}</span>`
                    ).join('')}
                </div>
            </div>
            ${recentSearches.length > 0 ? `
                <div class="suggestions-section">
                    <h4>Recent Searches</h4>
                    <div class="recent-searches">
                        ${recentSearches.slice(0, 5).map(search => 
                            `<span class="recent-search" onclick="galleryManager.setSearchTerm('${search}')">${search}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        container.style.display = 'block';
    }

    searchByTag(tag) {
        if (this.searchInput) {
            this.searchInput.value = tag;
            this.handleSearch(tag);
        }
    }

    setSearchTerm(term) {
        if (this.searchInput) {
            this.searchInput.value = term;
            this.handleSearch(term);
        }
    }
}

// Initialize gallery manager
window.addEventListener('DOMContentLoaded', () => {
    window.galleryManager = new GalleryManager();
});

// Export for global access
window.GalleryManager = GalleryManager;
