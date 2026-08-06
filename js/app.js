/**
 * Main Application Module - UPDATED
 */

const App = {
    currentPage: 'dashboard',
    
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
        this.initModules();
        this.setupGlobalEvents();
        
        // Load initial data
        this.loadData();
    },
    
    /**
     * Initialize modules
     */
    initModules() {
        if (window.Dashboard) Dashboard.init();
        if (window.DataTable) DataTable.init();
        if (window.Forms) Forms.init();
        if (window.ImportExport) ImportExport.init();
        if (window.Drawer) Drawer.init();
    },
    
    /**
     * Navigate to page
     */
    navigateTo(page) {
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
        
        // Load specific page data
        if (page === 'pengguna' && window.Forms) {
            Forms.loadUsers();
        }
        if (page === 'dashboard' && window.Dashboard) {
            Dashboard.loadStats();
        }
        if (page === 'data-bank' && window.DataTable) {
            DataTable.loadData();
        }
    },
    
    // ... rest of the code from previous app.js ...
};
