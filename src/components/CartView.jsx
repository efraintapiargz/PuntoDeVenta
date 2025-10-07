import { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Send } from 'lucide-react';

function CartView({ cart, updateQuantity, removeItem, total, createOrder, onBackToMenu }) {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }

    if (!tableNumber.trim()) {
      alert('Por favor ingresa el número de mesa');
      return;
    }

    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setIsSubmitting(true);

    const success = await createOrder(customerName, tableNumber, notes);

    if (success) {
      setCustomerName('');
      setTableNumber('');
      setNotes('');
    }

    setIsSubmitting(false);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-gray-300 text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 mb-6">
          Agrega productos del menú para comenzar tu orden
        </p>
        <button
          onClick={onBackToMenu}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-all"
        >
          <ArrowLeft size={20} />
          <span>Ver Menú</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <ShoppingCart size={28} />
              <span>Carrito de Compras</span>
            </h2>
            <button
              onClick={onBackToMenu}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-1"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Volver al Menú</span>
            </button>
          </div>

          <div className="space-y-3">
            {cart.map(item => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="bg-white hover:bg-red-50 text-red-500 border border-red-500 p-2 rounded-md transition-all"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-bold text-lg w-8 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-all"
                  >
                    <Plus size={16} />
                  </button>

                  <div className="w-20 text-right font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 p-2 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-700">
                Total:
              </span>
              <span className="text-3xl font-bold text-red-500">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📋 Datos de la Orden
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            {/* Table Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Mesa *
              </label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                placeholder="Ej: 5"
                min="1"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Especiales
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                placeholder="Ej: Sin cebolla, extra salsa..."
                rows="3"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-500">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Realizar Pedido</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            * Campos obligatorios
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartView;
