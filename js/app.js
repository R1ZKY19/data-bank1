/* Modal Styles - Tambahkan di components.css */
.modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 3000;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px;
    overflow-y: auto;
}

.modal-overlay.active {
    display: flex;
}

.modal-overlay .modal {
    background: white;
    border-radius: var(--border-radius);
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-2xl);
    animation: slideInRight 0.3s ease-out;
    margin: auto;
}

.modal-overlay .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--gray-200);
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.modal-overlay .modal-header h3 {
    font-size: 18px;
    font-weight: 700;
}

.modal-overlay .modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--gray-100);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-500);
    transition: var(--transition);
}

.modal-overlay .modal-close:hover {
    background: var(--gray-200);
}

.modal-overlay .modal-body {
    padding: 24px;
}

.modal-overlay .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--gray-200);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    position: sticky;
    bottom: 0;
    background: white;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
}

/* Form dalam modal */
.modal-overlay .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.modal-overlay .form-group {
    margin-bottom: 0;
}

.modal-overlay .form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: 4px;
}

.modal-overlay .form-group .required {
    color: var(--danger);
}

.modal-overlay .form-group input,
.modal-overlay .form-group select,
.modal-overlay .form-group textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--gray-200);
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: var(--dark);
    transition: var(--transition);
    background: white;
}

.modal-overlay .form-group input:focus,
.modal-overlay .form-group select:focus,
.modal-overlay .form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05);
}

.modal-overlay .form-group input.error,
.modal-overlay .form-group select.error,
.modal-overlay .form-group textarea.error {
    border-color: var(--danger);
}

@media (max-width: 640px) {
    .modal-overlay .form-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-overlay {
        padding: 16px;
        align-items: center;
    }
    
    .modal-overlay .modal {
        max-height: 95vh;
    }
}
