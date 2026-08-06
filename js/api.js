// api.js - API Service
import { CONFIG } from './config.js';

class ApiService {
    constructor() {
        this.baseUrl = CONFIG.API_URL;
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}?action=${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Terjadi kesalahan');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.message || data.error);
        }

        return data;
    }

    // Auth
    async login(username, password) {
        const data = await this.request('login', {
            method: 'POST',
            body: { username, password }
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async logout() {
        try {
            await this.request('logout', { method: 'POST' });
        } finally {
            this.setToken(null);
        }
    }

    async validateSession() {
        return this.request('validate', { method: 'GET' });
    }

    // Data
    async getData(filters = {}, page = 1, limit = CONFIG.PAGINATION_LIMIT) {
        return this.request('getData', {
            method: 'POST',
            body: { ...filters, page, limit }
        });
    }

    async getDataById(id) {
        return this.request('getDataById', {
            method: 'POST',
            body: { id }
        });
    }

    async addData(data) {
        return this.request('addData', {
            method: 'POST',
            body: data
        });
    }

    async editData(id, data) {
        return this.request('editData', {
            method: 'POST',
            body: { id, ...data }
        });
    }

    async deleteData(id) {
        return this.request('deleteData', {
            method: 'POST',
            body: { id }
        });
    }

    // Stats
    async getStats() {
        return this.request('getStats', { method: 'GET' });
    }

    async getChartData() {
        return this.request('getChartData', { method: 'GET' });
    }

    // Import/Export
    async importData(data) {
        return this.request('importData', {
            method: 'POST',
            body: { data }
        });
    }

    async exportData(format = 'excel', filters = {}) {
        return this.request('exportData', {
            method: 'POST',
            body: { format, ...filters }
        });
    }

    // Users
    async getUsers() {
        return this.request('getUsers', { method: 'GET' });
    }

    async addUser(userData) {
        return this.request('addUser', {
            method: 'POST',
            body: userData
        });
    }

    async editUser(id, userData) {
        return this.request('editUser', {
            method: 'POST',
            body: { id, ...userData }
        });
    }

    async deleteUser(id) {
        return this.request('deleteUser', {
            method: 'POST',
            body: { id }
        });
    }

    async resetPassword(id, newPassword) {
        return this.request('resetPassword', {
            method: 'POST',
            body: { id, newPassword }
        });
    }

    // Audit
    async getAuditLog(filters = {}, page = 1) {
        return this.request('getAuditLog', {
            method: 'POST',
            body: { ...filters, page }
        });
    }

    // Activity
    async getRecentActivity(limit = 10) {
        return this.request('getRecentActivity', {
            method: 'POST',
            body: { limit }
        });
    }

    // Backup
    async backupDatabase() {
        return this.request('backup', { method: 'POST' });
    }

    async restoreDatabase(backupId) {
        return this.request('restore', {
            method: 'POST',
            body: { backupId }
        });
    }
}

export const api = new ApiService();
