// Gamification System for User Engagement

class GamificationSystem {
    constructor() {
        this.userXP = 0;
        this.userLevel = 1;
        this.achievements = new Map();
        this.actions = new Map();
        this.sessionStats = {
            startTime: Date.now(),
            sectionsVisited: new Set(),
            interactionsCount: 0,
            timeSpent: 0
        };
        
        this.init();
    }

    init() {
        this.loadUserProgress();
        this.setupXPSystem();
        this.loadAchievements();
        this.setupEventListeners();
        this.startSessionTracking();
        this.updateUI();
    }

    loadUserProgress() {
        try {
            const saved = localStorage.getItem('gamificationData');
            if (saved) {
                const data = JSON.parse(saved);
                this.userXP = data.xp || 0;
                this.userLevel = data.level || 1;
                this.achievements = new Map(data.achievements || []);
                this.actions = new Map(data.actions || []);
            }
        } catch (error) {
            console.warn('Failed to load gamification data:', error);
        }
    }

    saveUserProgress() {
        try {
            const data = {
                xp: this.userXP,
                level: this.userLevel,
                achievements: Array.from(this.achievements.entries()),
                actions: Array.from(this.actions.entries()),
                lastUpdated: Date.now()
            };
            localStorage.setItem('gamificationData', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save gamification data:', error);
        }
    }

    setupXPSystem() {
        // Define XP values for different actions
        this.xpValues = {
            'Page Visit': 5,
            'Navigation': 5,
            'Section View': 10,
            'Project View': 15,
            'Gallery View': 10,
            'Quote View': 2,
            'CTA Click': 10,
            'Contact Form Submission': 50,
            'Newsletter Signup': 20,
            'Social Share': 15,
            'Gallery Filter': 5,
            'Interaction': 2,
            'Time Milestone': 25, // Every 5 minutes
            'Explorer Bonus': 100 // For visiting all sections
        };

        // Level thresholds
        this.levelThresholds = [
            0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000
        ];
    }

    loadAchievements() {
        // Load achievements from global data if available
        if (typeof achievementsData !== 'undefined') {
            achievementsData.forEach(achievement => {
                if (!this.achievements.has(achievement.id)) {
                    this.achievements.set(achievement.id, {
                        ...achievement,
                        unlocked: false,
                        unlockedAt: null
                    });
                }
            });
        }
    }

    setupEventListeners() {
        // Track section visibility
        this.setupSectionTracking();
        
        // Track user interactions
        this.setupInteractionTracking();
        
        // Track time milestones
        this.setupTimeTracking();
        
        // Page visibility for session tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseSession();
            } else {
                this.resumeSession();
            }
        });

        // Before unload - save progress
        window.addEventListener('beforeunload', () => {
            this.endSession();
            this.saveUserProgress();
        });
    }

    setupSectionTracking() {
        const sections = document.querySelectorAll('.section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId && !this.sessionStats.sectionsVisited.has(sectionId)) {
                        this.sessionStats.sectionsVisited.add(sectionId);
                        this.addXP(this.xpValues['Section View'], `Visited ${sectionId} section`);
                        
                        // Check for explorer achievement
                        this.checkExplorerAchievement();
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px'
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    setupInteractionTracking() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .nav-link, .project-card, .gallery-item, .quote-btn'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('click', () => {
                this.sessionStats.interactionsCount++;
                this.addXP(this.xpValues['Interaction'], 'User interaction');
                
                // Check interaction-based achievements
                this.checkInteractionAchievements();
            });
        });
    }

    setupTimeTracking() {
        setInterval(() => {
            if (!document.hidden) {
                this.sessionStats.timeSpent += 1000; // Add 1 second
                
                // Award XP every 5 minutes
                if (this.sessionStats.timeSpent % (5 * 60 * 1000) === 0) {
                    this.addXP(this.xpValues['Time Milestone'], 'Time milestone reached');
                    this.checkTimeBasedAchievements();
                }
            }
        }, 1000);
    }

    addXP(amount, reason) {
        const oldLevel = this.userLevel;
        this.userXP += amount;
        
        // Calculate new level
        this.userLevel = this.calculateLevel(this.userXP);
        
        // Update UI
        this.updateXPDisplay();
        
        // Check for level up
        if (this.userLevel > oldLevel) {
            this.handleLevelUp(oldLevel, this.userLevel);
        }
        
        // Track action
        this.trackAction(reason, amount);
        
        // Save progress
        this.saveUserProgress();
        
        // Show XP gain animation
        this.showXPGain(amount, reason);
    }

    calculateLevel(xp) {
        for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
            if (xp >= this.levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    updateXPDisplay() {
        const xpFill = document.getElementById('xp-fill');
        const xpText = document.getElementById('xp-text');
        
        if (xpFill && xpText) {
            const currentLevelXP = this.levelThresholds[this.userLevel - 1] || 0;
            const nextLevelXP = this.levelThresholds[this.userLevel] || this.levelThresholds[this.levelThresholds.length - 1];
            const progress = ((this.userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
            
            xpFill.style.width = Math.min(100, Math.max(0, progress)) + '%';
            xpText.textContent = `Level ${this.userLevel} - XP: ${this.userXP}`;
        }
    }

    handleLevelUp(oldLevel, newLevel) {
        this.showLevelUpNotification(newLevel);
        
        // Play level up sound
        if (window.audioSystem) {
            window.audioSystem.playAchievementSound();
        }
        
        // Check for level-based achievements
        this.checkLevelAchievements(newLevel);
        
        // Award bonus XP for level up
        this.addBonusReward(newLevel);
    }

    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h3>Level Up!</h3>
                <p>You've reached Level ${level}!</p>
                <div class="level-up-rewards">
                    <span class="reward">+${level * 10} Bonus XP</span>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    addBonusReward(level) {
        const bonusXP = level * 10;
        setTimeout(() => {
            this.userXP += bonusXP;
            this.updateXPDisplay();
            this.saveUserProgress();
        }, 1000);
    }

    trackAction(action, xp) {
        const timestamp = Date.now();
        const actionKey = `${action}_${new Date().toDateString()}`;
        
        if (!this.actions.has(actionKey)) {
            this.actions.set(actionKey, {
                action,
                count: 0,
                totalXP: 0,
                firstOccurrence: timestamp
            });
        }
        
        const actionData = this.actions.get(actionKey);
        actionData.count++;
        actionData.totalXP += xp;
        actionData.lastOccurrence = timestamp;
    }

    showXPGain(amount, reason) {
        const xpGain = document.createElement('div');
        xpGain.className = 'xp-gain-notification';
        xpGain.innerHTML = `
            <div class="xp-gain-content">
                <span class="xp-amount">+${amount} XP</span>
                <span class="xp-reason">${reason}</span>
            </div>
        `;

        // Position near XP bar
        const xpBar = document.querySelector('.xp-bar');
        if (xpBar) {
            const rect = xpBar.getBoundingClientRect();
            xpGain.style.position = 'fixed';
            xpGain.style.top = (rect.top - 40) + 'px';
            xpGain.style.right = '30px';
        }

        document.body.appendChild(xpGain);
        
        setTimeout(() => {
            xpGain.classList.add('show');
        }, 100);

        setTimeout(() => {
            xpGain.classList.remove('show');
            setTimeout(() => {
                if (xpGain.parentNode) {
                    document.body.removeChild(xpGain);
                }
            }, 500);
        }, 2000);
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            
            this.showAchievementNotification(achievement);
            this.awardAchievementXP(achievement);
            this.saveUserProgress();
            
            // Play achievement sound
            if (window.audioSystem) {
                window.audioSystem.playAchievementSound();
            }
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.getElementById('achievement-notification');
        if (!notification) return;

        const icon = notification.querySelector('.achievement-icon');
        const title = notification.querySelector('.achievement-title');
        const description = notification.querySelector('.achievement-description');

        if (icon) icon.textContent = achievement.icon;
        if (title) title.textContent = achievement.title;
        if (description) description.textContent = achievement.description;

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    awardAchievementXP(achievement) {
        const bonusXP = achievement.xpReward || 25;
        setTimeout(() => {
            this.addXP(bonusXP, `Achievement: ${achievement.title}`);
        }, 1000);
    }

    // Achievement checking methods
    checkExplorerAchievement() {
        const totalSections = document.querySelectorAll('.section').length;
        if (this.sessionStats.sectionsVisited.size >= totalSections) {
            this.unlockAchievement('explorer');
            this.addXP(this.xpValues['Explorer Bonus'], 'Explorer bonus');
        }
    }

    checkInteractionAchievements() {
        if (this.sessionStats.interactionsCount >= 10) {
            this.unlockAchievement('interactive');
        }
        
        if (this.sessionStats.interactionsCount >= 50) {
            this.unlockAchievement('super-interactive');
        }
    }

    checkTimeBasedAchievements() {
        const timeInMinutes = this.sessionStats.timeSpent / (1000 * 60);
        
        if (timeInMinutes >= 5) {
            this.unlockAchievement('engaged');
        }
        
        if (timeInMinutes >= 15) {
            this.unlockAchievement('dedicated');
        }
        
        if (timeInMinutes >= 30) {
            this.unlockAchievement('devoted');
        }
    }

    checkLevelAchievements(level) {
        const levelAchievements = {
            5: 'rising-star',
            10: 'experienced',
            15: 'expert',
            20: 'master'
        };
        
        if (levelAchievements[level]) {
            this.unlockAchievement(levelAchievements[level]);
        }
    }

    checkSpecialAchievements() {
        // First visit
        if (!localStorage.getItem('hasVisitedBefore')) {
            this.unlockAchievement('first-visit');
            localStorage.setItem('hasVisitedBefore', 'true');
        }
        
        // Return visitor
        const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
        localStorage.setItem('visitCount', visitCount.toString());
        
        if (visitCount >= 3) {
            this.unlockAchievement('return-visitor');
        }
        
        if (visitCount >= 10) {
            this.unlockAchievement('loyal-visitor');
        }
    }

    startSessionTracking() {
        this.sessionStats.startTime = Date.now();
        this.checkSpecialAchievements();
        
        // Track session start
        this.addXP(this.xpValues['Page Visit'], 'Page visit');
    }

    pauseSession() {
        // Called when page becomes hidden
        this.saveUserProgress();
    }

    resumeSession() {
        // Called when page becomes visible again
        // Continue tracking...
    }

    endSession() {
        const sessionDuration = Date.now() - this.sessionStats.startTime;
        
        // Award bonus XP for longer sessions
        if (sessionDuration > 10 * 60 * 1000) { // 10 minutes
            this.addXP(50, 'Long session bonus');
        }
        
        // Save session stats
        this.saveSessionStats();
    }

    saveSessionStats() {
        try {
            const sessionData = {
                duration: Date.now() - this.sessionStats.startTime,
                sectionsVisited: Array.from(this.sessionStats.sectionsVisited),
                interactionsCount: this.sessionStats.interactionsCount,
                timestamp: Date.now()
            };
            
            const sessions = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
            sessions.push(sessionData);
            
            // Keep only last 20 sessions
            localStorage.setItem('sessionHistory', JSON.stringify(sessions.slice(-20)));
        } catch (error) {
            console.warn('Failed to save session stats:', error);
        }
    }

    // Public methods for external components
    getProgress() {
        return {
            xp: this.userXP,
            level: this.userLevel,
            progress: this.getProgressToNextLevel(),
            achievements: this.getUnlockedAchievements(),
            sessionStats: this.sessionStats
        };
    }

    getProgressToNextLevel() {
        const currentLevelXP = this.levelThresholds[this.userLevel - 1] || 0;
        const nextLevelXP = this.levelThresholds[this.userLevel] || this.levelThresholds[this.levelThresholds.length - 1];
        return ((this.userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    }

    getUnlockedAchievements() {
        return Array.from(this.achievements.values()).filter(achievement => achievement.unlocked);
    }

    getTotalAchievements() {
        return this.achievements.size;
    }

    getUnlockedCount() {
        return this.getUnlockedAchievements().length;
    }

    // Admin/Debug methods
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('gamificationData');
            localStorage.removeItem('sessionHistory');
            localStorage.removeItem('visitCount');
            location.reload();
        }
    }

    exportProgress() {
        const data = {
            gamification: JSON.parse(localStorage.getItem('gamificationData') || '{}'),
            sessions: JSON.parse(localStorage.getItem('sessionHistory') || '[]'),
            visitCount: localStorage.getItem('visitCount') || '0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'portfolio-progress.json';
        link.click();
    }

    getLeaderboardData() {
        // This would typically connect to a backend
        // For now, return local data
        return {
            currentUser: {
                level: this.userLevel,
                xp: this.userXP,
                achievements: this.getUnlockedCount()
            },
            // Mock leaderboard data
            topUsers: [
                { name: 'Anonymous User', level: this.userLevel, xp: this.userXP },
                { name: 'Visitor #2', level: Math.max(1, this.userLevel - 1), xp: Math.max(0, this.userXP - 50) },
                { name: 'Visitor #3', level: Math.max(1, this.userLevel - 2), xp: Math.max(0, this.userXP - 100) }
            ]
        };
    }

    updateUI() {
        this.updateXPDisplay();
        
        // Update achievement badges in about section
        const achievementGrid = document.getElementById('achievements-grid');
        if (achievementGrid) {
            this.updateAchievementGrid(achievementGrid);
        }
    }

    updateAchievementGrid(grid) {
        const achievements = Array.from(this.achievements.values());
        
        grid.innerHTML = '';
        
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            badge.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <h4 class="achievement-title">${achievement.title}</h4>
                <p class="achievement-description">${achievement.description}</p>
                ${achievement.unlocked ? `<div class="achievement-date">Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}</div>` : ''}
            `;
            
            if (achievement.unlocked) {
                badge.addEventListener('click', () => {
                    this.showAchievementDetails(achievement);
                });
            }
            
            grid.appendChild(badge);
        });
    }

    showAchievementDetails(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-detail-modal';
        modal.innerHTML = `
            <div class="achievement-detail-content">
                <button class="achievement-detail-close">&times;</button>
                <div class="achievement-detail-header">
                    <div class="achievement-detail-icon">${achievement.icon}</div>
                    <h2>${achievement.title}</h2>
                </div>
                <div class="achievement-detail-body">
                    <p>${achievement.description}</p>
                    <div class="achievement-detail-meta">
                        <div class="meta-item">
                            <strong>Unlocked:</strong> ${new Date(achievement.unlockedAt).toLocaleString()}
                        </div>
                        <div class="meta-item">
                            <strong>XP Reward:</strong> ${achievement.xpReward || 25}
                        </div>
                        <div class="meta-item">
                            <strong>Rarity:</strong> ${achievement.rarity || 'Common'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        const closeBtn = modal.querySelector('.achievement-detail-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    }
}

// Initialize gamification system
window.addEventListener('DOMContentLoaded', () => {
    window.gamificationSystem = new GamificationSystem();
});

// Export for global access
window.GamificationSystem = GamificationSystem;
