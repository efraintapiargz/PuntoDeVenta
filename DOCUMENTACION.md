# DOCUMENTACIÓN - SISTEMA POS RESTAURANTE

## INFORMACIÓN GENERAL

### Descripción
Sistema de Punto de Venta (POS) para restaurantes con sincronización en tiempo real entre dispositivos. Permite a meseros tomar órdenes desde dispositivos móviles mientras el personal de cocina y administradores gestionan las órdenes desde computadoras.

### Características principales
- **Tiempo real**: Sincronización instantánea via WebSockets
- **Multiplataforma**: Acceso desde computadora y móviles
- **Gestión de menú**: 10+ productos predefinidos
- **Carrito inteligente**: Agregar/quitar productos con cantidades
- **Gestión de órdenes**: Estados (pendiente, preparando, listo, entregado)
- **Responsive**: Diseño adaptativo con Tailwind CSS

### Tecnologías utilizadas
- **Backend**: Node.js + Express.js + Socket.IO
- **Frontend**: React.js + Vite + Tailwind CSS
- **Comunicación**: REST API + WebSockets
- **Iconos**: Lucide React

---

## ARQUITECTURA DEL SISTEMA

### Estructura del proyecto
```
punto-de-venta/
├── Backend (Raíz)
│   ├── server.js           # Servidor principal con API y WebSockets
│   ├── config.js           # Configuración de red
│   ├── package.json        # Dependencias del backend
│   └── node_modules/       # Módulos de Node.js
│
├── Frontend (client/)
│   ├── src/
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Punto de entrada
│   │   ├── index.css       # Estilos Tailwind
│   │   └── components/
│   │       ├── MenuView.jsx    # Vista del menú
│   │       ├── CartView.jsx    # Vista del carrito
│   │       └── OrdersView.jsx  # Vista de órdenes
│   ├── package.json        # Dependencias del frontend
│   └── vite.config.js      # Configuración de Vite
│
└── Documentación
    ├── README.md           # Información básica
    ├── ACCESO_MOVIL.md     # Guía de acceso móvil
    ├── GUIA_RAPIDA.md      # Guía rápida de uso
    └── DOCUMENTACION.md    # Este archivo
```

### Flujo de datos
```
[MÓVIL] ← WebSocket → [BACKEND] ← WebSocket → [COMPUTADORA]
   ↓                      ↓                        ↓
Mesero                 Servidor                 Cocina/Admin
Crear órdenes         Sincronización          Gestión órdenes
```

---

## CONFIGURACIÓN E INSTALACIÓN

### Requisitos previos
- **Node.js** v16 o superior
- **npm** v8 o superior
- Conexión de red local (WiFi)

### Instalación paso a paso

#### 1. Clonar el repositorio
```bash
git clone https://github.com/efraintapiargz/PuntoDeVenta.git
cd PuntoDeVenta
```

#### 2. Instalar dependencias del backend
```bash
npm install
```

#### 3. Instalar dependencias del frontend
```bash
cd client
npm install
cd ..
```

#### 4. Configurar la red
```bash
# Obtener IP local
ipconfig           # Windows
ip addr show       # Linux
ifconfig          # Mac
```

#### 5. Iniciar el sistema
```bash
# Terminal 1: Backend
npm start

# Terminal 2: Frontend
cd client
npm run dev -- --host
```

---

## COMPONENTES TÉCNICOS

### Backend (server.js)
**Puerto**: 3001
**Tecnologías**: Express.js + Socket.IO + CORS

#### Características:
- **API REST**: Endpoints para productos y órdenes
- **WebSockets**: Comunicación en tiempo real
- **CORS habilitado**: Acceso desde diferentes orígenes
- **Logging**: Registro de todas las peticiones

#### Endpoints principales:
```
GET    /api/products     # Obtener lista de productos
GET    /api/orders       # Obtener todas las órdenes
POST   /api/orders       # Crear nueva orden
PUT    /api/orders/:id   # Actualizar estado de orden
DELETE /api/orders/:id   # Eliminar orden
```

#### Eventos WebSocket:
```
products          # Envía lista de productos
orders           # Envía lista de órdenes  
new-order        # Nueva orden creada
order-updated    # Estado de orden actualizado
order-deleted    # Orden eliminada
```

### Frontend (React)
**Puerto**: 5173
**Tecnologías**: React.js + Vite + Tailwind CSS + Socket.IO Client

#### Componentes principales:

##### App.jsx
- **Estado global**: Maneja productos, carrito, órdenes
- **WebSocket cliente**: Conexión y eventos en tiempo real
- **Navegación**: Sistema de vistas (menú, carrito, órdenes)
- **Notificaciones**: Sistema de alertas para eventos

##### MenuView.jsx
- **Visualización**: Grid responsive de productos
- **Interacción**: Botones de agregar al carrito
- **Diseño**: Cards con emojis y precios

##### CartView.jsx
- **Gestión**: Agregar, quitar, vaciar carrito
- **Cálculos**: Total automático
- **Acciones**: Crear orden desde carrito

##### OrdersView.jsx
- **Visualización**: Lista de órdenes en tiempo real
- **Estados**: Badges coloridos por estado
- **Gestión**: Cambiar estados, eliminar órdenes

---

## USO DEL SISTEMA

### Para Meseros (Móvil)
1. **Conectar**: Mismo WiFi que el servidor
2. **Acceder**: `http://[IP_SERVIDOR]:5173`
3. **Tomar orden**: 
   - Ver menú - Agregar productos - Revisar carrito - Crear orden
4. **Seguimiento**: Ver estado de órdenes en tiempo real

### Para Cocina/Administradores (Computadora)
1. **Acceder**: `http://localhost:5173`
2. **Gestionar órdenes**:
   - Ver órdenes entrantes automáticamente
   - Cambiar estados: Pendiente - Preparando - Listo - Entregado
   - Eliminar órdenes completadas

---

## CONFIGURACIÓN AVANZADA

### Archivo config.js
```javascript
module.exports = {
  LOCAL_IP: '192.168.100.9',  # Tu IP local
  PORT: 3001,                 # Puerto del backend
  SERVER_URL: 'http://192.168.100.9:3001'
};
```

### Personalización de productos
Los productos están definidos en `server.js`:
```javascript
const products = [
  { id: 1, name: '🍕 Pizza Margherita', price: 12.99 },
  { id: 2, name: '🍔 Hamburguesa Clásica', price: 8.50 },
  // ... más productos
];
```

### Configuración de Vite
El frontend usa Vite con configuración para acceso de red:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true  // Permite acceso desde la red
  }
});
```

---

## NETWORKING Y CONECTIVIDAD

### Puertos utilizados
- **3001**: Backend API + WebSockets
- **5173**: Frontend React (desarrollo)
- **Auto**: El frontend detecta automáticamente la IP

### Configuración automática de IP
El sistema detecta automáticamente la configuración de red:
```javascript
const getServerUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost') {
    return 'http://localhost:3001';
  }
  
  return `http://${hostname}:3001`;
};
```

---

## SOLUCIÓN DE PROBLEMAS

### Problemas comunes

#### 1. No se conecta desde móvil
- **Verificar WiFi**: Misma red en ambos dispositivos
- **Firewall**: Temporalmente desactivar
- **IP correcta**: Usar `ipconfig` para verificar

#### 2. WebSockets no funciona
- **Puerto bloqueado**: Verificar puerto 3001 disponible
- **CORS**: Configuración en server.js
- **Reiniciar**: Backend y frontend

#### 3. No sincroniza en tiempo real
- **Conexión**: Verificar ícono de estado
- **Logs**: Revisar consola del navegador
- **Backend activo**: Confirmar servidor en puerto 3001

### Comandos de diagnóstico
```bash
# Verificar puertos
netstat -an | findstr "3001\|5173"

# Ver IP detallada
ipconfig /all

# Reiniciar red (Windows)
ipconfig /release && ipconfig /renew
```

---

## RENDIMIENTO Y ESCALABILIDAD

### Métricas actuales
- **Capacidad**: Aproximadamente 100 conexiones simultáneas
- **Latencia**: Menos de 50ms en red local
- **Memoria**: Aproximadamente 50MB backend, 30MB frontend
- **Productos**: Configurado para más de 10 productos

### Optimizaciones implementadas
- **WebSockets**: Comunicación eficiente
- **Estado local**: Cache en frontend
- **Lazy loading**: Componentes según demanda
- **Responsive design**: Una sola interfaz para todos los dispositivos

---

## SEGURIDAD

### Medidas implementadas
- **CORS configurado**: Orígenes controlados
- **Validación**: Datos de entrada
- **Logs**: Registro de actividades
- **Red local**: Solo acceso en LAN

### Consideraciones de producción
- Implementar autenticación
- HTTPS para comunicación segura
- Rate limiting
- Validación más estricta

---

## DESPLIEGUE

### Desarrollo local
```bash
npm start              # Backend
cd client && npm run dev -- --host  # Frontend
```

### Construcción para producción
```bash
cd client
npm run build
npm run preview
```

### Variables de entorno recomendadas
```env
NODE_ENV=production
PORT=3001
LOCAL_IP=tu_ip_produccion
```

---

## CONTRIBUCIÓN

### Estructura de commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores  
- `docs:` Documentación
- `style:` Cambios de estilo
- `refactor:` Refactorización

### Workflow recomendado
1. Fork del repositorio
2. Crear rama feature
3. Commits descriptivos
4. Pull request con descripción

---

## LICENCIA

ISC License - Ver archivo LICENSE para más detalles.

---

## SOPORTE

### Información del proyecto
- **Repositorio**: https://github.com/efraintapiargz/PuntoDeVenta
- **Autor**: efraintapiargz
- **Versión**: 1.0.0
- **Última actualización**: Octubre 2025

### Documentación adicional
- `ACCESO_MOVIL.md`: Guía detallada de acceso móvil
- `GUIA_RAPIDA.md`: Inicio rápido
- `README.md`: Información básica del proyecto

---

*Esta documentación cubre todos los aspectos técnicos y de uso del Sistema POS. Para consultas específicas, revisar los archivos de documentación adicionales.*