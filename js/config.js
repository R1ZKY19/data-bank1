// config.js - Configuration
export const CONFIG = {
    // Ganti dengan URL Google Apps Script deployment Anda
    API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    
    APP_NAME: 'Bank Management Dashboard',
    APP_VERSION: '1.0.0',
    
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 menit
    AUTO_LOGOUT_TIME: 30 * 60 * 1000,
    
    PAGINATION_LIMIT: 20,
    
    ROLES: {
        LEADER: 'leader',
        CS: 'cs',
        KAPTEN: 'kapten',
        KASIR: 'kasir'
    },
    
    ROLE_PERMISSIONS: {
        leader: {
            viewAll: true,
            add: true,
            edit: true,
            delete: true,
            import: true,
            export: true,
            backup: true,
            restore: true,
            manageUsers: true,
            resetPassword: true,
            viewAuditLog: true,
            viewLoginActivity: true,
            systemSettings: true,
            manageRoles: true,
            enableDisableUser: true,
            viewPassword: true,
            viewPIN: true
        },
        cs: {
            viewAll: true,
            add: true,
            edit: true,
            delete: false,
            import: false,
            export: false,
            backup: false,
            restore: false,
            manageUsers: false,
            resetPassword: false,
            viewAuditLog: false,
            viewLoginActivity: false,
            systemSettings: false,
            manageRoles: false,
            enableDisableUser: false,
            viewPassword: false,
            viewPIN: false
        },
        kapten: {
            viewAll: true,
            add: true,
            edit: true,
            delete: true,
            import: false,
            export: true,
            backup: false,
            restore: false,
            manageUsers: false,
            resetPassword: false,
            viewAuditLog: false,
            viewLoginActivity: false,
            systemSettings: false,
            manageRoles: false,
            enableDisableUser: false,
            viewPassword: false,
            viewPIN: false
        },
        kasir: {
            viewAll: false,
            add: false,
            edit: false,
            delete: false,
            import: false,
            export: false,
            backup: false,
            restore: false,
            manageUsers: false,
            resetPassword: false,
            viewAuditLog: false,
            viewLoginActivity: false,
            systemSettings: false,
            manageRoles: false,
            enableDisableUser: false,
            viewPassword: false,
            viewPIN: false
        }
    }
};
