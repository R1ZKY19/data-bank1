/**
 * Main Application Module
 * Initializes and orchestrates all components
 */

const App = {
    /**
     * Initialize application
     */
    init() {
        // Check authentication
        if (!AUTH.checkSession()) {
            return;
        }
        
        // Initialize components
        this.initSidebar();
        this.initNavigation();
        this.initSearch();
        this.initDrawer();
        this.initDataTable();
        this.initDashboard();
        this.initCharts();
        this.initNotifications();
        
        // Load initial data
        this.loadData();
    },
    
    /**
     * Initialize sidebar
     */
    initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebarToggle');
        const mobileBtn = document.getElementById('mobileMenuBtn');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                // Re-render icons after animation
                setTimeout(() => lucide.createIcons(), 100);
            });
        }
        
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.classList.toggle('active');
            });
        }
        
        // Close sidebar on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const isSidebar = sidebar.contains(e.target);
                const isBtn = mobileBtn.contains(e.target);
                if (!isSidebar && !isBtn) {
                    sidebar.classList.remove('mobile-open');
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) overlay.classList.remove('active');
                }
            }
        });
        
        // Create sidebar overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    },
    
    /**
     * Initialize navigation
     */
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        const pageTitle = document.getElementById('pageTitle');
        
        // Page title mapping
        const pageTitles = {
            dashboard: 'Dashboard',
            'data-bank': 'Data Bank',
            'tambah-data': 'Tambah Data',
            riwayat: 'Riwayat',
            import: 'Import Data',
            export: 'Export Data',
            laporan: 'Laporan',
            pengguna: 'Pengelolaan Pengguna',
            pengaturan: 'Pengaturan',
            profil: 'Profil'
        };
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Handle initial page
        const initialPage = window.location.hash.replace('#', '') || 'dashboard';
        this.navigateTo(initialPage);
    },
    
    /**
     * Navigate to page
     */
    navigateTo(page) {
        // Update nav items
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        
        // Update pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.toggle('active', p.id === `page-${page}`);
        });
        
        // Update title
        const pageTitles = {
            dashboard: 'Dashboard',
            'data-bank': 'Data Bank',
            'tambah-data': 'Tambah Data',
            riwayat: 'Riwayat',
            import: 'Import Data',
            export: 'Export Data',
            laporan: 'Laporan',
            pengguna: 'Pengelolaan Pengguna',
            pengaturan: 'Pengaturan',
            profil: 'Profil'
        };
        
        const titleEl = document.getElementById('pageTitle');
        if (titleEl) titleEl.textContent = pageTitles[page] || page;
        
        // Update URL hash
        window.location.hash = page;
    },
    
    /**
     * Initialize search
     */
    initSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.trim();
                this.searchData(query);
            }, 300); // Debounce
        });
    },
    
    /**
     * Search data
     */
    searchData(query) {
        // Will be implemented in data-table module
        if (window.DataTable) {
            window.DataTable.search(query);
        }
    },
    
    /**
     * Initialize drawer
     */
    initDrawer() {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        const closeBtn = document.getElementById('drawerClose');
        
        const openDrawer = (data) => {
            drawer.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Render detail content
            this.renderDrawerContent(data);
        };
        
        const closeDrawer = () => {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        // Close drawer events
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });
        
        // Store for use in other modules
        window.openDrawer = openDrawer;
        window.closeDrawer = closeDrawer;
    },
    
    /**
     * Render drawer content
     */
    renderDrawerContent(data) {
        const body = document.getElementById('drawerBody');
        if (!body || !data) return;
        
        // Check if user can see sensitive data
        const session = AUTH.getSession();
        const canSeeSensitive = session && ['LEADER'].includes(session.role);
        
        // Mask sensitive data
        const mask = (value) => canSeeSensitive ? value : '••••••••';
        
        body.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Bank</div>
                <div class="detail-value">${data.bank || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Group</div>
                <div class="detail-value">${data.group || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Nama Rekening</div>
                <div class="detail-value">${data.nama || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Nomor Rekening</div>
                <div class="detail-value">${data.noRekening || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Nomor HP</div>
                <div class="detail-value">${data.noHP || '-'}</div>
            </div>
            
            <div class="detail-divider"></div>
            
            <div class="detail-item">
                <div class="detail-label">User ID</div>
                <div class="detail-value sensitive">${mask(data.userId)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">PIN Login</div>
                <div class="detail-value sensitive">${mask(data.pinLogin)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">PIN Proses</div>
                <div class="detail-value sensitive">${mask(data.pinProses)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">ID IB</div>
                <div class="detail-value sensitive">${mask(data.idIb)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Password IB</div>
                <div class="detail-value sensitive">${mask(data.passwordIb)}</div>
            </div>
            
            <div class="detail-divider"></div>
            
            <div class="detail-item">
                <div class="detail-label">Masa Aktif</div>
                <div class="detail-value">${data.masaAktif || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                    <span class="status-badge ${data.status?.toLowerCase()}">
                        <span class="dot"></span>
                        ${data.status || '-'}
                    </span>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Tanggal Cek</div>
                <div class="detail-value">${data.tanggalCek || '-'}</div>
            </div>
            
            <div class="detail-divider"></div>
            
            ${data.screenshot ? `
                <div class="detail-item">
                    <div class="detail-label">Screenshot</div>
                    <img src="${data.screenshot}" alt="Screenshot" class="screenshot-preview">
                </div>
            ` : ''}
            
            <div class="detail-item">
                <div class="detail-label">Catatan</div>
                <div class="detail-value">${data.catatan || 'Tidak ada catatan'}</div>
            </div>
            
            <div class="detail-divider"></div>
            
            <div class="detail-item">
                <div class="detail-label">Dibuat</div>
                <div class="detail-value">${data.created || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Diperbarui</div>
                <div class="detail-value">${data.updated || '-'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Diperbarui Oleh</div>
                <div class="detail-value">${data.updatedBy || '-'}</div>
            </div>
        `;
    },
    
    /**
     * Initialize data table
     */
    initDataTable() {
        // Will be implemented in data-table module
        if (window.DataTable) {
            window.DataTable.init();
        }
    },
    
    /**
     * Initialize dashboard
     */
    initDashboard() {
        // Will be implemented in dashboard module
        if (window.Dashboard) {
            window.Dashboard.init();
        }
    },
    
    /**
     * Initialize charts
     */
    initCharts() {
        // Will be implemented in charts module
        if (window.Charts) {
            window.Charts.init();
        }
    },
    
    /**
     * Initialize notifications
     */
    initNotifications() {
        const notifBtn = document.getElementById('notifBtn');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                // Show notifications dropdown or modal
                // For now, just show a toast
                if (window.showToast) {
                    window.showToast('info', 'Notifikasi', 'Tidak ada notifikasi baru');
                }
            });
        }
    },
    
    /**
     * Load data
     */
    async loadData() {
        // Show loading skeleton
        this.showLoading();
        
        try {
            // In production, fetch from Google Apps Script API
            // For demo, use mock data
            const data = await this.fetchData();
            
            // Update UI with data
            this.updateUI(data);
        } catch (error) {
            console.error('Error loading data:', error);
            if (window.showToast) {
                window.showToast('error', 'Error', 'Gagal memuat data');
            }
        } finally {
            this.hideLoading();
        }
    },
    
    /**
     * Fetch data from API
     */
    async fetchData() {
        // Mock data for demonstration
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    stats: {
                        totalData: 1250,
                        totalBank: 12,
                        totalRekening: 1250,
                        totalUser: 8,
                        totalAktif: 820,
                        totalExpired: 430,
                        dataHariIni: 15,
                        updateTerakhir: '2024-01-15 14:30'
                    },
                    tableData: [
                        {
                            id: 1,
                            bank: 'BCA',
                            group: 'Group A',
                            nama: 'PT Maju Jaya',
                            noRekening: '1234567890',
                            noHP: '081234567890',
                            masaAktif: '2024-12-31',
                            status: 'Aktif',
                            sisaHari: 350
                        },
                        // More data...
                    ],
                    chartData: {
                        bankLabels: ['BCA', 'Mandiri', 'BNI', 'BRI', 'Danamon'],
                        bankValues: [320, 280, 210, 190, 140],
                        statusLabels: ['Aktif', 'Expired', 'Nonaktif'],
                        statusValues: [820, 340, 90]
                    }
                });
            }, 500);
        });
    },
    
    /**
     * Update UI with data
     */
    updateUI(data) {
        // Update stats
        this.updateStats(data.stats);
        
        // Update table
        if (window.DataTable) {
            window.DataTable.setData(data.tableData);
        }
        
        // Update charts
        if (window.Charts) {
            window.Charts.update(data.chartData);
        }
    },
    
    /**
     * Update stats
     */
    updateStats(stats) {
        const statCards = document.querySelectorAll('.stat-card');
        if (!statCards.length) return;
        
        const statMappings = {
            'Total Data': 'totalData',
            'Total Bank': 'totalBank',
            'Total Rekening': 'totalRekening',
            'Total User': 'totalUser',
            'Total Aktif': 'totalAktif',
            'Total Expired': 'totalExpired',
            'Data Hari Ini': 'dataHariIni',
            'Update Terakhir': 'updateTerakhir'
        };
        
        statCards.forEach(card => {
            const label = card.querySelector('.stat-label')?.textContent;
            if (!label) return;
            
            const key = statMappings[label.trim()];
            if (key && stats[key] !== undefined) {
                const valueEl = card.querySelector('.stat-value');
                if (valueEl) {
                    valueEl.textContent = stats[key];
                }
            }
        });
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        // Add loading skeletons to table
        const tbody = document.getElementById('tableBody');
        if (tbody) {
            tbody.innerHTML = Array(10).fill(0).map(() => `
                <tr>
                    ${Array(11).fill(0).map(() => `
                        <td><div class="skeleton" style="height:20px;width:100%"></div></td>
                    `).join('')}
                </tr>
            `).join('');
        }
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        // Loading will be replaced when data is loaded
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
window.App = App;