/**
 * Estados de formularios para Rurtools
 * Este archivo contiene el manejo de estados visuales de los formularios
 */

class FormStates {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitButton = this.form ? this.form.querySelector('button[type="submit"]') : null;
        this.originalButtonText = this.submitButton ? this.submitButton.innerHTML : 'Enviar';
        
        // Clase para mensaje de estado
        this.statusMessageClass = 'form-status-message';
        
        // Inicializar
        this.init();
    }
    
    init() {
        // Crear contenedor para mensajes de estado si no existe
        if (this.form && !this.form.querySelector('.' + this.statusMessageClass)) {
            const statusDiv = document.createElement('div');
            statusDiv.className = this.statusMessageClass;
            statusDiv.style.display = 'none';
            
            // Insertar después del botón de envío
            if (this.submitButton && this.submitButton.parentNode) {
                const targetContainer = this.submitButton.parentNode;
                targetContainer.appendChild(statusDiv);
            } else {
                this.form.appendChild(statusDiv);
            }
        }
    }
    
    // Obtener el contenedor de mensajes de estado
    getStatusContainer() {
        return this.form ? this.form.querySelector('.' + this.statusMessageClass) : null;
    }
    
    // Limpiar todos los mensajes de estado 
    clearStatusMessages() {
        if (!this.form) return;
        
        // Limpiar cualquier mensaje de estado existente
        const statusMessages = this.form.querySelectorAll('.' + this.statusMessageClass + ', .form-response-message, .alert');
        statusMessages.forEach(el => {
            if (el.style) {
                el.style.display = 'none';
            }
            el.innerHTML = '';
        });
    }
    
    // Mostrar estado de carga
    showLoading() {
        if (!this.form) return;
        
        // Limpiar mensajes existentes
        this.clearStatusMessages();
        
        // Deshabilitar el botón de envío
        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Enviando...
            `;
        }
        
        // Deshabilitar todos los campos del formulario
        const formElements = this.form.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            element.setAttribute('readonly', 'readonly');
            element.classList.add('disabled-field');
        });
    }
    
    // Restaurar el formulario después de mostrar loading
    hideLoading() {
        if (!this.form) return;
        
        // Habilitar el botón de envío
        if (this.submitButton) {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalButtonText;
        }
        
        // Habilitar todos los campos del formulario
        const formElements = this.form.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            element.removeAttribute('readonly');
            element.classList.remove('disabled-field');
        });
    }
    
    // Mostrar mensaje de éxito
    showSuccess(message = "¡Gracias! Tu mensaje ha sido enviado correctamente.") {
        if (!this.form) return;
        
        // Limpiar mensajes existentes
        this.clearStatusMessages();
        
        const statusContainer = this.getStatusContainer();
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <i class="fas fa-check-circle me-2"></i> ${message}
                </div>
            `;
            statusContainer.style.display = 'block';
            
            // Hacer scroll al mensaje
            statusContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // También podemos usar SweetAlert2 si está disponible
        if (window.Swal) {
            // Cerrar alertas previas si existen
            if (Swal.isVisible()) {
                Swal.close();
            }
            
            // Mostrar nueva alerta
            setTimeout(() => {
                Swal.fire({
                    title: '¡Enviado!',
                    text: message,
                    icon: 'success',
                    confirmButtonColor: '#0066cc',
                    confirmButtonText: 'Aceptar',
                    background: '#ffffff',
                    iconColor: '#0066cc'
                });
            }, 100);
        }
        
        // Opcional: resetear el formulario después de un éxito
        setTimeout(() => {
            this.form.reset();
        }, 2000);
    }
    
    // Mostrar mensaje de error
    showError(message = "Ha ocurrido un error. Por favor, intenta nuevamente.") {
        if (!this.form) return;
        
        // Limpiar mensajes existentes
        this.clearStatusMessages();
        
        const statusContainer = this.getStatusContainer();
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i> ${message}
                </div>
            `;
            statusContainer.style.display = 'block';
            
            // Hacer scroll al mensaje
            statusContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // También podemos usar SweetAlert2 si está disponible
        if (window.Swal) {
            // Cerrar alertas previas si existen
            if (Swal.isVisible()) {
                Swal.close();
            }
            
            // Mostrar nueva alerta
            setTimeout(() => {
                Swal.fire({
                    title: 'Error',
                    text: message,
                    icon: 'error',
                    confirmButtonColor: '#0066cc',
                    confirmButtonText: 'Aceptar',
                    background: '#ffffff'
                });
            }, 100);
        }
        
        // Restaurar el formulario a su estado original
        this.hideLoading();
    }
    
    // Ocultar mensajes de estado
    hideStatusMessages() {
        if (!this.form) return;
        
        this.clearStatusMessages();
    }
} 