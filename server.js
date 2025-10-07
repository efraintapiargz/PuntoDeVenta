// ============================================
// API REST - SISTEMA POS RESTAURANTE
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

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
// DATOS EN MEMORIA
// ============================================

// Catálogo de productos del restaurante
let products = [
  // Bebidas
  { id: 1, name: 'Coca Cola', price: 2.50, category: 'Bebidas', image: 'https://via.placeholder.com/150?text=Coca+Cola' },
  { id: 2, name: 'Agua Mineral', price: 1.50, category: 'Bebidas', image: 'https://via.placeholder.com/150?text=Agua' },
  { id: 3, name: 'Jugo de Naranja', price: 3.00, category: 'Bebidas', image: 'https://via.placeholder.com/150?text=Jugo' },
  
  // Comidas
  { id: 4, name: 'Hamburguesa Clásica', price: 8.50, category: 'Comidas', image: 'https://via.placeholder.com/150?text=Hamburguesa' },
  { id: 5, name: 'Pizza Margarita', price: 12.00, category: 'Comidas', image: 'https://via.placeholder.com/150?text=Pizza' },
  { id: 6, name: 'Ensalada César', price: 7.00, category: 'Comidas', image: 'https://via.placeholder.com/150?text=Ensalada' },
  { id: 7, name: 'Pasta Carbonara', price: 10.50, category: 'Comidas', image: 'https://via.placeholder.com/150?text=Pasta' },
  
  // Postres
  { id: 8, name: 'Tiramisú', price: 5.50, category: 'Postres', image: 'https://via.placeholder.com/150?text=Tiramisu' },
  { id: 9, name: 'Cheesecake', price: 6.00, category: 'Postres', image: 'https://via.placeholder.com/150?text=Cheesecake' },
  { id: 10, name: 'Helado de Vainilla', price: 4.00, category: 'Postres', image: 'https://via.placeholder.com/150?text=Helado' }
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
    message: '🍔 API REST - Sistema POS Restaurante',
    version: '1.0.0',
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
    documentation: 'Todos los endpoints retornan JSON'
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
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('🍔 SERVIDOR POS RESTAURANTE INICIADO');
  console.log('═══════════════════════════════════════════');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📦 Productos disponibles: ${products.length}`);
  console.log(`📋 Órdenes actuales: ${orders.length}`);
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('Endpoints disponibles:');
  console.log('  GET    /api/products');
  console.log('  POST   /api/orders');
  console.log('  GET    /api/orders');
  console.log('  GET    /api/orders/:id');
  console.log('  PUT    /api/orders/:id');
  console.log('  DELETE /api/orders/:id');
  console.log('');
});
