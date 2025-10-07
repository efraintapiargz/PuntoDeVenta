// ============================================
// CONFIGURACIÓN DE RED - SISTEMA POS
// ============================================

const os = require('os');

// Función para obtener la IP local automáticamente
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    
    for (const connection of networkInterface) {
      // Buscar IPv4 que no sea localhost y que esté activa
      if (connection.family === 'IPv4' && !connection.internal) {
        return connection.address;
      }
    }
  }
  
  return 'localhost'; // Fallback
}

const LOCAL_IP = getLocalIP();
const PORT = 3001;

module.exports = {
  LOCAL_IP,
  PORT,
  SERVER_URL: `http://${LOCAL_IP}:${PORT}`,
  WEBSOCKET_URL: `ws://${LOCAL_IP}:${PORT}`
};