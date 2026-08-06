/**
 * Drawer Module
 * Handles the detail drawer functionality
 */

const Drawer = {
    isOpen: false,
    currentData: null,
    
    /**
     * Initialize drawer
     */
    init() {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        const closeBtn = document.getElementById('drawerClose');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Make available globally
        window.drawer = this;
    },
    
    /**
     * Open drawer with data
     */
    open(data) {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (!drawer || !overlay) return;
        
        this.currentData = data;
        this.isOpen = true;
        
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.render(data);
    },
    
    /**
     * Close drawer
     */
    close() {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (!drawer || !overlay) return;
        
        this.isOpen = false;
        this.currentData = null;
        
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    /**
     * Render drawer content
     */
    render(data) {
        const body = document.getElementById('drawerBody');
        if (!body) return;
        
        // Check user permissions
        const session = AUTH.getSession();
        const canSeeSensitive = session && ['LEADER'].includes(session.role);
        
        const mask = (value) => canSeeSensitive ? value : '••••••••';
        const isEditing = data._editMode || false;
        
        let html = `
            <div class="drawer-content">
                <div class="detail-section">
                    <h4 class="detail-section-title">Informasi Umum</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Bank</span>
                            <span class="detail-value">${data.bank || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Group</span>
                            <span class="detail-value">${data.group || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Nama Rekening</span>
                            <span class="detail-value">${data.nama || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Nomor Rekening</span>
                            <span class="detail-value">${data.noRekening || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Nomor HP</span>
                            <span class="detail-value">${data.noHP || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Masa Aktif</span>
                            <span class="detail-value">${data.masaAktif || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Status</span>
                            <span class="detail-value">
                                <span class="status-badge ${data.status?.toLowerCase() || 'inactive'}">
                                    <span class="dot"></span>
                                    ${data.status || 'Nonaktif'}
                                </span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tanggal Cek</span>
                            <span class="detail-value">${data.tanggalCek || '-'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-divider"></div>
                
                <div class="detail-section">
                    <h4 class="detail-section-title">Data Sensitif</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">User ID</span>
                            <span class="detail-value sensitive">${mask(data.userId)}</span>
                            ${canSeeSensitive ? `
                                <button class="detail-copy-btn" data-value="${data.userId || ''}">
                                    <i data-lucide="copy"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">PIN Login</span>
                            <span class="detail-value sensitive">${mask(data.pinLogin)}</span>
                            ${canSeeSensitive ? `
                                <button class="detail-copy-btn" data-value="${data.pinLogin || ''}">
                                    <i data-lucide="copy"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">PIN Proses</span>
                            <span class="detail-value sensitive">${mask(data.pinProses)}</span>
                            ${canSeeSensitive ? `
                                <button class="detail-copy-btn" data-value="${data.pinProses || ''}">
                                    <i data-lucide="copy"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ID IB</span>
                            <span class="detail-value sensitive">${mask(data.idIb)}</span>
                            ${canSeeSensitive ? `
                                <button class="detail-copy-btn" data-value="${data.idIb || ''}">
                                    <i data-lucide="copy"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Password IB</span>
                            <span class="detail-value sensitive">${mask(data.passwordIb)}</span>
                            ${canSeeSensitive ? `
                                <button class="detail-copy-btn" data-value="${data.passwordIb || ''}">
                                    <i data-lucide="copy"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
        `;
        
        // Screenshot
        if (data.screenshot) {
            html += `
                <div class="detail-divider"></div>
                <div class="detail-section">
                    <h4 class="detail-section-title">Screenshot</h4>
                    <img src="${data.screenshot}" alt="Screenshot" class="screenshot-preview">
                </div>
            `;
        }
        
        // Notes
        html += `
            <div class="detail-divider"></div>
            <div class="detail-section">
                <h4 class="detail-section-title">Catatan</h4>
                <div class="detail-note">${data.catatan || 'Tidak ada catatan'}</div>
            </div>
        `;
        
        // Metadata
        html += `
            <div class="detail-divider"></div>
            <div class="detail-section">
                <h4 class="detail-section-title">Informasi Lainnya</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Dibuat</span>
                        <span class="detail-value">${data.created || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Diperbarui</span>
                        <span class="detail-value">${data.updated || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Diperbarui Oleh</span>
                        <span class="detail-value">${data.updatedBy || '-'}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Actions
        html += `
            <div class="detail-divider"></div>
            <div class="detail-actions">
                ${isEditing ? `
                    <button class="btn btn-primary" id="saveEditBtn">
                        <i data-lucide="save"></i>
                        Simpan Perubahan
                    </button>
                    <button class="btn btn-outline" id="cancelEditBtn">
                        Batal
                    </button>
                ` : `
                    <button class="btn btn-primary" id="editDataBtn">
                        <i data-lucide="edit-2"></i>
                        Edit Data
                    </button>
                    ${AUTH.hasAnyRole(['LEADER', 'KAPTEN']) ? `
                        <button class="btn btn-danger" id="deleteDataBtn">
                            <i data-lucide="trash-2"></i>
                            Hapus
                        </button>
                    ` : ''}
                `}
            </div>
        `;
        
        body.innerHTML = html;
        
        // Re-render icons
        lucide.createIcons();
        
        // Attach action handlers
        this.attachActionHandlers(data);
    },
    
    /**
     * Attach action handlers
     */
    attachActionHandlers(data) {
        // Copy buttons
        document.querySelectorAll('.detail-copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const value = btn.dataset.value;
                if (value) {
                    try {
                        await navigator.clipboard.writeText(value);
                        if (window.showToast) {
                            window.showToast('success', 'Berhasil', 'Data berhasil disalin');
                        }
                    } catch (error) {
                        console.error('Copy error:', error);
                    }
                }
            });
        });
        
        // Edit button
        const editBtn = document.getElementById('editDataBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                // Open edit modal
                if (window.openModal) {
                    window.openModal('edit', data);
                }
            });
        }
        
        // Delete button
        const deleteBtn = document.getElementById('deleteDataBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
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
                    // Handle delete
                    if (window.DataTable) {
                        window.DataTable.handleDelete(data.id);
                    }
                    this.close();
                }
            });
        }
        
        // Save edit button
        const saveBtn = document.getElementById('saveEditBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // Handle save
                if (window.showToast) {
                    window.showToast('success', 'Berhasil', 'Data berhasil diperbarui');
                }
                this.close();
            });
        }
        
        // Cancel edit button
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.close();
            });
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Drawer;
} else {
    window.Drawer = Drawer;
}