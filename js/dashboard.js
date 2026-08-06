/**
 * Dashboard Module - COMPLETE
 */

const Dashboard = {
    stats: {},
    chartInstances: {},
    
    /**
     * Initialize dashboard
     */
    init() {
        this.loadStats();
        this.setupAutoRefresh();
    },
    
    /**
     * Load statistics from localStorage
     */
    async loadStats() {
        try {
            const data = JSON.parse(localStorage.getItem('bankData') || '[]');
            
            // Calculate stats
            const stats = {
                totalData: data.length,
                totalBank: new Set(data.map(d => d.bank)).size,
                totalRekening: data.length,
                totalUser: JSON.parse(localStorage.getItem('bankUsers') || '[]').length || 1,
                totalAktif: data.filter(d => d.status === 'Aktif').length,
                totalExpired: data.filter(d => d.status === 'Expired').length,
                dataHariIni: data.filter(d => {
                    const today = new Date().toDateString();
                    return new Date(d.created).toDateString() === today;
                }).length,
                updateTerakhir: data.length > 0 ? data[data.length - 1].updated : '-'
            };
            
            this.stats = stats;
            this.renderStats();
            this.renderCharts(data);
            
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showStatsError();
        }
    },
    
    /**
     * Render stats
     */
    renderStats() {
        const grid = document.getElementById('statsGrid');
        if (!grid) return;
        
        const stats = this.stats;
        const statItems = [
            { icon: 'database', label: 'Total Data', value: stats.totalData, color: 'primary' },
            { icon: 'building2', label: 'Total Bank', value: stats.totalBank, color: 'success' },
            { icon: 'credit-card', label: 'Total Rekening', value: stats.totalRekening, color: 'warning' },
            { icon: 'users', label: 'Total User', value: stats.totalUser, color: 'info' },
            { icon: 'check-circle', label: 'Total Aktif', value: stats.totalAktif, color: 'success' },
            { icon: 'clock', label: 'Total Expired', value: stats.totalExpired, color: 'danger' },
            { icon: 'calendar', label: 'Data Hari Ini', value: stats.dataHariIni, color: 'primary' },
            { icon: 'refresh-cw', label: 'Update Terakhir', value: stats.updateTerakhir, color: 'gray', isDate: true }
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
                ${item.isDate ? 
                    `<div class="stat-value" style="font-size:14px;font-weight:600;">${item.value}</div>` :
                    `<div class="stat-value">${item.value}</div>`
                }
                <div class="stat-label">${item.label}</div>
            </div>
        `).join('');
        
        lucide.createIcons();
    },
    
    /**
     * Render charts
     */
    renderCharts(data) {
        // Bank chart
        const bankCounts = {};
        data.forEach(d => {
            bankCounts[d.bank] = (bankCounts[d.bank] || 0) + 1;
        });
        
        const bankLabels = Object.keys(bankCounts);
        const bankValues = Object.values(bankCounts);
        
        // Status chart
        const statusCounts = {};
        data.forEach(d => {
            statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
        });
        
        const statusLabels = Object.keys(statusCounts);
        const statusValues = Object.values(statusCounts);
        
        // Group chart
        const groupCounts = {};
        data.forEach(d => {
            groupCounts[d.group] = (groupCounts[d.group] || 0) + 1;
        });
        
        const groupLabels = Object.keys(groupCounts);
        const groupValues = Object.values(groupCounts);
        
        // Create charts
        this.createBankChart(bankLabels, bankValues);
        this.createStatusChart(statusLabels, statusValues);
        this.createGroupChart(groupLabels, groupValues);
    },
    
    // ... rest of chart functions ...
};
