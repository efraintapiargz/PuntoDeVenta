# 🚀 Guía Rápida - Sistema POS Restaurante

## ⚡ Inicio Rápido

### 1️⃣ Iniciar el Backend (API)
```powershell
# En la raíz del proyecto
npm start
```
✅ Servidor corriendo en: http://localhost:3000

### 2️⃣ Iniciar el Frontend
```powershell
# Abrir una nueva terminal
cd client
npm run dev
```
✅ Aplicación corriendo en: http://localhost:5173

### 3️⃣ Usar la Aplicación
Abre tu navegador en: **http://localhost:5173**

---

## 📱 Características Principales

### Vista de Menú (Cliente)
- ✅ 10 productos disponibles
- ✅ 3 categorías: Bebidas, Comidas, Postres
- ✅ Agregar productos al carrito
- ✅ Ver cantidad en carrito en tiempo real

### Carrito de Compras
- ✅ Ver todos los items seleccionados
- ✅ Modificar cantidades (+/-)
- ✅ Eliminar items
- ✅ Ver total calculado automáticamente
- ✅ Completar formulario de pedido
- ✅ Crear orden

### Dashboard de Órdenes (Personal)
- ✅ Ver todas las órdenes activas
- ✅ Estadísticas en tiempo real
- ✅ Filtrar por estado
- ✅ Actualizar estado de órdenes
- ✅ Eliminar órdenes

---

## 🔄 Estados de Órdenes

```
⏳ Pendiente 
    ↓
👨‍🍳 En Preparación
    ↓
✅ Listo
    ↓
📦 Entregado
```

---

## 🎯 Flujo de Trabajo

### Rol: Cliente
1. Ver menú → Seleccionar productos → Agregar al carrito
2. Ir al carrito → Completar formulario
3. Enviar pedido → ¡Orden creada!

### Rol: Personal
1. Ver Dashboard de Órdenes
2. Actualizar estados según avance
3. Marcar como entregada cuando termine

---

## 🔧 Solución de Problemas

### ❌ "Error al conectar con el servidor"
**Solución**: Verifica que el backend esté corriendo en puerto 3000
```powershell
npm start
```

### ❌ "Cannot GET /api/products"
**Solución**: El backend no está iniciado. Ejecuta `npm start` en la raíz

### ❌ Página en blanco en el frontend
**Solución**: 
1. Verifica que ambos servidores estén corriendo
2. Limpia caché del navegador (Ctrl + Shift + R)
3. Revisa la consola del navegador (F12)

---

## 📊 Productos Disponibles

| Categoría | Productos | Precio |
|-----------|-----------|--------|
| 🥤 Bebidas | Coca Cola | $2.50 |
| 🥤 Bebidas | Agua Mineral | $1.50 |
| 🥤 Bebidas | Jugo de Naranja | $3.00 |
| 🍔 Comidas | Hamburguesa Clásica | $8.50 |
| 🍕 Comidas | Pizza Margarita | $12.00 |
| 🥗 Comidas | Ensalada César | $7.00 |
| 🍝 Comidas | Pasta Carbonara | $10.50 |
| 🍰 Postres | Tiramisú | $5.50 |
| 🍰 Postres | Cheesecake | $6.00 |
| 🍨 Postres | Helado de Vainilla | $4.00 |

---

## 🔑 Comandos Útiles

```powershell
# Backend
npm start              # Iniciar API
npm run dev           # Modo desarrollo (con nodemon)

# Frontend
cd client
npm run dev           # Iniciar desarrollo
npm run build         # Construir para producción
npm run preview       # Preview de producción

# Ambos
npm install           # Instalar dependencias
```

---

## 🎨 Atajos de Teclado

En el Frontend:
- **Navegación superior**: Alterna entre Menú, Carrito y Órdenes
- **F5**: Recargar página
- **F12**: Abrir herramientas de desarrollo

---

## 📝 Tips de Uso

💡 **Tip 1**: Usa el filtro de categorías para encontrar productos más rápido

💡 **Tip 2**: El carrito muestra un badge con la cantidad total de items

💡 **Tip 3**: En el dashboard, los colores indican el estado de cada orden:
   - 🟡 Amarillo = Pendiente
   - 🔵 Azul = En preparación
   - 🟢 Verde = Listo
   - ⚫ Gris = Entregado

💡 **Tip 4**: Puedes eliminar órdenes canceladas con el botón rojo

💡 **Tip 5**: El botón "Actualizar" recarga las órdenes desde el servidor

---

## 📱 Responsive

El sistema funciona en cualquier dispositivo:
- 📱 **Móvil**: Diseño optimizado con botón flotante de carrito
- 📱 **Tablet**: Grid adaptativo de 2-3 columnas
- 💻 **Desktop**: Grid completo de 4 columnas + layouts amplios

---

## ✅ Checklist de Inicio

- [ ] Backend instalado (`npm install` en raíz)
- [ ] Frontend instalado (`npm install` en client/)
- [ ] Backend corriendo (puerto 3000)
- [ ] Frontend corriendo (puerto 5173)
- [ ] Navegador abierto en http://localhost:5173
- [ ] ¡Todo funcionando! 🎉

---

## 🆘 Ayuda Adicional

📖 **Documentación completa**: Ver `README.md`

📧 **Soporte**: Revisa los logs en las terminales del backend y frontend

🐛 **Debugging**: Abre las herramientas de desarrollo (F12) en el navegador

---

**¡Disfruta tu Sistema POS! 🍔🎉**
