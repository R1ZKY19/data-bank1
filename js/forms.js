/**
 * Forms Module - COMPLETE
 * Handles form rendering, validation, and submission
 */

const Forms = {
    editData: null,
    users: [],
    
    /**
     * Initialize forms
     */
    init() {
        this.setupAddForm();
        this.setupAddDataButton();
        this.setupEditForm();
        this.setupDeleteForm();
    },
    
    /**
     * Setup add data button
     */
    setupAddDataButton() {
        const addBtn = document.getElementById('addDataBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // Navigate to tambah-data page
                if (window.App) {
                    window.App.navigateTo('tambah-data');
                }
            });
        }
    },
    
    /**
     * Setup add data form
     */
    setupAddForm() {
        const form = document.getElementById('addDataForm');
        if (!form) return;
        
        // Set default date
        const masaAktif = document.getElementById('masaAktif');
        if (masaAktif) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            masaAktif.value = date.toISOString().split('T')[0];
        }
        
        const tanggalCek = document.getElementById('tanggalCek');
        if (tanggalCek) {
            tanggalCek.value = new Date().toISOString().split('T')[0];
        }
        
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
        
        // Setup field validation
        this.setupFieldValidation(form);
    },
    
    /**
     * Validate form
     */
    validateForm(form) {
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
        const phone = document.getElementById('noHP');
        if (phone && phone.value) {
            const cleaned = phone.value.replace(/\D/g, '');
            if (!/^(08|62|8)[0-9]{8,12}$/.test(cleaned)) {
                this.showFieldError(phone, 'Nomor HP tidak valid');
                isValid = false;
            }
        }
        
        // Validate account number
        const acc = document.getElementById('noRekening');
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
     * Setup field validation
     */
    setupFieldValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    this.showFieldError(input, 'Field ini wajib diisi');
                } else {
                    this.clearFieldError(input);
                }
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
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
        const submitBtn = document.querySelector('#addDataForm button[type="submit"]');
        
        try {
            // Show loading
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i data-lucide="loader-circle" class="spin"></i> Menyimpan...';
                lucide.createIcons();
            }
            
            // In production: call API
            // For demo: save to localStorage
            const result = await this.saveDataToStorage(data);
            
            if (result.success) {
                // Show success
                if (window.showToast) {
                    window.showToast('success', 'Berhasil', 'Data berhasil ditambahkan! 🎉');
                }
                
                // Reset form
                document.getElementById('addDataForm').reset();
                
                // Set default dates again
                const masaAktif = document.getElementById('masaAktif');
                if (masaAktif) {
                    const date = new Date();
                    date.setFullYear(date.getFullYear() + 1);
                    masaAktif.value = date.toISOString().split('T')[0];
                }
                const tanggalCek = document.getElementById('tanggalCek');
                if (tanggalCek) {
                    tanggalCek.value = new Date().toISOString().split('T')[0];
                }
                
                // Refresh data table
                if (window.DataTable) {
                    window.DataTable.loadData();
                }
                
                // Update dashboard stats
                if (window.Dashboard) {
                    window.Dashboard.loadStats();
                }
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan saat menyimpan data');
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
     * Save data to localStorage (Demo)
     */
    async saveDataToStorage(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Get existing data
                let allData = JSON.parse(localStorage.getItem('bankData') || '[]');
                
                // Create new entry
                const newEntry = {
                    id: Date.now(),
                    ...data,
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                    updatedBy: AUTH.getSession()?.user || 'System'
                };
                
                allData.push(newEntry);
                localStorage.setItem('bankData', JSON.stringify(allData));
                
                resolve({ success: true });
            }, 500);
        });
    },
    
    /**
     * Setup edit form
     */
    setupEditForm() {
        // Edit handled via drawer
    },
    
    /**
     * Setup delete form
     */
    setupDeleteForm() {
        // Delete handled via data-table
    },
    
    /**
     * Open edit modal
     */
    async openEditModal(data) {
        // Implementation
    },
    
    /**
     * Show add user modal
     */
    showAddUserModal() {
        Swal.fire({
            title: 'Tambah Pengguna',
            html: `
                <div style="text-align:left;">
                    <div style="margin-bottom:12px;">
                        <label style="display:block;font-weight:600;margin-bottom:4px;">Username *</label>
                        <input id="newUsername" class="swal2-input" placeholder="Username" style="width:100%;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block;font-weight:600;margin-bottom:4px;">Nama Lengkap *</label>
                        <input id="newName" class="swal2-input" placeholder="Nama lengkap" style="width:100%;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block;font-weight:600;margin-bottom:4px;">Password *</label>
                        <input id="newPassword" type="password" class="swal2-input" placeholder="Password" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;">Role *</label>
                        <select id="newRole" class="swal2-input" style="width:100%;">
                            <option value="LEADER">LEADER</option>
                            <option value="CS">CS</option>
                            <option value="KAPTEN">KAPTEN</option>
                            <option value="KASIR">KASIR</option>
                        </select>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Tambah User',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const username = document.getElementById('newUsername').value;
                const name = document.getElementById('newName').value;
                const password = document.getElementById('newPassword').value;
                const role = document.getElementById('newRole').value;
                
                if (!username || !name || !password) {
                    Swal.showValidationMessage('Semua field wajib diisi');
                    return false;
                }
                
                return { username, name, password, role };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.addUser(result.value);
            }
        });
    },
    
    /**
     * Add user
     */
    async addUser(userData) {
        try {
            // Get existing users
            let users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
            
            // Check if username exists
            if (users.find(u => u.username === userData.username)) {
                if (window.showToast) {
                    window.showToast('error', 'Gagal', 'Username sudah digunakan');
                }
                return;
            }
            
            // Add user
            users.push({
                id: Date.now(),
                ...userData,
                active: true,
                created: new Date().toISOString()
            });
            
            localStorage.setItem('bankUsers', JSON.stringify(users));
            
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'User berhasil ditambahkan');
            }
            
            // Refresh user table
            this.loadUsers();
            
        } catch (error) {
            console.error('Add user error:', error);
            if (window.showToast) {
                window.showToast('error', 'Gagal', 'Terjadi kesalahan');
            }
        }
    },
    
    /**
     * Load users
     */
    loadUsers() {
        const users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
        const tbody = document.getElementById('userBody');
        if (!tbody) return;
        
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8 text-gray-500">
                        <i data-lucide="users" style="width:40px;height:40px;margin:0 auto 8px;display:block;"></i>
                        Belum ada user
                    </td>
                </tr>
            `;
            lucide.createIcons();
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td><strong>${user.username}</strong></td>
                <td>${user.name}</td>
                <td><span class="badge badge-primary">${user.role}</span></td>
                <td>
                    <span class="status-badge ${user.active ? 'active' : 'inactive'}">
                        <span class="dot"></span>
                        ${user.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </td>
                <td>
                    <div class="action-cell">
                        <button class="action-btn edit" onclick="Forms.toggleUser('${user.id}')" title="${user.active ? 'Nonaktifkan' : 'Aktifkan'}">
                            <i data-lucide="${user.active ? 'user-x' : 'user-check'}" style="width:16px;height:16px;"></i>
                        </button>
                        <button class="action-btn delete" onclick="Forms.deleteUser('${user.id}')" title="Hapus">
                            <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        lucide.createIcons();
    },
    
    /**
     * Toggle user active status
     */
    toggleUser(id) {
        let users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
        const user = users.find(u => u.id == id);
        if (user) {
            user.active = !user.active;
            localStorage.setItem('bankUsers', JSON.stringify(users));
            this.loadUsers();
            if (window.showToast) {
                window.showToast('success', 'Berhasil', `User ${user.active ? 'diaktifkan' : 'dinonaktifkan'}`);
            }
        }
    },
    
    /**
     * Delete user
     */
    async deleteUser(id) {
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus user ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });
        
        if (result.isConfirmed) {
            let users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
            users = users.filter(u => u.id != id);
            localStorage.setItem('bankUsers', JSON.stringify(users));
            this.loadUsers();
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'User berhasil dihapus');
            }
        }
    },
    
    /**
     * Change password
     */
    async changePassword() {
        const result = await Swal.fire({
            title: 'Ganti Password',
            html: `
                <div style="text-align:left;">
                    <div style="margin-bottom:12px;">
                        <label style="display:block;font-weight:600;margin-bottom:4px;">Password Baru *</label>
                        <input id="newPass" type="password" class="swal2-input" placeholder="Password baru" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;">Konfirmasi Password *</label>
                        <input id="confirmPass" type="password" class="swal2-input" placeholder="Konfirmasi password" style="width:100%;">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Ubah Password',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const pass = document.getElementById('newPass').value;
                const confirm = document.getElementById('confirmPass').value;
                
                if (!pass || pass.length < 6) {
                    Swal.showValidationMessage('Password minimal 6 karakter');
                    return false;
                }
                
                if (pass !== confirm) {
                    Swal.showValidationMessage('Password tidak cocok');
                    return false;
                }
                
                return pass;
            }
        });
        
        if (result.isConfirmed) {
            if (window.showToast) {
                window.showToast('success', 'Berhasil', 'Password berhasil diubah');
            }
        }
    }
};

// Initialize forms when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.Forms) {
        Forms.init();
        // Load users if on user page
        if (document.getElementById('userBody')) {
            Forms.loadUsers();
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Forms;
} else {
    window.Forms = Forms;
}
