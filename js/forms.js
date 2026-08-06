/**
 * Forms Module - COMPLETE with Modal & Google Sheets
 */

const Forms = {
    editData: null,
    users: [],
    API_URL: '', // Isi dengan URL Google Apps Script Anda
    
    /**
     * Initialize forms
     */
    init() {
        this.setupAddDataModal();
        this.setupEditForm();
        this.setupDeleteForm();
    },
    
    /**
     * Setup Add Data Modal
     */
    setupAddDataModal() {
        const addBtn = document.getElementById('addDataBtn');
        const modal = document.getElementById('addDataModal');
        const closeBtn = document.getElementById('closeAddDataModal');
        const cancelBtn = document.getElementById('cancelAddData');
        const submitBtn = document.getElementById('submitAddData');
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openAddDataModal();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeAddDataModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeAddDataModal();
            });
        }
        
        // Close on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAddDataModal();
                }
            });
        }
        
        // Submit form
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                await this.submitModalData();
            });
        }
        
        // Enter key submit
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && modal.classList.contains('active')) {
                e.preventDefault();
                this.submitModalData();
            }
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeAddDataModal();
            }
        });
        
        // Set default dates
        this.setDefaultDates();
    },
    
    /**
     * Set default dates in modal
     */
    setDefaultDates() {
        const masaAktif = document.getElementById('modalMasaAktif');
        if (masaAktif) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            masaAktif.value = date.toISOString().split('T')[0];
        }
        
        const tanggalCek = document.getElementById('modalTanggalCek');
        if (tanggalCek) {
            tanggalCek.value = new Date().toISOString().split('T')[0];
        }
    },
    
    /**
     * Open Add Data Modal
     */
    openAddDataModal() {
        const modal = document.getElementById('addDataModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Reset form
            document.getElementById('addDataFormModal').reset();
            this.setDefaultDates();
            
            // Focus first input
            setTimeout(() => {
                document.getElementById('modalBank').focus();
            }, 100);
        }
    },
    
    /**
     * Close Add Data Modal
     */
    closeAddDataModal() {
        const modal = document.getElementById('addDataModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    /**
     * Submit modal data
     */
    async submitModalData() {
        const form = document.getElementById('addDataFormModal');
        const submitBtn = document.getElementById('submitAddData');
        
        // Validate form
        if (!this.validateModalForm(form)) {
            return;
        }
        
        // Collect data
        const data = this.collectModalData();
        
        try {
            // Show loading
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i data-lucide="loader-circle" class="spin"></i> Menyimpan...';
                lucide.createIcons();
            }
            
            // Kirim ke Google Sheets via API
            const result = await this.sendToGoogleSheets(data);
            
            if (result.success) {
                // Show success
                if (window.showToast) {
                    window.showToast('success', 'Berhasil', 'Data berhasil ditambahkan ke Google Sheets! 🎉');
                }
                
                // Close modal
                this.closeAddDataModal();
                
                // Refresh data table
                if (window.DataTable) {
                    await window.DataTable.loadData();
                }
                
                // Update dashboard stats
                if (window.Dashboard) {
                    await window.Dashboard.loadStats();
                }
            } else {
                throw new Error(result.message || 'Gagal menyimpan data');
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', error.message || 'Terjadi kesalahan saat menyimpan data');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="save"></i> Simpan Data';
                lucide.createIcons();
            }
        }
    },
    
    /**
     * Validate modal form
     */
    validateModalForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'Field ini wajib diisi');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });
        
        // Validate phone
        const phone = document.getElementById('modalNoHP');
        if (phone && phone.value) {
            const cleaned = phone.value.replace(/\D/g, '');
            if (!/^(08|62|8)[0-9]{8,12}$/.test(cleaned)) {
                this.showFieldError(phone, 'Nomor HP tidak valid');
                isValid = false;
            }
        }
        
        // Validate account number
        const acc = document.getElementById('modalNoRekening');
        if (acc && acc.value) {
            const cleaned = acc.value.replace(/\D/g, '');
            if (!/^[0-9]{8,16}$/.test(cleaned)) {
                this.showFieldError(acc, 'Nomor rekening tidak valid (8-16 digit)');
                isValid = false;
            }
        }
        
        return isValid;
    },
    
    /**
     * Show field error
     */
    showFieldError(input, message) {
        input.classList.add('error');
        let errorEl = input.parentElement.querySelector('.error-text');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-text show';
            errorEl.style.cssText = 'font-size:12px;color:var(--danger);margin-top:4px;';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    },
    
    /**
     * Clear field error
     */
    clearFieldError(input) {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.error-text');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    },
    
    /**
     * Collect modal data
     */
    collectModalData() {
        return {
            bank: document.getElementById('modalBank').value,
            group: document.getElementById('modalGroup').value,
            nama: document.getElementById('modalNama').value,
            noRekening: document.getElementById('modalNoRekening').value.replace(/\D/g, ''),
            noHP: document.getElementById('modalNoHP').value.replace(/\D/g, ''),
            masaAktif: document.getElementById('modalMasaAktif').value,
            status: document.getElementById('modalStatus').value,
            tanggalCek: document.getElementById('modalTanggalCek').value || new Date
