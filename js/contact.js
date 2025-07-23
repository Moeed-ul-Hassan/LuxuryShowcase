// Contact Form Handler with Validation and Submission

class ContactForm {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.validationRules = {};
        this.errors = {};
        
        this.init();
    }

    init() {
        this.setupForm();
        this.setupValidationRules();
        this.setupEventListeners();
        this.loadSavedData();
    }

    setupForm() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('#submit-btn');
        this.successMessage = document.getElementById('form-success');
        
        // Form fields
        this.fields = {
            name: this.form.querySelector('#name'),
            email: this.form.querySelector('#email'),
            company: this.form.querySelector('#company'),
            projectType: this.form.querySelector('#project-type'),
            budget: this.form.querySelector('#budget'),
            timeline: this.form.querySelector('#timeline'),
            message: this.form.querySelector('#message'),
            newsletter: this.form.querySelector('#newsletter')
        };
    }

    setupValidationRules() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (2-50 characters, letters only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            company: {
                required: false,
                maxLength: 100,
                message: 'Company name must be less than 100 characters'
            },
            projectType: {
                required: false,
                message: 'Please select a project type'
            },
            budget: {
                required: false,
                message: 'Please select a budget range'
            },
            timeline: {
                required: false,
                message: 'Please select a timeline'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Please enter a message (10-1000 characters)'
            }
        };
    }

    setupEventListeners() {
        if (!this.form) return;

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field && fieldName !== 'newsletter') {
                field.addEventListener('blur', () => {
                    this.validateField(fieldName);
                });

                field.addEventListener('input', () => {
                    this.clearFieldError(fieldName);
                });
            }
        });

        // Auto-save form data
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.addEventListener('input', () => {
                    this.saveFormData();
                });
            }
        });

        // Character counter for message field
        if (this.fields.message) {
            this.setupCharacterCounter();
        }

        // Enhanced UX features
        this.setupFormEnhancements();
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const rules = this.validationRules[fieldName];
        
        if (!field || !rules) return true;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }

        // Length validation
        if (isValid && value) {
            if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} must be less than ${rules.maxLength} characters`;
            }

            // Pattern validation
            if (rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.message;
            }
        }

        if (isValid) {
            this.clearFieldError(fieldName);
            delete this.errors[fieldName];
        } else {
            this.showFieldError(fieldName, errorMessage);
            this.errors[fieldName] = errorMessage;
        }

        return isValid;
    }

    validateForm() {
        this.errors = {};
        let isValid = true;

        Object.keys(this.validationRules).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            company: 'Company',
            projectType: 'Project Type',
            budget: 'Budget',
            timeline: 'Timeline',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        const field = this.fields[fieldName];
        if (field) {
            field.classList.add('error');
        }
    }

    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }

        const field = this.fields[fieldName];
        if (field) {
            field.classList.remove('error');
        }
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            this.showFormErrors();
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonState('loading');

        try {
            const formData = this.getFormData();
            const response = await this.submitForm(formData);

            if (response.success) {
                this.showSuccessMessage();
                this.clearForm();
                this.clearSavedData();
                
                // Play success sound
                if (window.audioSystem) {
                    window.audioSystem.playSuccessSound();
                }

                // Update XP
                if (window.gamificationSystem) {
                    window.gamificationSystem.addXP(50, 'Contact Form Submission');
                    window.gamificationSystem.unlockAchievement('first-contact');
                }

                // Send analytics event
                this.trackFormSubmission(formData);

            } else {
                throw new Error(response.message || 'Submission failed');
            }

        } catch (error) {
            this.showSubmissionError(error.message);
            
            // Play error sound
            if (window.audioSystem) {
                window.audioSystem.playErrorSound();
            }
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonState('normal');
        }
    }

    getFormData() {
        const formData = {};
        
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                if (field.type === 'checkbox') {
                    formData[fieldName] = field.checked;
                } else {
                    formData[fieldName] = field.value.trim();
                }
            }
        });

        // Add metadata
        formData.timestamp = new Date().toISOString();
        formData.userAgent = navigator.userAgent;
        formData.referrer = document.referrer;
        formData.source = 'portfolio_website';

        return formData;
    }

    async submitForm(formData) {
        // Submit to server
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    setSubmitButtonState(state) {
        if (!this.submitBtn) return;

        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        switch (state) {
            case 'loading':
                this.submitBtn.disabled = true;
                this.submitBtn.classList.add('loading');
                if (btnText) btnText.style.display = 'none';
                if (btnLoading) btnLoading.style.display = 'inline-flex';
                break;
            case 'normal':
            default:
                this.submitBtn.disabled = false;
                this.submitBtn.classList.remove('loading');
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
                break;
        }
    }

    showSuccessMessage() {
        if (this.successMessage) {
            this.form.style.display = 'none';
            this.successMessage.classList.add('show');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideSuccessMessage();
            }, 5000);
        }
    }

    hideSuccessMessage() {
        if (this.successMessage) {
            this.successMessage.classList.remove('show');
            this.form.style.display = 'block';
        }
    }

    showSubmissionError(message) {
        // Create or update error notification
        let errorNotification = document.querySelector('.form-error-notification');
        
        if (!errorNotification) {
            errorNotification = document.createElement('div');
            errorNotification.className = 'form-error-notification';
            document.body.appendChild(errorNotification);
        }

        errorNotification.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="error-text">
                    <h4>Submission Failed</h4>
                    <p>${message}</p>
                </div>
                <button class="error-close">&times;</button>
            </div>
        `;

        errorNotification.classList.add('show');

        // Close button
        const closeBtn = errorNotification.querySelector('.error-close');
        closeBtn.addEventListener('click', () => {
            errorNotification.classList.remove('show');
        });

        // Auto-hide after 8 seconds
        setTimeout(() => {
            errorNotification.classList.remove('show');
        }, 8000);
    }

    showFormErrors() {
        // Scroll to first error
        const firstErrorField = Object.keys(this.errors)[0];
        if (firstErrorField && this.fields[firstErrorField]) {
            this.fields[firstErrorField].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            this.fields[firstErrorField].focus();
        }

        // Shake form
        if (this.form) {
            this.form.classList.add('shake-error');
            setTimeout(() => {
                this.form.classList.remove('shake-error');
            }, 500);
        }
    }

    clearForm() {
        if (!this.form) return;

        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = false;
                } else {
                    field.value = '';
                }
                this.clearFieldError(fieldName);
            }
        });
    }

    setupCharacterCounter() {
        const messageField = this.fields.message;
        if (!messageField) return;

        const counter = document.createElement('div');
        counter.className = 'character-counter';
        messageField.parentNode.appendChild(counter);

        const updateCounter = () => {
            const current = messageField.value.length;
            const max = this.validationRules.message.maxLength;
            
            counter.textContent = `${current}/${max}`;
            counter.className = `character-counter ${current > max * 0.9 ? 'warning' : ''}`;
        };

        messageField.addEventListener('input', updateCounter);
        updateCounter();
    }

    setupFormEnhancements() {
        // Add form progress indicator
        this.createFormProgress();

        // Add smart field suggestions
        this.setupSmartSuggestions();

        // Add form auto-completion
        this.setupAutoCompletion();

        // Add estimated response time
        this.showResponseTime();
    }

    createFormProgress() {
        const progress = document.createElement('div');
        progress.className = 'form-progress';
        progress.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Form completion: <span class="progress-percentage">0%</span></div>
        `;

        if (this.form) {
            this.form.insertBefore(progress, this.form.firstChild);
        }

        // Update progress on field changes
        const updateProgress = () => {
            const totalFields = Object.keys(this.validationRules).length;
            const filledFields = Object.keys(this.fields).filter(fieldName => {
                const field = this.fields[fieldName];
                return field && field.value.trim() !== '';
            }).length;

            const percentage = Math.round((filledFields / totalFields) * 100);
            
            const progressFill = progress.querySelector('.progress-fill');
            const progressPercentage = progress.querySelector('.progress-percentage');
            
            if (progressFill) progressFill.style.width = percentage + '%';
            if (progressPercentage) progressPercentage.textContent = percentage + '%';
        };

        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.addEventListener('input', updateProgress);
            }
        });
    }

    setupSmartSuggestions() {
        // Budget-based timeline suggestions
        if (this.fields.budget && this.fields.timeline) {
            this.fields.budget.addEventListener('change', () => {
                this.suggestTimeline();
            });
        }

        // Project type-based suggestions
        if (this.fields.projectType && this.fields.message) {
            this.fields.projectType.addEventListener('change', () => {
                this.suggestMessageTemplate();
            });
        }
    }

    suggestTimeline() {
        const budget = this.fields.budget.value;
        const timelineField = this.fields.timeline;
        
        if (!budget || timelineField.value) return;

        const suggestions = {
            '1k-5k': '1-2weeks',
            '5k-10k': '1month',
            '10k-25k': '2-3months',
            '25k+': '2-3months'
        };

        if (suggestions[budget]) {
            timelineField.value = suggestions[budget];
            this.showSuggestionNotification('Timeline suggested based on budget');
        }
    }

    suggestMessageTemplate() {
        const projectType = this.fields.projectType.value;
        const messageField = this.fields.message;
        
        if (!projectType || messageField.value.trim()) return;

        const templates = {
            'backend': 'I need help with backend development for my project. The requirements include API development, database design, and server architecture.',
            'ai': 'I\'m looking for AI integration services for my application. I need assistance with machine learning implementation and data analysis.',
            'fullstack': 'I need a full-stack developer to build a complete web application from frontend to backend.',
            'automation': 'I want to automate some of my business processes. Looking for custom automation solutions.',
            'consultation': 'I need technical consultation for my project. Looking for expert advice on architecture and best practices.'
        };

        if (templates[projectType]) {
            messageField.value = templates[projectType];
            this.showSuggestionNotification('Message template added - feel free to customize it');
        }
    }

    showSuggestionNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'suggestion-notification';
        notification.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <span>${message}</span>
        `;

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
        }, 3000);
    }

    setupAutoCompletion() {
        // Save and restore form data from localStorage
        const savedData = this.getSavedFormData();
        if (savedData) {
            Object.keys(savedData).forEach(fieldName => {
                const field = this.fields[fieldName];
                if (field && savedData[fieldName]) {
                    if (field.type === 'checkbox') {
                        field.checked = savedData[fieldName];
                    } else {
                        field.value = savedData[fieldName];
                    }
                }
            });
        }
    }

    saveFormData() {
        const formData = {};
        
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                if (field.type === 'checkbox') {
                    formData[fieldName] = field.checked;
                } else {
                    formData[fieldName] = field.value;
                }
            }
        });

        try {
            localStorage.setItem('contactFormData', JSON.stringify(formData));
        } catch (error) {
            console.warn('Failed to save form data:', error);
        }
    }

    getSavedFormData() {
        try {
            const saved = localStorage.getItem('contactFormData');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Failed to load saved form data:', error);
            return null;
        }
    }

    loadSavedData() {
        const savedData = this.getSavedFormData();
        if (!savedData) return;

        // Show restore notification
        const notification = document.createElement('div');
        notification.className = 'restore-notification';
        notification.innerHTML = `
            <div class="restore-content">
                <i class="fas fa-history"></i>
                <span>We found some previously entered information. Would you like to restore it?</span>
                <div class="restore-actions">
                    <button class="restore-yes">Yes, restore</button>
                    <button class="restore-no">No, thanks</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 1000);

        // Handle restore actions
        notification.querySelector('.restore-yes').addEventListener('click', () => {
            this.restoreFormData(savedData);
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        });

        notification.querySelector('.restore-no').addEventListener('click', () => {
            this.clearSavedData();
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 10000);
    }

    restoreFormData(data) {
        Object.keys(data).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field && data[fieldName]) {
                if (field.type === 'checkbox') {
                    field.checked = data[fieldName];
                } else {
                    field.value = data[fieldName];
                }
            }
        });
    }

    clearSavedData() {
        try {
            localStorage.removeItem('contactFormData');
        } catch (error) {
            console.warn('Failed to clear saved form data:', error);
        }
    }

    showResponseTime() {
        const responseTimeEl = document.createElement('div');
        responseTimeEl.className = 'response-time-info';
        responseTimeEl.innerHTML = `
            <i class="fas fa-clock"></i>
            <span>Typical response time: Within 2 hours</span>
        `;

        if (this.form) {
            this.form.appendChild(responseTimeEl);
        }
    }

    trackFormSubmission(formData) {
        // Send analytics data (if analytics is available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                event_category: 'Contact',
                event_label: formData.projectType || 'unknown',
                value: 1
            });
        }

        // Track in localStorage for internal analytics
        try {
            const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            submissions.push({
                timestamp: formData.timestamp,
                projectType: formData.projectType,
                budget: formData.budget
            });
            
            // Keep only last 10 submissions
            localStorage.setItem('formSubmissions', JSON.stringify(submissions.slice(-10)));
        } catch (error) {
            console.warn('Failed to track form submission:', error);
        }
    }

    // Public method to get form statistics
    getFormStats() {
        try {
            const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            return {
                totalSubmissions: submissions.length,
                recentSubmissions: submissions.filter(sub => 
                    new Date(sub.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length,
                popularProjectTypes: this.getMostPopularProjectTypes(submissions)
            };
        } catch {
            return { totalSubmissions: 0, recentSubmissions: 0, popularProjectTypes: [] };
        }
    }

    getMostPopularProjectTypes(submissions) {
        const counts = {};
        submissions.forEach(sub => {
            if (sub.projectType) {
                counts[sub.projectType] = (counts[sub.projectType] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));
    }
}

// Initialize contact form when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});

// Export for global access
window.ContactForm = ContactForm;
