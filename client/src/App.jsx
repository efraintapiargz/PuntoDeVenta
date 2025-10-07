import { useState, useEffect } from 'react';
import { ShoppingCart, LayoutDashboard, Home } from 'lucide-react';
import MenuView from './components/MenuView';
import CartView from './components/CartView';
import OrdersView from './components/OrdersView';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'cart', 'orders'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde la API
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
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
      const response = await fetch('http://localhost:3000/api/orders');
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

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Orden #${data.data.orderId} creada exitosamente!`);
        clearCart();
        fetchOrders(); // Recargar órdenes
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
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        fetchOrders(); // Recargar órdenes
      } else {
        alert('Error al actualizar orden: ' + data.message);
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
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchOrders(); // Recargar órdenes
      } else {
        alert('Error al eliminar orden: ' + data.message);
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
                <p className="text-xs text-gray-500 hidden sm:block">
                  Sistema de Punto de Venta
                </p>
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
                refreshOrders={fetchOrders}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Sistema POS Restaurante - Conectado a API REST
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
