/**
 * Script para cargar dinámicamente datos de ubicación desde la API
 */

class MapLocations {
    constructor() {
        // URL de la API
        this.apiUrl = 'https://rurtools.com.ar/admin/Api/Datos';
        
        // Inicializar
        this.init();
    }
    
    // Inicializar la carga dinámica
    async init() {
        try {
            // Esperar a que el DOM esté completamente cargado
            if (document.readyState !== 'loading') {
                await this.loadData();
            } else {
                document.addEventListener('DOMContentLoaded', async () => {
                    await this.loadData();
                });
            }
        } catch (error) {
            console.error('Error al inicializar los datos de ubicación:', error);
        }
    }
    
    // Cargar datos de la API
    async loadData() {
        try {
            // Verificar si estamos en la página de "donde-comprar.html"
            const isMapPage = window.location.pathname.includes('donde-comprar');
            if (!isMapPage) {
                return; // No ejecutar en otras páginas
            }
            
            // Buscar el contenedor de información de ubicación
            const locationContainer = document.querySelector('.map-item');
            if (!locationContainer) {
                console.warn('No se encontró el contenedor para la información de ubicación');
                return;
            }
            
            // Realizar petición a la API de datos
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
            }
            
            // Parsear respuesta como JSON
            const data = await response.json();
            
            // Verificar si hay datos
            if (!data || !data.length) {
                console.warn('No se recibieron datos de la API');
                return;
            }
            
            // Obtener datos de la tienda
            const storeData = data[0];
            
            // Actualizar la dirección
            if (storeData.direccion && storeData.ciudad) {
                const addressElement = locationContainer.querySelector('[data-info="address"] span:last-child');
                if (addressElement) {
                    addressElement.textContent = `${storeData.direccion}, ${storeData.ciudad}`;
                }
            }
            
            // Actualizar el número de teléfono
            if (storeData.whatsapp) {
                const phoneElement = locationContainer.querySelector('[data-info="phone"] span:last-child');
                if (phoneElement) {
                    // Formatear el número de teléfono para mostrar
                    const formattedPhone = storeData.whatsapp.replace(/^\+/, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
                    phoneElement.textContent = formattedPhone;
                }
            }
            
            // Actualizar el horario
            if (storeData.horarios) {
                const hoursElement = locationContainer.querySelector('[data-info="hours"] span:last-child');
                if (hoursElement) {
                    hoursElement.textContent = storeData.horarios;
                }
            }
            
            // Actualizar el email
            if (storeData.email) {
                const webContainer = locationContainer.querySelector('[data-info="web"] span:last-child');
                if (webContainer) {
                    const emailLink = webContainer.querySelector('a[href^="mailto:"]');
                    if (emailLink) {
                        emailLink.href = `mailto:${storeData.email}`;
                        emailLink.textContent = storeData.email;
                    }
                }
            }
            
            console.log('Información de ubicación actualizada desde la API');
            
        } catch (error) {
            console.error('Error al cargar datos desde la API:', error);
        }
    }
}

// Inicializar
const mapLocations = new MapLocations(); 