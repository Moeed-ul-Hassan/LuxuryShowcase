// Achievements Data for Gamification System

const achievementsData = [
    // First Visit & Introduction Achievements
    {
        id: 'first-visit',
        title: 'Welcome to The Legend',
        description: 'Visited the portfolio for the first time',
        icon: '🎉',
        category: 'introduction',
        xpReward: 25,
        rarity: 'Common',
        unlocked: false,
        condition: 'automatic', // Unlocked automatically on first visit
        requirements: {
            type: 'visit',
            count: 1
        }
    },
    {
        id: 'return-visitor',
        title: 'Coming Back for More',
        description: 'Returned to the portfolio multiple times',
        icon: '🔄',
        category: 'engagement',
        xpReward: 50,
        rarity: 'Common',
        unlocked: false,
        condition: 'visit_count',
        requirements: {
            type: 'visits',
            count: 3
        }
    },
    {
        id: 'loyal-visitor',
        title: 'Loyal Explorer',
        description: 'Visited the portfolio 10+ times - truly dedicated!',
        icon: '💎',
        category: 'loyalty',
        xpReward: 100,
        rarity: 'Rare',
        unlocked: false,
        condition: 'visit_count',
        requirements: {
            type: 'visits',
            count: 10
        }
    },

    // Exploration Achievements
    {
        id: 'explorer',
        title: 'Portfolio Explorer',
        description: 'Visited all sections of the portfolio',
        icon: '🗺️',
        category: 'exploration',
        xpReward: 75,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'sections_visited',
        requirements: {
            type: 'sections',
            sections: ['home', 'about', 'journey', 'projects', 'gallery', 'contact']
        }
    },
    {
        id: 'deep-diver',
        title: 'Deep Diver',
        description: 'Spent significant time exploring the content',
        icon: '🏊‍♂️',
        category: 'engagement',
        xpReward: 60,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'time_spent',
        requirements: {
            type: 'time',
            minutes: 10
        }
    },
    {
        id: 'project-hunter',
        title: 'Project Hunter',
        description: 'Viewed multiple projects in detail',
        icon: '🔍',
        category: 'projects',
        xpReward: 40,
        rarity: 'Common',
        unlocked: false,
        condition: 'project_views',
        requirements: {
            type: 'project_views',
            count: 5
        }
    },

    // Interaction Achievements
    {
        id: 'interactive',
        title: 'Interactive User',
        description: 'Made 10+ interactions with the portfolio',
        icon: '🖱️',
        category: 'interaction',
        xpReward: 35,
        rarity: 'Common',
        unlocked: false,
        condition: 'interactions',
        requirements: {
            type: 'interactions',
            count: 10
        }
    },
    {
        id: 'super-interactive',
        title: 'Super Interactive',
        description: 'Made 50+ interactions - you love exploring!',
        icon: '⚡',
        category: 'interaction',
        xpReward: 80,
        rarity: 'Rare',
        unlocked: false,
        condition: 'interactions',
        requirements: {
            type: 'interactions',
            count: 50
        }
    },
    {
        id: 'quote-collector',
        title: 'Quote Collector',
        description: 'Viewed 10 different motivational quotes',
        icon: '💬',
        category: 'content',
        xpReward: 30,
        rarity: 'Common',
        unlocked: false,
        condition: 'quote_views',
        requirements: {
            type: 'quote_views',
            count: 10
        }
    },

    // Engagement Achievements
    {
        id: 'engaged',
        title: 'Engaged Visitor',
        description: 'Spent 5+ minutes exploring the portfolio',
        icon: '⏰',
        category: 'engagement',
        xpReward: 45,
        rarity: 'Common',
        unlocked: false,
        condition: 'time_spent',
        requirements: {
            type: 'time',
            minutes: 5
        }
    },
    {
        id: 'dedicated',
        title: 'Dedicated Explorer',
        description: 'Spent 15+ minutes diving deep into content',
        icon: '🎯',
        category: 'engagement',
        xpReward: 75,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'time_spent',
        requirements: {
            type: 'time',
            minutes: 15
        }
    },
    {
        id: 'devoted',
        title: 'Devoted Fan',
        description: 'Spent 30+ minutes thoroughly exploring everything',
        icon: '❤️',
        category: 'engagement',
        xpReward: 120,
        rarity: 'Rare',
        unlocked: false,
        condition: 'time_spent',
        requirements: {
            type: 'time',
            minutes: 30
        }
    },

    // Contact & Communication Achievements
    {
        id: 'first-contact',
        title: 'First Contact',
        description: 'Sent your first message through the contact form',
        icon: '📧',
        category: 'communication',
        xpReward: 100,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'form_submission',
        requirements: {
            type: 'contact_form',
            count: 1
        }
    },
    {
        id: 'newsletter-subscriber',
        title: 'Newsletter Subscriber',
        description: 'Subscribed to the newsletter for updates',
        icon: '📰',
        category: 'communication',
        xpReward: 50,
        rarity: 'Common',
        unlocked: false,
        condition: 'newsletter_signup',
        requirements: {
            type: 'newsletter',
            count: 1
        }
    },
    {
        id: 'social-connector',
        title: 'Social Connector',
        description: 'Connected on social media platforms',
        icon: '🔗',
        category: 'social',
        xpReward: 40,
        rarity: 'Common',
        unlocked: false,
        condition: 'social_click',
        requirements: {
            type: 'social_links',
            count: 1
        }
    },

    // Gallery & Projects Achievements
    {
        id: 'gallery-explorer',
        title: 'Gallery Explorer',
        description: 'Explored the project gallery extensively',
        icon: '🖼️',
        category: 'gallery',
        xpReward: 35,
        rarity: 'Common',
        unlocked: false,
        condition: 'gallery_views',
        requirements: {
            type: 'gallery_items',
            count: 5
        }
    },
    {
        id: 'filter-master',
        title: 'Filter Master',
        description: 'Used multiple filters to browse projects',
        icon: '🔧',
        category: 'navigation',
        xpReward: 25,
        rarity: 'Common',
        unlocked: false,
        condition: 'filter_usage',
        requirements: {
            type: 'filters_used',
            count: 3
        }
    },
    {
        id: 'lightbox-lover',
        title: 'Lightbox Lover',
        description: 'Viewed projects in detailed lightbox mode',
        icon: '💡',
        category: 'gallery',
        xpReward: 30,
        rarity: 'Common',
        unlocked: false,
        condition: 'lightbox_views',
        requirements: {
            type: 'lightbox_opens',
            count: 3
        }
    },

    // Level-Based Achievements
    {
        id: 'rising-star',
        title: 'Rising Star',
        description: 'Reached Level 5 - you\'re gaining momentum!',
        icon: '⭐',
        category: 'progression',
        xpReward: 75,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'level_reached',
        requirements: {
            type: 'level',
            level: 5
        }
    },
    {
        id: 'experienced',
        title: 'Experienced Explorer',
        description: 'Reached Level 10 - you know your way around!',
        icon: '🌟',
        category: 'progression',
        xpReward: 150,
        rarity: 'Rare',
        unlocked: false,
        condition: 'level_reached',
        requirements: {
            type: 'level',
            level: 10
        }
    },
    {
        id: 'expert',
        title: 'Portfolio Expert',
        description: 'Reached Level 15 - true expertise achieved!',
        icon: '🏆',
        category: 'progression',
        xpReward: 250,
        rarity: 'Epic',
        unlocked: false,
        condition: 'level_reached',
        requirements: {
            type: 'level',
            level: 15
        }
    },
    {
        id: 'master',
        title: 'Master of The Legend',
        description: 'Reached Level 20 - absolute mastery!',
        icon: '👑',
        category: 'progression',
        xpReward: 500,
        rarity: 'Legendary',
        unlocked: false,
        condition: 'level_reached',
        requirements: {
            type: 'level',
            level: 20
        }
    },

    // Special & Hidden Achievements
    {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Visited the portfolio during late night hours',
        icon: '🦉',
        category: 'special',
        xpReward: 40,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'time_of_day',
        requirements: {
            type: 'visit_time',
            hours: [22, 23, 0, 1, 2, 3, 4, 5]
        }
    },
    {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Visited the portfolio in the early morning',
        icon: '🐦',
        category: 'special',
        xpReward: 40,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'time_of_day',
        requirements: {
            type: 'visit_time',
            hours: [5, 6, 7, 8]
        }
    },
    {
        id: 'mobile-explorer',
        title: 'Mobile Explorer',
        description: 'Explored the portfolio on a mobile device',
        icon: '📱',
        category: 'device',
        xpReward: 30,
        rarity: 'Common',
        unlocked: false,
        condition: 'device_type',
        requirements: {
            type: 'mobile_visit',
            count: 1
        }
    },
    {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Navigated through sections incredibly quickly',
        icon: '💨',
        category: 'special',
        xpReward: 35,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'navigation_speed',
        requirements: {
            type: 'fast_navigation',
            sections_per_minute: 3
        }
    },
    {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Filled out the contact form with perfect accuracy',
        icon: '✨',
        category: 'special',
        xpReward: 60,
        rarity: 'Rare',
        unlocked: false,
        condition: 'form_perfection',
        requirements: {
            type: 'perfect_form',
            no_validation_errors: true
        }
    },

    // Content Creator Achievements
    {
        id: 'quote-sharer',
        title: 'Quote Sharer',
        description: 'Shared a motivational quote on social media',
        icon: '📢',
        category: 'sharing',
        xpReward: 45,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'quote_share',
        requirements: {
            type: 'quote_shared',
            count: 1
        }
    },
    {
        id: 'brand-ambassador',
        title: 'Brand Ambassador',
        description: 'Shared the portfolio with others',
        icon: '🎖️',
        category: 'sharing',
        xpReward: 75,
        rarity: 'Rare',
        unlocked: false,
        condition: 'portfolio_share',
        requirements: {
            type: 'portfolio_shared',
            count: 1
        }
    },

    // Audio & Visual Achievements
    {
        id: 'audio-enthusiast',
        title: 'Audio Enthusiast',
        description: 'Enabled background music and sound effects',
        icon: '🎵',
        category: 'multimedia',
        xpReward: 35,
        rarity: 'Common',
        unlocked: false,
        condition: 'audio_enabled',
        requirements: {
            type: 'audio_interaction',
            enabled_music: true,
            enabled_sfx: true
        }
    },
    {
        id: 'visual-artist',
        title: 'Visual Artist',
        description: 'Appreciated the visual effects and animations',
        icon: '🎨',
        category: 'multimedia',
        xpReward: 30,
        rarity: 'Common',
        unlocked: false,
        condition: 'visual_interaction',
        requirements: {
            type: 'animation_interactions',
            count: 5
        }
    },

    // Technical Achievements
    {
        id: 'keyboard-ninja',
        title: 'Keyboard Ninja',
        description: 'Used keyboard shortcuts for navigation',
        icon: '⌨️',
        category: 'technical',
        xpReward: 50,
        rarity: 'Uncommon',
        unlocked: false,
        condition: 'keyboard_usage',
        requirements: {
            type: 'keyboard_shortcuts',
            count: 3
        }
    },
    {
        id: 'accessibility-champion',
        title: 'Accessibility Champion',
        description: 'Used accessibility features effectively',
        icon: '♿',
        category: 'accessibility',
        xpReward: 60,
        rarity: 'Rare',
        unlocked: false,
        condition: 'accessibility_usage',
        requirements: {
            type: 'accessibility_features',
            count: 2
        }
    },

    // Ultimate Achievements
    {
        id: 'completionist',
        title: 'Completionist',
        description: 'Unlocked 80% of all available achievements',
        icon: '🏅',
        category: 'ultimate',
        xpReward: 200,
        rarity: 'Epic',
        unlocked: false,
        condition: 'achievement_percentage',
        requirements: {
            type: 'achievements_unlocked',
            percentage: 80
        }
    },
    {
        id: 'legend-status',
        title: 'Legend Status',
        description: 'Achieved the ultimate status - you are now a Legend!',
        icon: '👑',
        category: 'ultimate',
        xpReward: 1000,
        rarity: 'Legendary',
        unlocked: false,
        condition: 'ultimate',
        requirements: {
            type: 'ultimate_achievement',
            level: 25,
            achievements_unlocked: 30,
            time_spent: 60,
            interactions: 100
        }
    }
];

// Helper functions for achievement management
const achievementHelpers = {
    // Get achievements by category
    getByCategory(category) {
        return achievementsData.filter(achievement => achievement.category === category);
    },

    // Get achievements by rarity
    getByRarity(rarity) {
        return achievementsData.filter(achievement => achievement.rarity === rarity);
    },

    // Get unlocked achievements
    getUnlocked() {
        return achievementsData.filter(achievement => achievement.unlocked);
    },

    // Get locked achievements
    getLocked() {
        return achievementsData.filter(achievement => !achievement.unlocked);
    },

    // Get achievement by ID
    getById(id) {
        return achievementsData.find(achievement => achievement.id === id);
    },

    // Calculate total possible XP
    getTotalPossibleXP() {
        return achievementsData.reduce((total, achievement) => total + achievement.xpReward, 0);
    },

    // Get achievements by condition type
    getByCondition(condition) {
        return achievementsData.filter(achievement => achievement.condition === condition);
    },

    // Sort achievements by XP reward
    sortByXP(ascending = false) {
        return [...achievementsData].sort((a, b) => {
            return ascending ? a.xpReward - b.xpReward : b.xpReward - a.xpReward;
        });
    },

    // Get rarity distribution
    getRarityDistribution() {
        const distribution = {};
        achievementsData.forEach(achievement => {
            distribution[achievement.rarity] = (distribution[achievement.rarity] || 0) + 1;
        });
        return distribution;
    },

    // Get category distribution
    getCategoryDistribution() {
        const distribution = {};
        achievementsData.forEach(achievement => {
            distribution[achievement.category] = (distribution[achievement.category] || 0) + 1;
        });
        return distribution;
    }
};

// Export the data and helpers
window.achievementsData = achievementsData;
window.achievementHelpers = achievementHelpers;

