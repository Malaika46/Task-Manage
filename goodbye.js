// Goodbye Page JavaScript

class GoodbyeManager {
    constructor() {
        this.sessionData = null;
        this.motivationalQuotes = [
            {
                quote: "The way to get started is to quit talking and begin doing.",
                author: "Walt Disney"
            },
            {
                quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill"
            },
            {
                quote: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt"
            },
            {
                quote: "It is during our darkest moments that we must focus to see the light.",
                author: "Aristotle"
            },
            {
                quote: "The only impossible journey is the one you never begin.",
                author: "Tony Robbins"
            },
            {
                quote: "In the middle of difficulty lies opportunity.",
                author: "Albert Einstein"
            },
            {
                quote: "Believe you can and you're halfway there.",
                author: "Theodore Roosevelt"
            },
            {
                quote: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            }
        ];
        
        this.init();
    }

    init() {
        this.loadSessionData();
        this.setupEventListeners();
        this.displayRandomQuote();
        this.updateSessionStats();
        this.startAnimations();
        this.createConfetti();
    }

    loadSessionData() {
        // Try to get session data from localStorage
        const currentSession = localStorage.getItem('currentSession');
        
        if (currentSession) {
            try {
                this.sessionData = JSON.parse(currentSession);
            } catch (error) {
                console.log('No valid session data found');
            }
        }
        
        // Generate demo session data if none exists
        if (!this.sessionData) {
            this.sessionData = this.generateDemoSessionData();
        }
    }

    generateDemoSessionData() {
        return {
            fullName: 'User',
            email: 'user@example.com',
            loginTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
            sessionDuration: 45,
            tasksCompleted: Math.floor(Math.random() * 5) + 1,
            productivityScore: Math.floor(Math.random() * 30) + 70
        };
    }

    setupEventListeners() {
        // Back to login button
        const backToLoginBtn = document.getElementById('backToLoginBtn');
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => this.handleBackToLogin());
        }

        // Share progress button
        const shareProgressBtn = document.getElementById('shareProgressBtn');
        if (shareProgressBtn) {
            shareProgressBtn.addEventListener('click', () => this.handleShareProgress());
        }

        // Toast close button
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }

        // Social links (demo functionality)
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSocialShare(e));
        });
    }

    displayRandomQuote() {
        const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        
        const quoteElement = document.getElementById('motivationalQuote');
        const authorElement = document.getElementById('quoteAuthor');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = `"${randomQuote.quote}"`;
            authorElement.textContent = `- ${randomQuote.author}`;
        }
    }

    updateSessionStats() {
        // Calculate session duration
        let sessionDuration = 45; // Default
        if (this.sessionData.loginTime) {
            const loginTime = new Date(this.sessionData.loginTime);
            const currentTime = new Date();
            sessionDuration = Math.floor((currentTime - loginTime) / (1000 * 60)); // in minutes
        }

        // Update session time
        const sessionTimeElement = document.getElementById('sessionTime');
        if (sessionTimeElement) {
            sessionTimeElement.textContent = this.formatSessionTime(sessionDuration);
        }

        // Update tasks completed
        const tasksCompletedElement = document.getElementById('tasksCompleted');
        if (tasksCompletedElement) {
            const tasksCompleted = this.sessionData.tasksCompleted || Math.floor(Math.random() * 5) + 1;
            this.animateNumber(tasksCompletedElement, tasksCompleted);
        }

        // Update productivity score
        const productivityScoreElement = document.getElementById('productivityScore');
        if (productivityScoreElement) {
            const productivityScore = this.sessionData.productivityScore || Math.floor(Math.random() * 30) + 70;
            this.animateNumber(productivityScoreElement, productivityScore, true);
        }
    }

    formatSessionTime(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;
        }
    }

    animateNumber(element, targetValue, isPercentage = false) {
        const startValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = isPercentage ? `${currentValue}%` : currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    startAnimations() {
        // Animate floating elements
        this.animateFloatingElements();
        
        // Start background shape animations
        this.animateBackgroundShapes();
        
        // Add entrance animations with delays
        this.addEntranceAnimations();
    }

    animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            // Random movement animation
            setInterval(() => {
                const randomX = Math.random() * 20 - 10;
                const randomY = Math.random() * 20 - 10;
                const randomRotation = Math.random() * 360;
                
                element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
            }, 3000 + index * 500);
        });
    }

    animateBackgroundShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        
        shapes.forEach((shape, index) => {
            // Add random delays and speeds
            const delay = Math.random() * 2000;
            const duration = 6000 + Math.random() * 4000;
            
            setTimeout(() => {
                shape.style.animationDuration = `${duration}ms`;
            }, delay);
        });
    }

    addEntranceAnimations() {
        const animatedElements = [
            '.logo-section',
            '.goodbye-message',
            '.session-stats',
            '.quote-section',
            '.action-buttons',
            '.footer-message'
        ];
        
        animatedElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    createConfetti() {
        // Create confetti animation
        const confettiContainer = document.getElementById('confettiContainer');
        if (!confettiContainer) return;
        
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(confettiContainer, colors);
            }, i * 100);
        }
        
        // Stop creating confetti after 5 seconds
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    createConfettiPiece(container, colors) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 2 + 2; // 2-4 seconds
        const size = Math.random() * 8 + 4; // 4-12px
        
        confetti.style.left = `${left}%`;
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.animationDuration = `${animationDuration}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(confetti);
        
        // Remove confetti piece after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, (animationDuration + 0.5) * 1000);
    }

    // Event handlers
    handleBackToLogin() {
        // Clear any remaining session data
        localStorage.removeItem('currentSession');
        
        // Show loading toast
        this.showToast('Redirecting to login...', 'info');
        
        // Add exit animation
        const container = document.querySelector('.goodbye-container');
        if (container) {
            container.style.transform = 'translateY(-50px)';
            container.style.opacity = '0';
        }
        
        // Redirect after animation
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }

    handleShareProgress() {
        const shareText = this.generateShareText();
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'My TaskFlow Progress',
                text: shareText,
                url: window.location.origin
            }).then(() => {
                this.showToast('Progress shared successfully!', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    generateShareText() {
        const tasksCompleted = document.getElementById('tasksCompleted')?.textContent || '0';
        const sessionTime = document.getElementById('sessionTime')?.textContent || '0 min';
        const productivityScore = document.getElementById('productivityScore')?.textContent || '0%';
        
        return `Just completed a productive session on TaskFlow! 🚀\n\n` +
               `📊 Session Stats:\n` +
               `⏱️ Time: ${sessionTime}\n` +
               `✅ Tasks completed: ${tasksCompleted}\n` +
               `📈 Productivity score: ${productivityScore}\n\n` +
               `#productivity #taskmanagement #goals`;
    }

    fallbackShare(shareText) {
        // Copy to clipboard as fallback
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Progress copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Unable to share progress', 'error');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast('Progress copied to clipboard!', 'success');
            } catch (err) {
                this.showToast('Unable to share progress', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    handleSocialShare(e) {
        e.preventDefault();
        
        const platform = this.getSocialPlatform(e.currentTarget);
        const shareText = this.generateShareText();
        const shareUrl = encodeURIComponent(window.location.origin);
        const encodedText = encodeURIComponent(shareText);
        
        let socialUrl = '';
        
        switch (platform) {
            case 'twitter':
                socialUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${shareUrl}`;
                break;
            case 'facebook':
                socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedText}`;
                break;
            case 'linkedin':
                socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&summary=${encodedText}`;
                break;
            case 'instagram':
                this.showToast('Instagram sharing requires the mobile app', 'info');
                return;
            default:
                this.showToast('Social sharing coming soon!', 'info');
                return;
        }
        
        if (socialUrl) {
            window.open(socialUrl, '_blank', 'width=600,height=400');
        }
    }

    getSocialPlatform(element) {
        const icon = element.querySelector('i');
        if (icon.classList.contains('fa-twitter')) return 'twitter';
        if (icon.classList.contains('fa-facebook')) return 'facebook';
        if (icon.classList.contains('fa-linkedin')) return 'linkedin';
        if (icon.classList.contains('fa-instagram')) return 'instagram';
        return 'unknown';
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastMessage.textContent = message;
        
        // Remove existing type classes and add new one
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            this.hideToast();
        }, 4000);
    }

    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('show');
        }
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // Save session summary for potential future reference
    saveSessionSummary() {
        const summary = {
            date: new Date().toISOString(),
            sessionTime: document.getElementById('sessionTime')?.textContent,
            tasksCompleted: document.getElementById('tasksCompleted')?.textContent,
            productivityScore: document.getElementById('productivityScore')?.textContent,
            user: this.sessionData?.fullName || 'Anonymous'
        };
        
        const sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
        sessionHistory.push(summary);
        
        // Keep only last 10 sessions
        if (sessionHistory.length > 10) {
            sessionHistory.shift();
        }
        
        localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
    }
}

// Initialize goodbye manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const goodbyeManager = new GoodbyeManager();
    
    // Save session summary
    goodbyeManager.saveSessionSummary();
    
    // Show welcome message after animations
    setTimeout(() => {
        goodbyeManager.showToast('Thank you for using TaskFlow!', 'success');
    }, 3000);
});

// Handle page visibility to pause/resume animations
document.addEventListener('visibilitychange', () => {
    const floatingElements = document.querySelectorAll('.floating-element, .floating-shape');
    
    floatingElements.forEach(element => {
        if (document.hidden) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
});

