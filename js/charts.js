/**
 * Charts Module
 * Advanced chart configurations and utilities
 */

const Charts = {
    instances: {},
    defaultColors: [
        '#2563EB', '#16A34A', '#F59E0B', '#DC2626',
        '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
        '#84CC16', '#14B8A6'
    ],
    
    /**
     * Initialize charts
     */
    init() {
        // Charts are initialized by Dashboard module
        // This module provides additional chart utilities
    },
    
    /**
     * Create a bar chart
     */
    createBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        // Destroy existing chart
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
        }
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: options.showLegend !== false,
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#1E293B',
                    bodyColor: '#475569',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        };
        
        const mergedOptions = this.deepMerge(defaultOptions, options);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: mergedOptions
        });
        
        return this.instances[canvasId];
    },
    
    /**
     * Create a line chart
     */
    createLineChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
        }
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: options.showLegend !== false,
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#1E293B',
                    bodyColor: '#475569',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        };
        
        const mergedOptions = this.deepMerge(defaultOptions, options);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: data,
            options: mergedOptions
        });
        
        return this.instances[canvasId];
    },
    
    /**
     * Create a doughnut chart
     */
    createDoughnutChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
        }
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#1E293B',
                    bodyColor: '#475569',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%'
        };
        
        const mergedOptions = this.deepMerge(defaultOptions, options);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: mergedOptions
        });
        
        return this.instances[canvasId];
    },
    
    /**
     * Create a pie chart
     */
    createPieChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
        }
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#1E293B',
                    bodyColor: '#475569',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        };
        
        const mergedOptions = this.deepMerge(defaultOptions, options);
        
        this.instances[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: mergedOptions
        });
        
        return this.instances[canvasId];
    },
    
    /**
     * Update chart data
     */
    updateChart(canvasId, data) {
        if (this.instances[canvasId]) {
            this.instances[canvasId].data = data;
            this.instances[canvasId].update();
            return true;
        }
        return false;
    },
    
    /**
     * Destroy chart
     */
    destroyChart(canvasId) {
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
            delete this.instances[canvasId];
            return true;
        }
        return false;
    },
    
    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.keys(this.instances).forEach(key => {
            this.instances[key].destroy();
        });
        this.instances = {};
    },
    
    /**
     * Get color palette
     */
    getColorPalette(count) {
        if (count <= this.defaultColors.length) {
            return this.defaultColors.slice(0, count);
        }
        
        // Generate more colors if needed
        const colors = [...this.defaultColors];
        while (colors.length < count) {
            const hue = Math.floor(Math.random() * 360);
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors;
    },
    
    /**
     * Deep merge objects
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
} else {
    window.Charts = Charts;
}
