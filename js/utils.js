/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Format date
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
    if (!date) return '-';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Format number with thousands separator
 */
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Generate random ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
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

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Show toast notification
 */
function showToast(type, title, message, duration = 4000) {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${icons[type] || 'info'}" style="width:24px;height:24px"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i data-lucide="x" style="width:16px;height:16px"></i>
        </button>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Create toast container
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('success', 'Berhasil', 'Data berhasil disalin');
    } catch (error) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('success', 'Berhasil', 'Data berhasil disalin');
    }
}

/**
 * Download file
 */
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Parse CSV
 */
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    
    return data;
}

/**
 * Convert data to CSV
 */
function toCSV(data, headers) {
    const headerRow = headers.join(',');
    const rows = data.map(item => {
        return headers.map(header => {
            const value = item[header] || '';
            return `"${value}"`;
        }).join(',');
    });
    
    return [headerRow, ...rows].join('\n');
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if value is empty
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Validate email
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone number (Indonesian)
 */
function isValidPhone(phone) {
    return /^(08|62|8)[0-9]{8,12}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Validate bank account number
 */
function isValidAccountNumber(number) {
    return /^[0-9]{8,16}$/.test(number.replace(/\s/g, ''));
}

/**
 * Truncate text
 */
function truncate(text, length = 50) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Escape HTML
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get URL parameter
 */
function getURLParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Get file extension
 */
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatCurrency,
        formatNumber,
        generateId,
        debounce,
        throttle,
        showToast,
        copyToClipboard,
        downloadFile,
        parseCSV,
        toCSV,
        deepClone,
        isEmpty,
        isValidEmail,
        isValidPhone,
        isValidAccountNumber,
        truncate,
        escapeHTML,
        getURLParam,
        getFileExtension
    };
} else {
    // Make available globally
    window.formatDate = formatDate;
    window.formatCurrency = formatCurrency;
    window.formatNumber = formatNumber;
    window.generateId = generateId;
    window.debounce = debounce;
    window.throttle = throttle;
    window.showToast = showToast;
    window.copyToClipboard = copyToClipboard;
    window.downloadFile = downloadFile;
    window.parseCSV = parseCSV;
    window.toCSV = toCSV;
    window.deepClone = deepClone;
    window.isEmpty = isEmpty;
    window.isValidEmail = isValidEmail;
    window.isValidPhone = isValidPhone;
    window.isValidAccountNumber = isValidAccountNumber;
    window.truncate = truncate;
    window.escapeHTML = escapeHTML;
    window.getURLParam = getURLParam;
    window.getFileExtension = getFileExtension;
}