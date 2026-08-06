/**
 * Data Table Module
 * Handles table rendering, pagination, filtering, and sorting
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
    sort: {
        column: 'id',
        direction: 'asc'
    },
    
    /**
     * Initialize data table
     */
    init() {
        this.setupFilters();
        this.setupPagination();
        this.setupSorting();
        this.setupRowClick();
        this.setupRefresh();
    },
    
    /**
     * Setup filter handlers
     */
    setupFilters() {
        const filterBank = document.getElementById('filterBank');
        const filterGroup = document.getElementById('filterGroup');
        const filterStatus = document.getElementById('filterStatus');
        
        if (filterBank) {
            filterBank.addEventListener('change', () => {
                this.filters.bank = filterBank.value;
                this.currentPage = 1;
                this.render();
            });
        }
        
        if (filterGroup) {
            filterGroup.addEventListener('change', () => {
                this.filters.group = filterGroup.value;
                this.currentPage = 1;
                this.render();
            });
        }
        
        if (filterStatus) {
            filterStatus.addEventListener('change', () => {
                this.filters.status = filterStatus.value;
                this.currentPage = 1;
                this.render();
            });
        }
    },
    
    /**
     * Setup pagination
     */
    setupPagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.render();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = this.getTotalPages();
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.render();
                }
            });
        }
    },
    
    /**
     * Setup column sorting
     */
    setupSorting() {
        document.querySelectorAll('.data-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                if (this.sort.column === column) {
                    this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sort.column = column;
                    this.sort.direction = 'asc';
                }
                this.render();
            });
        });
    },
    
    /**
     * Setup row click for detail view
     */
    setupRowClick() {
        document.addEventListener('click', (e) => {
            const row = e.target.closest('.data-table tbody tr');
            if (row && row.dataset.id) {
                const data = this.data.find(item => item.id == row.dataset.id);
                if (data && window.openDrawer) {
                    window.openDrawer(data);
                }
            }
        });
    },
    
    /**
     * Setup refresh button
     */
    setupRefresh() {
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (window.App) {
                    window.App.loadData();
                }
            });
        }
    },
    
    /**
     * Set data
     */
    setData(data) {
        this.data = data || [];
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.render();
    },
    
    /**
     * Search data
     */
    search(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.currentPage = 1;
        this.filterData();
        this.render();
    },
    
    /**
     * Filter data
     */
    filterData() {
        this.filteredData = this.data.filter(item => {
            // Apply search
            if (this.searchQuery) {
                const searchable = [
                    item.nama,
                    item.noRekening,
                    item.noHP,
                    item.group,
                    item.bank,
                    item.userId,
                    item.status
                ].join(' ').toLowerCase();
                
                if (!searchable.includes(this.searchQuery)) {
                    return false;
                }
            }
            
            // Apply filters
            if (this.filters.bank && item.bank !== this.filters.bank) {
                return false;
            }
            if (this.filters.group && item.group !== this.filters.group) {
                return false;
            }
            if (this.filters.status && item.status !== this.filters.status) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        this.sortData();
    },
    
    /**
     * Sort data
     */
    sortData() {
        const { column, direction } = this.sort;
        const modifier = direction === 'asc' ? 1 : -1;
        
        this.filteredData.sort((a, b) => {
            let valA = a[column] || '';
            let valB = b[column] || '';
            
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (valA < valB) return -modifier;
            if (valA > valB) return modifier;
            return 0;
        });
    },
    
    /**
     * Get total pages
     */
    getTotalPages() {
        return Math.ceil(this.filteredData.length / this.pageSize);
    },
    
    /**
     * Get current page data
     */
    getPageData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredData.slice(start, end);
    },
    
    /**
     * Render table
     */
    render() {
        // Apply filters and sorting
        this.filterData();
        
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;
        
        const pageData = this.getPageData();
        const startIndex = (this.currentPage - 1) * this.pageSize;
        
        // Update pagination info
        this.updatePaginationInfo();
        
        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="text-center py-8 text-gray-500">
                        <i data-lucide="inbox" class="mx-auto mb-2" style="width:40px;height:40px"></i>
                        <p>Tidak ada data</p>
                    </td>
                </tr>
            `;
            lucide.createIcons();
            return;
        }
        
        tbody.innerHTML = pageData.map((item, index) => `
            <tr data-id="${item.id}">
                <td>${startIndex + index + 1}</td>
                <td><span class="font-medium">${item.bank || '-'}</span></td>
                <td>${item.group || '-'}</td>
                <td>${item.nama || '-'}</td>
                <td>${item.noRekening || '-'}</td>
                <td>${item.noHP || '-'}</td>
                <td>${item.masaAktif || '-'}</td>
                <td>
                    <span class="status-badge ${item.status?.toLowerCase() || 'inactive'}">
                        <span class="dot"></span>
                        ${item.status || 'Nonaktif'}
                    </span>
                </td>
                <td>${item.sisaHari || '-'}</td>
                <td>${item.updated || '-'}</td>
                <td>
                    <div class="action-cell">
                        <button class="action-btn edit" data-id="${item.id}" title="Edit">
                            <i data-lucide="edit-2" style="width:16px;height:16px"></i>
                        </button>
                        ${AUTH.hasAnyRole(['LEADER', 'KAPTEN']) ? `
                            <button class="action-btn delete" data-id="${item.id}" title="Hapus">
                                <i data-lucide="trash-2" style="width:16px;height:16px"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Re-render icons
        lucide.createIcons();
        
        // Attach action handlers
        this.attachActionHandlers();
    },
    
    /**
     * Attach action handlers
     */
    attachActionHandlers() {
        // Edit buttons
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.handleEdit(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.handleDelete(id);
            });
        });
    },
    
    /**
     * Handle edit action
     */
    handleEdit(id) {
        const data = this.data.find(item => item.id === id);
        if (!data) return;
        
        // Open edit modal/drawer
        if (window.openDrawer) {
            // Add edit mode to drawer
            window.openDrawer({ ...data, _editMode: true });
        }
    },
    
    /**
     * Handle delete action
     */
    async handleDelete(id) {
        const data = this.data.find(item => item.id === id);
        if (!data) return;
        
        // Confirm deletion
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: `Apakah Anda yakin ingin menghapus data "${data.nama}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });
        
        if (result.isConfirmed) {
            try {
                // In production, call API to delete
                // For demo, just remove from local data
                this.data = this.data.filter(item => item.id !== id);
                this.filteredData = this.filteredData.filter(item => item.id !== id);
                this.render();
                
                // Show success toast
                if (window.showToast) {
                    window.showToast('success', 'Berhasil', 'Data berhasil dihapus');
                }
            } catch (error) {
                console.error('Delete error:', error);
                if (window.showToast) {
                    window.showToast('error', 'Gagal', 'Terjadi kesalahan saat menghapus data');
                }
            }
        }
    },
    
    /**
     * Update pagination info
     */
    updatePaginationInfo() {
        const total = this.filteredData.length;
        const totalPages = this.getTotalPages();
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, total);
        
        const startEl = document.getElementById('startRow');
        const endEl = document.getElementById('endRow');
        const totalEl = document.getElementById('totalRows');
        const currentPageEl = document.getElementById('currentPage');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (startEl) startEl.textContent = total > 0 ? start : 0;
        if (endEl) endEl.textContent = total > 0 ? end : 0;
        if (totalEl) totalEl.textContent = total;
        if (currentPageEl) currentPageEl.textContent = `${this.currentPage} / ${totalPages || 1}`;
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
    },
    
    /**
     * Get filter options
     */
    getFilterOptions() {
        const banks = new Set();
        const groups = new Set();
        
        this.data.forEach(item => {
            if (item.bank) banks.add(item.bank);
            if (item.group) groups.add(item.group);
        });
        
        return {
            banks: Array.from(banks),
            groups: Array.from(groups)
        };
    },
    
    /**
     * Update filter dropdowns
     */
    updateFilters() {
        const options = this.getFilterOptions();
        
        const bankFilter = document.getElementById('filterBank');
        const groupFilter = document.getElementById('filterGroup');
        
        if (bankFilter) {
            const currentValue = bankFilter.value;
            bankFilter.innerHTML = '<option value="">Semua Bank</option>';
            options.banks.forEach(bank => {
                bankFilter.innerHTML += `<option value="${bank}">${bank}</option>`;
            });
            bankFilter.value = currentValue;
        }
        
        if (groupFilter) {
            const currentValue = groupFilter.value;
            groupFilter.innerHTML = '<option value="">Semua Group</option>';
            options.groups.forEach(group => {
                groupFilter.innerHTML += `<option value="${group}">${group}</option>`;
            });
            groupFilter.value = currentValue;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataTable;
} else {
    window.DataTable = DataTable;
}