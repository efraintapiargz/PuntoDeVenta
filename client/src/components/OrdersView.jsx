import { useState } from 'react';
import { Clock, Users, DollarSign, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';

function OrdersView({ orders, updateOrderStatus, deleteOrder, refreshOrders }) {
  const [filterStatus, setFilterStatus] = useState('all');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    preparing: 'bg-blue-100 text-blue-800 border-blue-300',
    ready: 'bg-green-100 text-green-800 border-green-300',
    delivered: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const statusIcons = {
    pending: '⏳',
    preparing: '👨‍🍳',
    ready: '✅',
    delivered: '📦'
  };

  const statusLabels = {
    pending: 'Pendiente',
    preparing: 'En Preparación',
    ready: 'Listo',
    delivered: 'Entregado'
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'delivered'
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? statusLabels[nextStatus] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Dashboard de Órdenes
            </h2>
            <p className="text-gray-600">
              Gestiona y actualiza el estado de los pedidos
            </p>
          </div>

          <button
            onClick={refreshOrders}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all w-fit"
          >
            <RefreshCw size={20} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Preparando</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'preparing').length}
              </p>
            </div>
            <div className="text-3xl">👨‍🍳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Listos</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'ready').length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({orders.length})
          </button>
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {statusIcons[status]} {label} ({orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-300 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay órdenes
          </h3>
          <p className="text-gray-600">
            {filterStatus === 'all'
              ? 'Aún no se han creado órdenes'
              : `No hay órdenes con estado: ${statusLabels[filterStatus]}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map(order => (
            <div
              key={order.orderId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">
                      Orden #{order.orderId}
                    </h3>
                    <p className="text-sm opacity-90 flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatDate(order.timestamp)}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[order.status]}`}>
                    {statusIcons[order.status]} {statusLabels[order.status]}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Users size={16} />
                      <span>Cliente</span>
                    </p>
                    <p className="font-semibold text-gray-900">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mesa</p>
                    <p className="font-semibold text-gray-900">
                      Mesa #{order.tableNumber}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                      📝 Notas:
                    </p>
                    <p className="text-sm text-yellow-800">{order.notes}</p>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-700 flex items-center space-x-1">
                    <DollarSign size={20} />
                    <span>Total:</span>
                  </span>
                  <span className="text-2xl font-bold text-red-500">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {order.status !== 'delivered' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, getNextStatus(order.status))}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm">
                        {getNextStatusLabel(order.status)}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteOrder(order.orderId)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersView;
