// Authentication JavaScript for Signup and Login pages

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredData();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Check which page we're on and setup appropriate listeners
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'signup.html' || currentPage === '') {
            this.setupSignupListeners();
        } else if (currentPage === 'login.html') {
            this.setupLoginListeners();
        }

        // Common listeners
        this.setupToastListeners();
    }

    setupSignupListeners() {
        const signupForm = document.getElementById('signupForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility(passwordInput, togglePassword));
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.checkPasswordStrength(passwordInput.value));
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
        }

        // Real-time validation
        const inputs = ['fullName', 'email', 'password', 'confirmPassword'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => this.validateField(inputId));
                input.addEventListener('input', () => this.clearError(inputId));
            }
        });
    }

    setupLoginListeners() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('loginPassword');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility(passwordInput, togglePassword));
        }

        // Real-time validation
        const inputs = ['loginEmail', 'loginPassword'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => this.validateField(inputId));
                input.addEventListener('input', () => this.clearError(inputId));
            }
        });

        // Social login buttons (demo functionality)
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
    }

    setupToastListeners() {
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
    }

    // Signup functionality
    async handleSignup(e) {
        e.preventDefault();
        
        const formData = this.getFormData('signupForm');
        const isValid = this.validateSignupForm(formData);
        
        if (!isValid) {
            this.showToast('Please fix the errors below', 'error');
            return;
        }

        this.showLoading('signupBtn');
        
        try {
            // Simulate API call
            await this.simulateApiCall(2000);
            
            // Store user data
            this.storeUserData(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            this.showToast('Signup failed. Please try again.', 'error');
        } finally {
            this.hideLoading('signupBtn');
        }
    }

    // Login functionality
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = this.getFormData('loginForm');
        const isValid = this.validateLoginForm(formData);
        
        if (!isValid) {
            this.showToast('Please fix the errors below', 'error');
            return;
        }

        this.showLoading('loginBtn');
        
        try {
            // Simulate API call
            await this.simulateApiCall(1500);
            
            // Validate credentials
            const isAuthenticated = this.validateCredentials(formData);
            
            if (isAuthenticated) {
                // Store session
                this.createSession(formData);
                
                // Show success message
                this.showSuccessMessage();
                
                // Redirect to main page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showToast('Invalid email or password', 'error');
            }
            
        } catch (error) {
            this.showToast('Login failed. Please try again.', 'error');
        } finally {
            this.hideLoading('loginBtn');
        }
    }

    // Form validation
    validateSignupForm(formData) {
        let isValid = true;
        
        // Full name validation
        if (!formData.fullName || formData.fullName.length < 2) {
            this.showError('fullNameError', 'Full name must be at least 2 characters');
            isValid = false;
        }
        
        // Email validation
        if (!this.isValidEmail(formData.email)) {
            this.showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation
        if (!this.isValidPassword(formData.password)) {
            this.showError('passwordError', 'Password must be at least 8 characters with uppercase, lowercase, and number');
            isValid = false;
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        

        return isValid;
    }

    validateLoginForm(formData) {
        let isValid = true;
        
        // Email validation
        if (!this.isValidEmail(formData.email)) {
            this.showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation
        if (!formData.password || formData.password.length < 6) {
            this.showError('passwordError', 'Password is required');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        const value = input.value.trim();
        let errorMessage = '';
        
        switch (fieldId) {
            case 'fullName':
                if (!value || value.length < 2) {
                    errorMessage = 'Full name must be at least 2 characters';
                }
                break;
            case 'email':
            case 'loginEmail':
                if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!this.isValidPassword(value)) {
                    errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, and number';
                }
                break;
            case 'loginPassword':
                if (!value || value.length < 6) {
                    errorMessage = 'Password is required';
                }
                break;
            case 'confirmPassword':
                const passwordValue = document.getElementById('password')?.value;
                if (value !== passwordValue) {
                    errorMessage = 'Passwords do not match';
                }
                break;
        }
        
        if (errorMessage) {
            this.showError(fieldId + 'Error', errorMessage);
        } else {
            this.clearError(fieldId);
        }
    }

    validatePasswordMatch() {
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
        } else {
            this.clearError('confirmPassword');
        }
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let strengthLabel = 'Weak';
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        strengthBar.className = 'strength-fill';
        
        if (strength <= 1) {
            strengthBar.classList.add('weak');
            strengthLabel = 'Weak';
        } else if (strength <= 2) {
            strengthBar.classList.add('fair');
            strengthLabel = 'Fair';
        } else if (strength <= 3) {
            strengthBar.classList.add('good');
            strengthLabel = 'Good';
        } else {
            strengthBar.classList.add('strong');
            strengthLabel = 'Strong';
        }
        
        strengthText.textContent = `Password strength: ${strengthLabel}`;
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key === 'agreeTerms' || key === 'rememberMe') {
                data[key] = form.querySelector(`[name="${key}"]`).checked;
            } else {
                data[key] = value.trim();
            }
        }
        
        return data;
    }

    togglePasswordVisibility(passwordInput, toggleButton) {
        const icon = toggleButton.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // Error handling
    showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Loading states
    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('loading');
            button.disabled = true;
        }
    }

    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Success message
    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.add('show');
        }
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
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('show');
        }
    }

    // Data storage
    storeUserData(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        
        // Store user (without password for security)
        const userToStore = {
            id: Date.now(),
            fullName: userData.fullName,
            email: userData.email,
            password: this.hashPassword(userData.password), // Simple hash for demo
            createdAt: new Date().toISOString()
        };
        
        users.push(userToStore);
        localStorage.setItem('users', JSON.stringify(users));
    }

    validateCredentials(loginData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => 
            user.email === loginData.email && 
            user.password === this.hashPassword(loginData.password)
        );
        
        return !!user;
    }

    createSession(loginData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => user.email === loginData.email);
        
        if (user) {
            const session = {
                userId: user.id,
                email: user.email,
                fullName: user.fullName,
                loginTime: new Date().toISOString(),
                rememberMe: loginData.rememberMe || false
            };
            
            localStorage.setItem('currentSession', JSON.stringify(session));
            
            if (loginData.rememberMe) {
                localStorage.setItem('rememberedEmail', loginData.email);
            }
        }
    }

    loadStoredData() {
        // Load remembered email for login page
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const emailInput = document.getElementById('loginEmail');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (rememberedEmail && emailInput) {
            emailInput.value = rememberedEmail;
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }

    checkAuthState() {
        const currentSession = localStorage.getItem('currentSession');
        const currentPage = window.location.pathname.split('/').pop();
        
        // If user is already logged in and tries to access signup/login, redirect to main page
        if (currentSession && (currentPage === 'signup.html' || currentPage === 'login.html' || currentPage === '')) {
            // Don't redirect immediately, let user see the page first
            // window.location.href = 'index.html';
        }
    }

    // Social login (demo functionality)
    handleSocialLogin(e) {
        e.preventDefault();
        const provider = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'GitHub';
        this.showToast(`${provider} login is not implemented in this demo`, 'info');
    }

    // Simple hash function for demo (not secure for production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Simulate API call
    simulateApiCall(delay = 1000) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add some demo users for testing
document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0) {
        // Add demo user
        const demoUsers = [
            {
                id: 1,
                fullName: 'John Doe',
                email: 'john@example.com',
                password: new AuthManager().hashPassword('Password123'),
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
});

