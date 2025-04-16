/**
 * api-data-loader.js
 * Este archivo se encarga de cargar datos desde la API de Rurtools
 * y actualizar dinámicamente el contenido del sitio web.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 API Data Loader: Iniciando carga de datos sociales...');
    cargarDatosSocialesDesdeAPI();
});

/**
 * Carga datos sociales desde la API y actualiza los enlaces y secciones
 */
function cargarDatosSocialesDesdeAPI() {
    console.log('📡 Realizando petición a la API de datos sociales...');
    
    // Realizamos la petición a la API
    fetch('https://rurtools.com.ar/admin/Api/Datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => {
        console.log('✅ Respuesta recibida de la API');
        return response.json();
    })
    .then(data => {
        console.log('📊 Datos recibidos:', data);
        
        // Verificamos si tenemos datos
        if (data && data.length > 0) {
            const datosTienda = data[0];
            console.log('🏪 Datos de la tienda:', datosTienda);
            
            // Actualizamos los enlaces de redes sociales
            actualizarEnlaceInstagram(datosTienda.instagram);
            actualizarEnlaceYoutube(datosTienda.youtube);
            actualizarEnlaceFacebook(datosTienda.facebook);
            actualizarEnlaceLinkedin(datosTienda.linkedin);
            actualizarEnlaceTiktok(datosTienda.titktok);
            actualizarWhatsApp(datosTienda.whatsapp);
            
            // Actualizamos las secciones de Instagram y YouTube si existen en la página
            cargarSeccionInstagram(datosTienda.instagram);
            cargarSeccionYoutube(datosTienda.youtube);
            
            // También actualizamos los enlaces en el footer
            actualizarEnlacesFooter(datosTienda);
            
            console.log('✅ Enlaces de redes sociales actualizados correctamente');
        } else {
            console.warn('⚠️ No se recibieron datos de la API o el formato es incorrecto');
        }
    })
    .catch(error => {
        console.error('❌ Error al cargar datos de la tienda:', error);
    });
}

/**
 * Actualiza la sección de Instagram
 */
function cargarSeccionInstagram(instagramUrl) {
    console.log('🔄 Actualizando sección de Instagram con URL:', instagramUrl);
    
    const instagramContainer = document.getElementById('instagram-container');
    const instagramLink = document.getElementById('instagram-link');
    
    if (instagramContainer && instagramUrl) {
        // Actualizamos el enlace principal de Instagram
        if (instagramLink) {
            instagramLink.href = instagramUrl;
            console.log('✅ Enlace principal de Instagram actualizado:', instagramUrl);
        }
        
        // Limpiamos el contenedor
        instagramContainer.innerHTML = '';
        
        // Creamos las tarjetas de ejemplo de Instagram
        const instagramImages = [
            './2023/uploads/rur-imagenes/kim-iR5erkaiX9g-unsplash.jpg',
            './2023/uploads/rur-imagenes/chris-yates-bVG0-KSh8Sc-unsplash.jpg',
            './2023/uploads/rur-imagenes/hunter-haley-s8OO2-t-HmQ-unsplash (1).jpg'
        ];
        
        instagramImages.forEach(image => {
            const instagramCard = document.createElement('div');
            instagramCard.className = 'col-12 col-md-4';
            
            instagramCard.innerHTML = `
                <a href="${instagramUrl}" target="_blank" class="thumb-link">
                    <img src="${image}" alt="Instagram Rurtools" class="img-fluid" />
                </a>
            `;
            
            instagramContainer.appendChild(instagramCard);
        });
        
        console.log('✅ Sección de Instagram actualizada correctamente');
    } else if (!instagramContainer) {
        console.log('ℹ️ No se encontró el contenedor de Instagram en esta página');
    }
}

/**
 * Actualiza la sección de YouTube
 */
function cargarSeccionYoutube(youtubeUrl) {
    console.log('🔄 Actualizando sección de YouTube con URL:', youtubeUrl);
    
    const youtubeContainer = document.getElementById('youtube-container');
    const youtubeLink = document.getElementById('youtube-link');
    
    if (youtubeContainer && youtubeUrl) {
        // Actualizamos el enlace principal de YouTube
        if (youtubeLink) {
            youtubeLink.href = youtubeUrl;
            console.log('✅ Enlace principal de YouTube actualizado:', youtubeUrl);
        }
        
        // Limpiamos el contenedor
        youtubeContainer.innerHTML = '';
        
        // Creamos las tarjetas de videos de ejemplo
        for (let i = 0; i < 6; i++) {
            const youtubeCard = document.createElement('div');
            youtubeCard.className = 'swiper-slide';
            
            youtubeCard.innerHTML = `
                <a href="${youtubeUrl}" data-fancybox class="thumb-link video">
                    <img src="./2023/uploads/rur-imagenes/rakhmat-suwandi-wDC-SOW6AcM-unsplash.jpg" alt="Video Rurtools" class="img-fluid" />
                </a>
            `;
            
            youtubeContainer.appendChild(youtubeCard);
        }
        
        // Reiniciamos el swiper para que reconozca los nuevos slides
        setTimeout(() => {
            const youtubeSwiper = document.querySelector('.swiper[data-swiper="youtube"]').swiper;
            if (youtubeSwiper) {
                youtubeSwiper.update();
                console.log('✅ YouTube swiper actualizado correctamente');
            } else {
                console.warn('⚠️ No se pudo encontrar el swiper de YouTube para actualizar');
            }
        }, 500);
        
        console.log('✅ Sección de YouTube actualizada correctamente');
    } else if (!youtubeContainer) {
        console.log('ℹ️ No se encontró el contenedor de YouTube en esta página');
    }
}

/**
 * Actualiza el enlace de WhatsApp
 */
function actualizarWhatsApp(whatsappNumber) {
    if (!whatsappNumber) return;
    
    console.log('🔄 Actualizando enlace de WhatsApp con número:', whatsappNumber);
    
    const whatsappButton = document.querySelector('.whatsapp-button');
    if (whatsappButton) {
        const numeroLimpio = whatsappNumber.replace(/\+/g, '').replace(/\s/g, '');
        whatsappButton.href = `https://wa.me/${numeroLimpio}?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20productos`;
        console.log('✅ Enlace de WhatsApp actualizado:', whatsappButton.href);
    } else {
        console.log('ℹ️ No se encontró el botón de WhatsApp en esta página');
    }
}

/**
 * Actualiza los enlaces a Instagram
 */
function actualizarEnlaceInstagram(instagramUrl) {
    if (!instagramUrl) return;
    
    console.log('🔄 Actualizando enlaces a Instagram con URL:', instagramUrl);
    
    // Actualizamos todos los enlaces a Instagram en el sitio
    let contadorEnlaces = 0;
    document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
        if (link.href.includes('instagram.com')) {
            link.href = instagramUrl;
            contadorEnlaces++;
        }
    });
    
    console.log(`✅ Se actualizaron ${contadorEnlaces} enlaces a Instagram`);
}

/**
 * Actualiza los enlaces a YouTube
 */
function actualizarEnlaceYoutube(youtubeUrl) {
    if (!youtubeUrl) return;
    
    console.log('🔄 Actualizando enlaces a YouTube con URL:', youtubeUrl);
    
    // Actualizamos todos los enlaces a YouTube en el sitio
    let contadorEnlaces = 0;
    document.querySelectorAll('a[href*="youtube.com"]').forEach(link => {
        if (link.href.includes('youtube.com')) {
            link.href = youtubeUrl;
            contadorEnlaces++;
        }
    });
    
    console.log(`✅ Se actualizaron ${contadorEnlaces} enlaces a YouTube`);
}

/**
 * Actualiza los enlaces a Facebook
 */
function actualizarEnlaceFacebook(facebookUrl) {
    if (!facebookUrl) return;
    
    console.log('🔄 Actualizando enlaces a Facebook con URL:', facebookUrl);
    
    // Actualizamos todos los enlaces a Facebook en el sitio
    let contadorEnlaces = 0;
    document.querySelectorAll('a[href*="facebook.com"]').forEach(link => {
        if (link.href.includes('facebook.com')) {
            link.href = facebookUrl;
            contadorEnlaces++;
        }
    });
    
    console.log(`✅ Se actualizaron ${contadorEnlaces} enlaces a Facebook`);
}

/**
 * Actualiza los enlaces a LinkedIn
 */
function actualizarEnlaceLinkedin(linkedinUrl) {
    if (!linkedinUrl) return;
    
    console.log('🔄 Actualizando enlaces a LinkedIn con URL:', linkedinUrl);
    
    // Actualizamos todos los enlaces a LinkedIn en el sitio
    let contadorEnlaces = 0;
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(link => {
        if (link.href.includes('linkedin.com')) {
            link.href = linkedinUrl;
            contadorEnlaces++;
        }
    });
    
    console.log(`✅ Se actualizaron ${contadorEnlaces} enlaces a LinkedIn`);
}

/**
 * Actualiza los enlaces a TikTok
 */
function actualizarEnlaceTiktok(tiktokUrl) {
    if (!tiktokUrl) return;
    
    console.log('🔄 Actualizando enlaces a TikTok con URL:', tiktokUrl);
    
    // Actualizamos todos los enlaces a TikTok en el sitio
    let contadorEnlaces = 0;
    document.querySelectorAll('a[href*="tiktok.com"]').forEach(link => {
        if (link.href.includes('tiktok.com')) {
            link.href = tiktokUrl;
            contadorEnlaces++;
        }
    });
    
    console.log(`✅ Se actualizaron ${contadorEnlaces} enlaces a TikTok`);
}

/**
 * Actualiza los enlaces en el footer
 */
function actualizarEnlacesFooter(datosTienda) {
    console.log('🔄 Actualizando enlaces en el footer');
    
    const footerLinks = document.querySelectorAll('footer .social a');
    
    footerLinks.forEach(link => {
        const text = link.textContent.trim();
        
        if (text.includes('Instagram') && datosTienda.instagram) {
            link.href = datosTienda.instagram;
        } else if (text.includes('Youtube') && datosTienda.youtube) {
            link.href = datosTienda.youtube;
        } else if (text.includes('Facebook') && datosTienda.facebook) {
            link.href = datosTienda.facebook;
        } else if (text.includes('Linkedin') && datosTienda.linkedin) {
            link.href = datosTienda.linkedin;
        } else if (text.includes('Tik Tok') && datosTienda.titktok) {
            link.href = datosTienda.titktok;
        }
    });
    
    // Actualizamos también la dirección y el correo si están disponibles
    if (datosTienda.email) {
        document.querySelectorAll('a[href^="mailto:info@"]').forEach(link => {
            link.href = `mailto:${datosTienda.email}`;
            link.textContent = datosTienda.email;
        });
    }
    
    if (datosTienda.emailposventa) {
        document.querySelectorAll('a[href^="mailto:postventa@"]').forEach(link => {
            link.href = `mailto:${datosTienda.emailposventa}`;
            link.textContent = datosTienda.emailposventa;
        });
    }
    
    // Actualizar la dirección
    if (datosTienda.direccion && datosTienda.ciudad) {
        const direccionLinks = document.querySelectorAll('footer a[href*="maps.app.goo.gl"]');
        direccionLinks.forEach(link => {
            const direccionCompleta = `${datosTienda.direccion},<br>${datosTienda.ciudad}`;
            link.innerHTML = direccionCompleta;
        });
    }
    
    console.log('✅ Enlaces del footer actualizados correctamente');
}