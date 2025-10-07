# 🍔 Sistema POS Restaurante - Full Stack

Sistema completo de punto de venta para restaurante con API REST (backend) e interfaz web responsive (frontend).

## 🚀 Características del Sistema Completo

### Backend (API REST)
- ✅ CRUD completo para órdenes
- ✅ Catálogo de productos
- ✅ Almacenamiento en memoria
- ✅ CORS habilitado
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Códigos HTTP apropiados
- ✅ Logging detallado

### Frontend (React + Tailwind)
- ✅ Interfaz responsive (móvil y desktop)
- ✅ Vista de menú con filtros por categoría
- ✅ Carrito de compras interactivo
- ✅ Dashboard de órdenes para personal
- ✅ Actualización de estados en tiempo real
- ✅ Formularios con validación
- ✅ Diseño moderno y profesional

## 📦 Instalación

### Backend (API)

```bash
# Instalar dependencias del backend
npm install

# Iniciar servidor API (puerto 3000)
npm start
```

### Frontend (Cliente)

```bash
# Ir a la carpeta del frontend
cd client

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm run dev
```

## 🌐 URLs de Acceso

- **API Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

**Importante**: Debes mantener ambos servidores corriendo simultáneamente para que el sistema funcione correctamente.

## 🌐 Endpoints

### Productos

#### GET /api/products
Obtiene el catálogo completo de productos.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "Coca Cola",
      "price": 2.50,
      "category": "Bebidas",
      "image": "url..."
    }
  ]
}
```

### Órdenes

#### POST /api/orders
Crea una nueva orden.

**Body:**
```json
{
  "customerName": "Juan Pérez",
  "tableNumber": 5,
  "items": [
    {
      "productId": 4,
      "name": "Hamburguesa Clásica",
      "price": 8.50,
      "quantity": 2
    }
  ],
  "total": 17.00,
  "notes": "Sin cebolla"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "orderId": 1,
    "status": "pending",
    "timestamp": "2025-10-07T12:00:00.000Z"
  }
}
```

#### GET /api/orders
Lista todas las órdenes. Opcionalmente filtra por status.

**Query params opcionales:**
- `?status=pending` - Filtra por estado

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "orderId": 1,
      "customerName": "Juan Pérez",
      "tableNumber": 5,
      "items": [...],
      "total": 17.00,
      "notes": "Sin cebolla",
      "status": "pending",
      "timestamp": "2025-10-07T12:00:00.000Z"
    }
  ]
}
```

#### GET /api/orders/:id
Obtiene una orden específica por ID.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "customerName": "Juan Pérez",
    ...
  }
}
```

#### PUT /api/orders/:id
Actualiza el estado de una orden.

**Body:**
```json
{
  "status": "preparing"
}
```

**Estados válidos:**
- `pending` - Pendiente
- `preparing` - En preparación
- `ready` - Lista
- `delivered` - Entregada

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Orden actualizada exitosamente",
  "data": {
    "orderId": 1,
    "status": "preparing",
    ...
  }
}
```

#### DELETE /api/orders/:id
Elimina/cancela una orden.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Orden #1 eliminada exitosamente",
  "data": {...}
}
```

## 📝 Códigos de Estado HTTP

- `200` - OK (operación exitosa)
- `201` - Created (orden creada)
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

## 🧪 Ejemplos de Uso con cURL

```bash
# Obtener productos
curl http://localhost:3000/api/products

# Crear una orden
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "María García",
    "tableNumber": 3,
    "items": [
      {"productId": 4, "name": "Hamburguesa Clásica", "price": 8.50, "quantity": 1},
      {"productId": 1, "name": "Coca Cola", "price": 2.50, "quantity": 2}
    ],
    "total": 13.50,
    "notes": "Para llevar"
  }'

# Obtener todas las órdenes
curl http://localhost:3000/api/orders

# Filtrar órdenes por status
curl http://localhost:3000/api/orders?status=pending

# Actualizar estado de orden
curl -X PUT http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'

# Eliminar orden
curl -X DELETE http://localhost:3000/api/orders/1
```

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- CORS
- Almacenamiento en memoria (arrays)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (iconos)

## 📋 Productos Incluidos

**Bebidas:**
- Coca Cola - $2.50
- Agua Mineral - $1.50
- Jugo de Naranja - $3.00

**Comidas:**
- Hamburguesa Clásica - $8.50
- Pizza Margarita - $12.00
- Ensalada César - $7.00
- Pasta Carbonara - $10.50

**Postres:**
- Tiramisú - $5.50
- Cheesecake - $6.00
- Helado de Vainilla - $4.00

## 🔧 Estructura del Proyecto

```
punto-de-venta/
├── server.js              # Servidor API REST (Backend)
├── package.json           # Dependencias backend
├── README.md             # Documentación principal
├── .gitignore
└── client/               # Frontend React
    ├── src/
    │   ├── App.jsx           # Componente principal
    │   ├── main.jsx          # Punto de entrada
    │   ├── index.css         # Estilos globales
    │   └── components/
    │       ├── MenuView.jsx      # Vista del menú
    │       ├── CartView.jsx      # Carrito de compras
    │       └── OrdersView.jsx    # Dashboard de órdenes
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 📞 Soporte

### Probar el Backend
Para probar la API se recomienda usar:
- Postman
- Insomnia
- Thunder Client (extensión de VS Code)
- cURL

### Usar el Frontend
1. Asegúrate de que el backend esté corriendo (puerto 3000)
2. Inicia el frontend (puerto 5173)
3. Abre http://localhost:5173 en tu navegador
4. ¡Comienza a crear órdenes!

## 🎯 Flujo Completo de Uso

### Como Cliente:
1. Abre el frontend en http://localhost:5173
2. Navega por el menú de productos
3. Filtra por categoría si lo deseas (Bebidas, Comidas, Postres)
4. Agrega productos al carrito con el botón "+"
5. Ve al carrito (icono de carrito arriba)
6. Completa el formulario:
   - Nombre del cliente
   - Número de mesa
   - Notas especiales (opcional)
7. Haz clic en "Realizar Pedido"
8. ¡Orden creada exitosamente!

### Como Personal de Restaurante:
1. Haz clic en el botón "Órdenes" (Dashboard)
2. Ve todas las órdenes activas con sus estados
3. Usa las estadísticas para ver el resumen
4. Filtra por estado si lo necesitas
5. Actualiza el estado de las órdenes:
   - Pendiente → En Preparación → Listo → Entregado
6. Elimina órdenes canceladas si es necesario
7. Usa el botón "Actualizar" para recargar las órdenes

## 🎨 Capturas de Pantalla

### Vista del Menú
- Grid responsive con productos
- Imágenes, nombres y precios
- Botones para agregar al carrito
- Indicador de cantidad en carrito

### Carrito de Compras
- Lista completa de items
- Controles de cantidad (+/-)
- Cálculo automático de totales
- Formulario de pedido

### Dashboard de Órdenes
- Tarjetas con información completa
- Estados visuales con colores
- Botones de acción rápida
- Estadísticas en tiempo real

---

## 🎉 ¡Sistema Completo Listo!

✨ **Backend**: API REST corriendo en puerto 3000
✨ **Frontend**: Aplicación React corriendo en puerto 5173
✨ **Integración**: Comunicación en tiempo real entre frontend y backend

**Para comenzar:**
1. Inicia el backend: `npm start` (en la raíz del proyecto)
2. Inicia el frontend: `cd client && npm run dev`
3. Abre http://localhost:5173 en tu navegador
4. ¡Disfruta del sistema POS completo!

---

### 📱 Responsive Design
El frontend funciona perfectamente en:
- 📱 Móviles (< 640px)
- 📱 Tablets (640px - 1024px)
- 💻 Desktop (> 1024px)

### 🔒 Características de Seguridad
- Validación de datos en frontend y backend
- Manejo de errores robusto
- Códigos HTTP apropiados
- CORS configurado correctamente
