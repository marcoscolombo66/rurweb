/**
 * Seguridad de formularios para Rurtools
 * Este archivo añade protección contra spam y ataques a los formularios
 */

class FormSecurity {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.formId = formId;
        
        // Cargar configuración API
        this.config = window.API_CONFIG || {
            recaptcha: {
                siteKey: "",
                enabled: false
            }
        };
        
        // Inicializar
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Añadir token CSRF
        this.addCsrfToken();
        
        // Añadir campo honeypot
        this.addHoneypotField();
        
        // Añadir recaptcha si está habilitado
        if (this.config.recaptcha && this.config.recaptcha.enabled) {
            this.addRecaptcha();
        }
        
        // Añadir verificación de tiempo
        this.addTimeVerification();
    }
    
    // Añadir token CSRF para prevenir ataques
    addCsrfToken() {
        // Generar token CSRF
        const csrfToken = this.generateRandomToken();
        
        // Almacenar token en localStorage o sessionStorage
        sessionStorage.setItem('rurtools_csrf_token', csrfToken);
        
        // Crear campo oculto con el token
        let csrfField = this.form.querySelector('input[name="_csrf_token"]');
        if (!csrfField) {
            csrfField = document.createElement('input');
            csrfField.type = 'hidden';
            csrfField.name = '_csrf_token';
            this.form.appendChild(csrfField);
        }
        csrfField.value = csrfToken;
    }
    
    // Generar token aleatorio
    generateRandomToken() {
        const array = new Uint8Array(24);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Añadir campo honeypot para detectar bots
    addHoneypotField() {
        // Crear campo oculto para bots
        let honeypotField = this.form.querySelector('.form-honeypot');
        if (!honeypotField) {
            const honeypotContainer = document.createElement('div');
            honeypotContainer.className = 'form-honeypot';
            honeypotContainer.style.cssText = 'opacity: 0; position: absolute; top: 0; left: 0; height: 0; width: 0; z-index: -1;';
            
            const honeypotInput = document.createElement('input');
            honeypotInput.type = 'text';
            honeypotInput.name = 'website'; // Los bots suelen completar campos llamados website, url, etc.
            honeypotInput.tabIndex = -1;
            honeypotInput.autocomplete = 'off';
            
            honeypotContainer.appendChild(honeypotInput);
            this.form.appendChild(honeypotContainer);
        }
    }
    
    // Añadir verificación de tiempo (anti-bot)
    addTimeVerification() {
        // Crear campo oculto con timestamp
        let timeField = this.form.querySelector('input[name="_form_time"]');
        if (!timeField) {
            timeField = document.createElement('input');
            timeField.type = 'hidden';
            timeField.name = '_form_time';
            this.form.appendChild(timeField);
        }
        
        // Establecer timestamp actual
        timeField.value = Date.now();
    }
    
    // Añadir reCAPTCHA
    addRecaptcha() {
        // Solo si está configurado
        if (!this.config.recaptcha || !this.config.recaptcha.siteKey) {
            return;
        }
        
        // Verificar si ya existe un contenedor de recaptcha
        let recaptchaContainer = this.form.querySelector('.g-recaptcha');
        if (!recaptchaContainer) {
            // Buscar el botón de envío
            const submitButton = this.form.querySelector('button[type="submit"]');
            
            // Crear contenedor de recaptcha
            recaptchaContainer = document.createElement('div');
            recaptchaContainer.className = 'g-recaptcha mb-3';
            recaptchaContainer.setAttribute('data-sitekey', this.config.recaptcha.siteKey);
            
            // Insertar antes del botón de envío
            if (submitButton && submitButton.parentNode) {
                submitButton.parentNode.insertBefore(recaptchaContainer, submitButton);
            } else {
                // Si no hay botón, añadir al final del formulario
                this.form.appendChild(recaptchaContainer);
            }
            
            // Cargar script de reCAPTCHA si no está cargado
            if (typeof grecaptcha === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://www.google.com/recaptcha/api.js';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        }
    }
    
    // Validar seguridad antes de enviar el formulario
    validateSecurity() {
        // Validar honeypot
        const honeypotField = this.form.querySelector('.form-honeypot input');
        if (honeypotField && honeypotField.value) {
            // Si el campo honeypot tiene valor, es probablemente un bot
            console.error('Error de validación: posible bot detectado');
            return false;
        }
        
        // Validar tiempo de llenado del formulario
        const timeField = this.form.querySelector('input[name="_form_time"]');
        if (timeField) {
            const submissionTime = Date.now();
            const formLoadedTime = parseInt(timeField.value, 10);
            const timeDiffSeconds = (submissionTime - formLoadedTime) / 1000;
            
            // Si el formulario se completa en menos de 3 segundos, probablemente es un bot
            if (timeDiffSeconds < 3) {
                console.error('Error de validación: formulario completado demasiado rápido');
                return false;
            }
        }
        
        // Validar reCAPTCHA
        if (this.config.recaptcha && this.config.recaptcha.enabled) {
            if (typeof grecaptcha !== 'undefined') {
                const recaptchaResponse = grecaptcha.getResponse();
                if (!recaptchaResponse) {
                    console.error('Error de validación: reCAPTCHA no completado');
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Verificar token CSRF
    verifyCsrfToken() {
        const storedToken = sessionStorage.getItem('rurtools_csrf_token');
        const formToken = this.form.querySelector('input[name="_csrf_token"]');
        
        if (!storedToken || !formToken || storedToken !== formToken.value) {
            console.error('Error de validación: token CSRF inválido');
            return false;
        }
        
        return true;
    }
} 