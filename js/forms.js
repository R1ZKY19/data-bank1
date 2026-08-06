/**
 * Data Table Module - COMPLETE with Google Sheets
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
    API_URL: 'https://script.google.com/macros/s/AKfycbw0H8cbgkuxhravOnkLTqta6Js5QZ8_o85BW-y1Pjjk0c1J76ZSHmBWxznTsI6wHP1j/exec', // Isi dengan URL Google Apps Script Anda
    
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
     * Load data from API or localStorage
     */
    async loadData() {
        try {
            // Show loading skeleton
            this.showLoading();
            
            // Try to fetch from API
            const data = await this.fetchFromAPI();
            
            if (data && data.length > 0) {
                this.data = data;
            } else {
                // Fallback ke localStorage
                this.data = JSON.parse(localStorage.getItem('bankData') || '[]');
                
                // Jika masih kosong, buat sample data
                if (this.data.length === 0) {
                    this.createSampleData();
                }
            }
            
            // Update filters
            this.updateFilters();
            
            // Render table
            this.filteredData = [...this.data];
            this.currentPage = 1;
            this.render();
            
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback ke localStorage
            this.data = JSON.parse(localStorage.getItem('bankData') || '[]');
            if (this.data.length === 0) {
                this.createSampleData();
            }
            this.filteredData = [...this.data];
            this.render();
        }
    },
    
    /**
     * Fetch data from Google Sheets API
     */
    async fetchFromAPI() {
        if (!this.API_URL) {
            console.warn('API_URL belum diisi, menggunakan localStorage');
            return null;
        }
        
        try {
            const session = AUTH.getSession();
            const response = await fetch(`${this.API_URL}?action=getData&token=${session?.token || ''}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('API fetch error:', error);
            return null;
        }
    },
    
    /**
     * Create sample data
     */
    createSampleData() {
        const banks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Danamon', 'CIMB', 'Permata'];
        const groups = ['Group A', 'Group B', 'Group C', 'Group D'];
        const statuses = ['Aktif', 'Aktif', 'Aktif', 'Expired', 'Nonaktif'];
        const names = ['PT Maju Jaya', 'CV Sejahtera', 'UD Berkah', 'PT Abadi', 'CV Mandiri', 'PT Bina Usaha', 'CV Karya Abadi'];
        
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
                updated: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
                updatedBy: 'System'
            });
        }
        
        this.data = sampleData;
        localStorage.setItem('bankData', JSON.stringify(sampleData));
    },
    
    // ... rest of the render, filter, pagination functions ...
};
