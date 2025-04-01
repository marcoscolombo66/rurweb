// Configuración de la API
const API_CONFIG = {
    isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    get BASE_URL() {
        return this.isLocal 
            ? 'http://localhost/rurtools/admin/api'
            : 'https://rurtools.com.ar/admin/api';
    },
    
    get PRODUCTOS_ENDPOINT() {
        return '/ProductosCategorias';
    },

    get SITE_BASE() {
        return this.isLocal 
            ? '/rurtools'
            : '/home/rurtools-3/rurtools';
    }
};

// Función para manejar la búsqueda
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = document.querySelector('input[name="s"]').value.trim();
    
    if (!searchTerm) {
        return;
    }

    try {
        console.log('Realizando búsqueda en:', API_CONFIG.BASE_URL + API_CONFIG.PRODUCTOS_ENDPOINT);
        await realizarBusqueda(searchTerm);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        // Mostrar mensaje de error al usuario
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al realizar la búsqueda. Por favor, intente nuevamente.',
                icon: 'error'
            });
        }
    }
}

// Función para manejar el input de búsqueda
async function handleSearchInput(e) {
    const searchTerm = e.target.value.trim();
    
    if (!searchTerm) {
        clearResults();
        return;
    }

    try {
        await realizarBusqueda(searchTerm);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
}

// Función para realizar la búsqueda
async function searchProducts(searchTerm) {
    try {
        console.log('Configuración actual:', {
            isLocal: API_CONFIG.isLocal,
            baseUrl: API_CONFIG.BASE_URL,
            endpoint: API_CONFIG.PRODUCTOS_ENDPOINT,
            fullUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTOS_ENDPOINT}`
        });

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTOS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                busqueda: searchTerm.toLowerCase(),
                tipo: 'texto'
            })
        });

        if (!response.ok) {
            console.error('Error en la respuesta:', {
                status: response.status,
                statusText: response.statusText
            });
            const errorText = await response.text();
            console.error('Detalle del error:', errorText);
            throw new Error('Error en la búsqueda');
        }

        return await response.json();
    } catch (error) {
        console.error('Error buscando productos:', error);
        throw error;
    }
}

// Función para limpiar resultados
function clearResults() {
    const resultsContainer = document.querySelector('#search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

// Inicializar los eventos de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('form.search');
    const searchInput = document.querySelector('input[name="s"]');

    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
}); 