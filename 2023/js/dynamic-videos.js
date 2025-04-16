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
            
            // Si hay un enlace al canal de YouTube en la página, actualizarlo
            const youtubeChannelLink = document.querySelector('a.btn.btn-outline-dark[href*="youtube.com"]');
            if (youtubeChannelLink && data[0].linkvideo) {
                // Extraer el canal de YouTube del primer video
                const youtubeUrl = new URL(data[0].linkvideo);
                const channelPath = youtubeUrl.hostname.includes('youtube') ? 
                    `/channel/${youtubeUrl.pathname.split('/')[2]}` : 
                    youtubeUrl.pathname.split('/shorts')[0];
                
                const channelUrl = `https://www.youtube.com${channelPath}`;
                youtubeChannelLink.href = channelUrl;
            }
            
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
}

// Inicializar
const dynamicVideos = new DynamicVideos(); 