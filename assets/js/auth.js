// Client-side authentication with improved security
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        // Bind methods to instance
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.updateLoginStatus = this.updateLoginStatus.bind(this);
        
        this.initializeEventListeners();
        this.updateLoginStatus();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateLoginStatus();
            // Add form submit event listeners
            const loginForm = document.querySelector('#login-modal form');
            const registerForm = document.querySelector('#register-modal form');
            
            if (loginForm) loginForm.addEventListener('submit', this.handleLogin);
            if (registerForm) registerForm.addEventListener('submit', this.handleRegister);
        });
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async handleRegister(event) {
        event.preventDefault();
        console.log('Registration attempt started');
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        console.log('Registration data:', { name, email });

        if (password !== confirmPassword) {
            this.showError('register-error', 'Passwords do not match');
            return;
        }

        if (this.users.some(u => u.email === email)) {
            this.showError('register-error', 'Email already registered');
            return;
        }

        try {
            const hashedPassword = await this.hashPassword(password);
            const user = {
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            this.users.push(user);
            localStorage.setItem('users', JSON.stringify(this.users));
            
            this.showSuccess('register-error', 'Registration successful! Please login.');
            setTimeout(() => {
                this.clearForm('register-form');
            closeRegisterModal();
            openLoginModal();
            console.log('Registration successful, redirecting to login');
            }, 2000);
        } catch (error) {
            this.showError('register-error', 'Registration failed. Please try again.');
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        console.log('Login attempt started');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        console.log('Email:', email);

        try {
            const hashedPassword = await this.hashPassword(password);
            console.log('Password hashed successfully');
            console.log('Current users:', this.users);
            const user = this.users.find(u => u.email === email && u.password === hashedPassword);
            console.log('User found:', user);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', user.name);
                document.body.classList.add('logged-in');
                this.clearForm('login-form');
                closeLoginModal();
                this.updateLoginStatus();
                console.log('Login successful');
            } else {
                this.showError('login-error', 'Invalid email or password');
            }
        } catch (error) {
            this.showError('login-error', 'Login failed. Please try again.');
        }
    }

    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        document.body.classList.remove('logged-in');
        this.updateLoginStatus();
    }

    updateLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userName = localStorage.getItem('userName');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userDisplay = document.getElementById('user-display');

        if (isLoggedIn && userName) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            userDisplay.textContent = `Welcome, ${userName}`;
            userDisplay.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            userDisplay.style.display = 'none';
        }
    }

    showError(elementId, message) {
        console.log('Showing error:', message);
        const errorElement = document.getElementById(elementId);
        if (!errorElement) {
            console.error(`Error element with id ${elementId} not found`);
            return;
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#ff4444';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            const errorElement = form.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }

    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.display = 'block';
        element.style.color = '#00ff00';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Modal handling functions
function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('register-modal').style.display = 'none';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('register-modal').style.display = 'flex';
    document.getElementById('login-modal').style.display = 'none';
}

function closeRegisterModal() {
    document.getElementById('register-modal').style.display = 'none';
}

function switchToRegister(event) {
    event.preventDefault();
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin(event) {
    event.preventDefault();
    closeRegisterModal();
    openLoginModal();
}

// Initialize authentication
const auth = new Auth();

// Bind event handlers to window for global access
window.handleLogin = (event) => auth.handleLogin(event);
window.handleRegister = (event) => auth.handleRegister(event);
window.handleLogout = () => auth.handleLogout();

// Add error handling for localStorage
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
} catch (e) {
    console.error('localStorage is not available:', e);
}
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openRegisterModal = openRegisterModal;
window.closeRegisterModal = closeRegisterModal;
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;