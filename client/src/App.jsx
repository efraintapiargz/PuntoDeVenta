import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, LayoutDashboard, Home, Wifi, WifiOff } from 'lucide-react';
import { io } from 'socket.io-client';
import MenuView from './components/MenuView';
import CartView from './components/CartView';
import OrdersView from './components/OrdersView';

// Obtener la URL del servidor basada en la ubicación actual
const getServerUrl = () => {
  const hostname = window.location.hostname;
  
  // Si estamos en localhost, usar localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Si estamos en la red local, usar la IP de la red
  return `http://${hostname}:3001`;
};

const SERVER_URL = getServerUrl();

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'cart', 'orders'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  // Inicializar WebSocket y cargar datos iniciales
  useEffect(() => {
    // Conectar a WebSocket
    socketRef.current = io(SERVER_URL);
    
    // Event listeners de conexión
    socketRef.current.on('connect', () => {
      console.log('🔗 Conectado al servidor WebSocket');
      setConnected(true);
      setLoading(false);
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('❌ Desconectado del servidor WebSocket');
      setConnected(false);
    });
    
    // Recibir datos iniciales
    socketRef.current.on('products', (productsData) => {
      setProducts(productsData);
    });
    
    socketRef.current.on('orders', (ordersData) => {
      setOrders(ordersData);
    });
    
    // Escuchar actualizaciones en tiempo real
    socketRef.current.on('newOrder', (newOrder) => {
      addNotification(`📋 Nueva orden #${newOrder.orderId} - Mesa ${newOrder.tableNumber}`, 'success');
    });
    
    socketRef.current.on('orderUpdated', (data) => {
      const statusEmoji = {
        pending: '⏳',
        preparing: '👨‍🍳',
        ready: '✅',
        delivered: '📦'
      };
      addNotification(
        `${statusEmoji[data.newStatus]} Orden #${data.orderId} → ${data.newStatus.toUpperCase()}`,
        'info'
      );
    });
    
    socketRef.current.on('orderDeleted', (data) => {
      addNotification(`🗑️ Orden #${data.orderId} eliminada`, 'warning');
    });
    
    // Fallback: cargar datos por HTTP si WebSocket falla
    const fallbackTimeout = setTimeout(() => {
      if (!connected) {
        fetchProducts();
        fetchOrders();
      }
    }, 3000);
    
    // Cleanup al desmontar
    return () => {
      clearTimeout(fallbackTimeout);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Función para agregar notificaciones
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/orders`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    }
  };

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  // Actualizar cantidad en el carrito
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Eliminar del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Crear nueva orden
  const createOrder = async (customerName, tableNumber, notes) => {
    try {
      const orderData = {
        customerName,
        tableNumber: parseInt(tableNumber),
        items: cart,
        total: cartTotal,
        notes
      };

      const response = await fetch(`${SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        addNotification(`✅ Orden #${data.data.orderId} creada exitosamente!`, 'success');
        clearCart();
        setCurrentView('orders');
        return true;
      } else {
        alert('❌ Error al crear la orden: ' + data.message);
        return false;
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert('❌ Error al conectar con el servidor');
      return false;
    }
  };

  // Actualizar estado de orden
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // WebSocket se encarga de la actualización automática
      } else {
        addNotification('❌ Error al actualizar orden: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      alert('Error al conectar con el servidor');
    }
  };

  // Eliminar orden
  const deleteOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de eliminar esta orden?')) return;

    try {
      const response = await fetch(`${SERVER_URL}/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // WebSocket se encarga de la actualización automática
      } else {
        addNotification('❌ Error al eliminar orden: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🍔</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  POS Restaurante
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Sistema de Punto de Venta
                  </p>
                  <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                    connected 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                    <span className="hidden sm:inline">
                      {connected ? 'Tiempo Real' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('menu')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  currentView === 'menu'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home size={20} />
                <span className="hidden sm:inline">Menú</span>
              </button>

              <button
                onClick={() => setCurrentView('cart')}
                className={`relative flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  currentView === 'cart'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Carrito</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('orders')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  currentView === 'orders'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">Órdenes</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {currentView === 'menu' && (
              <MenuView
                products={products}
                cart={cart}
                addToCart={addToCart}
                onGoToCart={() => setCurrentView('cart')}
              />
            )}

            {currentView === 'cart' && (
              <CartView
                cart={cart}
                updateQuantity={updateCartQuantity}
                removeItem={removeFromCart}
                total={cartTotal}
                createOrder={createOrder}
                onBackToMenu={() => setCurrentView('menu')}
              />
            )}

            {currentView === 'orders' && (
              <OrdersView
                orders={orders}
                updateOrderStatus={updateOrderStatus}
                deleteOrder={deleteOrder}
              />
            )}
          </>
        )}
      </main>

      {/* Notificaciones en tiempo real */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg max-w-sm animate-pulse ${
                notification.type === 'success' ? 'bg-green-500 text-white' :
                notification.type === 'error' ? 'bg-red-500 text-white' :
                notification.type === 'warning' ? 'bg-yellow-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Sistema POS Restaurante - {connected ? '🔗 Tiempo Real Activo' : '📡 API REST'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
