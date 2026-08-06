/**
 * Main Application Module
 */

const App = {
    currentPage: 'dashboard',
    
    /**
     * Initialize application
     */
    init() {
        console.log('App initializing...');
        
        // Check authentication
        if (!AUTH.checkSession()) {
            console.log('Not authenticated, redirecting to login');
            return;
        }
        
        console.log('User authenticated');
        
        // Initialize components
        this.initSidebar();
        this.initNavigation();
        this.initSearch();
        this.initDrawer();
        this.initModules();
        this.setupGlobalEvents();
        
        // Load initial data
        this.loadData();
        
        console.log('App initialized successfully');
    },
    
    /**
     * Initialize modules with error handling
     */
    initModules() {
        try {
            console.log('Initializing modules...');
            
            if (window.Dashboard) {
                console.log('Dashboard init');
                Dashboard.init();
            } else {
                console.warn('Dashboard not found');
            }
            
            if (window.DataTable) {
                console.log('DataTable init');
                DataTable.init();
            } else {
                console.warn('DataTable not found');
            }
            
            if (window.Forms) {
                console.log('Forms init');
                Forms.init();
            } else {
                console.warn('Forms not found');
            }
            
            if (window.ImportExport) {
                console.log('ImportExport init');
                ImportExport.init();
            } else {
                console.warn('ImportExport not found');
            }
            
            if (window.Drawer) {
                console.log('Drawer init');
                Drawer.init();
            } else {
                console.warn('Drawer not found');
            }
            
            console.log('All modules initialized');
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    },
    
    /**
     * Initialize sidebar
     */
    initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebarToggle');
        const mobileBtn = document.getElementById('mobileMenuBtn');
        
        console.log('Sidebar init');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                setTimeout(() => lucide.createIcons(), 100);
            });
        }
        
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }
    },
    
    /**
     * Initialize navigation
     */
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        
        console.log('Navigation init, items:', navItems.length);
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                console.log('Navigating to:', page);
                this.navigateTo(page);
            });
        });
    },
    
    /**
     * Navigate to page
     */
    navigateTo(page) {
        console.log('Navigate to:', page);
        this.currentPage = page;
        
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
        
        // Load specific page data
        try {
            if (page === 'pengguna' && window.Forms) {
                Forms.loadUsers();
            }
            if (page === 'dashboard' && window.Dashboard) {
                Dashboard.loadStats();
            }
            if (page === 'data-bank' && window.DataTable) {
                DataTable.loadData();
            }
        } catch (error) {
            console.error('Error loading page data:', error);
        }
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
                if (window.DataTable) {
                    DataTable.search(query);
                }
            }, 300);
        });
    },
    
    /**
     * Initialize drawer
     */
    initDrawer() {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        const closeBtn = document.getElementById('drawerClose');
        
        if (!drawer || !overlay) return;
        
        const closeDrawer = () => {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDrawer);
        }
        
        overlay.addEventListener('click', closeDrawer);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });
        
        // Make drawer functions globally available
        window.closeDrawer = closeDrawer;
    },
    
    /**
     * Setup global events
     */
    setupGlobalEvents() {
        // Logout handlers
        document.querySelectorAll('#logoutBtn, #logoutBtn2').forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    if (window.AUTH) {
                        AUTH.logout('Anda telah logout');
                    }
                });
            }
        });
    },
    
    /**
     * Load data
     */
    async loadData() {
        console.log('Loading data...');
        try {
            if (window.Dashboard) {
                await Dashboard.loadStats();
            }
            if (window.DataTable) {
                await DataTable.loadData();
            }
            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, initializing App...');
    try {
        App.init();
    } catch (error) {
        console.error('Fatal error in App.init:', error);
        // Show error message to user
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;padding:20px;text-align:center;font-family:Inter,sans-serif;">
                <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                <h2 style="color:#DC2626;">Error Memuat Aplikasi</h2>
                <p style="color:#64748B;max-width:400px;">Terjadi kesalahan saat memuat aplikasi. Silakan refresh halaman atau cek console browser untuk detail.</p>
                <button onclick="location.reload()" style="margin-top:20px;padding:12px 24px;background:#2563EB;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;">Refresh Halaman</button>
                <pre style="margin-top:16px;background:#1E293B;color:#E2E8F0;padding:16px;border-radius:8px;max-width:600px;overflow:auto;font-size:12px;text-align:left;">${error.message}</pre>
            </div>
        `;
    }
});
