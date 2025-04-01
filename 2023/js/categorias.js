// Configuración
const CONFIG = {
    isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    get API_URL() {
        return 'https://rurtools.com.ar/admin/api';
    },

    get SEARCH_URL() {
        return this.isLocal 
            ? '/ver-productos.html'
            : '/home/rurtools-3/rurtools/ver-productos.html';
    },

    get BASE_URL() {
        return this.isLocal 
            ? '' 
            : '/home/rurtools-3/rurtools';
    },

    get UPLOADS_URL() {
        return this.isLocal 
            ? '../2023/uploads'
            : '/home/rurtools-3/rurtools/2023/uploads';
    },

    get IMAGES_URL() {
        return 'https://rurtools.com.ar/admin/images';
    }
};

// Función para cargar las categorías desde la API
async function cargarCategorias() {
    try {
        console.log("Cargando categorías...");
        
        const response = await fetch(`${CONFIG.API_URL}/Categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar categorías: ${response.status}`);
        }

        const categorias = await response.json();
        console.log("Categorías cargadas:", categorias);
        
        // Filtrar solo categorías activas
        const categoriasActivas = categorias.filter(cat => cat.activo === "1");
        
        // Determinar si estamos en una página de categoría específica
        const esPaginaCategoria = window.location.pathname.includes('/ver-productos/categoria.html');
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaId = urlParams.get('id');

        if (esPaginaCategoria && categoriaId) {
            await manejarPaginaCategoria(categoriasActivas, categoriaId);
            return;
        }

        // Si estamos en la página principal de productos
        await mostrarCategoriasEnPrincipal(categoriasActivas);

    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Función para mostrar las categorías en la página principal
async function mostrarCategoriasEnPrincipal(categorias) {
    // Obtener el contenedor de categorías
    const contenedorCategorias = document.querySelector('.row.justify-content-center');
    if (!contenedorCategorias) {
        console.error('No se encontró el contenedor de categorías');
        return;
    }

    // Mostrar loader mientras se cargan las categorías
    contenedorCategorias.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando categorías...</p>
        </div>
    `;

    // Pequeña pausa para asegurar que el loader se muestre
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generar HTML para cada categoría
    let categoriasHTML = '';
    categorias.forEach(categoria => {
        const imagePath = CONFIG.isLocal 
            ? '../2023/uploads/rur-imagenes/omar-sobhy-nasef-0dy0i_je0q8-unsplash.jpg'
            : './2023/uploads/rur-imagenes/omar-sobhy-nasef-0dy0i_je0q8-unsplash.jpg';
        
        categoriasHTML += `
            <div class="col-6 col-lg-4 col-xl-3">
                <a href="${CONFIG.isLocal ? 'ver-productos/categoria.html' : './ver-productos/categoria.html'}?id=${categoria.idCategoria}" class="cat-link">
                    <div class="image" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imagePath}');"></div>
                    <div class="name">${categoria.nombreCategoria}</div>
                    <div class="dots"></div>
                </a>
            </div>
        `;
    });

    // Actualizar el contenedor con todas las categorías de una vez
    contenedorCategorias.innerHTML = categoriasHTML;
}

// Función para manejar la página de una categoría específica
async function manejarPaginaCategoria(categorias, categoriaId) {
    try {
        const categoria = categorias.find(cat => cat.idCategoria === categoriaId);
        
        if (!categoria) {
            console.error('Categoría no encontrada');
            window.location.href = '../ver-productos.html';
            return;
        }

        console.log('Actualizando página para categoría:', categoria.nombreCategoria);

        // Asegurarnos de que la sección hero esté visible
        const sectionHero = document.querySelector('.section-hero');
        if (sectionHero) {
            sectionHero.style.display = 'block';
            sectionHero.style.opacity = '1';
            sectionHero.style.visibility = 'visible';
        }

        // Actualizar el título de la página y metadatos
        document.title = `Rurtools - ${categoria.nombreCategoria}`;
        
        // Actualizar metadatos si existen
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = `Productos de la categoría ${categoria.nombreCategoria}`;
        }
        
        const metaKeyword = document.querySelector('meta[name="keyword"]');
        if (metaKeyword) {
            metaKeyword.content = `${categoria.nombreCategoria}, Rurtools, productos`;
        }

        // Actualizar el breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = categoria.nombreCategoria;
        }
        
        // Actualizar el título h1
        const titleElement = document.querySelector('.section-header h1.color-white');
        if (titleElement) {
            titleElement.textContent = categoria.nombreCategoria;
        }

        // Actualizar imágenes de portada
        const pcImage = document.querySelector('.section-hero img.d-none.d-md-block');
        if (pcImage) {
            pcImage.style.display = 'block';
            if (categoria.imagenPortadaPC) {
                pcImage.src = categoria.imagenPortadaPC;
                pcImage.alt = categoria.nombreCategoria;
            }
        }

        const mobileImage = document.querySelector('.section-hero img.d-md-none');
        if (mobileImage) {
            mobileImage.style.display = 'block';
            if (categoria.imagenPortadaCelular) {
                mobileImage.src = categoria.imagenPortadaCelular;
                mobileImage.alt = categoria.nombreCategoria;
            }
        }

        // Agregar estilos para asegurar que el banner sea visible
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .section-hero {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                min-height: 200px;
                position: relative;
                z-index: 1;
            }
            .section-hero img {
                display: block !important;
                max-width: 100%;
                height: auto;
            }
        `;
        document.head.appendChild(styleElement);

        // Actualizar color de fondo sin modificar la estructura
        const sectionElement = document.querySelector('.section.bg-orange');
        if (sectionElement && categoria.colorFondo) {
            sectionElement.classList.remove('bg-orange', 'bg-blue');
            sectionElement.classList.add(categoria.colorFondo);
            if (!sectionElement.classList.contains('bg-dots')) {
                sectionElement.classList.add('bg-dots');
            }
        }

        // Cargar los productos de la categoría
        await cargarProductosCategoria(categoriaId, categoria);

    } catch (error) {
        console.error('Error al manejar la página de categoría:', error);
        const contenedorProductos = document.querySelector('.section .row.justify-content-center');
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-white">Error al cargar la categoría: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Función para cargar los productos de una categoría
async function cargarProductosCategoria(categoriaId, categoria) {
    try {
        console.log("Cargando productos de la categoría:", categoriaId);
        console.log("Información de la categoría:", categoria);
        
        const requestData = {
            busqueda: [parseInt(categoriaId)]
        };
        console.log("Datos de la solicitud:", requestData);
        
        const response = await fetch(`${CONFIG.API_URL}/ProductosCategorias`, {
                        method: 'POST',
                        headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
                    
        console.log("Estado de la respuesta:", response.status);
        const responseText = await response.text();
        console.log("Respuesta completa:", responseText);

        let productos;
        try {
            productos = JSON.parse(responseText);
        } catch (e) {
            console.error("Error al parsear la respuesta JSON:", e);
            throw new Error("La respuesta no es un JSON válido");
        }

        if (typeof productos === 'object' && productos.error) {
            console.log("La API devolvió un error:", productos.error);
            throw new Error(productos.error);
        }

        if (!Array.isArray(productos)) {
            console.error("La respuesta no es un array:", productos);
            throw new Error("Formato de respuesta inválido");
        }

        console.log("Productos cargados:", productos);

        // Obtener el contenedor de productos
        const productosContainer = document.querySelector('.section .row.justify-content-center');
        if (!productosContainer) {
            console.error('No se encontró el contenedor de productos');
            return;
        }

        // Limpiar el contenedor
        productosContainer.innerHTML = '';

        // Verificar si hay productos
        if (!productos || productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-white">No hay productos disponibles en esta categoría.</p>
                </div>
            `;
            return;
        }

        // Generar HTML para cada producto
        productos.forEach(producto => {
            // La imagen viene directamente de la API, solo necesitamos agregarle la ruta base
            const imagenUrl = construirUrlImagen(producto);
            console.log('URL de imagen generada para producto', producto.idProducto, ':', imagenUrl);

            const productoHTML = `
                <div class="col-6 col-lg-4 col-xl-3">
                    <a href="../ver-producto.html?id=${producto.SKUCode || producto.idProducto}" class="prod-link">
                        <div class="image" style="background-image: url('${imagenUrl}')"></div>
                        <div class="name" data-mh="product">${producto.nombreProducto}</div>
                        <div class="sku">${producto.SKUCode || producto.idProducto}</div>
                        <div class="price">
                            ${producto.precioProducto && producto.precioProducto !== '0' ? 
                                `$${parseFloat(producto.precioProducto).toLocaleString('es-AR')}` : 
                                'Consultar precio'}
                        </div>
                        <div class="dots"></div>
                        <div class="overlay">
                            <div class="specs">
                                ${producto.descripcionProducto || ''}
                            </div>
                            <div class="btn btn-sm btn-outline-light">Ver producto</div>
                        </div>
                    </a>
                </div>
            `;
            productosContainer.innerHTML += productoHTML;

            // Verificar si la imagen carga correctamente
            const img = new Image();
            img.onload = () => console.log('Imagen cargada correctamente:', imagenUrl);
            img.onerror = () => console.error('Error al cargar la imagen:', imagenUrl);
            img.src = imagenUrl;
        });

        // Inicializar matchHeight para los nombres de productos
        if (typeof $.fn.matchHeight !== 'undefined') {
            $('[data-mh="product"]').matchHeight();
        }

    } catch (error) {
        console.error('Error al cargar los productos:', error);
        const productosContainer = document.querySelector('.section .row.justify-content-center');
        if (productosContainer) {
            productosContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-white">Error al cargar los productos: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Función auxiliar para convertir texto a slug URL
function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

// Función para construir la URL del producto
function construirUrlProducto(producto) {
    const baseUrl = CONFIG.isLocal ? '' : CONFIG.BASE_URL;
    return `${baseUrl}/ver-producto.html?id=${producto.SKUCode || producto.idProducto}`;
}

// Función para obtener el ID del producto de la URL
function obtenerIdProductoDeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM cargado, inicializando...");
    
    // Agregar estilo personalizado para el separador del breadcrumb
    const breadcrumbStyle = document.createElement('style');
    breadcrumbStyle.textContent = `
        .breadcrumb-item + .breadcrumb-item::before {
            content: "/" !important;
            color: #fff;
        }
    `;
    document.head.appendChild(breadcrumbStyle);
    
    inicializarBuscadores();
    
    // Determinar si estamos en la página de producto
    const esProducto = window.location.pathname.includes('/ver-producto.html');
    const esCategoria = window.location.pathname.includes('/ver-productos/categoria.html');
    
    if (esProducto) {
        const urlParams = new URLSearchParams(window.location.search);
        const productoId = urlParams.get('id');
        if (productoId) {
            cargarDetalleProducto(productoId);
        }
    } else if (esCategoria) {
        // Asegurarnos de que la sección hero esté visible
        const sectionHero = document.querySelector('.section-hero');
        if (sectionHero) {
            sectionHero.style.display = 'block';
            sectionHero.style.opacity = '1';
        }
        await cargarCategorias();
    } else {
        cargarCategorias();
    }
});

// Función para cargar el detalle de un producto
async function cargarDetalleProducto(productoId) {
    try {
        console.log("Cargando detalle del producto:", productoId);
        
        // Primero, obtener el producto
        const response = await fetch(`${CONFIG.API_URL}/ProductoSolo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                busqueda: parseInt(productoId)
            })
        });

        if (!response.ok) {
            throw new Error(`Error al cargar producto: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Respuesta completa del producto:", responseText);

        let productos;
        try {
            productos = JSON.parse(responseText);
        } catch (e) {
            console.error("Error al parsear la respuesta JSON:", e);
            throw new Error("La respuesta no es un JSON válido");
        }

        // Verificar que la respuesta sea un array y tenga al menos un producto
        if (!Array.isArray(productos) || productos.length === 0) {
            throw new Error('Producto no encontrado');
        }

        // Tomar el primer producto del array
        const producto = productos[0];
        console.log("Producto cargado:", producto);

        // Obtener la categoría
        const responseCat = await fetch(`${CONFIG.API_URL}/Categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!responseCat.ok) {
            throw new Error(`Error al cargar categorías: ${responseCat.status}`);
        }

        const categorias = await responseCat.json();
        const categoria = categorias.find(cat => cat.idCategoria === producto.idCategoria);
        console.log("Categoría encontrada:", categoria);

        // Actualizar el contenido de la página
        document.title = `Rurtools - ${producto.nombreProducto || 'Producto'}`;
        
        // Actualizar metadatos
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = producto.descripcionProducto || '';
        }
        
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = `${producto.nombreProducto || ''}, ${categoria?.nombreCategoria || ''}, Lüsqtoff, productos`;
        }

        // Construir array de imágenes adicionales
        const imagenes = [
            producto.fotoProducto2,
            producto.fotoProducto3,
            producto.fotoProducto4
        ].filter(img => img && img !== '');

        // Actualizar el contenido del producto
        const imagenUrl = construirUrlImagen(producto);
        console.log('URL de imagen principal:', imagenUrl);

        // Actualizar la sección del producto
        const productSection = document.querySelector('.section.bg-white .container');
        if (productSection) {
            productSection.innerHTML = `
                <div class="section-header prod-header mb-4">
                    <div>
                        <span class="badge text-bg-dark">${categoria?.nombreCategoria || 'Hogar & Recreación'}</span>
                        <span class="badge text-bg-dark">${producto.SKUCode || producto.idProducto || ''}</span>
                        <h1 class="color-orange text-start mb-0">${producto.nombreProducto || 'Producto'}</h1>
                    </div>
                </div>

                <div class="product-page">
                    <div class="row">
                        <div class="col-12 col-md-6 col-lg-7">
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-specs" type="button" role="tab">Ficha técnica</button>
                            </div>

                            <div class="tab-content">
                                <div class="tab-pane fade show active" id="nav-specs" role="tabpanel" tabindex="0">
                                    ${producto.descripcionProducto || 'No hay descripción disponible'}
                                    <h3 class="color-orange mt-5">
                                        ${producto.precioProducto && producto.precioProducto !== '0' ? 
                                            `Precio $${parseFloat(producto.precioProducto).toLocaleString('es-AR')}` : 
                                            'Consultar precio'}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 col-lg-5">
                            <div class="nav nav-tabs justify-content-end" id="nav-tab" role="tablist">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-photos" type="button" role="tab">Fotos de producto</button>
                            </div>

                            <div class="product-image-container">
                                <a class="product-image" href="${imagenUrl}" data-fancybox="product-photos">
                                    <div class="image" style="background-image:url('${imagenUrl}')"></div>
                                    <div class="overlay">
                                        <i class="fa-solid fa-magnifying-glass-plus fa-fw"></i>
                                    </div>
                                </a>
                            </div>

                            ${imagenes.length > 0 ? `
                                <div class="product-thumbs">
                                    ${imagenes.map(imagen => {
                                        if (!imagen) return '';
                                        const thumbUrl = construirUrlImagen({ fotoProducto: imagen });
                                        return `
                                            <a class="product-image thumb" href="${thumbUrl}" data-fancybox="product-photos">
                                                <div class="image" style="background-image:url('${thumbUrl}')"></div>
                                                <div class="overlay">
                                                    <i class="fa-solid fa-magnifying-glass-plus fa-fw"></i>
                                                </div>
                                            </a>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;

            // Verificar si la imagen principal carga correctamente
            const img = new Image();
            img.onload = () => console.log('Imagen principal cargada correctamente:', imagenUrl);
            img.onerror = (e) => console.error('Error al cargar la imagen principal:', imagenUrl, e);
            img.src = imagenUrl;
        }

        // Cargar productos relacionados si existe categoría
        if (producto.idCategoria) {
            await cargarProductosRelacionados(producto.idCategoria, producto.SKUCode || producto.idProducto);
        }

    } catch (error) {
        console.error('Error al cargar el detalle del producto:', error);
        const productSection = document.querySelector('.section.bg-white .container');
        if (productSection) {
            productSection.innerHTML = `
                <div class="row">
                    <div class="col-12 text-center">
                        <p class="text-danger">Error al cargar el producto: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
}

// Función para cargar productos relacionados
async function cargarProductosRelacionados(categoriaId, productoActualId) {
    try {
        console.log("Cargando productos relacionados. Categoría:", categoriaId, "Producto actual:", productoActualId);
        
        const response = await fetch(`${CONFIG.API_URL}/ProductosCategorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                busqueda: [parseInt(categoriaId)]
            })
        });

        if (!response.ok) {
            throw new Error(`Error al cargar productos relacionados: ${response.status}`);
        }

        const productos = await response.json();
        console.log("Productos de la categoría cargados:", productos);

        if (!Array.isArray(productos)) {
            throw new Error('La respuesta no es un array válido');
        }

        const productosRelacionados = productos
            .filter(p => (p.SKUCode || p.idProducto) !== productoActualId)
            .slice(0, 4); // Mostrar solo 4 productos relacionados

        console.log("Productos relacionados filtrados:", productosRelacionados);

        const container = document.querySelector('#productos-relacionados');
        if (container && productosRelacionados.length > 0) {
            // Agregar título de sección
            container.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h2>Productos relacionados</h2>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        ${productosRelacionados.map(producto => {
                            const imagenUrl = construirUrlImagen(producto);

                            return `
                                <div class="col-6 col-lg-3">
                                    <a href="ver-producto.html?id=${producto.SKUCode || producto.idProducto}" class="prod-link">
                                        <div class="image" style="background-image:url('${imagenUrl}')"></div>
                                        <div class="name" data-mh="product">${producto.nombreProducto}</div>
                                        <div class="sku">${producto.SKUCode || producto.idProducto}</div>
                                        <div class="price">
                                            ${producto.precioProducto && producto.precioProducto !== '0' ? 
                                                `$${parseFloat(producto.precioProducto).toLocaleString('es-AR')}` : 
                                                'Consultar precio'}
                                        </div>
                                        <div class="dots"></div>
                                        <div class="overlay">
                                            <div class="specs">
                                                ${producto.descripcionProducto || ''}
                                            </div>
                                            <div class="btn btn-sm btn-outline-light">Ver producto</div>
                                        </div>
                                    </a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            // Inicializar matchHeight para los nombres de productos
            if (typeof $.fn.matchHeight !== 'undefined') {
                $('[data-mh="product"]').matchHeight();
            }
        } else {
            console.log("No se encontró el contenedor de productos relacionados o no hay productos para mostrar");
        }

    } catch (error) {
        console.error('Error al cargar productos relacionados:', error);
        const container = document.querySelector('#productos-relacionados');
        if (container) {
            container.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <p class="text-danger">Error al cargar productos relacionados: ${error.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Función para construir la URL de la imagen del producto
function construirUrlImagen(producto) {
    if (!producto || !producto.fotoProducto) {
        return `${CONFIG.UPLOADS_URL}/Productos/default.jpg`;
    }

    // Verificar si la URL ya incluye el dominio
    if (producto.fotoProducto.startsWith('http')) {
        // Asegurarse de que la URL use HTTPS
        return producto.fotoProducto.replace('http:', 'https:');
    }

    // Construir la URL completa
    return `${CONFIG.IMAGES_URL}/${producto.fotoProducto}`;
}

async function realizarBusqueda(termino) {
    console.log("Realizando búsqueda:", termino);
    try {
        // Primero obtenemos todas las categorías
        const response = await fetch(`${CONFIG.API_URL}/Categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar categorías: ${response.status}`);
        }

        const categorias = await response.json();
        console.log("Categorías disponibles:", categorias);
        
        // Filtrar categorías activas que coinciden con el término de búsqueda
        const categoriasCoincidentes = categorias
            .filter(cat => cat.activo === "1")
            .filter(cat => 
                cat.nombreCategoria.toLowerCase().includes(termino.toLowerCase()) ||
                (cat.descripcionCategoria || '').toLowerCase().includes(termino.toLowerCase())
            );

        console.log("Categorías coincidentes:", categoriasCoincidentes);

        // Obtener todas las categorías activas para buscar productos
        const todasLasCategorias = categorias
            .filter(cat => cat.activo === "1")
            .map(cat => parseInt(cat.idCategoria));

        // Buscar productos en todas las categorías
        const responseProductos = await fetch(`${CONFIG.API_URL}/ProductosCategorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                busqueda: todasLasCategorias
            })
        });

        console.log("Estado de la respuesta:", responseProductos.status);
        const responseText = await responseProductos.text();
        console.log("Respuesta de la API:", responseText);

        let productos;
        try {
            productos = JSON.parse(responseText);
            console.log("Productos encontrados:", productos);
        } catch (e) {
            console.error("Error al parsear JSON:", e);
            console.error("Texto recibido:", responseText);
            throw new Error("La respuesta no es un JSON válido");
        }

        // Filtrar productos que coinciden con el término de búsqueda
        const productosFiltrados = Array.isArray(productos) ? productos.filter(producto => {
            const searchTerm = termino.toLowerCase();
            return (
                producto.nombreProducto.toLowerCase().includes(searchTerm) ||
                (producto.descripcionProducto || '').toLowerCase().includes(searchTerm) ||
                (producto.SKUCode || '').toLowerCase().includes(searchTerm)
            );
        }) : [];

        console.log("Productos filtrados:", productosFiltrados);

        // Mostrar resultados
        const contenedorPrincipal = document.querySelector('.section .row.justify-content-center');
        if (!contenedorPrincipal) {
            throw new Error("No se encontró el contenedor para mostrar resultados");
        }

        // Verificar si hay resultados (categorías o productos)
        if (categoriasCoincidentes.length === 0 && productosFiltrados.length === 0) {
            contenedorPrincipal.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-white">No se encontraron categorías ni productos para "${termino}"</p>
                    <p class="text-white">Intente con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        // Generar HTML para los resultados
        let resultadosHTML = `
            <div class="col-12 mb-4">
                <h2 class="text-white">Resultados para: "${termino}"</h2>
            </div>
        `;

        // Mostrar categorías coincidentes si hay
        if (categoriasCoincidentes.length > 0) {
            resultadosHTML += `
                <div class="col-12 mb-4">
                    <h3 class="text-white">Categorías (${categoriasCoincidentes.length})</h3>
                </div>
            `;

            categoriasCoincidentes.forEach(categoria => {
                const imagePath = CONFIG.isLocal 
                    ? '../2023/uploads/rur-imagenes/omar-sobhy-nasef-0dy0i_je0q8-unsplash.jpg'
                    : './2023/uploads/rur-imagenes/omar-sobhy-nasef-0dy0i_je0q8-unsplash.jpg';

                resultadosHTML += `
                    <div class="col-6 col-lg-4 col-xl-3">
                        <a href="${CONFIG.isLocal ? 'ver-productos/categoria.html' : './ver-productos/categoria.html'}?id=${categoria.idCategoria}" class="cat-link">
                            <div class="image" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imagePath}');"></div>
                            <div class="name">${categoria.nombreCategoria}</div>
                            <div class="dots"></div>
                        </a>
                    </div>
                `;
            });
        }

        // Mostrar productos coincidentes si hay
        if (productosFiltrados.length > 0) {
            resultadosHTML += `
                <div class="col-12 mb-4 mt-4">
                    <h3 class="text-white">Productos (${productosFiltrados.length})</h3>
                </div>
            `;

            productosFiltrados.forEach(producto => {
                const imagenUrl = construirUrlImagen(producto);
                console.log('URL de imagen generada para producto', producto.idProducto, ':', imagenUrl);

                resultadosHTML += `
                    <div class="col-6 col-lg-4 col-xl-3">
                        <a href="${CONFIG.isLocal ? 'ver-producto.html' : './ver-producto.html'}?id=${producto.SKUCode || producto.idProducto}" class="prod-link">
                            <div class="image" style="background-image:url('${imagenUrl}')"></div>
                            <div class="name" data-mh="product">${producto.nombreProducto}</div>
                            <div class="sku">${producto.SKUCode || producto.idProducto}</div>
                            <div class="price">
                                ${producto.precioProducto && producto.precioProducto !== '0' ? 
                                    `$${parseFloat(producto.precioProducto).toLocaleString('es-AR')}` : 
                                    'Consultar precio'}
                            </div>
                            <div class="dots"></div>
                            <div class="overlay">
                                <div class="specs">
                                    ${producto.descripcionProducto || ''}
                                </div>
                                <div class="btn btn-sm btn-outline-light">Ver producto</div>
                            </div>
                        </a>
                    </div>
                `;

                // Verificar si la imagen carga correctamente
                const img = new Image();
                img.onload = () => console.log('Imagen cargada correctamente:', imagenUrl);
                img.onerror = () => console.error('Error al cargar la imagen:', imagenUrl);
                img.src = imagenUrl;
            });
        }

        contenedorPrincipal.innerHTML = resultadosHTML;

        // Inicializar matchHeight para los nombres de productos
        if (typeof $.fn.matchHeight !== 'undefined') {
            $('[data-mh="product"]').matchHeight();
        }

    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        const contenedorPrincipal = document.querySelector('.section .row.justify-content-center');
        if (contenedorPrincipal) {
            contenedorPrincipal.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-white">${error.message}</p>
                    <p class="text-white">Por favor, intente nuevamente o pruebe con otros términos de búsqueda.</p>
                </div>
            `;
        }
    }
}

// Función para obtener la URL de búsqueda según la ubicación
function getSearchUrl() {
    if (CONFIG.isLocal) {
        return '/ver-productos.html';
    } else {
        return '/home/rurtools-3/rurtools/ver-productos.html';
    }
}

// Función para inicializar los buscadores
function inicializarBuscadores() {
    console.log("Inicializando buscadores...");
    console.log("Entorno:", CONFIG.isLocal ? "Local" : "Producción");
    console.log("Ruta actual:", window.location.pathname);

    // Si no existe el overlay, lo creamos
    if (!document.querySelector('.search-overlay')) {
        const overlayHTML = `
            <div class="search-overlay">
                <button class="f-button close-search" title="Close">
                    <svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m19.5 4.5-15 15M4.5 4.5l15 15"></path>
                    </svg>
                </button>

                <div class="container">
                    <form action="${getSearchUrl()}" method="get">
                        <div class="input-group">
                            <input type="text" class="form-control" id="search-input" name="s" 
                                placeholder="Buscar producto o categoría..." />
                            <button class="btn" type="submit">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
    }

    // Reseleccionar elementos después de posiblemente crearlos
    const searchOverlayElement = document.querySelector('.search-overlay');
    const overlayFormElement = searchOverlayElement?.querySelector('form');
    const overlayInputElement = overlayFormElement?.querySelector('input[type="text"]');
    const closeSearchElement = searchOverlayElement?.querySelector('.close-search');

    // Configurar el formulario del overlay
    if (overlayFormElement) {
        overlayFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = overlayFormElement.querySelector('input[type="text"], input[name="s"]');
            if (!input || !input.value.trim()) {
                return;
            }
            
            const searchTerm = input.value.trim();
            
            // Cerrar el overlay
            if (searchOverlayElement) {
                searchOverlayElement.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Si estamos en la página de productos, realizar la búsqueda directamente
            if (window.location.pathname.includes('ver-productos')) {
                await realizarBusqueda(searchTerm);
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('s', searchTerm);
                window.history.pushState({}, '', newUrl);
            } else {
                // Si no estamos en la página de productos, redirigir
                const searchUrl = getSearchUrl();
                window.location.href = `${searchUrl}?s=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Configurar el botón de búsqueda
    document.querySelectorAll('.btn-search').forEach(btn => {
        btn.addEventListener('click', () => {
            if (searchOverlayElement) {
                searchOverlayElement.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (overlayInputElement) {
                    setTimeout(() => overlayInputElement.focus(), 100);
                }
            }
        });
    });

    // Configurar el botón de cierre
    if (closeSearchElement) {
        closeSearchElement.addEventListener('click', () => {
            searchOverlayElement.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlayElement?.classList.contains('active')) {
            searchOverlayElement.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Configurar formularios de búsqueda normales
    document.querySelectorAll('form.search-form, form.search, form[action*="ver-productos.html"]').forEach(form => {
        if (form.closest('.search-overlay')) return; // Ignorar el formulario del overlay
        
        console.log("Configurando formulario de búsqueda:", form);
        form.setAttribute('action', getSearchUrl());
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="text"], input[name="s"]');
            if (!input || !input.value.trim()) {
                return;
            }
            
            const searchTerm = input.value.trim();
            console.log('Término de búsqueda:', searchTerm);
            
            // Si estamos en la página de productos, realizar la búsqueda directamente
            if (window.location.pathname.includes('ver-productos')) {
                await realizarBusqueda(searchTerm);
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('s', searchTerm);
                window.history.pushState({}, '', newUrl);
            } else {
                window.location.href = `${getSearchUrl()}?s=${encodeURIComponent(searchTerm)}`;
            }
        });
    });

    // Ejecutar búsqueda si hay término en la URL
    if (window.location.pathname.includes('ver-productos')) {
        const urlParams = new URLSearchParams(window.location.search);
        const terminoBusqueda = urlParams.get('s');
        if (terminoBusqueda) {
            console.log("Término de búsqueda encontrado en URL:", terminoBusqueda);
            realizarBusqueda(terminoBusqueda);
            document.querySelectorAll('input[type="text"], input[name="s"]').forEach(input => {
                input.value = terminoBusqueda;
            });
        }
    }
}