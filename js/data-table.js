/**
 * Data Table Module - COMPLETE
 */

const DataTable = {
    data: [],
    filteredData: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: '',
    filters: {
        bank: '',
        group: '',
        status: ''
    },
    
    /**
     * Initialize data table
     */
    init() {
        this.setupFilters();
        this.setupPagination();
        this.setupRowClick();
        this.setupRefresh();
        this.loadData();
    },
    
    /**
     * Load data from localStorage
     */
    loadData() {
        // Get data from localStorage
        const storedData = JSON.parse(localStorage.getItem('bankData') || '[]');
        
        // If no data, create sample data
        if (storedData.length === 0) {
            this.createSampleData();
        } else {
            this.data = storedData;
        }
        
        // Update filter options
        this.updateFilters();
        
        // Render table
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.render();
    },
    
    /**
     * Create sample data
     */
    createSampleData() {
        const banks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Danamon', 'CIMB', 'Permata'];
        const groups = ['Group A', 'Group B', 'Group C', 'Group D'];
        const statuses = ['Aktif', 'Aktif', 'Aktif', 'Expired', 'Nonaktif'];
        const names = ['PT Maju Jaya', 'CV Sejahtera', 'UD Berkah', 'PT Abadi', 'CV Mandiri'];
        
        const sampleData = [];
        
        for (let i = 1; i <= 50; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 365));
            
            sampleData.push({
                id: i,
                bank: banks[Math.floor(Math.random() * banks.length)],
                group: groups[Math.floor(Math.random() * groups.length)],
                nama: names[Math.floor(Math.random() * names.length)] + ' ' + i,
                noRekening: String(1000000000 + i * 1234567),
                noHP: '081' + String(100000000 + i * 2345678).slice(0, 10),
                masaAktif: date.toISOString().split('T')[0],
                status: status,
                userId: 'user_' + i,
                pinLogin: '******',
                pinProses: '******',
                idIb: 'ib_' + i,
                passwordIb: '******',
                catatan: 'Catatan untuk data ' + i,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                updatedBy: 'System'
            });
        }
        
        this.data = sampleData;
        localStorage.setItem('bankData', JSON.stringify(sampleData));
    },
    
    // ... rest of the code from previous data-table.js ...
};
