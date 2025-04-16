/**
 * Script para cargar dinámicamente publicaciones de Instagram desde la API
 */

class DynamicInstagram {
    constructor() {
        // URL de la API
        this.apiUrl = 'https://rurtools.com.ar/admin/Api/Instagram';
        
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
            console.error('Error al inicializar las publicaciones de Instagram:', error);
        }
    }
    
    // Cargar datos de la API
    async loadData() {
        try {
            // Buscar la sección de Instagram
            const instagramSection = document.querySelector('section.section:has(.row a[href*="instagram.com"])');
            if (!instagramSection) {
                console.warn('No se encontró la sección de Instagram en la página');
                return;
            }
            
            // Buscar el contenedor de las publicaciones
            const instagramRow = instagramSection.querySelector('.row');
            if (!instagramRow) {
                console.warn('No se encontró el contenedor de publicaciones de Instagram');
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
                throw new Error(`Error al obtener datos de Instagram: ${response.status} ${response.statusText}`);
            }
            
            // Parsear respuesta como JSON
            const data = await response.json();
            
            // Verificar si hay datos
            if (!data || !data.length) {
                console.warn('No se recibieron datos de Instagram de la API');
                return;
            }
            
            // Limpiar el contenedor de publicaciones
            instagramRow.innerHTML = '';
            
            // Crear elementos para cada publicación
            data.forEach(post => {
                // Obtener la URL de la miniatura
                const thumbnailUrl = `https://rurtools.com.ar/admin/images/${post.miniatura}`;
                
                // Crear columna
                const col = document.createElement('div');
                col.className = 'col-12 col-md-4';
                
                // Crear contenido
                col.innerHTML = `
                    <a href="${post.linkPublicacion}" target="_blank" class="thumb-link instagram-post">
                        <div class="instagram-thumbnail" style="background-image: url('${thumbnailUrl}');">
                            <div class="instagram-overlay">
                                <div class="instagram-play-icon">
                                    <i class="fa-brands fa-instagram"></i>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
                
                // Añadir al contenedor
                instagramRow.appendChild(col);
            });
            
            // Actualizar el enlace "Visita nuestro Instagram" si existe
            const instaButton = instagramSection.querySelector('a.btn[href*="instagram.com"]');
            if (instaButton) {
                // Obtener la URL de Instagram desde la API de Datos
                const dataResponse = await fetch('https://rurtools.com.ar/admin/Api/Datos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                if (dataResponse.ok) {
                    const storeData = await dataResponse.json();
                    if (storeData && storeData.length && storeData[0].instagram) {
                        instaButton.href = storeData[0].instagram;
                    }
                }
            }
            
            console.log(`Se cargaron ${data.length} publicaciones de Instagram desde la API`);
            
        } catch (error) {
            console.error('Error al cargar publicaciones de Instagram:', error);
        }
    }
}

// Inicializar
const dynamicInstagram = new DynamicInstagram(); 