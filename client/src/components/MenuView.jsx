import { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

function MenuView({ products, cart, addToCart, onGoToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Bebidas', 'Comidas', 'Postres'];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getProductQuantityInCart = (productId) => {
    const item = cart.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🍽️ Menú del Restaurante
        </h2>
        <p className="text-gray-600">
          Selecciona los productos que deseas ordenar
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? '🍴 Todos' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(product => {
          const quantityInCart = getProductQuantityInCart(product.id);
          
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Emoji Icon */}
              <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-6xl">
                  {product.emoji || '🍽️'}
                </div>
                <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="text-xs font-semibold text-gray-600">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-red-500 mb-4">
                  ${product.price.toFixed(2)}
                </p>

                {/* Add to Cart Button */}
                {quantityInCart === 0 ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all"
                  >
                    <Plus size={20} />
                    <span>Agregar</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-red-50 rounded-lg p-2">
                    <span className="text-sm font-semibold text-gray-700">
                      En carrito:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-md">
                        {quantityInCart}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay productos en esta categoría
          </h3>
          <p className="text-gray-600">
            Prueba seleccionando otra categoría
          </p>
        </div>
      )}

      {/* Floating Cart Button (Mobile) */}
      {cart.length > 0 && (
        <button
          onClick={onGoToCart}
          className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg lg:hidden z-40 flex items-center space-x-2"
        >
          <ShoppingBag size={24} />
          <span className="font-bold">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </button>
      )}
    </div>
  );
}

export default MenuView;
