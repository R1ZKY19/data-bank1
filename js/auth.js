/**
 * Authentication Module
 * Handles login, logout, session management, and RBAC
 */

const AUTH = {
    SESSION_KEY: 'bankSession',
    AUTO_LOGOUT_TIME: 30 * 60 * 1000, // 30 minutes
    API_URL: 'https://script.google.com/macros/s/AKfycbwgULfYkvdWKYft17Gw57cRRM8_cIX0k3WPJhr0eF6YG6MhewTK_9e647H-KkDRQ2Fl/exec', // Google Apps Script URL
    
    /**
     * Initialize authentication
     */
    init() {
        this.checkSession();
        this.setupAutoLogout();
        this.setupLogoutHandler();
    },
    
    /**
     * Check if user is authenticated
     */
    checkSession() {
        const session = this.getSession();
        
        if (!session) {
            this.redirectToLogin();
            return false;
        }
        
        // Check session expiry
        if (Date.now() - session.timestamp > this.AUTO_LOGOUT_TIME) {
            this.logout();
            return false;
        }
        
        // Update session timestamp
        session.timestamp = Date.now();
        this.saveSession(session);
        
        // Update UI with user info
        this.updateUI(session);
        
        return true;
    },
    
    /**
     * Get current session
     */
    getSession() {
        try {
            const session = localStorage.getItem(this.SESSION_KEY) || 
                          sessionStorage.getItem(this.SESSION_KEY);
            return session ? JSON.parse(session) : null;
        } catch {
            return null;
        }
    },
    
    /**
     * Save session
     */
    saveSession(session) {
        const storage = session.remember ? localStorage : sessionStorage;
        storage.setItem(this.SESSION_KEY, JSON.stringify(session));
    },
    
    /**
     * Clear session
     */
    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
    },
    
    /**
     * Update UI with user info
     */
    updateUI(session) {
        const { user, role } = session;
        
        const nameEl = document.getElementById('userName');
        const roleEl = document.getElementById('userRole');
        const initialEl = document.getElementById('userInitial');
        
        if (nameEl) nameEl.textContent = user;
        if (roleEl) roleEl.textContent = role;
        if (initialEl) initialEl.textContent = user.charAt(0).toUpperCase();
        
        // Apply role-based visibility
        this.applyRoleBasedVisibility(role);
    },
    
    /**
     * Apply RBAC visibility
     */
    applyRoleBasedVisibility(role) {
        // Hide/show elements based on role
        const adminOnly = document.querySelectorAll('.admin-only');
        const csOnly = document.querySelectorAll('.cs-only');
        const captainOnly = document.querySelectorAll('.captain-only');
        const kasirOnly = document.querySelectorAll('.kasir-only');
        
        // Map role to permissions
        const permissions = {
            LEADER: { showAdmin: true, showCS: true, showCaptain: true, showKasir: true },
            CS: { showAdmin: false, showCS: true, showCaptain: false, showKasir: false },
            KAPTEN: { showAdmin: false, showCS: true, showCaptain: true, showKasir: false },
            KASIR: { showAdmin: false, showCS: false, showCaptain: false, showKasir: true }
        };
        
        const perms = permissions[role] || permissions.KASIR;
        
        adminOnly.forEach(el => el.style.display = perms.showAdmin ? '' : 'none');
        csOnly.forEach(el => el.style.display = perms.showCS ? '' : 'none');
        captainOnly.forEach(el => el.style.display = perms.showCaptain ? '' : 'none');
        kasirOnly.forEach(el => el.style.display = perms.showKasir ? '' : 'none');
    },
    
    /**
     * Check if user has specific role
     */
    hasRole(role) {
        const session = this.getSession();
        return session && session.role === role;
    },
    
    /**
     * Check if user has at least one of the roles
     */
    hasAnyRole(roles) {
        const session = this.getSession();
        return session && roles.includes(session.role);
    },
    
    /**
     * Setup auto logout
     */
    setupAutoLogout() {
        let timeoutId;
        
        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (this.getSession()) {
                    this.logout('Sesi Anda telah berakhir karena tidak aktif');
                }
            }, this.AUTO_LOGOUT_TIME);
        };
        
        // Reset timer on user activity
        ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, resetTimer);
        });
        
        resetTimer();
    },
    
    /**
     * Setup logout handler
     */
    setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout('Anda telah berhasil logout');
            });
        }
    },
    
    /**
     * Logout
     */
    logout(message = 'Anda telah logout') {
        this.clearSession();
        
        // Show toast notification
        if (window.showToast) {
            window.showToast('info', 'Logout', message);
        }
        
        this.redirectToLogin();
    },
    
    /**
     * Redirect to login page
     */
    redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    },
    
    /**
     * Redirect to dashboard
     */
    redirectToDashboard() {
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    },
    
    /**
     * Login user
     */
    async login(username, password, remember = false) {
        try {
            // In production, call Google Apps Script API
            const response = await this.authenticateAPI(username, password);
            
            if (response.success) {
                const session = {
                    token: response.token,
                    user: response.user,
                    role: response.role,
                    remember: remember,
                    timestamp: Date.now()
                };
                
                this.saveSession(session);
                this.updateUI(session);
                
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Terjadi kesalahan saat login' };
        }
    },
    
    /**
     * Authenticate with API
     */
    async authenticateAPI(username, password) {
        // This should be replaced with actual Google Apps Script API call
        // For demo purposes, we'll use mock data
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo credentials
                const users = {
                    'admin': { password: 'admin123', name: 'Administrator', role: 'LEADER' },
                    'cs': { password: 'cs123', name: 'Customer Service', role: 'CS' },
                    'kapten': { password: 'kapten123', name: 'Kapten', role: 'KAPTEN' },
                    'kasir': { password: 'kasir123', name: 'Kasir', role: 'KASIR' }
                };
                
                const user = users[username];
                if (user && user.password === password) {
                    resolve({
                        success: true,
                        token: 'token_' + Date.now(),
                        user: user.name,
                        role: user.role
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Username atau password salah'
                    });
                }
            }, 800);
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AUTH;
}
