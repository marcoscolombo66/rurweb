<?php
header('Content-Type: application/json');

// Permitir CORS para desarrollo local
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

try {
    // Obtener el contenido JSON enviado
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if (!$data) {
        throw new Exception('Datos inválidos');
    }

    // Validar datos requeridos
    if (!isset($data->nombre) || !isset($data->contenido) || !isset($data->categoriaId)) {
        throw new Exception('Faltan datos requeridos');
    }

    // Directorio donde se guardarán los archivos
    $dir = '../../ver-productos/';

    // Asegurarse de que el directorio existe
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }

    // Ruta completa del archivo
    $filePath = $dir . $data->nombre;

    // Guardar el archivo
    if (file_put_contents($filePath, $data->contenido) === false) {
        throw new Exception('Error al guardar el archivo');
    }

    // Registrar en el log
    error_log("Archivo de categoría guardado: " . $data->nombre);

    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Archivo guardado correctamente',
        'file' => $data->nombre
    ]);

} catch (Exception $e) {
    // Registrar el error
    error_log("Error guardando archivo de categoría: " . $e->getMessage());

    // Respuesta de error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 