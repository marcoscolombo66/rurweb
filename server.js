const express = require('express');
const path = require('path');
const app = express();

// Configurar MIME types
express.static.mime.define({'text/css': ['css']});
express.static.mime.define({'application/javascript': ['js']});

// Servir archivos estáticos
app.use(express.static(__dirname));

// Manejar todas las rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'ver-producto.html'));
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 