/**
 * Script para cargar dinámicamente elementos del footer desde la API
 */

class DynamicFooter {
    constructor() {
        // URL de la API
        this.apiUrl = 'https://rurtools.com.ar/admin/Api/Datos';
        
        // Mapeo de nombres de redes sociales a clases de iconos FontAwesome
        this.socialIcons = {
            'facebook': 'fa-facebook',
            'instagram': 'fa-instagram',
            'youtube': 'fa-youtube',
            'linkedin': 'fa-linkedin',
            'titktok': 'fa-tiktok' // API usa 'titktok' (con error ortográfico)
        };
        
        // Nombres a mostrar (para corregir errores ortográficos en la API)
        this.socialNames = {
            'facebook': 'Facebook',
            'instagram': 'Instagram',
            'youtube': 'Youtube',
            'linkedin': 'Linkedin',
            'titktok': 'Tik Tok'
        };
        
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
            console.error('Error al inicializar el footer dinámico:', error);
        }
    }
    
    // Cargar datos de la API
    async loadData() {
        try {
            // Realizar petición a la API
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
            
            // Obtener primer elemento (suponemos que solo hay uno)
            const storeData = data[0];
            
            // Actualizar elementos del footer
            this.updateSocialLinks(storeData);
            this.updateContactInfo(storeData);
            this.updateWhatsApp(storeData);
            
            // Actualizar enlaces de redes sociales en todo el sitio
            this.updateYouTubeLinks(storeData);
            this.updateInstagramLinks(storeData);
            
        } catch (error) {
            console.error('Error al cargar datos para el footer:', error);
        }
    }
    
    // Actualizar enlaces de redes sociales
    updateSocialLinks(data) {
        // Buscar el contenedor de redes sociales
        const socialNav = document.querySelector('footer nav.social');
        if (!socialNav) {
            console.warn('No se encontró el contenedor de redes sociales en el footer');
            return;
        }
        
        // Limpiar contenedor actual
        socialNav.innerHTML = '';
        
        // Recorrer las redes sociales del mapeo de iconos
        Object.keys(this.socialIcons).forEach(network => {
            // Verificar si la red social tiene URL en los datos
            if (data[network] && data[network].trim() !== '') {
                // Crear enlace
                const link = document.createElement('a');
                link.href = data[network];
                link.target = '_blank';
                link.rel = 'noopener';
                
                // Crear icono
                const icon = document.createElement('i');
                icon.className = `fa-brands ${this.socialIcons[network]} fa-fw`;
                
                // Agregar icono y texto al enlace
                link.appendChild(icon);
                link.appendChild(document.createTextNode(` ${this.socialNames[network] || network}`));
                
                // Agregar enlace al contenedor
                socialNav.appendChild(link);
            }
        });
    }
    
    // Actualizar información de contacto
    updateContactInfo(data) {
        // Actualizar email principal
        if (data.email) {
            const emailLinks = document.querySelectorAll('footer a[href^="mailto:info@"]');
            emailLinks.forEach(link => {
                // Solo actualizar el email principal si NO está dentro de la sección de posventa
                if (!link.parentElement.previousElementSibling || !link.parentElement.previousElementSibling.textContent.includes('Posventa')) {
                    link.href = `mailto:${data.email}`;
                    link.textContent = data.email;
                }
            });
        }
        
        // Actualizar email de posventa
        if (data.emailposventa) {
            // Buscar específicamente el email que está después del h5 de Posventa
            const posventaHeadings = document.querySelectorAll('footer h5.mt-4');
            posventaHeadings.forEach(heading => {
                if (heading.textContent.trim() === 'Posventa') {
                    // Encontrar el enlace de email dentro del párrafo siguiente al h5
                    const emailLink = heading.nextElementSibling.querySelector('a[href^="mailto:"]');
                    if (emailLink) {
                        emailLink.href = `mailto:${data.emailposventa}`;
                        emailLink.textContent = data.emailposventa;
                    }
                }
            });
        }
        
        // Actualizar dirección
        if (data.direccion && data.ciudad) {
            const addressLinks = document.querySelectorAll('footer a[href*="maps.app.goo.gl"]');
            addressLinks.forEach(link => {
                // Conservar el enlace original pero actualizar el texto
                const addressText = link.querySelector('br');
                if (addressText) {
                    // Si hay un <br>, reemplazamos el texto antes del <br>
                    addressText.parentNode.childNodes[0].nodeValue = data.direccion + ',';
                    // Y después del <br>
                    addressText.nextSibling.textContent = data.ciudad;
                } else {
                    // Si no hay <br>, reemplazamos todo el texto
                    link.innerHTML = `${data.direccion},<br>${data.ciudad}`;
                }
            });
        }
    }
    
    // Actualizar enlaces de YouTube en todo el sitio
    updateYouTubeLinks(data) {
        // Verificar si tenemos una URL de YouTube
        if (data.youtube && data.youtube.trim() !== '') {
            // Buscar todos los enlaces a YouTube en el sitio
            const youtubeLinks = document.querySelectorAll('a[href*="youtube.com"]');
            
            // Actualizar cada enlace encontrado
            youtubeLinks.forEach(link => {
                // Preservar atributos originales como data-fancybox, class, etc.
                link.href = data.youtube;
            });
            
            console.log(`Se actualizaron ${youtubeLinks.length} enlaces de YouTube con la URL: ${data.youtube}`);
        }
    }
    
    // Actualizar enlaces de Instagram en todo el sitio
    updateInstagramLinks(data) {
        // Verificar si tenemos una URL de Instagram
        if (data.instagram && data.instagram.trim() !== '') {
            // Buscar todos los enlaces a Instagram en el sitio
            const instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
            
            // Actualizar cada enlace encontrado
            instagramLinks.forEach(link => {
                // Preservar atributos originales como target, class, etc.
                link.href = data.instagram;
            });
            
            console.log(`Se actualizaron ${instagramLinks.length} enlaces de Instagram con la URL: ${data.instagram}`);
        }
    }
    
    // Actualizar botón de WhatsApp
    updateWhatsApp(data) {
        if (data.whatsapp) {
            const whatsappButton = document.querySelector('a.whatsapp-button');
            if (whatsappButton) {
                // Formatear número de WhatsApp (eliminar espacios y signos +)
                const whatsappNumber = data.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
                whatsappButton.href = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20productos`;
            }
        }
    }
}

// Inicializar
const dynamicFooter = new DynamicFooter(); 