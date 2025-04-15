/**
 * Mejoras de accesibilidad para formularios de Rurtools
 * Este archivo añade mejoras de accesibilidad a los formularios
 */

class FormAccessibility {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.formId = formId;
        
        // Inicializar
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Añadir atributos ARIA a los campos
        this.addAriaAttributes();
        
        // Mejorar el feedback para lectores de pantalla
        this.setupScreenReaderFeedback();
        
        // Añadir soporte para navegación por teclado
        this.setupKeyboardNavigation();
    }
    
    // Añadir atributos ARIA a los campos del formulario
    addAriaAttributes() {
        // Añadir roles adecuados
        this.form.setAttribute('role', 'form');
        
        // Buscar todos los grupos de formularios
        const formGroups = this.form.querySelectorAll('.form-floating');
        formGroups.forEach((group, index) => {
            // Obtener el campo de entrada y la etiqueta asociada
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (!input || !label) return;
            
            // Asegurarse de que cada input tenga un ID único
            if (!input.id) {
                input.id = `${this.formId}-field-${index}`;
            }
            
            // Establecer el atributo for en la etiqueta para asociarla con el input
            label.setAttribute('for', input.id);
            
            // Añadir atributos ARIA
            input.setAttribute('aria-labelledby', label.id || `${input.id}-label`);
            
            // Si la etiqueta no tiene ID, asignarle uno
            if (!label.id) {
                label.id = `${input.id}-label`;
            }
            
            // Para campos requeridos
            if (input.required) {
                input.setAttribute('aria-required', 'true');
                
                // Añadir indicador visual de campo requerido
                if (!label.querySelector('.required-indicator')) {
                    const requiredIndicator = document.createElement('span');
                    requiredIndicator.className = 'required-indicator';
                    requiredIndicator.textContent = ' *';
                    requiredIndicator.setAttribute('aria-hidden', 'true');
                    label.appendChild(requiredIndicator);
                }
            }
            
            // Para campos con descripciones adicionales
            const helpText = group.querySelector('.form-text');
            if (helpText) {
                if (!helpText.id) {
                    helpText.id = `${input.id}-help`;
                }
                input.setAttribute('aria-describedby', helpText.id);
            }
            
            // Para selects, asegurarse que tienen un valor por defecto descriptivo
            if (input.tagName === 'SELECT') {
                const firstOption = input.querySelector('option:first-child');
                if (firstOption && !firstOption.value) {
                    firstOption.textContent = `Seleccionar ${label.textContent}`;
                }
            }
        });
        
        // Añadir atributos ARIA para mensajes de error
        const errorContainers = this.form.querySelectorAll('.invalid-feedback');
        errorContainers.forEach(container => {
            if (!container.id) {
                const input = container.previousElementSibling;
                if (input) {
                    container.id = `${input.id}-error`;
                    input.setAttribute('aria-errormessage', container.id);
                }
            }
        });
        
        // Mejorar el botón de envío
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.setAttribute('aria-label', submitButton.textContent.trim());
        }
    }
    
    // Configurar feedback para lectores de pantalla
    setupScreenReaderFeedback() {
        // Crear un div para anuncios a lectores de pantalla
        let srAnnouncer = document.getElementById(`${this.formId}-sr-announcer`);
        if (!srAnnouncer) {
            srAnnouncer = document.createElement('div');
            srAnnouncer.id = `${this.formId}-sr-announcer`;
            srAnnouncer.className = 'sr-only';
            srAnnouncer.setAttribute('aria-live', 'polite');
            srAnnouncer.setAttribute('aria-atomic', 'true');
            this.form.appendChild(srAnnouncer);
        }
        
        // Función para anunciar mensajes a lectores de pantalla
        this.announce = (message) => {
            srAnnouncer.textContent = message;
            
            // Limpiar el mensaje después de un tiempo
            setTimeout(() => {
                srAnnouncer.textContent = '';
            }, 5000);
        };
        
        // Escuchar validación de campos
        this.form.addEventListener('input', (e) => {
            const input = e.target;
            
            // Solo para campos con validación
            if (input.nodeName !== 'INPUT' && input.nodeName !== 'SELECT' && input.nodeName !== 'TEXTAREA') {
                return;
            }
            
            // Obtener el estado de validación después de un breve retraso
            setTimeout(() => {
                if (!input.validity.valid && input.validationMessage) {
                    this.announce(`Campo ${input.name || 'de formulario'}: ${input.validationMessage}`);
                    input.setAttribute('aria-invalid', 'true');
                } else {
                    input.removeAttribute('aria-invalid');
                }
            }, 200);
        });
        
        // Anunciar resultado del envío del formulario
        this.form.addEventListener('submit', (e) => {
            // Esto será manejado por el FormController
        });
    }
    
    // Configurar mejoras de navegación por teclado
    setupKeyboardNavigation() {
        // Añadir soporte para navegación con Tab
        const focusableElements = this.form.querySelectorAll('input, select, textarea, button, a');
        
        focusableElements.forEach(element => {
            // Asegurarse de que todos los elementos se pueden enfocar con Tab
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Añadir soporte para Enter en algunos elementos interactivos
            if (element.tagName === 'SELECT') {
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        element.click();
                    }
                });
            }
        });
    }
    
    // Añadir instrucciones de accesibilidad al inicio del formulario
    addAccessibilityInstructions() {
        const instructions = document.createElement('div');
        instructions.className = 'accessibility-instructions mb-3';
        instructions.innerHTML = `
            <p class="form-text" id="${this.formId}-instructions">
                <small>
                    <i class="fas fa-info-circle me-1"></i>
                    Todos los campos marcados con * son obligatorios. 
                    Utiliza la tecla Tab para navegar entre los campos.
                </small>
            </p>
        `;
        
        // Insertar al inicio del formulario
        const firstChild = this.form.firstChild;
        this.form.insertBefore(instructions, firstChild);
        
        // Asociar formulario con las instrucciones
        this.form.setAttribute('aria-describedby', `${this.formId}-instructions`);
    }
    
    // Anunciar mensajes a lectores de pantalla
    announce(message) {
        const announcer = document.getElementById(`${this.formId}-sr-announcer`);
        if (announcer) {
            announcer.textContent = message;
            
            // Limpiar después de un tiempo
            setTimeout(() => {
                announcer.textContent = '';
            }, 5000);
        }
    }
} 