/**
 * Dashboard Module
 * Handles dashboard statistics and charts
 */

const Dashboard = {
    stats: {},
    chartInstances: {},
    updateInterval: null,
    
    /**
     * Initialize dashboard
     */
    init() {
        this.loadStats();
        this.setupAutoRefresh();
        this.setupChartFilters();
    },
    
    /**
     * Load statistics
     */
    async loadStats() {
        try {
            // Show loading skeleton
            this.showStatsSkeleton();
            
            // Fetch data from API
            const response = await this.fetchStats();
            
            if (response.success) {
                this.stats = response.data;
                this.renderStats();
                this.renderCharts();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showStatsError();
        }
    },
    
    /**
     * Fetch stats from API
     */
    async fetchStats() {
        // In production, call Google Apps Script
        // For demo, return mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        totalData: 1250,
                        totalBank: 12,
                        totalRekening: 1250,
                        totalUser: 8,
                        totalAktif: 820,
                        totalExpired: 430,
                        dataHariIni: 15,
                        updateTerakhir: '2024-01-15 14:30'
                    }
                });
            }, 500);
        });
    },
    
    /**
     * Show stats skeleton
     */
    showStatsSkeleton() {
        const grid = document.getElementById('statsGrid');
        if (!grid) return;
        
        const skeletonCards = [
            { icon: 'database', label: 'Total Data' },
            { icon: 'building2', label: 'Total Bank' },
            { icon: 'credit-card', label: 'Total Rekening' },
            { icon: 'users', label: 'Total User' },
            { icon: 'check-circle', label: 'Total Aktif' },
            { icon: 'clock', label: 'Total Expired' },
            { icon: 'calendar', label: 'Data Hari Ini' },
            { icon: 'refresh-cw', label: 'Update Terakhir' }
        ];
        
        grid.innerHTML = skeletonCards.map(card => `
            <div class="stat-card animate-pulse">
                <div class="stat-icon skeleton" style="width:44px;height:44px;border-radius:12px;"></div>
                <div class="skeleton" style="height:32px;width:80px;margin-top:8px;"></div>
                <div class="skeleton" style="height:16px;width:100px;margin-top:4px;"></div>
            </div>
        `).join('');
    },
    
    /**
     * Show stats error
     */
    showStatsError() {
        const grid = document.getElementById('statsGrid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i data-lucide="alert-circle" style="width:48px;height:48px;color:var(--danger);margin:0 auto 16px;"></i>
                <p class="text-gray-500">Gagal memuat statistik</p>
                <button class="btn btn-primary mt-4" onclick="Dashboard.loadStats()">
                    <i data-lucide="refresh-cw"></i>
                    Muat Ulang
                </button>
            </div>
        `;
        lucide.createIcons();
    },
    
    /**
     * Render statistics
     */
    renderStats() {
        const grid = document.getElementById('statsGrid');
        if (!grid) return;
        
        const stats = this.stats;
        const statItems = [
            { 
                icon: 'database', 
                label: 'Total Data', 
                value: stats.totalData,
                color: 'primary',
                change: '+12%'
            },
            { 
                icon: 'building2', 
                label: 'Total Bank', 
                value: stats.totalBank,
                color: 'success',
                change: '+2'
            },
            { 
                icon: 'credit-card', 
                label: 'Total Rekening', 
                value: stats.totalRekening,
                color: 'warning',
                change: '+8%'
            },
            { 
                icon: 'users', 
                label: 'Total User', 
                value: stats.totalUser,
                color: 'info',
                change: '0'
            },
            { 
                icon: 'check-circle', 
                label: 'Total Aktif', 
                value: stats.totalAktif,
                color: 'success',
                change: '+5%'
            },
            { 
                icon: 'clock', 
                label: 'Total Expired', 
                value: stats.totalExpired,
                color: 'danger',
                change: '-3%'
            },
            { 
                icon: 'calendar', 
                label: 'Data Hari Ini', 
                value: stats.dataHariIni,
                color: 'primary',
                change: '+4'
            },
            { 
                icon: 'refresh-cw', 
                label: 'Update Terakhir', 
                value: stats.updateTerakhir,
                color: 'gray',
                isDate: true
            }
        ];
        
        const iconColors = {
            primary: 'bg-primary/10 text-primary',
            success: 'bg-success/10 text-success',
            warning: 'bg-warning/10 text-warning',
            danger: 'bg-danger/10 text-danger',
            info: 'bg-blue-500/10 text-blue-500',
            gray: 'bg-gray-100 text-gray-500'
        };
        
        grid.innerHTML = statItems.map(item => `
            <div class="stat-card animate-fade-in">
                <div class="stat-icon ${iconColors[item.color]}">
                    <i data-lucide="${item.icon}" style="width:24px;height:24px;"></i>
                </div>
                <div class="stat-value">${item.isDate ? '' : item.value}</div>
                ${item.isDate ? `<div class="stat-value text-sm font-medium">${item.value}</div>` : ''}
                <div class="stat-label">${item.label}</div>
                ${item.change && !item.isDate ? `
                    <div class="stat-change ${item.change.startsWith('+') ? 'up' : 'down'}">
                        ${item.change}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        lucide.createIcons();
    },
    
    /**
     * Setup auto refresh
     */
    setupAutoRefresh() {
        // Refresh every 60 seconds
        this.updateInterval = setInterval(() => {
            this.loadStats();
        }, 60000);
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        });
    },
    
    /**
     * Setup chart filters
     */
    setupChartFilters() {
        const filter = document.getElementById('bankChartFilter');
        if (filter) {
            filter.addEventListener('change', () => {
                this.updateBankChart(filter.value);
            });
        }
    },
    
    /**
     * Render charts
     */
    async renderCharts() {
        try {
            const response = await this.fetchChartData();
            
            if (response.success) {
                this.createBankChart(response.data.bankLabels, response.data.bankValues);
                this.createStatusChart(response.data.statusLabels, response.data.statusValues);
                this.createGroupChart(response.data.groupLabels, response.data.groupValues);
            }
        } catch (error) {
            console.error('Error loading charts:', error);
        }
    },
    
    /**
     * Fetch chart data
     */
    async fetchChartData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        bankLabels: ['BCA', 'Mandiri', 'BNI', 'BRI', 'Danamon', 'CIMB', 'Permata'],
                        bankValues: [320, 280, 210, 190, 140, 85, 45],
                        statusLabels: ['Aktif', 'Expired', 'Nonaktif'],
                        statusValues: [820, 340, 90],
                        groupLabels: ['Group A', 'Group B', 'Group C', 'Group D'],
                        groupValues: [450, 320, 280, 200]
                    }
                });
            }, 300);
        });
    },
    
    /**
     * Create bank chart
     */
    createBankChart(labels, values) {
        const ctx = document.getElementById('bankChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.chartInstances.bank) {
            this.chartInstances.bank.destroy();
        }
        
        const colors = [
            '#2563EB', '#16A34A', '#F59E0B', '#DC2626', 
            '#8B5CF6', '#EC4899', '#06B6D4'
        ];
        
        this.chartInstances.bank = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Data',
                    data: values,
                    backgroundColor: colors.slice(0, values.length),
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
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
            }
        });
    },
    
    /**
     * Create status chart
     */
    createStatusChart(labels, values) {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;
        
        if (this.chartInstances.status) {
            this.chartInstances.status.destroy();
        }
        
        const colors = {
            'Aktif': '#16A34A',
            'Expired': '#DC2626',
            'Nonaktif': '#94A3B8'
        };
        
        const backgroundColors = labels.map(label => colors[label] || '#94A3B8');
        
        this.chartInstances.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
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
            }
        });
    },
    
    /**
     * Create group chart
     */
    createGroupChart(labels, values) {
        const ctx = document.getElementById('groupChart');
        if (!ctx) return;
        
        if (this.chartInstances.group) {
            this.chartInstances.group.destroy();
        }
        
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.8)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.1)');
        
        this.chartInstances.group = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Data',
                    data: values,
                    borderColor: '#2563EB',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563EB',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
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
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    },
    
    /**
     * Update bank chart with filter
     */
    updateBankChart(filter) {
        // In production, filter data based on selection
        // For demo, we'll just refresh
        this.renderCharts();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} else {
    window.Dashboard = Dashboard;
}
