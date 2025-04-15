/**
 * Almacenamiento local para formularios de Rurtools
 * Este archivo maneja el almacenamiento local de datos de formularios
 */

class FormStorage {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.storageKeyPrefix = 'rurtools_form_';
        this.formId = formId;
        this.storageKey = this.storageKeyPrefix + formId;
        this.excludedFields = ['password', 'file']; // Campos que no deben guardarse
        
        // Inicializar
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Cargar datos guardados (si existen)
        this.loadSavedData();
        
        // Escuchar cambios en el formulario para guardarlos
        this.form.addEventListener('input', (e) => {
            this.saveFormData();
        });
        
        // Limpiar datos al enviar exitosamente
        this.form.addEventListener('submit', (e) => {
            // Solo limpiamos si el formulario es válido
            if (this.form.checkValidity()) {
                // Vamos a esperar a que el envío sea exitoso antes de limpiar
                // Esto se maneja en el archivo del controlador de formularios
            }
        });
    }
    
    // Guardar datos del formulario en localStorage
    saveFormData() {
        if (!this.form || !this.isLocalStorageAvailable()) return;
        
        const formData = this.collectFormData();
        localStorage.setItem(this.storageKey, JSON.stringify(formData));
    }
    
    // Cargar datos guardados en el formulario
    loadSavedData() {
        if (!this.form || !this.isLocalStorageAvailable()) return;
        
        const savedData = localStorage.getItem(this.storageKey);
        if (!savedData) return;
        
        try {
            const formData = JSON.parse(savedData);
            this.fillFormWithData(formData);
        } catch (error) {
            console.error('Error al cargar datos guardados:', error);
            localStorage.removeItem(this.storageKey);
        }
    }
    
    // Recolectar datos del formulario
    collectFormData() {
        const formData = {};
        
        if (!this.form) return formData;
        
        const formElements = this.form.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            // Ignorar campos excluidos
            if (this.excludedFields.includes(element.type)) return;
            
            // Ignorar campos sin nombre
            if (!element.name) return;
            
            // Manejar checkboxes y radio buttons
            if (element.type === 'checkbox' || element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } 
            // Manejar selects múltiples
            else if (element.type === 'select-multiple') {
                const selectedOptions = Array.from(element.selectedOptions).map(option => option.value);
                formData[element.name] = selectedOptions;
            } 
            // Manejar otros campos
            else {
                formData[element.name] = element.value;
            }
        });
        
        return formData;
    }
    
    // Rellenar el formulario con datos guardados
    fillFormWithData(formData) {
        if (!this.form || !formData) return;
        
        const formElements = this.form.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            // Ignorar campos sin nombre o campos excluidos
            if (!element.name || this.excludedFields.includes(element.type)) return;
            
            // Si no hay datos para este campo, continuar
            if (!(element.name in formData)) return;
            
            const value = formData[element.name];
            
            // Manejar checkboxes y radio buttons
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = (element.value === value);
            } 
            // Manejar selects múltiples
            else if (element.type === 'select-multiple' && Array.isArray(value)) {
                Array.from(element.options).forEach(option => {
                    option.selected = value.includes(option.value);
                });
            } 
            // Manejar otros campos
            else {
                element.value = value;
            }
        });
    }
    
    // Limpiar datos guardados
    clearSavedData() {
        if (!this.isLocalStorageAvailable()) return;
        localStorage.removeItem(this.storageKey);
    }
    
    // Verificar si hay datos guardados
    hasSavedData() {
        if (!this.isLocalStorageAvailable()) return false;
        return !!localStorage.getItem(this.storageKey);
    }
    
    // Verificar si localStorage está disponible
    isLocalStorageAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Obtener mensajes de recuperación
    getRecoveryMessage() {
        return `
            <div class="alert alert-info" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                Detectamos que completaste este formulario anteriormente pero no pudiste enviarlo.
                <button type="button" class="btn btn-sm btn-info ms-2" id="btn-recover-form-${this.formId}">
                    Recuperar datos
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary ms-2" id="btn-clear-form-${this.formId}">
                    Ignorar
                </button>
            </div>
        `;
    }
} 