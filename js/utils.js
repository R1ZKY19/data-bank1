// utils.js - Utility Functions

export function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function formatDateTime(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

export function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

export function calculateDaysLeft(date) {
    if (!date) return 0;
    const target = new Date(date);
    const now = new Date();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function maskSensitive(text, showFirst = 2, showLast = 2) {
    if (!text) return '••••••••';
    const length = text.length;
    if (length <= showFirst + showLast) return '••••••••';
    return text.substring(0, showFirst) + '•'.repeat(Math.min(length - showFirst - showLast, 8)) + text.substring(length - showLast);
}

export async function showToast(type, title, message) {
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i data-lucide="${icons[type] || 'info'}" class="toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    container.appendChild(toast);

    // Refresh Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

export async function showAlert(type, title, message, options = {}) {
    const Swal = window.Swal;
    if (!Swal) {
        console.error('SweetAlert2 not loaded');
        return;
    }

    const icons = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    return Swal.fire({
        icon: icons[type] || 'info',
        title,
        text: message,
        confirmButtonColor: '#2563EB',
        ...options
    });
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function isValidPhone(phone) {
    return /^[0-9]{10,13}$/.test(phone);
}

export function isValidAccount(account) {
    return /^[0-9]{8,20}$/.test(account);
}

export function getStatusColor(status) {
    const colors = {
        'Aktif': 'success',
        'Expired': 'danger',
        'Pending': 'warning',
        'Nonaktif': 'muted'
    };
    return colors[status] || 'muted';
}

export function getStatusBadge(status) {
    const color = getStatusColor(status);
    const statusClass = status.toLowerCase();
    return `<span class="status-badge ${statusClass}">
        <span class="dot"></span>
        ${status}
    </span>`;
}
