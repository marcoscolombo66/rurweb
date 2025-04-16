/**
 * Script para cargar dinámicamente los vídeos desde la API
 */

class DynamicVideos {
    constructor() {
        // URL de la API
        this.apiUrl = 'https://rurtools.com.ar/admin/Api/Videos';
        
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
            console.error('Error al inicializar los videos dinámicos:', error);
        }
    }
    
    // Cargar datos de la API
    async loadData() {
        try {
            // Referencia al contenedor del slider de videos
            const swiperWrapper = document.querySelector('.swiper[data-swiper="youtube"] .swiper-wrapper');
            
            // Si no encontramos el contenedor, salimos
            if (!swiperWrapper) {
                console.warn('No se encontró el contenedor de videos en la página');
                return;
            }
            
            // Realizar petición a la API de videos
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error al obtener datos de videos: ${response.status} ${response.statusText}`);
            }
            
            // Parsear respuesta como JSON
            const data = await response.json();
            
            // Verificar si hay datos
            if (!data || !data.length) {
                console.warn('No se recibieron datos de videos de la API');
                return;
            }
            
            // Limpiar el contenedor antes de agregar nuevos videos
            swiperWrapper.innerHTML = '';
            
            // Crear slide para cada video
            data.forEach(video => {
                // Obtener la URL de la miniatura
                const thumbnailUrl = `https://rurtools.com.ar/admin/images/${video.miniatura}`;
                
                // Crear elemento slide
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                
                // Crear enlace con la URL del video
                slide.innerHTML = `
                    <a href="${video.linkvideo}" data-fancybox class="thumb-link video">
                        <div class="video-thumbnail" style="background-image: url('${thumbnailUrl}');">
                            <div class="video-play-icon">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </a>
                `;
                
                // Añadir al contenedor
                swiperWrapper.appendChild(slide);
            });
            
            // Actualizar el enlace al canal de YouTube con el de la API de Datos
            this.updateYoutubeChannelLink();
            
            console.log(`Se cargaron ${data.length} videos desde la API`);
            
            // Reinicializar el swiper para que funcione con los nuevos slides
            if (window.Swiper && typeof window.swiperInstances !== 'undefined') {
                Object.keys(window.swiperInstances).forEach(key => {
                    if (key.includes('youtube')) {
                        window.swiperInstances[key].update();
                    }
                });
            }
            
        } catch (error) {
            console.error('Error al cargar videos desde la API:', error);
        }
    }
    
    // Actualizar el enlace al canal de YouTube usando la API de Datos
    async updateYoutubeChannelLink() {
        try {
            // Obtener el enlace de YouTube de la API de Datos
            const response = await fetch('https://rurtools.com.ar/admin/Api/Datos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.length || !data[0].youtube) {
                console.warn('No se encontró la URL de YouTube en la API de Datos');
                return;
            }
            
            // Obtener el enlace de YouTube
            const youtubeUrl = data[0].youtube;
            
            // Actualizar todos los enlaces al canal de YouTube
            const youtubeChannelLinks = document.querySelectorAll('a.btn[href*="youtube.com"]');
            youtubeChannelLinks.forEach(link => {
                if (link.textContent.toLowerCase().includes('youtube')) {
                    link.href = youtubeUrl;
                    console.log('Enlace al canal de YouTube actualizado con la URL de la API de Datos:', youtubeUrl);
                }
            });
            
        } catch (error) {
            console.error('Error al actualizar el enlace al canal de YouTube:', error);
        }
    }
}

// Inicializar
const dynamicVideos = new DynamicVideos(); 