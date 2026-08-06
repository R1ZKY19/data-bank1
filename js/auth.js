// auth.js - Authentication Management
import { CONFIG } from './config.js';
import { api } from './api.js';
import { showToast, showAlert } from './utils.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimer = null;
        this.lastActivity = Date.now();
        this.setupActivityListeners();
        this.checkAutoLogin();
    }

    setupActivityListeners() {
        const events = ['click', 'keydown', 'scroll', 'mousemove'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
                this.resetSessionTimer();
            });
        });
    }

    resetSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        this.sessionTimer = setTimeout(() => {
            if (this.isLoggedIn()) {
                this.sessionTimeout();
            }
        }, CONFIG.AUTO_LOGOUT_TIME);
    }

    async sessionTimeout() {
        await showAlert('warning', 'Sesi Habis', 'Anda telah tidak aktif selama 30 menit. Silakan login kembali.');
        await this.logout();
        window.location.reload();
    }

    async checkAutoLogin() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const data = await api.validateSession();
                if (data.valid) {
                    this.currentUser = data.user;
                    this.showDashboard();
                    this.resetSessionTimer();
                    return true;
                }
            } catch (error) {
                console.error('Session validation failed:', error);
            }
        }
        this.showLogin();
        return false;
    }

    async login(username, password) {
        try {
            const data = await api.login(username, password);
            if (data.success) {
                this.currentUser = data.user;
                this.showDashboard();
                this.resetSessionTimer();
                showToast('success', 'Login Berhasil', `Selamat datang, ${data.user.name}!`);
                return true;
            }
            return false;
        } catch (error) {
            showToast('error', 'Login Gagal', error.message || 'Periksa username dan password Anda.');
            return false;
        }
    }

    async logout() {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.currentUser = null;
            api.setToken(null);
            if (this.sessionTimer) {
                clearTimeout(this.sessionTimer);
            }
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('dashboardPage').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'block';
        this.updateUserInfo();
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userRole').textContent = this.currentUser.role.toUpperCase();
            document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
        }
    }

    isLoggedIn() {
        return !!this.currentUser && !!api.token;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        const permissions = CONFIG.ROLE_PERMISSIONS[this.currentUser.role];
        return permissions && permissions[permission] === true;
    }

    getRole() {
        return this.currentUser ? this.currentUser.role : null;
    }
}

export const auth = new AuthManager();
