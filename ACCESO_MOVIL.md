# 📱 GUÍA DE ACCESO MÓVIL - SISTEMA POS RESTAURANTE

## 🎯 CONFIGURACIÓN INICIAL (PRIMERA VEZ)

### 1. Obtener tu IP local
```powershell
# En Windows PowerShell
ipconfig | findstr "IPv4"
```
```bash
# En Linux/Mac
ip addr show | grep "inet "
# o
ifconfig | grep "inet "
```

### 2. Configurar la IP en el cliente
```powershell
# Navegar al directorio del cliente
cd client

# Editar el archivo de configuración (si existe config.js)
# O buscar en src/main.jsx o src/App.jsx la configuración del WebSocket
# Cambiar la IP por la tuya
```

## 🚀 COMANDOS PARA INICIAR EL SISTEMA

### Opción 1: Usando los scripts NPM (Recomendado)
```powershell
# 1. Iniciar el backend (desde la raíz del proyecto)
npm start

# 2. En otra terminal, iniciar el frontend con acceso de red
cd client
npm run dev -- --host
```

### Opción 2: Comandos directos
```powershell
# 1. Backend
node server.js

# 2. Frontend con acceso de red (en otra terminal)
cd client
npx vite --host
```

## 🌐 SERVIDORES ACTIVOS

### Backend API + WebSockets
- **Puerto**: 3001
- **URL Local**: http://localhost:3001
- **URL Red Local**: http://[TU_IP]:3001
- **Estado**: ✅ Activo con WebSockets en tiempo real

### Frontend React
- **Puerto**: 5173
- **URL Local**: http://localhost:5173
- **URL Red Local**: http://[TU_IP]:5173
- **Estado**: ✅ Activo con acceso a red habilitado

## 📲 INSTRUCCIONES PARA CELULAR (MESERO)

### 1. Conectar a la misma WiFi
```
Asegúrate de que tu celular esté conectado 
a la misma red WiFi que tu computadora
```

### 2. Abrir en el navegador móvil
```
http://[TU_IP]:5173

Ejemplo:
http://192.168.1.100:5173
http://192.168.0.105:5173
http://10.0.0.50:5173
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
# Desde la raíz del proyecto
npm start
```

### Iniciar Frontend
```powershell
# Desde la carpeta client
cd client
npm run dev -- --host
```

## 📝 GUÍA PASO A PASO PARA NUEVOS USUARIOS

### 1. Clonar el repositorio
```bash
git clone https://github.com/efraintapiargz/PuntoDeVenta.git
cd PuntoDeVenta
```

### 2. Instalar dependencias
```powershell
# Dependencias del backend (raíz)
npm install

# Dependencias del frontend
cd client
npm install
cd ..
```

### 3. Obtener tu IP local
```powershell
# Windows
ipconfig

# Buscar tu IP en "Adaptador de LAN inalámbrica Wi-Fi" 
# o "Adaptador Ethernet" bajo "Dirección IPv4"
```

### 4. Iniciar servidores
```powershell
# Terminal 1: Backend
npm start

# Terminal 2: Frontend (en otra ventana)
cd client
npm run dev -- --host
```

### 5. Probar acceso
- **Computadora**: http://localhost:5173
- **Celular**: http://[TU_IP]:5173

## 🌐 ARQUITECTURA DE RED

```
📱 CELULAR (Mesero)           💻 COMPUTADORA (Admin)
     |                              |
     |                              |
     └──── WiFi Red Local ──────────┘
               |
        [TU_IP]:5173 (Frontend)
        [TU_IP]:3001 (Backend + WebSockets)
```

## 🔍 IDENTIFICAR TU IP

### Windows
```powershell
ipconfig
# Buscar "Dirección IPv4" en tu adaptador de red activo
```

### Linux/Mac
```bash
ip addr show
# o
ifconfig
# Buscar tu interfaz de red (wlan0, eth0, etc.)
```

### Ejemplos comunes de IP:
- `192.168.1.xxx` (routers domésticos)
- `192.168.0.xxx` (routers domésticos)
- `10.0.0.xxx` (redes corporativas)
- `172.16.x.xxx` (redes privadas)

## ✨ CARACTERÍSTICAS

- 🔄 **Tiempo Real**: WebSockets para sincronización instantánea
- 📱 **Mobile First**: Interfaz optimizada para dispositivos móviles
- 🍽️ **Productos**: 10 productos con emojis (bebidas, comidas, postres)
- 🛒 **Carrito**: Agregado/eliminación de productos
- 📋 **Órdenes**: Estados (pendiente, preparando, listo, entregado)
- 🎨 **Responsive**: Tailwind CSS para diseño adaptativo

## 🔧 SOLUCIÓN DE PROBLEMAS

### Si no puedes acceder desde el celular:
1. **Verificar WiFi**: Ambos dispositivos en la misma red
2. **Verificar IP**: Usa `ipconfig` para obtener la IP correcta
3. **Firewall**: Desactiva temporalmente el firewall de Windows
4. **Puerto bloqueado**: Verifica que el puerto 5173 esté disponible
5. **Reiniciar servidores**: Para y vuelve a iniciar ambos servidores

### Si no se sincroniza en tiempo real:
1. **Backend activo**: Revisa que el backend esté corriendo en puerto 3001
2. **WebSockets**: Verifica la conexión (icono de WiFi en la interfaz)
3. **Configuración IP**: Asegúrate de que el cliente use tu IP correcta
4. **Recarga**: Recarga la página en ambos dispositivos

### Comandos útiles para debug:
```powershell
# Verificar puertos en uso
netstat -an | findstr "5173\|3001"

# Ver tu IP detallada
ipconfig /all

# Reiniciar servicios de red (si es necesario)
ipconfig /release
ipconfig /renew
```

## ⚡ RESUMEN RÁPIDO

Para cualquier persona que clone el repo:

1. **Instalar**: `npm install` (raíz) y `npm install` (client)
2. **IP**: `ipconfig` para obtener tu IP
3. **Iniciar**: `npm start` (backend) + `cd client && npm run dev -- --host` (frontend)
4. **Acceder**: Celular → `http://[TU_IP]:5173`

¡Tu sistema POS está listo para funcionar como mesero desde el celular! 🎉