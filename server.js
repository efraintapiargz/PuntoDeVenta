// ============================================
// API REST + WEBSOCKETS - SISTEMA POS RESTAURANTE
// ============================================

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const { LOCAL_IP, PORT, SERVER_URL } = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas las conexiones para desarrollo
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// ============================================
// MIDDLEWARES
// ============================================

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Parsear JSON en el body

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// WEBSOCKETS - TIEMPO REAL
// ============================================

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  console.log(`🔗 Cliente conectado: ${socket.id}`);
  
  // Enviar datos iniciales al conectarse
  socket.emit('products', products);
  socket.emit('orders', orders);
  
  // Escuchar desconexión
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Función para emitir actualizaciones a todos los clientes
function broadcastUpdate(event, data) {
  io.emit(event, data);
  console.log(`📡 Broadcast: ${event}`, data);
}

// ============================================
// DATOS EN MEMORIA
// ============================================

// Catálogo de productos del restaurante
let products = [
  // Bebidas
  { id: 1, name: 'Coca Cola', price: 19, category: 'Bebidas', emoji: '🥤' },
  { id: 2, name: 'Agua Mineral', price: 16, category: 'Bebidas', emoji: '💧' },
  { id: 3, name: 'Jugo de Naranja', price: 18, category: 'Bebidas', emoji: '🧃' },
  
  // Comidas
  { id: 4, name: 'Hamburguesa Clásica', price: 100, category: 'Comidas', emoji: '🍔' },
  { id: 5, name: 'Pizza Margarita', price: 120, category: 'Comidas', emoji: '🍕' },
  { id: 6, name: 'Ensalada César', price: 70, category: 'Comidas', emoji: '🥗' },
  { id: 7, name: 'Pasta Carbonara', price: 105, category: 'Comidas', emoji: '🍝' },

  // Postres
  { id: 8, name: 'Tiramisú', price: 80, category: 'Postres', emoji: '🍰' },
  { id: 9, name: 'Cheesecake', price: 60, category: 'Postres', emoji: '🎂' },
  { id: 10, name: 'Helado de Vainilla', price: 40, category: 'Postres', emoji: '🍨' }
];

// Array de órdenes en memoria
let orders = [];

// Contador para IDs de órdenes
let orderIdCounter = 1;

// ============================================
// ENDPOINTS - PRODUCTOS
// ============================================

/**
 * GET /api/products
 * Retorna todos los productos disponibles
 */
app.get('/api/products', (req, res) => {
  try {
    console.log(`📦 Obteniendo catálogo de ${products.length} productos`);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
});

// ============================================
// ENDPOINTS - ÓRDENES (CRUD)
// ============================================

/**
 * POST /api/orders
 * Crea una nueva orden
 * Body: { customerName, tableNumber, items, total, notes }
 */
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, tableNumber, items, total, notes } = req.body;

    // Validación de datos requeridos
    if (!customerName || !tableNumber || !items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: customerName, tableNumber, items y total son obligatorios'
      });
    }

    // Validación de items
    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Cada item debe tener: productId, name, price y quantity'
        });
      }
    }

    // Crear nueva orden
    const newOrder = {
      orderId: orderIdCounter++,
      customerName,
      tableNumber,
      items,
      total: parseFloat(total),
      notes: notes || '',
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    orders.push(newOrder);

    console.log(`✅ Orden #${newOrder.orderId} creada - Mesa ${tableNumber} - Total: $${total}`);

    // Notificar a todos los clientes sobre la nueva orden
    broadcastUpdate('newOrder', newOrder);
    broadcastUpdate('orders', orders);

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        orderId: newOrder.orderId,
        status: newOrder.status,
        timestamp: newOrder.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Error al crear orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la orden'
    });
  }
});

/**
 * GET /api/orders
 * Lista todas las órdenes
 * Query params: ?status=pending (opcional)
 */
app.get('/api/orders', (req, res) => {
  try {
    const { status } = req.query;

    let filteredOrders = orders;

    // Filtrar por estado si se proporciona
    if (status) {
      filteredOrders = orders.filter(order => order.status === status);
      console.log(`📋 Obteniendo órdenes con status: ${status} (${filteredOrders.length} encontradas)`);
    } else {
      console.log(`📋 Obteniendo todas las órdenes (${orders.length} total)`);
    }

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders
    });

  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las órdenes'
    });
  }
});

/**
 * GET /api/orders/:id
 * Obtiene una orden específica por ID
 */
app.get('/api/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Orden #${orderId} no encontrada`
      });
    }

    console.log(`🔍 Orden #${orderId} encontrada`);

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('❌ Error al obtener orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la orden'
    });
  }
});

/**
 * PUT /api/orders/:id
 * Actualiza el estado de una orden
 * Body: { status: 'pending' | 'preparing' | 'ready' | 'delivered' }
 */
app.put('/api/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    // Validar que se proporcione el status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'El campo status es requerido'
      });
    }

    // Validar estados permitidos
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}`
      });
    }

    // Buscar la orden
    const orderIndex = orders.findIndex(o => o.orderId === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Orden #${orderId} no encontrada`
      });
    }

    // Actualizar el estado
    const previousStatus = orders[orderIndex].status;
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    console.log(`🔄 Orden #${orderId} actualizada: ${previousStatus} → ${status}`);

    // Notificar a todos los clientes sobre la actualización
    broadcastUpdate('orderUpdated', {
      orderId: orderId,
      oldStatus: previousStatus,
      newStatus: status,
      order: orders[orderIndex]
    });
    broadcastUpdate('orders', orders);

    res.status(200).json({
      success: true,
      message: 'Orden actualizada exitosamente',
      data: orders[orderIndex]
    });

  } catch (error) {
    console.error('❌ Error al actualizar orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la orden'
    });
  }
});

/**
 * DELETE /api/orders/:id
 * Elimina/cancela una orden
 */
app.delete('/api/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    // Buscar índice de la orden
    const orderIndex = orders.findIndex(o => o.orderId === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Orden #${orderId} no encontrada`
      });
    }

    // Eliminar la orden
    const deletedOrder = orders.splice(orderIndex, 1)[0];

    console.log(`🗑️  Orden #${orderId} eliminada - Mesa ${deletedOrder.tableNumber}`);

    // Notificar a todos los clientes sobre la eliminación
    broadcastUpdate('orderDeleted', {
      orderId: orderId,
      order: deletedOrder
    });
    broadcastUpdate('orders', orders);

    res.status(200).json({
      success: true,
      message: `Orden #${orderId} eliminada exitosamente`,
      data: deletedOrder
    });

  } catch (error) {
    console.error('❌ Error al eliminar orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la orden'
    });
  }
});

// ============================================
// RUTA RAÍZ (INFO DE LA API)
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '🍔 API REST - Sistema POS Restaurante + WebSockets',
    version: '2.0.0',
    localIP: LOCAL_IP,
    urls: {
      local: `http://localhost:${PORT}`,
      network: SERVER_URL
    },
    endpoints: {
      products: 'GET /api/products',
      orders: {
        create: 'POST /api/orders',
        getAll: 'GET /api/orders',
        getOne: 'GET /api/orders/:id',
        update: 'PUT /api/orders/:id',
        delete: 'DELETE /api/orders/:id'
      }
    },
    websockets: {
      events: ['newOrder', 'orderUpdated', 'orderDeleted', 'orders', 'products']
    },
    mobile: {
      instructions: [
        '1. Conecta tu dispositivo a la misma WiFi',
        `2. Abre ${SERVER_URL} en tu navegador móvil`,
        '3. ¡Funciona en tiempo real!'
      ]
    }
  });
});

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// ============================================
// INICIAR SERVIDOR CON WEBSOCKETS
// ============================================

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('🍔 SERVIDOR POS RESTAURANTE + WEBSOCKETS');
  console.log('═══════════════════════════════════════════');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`📱 URL Red: ${SERVER_URL}`);
  console.log(`🔗 WebSockets: Habilitados para tiempo real`);
  console.log(`📦 Productos disponibles: ${products.length}`);
  console.log(`📋 Órdenes actuales: ${orders.length}`);
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('📱 ACCESO DESDE CELULAR:');
  console.log(`   1. Conecta tu celular a la misma WiFi`);
  console.log(`   2. Abre: ${SERVER_URL} en el navegador`);
  console.log(`   3. ¡Listo! Tiempo real entre dispositivos`);
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('API Endpoints:');
  console.log('  GET    /api/products');
  console.log('  POST   /api/orders');
  console.log('  GET    /api/orders');
  console.log('  GET    /api/orders/:id');
  console.log('  PUT    /api/orders/:id');
  console.log('  DELETE /api/orders/:id');
  console.log('');
  console.log('WebSocket Events:');
  console.log('  📡 newOrder - Nueva orden creada');
  console.log('  📡 orderUpdated - Estado de orden actualizado');
  console.log('  📡 orderDeleted - Orden eliminada');
  console.log('  📡 orders - Lista completa de órdenes');
  console.log('  📡 products - Lista de productos');
  console.log('');
});