/**
 * Forms Module - Fixed
 */

const Forms = {
    editData: null,
    users: [],
    API_URL: 'https://script.google.com/macros/s/AKfycbw0H8cbgkuxhravOnkLTqta6Js5QZ8_o85BW-y1Pjjk0c1J76ZSHmBWxznTsI6wHP1j/exec',
    
    /**
     * Initialize forms
     */
    init() {
        console.log('Forms init');
        try {
            this.setupAddDataModal();
            this.setupEditForm();
            this.setupDeleteForm();
            this.setupAddDataButton();
            console.log('Forms initialized successfully');
        } catch (error) {
            console.error('Forms init error:', error);
        }
    },
    
    /**
     * Setup add data button
     */
    setupAddDataButton() {
        const addBtn = document.getElementById('addDataBtn');
        if (addBtn) {
            console.log('Add data button found');
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add data button clicked');
                this.openAddDataModal();
            });
        } else {
            console.warn('Add data button not found');
        }
    },
    
    /**
     * Setup Add Data Modal
     */
    setupAddDataModal() {
        const modal = document.getElementById('addDataModal');
        const closeBtn = document.getElementById('closeAddDataModal');
        const cancelBtn = document.getElementById('cancelAddData');
        const submitBtn = document.getElementById('submitAddData');
        
        if (!modal) {
            console.error('Modal element not found!');
            return;
        }
        
        console.log('Modal found, setting up events');
        
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
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAddDataModal();
            }
        });
        
        // Submit form
        if (submitBtn) {
            submitBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('Submit button clicked');
                await this.submitModalData();
            });
        }
        
        // Set default dates
        this.setDefaultDates();
    },
    
    /**
     * Open Add Data Modal
     */
    openAddDataModal() {
        console.log('Opening add data modal');
        const modal = document.getElementById('addDataModal');
        if (!modal) {
            console.error('Modal not found!');
            alert('Error: Modal tidak ditemukan. Silakan refresh halaman.');
            return;
        }
        
        try {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Reset form
            const form = document.getElementById('addDataFormModal');
            if (form) {
                form.reset();
            }
            this.setDefaultDates();
            
            // Focus first input
            setTimeout(() => {
                const bankInput = document.getElementById('modalBank');
                if (bankInput) {
                    bankInput.focus();
                }
            }, 100);
            
            console.log('Modal opened');
        } catch (error) {
            console.error('Error opening modal:', error);
            alert('Error membuka form. Silakan refresh halaman.');
        }
    },
    
    /**
     * Close Add Data Modal
     */
    closeAddDataModal() {
        console.log('Closing add data modal');
        const modal = document.getElementById('addDataModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
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
     * Submit modal data
     */
    async submitModalData() {
        console.log('Submitting modal data');
        const form = document.getElementById('addDataFormModal');
        const submitBtn = document.getElementById('submitAddData');
        
        if (!form) {
            console.error('Form not found');
            return;
        }
        
        // Validate form
        if (!this.validateModalForm(form)) {
            return;
        }
        
        // Collect data
        const data = this.collectModalData();
        console.log('Data collected:', data);
        
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i data-lucide="loader-circle" class="spin"></i> Menyimpan...';
                lucide.createIcons();
            }
            
            // Save to localStorage (fallback)
            const result = await this.saveToLocalStorage(data);
            
            if (result.success) {
                if (window.showToast) {
                    window.showToast('success', 'Berhasil', 'Data berhasil ditambahkan! 🎉');
                }
                
                this.closeAddDataModal();
                
                // Refresh data
                if (window.DataTable) {
                    await window.DataTable.loadData();
                }
                if (window.Dashboard) {
                    await window.Dashboard.loadStats();
                }
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', error.message || 'Terjadi kesalahan');
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
        const getValue = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };
        
        return {
            bank: getValue('modalBank'),
            group: getValue('modalGroup'),
            nama: getValue('modalNama'),
            noRekening: getValue('modalNoRekening').replace(/\D/g, ''),
            noHP: getValue('modalNoHP').replace(/\D/g, ''),
            masaAktif: getValue('modalMasaAktif'),
            status: getValue('modalStatus'),
            tanggalCek: getValue('modalTanggalCek') || new Date().toISOString().split('T')[0],
            userId: getValue('modalUserId'),
            pinLogin: getValue('modalPinLogin'),
            pinProses: getValue('modalPinProses'),
            idIb: getValue('modalIdIb'),
            passwordIb: getValue('modalPasswordIb'),
            catatan: getValue('modalCatatan')
        };
    },
    
    /**
     * Save to localStorage
     */
    async saveToLocalStorage(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let allData = JSON.parse(localStorage.getItem('bankData') || '[]');
                
                const newEntry = {
                    id: Date.now(),
                    ...data,
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                    updatedBy: AUTH.getSession()?.user || 'System'
                };
                
                allData.push(newEntry);
                localStorage.setItem('bankData', JSON.stringify(allData));
                
                // Log aktivitas
                this.logActivity('Tambah Data', `Menambahkan data: ${data.nama} (${data.noRekening})`);
                
                resolve({ success: true, id: newEntry.id });
            }, 500);
        });
    },
    
    /**
     * Log activity
     */
    logActivity(action, details) {
        const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        const session = AUTH.getSession();
        
        logs.unshift({
            timestamp: new Date().toISOString(),
            user: session?.user || 'System',
            role: session?.role || 'Unknown',
            action: action,
            details: details
        });
        
        if (logs.length > 100) logs.length = 100;
        localStorage.setItem('activityLogs', JSON.stringify(logs));
    },
    
    // ... other methods (loadUsers, addUser, changePassword, etc.)
};

// Initialize Forms when DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, initializing Forms...');
    try {
        if (window.Forms) {
            Forms.init();
        }
    } catch (error) {
        console.error('Forms init error:', error);
    }
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Forms;
} else {
    window.Forms = Forms;
}
