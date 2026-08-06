/**
 * Import/Export Module
 * Handles Excel, CSV import and export functionality
 */

const ImportExport = {
    /**
     * Initialize import/export
     */
    init() {
        this.setupImport();
        this.setupExport();
        this.setupBackup();
    },
    
    /**
     * Setup import
     */
    setupImport() {
        const importBtn = document.querySelector('[data-page="import"]');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.showImportModal();
            });
        }
    },
    
    /**
     * Setup export
     */
    setupExport() {
        const exportBtn = document.querySelector('[data-page="export"]');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showExportModal();
            });
        }
    },
    
    /**
     * Setup backup
     */
    setupBackup() {
        // Backup is available in admin settings
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#backupBtn')) {
                await this.createBackup();
            }
            if (e.target.closest('#restoreBtn')) {
                await this.restoreBackup();
            }
        });
    },
    
    /**
     * Show import modal
     */
    showImportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.id = 'importModal';
        
        modal.innerHTML = `
            <div class="modal" style="max-width:700px;">
                <div class="modal-header">
                    <h3>Import Data</h3>
                    <button class="modal-close" onclick="ImportExport.closeImportModal()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="import-options">
                        <div class="import-drop-zone" id="dropZone">
                            <i data-lucide="upload" style="width:48px;height:48px;color:var(--gray-400);"></i>
                            <p>Drop file di sini atau klik untuk upload</p>
                            <p style="font-size:12px;color:var(--gray-400);margin-top:4px;">
                                Support: .xlsx, .xls, .csv
                            </p>
                            <input type="file" id="fileInput" accept=".xlsx,.xls,.csv" style="display:none;">
                        </div>
                        
                        <div id="importPreview" style="display:none;">
                            <h4 style="margin:16px 0 8px;">Preview Data</h4>
                            <div class="table-container" style="max-height:300px;overflow-y:auto;">
                                <table class="data-table" id="previewTable">
                                    <thead id="previewHead"></thead>
                                    <tbody id="previewBody"></tbody>
                                </table>
                            </div>
                            <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
                                <span id="importStats">0 data siap diimport</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="ImportExport.closeImportModal()">Batal</button>
                    <button class="btn btn-primary" id="importBtn" disabled>
                        <i data-lucide="upload"></i> Import
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        lucide.createIcons();
        
        // Setup drop zone
        this.setupDropZone();
    },
    
    /**
     * Close import modal
     */
    closeImportModal() {
        const modal = document.getElementById('importModal');
        if (modal) {
            modal.remove();
        }
    },
    
    /**
     * Setup drop zone
     */
    setupDropZone() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        
        if (!dropZone || !fileInput) return;
        
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--primary)';
            dropZone.style.background = 'rgba(37,99,235,0.05)';
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = 'var(--gray-300)';
            dropZone.style.background = 'transparent';
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--gray-300)';
            dropZone.style.background = 'transparent';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                this.processFile(fileInput.files[0]);
            }
        });
    },
    
    /**
     * Process file
     */
    async processFile(file) {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
            if (window.showToast) {
                window.showToast('error', 'Error', 'Format file tidak didukung');
            }
            return;
        }
        
        try {
            const data = await this.readFile(file);
            this.showImportPreview(data);
        } catch (error) {
            console.error('Read file error:', error);
            if (window.showToast) {
                window.showToast('error', 'Error', 'Gagal membaca file');
            }
        }
    },
    
    /**
     * Read file
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    if (file.name.match(/\.csv$/)) {
                        const text = e.target.result;
                        const data = this.parseCSV(text);
                        resolve(data);
                    } else {
                        const workbook = XLSX.read(e.target.result, { type: 'array' });
                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        const data = XLSX.utils.sheet_to_json(firstSheet);
                        resolve(data);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            
            if (file.name.match(/\.csv$/)) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    },
    
    /**
     * Parse CSV
     */
    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
        
        return data;
    },
    
    /**
     * Show import preview
     */
    showImportPreview(data) {
        const preview = document.getElementById('importPreview');
        const head = document.getElementById('previewHead');
        const body = document.getElementById('previewBody');
        const stats = document.getElementById('importStats');
        const importBtn = document.getElementById('importBtn');
        
        if (!preview || !head || !body) return;
        
        preview.style.display = 'block';
        
        // Headers
        const headers = Object.keys(data[0] || {});
        head.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        
        // Body (show first 10 rows)
        const previewData = data.slice(0, 10);
        body.innerHTML = previewData.map(row => `
            <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
        `).join('');
        
        // Stats
        stats.textContent = `${data.length} data siap diimport`;
        
        // Enable import button
        importBtn.disabled = false;
        importBtn.onclick = () => this.importData(data);
        
        // Store data
        this.importDataBuffer = data;
    },
    
    /**
     * Import data
     */
    async importData(data) {
        try {
            const importBtn = document.getElementById('importBtn');
            if (importBtn) {
                importBtn.disabled = true;
                importBtn.innerHTML = '<i data-lucide="loader-circle" class="spin"></i> Mengimport...';
            }
            
            // In production, call API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (window.showToast) {
                window.showToast('success', 'Berhasil', `${data.length} data berhasil diimport`);
            }
            
            // Close modal
            this.closeImportModal();
            
            // Refresh data
            if (window.DataTable) {
                window.DataTable.render();
            }
            
        } catch (error) {
            console.error('Import error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat import data');
            }
        }
    },
    
    /**
     * Show export modal
     */
    showExportModal() {
        Swal.fire({
            title: 'Export Data',
            text: 'Pilih format export',
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Excel',
            denyButtonText: 'CSV',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#2563EB',
            denyButtonColor: '#16A34A'
        }).then((result) => {
            if (result.isConfirmed) {
                this.exportExcel();
            } else if (result.isDenied) {
                this.exportCSV();
            }
        });
    },
    
    /**
     * Export to Excel
     */
    async exportExcel() {
        try {
            if (window.showToast) {
                window.showToast('info', 'Loading', 'Mempersiapkan export...');
            }
            
            // Get data
            const data = await this.getExportData();
            
            // Create workbook
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'Data Bank');
            
            // Generate file
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            
            // Download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Data_Bank_${new Date().toISOString().slice(0,10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'Data berhasil diexport');
            }
            
        } catch (error) {
            console.error('Export error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat export data');
            }
        }
    },
    
    /**
     * Export to CSV
     */
    async exportCSV() {
        try {
            const data = await this.getExportData();
            
            if (data.length === 0) {
                if (window.showToast) {
                    window.showToast('warning', 'Peringatan', 'Tidak ada data untuk diexport');
                }
                return;
            }
            
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map(row => headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(','))
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Data_Bank_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'Data berhasil diexport');
            }
            
        } catch (error) {
            console.error('Export CSV error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat export data');
            }
        }
    },
    
    /**
     * Get export data
     */
    async getExportData() {
        // In production, fetch from API
        // For demo, return mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        'Bank': 'BCA',
                        'Group': 'Group A',
                        'Nama Rekening': 'PT Maju Jaya',
                        'Nomor Rekening': '1234567890',
                        'Nomor HP': '081234567890',
                        'Status': 'Aktif',
                        'Masa Aktif': '2024-12-31'
                    },
                    {
                        'Bank': 'Mandiri',
                        'Group': 'Group B',
                        'Nama Rekening': 'CV Sejahtera',
                        'Nomor Rekening': '0987654321',
                        'Nomor HP': '081298765432',
                        'Status': 'Aktif',
                        'Masa Aktif': '2024-11-30'
                    }
                ]);
            }, 500);
        });
    },
    
    /**
     * Create backup
     */
    async createBackup() {
        const result = await Swal.fire({
            title: 'Backup Database',
            text: 'Apakah Anda yakin ingin membuat backup?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Backup',
            cancelButtonText: 'Batal'
        });
        
        if (!result.isConfirmed) return;
        
        try {
            if (window.showToast) {
                window.showToast('info', 'Loading', 'Membuat backup...');
            }
            
            // In production, call API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Download backup
            const backup = {
                timestamp: new Date().toISOString(),
                data: await this.getExportData()
            };
            
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'Backup berhasil dibuat');
            }
            
        } catch (error) {
            console.error('Backup error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat backup');
            }
        }
    },
    
    /**
     * Restore backup
     */
    async restoreBackup() {
        // Show file picker
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const backup = JSON.parse(text);
                
                const result = await Swal.fire({
                    title: 'Restore Database',
                    text: `Apakah Anda yakin ingin merestore backup dari ${backup.timestamp}? Data saat ini akan diganti.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DC2626',
                    confirmButtonText: 'Ya, Restore',
                    cancelButtonText: 'Batal'
                });
                
                if (!result.isConfirmed) return;
                
                if (window.showToast) {
                    window.showToast('info', 'Loading', 'Merestore data...');
                }
                
                // In production, call API
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (window.showToast) {
                    window.showToast('success', 'Berhasil', 'Database berhasil direstore');
                }
                
                // Refresh data
                if (window.DataTable) {
                    window.DataTable.render();
                }
                
            } catch (error) {
                console.error('Restore error:', error);
                if (window.showToast) {
                    window.showToast('error', 'Gagal', 'Terjadi kesalahan saat restore');
                }
            }
        };
        input.click();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImportExport;
} else {
    window.ImportExport = ImportExport;
}
