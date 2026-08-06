/**
 * Forms Module
 * Handles form rendering, validation, and submission
 */

const Forms = {
    /**
     * Initialize forms
     */
    init() {
        this.setupAddForm();
        this.setupEditForm();
        this.setupDeleteForm();
    },
    
    /**
     * Setup add data form
     */
    setupAddForm() {
        const form = document.getElementById('addDataForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form
            if (!this.validateForm(form)) {
                return;
            }
            
            // Collect data
            const data = this.collectFormData(form);
            
            // Submit data
            await this.submitAddData(data);
        });
        
        // Setup form fields with validation
        this.setupFieldValidation(form);
    },
    
    /**
     * Setup edit form
     */
    setupEditForm() {
        // Edit form will be shown in modal/drawer
        // This is handled by the edit button in data table
    },
    
    /**
     * Setup delete confirmation
     */
    setupDeleteForm() {
        // Delete is handled in data-table module
    },
    
    /**
     * Validate form
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            // Check if required
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showFieldError(input, 'Field ini wajib diisi');
                isValid = false;
                return;
            }
            
            // Check phone number
            if (input.id === 'noHP' || input.name === 'noHP') {
                const phone = input.value.replace(/\s/g, '');
                if (phone && !/^(08|62|8)[0-9]{8,12}$/.test(phone)) {
                    this.showFieldError(input, 'Nomor HP tidak valid');
                    isValid = false;
                    return;
                }
            }
            
            // Check account number
            if (input.id === 'noRekening' || input.name === 'noRekening') {
                const acc = input.value.replace(/\s/g, '');
                if (acc && !/^[0-9]{8,16}$/.test(acc)) {
                    this.showFieldError(input, 'Nomor rekening tidak valid');
                    isValid = false;
                    return;
                }
            }
            
            // Clear error if valid
            this.clearFieldError(input);
        });
        
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
            errorEl.className = 'error-text';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.classList.add('show');
    },
    
    /**
     * Clear field error
     */
    clearFieldError(input) {
        input.classList.remove('error');
        
        const errorEl = input.parentElement.querySelector('.error-text');
        if (errorEl) {
            errorEl.classList.remove('show');
        }
    },
    
    /**
     * Setup field validation on blur
     */
    setupFieldValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                // Validate on blur
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                // Clear error on input
                this.clearFieldError(input);
                
                // Auto-format phone numbers
                if (input.id === 'noHP' || input.name === 'noHP') {
                    this.formatPhone(input);
                }
                
                // Auto-format account numbers
                if (input.id === 'noRekening' || input.name === 'noRekening') {
                    this.formatAccountNumber(input);
                }
            });
        });
    },
    
    /**
     * Validate single field
     */
    validateField(input) {
        if (!input.hasAttribute('required')) return true;
        
        if (!input.value.trim()) {
            this.showFieldError(input, 'Field ini wajib diisi');
            return false;
        }
        
        // Phone validation
        if (input.id === 'noHP' || input.name === 'noHP') {
            const phone = input.value.replace(/\s/g, '');
            if (!/^(08|62|8)[0-9]{8,12}$/.test(phone)) {
                this.showFieldError(input, 'Nomor HP tidak valid (contoh: 081234567890)');
                return false;
            }
        }
        
        // Account number validation
        if (input.id === 'noRekening' || input.name === 'noRekening') {
            const acc = input.value.replace(/\s/g, '');
            if (!/^[0-9]{8,16}$/.test(acc)) {
                this.showFieldError(input, 'Nomor rekening tidak valid (8-16 digit)');
                return false;
            }
        }
        
        this.clearFieldError(input);
        return true;
    },
    
    /**
     * Format phone number
     */
    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        input.value = value;
    },
    
    /**
     * Format account number
     */
    formatAccountNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        input.value = value;
    },
    
    /**
     * Collect form data
     */
    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },
    
    /**
     * Submit add data
     */
    async submitAddData(data) {
        try {
            // Show loading
            const submitBtn = document.querySelector('#addDataForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i data-lucide="loader-circle" class="spin"></i> Menyimpan...';
            }
            
            // In production, call API
            // For demo, show success
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'Data berhasil ditambahkan');
            }
            
            // Reset form
            document.getElementById('addDataForm').reset();
            
            // Refresh data table
            if (window.DataTable) {
                window.DataTable.render();
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat menyimpan data');
            }
        } finally {
            const submitBtn = document.querySelector('#addDataForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="save"></i> Simpan Data';
            }
        }
    },
    
    /**
     * Open edit modal
     */
    async openEditModal(data) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.id = 'editModal';
        
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Edit Data</h3>
                    <button class="modal-close" onclick="Forms.closeEditModal()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editDataForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Bank <span class="required">*</span></label>
                                <input type="text" name="bank" value="${data.bank || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Group <span class="required">*</span></label>
                                <input type="text" name="group" value="${data.group || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Nama Rekening <span class="required">*</span></label>
                                <input type="text" name="nama" value="${data.nama || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Nomor Rekening <span class="required">*</span></label>
                                <input type="text" name="noRekening" value="${data.noRekening || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Nomor HP <span class="required">*</span></label>
                                <input type="text" name="noHP" value="${data.noHP || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Masa Aktif <span class="required">*</span></label>
                                <input type="date" name="masaAktif" value="${data.masaAktif || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Status <span class="required">*</span></label>
                                <select name="status" required>
                                    <option value="Aktif" ${data.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
                                    <option value="Expired" ${data.status === 'Expired' ? 'selected' : ''}>Expired</option>
                                    <option value="Nonaktif" ${data.status === 'Nonaktif' ? 'selected' : ''}>Nonaktif</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Tanggal Cek</label>
                                <input type="date" name="tanggalCek" value="${data.tanggalCek || ''}">
                            </div>
                            <div class="form-group full-width">
                                <label>Catatan</label>
                                <textarea name="catatan" rows="3">${data.catatan || ''}</textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="Forms.closeEditModal()">Batal</button>
                    <button class="btn btn-primary" onclick="Forms.submitEdit('${data.id}')">
                        <i data-lucide="save"></i> Simpan
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        lucide.createIcons();
        
        // Store data
        this.editData = data;
    },
    
    /**
     * Close edit modal
     */
    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.remove();
        }
    },
    
    /**
     * Submit edit
     */
    async submitEdit(id) {
        const form = document.getElementById('editDataForm');
        if (!form) return;
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Collect data
        const data = this.collectFormData(form);
        
        try {
            // In production, call API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'Data berhasil diperbarui');
            }
            
            // Close modal
            this.closeEditModal();
            
            // Refresh data
            if (window.DataTable) {
                window.DataTable.render();
            }
            
        } catch (error) {
            console.error('Edit error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat memperbarui data');
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Forms;
} else {
    window.Forms = Forms;
}
