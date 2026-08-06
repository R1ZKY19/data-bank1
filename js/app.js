document.addEventListener('DOMContentLoaded', function() {
    console.log('App started');
    
    // Check login
    const session = localStorage.getItem('bankSession');
    if (!session && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Show alert that app is working
    console.log('App is working!');
    
    // Initialize add data button
    const addBtn = document.getElementById('addDataBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            alert('Tambah Data clicked!');
            const modal = document.getElementById('addDataModal');
            if (modal) {
                modal.classList.add('active');
            } else {
                alert('Modal not found!');
            }
        });
    }
    
    // Initialize close modal
    const closeBtn = document.getElementById('closeAddDataModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = document.getElementById('addDataModal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    const cancelBtn = document.getElementById('cancelAddData');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const modal = document.getElementById('addDataModal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Submit form
    const submitBtn = document.getElementById('submitAddData');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const bank = document.getElementById('modalBank');
            const nama = document.getElementById('modalNama');
            if (bank && nama && bank.value && nama.value) {
                alert('Data berhasil ditambahkan!\nBank: ' + bank.value + '\nNama: ' + nama.value);
                const modal = document.getElementById('addDataModal');
                if (modal) {
                    modal.classList.remove('active');
                }
            } else {
                alert('Mohon isi semua field yang wajib!');
            }
        });
    }
    
    // Sidebar navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
            });
            const target = document.getElementById('page-' + page);
            if (target) {
                target.classList.add('active');
            }
            document.querySelectorAll('.nav-item').forEach(n => {
                n.classList.remove('active');
            });
            this.classList.add('active');
            
            const titles = {
                dashboard: 'Dashboard',
                'data-bank': 'Data Bank',
                riwayat: 'Riwayat',
                import: 'Import',
                export: 'Export',
                laporan: 'Laporan',
                pengguna: 'Pengguna',
                pengaturan: 'Pengaturan',
                profil: 'Profil'
            };
            const titleEl = document.getElementById('pageTitle');
            if (titleEl) {
                titleEl.textContent = titles[page] || page;
            }
        });
    });
});
