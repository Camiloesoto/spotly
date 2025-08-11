# 🍽️ Spotly - Plataforma de Reservas Gastronómicas

Spotly es una plataforma integral que revoluciona la forma en que las personas descubren, reservan y disfrutan de experiencias gastronómicas, sociales y de entretenimiento en su ciudad.

## 🚀 Características Principales

### Para Usuarios
- **Búsqueda Inteligente**: Filtros por tipo de comida, ambiente, ubicación, precio y disponibilidad
- **Reservas Directas**: Reserva sin llamadas o WhatsApp, directamente desde la app
- **Pre-ordenes**: Ordena antes de llegar para optimizar tu tiempo
- **Reseñas Verificadas**: Sistema de calificaciones y comentarios confiables
- **Planes Grupales**: Crea reservas grupales e invita amigos
- **Favoritos**: Guarda tus lugares preferidos
- **Notificaciones**: Alertas sobre reservas y promociones

### Para Establecimientos
- **Panel Administrativo**: Gestión completa de reservas y menús
- **Calendario Visual**: Vista clara de todas las reservas
- **Gestión de Menús**: Actualiza precios y disponibilidad en tiempo real
- **Analytics**: Estadísticas detalladas de ventas y ocupación
- **Sistema QR**: Pedidos digitales para reducir trabajo manual

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **PostgreSQL** con PostGIS para geolocalización
- **JWT** para autenticación
- **bcryptjs** para encriptación
- **express-validator** para validaciones
- **Socket.io** para tiempo real

### Frontend (Próximamente)
- **React Native** para app móvil
- **React.js** para panel administrativo
- **TypeScript** para type safety

## 📁 Estructura del Proyecto

```
spotly/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   ├── lugaresController.js # Controlador de lugares
│   │   └── reservasController.js # Controlador de reservas
│   ├── middleware/
│   │   ├── auth.js             # Middleware de autenticación
│   │   └── validation.js       # Validaciones de entrada
│   ├── models/
│   │   ├── Usuario.js          # Modelo de usuario
│   │   ├── Lugar.js            # Modelo de lugar
│   │   └── Reserva.js          # Modelo de reserva
│   ├── routes/
│   │   ├── auth.js             # Rutas de autenticación
│   │   ├── lugares.js          # Rutas de lugares
│   │   └── reservas.js         # Rutas de reservas
│   ├── scripts/
│   │   └── migrate.js          # Script de migración de BD
│   ├── index.js                # Servidor principal
│   ├── package.json            # Dependencias
│   └── env.example             # Variables de entorno
└── README.md                   # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/spotly.git
cd spotly
```

### 2. Configurar la base de datos
```bash
# Crear base de datos en PostgreSQL
createdb spotly

# Instalar extensión PostGIS (opcional, para geolocalización)
psql -d spotly -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### 3. Configurar variables de entorno
```bash
cd backend
cp env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Base de Datos
DB_USER=postgres
DB_HOST=localhost
DB_NAME=spotly
DB_PASSWORD=tu_contraseña
DB_PORT=5432

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Ejecutar migración de base de datos
```bash
npm run migrate
```

### 6. Iniciar el servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil
- `PUT /api/auth/perfil` - Actualizar perfil
- `PUT /api/auth/cambiar-contraseña` - Cambiar contraseña

### Lugares
- `GET /api/lugares` - Buscar lugares con filtros
- `GET /api/lugares/cercanos` - Buscar lugares cercanos
- `GET /api/lugares/:id` - Obtener lugar específico
- `GET /api/lugares/:id/disponibilidad` - Verificar disponibilidad
- `GET /api/lugares/:id/menu` - Obtener menú
- `GET /api/lugares/:id/resenas` - Obtener reseñas
- `POST /api/lugares` - Crear lugar (propietarios)
- `PUT /api/lugares/:id` - Actualizar lugar (propietarios)

### Reservas
- `POST /api/reservas` - Crear reserva
- `POST /api/reservas/grupal` - Crear reserva grupal
- `GET /api/reservas/usuario` - Obtener reservas del usuario
- `GET /api/reservas/:id` - Obtener reserva específica
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Cancelar reserva

## 🗄️ Base de Datos

### Tablas Principales
- **usuarios**: Información de usuarios
- **lugares**: Restaurantes, bares, cafés
- **reservas**: Reservas de usuarios
- **menu_items**: Items del menú de cada lugar
- **resenas**: Reseñas y calificaciones
- **favoritos**: Lugares favoritos de usuarios
- **notificaciones**: Sistema de notificaciones

### Índices Optimizados
- Búsqueda por email de usuarios
- Búsqueda por tipo de lugar
- Búsqueda geográfica con PostGIS
- Índices en fechas de reservas
- Índices en relaciones usuario-lugar

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor en modo desarrollo
npm start           # Iniciar servidor en producción

# Base de datos
npm run migrate     # Ejecutar migración de BD

# Testing (próximamente)
npm test           # Ejecutar tests
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

## 📱 Próximas Funcionalidades

### App Móvil (React Native)
- [ ] Interfaz de usuario nativa
- [ ] Geolocalización en tiempo real
- [ ] Notificaciones push
- [ ] Pago in-app
- [ ] Escaneo QR para pedidos

### Panel Administrativo (React.js)
- [ ] Dashboard con analytics
- [ ] Gestión de reservas
- [ ] Editor de menús
- [ ] Gestión de horarios
- [ ] Sistema de notificaciones

### Funcionalidades Avanzadas
- [ ] IA para recomendaciones
- [ ] Integración con redes sociales
- [ ] Sistema de fidelización
- [ ] Eventos y experiencias
- [ ] Delivery integrado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseñador UX/UI**: [Nombre del Diseñador]
- **Product Manager**: [Nombre del PM]

## 📞 Contacto

- Email: contacto@spotly.com
- Website: https://spotly.com
- LinkedIn: [Tu LinkedIn]

## 🙏 Agradecimientos

- Comunidad de desarrolladores de Node.js
- Equipo de PostgreSQL y PostGIS
- Todos los beta testers que han contribuido con feedback

---

**Spotly** - Revolucionando la experiencia gastronómica digital 🍽️✨ 