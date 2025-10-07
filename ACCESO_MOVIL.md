# 📱 GUÍA DE ACCESO MÓVIL - SISTEMA POS RESTAURANTE

## 🚀 SERVIDORES ACTIVOS

### Backend API + WebSockets
- **Puerto**: 3001
- **URL Local**: http://localhost:3001
- **URL Red Local**: http://192.168.100.9:3001
- **Estado**: ✅ Activo con WebSockets en tiempo real

### Frontend React
- **Puerto**: 5173
- **URL Local**: http://localhost:5173
- **URL Red Local**: http://192.168.100.9:5173
- **Estado**: ✅ Activo con acceso a red habilitado

## 📲 INSTRUCCIONES PARA CELULAR (MESERO)

### 1. Conectar a la misma WiFi
```
Asegúrate de que tu celular esté conectado 
a la misma red WiFi que tu computadora
```

### 2. Abrir en el navegador móvil
```
http://192.168.100.9:5173
```

### 3. ¡Listo para usar!
- ✅ **Menú**: Ver productos disponibles
- ✅ **Carrito**: Agregar productos y crear órdenes
- ✅ **Órdenes**: Ver estado en tiempo real
- ✅ **Tiempo Real**: Los cambios se sincronizan automáticamente

## 💻 ACCESO DESDE COMPUTADORA (ADMINISTRADOR)

### URL Local
```
http://localhost:5173
```

### Funciones disponibles
- ✅ **Dashboard completo**: Menú, carrito, órdenes
- ✅ **Gestión de órdenes**: Actualizar estados, eliminar
- ✅ **Tiempo real**: Ver órdenes del mesero instantáneamente

## 🔄 SINCRONIZACIÓN EN TIEMPO REAL

### Eventos WebSocket
- 📡 **Nueva orden**: El mesero crea una orden → Se ve inmediatamente en la computadora
- 📡 **Estado actualizado**: La cocina cambia el estado → Se actualiza en el celular del mesero
- 📡 **Orden eliminada**: Se elimina una orden → Se sincroniza en todos los dispositivos

## 🛠️ COMANDOS DE DESARROLLO

### Iniciar Backend
```powershell
cd "c:\Users\Efrain PC\Desktop\punto de venta"
npm start
```

### Iniciar Frontend
```powershell
cd "c:\Users\Efrain PC\Desktop\punto de venta\client"
npm run dev -- --host
```

## 🌐 ARQUITECTURA DE RED

```
📱 CELULAR (Mesero)           💻 COMPUTADORA (Admin)
     |                              |
     |                              |
     └──── WiFi Red Local ──────────┘
               |
        192.168.100.9:5173 (Frontend)
        192.168.100.9:3001 (Backend + WebSockets)
```

## ✨ CARACTERÍSTICAS

- 🔄 **Tiempo Real**: WebSockets para sincronización instantánea
- 📱 **Mobile First**: Interfaz optimizada para dispositivos móviles
- 🍽️ **Productos**: 10 productos con emojis (bebidas, comidas, postres)
- 🛒 **Carrito**: Agregado/eliminación de productos
- 📋 **Órdenes**: Estados (pendiente, preparando, listo, entregado)
- 🎨 **Responsive**: Tailwind CSS para diseño adaptativo

## 🔧 SOLUCIÓN DE PROBLEMAS

### Si no puedes acceder desde el celular:
1. Verifica que estés en la misma WiFi
2. Desactiva temporalmente el firewall
3. Usa `ipconfig` para verificar la IP correcta
4. Reinicia los servidores si es necesario

### Si no se sincroniza en tiempo real:
1. Revisa que el backend esté corriendo en puerto 3001
2. Verifica que WebSockets esté conectado (icono de WiFi en la interfaz)
3. Recarga la página en ambos dispositivos

¡Tu sistema POS está listo para funcionar como mesero desde el celular! 🎉