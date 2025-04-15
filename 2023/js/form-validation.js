/**
 * Validación de formularios para Rurtools
 * Este archivo contiene todas las funciones de validación para los formularios
 */

// Clase de validación de formularios
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = [];
        this.errorClass = 'is-invalid';
        this.errorMessageClass = 'invalid-feedback';
    }

    // Validar campos requeridos
    validateRequired(fieldId, message = "Este campo es obligatorio") {
        const field = document.getElementById(fieldId);
        if (!field) return true; // Si el campo no existe, ignoramos la validación
        
        if (!field.value.trim()) {
            this.addError(field, message);
            return false;
        }
        return true;
    }

    // Validar formato de email
    validateEmail(fieldId, message = "Por favor ingresa un email válido") {
        const field = document.getElementById(fieldId);
        if (!field) return true; // Si el campo no existe, ignoramos la validación
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value.trim() && !emailRegex.test(field.value.trim())) {
            this.addError(field, message);
            return false;
        }
        return true;
    }

    // Validar formato de teléfono (acepta varios formatos comunes en Argentina)
    validatePhone(fieldId, message = "Por favor ingresa un número de teléfono válido") {
        const field = document.getElementById(fieldId);
        if (!field) return true; // Si el campo no existe, ignoramos la validación
        
        // Permite formatos: +54 9 11 1234-5678, 011 1234-5678, 1512345678, etc.
        const phoneRegex = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
        if (field.value.trim() && !phoneRegex.test(field.value.replace(/\D/g, ''))) {
            this.addError(field, message);
            return false;
        }
        return true;
    }

    // Validar longitud mínima
    validateMinLength(fieldId, minLength, message = `Este campo debe tener al menos ${minLength} caracteres`) {
        const field = document.getElementById(fieldId);
        if (!field) return true; // Si el campo no existe, ignoramos la validación
        
        if (field.value.trim().length < minLength) {
            this.addError(field, message);
            return false;
        }
        return true;
    }

    // Añadir un error a un campo
    addError(field, message) {
        // Añadir clase de error
        field.classList.add(this.errorClass);
        
        // Crear mensaje de error si no existe
        let errorMessage = field.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains(this.errorMessageClass)) {
            errorMessage = document.createElement('div');
            errorMessage.className = this.errorMessageClass;
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
        
        // Establecer mensaje de error
        errorMessage.textContent = message;
        
        // Añadir a lista de errores
        this.errors.push({ field: field.id, message });
    }

    // Limpiar errores
    clearErrors() {
        this.errors = [];
        
        // Eliminar clases de error y mensajes
        if (this.form) {
            const invalidFields = this.form.querySelectorAll('.' + this.errorClass);
            const errorMessages = this.form.querySelectorAll('.' + this.errorMessageClass);
            
            invalidFields.forEach(field => {
                field.classList.remove(this.errorClass);
            });
            
            errorMessages.forEach(errorMsg => {
                errorMsg.remove();
            });
        }
    }

    // Validar formulario de contacto
    validateContactForm() {
        this.clearErrors();
        
        // Validar campos requeridos
        const isNameValid = this.validateRequired('form-name', 'Por favor, ingresa tu nombre completo');
        const isAddressValid = this.validateRequired('form-address', 'Por favor, ingresa tu dirección');
        const isCityValid = this.validateRequired('form-city', 'Por favor, ingresa tu localidad');
        const isPhoneValid = this.validateRequired('form-phone', 'Por favor, ingresa tu teléfono de contacto');
        const isEmailValid = this.validateRequired('form-mail', 'Por favor, ingresa tu email');
        
        // Validar formato de email y teléfono
        const isEmailFormatValid = this.validateEmail('form-mail');
        const isPhoneFormatValid = this.validatePhone('form-phone');
        
        // Validar mensaje (opcional, pero si tiene contenido debe tener longitud mínima)
        const messageField = document.getElementById('form-message');
        let isMessageValid = true;
        if (messageField && messageField.value.trim()) {
            isMessageValid = this.validateMinLength('form-message', 10, 'Tu mensaje debe tener al menos 10 caracteres');
        }
        
        // Retornar si el formulario es válido
        return isNameValid && isAddressValid && isCityValid && isPhoneValid && 
               isEmailValid && isEmailFormatValid && isPhoneFormatValid && isMessageValid;
    }

    // Validar formulario de suscripción
    validateSubscriptionForm() {
        this.clearErrors();
        
        // Validar campos requeridos
        const isNameValid = this.validateRequired('form-name', 'Por favor, ingresa tu nombre completo');
        const isAddressValid = this.validateRequired('form-address', 'Por favor, ingresa tu dirección');
        const isCityValid = this.validateRequired('form-city', 'Por favor, ingresa tu localidad');
        const isPhoneValid = this.validateRequired('form-phone', 'Por favor, ingresa tu teléfono de contacto');
        const isEmailValid = this.validateRequired('form-mail', 'Por favor, ingresa tu email');
        const isCompanyValid = this.validateRequired('form-company', 'Por favor, ingresa la razón social');
        const isRubroValid = this.validateRequired('form-rubro', 'Por favor, ingresa el rubro');
        
        // Validar formato de email y teléfono
        const isEmailFormatValid = this.validateEmail('form-mail');
        const isPhoneFormatValid = this.validatePhone('form-phone');
        
        // Retornar si el formulario es válido
        return isNameValid && isAddressValid && isCityValid && isPhoneValid && 
               isEmailValid && isEmailFormatValid && isPhoneFormatValid && 
               isCompanyValid && isRubroValid;
    }
} 