# 🍽️ **Spotly** - Plataforma de Experiencias Gastronómicas

## 📖 **¿Qué es Spotly?**

**Spotly** es una plataforma móvil que revoluciona la forma en que descubres, reservas y disfrutas de experiencias gastronómicas, sociales y de entretenimiento. Nacida de la visión de crear una aplicación que conecte a las personas con los mejores lugares de su ciudad.

### 🎯 **Visión del Proyecto**
Crear una plataforma integral que no solo permita a los usuarios descubrir lugares increíbles, sino que también proporcione a los establecimientos las herramientas necesarias para gestionar su negocio de manera eficiente y digital.

---

## ✨ **¿Para qué sirve?**

### 👥 **Para Usuarios:**
- **🔍 Descubrimiento Inteligente**: Encuentra restaurantes, bares, cafés y clubs basado en tus preferencias
- **📅 Reservas Directas**: Reserva mesas sin llamadas ni esperas
- **🍽️ Pre-ordenado**: Ordena tu comida antes de llegar
- **⭐ Reseñas Verificadas**: Lee y escribe reseñas auténticas
- **👥 Planes Sociales**: Organiza salidas con amigos y familia
- **💝 Favoritos**: Guarda tus lugares preferidos
- **📍 Geolocalización**: Descubre lugares cercanos a ti
- **🔔 Notificaciones**: Recibe ofertas y recordatorios personalizados

### 🏪 **Para Establecimientos:**
- **📊 Panel Administrativo**: Gestiona reservas, menús y estadísticas en tiempo real
- **📱 Menús Digitales**: Actualiza precios y disponibilidad al instante
- **📈 Analytics Avanzados**: Conoce tu negocio con métricas detalladas
- **🎯 Gestión de Clientes**: Sistema de fidelización y comunicación
- **💳 Pagos Integrados**: Acepta pagos digitales sin complicaciones

---

## 🚀 **Funcionalidades Principales**

### **MVP (Versión Actual):**
- ✅ **Sistema de Usuarios**: Registro, login y perfiles
- ✅ **Gestión de Lugares**: CRUD completo de establecimientos
- ✅ **Sistema de Reservas**: Creación y gestión de reservas
- ✅ **Panel Administrativo**: Dashboard para administradores
- ✅ **API REST**: Backend completo con autenticación JWT
- ✅ **Aplicación Móvil**: React Native con soporte web

### **Próximas Funcionalidades:**
- 🔄 **Pre-ordenado**: Sistema de pedidos anticipados
- 🤖 **IA y Recomendaciones**: Sugerencias personalizadas
- 📱 **QR y Tablets**: Ordenamiento digital en establecimientos
- 🎮 **Sistema de Fidelización**: Gamificación y recompensas
- 📊 **Analytics Avanzados**: Gráficos y métricas detalladas
- 🌍 **Integraciones**: Delivery, movilidad, pagos digitales

---

## 🛠️ **Tecnologías Utilizadas**

### **Backend:**
- **Node.js** + **Express.js** - Servidor API REST
- **PostgreSQL** - Base de datos principal
- **JWT** - Autenticación segura
- **bcryptjs** - Encriptación de contraseñas
- **Socket.io** - Comunicación en tiempo real (próximamente)

### **Frontend Móvil:**
- **React Native** + **Expo** - Aplicación móvil multiplataforma
- **TypeScript** - Tipado estático para mayor calidad
- **React Navigation** - Navegación entre pantallas
- **Context API** - Gestión de estado global

### **Panel Administrativo:**
- **React.js** + **Vite** - Aplicación web rápida
- **Tailwind CSS** - Framework de estilos moderno
- **TypeScript** - Desarrollo robusto y mantenible

### **Herramientas de Desarrollo:**
- **Git** + **GitHub** - Control de versiones
- **GitHub Actions** - CI/CD automatizado
- **npm** - Gestión de dependencias

---

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Admin Panel    │    │   Backend API   │
│  (React Native) │◄──►│   (React.js)    │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Frontend      │    │   PostgreSQL    │
                       │   (Web)         │    │   Database      │
                       └─────────────────┘    └─────────────────┘
```

---

## 🚀 **Instalación y Configuración**

### **Requisitos Previos:**
- Node.js 18+ 
- PostgreSQL 12+
- Git

### **1. Clonar el Repositorio:**
```bash
git clone https://github.com/Camiloesoto/spotly.git
cd spotly
```

### **2. Configurar Base de Datos:**
```bash
# Crear base de datos
createdb spotly

# Configurar variables de entorno
cd backend
copy env.example .env
# Editar .env con tus credenciales
```

### **3. Instalar Dependencias:**
```bash
# Backend
cd backend
npm install

# Aplicación Móvil
cd ../mobile
npm install

# Panel Administrativo
cd ../spotly-admin
npm install
```

### **4. Ejecutar Migraciones:**
```bash
cd backend
npm run migrate
```

### **5. Iniciar Servicios:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Aplicación Móvil
cd mobile
npm run web

# Terminal 3 - Panel Administrativo
cd spotly-admin
npm run dev
```

---

## 📱 **Cómo Usar la Plataforma**

### **Para Usuarios:**
1. **Descarga la app** desde tu tienda de aplicaciones
2. **Crea tu cuenta** con email y contraseña
3. **Explora lugares** cercanos o busca por tipo
4. **Haz reservas** en tus lugares favoritos
5. **Comparte experiencias** con reseñas y fotos

### **Para Administradores:**
1. **Accede al panel** web con credenciales de admin
2. **Gestiona lugares** - agregar, editar, verificar
3. **Revisa reservas** y estadísticas
4. **Modera contenido** y usuarios
5. **Configura el sistema** según necesidades

---

## 🔐 **Credenciales de Prueba**

### **Usuario Admin:**
- **Email:** admin@spotly.com
- **Contraseña:** admin123

### **Usuario Regular:**
- **Email:** usuario@spotly.com  
- **Contraseña:** usuario123

---

## 📊 **Estado del Proyecto**

### **✅ Completado (MVP):**
- [x] Sistema de autenticación completo
- [x] CRUD de lugares y usuarios
- [x] Sistema de reservas básico
- [x] Panel administrativo funcional
- [x] API REST documentada
- [x] Aplicación móvil responsive

### **🔄 En Desarrollo:**
- [ ] Sistema de pre-ordenado
- [ ] Notificaciones push
- [ ] Geolocalización avanzada
- [ ] Analytics detallados

### **📋 Próximamente:**
- [ ] Integración con redes sociales
- [ ] Sistema de pagos
- [ ] IA para recomendaciones
- [ ] Aplicación para establecimientos

---

## 🤝 **Contribuir al Proyecto**

Este es un proyecto personal, pero si quieres contribuir:

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Commit** tus cambios
4. **Push** a la rama
5. **Abre** un Pull Request

---

## 📞 **Contacto**

- **Desarrollador:** Camilo Soto
- **Email:** camiloesoto@gmail.com
- **GitHub:** [@Camiloesoto](https://github.com/Camiloesoto)
- **Proyecto:** [Spotly](https://github.com/Camiloesoto/spotly)

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 **Agradecimientos**

Gracias a toda la comunidad de desarrolladores que ha contribuido con librerías y herramientas que hacen posible este proyecto. Especialmente a:

- **React Native** y **Expo** por la plataforma móvil
- **Node.js** y **Express** por el backend robusto
- **PostgreSQL** por la base de datos confiable
- **Tailwind CSS** por los estilos modernos

---

**⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!**

---

*Desarrollado con ❤️ por Camilo Soto* 